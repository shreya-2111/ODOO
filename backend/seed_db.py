# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from app.database import engine, SessionLocal
from app.models.role import Role
from app.models.user import User
from app.models.department import Department
from app.models.asset_category import AssetCategory
from app.services.security import hash_password

def seed_database():
    db: Session = SessionLocal()
    try:
        print("Seeding default roles...")
        roles = ["Super Admin", "Admin", "Auditor", "Technician", "Employee"]
        for role_name in roles:
            existing = db.query(Role).filter(Role.name == role_name).first()
            if not existing:
                role = Role(name=role_name)
                db.add(role)
        db.commit()

        print("Seeding default departments...")
        depts = [
            ("IT Support", "IT"),
            ("Human Resources", "HR"),
            ("Finance & Accounting", "FIN")
        ]
        for name, code in depts:
            existing = db.query(Department).filter(Department.name == name).first()
            if not existing:
                dept = Department(name=name, code=code, is_active=True)
                db.add(dept)
        db.commit()

        # Load first department for employee link
        it_dept = db.query(Department).filter(Department.name == "IT Support").first()
        super_admin_role = db.query(Role).filter(Role.name == "Super Admin").first()

        print("Seeding default Super Admin employee...")
        admin_email = "sarthak@example.com"
        existing_admin = db.query(User).filter(User.email == admin_email).first()
        if not existing_admin and it_dept and super_admin_role:
            admin_user = User(
                email=admin_email,
                hashed_password=hash_password("Sarthak#2111"),
                full_name="Sarthak",
                role_id=super_admin_role.id,
                department_id=it_dept.id,
                is_active=True
            )
            db.add(admin_user)
            db.commit()

        print("Seeding default asset categories...")
        categories = [
            ("Electronics", "ELE", '{"processor": "string", "ram": "string", "storage": "string"}'),
            ("Furniture", "FUR", '{"material": "string", "dimensions": "string"}'),
            ("Vehicles", "VEH", '{"make": "string", "model": "string", "year": "int"}')
        ]
        for name, code, metadata in categories:
            existing = db.query(AssetCategory).filter(AssetCategory.name == name).first()
            if not existing:
                cat = AssetCategory(name=name, code=code, metadata_fields=metadata)
                db.add(cat)
        db.commit()

        print("DATABASE SEED COMPLETED SUCCESSFULLY!")
    except Exception as e:
        print(f"Error occurred during seed: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
