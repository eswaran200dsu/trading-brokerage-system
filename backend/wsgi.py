from app import create_app, run_startup_migrations

app = create_app()
run_startup_migrations(app)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
