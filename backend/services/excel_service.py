import pandas as pd
from db import get_db
from services.password_service import hash_password

REQUIRED_CLIENT_COLS = {"ClientCode", "Name", "PAN", "DOB", "Mobile", "ParentCode", "Status"}
REQUIRED_BROKERAGE_COLS = {"ClientCode", "TradeDate", "BrokerageAmount", "Segment", "Remark"}


def process_client_master(filepath: str, uploaded_by: str) -> dict:
    try:
        df = pd.read_excel(filepath, dtype=str)
    except Exception as e:
        return {"error": f"Could not read Excel file: {e}"}

    df.columns = [c.strip() for c in df.columns]
    missing = REQUIRED_CLIENT_COLS - set(df.columns)
    if missing:
        return {"error": f"Missing required columns: {', '.join(missing)}"}

    db = get_db()
    cursor = db.cursor()

    total = len(df)
    success = 0
    failed = 0
    errors = []

    cursor.execute(
        "INSERT INTO uploads (file_name, upload_type, total_rows, success_rows, "
        "failed_rows, duplicate_rows, uploaded_by) VALUES (%s, %s, %s, 0, 0, 0, %s)",
        (filepath.split("/")[-1].split("\\")[-1], "client_master", total, uploaded_by),
    )
    db.commit()
    upload_id = cursor.lastrowid

    for idx, row in df.iterrows():
        row_num = idx + 2
        client_code = str(row.get("ClientCode", "")).strip()
        name = str(row.get("Name", "")).strip()
        mobile = str(row.get("Mobile", "")).strip()

        if not client_code or not name or not mobile or client_code == "nan":
            failed += 1
            errors.append((upload_id, row_num, "ClientCode, Name and Mobile are required", str(dict(row))))
            continue

        pan = str(row.get("PAN", "")).strip() or None
        if pan == "nan":
            pan = None

        dob_raw = row.get("DOB", "")
        dob = None
        if dob_raw and str(dob_raw).strip() not in ("", "nan", "None"):
            try:
                dob = pd.to_datetime(str(dob_raw).strip()).date()
            except Exception:
                dob = None

        parent_code = str(row.get("ParentCode", "")).strip() or None
        if parent_code == "nan":
            parent_code = None

        status_raw = str(row.get("Status", "active")).strip().lower()
        status = "inactive" if status_raw in ("inactive", "0", "false") else "active"

        cursor.execute(
            "SELECT id, password_hash FROM clients WHERE client_code = %s", (client_code,)
        )
        existing = cursor.fetchone()

        try:
            if existing:
                # Existing client: update details but DO NOT overwrite password
                # unless password_hash is empty/null (e.g. legacy rows)
                if not existing.get("password_hash"):
                    # Only set password if none exists
                    pw_hash = hash_password(mobile)
                    cursor.execute(
                        "UPDATE clients SET name=%s, pan=%s, dob=%s, mobile=%s, "
                        "parent_code=%s, status=%s, password_hash=%s, updated_at=CURRENT_TIMESTAMP "
                        "WHERE client_code=%s",
                        (name, pan, dob, mobile, parent_code, status, pw_hash, client_code),
                    )
                else:
                    cursor.execute(
                        "UPDATE clients SET name=%s, pan=%s, dob=%s, mobile=%s, "
                        "parent_code=%s, status=%s, updated_at=CURRENT_TIMESTAMP WHERE client_code=%s",
                        (name, pan, dob, mobile, parent_code, status, client_code),
                    )
            else:
                pw_hash = hash_password(mobile)
                cursor.execute(
                    "INSERT INTO clients (client_code, name, pan, dob, mobile, parent_code, "
                    "password_hash, role, status, must_change_password) "
                    "VALUES (%s, %s, %s, %s, %s, %s, %s, 'client', %s, 0)",
                    (client_code, name, pan, dob, mobile, parent_code, pw_hash, status),
                )
            db.commit()
            success += 1
        except Exception as e:
            db.rollback()
            failed += 1
            errors.append((upload_id, row_num, str(e), str(dict(row))))

    if errors:
        cursor.executemany(
            "INSERT INTO upload_errors (upload_id, row_number, error_message, row_data) "
            "VALUES (%s, %s, %s, %s)",
            errors,
        )
        db.commit()

    cursor.execute(
        "UPDATE uploads SET success_rows=%s, failed_rows=%s WHERE id=%s",
        (success, failed, upload_id),
    )
    db.commit()

    return {
        "ok": True,
        "rows": success,
        "uploadId": upload_id,
        "total": total,
        "success": success,
        "failed": failed,
        "duplicates": 0,
    }


