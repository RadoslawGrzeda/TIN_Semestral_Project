from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(
        prefix='/cars',
        tags=['car']
    )

@router.get('/',response_model=list[schemas.CarBase])
def get_cars(db:Session = Depends(get_db)):
    cars = db.query(models.Car).all()
    return cars

