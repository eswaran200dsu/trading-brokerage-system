from collections import defaultdict
from db import get_db
from services.brokerage_service import get_total_brokerage


def _node(client: dict) -> dict:
    return {
        "clientCode": client["client_code"],
        "name": client["name"],
        "mobile": client.get("mobile", ""),
        "status": client.get("status", "active"),
        "branch": "",
        "brokerage": get_total_brokerage(client["client_code"]),
        "children": [],
    }


def _load_clients():
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "SELECT client_code, name, mobile, status, parent_code "
        "FROM clients WHERE role='client' ORDER BY client_code ASC"
    )
    return cursor.fetchall()


def _build_indexed_tree():
    clients = _load_clients()
    nodes = {c["client_code"]: _node(c) for c in clients}
    all_codes = set(nodes.keys())
    roots = []

    # Attach children
    for c in clients:
        code = c["client_code"]
        parent = (c.get("parent_code") or "").strip()
        if not parent or parent.lower() == "admin" or parent not in all_codes:
            roots.append(nodes[code])
        elif parent != code:
            nodes[parent]["children"].append(nodes[code])
        else:
            roots.append(nodes[code])
    return roots, nodes


def get_full_tree() -> list:
    roots, _ = _build_indexed_tree()
    return roots


def build_tree(root_code: str) -> dict:
    _, nodes = _build_indexed_tree()
    return nodes.get(root_code, {})


def get_team_brokerage_summary(root_code: str) -> list:
    root = build_tree(root_code)
    members = []

    def walk(node):
        for child in node.get("children", []):
            members.append({
                "clientCode": child["clientCode"],
                "name": child["name"],
                "totalBrokerage": child.get("brokerage", 0),
            })
            walk(child)

    if root:
        walk(root)
    return members
