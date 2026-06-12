# Trading Brokerage Management System – Backend

Flask + MySQL backend for the React frontend.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Python | 3.10 + |
| MySQL | 8.0 + |
| Node.js | 18 + (for the frontend) |

---

## Quick Start

### 1. Create the MySQL database

```sql
mysql -u root -p < backend/database.sql
```

This creates the `trading_brokerage` database, all tables, and the default
admin account (`admin` / `Admin@123`).

### 2. Configure environment variables

```bash
cd backend
cp .env.example .env
# Edit .env – set DB_PASSWORD and JWT_SECRET_KEY at minimum
```

### 3. Install Python dependencies

```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 4. Start the Flask server

```bash
python app.py
```

Flask listens on **http://127.0.0.1:5000**

---

## Frontend setup

```bash
# project root
cp .env.example .env        # if one doesn't exist
echo "VITE_API_BASE_URL=http://127.0.0.1:5000" >> .env

npm install
npm run dev
```

Frontend runs on **http://localhost:5173**

---

## Default credentials

| Role  | Username | Password  |
|-------|----------|-----------|
| Admin | `admin`  | `Admin@123` |
| Client| ClientCode | Registered mobile number |

> Clients are prompted to change the default password on first login.

---

## API overview

### Auth (public)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/login` | Login (returns JWT) |
| POST | `/api/logout` | Logout |
| POST | `/api/change-password` | Change own password (auth required) |
| POST | `/api/forgot-password` | Submit reset request |

### Admin (JWT, role=admin)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/dashboard-summary` | Summary stats |
| GET | `/api/admin/clients` | List / search clients |
| POST | `/api/admin/add-client` | Add client |
| PUT | `/api/admin/update-client/<code>` | Edit client |
| DELETE | `/api/admin/delete-client/<code>` | Deactivate client |
| POST | `/api/admin/upload-client-master` | Upload Client Master Excel |
| POST | `/api/admin/upload-brokerage` | Upload Brokerage Excel |
| GET | `/api/admin/upload-history` | Upload history |
| GET | `/api/admin/upload-errors/<id>` | Upload error rows |
| GET | `/api/admin/brokerage-report` | Full brokerage report |
| GET | `/api/admin/client-tree/<code\|all>` | Client hierarchy tree |
| GET | `/api/admin/password-reset-requests` | Password reset requests |
| POST | `/api/admin/approve-password-reset/<id>` | Approve reset |
| POST | `/api/admin/reject-password-reset/<id>` | Reject reset |
| POST | `/api/admin/reset-password/<code>` | Manually reset password |

### Client (JWT, role=client)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/client/profile` | Own profile |
| GET | `/api/client/dashboard-summary` | Brokerage summary |
| GET | `/api/client/brokerage-history` | Own brokerage rows |
| GET | `/api/client/team-tree` | Own downline tree |
| GET | `/api/client/team-brokerage-summary` | Downline brokerage |

---

## Excel upload formats

### Client Master (`sample_excels/client_master_sample.xlsx`)
| Column | Required | Notes |
|--------|----------|-------|
| ClientCode | ✅ | Unique identifier |
| Name | ✅ | Full name |
| PAN | | PAN number |
| DOB | | YYYY-MM-DD |
| Mobile | ✅ | Used as default password |
| ParentCode | | Parent client code |
| Status | | active / inactive |

### Brokerage (`sample_excels/brokerage_sample.xlsx`)
| Column | Required | Notes |
|--------|----------|-------|
| ClientCode | ✅ | Must exist in clients table |
| TradeDate | ✅ | YYYY-MM-DD |
| BrokerageAmount | ✅ | Decimal number |
| Segment | | Equity / F&O / Currency / Commodity |
| Remark | | Free text |

---

## Project structure

```
backend/
├── app.py                 # Flask app factory + entry point
├── config.py              # Configuration from .env
├── db.py                  # Per-request MySQL connection
├── database.sql           # Schema + seed data
├── requirements.txt
├── .env.example
├── README.md
├── routes/
│   ├── auth_routes.py
│   ├── admin_routes.py
│   └── client_routes.py
├── services/
│   ├── excel_service.py   # Excel parsing & DB upsert
│   ├── brokerage_service.py
│   ├── tree_service.py
│   └── password_service.py
├── middleware/
│   └── auth_middleware.py # JWT decorators
├── uploads/               # Saved Excel files
└── sample_excels/
    ├── client_master_sample.xlsx
    └── brokerage_sample.xlsx
```


## V6 clean fixed notes

- Local demo works without MySQL. If MySQL is unavailable, backend falls back to `trading_brokerage_demo.db` SQLite automatically.
- Admin login: `admin` / `Admin@123`.
- New clients created by Admin or Excel can login immediately with `ClientCode` + `Mobile`.
- Client login does not force Change Password. Change Password is optional from sidebar.
- Frontend auto-detects backend as `http://<current-host>:5000`.
- Use `run_backend.bat` and `run_frontend.bat` from project root for easy startup.
