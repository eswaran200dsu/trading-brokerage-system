from flask import Blueprint, jsonify, g
from db import get_db
from middleware.auth_middleware import require_client
from services.brokerage_service import (
    get_today_brokerage, get_monthly_brokerage,
    get_total_brokerage, get_brokerage_history,
)
from services.tree_service import build_tree, get_team_brokerage_summary

client_bp = Blueprint("client", __name__)


def _own_code():
    return g.current_user["sub"]


@client_bp.get("/api/client/profile")
@require_client
def profile():
    db = get_db()
    cur = db.cursor()
    cur.execute(
        "SELECT client_code, name, pan, dob, mobile, parent_code, status, created_at "
        "FROM clients WHERE client_code=%s",
        (_own_code(),),
    )
    client = cur.fetchone()
    if not client:
        return jsonify({"error": "Client not found"}), 404
    client["dob"] = str(client["dob"]) if client.get("dob") else None
    client["created_at"] = str(client["created_at"]) if client.get("created_at") else None
    return jsonify(client)


@client_bp.get("/api/client/dashboard-summary")
@require_client
def dashboard_summary():
    code = _own_code()
    team_size = _count_descendants(code)

    return jsonify({
        "todayBrokerage": get_today_brokerage(code),
        "monthBrokerage": get_monthly_brokerage(code),
        "totalBrokerage": get_total_brokerage(code),
        "teamSize": team_size,
    })


def _count_descendants(code: str) -> int:
    """Recursively count all clients below this code in the hierarchy."""
    db = get_db()
    cur = db.cursor()
    cur.execute(
        "SELECT client_code FROM clients WHERE parent_code=%s AND role='client'",
        (code,),
    )
    children = cur.fetchall()
    count = len(children)
    for child in children:
        count += _count_descendants(child["client_code"])
    return count


@client_bp.get("/api/client/brokerage-history")
@require_client
def brokerage_history():
    rows = get_brokerage_history(_own_code())
    return jsonify(rows)


@client_bp.get("/api/client/team-tree")
@require_client
def team_tree():
    tree = build_tree(_own_code())
    return jsonify(tree)


@client_bp.get("/api/client/team-brokerage-summary")
@require_client
def team_brokerage_summary():
    summary = get_team_brokerage_summary(_own_code())
    return jsonify(summary)
