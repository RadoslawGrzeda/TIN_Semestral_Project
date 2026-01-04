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

@router.post('/addCar',response_model=schemas.CarBase)
def add_car(car:schemas.CarBase,db: Session = Depends(get_db)):
    db_car=models.Car (
        brand=car.brand,
        model=car.model,
        production_year=car.production_year,
        daily_rental_price=car.daily_rental_price,
        description=car.description
    )
    db.add(db_car)
    db.commit()
    db.refresh(db_car)
    return db_car

