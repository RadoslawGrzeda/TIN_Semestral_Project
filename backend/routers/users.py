from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router=APIRouter(
    prefix="/users",
    tags=["users"]
)
@router.get("/",response_model=list[schemas.UserResponse])
def get_users(db:Session=Depends(get_db)):
    users=db.query(models.User).all()
    return users   
