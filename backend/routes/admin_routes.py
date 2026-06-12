import os
from datetime import date
from flask import Blueprint, request, jsonify, g
from werkzeug.utils import secure_filename
from config import Config
from db import get_db
from middleware.auth_middleware import require_admin
from services.excel_service import process_client_master, process_brokerage
from services.password_service import hash_password
from services.tree_service import get_full_tree, build_tree

admin_bp = Blueprint("admin", __name__)

ALLOWED = {"xlsx"}


def _allowed(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED


def _serialize_client(c: dict) -> dict:
    return {
        "id": c["id"],
        "clientCode": c["client_code"],
        "name": c["name"],
        "pan": c["pan"],
        "dob": str(c["dob"]) if c.get("dob") else None,
        "mobile": c["mobile"],
        "parentCode": c["parent_code"],
        "role": c["role"],
        "status": c["status"],
        "mustChangePassword": bool(c["must_change_password"]),
        "createdAt": str(c["created_at"]) if c.get("created_at") else None,
    }


# ── Dashboard ────────────────────────────────────────────
@admin_bp.get("/api/admin/dashboard-summary")
@require_admin
def dashboard_summary():
    db = get_db()
    cur = db.cursor()
    today = date.today()

    cur.execute("SELECT COUNT(*) AS n FROM clients WHERE role='client'")
    total_clients = cur.fetchone()["n"]

    cur.execute("SELECT COUNT(*) AS n FROM clients WHERE role='client' AND status='active'")
    active_clients = cur.fetchone()["n"]

    cur.execute(
        "SELECT COALESCE(SUM(brokerage_amount),0) AS t FROM brokerage WHERE trade_date=%s", (today.isoformat(),)
    )
    today_brokerage = float(cur.fetchone()["t"])

    month_start = today.replace(day=1).isoformat()
    if today.month == 12:
        next_month = today.replace(year=today.year + 1, month=1, day=1)
    else:
        next_month = today.replace(month=today.month + 1, day=1)
    cur.execute(
        "SELECT COALESCE(SUM(brokerage_amount),0) AS t FROM brokerage "
        "WHERE trade_date >= %s AND trade_date < %s",
        (month_start, next_month.isoformat()),
    )
    month_brokerage = float(cur.fetchone()["t"])

    cur.execute("SELECT COALESCE(SUM(brokerage_amount),0) AS t FROM brokerage")
    total_brokerage = float(cur.fetchone()["t"])

    cur.execute("SELECT COUNT(*) AS n FROM password_reset_requests WHERE status='pending'")
    pending_requests = cur.fetchone()["n"]

    return jsonify({
        "totalClients": total_clients,
        "activeClients": active_clients,
        "todayBrokerage": today_brokerage,
        "monthBrokerage": month_brokerage,
        "totalBrokerage": total_brokerage,
        "pendingRequests": pending_requests,
    })


# ── Client management ────────────────────────────────────
@admin_bp.get("/api/admin/clients")
@require_admin
def list_clients():
    q = request.args.get("q", "").strip()
    db = get_db()
    cur = db.cursor()
    if q:
        like = f"%{q}%"
        cur.execute(
            "SELECT * FROM clients WHERE role='client' AND "
            "(client_code LIKE %s OR name LIKE %s OR mobile LIKE %s OR pan LIKE %s) "
            "ORDER BY created_at DESC LIMIT 200",
            (like, like, like, like),
        )
    else:
        cur.execute("SELECT * FROM clients WHERE role='client' ORDER BY created_at DESC LIMIT 200")
    return jsonify([_serialize_client(c) for c in cur.fetchall()])


@admin_bp.post("/api/admin/add-client")
@require_admin
def add_client():
    data = request.get_json(silent=True) or {}
    required = ("clientCode", "name", "mobile")
    for f in required:
        if not data.get(f):
            return jsonify({"error": f"{f} is required"}), 400

    db = get_db()
    cur = db.cursor()
    cur.execute("SELECT id FROM clients WHERE client_code=%s", (data["clientCode"],))
    if cur.fetchone():
        return jsonify({"error": "ClientCode already exists"}), 409

    pw_hash = hash_password(data["mobile"])
    cur.execute(
        "INSERT INTO clients (client_code, name, pan, dob, mobile, parent_code, "
        "password_hash, role, status, must_change_password) "
        "VALUES (%s,%s,%s,%s,%s,%s,%s,'client',%s,0)",
        (
            data["clientCode"], data["name"], data.get("pan"), data.get("dob"),
            data["mobile"], data.get("parentCode"), pw_hash,
            data.get("status", "active"),
        ),
    )
    db.commit()
    return jsonify({"ok": True, "id": cur.lastrowid}), 201


@admin_bp.put("/api/admin/update-client/<client_code>")
@require_admin
def update_client(client_code):
    data = request.get_json(silent=True) or {}
    db = get_db()
    cur = db.cursor()
    cur.execute("SELECT id FROM clients WHERE client_code=%s", (client_code,))
    if not cur.fetchone():
        return jsonify({"error": "Client not found"}), 404

    fields = []
    values = []
    for col, key in [("name","name"),("pan","pan"),("dob","dob"),("mobile","mobile"),
                     ("parent_code","parentCode"),("status","status")]:
        if key in data:
            fields.append(f"{col}=%s")
            values.append(data[key])
    if not fields:
        return jsonify({"error": "No fields to update"}), 400

    values.append(client_code)
    cur.execute(f"UPDATE clients SET {', '.join(fields)} WHERE client_code=%s", values)
    db.commit()
    return jsonify({"ok": True})


@admin_bp.delete("/api/admin/delete-client/<client_code>")
@require_admin
def delete_client(client_code):
    db = get_db()
    cur = db.cursor()
    cur.execute("UPDATE clients SET status='inactive' WHERE client_code=%s AND role='client'", (client_code,))
    db.commit()
    return jsonify({"ok": True})


# ── Excel uploads ────────────────────────────────────────
@admin_bp.post("/api/admin/upload-client-master")
@require_admin
def upload_client_master():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files["file"]
    if not _allowed(file.filename):
        return jsonify({"error": "Only .xlsx files allowed"}), 400

    filename = secure_filename(file.filename)
    os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
    path = os.path.join(Config.UPLOAD_FOLDER, filename)
    file.save(path)

    result = process_client_master(path, g.current_user["sub"])
    if "error" in result:
        return jsonify(result), 422
    return jsonify(result), 200


@admin_bp.post("/api/admin/upload-brokerage")
@require_admin
def upload_brokerage():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files["file"]
    if not _allowed(file.filename):
        return jsonify({"error": "Only .xlsx files allowed"}), 400

    filename = secure_filename(file.filename)
    os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
    path = os.path.join(Config.UPLOAD_FOLDER, filename)
    file.save(path)

    result = process_brokerage(path, g.current_user["sub"])
    if "error" in result:
        return jsonify(result), 422
    return jsonify(result), 200


# ── Upload history & errors ──────────────────────────────
@admin_bp.get("/api/admin/upload-history")
@require_admin
def upload_history():
    db = get_db()
    cur = db.cursor()
    cur.execute("SELECT * FROM uploads ORDER BY uploaded_at DESC LIMIT 100")
    rows = cur.fetchall()
    for r in rows:
        r["uploaded_at"] = str(r["uploaded_at"])
    return jsonify(rows)


@admin_bp.get("/api/admin/upload-errors/<int:upload_id>")
@require_admin
def upload_errors(upload_id):
    db = get_db()
    cur = db.cursor()
    cur.execute(
        "SELECT * FROM upload_errors WHERE upload_id=%s ORDER BY row_number", (upload_id,)
    )
    rows = cur.fetchall()
    for r in rows:
        r["created_at"] = str(r["created_at"])
    return jsonify(rows)


# ── Brokerage report ─────────────────────────────────────
@admin_bp.get("/api/admin/brokerage-report")
@require_admin
def brokerage_report():
    db = get_db()
    cur = db.cursor()
    date_from = request.args.get("from")
    date_to = request.args.get("to")
    client_code = request.args.get("clientCode")
    # ?limit=10 used by dashboard for recent-only fetch; default 200 for full report
    try:
        limit = int(request.args.get("limit", 200))
    except ValueError:
        limit = 200

    query = (
        "SELECT b.id, b.client_code, c.name AS client_name, b.trade_date, "
        "b.brokerage_amount, b.segment, b.remark "
        "FROM brokerage b JOIN clients c ON c.client_code=b.client_code WHERE 1=1"
    )
    params = []
    if date_from:
        query += " AND b.trade_date >= %s"
        params.append(date_from)
    if date_to:
        query += " AND b.trade_date <= %s"
        params.append(date_to)
    if client_code:
        query += " AND b.client_code = %s"
        params.append(client_code)
    query += " ORDER BY b.trade_date DESC LIMIT %s"
    params.append(limit)

    cur.execute(query, params)
    rows = cur.fetchall()
    for r in rows:
        r["trade_date"] = str(r["trade_date"])
    return jsonify(rows)


# ── Client tree ───────────────────────────────────────────
@admin_bp.get("/api/admin/client-tree/<client_code>")
@require_admin
def client_tree(client_code):
    if client_code == "all":
        return jsonify(get_full_tree())
    tree = build_tree(client_code)
    return jsonify(tree)


# ── Password reset requests ──────────────────────────────
@admin_bp.get("/api/admin/password-reset-requests")
@require_admin
def password_reset_requests():
    db = get_db()
    cur = db.cursor()
    cur.execute(
        "SELECT r.id, r.client_code, c.name, r.mobile, r.status, r.requested_at, r.resolved_at "
        "FROM password_reset_requests r "
        "JOIN clients c ON c.client_code=r.client_code "
        "ORDER BY r.requested_at DESC LIMIT 200"
    )
    rows = cur.fetchall()
    for r in rows:
        r["requested_at"] = str(r["requested_at"])
        r["resolved_at"] = str(r["resolved_at"]) if r["resolved_at"] else None
    return jsonify(rows)


@admin_bp.post("/api/admin/approve-password-reset/<int:request_id>")
@require_admin
def approve_password_reset(request_id):
    db = get_db()
    cur = db.cursor()
    cur.execute("SELECT * FROM password_reset_requests WHERE id=%s", (request_id,))
    req = cur.fetchone()
    if not req:
        return jsonify({"error": "Request not found"}), 404
    if req["status"] != "pending":
        return jsonify({"error": "Request already resolved"}), 400

    # Reset password to mobile number
    new_hash = hash_password(req["mobile"])
    cur.execute(
        "UPDATE clients SET password_hash=%s, must_change_password=0 WHERE client_code=%s",
        (new_hash, req["client_code"]),
    )
    cur.execute(
        "UPDATE password_reset_requests SET status='approved', resolved_at=NOW() WHERE id=%s",
        (request_id,),
    )
    db.commit()
    return jsonify({"ok": True})


@admin_bp.post("/api/admin/reject-password-reset/<int:request_id>")
@require_admin
def reject_password_reset(request_id):
    db = get_db()
    cur = db.cursor()
    cur.execute("SELECT id FROM password_reset_requests WHERE id=%s", (request_id,))
    if not cur.fetchone():
        return jsonify({"error": "Request not found"}), 404
    cur.execute(
        "UPDATE password_reset_requests SET status='rejected', resolved_at=NOW() WHERE id=%s",
        (request_id,),
    )
    db.commit()
    return jsonify({"ok": True})


@admin_bp.post("/api/admin/reset-password/<client_code>")
@require_admin
def reset_password(client_code):
    db = get_db()
    cur = db.cursor()
    cur.execute("SELECT mobile FROM clients WHERE client_code=%s AND role='client'", (client_code,))
    client = cur.fetchone()
    if not client:
        return jsonify({"error": "Client not found"}), 404

    new_hash = hash_password(client["mobile"])
    cur.execute(
        "UPDATE clients SET password_hash=%s, must_change_password=0 WHERE client_code=%s",
        (new_hash, client_code),
    )
    db.commit()
    return jsonify({"ok": True, "message": "Password reset to registered mobile number"})
