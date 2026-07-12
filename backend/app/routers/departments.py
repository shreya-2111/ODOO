from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..schemas.department import DepartmentCreate, DepartmentUpdate, DepartmentResponse
from ..models.department import Department
from ..models.user import User
from ..dependencies import get_db, get_current_active_user

router = APIRouter(prefix="/departments", tags=["Departments"])

@router.post("", response_model=DepartmentResponse, status_code=status.HTTP_201_CREATED)
def create_department(
    dept_in: DepartmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Verify unique code
    existing = db.query(Department).filter(Department.code == dept_in.code).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Department code already exists.")
        
    # Check parent department if specified
    if dept_in.parent_id:
        parent = db.query(Department).filter(Department.id == dept_in.parent_id).first()
        if not parent:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Parent department not found.")
            
    # Check head_id user if specified
    if dept_in.head_id:
        head = db.query(User).filter(User.id == dept_in.head_id).first()
        if not head:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assigned head employee not found.")

    new_dept = Department(
        name=dept_in.name,
        code=dept_in.code,
        parent_id=dept_in.parent_id,
        head_id=dept_in.head_id,
        is_active=True
    )
    db.add(new_dept)
    db.commit()
    db.refresh(new_dept)
    return new_dept

@router.get("", response_model=List[DepartmentResponse])
def list_departments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return db.query(Department).all()

@router.get("/{id}", response_model=DepartmentResponse)
def get_department(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    dept = db.query(Department).filter(Department.id == id).first()
    if not dept:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Department not found.")
    return dept

@router.put("/{id}", response_model=DepartmentResponse)
def update_department(
    id: int,
    dept_in: DepartmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    dept = db.query(Department).filter(Department.id == id).first()
    if not dept:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Department not found.")

    if dept_in.parent_id is not None:
        if dept_in.parent_id == id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="A department cannot be its own parent.")
        parent = db.query(Department).filter(Department.id == dept_in.parent_id).first()
        if not parent:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Parent department not found.")
        dept.parent_id = dept_in.parent_id

    if dept_in.head_id is not None:
        head = db.query(User).filter(User.id == dept_in.head_id).first()
        if not head:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assigned head employee not found.")
        dept.head_id = dept_in.head_id

    if dept_in.name is not None:
        dept.name = dept_in.name

    if dept_in.is_active is not None:
        dept.is_active = dept_in.is_active

    db.commit()
    db.refresh(dept)
    return dept

@router.delete("/{id}", response_model=DepartmentResponse)
def deactivate_department(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    dept = db.query(Department).filter(Department.id == id).first()
    if not dept:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Department not found.")
    dept.is_active = False
    db.commit()
    db.refresh(dept)
    return dept
