import sys
import traceback
from app.database import engine, Base

# Import all models to ensure they are registered with Base metadata
try:
    from app.models import (
        role, user, department, asset_category, asset, 
        asset_allocation, transfer_request, resource_booking, 
        maintenance_ticket, audit_cycle, audit_item, 
        notification, activity_log
    )
except Exception as e:
    print("Import error on models:")
    traceback.print_exc()
    sys.exit(1)

try:
    print("Connecting to database and creating tables...")
    Base.metadata.create_all(bind=engine)
    print("SUCCESS: Tables created successfully!")
except Exception as e:
    print("DATABASE ERROR OCCURRED:")
    traceback.print_exc()
