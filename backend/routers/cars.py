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

@router.get('/showAllRelations', response_model=list[schemas.CarWithRentals])
def get_cars_with_relations(db:Session=Depends(get_db)):
    cars=db.query(models.Car).all()
    result=[]
    for car in cars:
        rentals_out=[]
        for r in cars.rentals:
            user=db.query(models.car).filter(models.User.c==r.user_id).first()
            user_obj=None
            if user:
                user_obj={
                    "id":user.id,
                    "username":user.username,
                    "email":user.email,
                    "date_of_birth":user.date_of_birth
                }
            rentals_out.append({
                "id":r.id,
                "rental_start":r.rental_start,
                "rental_end":r.rental_end,
                "user":user_obj
            })
        car_obj={
            "id":car.id,
            "brand":car.brand,
            "model":car.model,
            "production_year":car.production_year,
            "daily_rental_price":car.daily_rental_price,
            "description":car.description,
            "rentals":rentals_out
        }
        result.append(car_obj)
    return result

@router.post('/addCar',response_model=schemas.CarBase)
def add_car(car:schemas.CarBase,db: Session = Depends(get_db)):
    db_car=models.Car(
        id=db.query(models.Car.id).max().scalar()+1 if db.query(models.Car.id).count()>0 else 1,
        brand=car.brand,
        model=car.model,
        production_year=car.production_year,
        daily_rental_price=car.daily_rental_price,
        description=car.description,
        role='user'
    )
    db.add(db_car)
    db.commit()
    db.refresh(db_car)
    return db_car

