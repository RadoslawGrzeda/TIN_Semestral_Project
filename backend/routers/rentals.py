from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(
    prefix='/rentals',
    tags=['rental']
)

@router.get('/',response_model=list[schemas.RentalBase])
def get_rentals(db:Session = Depends(get_db)):
    rentals = db.query(models.Rental).all()
    return rentals



@router.post('/addRental',response_model=schemas.RentalBase)
def addRental(rental:schemas.RentalBase,db:Session = Depends(get_db)):
    db_rental=models.Rental (
        id=db.query(models.Rental.id).order_by(models.Rental.id.desc()).first().id+1 if db.query(models.Rental.id).count()>0 else 1,
        user_id=rental.user_id,
        car_id=rental.car_id,
        rental_start=rental.rental_start,
        rental_end=rental.rental_end
    )
    db.add(db_rental)
    db.commit()
    db.refresh(db_rental)
    return db_rental

@router.delete('/deleteRental/{rental_id}')
def deleteRental(rental_id:int ,db:Session=Depends(get_db)):
    rental=db.query(models.Rental).filter(models.Rental.id==rental_id).all()
    db.delete(rental)
    db.commit()
    return {'detail': "rental deleted"}