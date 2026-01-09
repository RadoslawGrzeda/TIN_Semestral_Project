from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(
        prefix='/cars',
        tags=['car']
    )

@router.get('/',response_model=schemas.CarPagination)
def get_cars(skip: int = 0, limit: int = 10, db:Session = Depends(get_db)):
    cars = db.query(models.Car).offset(skip).limit(limit).all()
    count = db.query(models.Car).count()
    return {"items": cars, "total": count, "skip": skip, "limit": limit}




@router.get("/showAllRelations", response_model=schemas.CarsWithRentalsPagination)
def get_cars_with_relations(skip: int = 0, limit: int = 10, db:Session=Depends(get_db)):
    cars=db.query(models.Car).offset(skip).limit(limit).all()
    count = db.query(models.Car).count()
    result=[]
    for car in cars:
        rentals_out=[]
        for r in car.rentals:
            user = db.query(models.User).filter(models.User.id == r.user_id).first()
            user_obj = None
            if user:
                user_obj = {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "date_of_birth": user.date_of_birth,
                    "role": user.role
                }
            rentals_out.append({
                "id":r.id,
                "rental_start":r.rental_start,
                "rental_end":r.rental_end,
                "user":user_obj # Pydantic expects a valid object or dict, but if user is None, it might fail depending on schema.
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
    return {"items": result, "total": count, "skip": skip, "limit": limit}

@router.get('/{car_id}', response_model=schemas.CarBase)
def get_car(car_id: int, db: Session = Depends(get_db)):
    car = db.query(models.Car).filter(models.Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    return car

@router.post('/addCar',response_model=schemas.CarBase)
def add_car(car:schemas.CarBase,db: Session = Depends(get_db)):
    db_car=models.Car(
        id=db.query(models.Car.id).order_by(models.Car.id.desc()).first().id +1 if db.query(models.Car.id).count()>0 else 1,
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

@router.delete('/deleteCar/{car_id}')
def delete_car(car_id: int, db: Session = Depends(get_db)):
    car = db.query(models.Car).filter(models.Car.id==car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    reservation = db.query(models.Rental).filter(models.Rental.car_id==car_id).all()
    for i in reservation:
        db.delete(i)
    db.delete(car)
    db.commit()
    return {"detail":"Car deleted successfully"}

@router.patch('/updateCar/{car_id}', response_model=schemas.CarBase)
def update_car(car_id: int, car: schemas.CarBase, db: Session = Depends(get_db)):
    db_car = db.query(models.Car).filter(models.Car.id == car_id).first()
    if not db_car:
        raise HTTPException(status_code=404, detail="Car not found")
    
    db_car.brand = car.brand
    db_car.model = car.model
    db_car.production_year = car.production_year
    db_car.daily_rental_price = car.daily_rental_price
    db_car.description = car.description

    db.commit()
    db.refresh(db_car)
    return db_car
    
