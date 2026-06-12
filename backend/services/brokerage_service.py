from datetime import date
from db import get_db


def get_today_brokerage(client_code: str) -> float:
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "SELECT COALESCE(SUM(brokerage_amount), 0) AS total FROM brokerage "
        "WHERE client_code = %s AND trade_date = %s",
        (client_code, date.today().isoformat()),
    )
    row = cursor.fetchone()
    return float(row["total"]) if row else 0.0


def get_monthly_brokerage(client_code: str) -> float:
    db = get_db()
    cursor = db.cursor()
    today = date.today()
    month_start = today.replace(day=1).isoformat()
    if today.month == 12:
        next_month = today.replace(year=today.year + 1, month=1, day=1)
    else:
        next_month = today.replace(month=today.month + 1, day=1)
    cursor.execute(
        "SELECT COALESCE(SUM(brokerage_amount), 0) AS total FROM brokerage "
        "WHERE client_code = %s AND trade_date >= %s AND trade_date < %s",
        (client_code, month_start, next_month.isoformat()),
    )
    row = cursor.fetchone()
    return float(row["total"]) if row else 0.0


def get_total_brokerage(client_code: str) -> float:
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "SELECT COALESCE(SUM(brokerage_amount), 0) AS total FROM brokerage "
        "WHERE client_code = %s",
        (client_code,),
    )
    row = cursor.fetchone()
    return float(row["total"]) if row else 0.0


def get_brokerage_history(client_code: str, limit: int = 50):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "SELECT b.id, b.client_code, c.name AS client_name, b.trade_date, "
        "b.brokerage_amount, b.segment, b.remark "
        "FROM brokerage b "
        "JOIN clients c ON c.client_code = b.client_code "
        "WHERE b.client_code = %s "
        "ORDER BY b.trade_date DESC, b.id DESC LIMIT %s",
        (client_code, limit),
    )
    rows = cursor.fetchall()
    for r in rows:
        if r.get("trade_date"):
            r["trade_date"] = str(r["trade_date"])
    return rows


def get_all_brokerage_report(limit: int = 50):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "SELECT b.id, b.client_code, c.name AS client_name, b.trade_date, "
        "b.brokerage_amount, b.segment, b.remark "
        "FROM brokerage b "
        "JOIN clients c ON c.client_code = b.client_code "
        "ORDER BY b.trade_date DESC, b.id DESC LIMIT %s",
        (limit,),
    )
    rows = cursor.fetchall()
    for r in rows:
        if r.get("trade_date"):
            r["trade_date"] = str(r["trade_date"])
    return rows
