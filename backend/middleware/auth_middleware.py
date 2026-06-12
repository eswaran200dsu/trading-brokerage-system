from functools import wraps
from flask import request, jsonify, g
import jwt
from config import Config


def _decode_token():
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None, "Missing or invalid Authorization header"
    token = auth_header.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=["HS256"])
        return payload, None
    except jwt.ExpiredSignatureError:
        return None, "Token has expired"
    except jwt.InvalidTokenError:
        return None, "Invalid token"


def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        payload, err = _decode_token()
        if err:
            return jsonify({"error": err}), 401
        g.current_user = payload
        return f(*args, **kwargs)
    return decorated


def require_admin(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        payload, err = _decode_token()
        if err:
            return jsonify({"error": err}), 401
        if payload.get("role") != "admin":
            return jsonify({"error": "Admin access required"}), 403
        g.current_user = payload
        return f(*args, **kwargs)
    return decorated


def require_client(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        payload, err = _decode_token()
        if err:
            return jsonify({"error": err}), 401
        if payload.get("role") != "client":
            return jsonify({"error": "Client access required"}), 403
        g.current_user = payload
        return f(*args, **kwargs)
    return decorated
