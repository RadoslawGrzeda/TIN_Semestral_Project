from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from database import get_db
import models, schemas
import hashlib

router=APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.get("/",response_model=schemas.UserPagination)
def get_users(skip: int = 0, limit: int = 10, db:Session=Depends(get_db)):
    users=db.query(models.User).offset(skip).limit(limit).all()
    count=db.query(models.User).count()
    return {"items": users, "total": count, "skip": skip, "limit": limit}   




@router.get("/showAllRelations", response_model=schemas.UserWithRentalsPagination)
def get_users_with_relations(skip: int = 0, limit: int = 10, db:Session=Depends(get_db)):
    users = db.query(models.User).options(joinedload(models.User.rentals).joinedload(models.Rental.car)).offset(skip).limit(limit).all()
    count = db.query(models.User).count()
    return {"items": users, "total": count, "skip": skip, "limit": limit}

@router.delete('/deleteUser/{user_id}')
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    reservation= db.query(models.Rental).filter(models.Rental.user_id == user_id).all()
    for r in reservation:
        db.delete(r)
    db.delete(user)

    db.commit()
    return {"detail": "User deleted successfully"}

@router.patch('/updateUser/{user_id}', response_model=schemas.UserResponse)
def update_user(user_id: int, user: schemas.UserBase, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    for key, value in user.dict(exclude_unset=True).items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post('/addUser',response_model=schemas.UserResponse)
def add_user(user:schemas.UserCreate,db:Session = Depends(get_db)):
    hashed = hashlib.sha256(user.password.encode('utf-8')).hexdigest()
    db_user=models.User(
        id=db.query(models.User.id).order_by(models.User.id.desc()).first().id + 1 if db.query(models.User.id).count()>0 else 1,
        username=user.username,
        email=user.email,
        date_of_birth=user.date_of_birth,
        hashed_password=hashed,
        role='user'
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/{user_id}", response_model=schemas.UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
