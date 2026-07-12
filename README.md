# AssetFlow ERP

**AssetFlow ERP** is an Enterprise Physical Asset & Resource Allocation Management System. The application manages physical hardware tracking, departmental asset handovers, resource reservations, maintenance tickets, compliance audit cycles, and real-time activity metrics.

---

## 🛠️ Technology Stack

*   **Frontend**: React.js, Bootstrap CSS Icons, Axios, React Router.
*   **Backend**: FastAPI (Python), Uvicorn Gateway, SQLAlchemy ORM, Pydantic.
*   **Database**: MySQL Server.
*   **Authentication**: JWT (JSON Web Tokens) with Secure bcrypt Password Hashing.

---

## 🚀 Key Features

1.  **Role-Based Access Control**: Managed role permissions (`Super Admin`, `Admin`, `Auditor`, `Technician`, `Employee`).
2.  **Asset Directory**: Automatic code generation for asset tags, categoryspec mapping, and physical location tracking.
3.  **Handovers & Allocations**: Departmental allocations with conflict checks to block double handouts.
4.  **Transfer Workflow**: Formal transfer requests and approval paths for changing asset holders.
5.  **Resource Bookings**: Daily agenda calendar for reserving shared resources (meeting rooms, fleet cars) implementing mathematical overlap interval validations.
6.  **Maintenance Tickets**: Repair requests with state transitions automatically flipping asset availability status.
7.  **Inventory Audits**: Periodic audit cycles with discrepancies reports.
8.  **Activity Logs & Alerts**: Real-time notifications and activity log trails.
9.  **Analytics Dashboard**: Optimization queries calculating utilization rates and weekday booking heatmaps.

---

## ⚙️ Configuration Setup

### 1. Database Creation
Connect to your local MySQL instance and create the database schema:
```sql
CREATE DATABASE assetflow;
```

### 2. Backend Config (`backend/.env`)
Create a `.env` file inside the `backend` folder:
```ini
# Database Parameters
DATABASE_URL=mysql+pymysql://root:Shreya%232111@localhost:3306/assetflow

# Security & JWT Configuration
SECRET_KEY=9a6d0c648be1cb759a22f7be62514bc10b9f8742d4a20f9261a86851be403dbb
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=120
```
> [!IMPORTANT]
> If your password contains special characters (like `#`), they must be URL-encoded (e.g., `#` becomes `%23`).

---

## 🏃 Running the Application

### Start Backend Server:
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
*   **Backend API URL**: `http://localhost:8000`
*   **Interactive OpenAPI Swagger UI**: `http://localhost:8000/docs`

### Seed Default Datasets:
To populate roles, departments, asset categories, and your default Admin login account (**Sarthak**):
```bash
python seed_db.py
```
*   **Default Login Username**: `sarthak@example.com`
*   **Default Login Password**: `Sarthak#2111`

### Start Frontend Server:
```bash
cd frontend
npm install
npm run dev
```
*   **React Dashboard Portal**: `http://localhost:5173`
