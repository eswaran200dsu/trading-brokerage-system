import os
import sqlite3

import pymysql
import pymysql.cursors
from flask import g
from config import Config


class SQLiteCursor:
    """Small adapter so existing PyMySQL-style code works with SQLite."""

    def __init__(self, cursor):
        self.cursor = cursor

    @property
    def lastrowid(self):
        return self.cursor.lastrowid

    @property
    def rowcount(self):
        return self.cursor.rowcount

    def _convert_sql(self, sql: str) -> str:
        # Basic MySQL -> SQLite compatibility for this project
        sql = sql.replace("%s", "?")
        sql = sql.replace("NOW()", "CURRENT_TIMESTAMP")
        sql = sql.replace("AUTO_INCREMENT", "AUTOINCREMENT")
        sql = sql.replace("TINYINT(1)", "INTEGER")
        return sql

    def execute(self, sql, params=None):
        sql = self._convert_sql(sql)
        if params is None:
            params = ()
        return self.cursor.execute(sql, params)

    def executemany(self, sql, seq_of_params):
        sql = self._convert_sql(sql)
        return self.cursor.executemany(sql, seq_of_params)

    def fetchone(self):
        row = self.cursor.fetchone()
        return dict(row) if row is not None else None

    def fetchall(self):
        return [dict(r) for r in self.cursor.fetchall()]


class SQLiteConnection:
    def __init__(self, path: str):
        self.conn = sqlite3.connect(path, detect_types=sqlite3.PARSE_DECLTYPES)
        self.conn.row_factory = sqlite3.Row
        self._is_sqlite = True

    def cursor(self):
        return SQLiteCursor(self.conn.cursor())

    def commit(self):
        return self.conn.commit()

    def rollback(self):
        return self.conn.rollback()

    def close(self):
        return self.conn.close()


def _connect_mysql():
    return pymysql.connect(
        host=Config.DB_HOST,
        port=Config.DB_PORT,
        user=Config.DB_USER,
        password=Config.DB_PASSWORD,
        database=Config.DB_NAME,
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=False,
        connect_timeout=2,
    )


def _connect_sqlite():
    os.makedirs(os.path.dirname(Config.SQLITE_PATH), exist_ok=True)
    conn = SQLiteConnection(Config.SQLITE_PATH)
    ensure_sqlite_schema(conn)
    return conn


def get_db():
    """Return a per-request DB connection. MySQL first, SQLite fallback for demo."""
    if "db" not in g:
        try:
            g.db = _connect_mysql()
            g.db_kind = "mysql"
        except Exception as exc:
            if not Config.USE_SQLITE_FALLBACK:
                raise
            print(f"[database] MySQL unavailable, using SQLite demo DB: {exc}")
            g.db = _connect_sqlite()
            g.db_kind = "sqlite"
    return g.db


def get_db_kind():
    # Forces a connection so g.db_kind is available
    get_db()
    return getattr(g, "db_kind", "mysql")


def close_db(e=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()
    g.pop("db_kind", None)


def init_app(app):
    app.teardown_appcontext(close_db)


def ensure_sqlite_schema(conn):
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_code TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            pan TEXT,
            dob TEXT,
            mobile TEXT NOT NULL,
            parent_code TEXT,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'client',
            status TEXT NOT NULL DEFAULT 'active',
            must_change_password INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS brokerage (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_code TEXT NOT NULL,
            trade_date TEXT NOT NULL,
            brokerage_amount REAL NOT NULL DEFAULT 0,
            segment TEXT,
            remark TEXT,
            upload_id INTEGER,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS uploads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            file_name TEXT NOT NULL,
            upload_type TEXT NOT NULL,
            total_rows INTEGER NOT NULL DEFAULT 0,
            success_rows INTEGER NOT NULL DEFAULT 0,
            failed_rows INTEGER NOT NULL DEFAULT 0,
            duplicate_rows INTEGER NOT NULL DEFAULT 0,
            uploaded_by TEXT NOT NULL,
            uploaded_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS upload_errors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            upload_id INTEGER NOT NULL,
            row_number INTEGER NOT NULL,
            error_message TEXT NOT NULL,
            row_data TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS password_reset_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_code TEXT NOT NULL,
            mobile TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending',
            requested_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            resolved_at TEXT
        )
        """
    )
    cur.execute("CREATE INDEX IF NOT EXISTS idx_clients_code ON clients(client_code)")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_clients_parent ON clients(parent_code)")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_brokerage_code ON brokerage(client_code)")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_brokerage_date ON brokerage(trade_date)")

    # Create/repair default admin using runtime bcrypt so hash is always correct.
    try:
        from services.password_service import hash_password
        admin_hash = hash_password("Admin@123")
        cur.execute("SELECT id FROM clients WHERE client_code=?", ("admin",))
        if cur.fetchone():
            cur.execute(
                "UPDATE clients SET name=?, mobile=?, password_hash=?, role=?, status=?, must_change_password=0 WHERE client_code=?",
                ("Admin User", "0000000000", admin_hash, "admin", "active", "admin"),
            )
        else:
            cur.execute(
                "INSERT INTO clients (client_code, name, mobile, password_hash, role, status, must_change_password) VALUES (?, ?, ?, ?, ?, ?, 0)",
                ("admin", "Admin User", "0000000000", admin_hash, "admin", "active"),
            )
    except Exception as exc:
        print(f"[database] Could not create SQLite admin: {exc}")

    conn.commit()
