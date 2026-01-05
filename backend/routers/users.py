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

@router.get("/showAllRelations", response_model=list[schemas.UserWithRentals])
def get_users_with_relations(db:Session=Depends(get_db)):
    users = db.query(models.User).all()
    result = []
    for user in users:
        rentals_out = []
        for r in user.rentals:
            car = db.query(models.Car).filter(models.Car.id == r.car_id).first()
            car_obj = None
            if car:
                car_obj = {
                    "id": car.id,
                    "brand": car.brand,
                    "model": car.model,
                    "production_year": car.production_year,
                    "daily_rental_price": car.daily_rental_price,
                    "description": car.description
                }
            rentals_out.append({
                "id": r.id,
                "rental_start": r.rental_start,
                "rental_end": r.rental_end,
                "car": car_obj
            })

        user_obj = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "date_of_birth": user.date_of_birth,
            "role": user.role,
            "rentals": rentals_out
        }
        result.append(user_obj)
    return result

@router.post('/addUser',response_model=schemas.UserResponse)
def add_user(user:schemas.UserCreate,db:Session = Depends(get_db)):
    hashed = hashlib.sha256(user.password.encode('utf-8')).hexdigest()
    db_user=models.User(
        id=db.query(models.User.id).max().scalar()+1 if db.query(models.User.id).count()>0 else 1,
        username=user.username,
        email=user.email,
        date_of_birth=user.date_of_birth,
        hashed_password=hashed,
        # role='user'
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