def process_brokerage(filepath: str, uploaded_by: str) -> dict:
    try:
        df = pd.read_excel(filepath, dtype=str)
    except Exception as e:
        return {"error": f"Could not read Excel file: {e}"}

    df.columns = [c.strip() for c in df.columns]
    missing = REQUIRED_BROKERAGE_COLS - set(df.columns)
    if missing:
        return {"error": f"Missing required columns: {', '.join(missing)}"}

    db = get_db()
    cursor = db.cursor()

    total = len(df)
    success = 0
    failed = 0
    duplicates = 0
    errors = []

    cursor.execute(
        "INSERT INTO uploads (file_name, upload_type, total_rows, success_rows, "
        "failed_rows, duplicate_rows, uploaded_by) VALUES (%s, %s, %s, 0, 0, 0, %s)",
        (filepath.split("/")[-1].split("\\")[-1], "brokerage", total, uploaded_by),
    )
    db.commit()
    upload_id = cursor.lastrowid

    for idx, row in df.iterrows():
        row_num = idx + 2
        client_code = str(row.get("ClientCode", "")).strip()
        trade_date_raw = str(row.get("TradeDate", "")).strip()
        amount_raw = str(row.get("BrokerageAmount", "")).strip()

        if not client_code or not trade_date_raw or not amount_raw or client_code == "nan":
            failed += 1
            errors.append((upload_id, row_num, "ClientCode, TradeDate and BrokerageAmount are required", str(dict(row))))
            continue

        cursor.execute("SELECT id FROM clients WHERE client_code = %s", (client_code,))
        if not cursor.fetchone():
            failed += 1
            errors.append((upload_id, row_num, f"ClientCode '{client_code}' not found", str(dict(row))))
            continue

        try:
            trade_date = pd.to_datetime(trade_date_raw).date()
            amount = float(amount_raw)
        except Exception as e:
            failed += 1
            errors.append((upload_id, row_num, f"Invalid date or amount: {e}", str(dict(row))))
            continue

        segment = str(row.get("Segment", "")).strip() or None
        if segment == "nan":
            segment = None
        remark = str(row.get("Remark", "")).strip() or None
        if remark == "nan":
            remark = None

        cursor.execute(
            "SELECT id FROM brokerage WHERE client_code=%s AND trade_date=%s "
            "AND ((segment IS NULL AND %s IS NULL) OR segment=%s) AND brokerage_amount=%s",
            (client_code, trade_date.isoformat(), segment, segment, amount),
        )
        if cursor.fetchone():
            duplicates += 1
            continue

        try:
            cursor.execute(
                "INSERT INTO brokerage (client_code, trade_date, brokerage_amount, segment, remark, upload_id) "
                "VALUES (%s, %s, %s, %s, %s, %s)",
                (client_code, trade_date.isoformat(), amount, segment, remark, upload_id),
            )
            db.commit()
            success += 1
        except Exception as e:
            db.rollback()
            failed += 1
            errors.append((upload_id, row_num, str(e), str(dict(row))))

    if errors:
        cursor.executemany(
            "INSERT INTO upload_errors (upload_id, row_number, error_message, row_data) "
            "VALUES (%s, %s, %s, %s)",
            errors,
        )
        db.commit()

    cursor.execute(
        "UPDATE uploads SET success_rows=%s, failed_rows=%s, duplicate_rows=%s WHERE id=%s",
        (success, failed, duplicates, upload_id),
    )
    db.commit()

    return {
        "ok": True,
        "rows": success,
        "uploadId": upload_id,
        "total": total,
        "success": success,
        "failed": failed,
        "duplicates": duplicates,
    }
