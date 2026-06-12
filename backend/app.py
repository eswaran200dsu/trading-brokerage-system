import os
from flask import Flask
from flask_cors import CORS
from config import Config
import db as database

from routes.auth_routes import auth_bp
from routes.admin_routes import admin_bp
from routes.client_routes import client_bp


def run_startup_migrations(app):
    """Small safe startup repairs for local demo and MySQL deployments."""
    with app.app_context():
        try:
            conn = database.get_db()
            cur = conn.cursor()

            if database.get_db_kind() == "sqlite":
                # Schema/admin are already handled by db.ensure_sqlite_schema().
                cur.execute("UPDATE clients SET must_change_password = 0")
                conn.commit()
                return

            # MySQL migrations only
            cur.execute("SHOW COLUMNS FROM clients LIKE 'must_change_password'")
            if not cur.fetchone():
                cur.execute(
                    "ALTER TABLE clients ADD COLUMN must_change_password "
                    "TINYINT(1) NOT NULL DEFAULT 0"
                )
            else:
                cur.execute(
                    "ALTER TABLE clients MODIFY COLUMN must_change_password "
                    "TINYINT(1) NOT NULL DEFAULT 0"
                )
            cur.execute("UPDATE clients SET must_change_password = 0")
            for sql in [
                "CREATE INDEX idx_parent_code ON clients (parent_code)",
                "CREATE INDEX idx_trade_date ON brokerage (trade_date)",
            ]:
                try:
                    cur.execute(sql)
                except Exception:
                    pass
            conn.commit()
        except Exception as e:
            print(f"[startup migration] Warning: {e}")


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # API uses Authorization header, not cookies; wildcard CORS is fine for local demo.
    CORS(app, resources={r"/api/*": {"origins": "*"}}, allow_headers=["Content-Type", "Authorization"])

    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(client_bp)

    database.init_app(app)
    os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)

    @app.get("/api/health")
    def health():
        return {"status": "ok", "database": getattr(__import__('flask').g, "db_kind", "not_connected")}

    return app


if __name__ == "__main__":
    app = create_app()
    run_startup_migrations(app)
    app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=False)
