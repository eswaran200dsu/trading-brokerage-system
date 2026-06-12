import re
from flask import Blueprint, request, jsonify, g
from datetime import datetime, timezone, timedelta
import jwt
from config import Config
from db import get_db
from services.password_service import verify_password, hash_password
from middleware.auth_middleware import require_auth

auth_bp = Blueprint("auth", __name__)

_GENERIC_RESET_MSG = (
    "If the details match our records, a password reset request will be sent to admin."
)


def _make_token(client: dict) -> str:
    payload = {
        "sub": client["client_code"],
        "role": client["role"],
        "name": client["name"],
        "exp": datetime.now(timezone.utc) + timedelta(hours=Config.JWT_EXPIRY_HOURS),
    }
    return jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm="HS256")


def _validate_new_password(new_pw: str, old_pw: str = None, mobile: str = None) -> str | None:
    """Return an error message string if password fails rules, else None."""
    if len(new_pw) < 8:
        return "Password must be at least 8 characters"
    if not re.search(r"[A-Z]", new_pw):
        return "Password must contain at least one uppercase letter"
    if not re.search(r"[a-z]", new_pw):
        return "Password must contain at least one lowercase letter"
    if not re.search(r"[0-9]", new_pw):
        return "Password must contain at least one number"
    if not re.search(r"[^A-Za-z0-9]", new_pw):
        return "Password must contain at least one special character"
    if old_pw and new_pw == old_pw:
        return "New password must not be the same as the old password"
    if mobile and new_pw == mobile:
        return "Password must not be the same as your mobile number"
    return None


@auth_bp.post("/api/login")
def login():
    data = request.get_json(silent=True) or {}
    client_code = str(data.get("clientCode", "")).strip()
    password = str(data.get("password", "")).strip()

    if not client_code or not password:
        return jsonify({"error": "clientCode and password are required"}), 400

    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "SELECT client_code, name, role, mobile, pan, dob, parent_code, "
        "password_hash, status, must_change_password "
        "FROM clients WHERE client_code = %s",
        (client_code,),
    )
    client = cursor.fetchone()

    if not client or not verify_password(password, client["password_hash"]):
        return jsonify({"error": "Invalid ClientCode or password"}), 401

    if client["status"] != "active":
        return jsonify({"error": "Account is inactive. Contact admin."}), 403

    # must_change_password is informational only — frontend does NOT force redirect
    must_change = bool(client["must_change_password"])

    token = _make_token(client)
    dob = client.get("dob")
    return jsonify({
        "token": token,
        "user": {
            "clientCode": client["client_code"],
            "name": client["name"],
            "role": client["role"],
            "mobile": client["mobile"],
            "pan": client["pan"],
            "dob": str(dob) if dob else None,
            "parentCode": client["parent_code"],
            "mustChangePassword": must_change,
        },
    })


@auth_bp.post("/api/logout")
@require_auth
def logout():
    return jsonify({"ok": True})


@auth_bp.post("/api/change-password")
@require_auth
def change_password():
    data = request.get_json(silent=True) or {}
    old_pw = str(data.get("oldPassword", "")).strip()
    new_pw = str(data.get("newPassword", "")).strip()
    confirm_pw = str(data.get("confirmPassword", "")).strip()

    if not old_pw or not new_pw or not confirm_pw:
        return jsonify({"error": "All password fields are required"}), 400
    if new_pw != confirm_pw:
        return jsonify({"error": "New password and confirm password do not match"}), 400

    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "SELECT password_hash, mobile, role FROM clients WHERE client_code = %s",
        (g.current_user["sub"],),
    )
    row = cursor.fetchone()
    if not row or not verify_password(old_pw, row["password_hash"]):
        return jsonify({"error": "Old password is incorrect"}), 400

    mobile = row["mobile"] if row["role"] == "client" else None
    err = _validate_new_password(new_pw, old_pw=old_pw, mobile=mobile)
    if err:
        return jsonify({"error": err}), 400

    new_hash = hash_password(new_pw)
    cursor.execute(
        "UPDATE clients SET password_hash=%s, must_change_password=0 WHERE client_code=%s",
        (new_hash, g.current_user["sub"]),
    )
    db.commit()
    return jsonify({"ok": True})


@auth_bp.post("/api/forgot-password")
def forgot_password():
    data = request.get_json(silent=True) or {}
    client_code = str(data.get("clientCode", "")).strip()
    mobile = str(data.get("mobile", "")).strip()

    if not client_code or not mobile:
        return jsonify({"error": "clientCode and mobile are required"}), 400

    db = get_db()
    cursor = db.cursor()

    # Always return the same generic message — never reveal whether account exists
    cursor.execute(
        "SELECT id FROM clients WHERE client_code=%s AND mobile=%s AND role='client'",
        (client_code, mobile),
    )
    client_exists = cursor.fetchone()

    if client_exists:
        # Check for existing pending request
        cursor.execute(
            "SELECT id FROM password_reset_requests WHERE client_code=%s AND status='pending'",
            (client_code,),
        )
        if not cursor.fetchone():
            cursor.execute(
                "INSERT INTO password_reset_requests (client_code, mobile) VALUES (%s, %s)",
                (client_code, mobile),
            )
            db.commit()

    # Always respond the same way — do not reveal account existence
    return jsonify({"ok": True, "message": _GENERIC_RESET_MSG})
