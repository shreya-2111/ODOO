# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, departments, employees, categories, assets, allocations, transfers, bookings, maintenance, audits, notifications, activity_logs, dashboard

# Initialize and map database tables automatically on startup
try:
    Base.metadata.create_all(bind=engine)
except Exception:
    # Fallback to allow server boot and local tests even if SQL instance is not ready immediately
    pass

app = FastAPI(
    title="AssetFlow ERP Backend API",
    description="Enterprise Physical Asset & Resource Allocation management REST API services",
    version="1.0.0"
)

# CORS configurations for React client frontend
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix="/api")
app.include_router(departments.router, prefix="/api")
app.include_router(employees.router, prefix="/api")
app.include_router(categories.router, prefix="/api")
app.include_router(assets.router, prefix="/api")
app.include_router(allocations.router, prefix="/api")
app.include_router(transfers.router, prefix="/api")
app.include_router(bookings.router, prefix="/api")
app.include_router(maintenance.router, prefix="/api")
app.include_router(audits.router, prefix="/api")
app.include_router(notifications.router, prefix="/api")
app.include_router(activity_logs.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")

@app.get("/")
def read_root():
    return {
        "status": "Online",
        "service": "AssetFlow ERP Backend API Gateway",
        "docs": "/docs"
    }

# sujal
