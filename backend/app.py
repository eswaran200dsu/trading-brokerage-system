import os
from flask import Flask
from flask_cors import CORS
from config import Config
import db as database

from routes.auth_routes import auth_bp
from routes.admin_routes import admin_bp
from routes.client_routes import client_bp


def run_startup_migrations(app):
    """Small safe startup repairs for local demo and Render deployment."""
    with app.app_context():
        try:
            conn = database.get_db()
            cur = conn.cursor()

            if database.get_db_kind() == "sqlite":
                cur.execute("UPDATE clients SET must_change_password = 0")
                conn.commit()
                return

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

    CORS(
        app,
        resources={r"/api/*": {"origins": "*"}},
        allow_headers=["Content-Type", "Authorization"],
    )

    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(client_bp)

    database.init_app(app)
    os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)

    @app.get("/")
    def home():
        return {
            "status": "ok",
            "message": "TradeDesk Brokerage API is running"
        }

    @app.get("/api/health")
    def health():
        try:
            conn = database.get_db()
            cur = conn.cursor()
            cur.execute("SELECT 1")

            return {
                "status": "ok",
                "database": database.get_db_kind()
            }

        except Exception as e:
            return {
                "status": "ok",
                "database": "not_connected",
                "error": str(e)
            }

    return app


app = create_app()
run_startup_migrations(app)


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True,
        use_reloader=False
    )
