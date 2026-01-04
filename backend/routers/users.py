from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
import hashlib

router=APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.get("/",response_model=list[schemas.UserResponse])
def get_users(db:Session=Depends(get_db)):
    users=db.query(models.User).all()
    return users   


@router.post('/addUser',response_model=schemas.UserResponse)
def add_user(user:schemas.UserCreate,db:Session = Depends(get_db)):
    # Hash password using SHA256 (stdlib) before storing
    hashed = hashlib.sha256(user.password.encode('utf-8')).hexdigest()
    db_user=models.User(
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
