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

