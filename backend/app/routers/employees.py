from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..schemas.employee import EmployeeCreate, EmployeeUpdate, EmployeeResponse
from ..models.user import User
from ..models.role import Role
from ..models.department import Department
from ..services.security import hash_password
from ..dependencies import get_db, get_current_active_user

router = APIRouter(prefix="/employees", tags=["Employees"])

@router.post("", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee(
    emp_in: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Verify email uniqueness
    existing = db.query(User).filter(User.email == emp_in.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="An account with this email address already exists.")

    # Verify role existence
    role_obj = db.query(Role).filter(Role.id == emp_in.role_id).first()
    if not role_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Selected role not found.")

    # Verify department if specified
    if emp_in.department_id:
        dept_obj = db.query(Department).filter(Department.id == emp_in.department_id).first()
        if not dept_obj:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Selected department not found.")

    hashed_pwd = hash_password(emp_in.password)

    new_emp = User(
        full_name=emp_in.full_name,
        email=emp_in.email,
        hashed_password=hashed_pwd,
        role_id=emp_in.role_id,
        department_id=emp_in.department_id,
        is_active=True
    )
    db.add(new_emp)
    db.commit()
    db.refresh(new_emp)
    return new_emp

@router.get("", response_model=List[EmployeeResponse])
def list_employees(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return db.query(User).all()

@router.get("/{id}", response_model=EmployeeResponse)
def get_employee(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    emp = db.query(User).filter(User.id == id).first()
    if not emp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found.")
    return emp

@router.put("/{id}", response_model=EmployeeResponse)
def update_employee(
    id: int,
    emp_in: EmployeeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    emp = db.query(User).filter(User.id == id).first()
    if not emp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found.")

    if emp_in.role_id is not None:
        role_obj = db.query(Role).filter(Role.id == emp_in.role_id).first()
        if not role_obj:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Selected role not found.")
        emp.role_id = emp_in.role_id

    if emp_in.department_id is not None:
        dept_obj = db.query(Department).filter(Department.id == emp_in.department_id).first()
        if not dept_obj:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Selected department not found.")
        emp.department_id = emp_in.department_id

    if emp_in.full_name is not None:
        emp.full_name = emp_in.full_name

    if emp_in.email is not None:
        # Check uniqueness if email changes
        if emp_in.email != emp.email:
            existing = db.query(User).filter(User.email == emp_in.email).first()
            if existing:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email address is already in use by another profile.")
        emp.email = emp_in.email

    if emp_in.password is not None:
        emp.hashed_password = hash_password(emp_in.password)

    if emp_in.is_active is not None:
        emp.is_active = emp_in.is_active

    db.commit()
    db.refresh(emp)
    return emp

@router.delete("/{id}", response_model=EmployeeResponse)
def deactivate_employee(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    emp = db.query(User).filter(User.id == id).first()
    if not emp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found.")
    emp.is_active = False
    db.commit()
    db.refresh(emp)
    return emp
