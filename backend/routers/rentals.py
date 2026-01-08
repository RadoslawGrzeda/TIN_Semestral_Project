from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(
    prefix='/rentals',
    tags=['rental']
)

@router.get('/',response_model=schemas.RentalSimplePagination)
def get_rentals(skip: int = 0, limit: int = 10, db:Session = Depends(get_db)):
    rentals = db.query(models.Rental).offset(skip).limit(limit).all()
    count = db.query(models.Rental).count()
    return {"items": rentals, "total": count, "skip": skip, "limit": limit}

@router.get('/detailedList',response_model=schemas.RentalPagination)
def get_detailed_rentals(skip: int = 0, limit: int = 10, db:Session = Depends(get_db)):
    rentals = db.query(models.Rental).offset(skip).limit(limit).all()
    count = db.query(models.Rental).count()
    return {"items": rentals, "total": count, "skip": skip, "limit": limit}

@router.get('/{rental_id}', response_model=schemas.RentalBase)
def get_rental(rental_id: int, db: Session = Depends(get_db)):
    rental = db.query(models.Rental).filter(models.Rental.id == rental_id).first()
    if not rental:
        raise HTTPException(status_code=404, detail="Rental not found")
    return rental

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
    rental=db.query(models.Rental).filter(models.Rental.id==rental_id).first()
    if not rental:
        raise HTTPException(status_code=404, detail="Rental not found")
    db.delete(rental)
    db.commit()
    return {'detail': "rental deleted"}

@router.patch('/updateRental/{rental_id}', response_model=schemas.RentalBase)
def update_rental(rental_id:int, rental:schemas.RentalBase,db:Session=Depends(get_db)):
    db_rental=db.query(models.Rental).filter(models.Rental.id==rental_id).first()
    if not db_rental:
        raise HTTPException(status_code=404, detail="Rental not found")
    
    db_rental.id=db_rental.id
    db_rental.user_id=rental.user_id
    db_rental.car_id=rental.car_id
    db_rental.rental_start=rental.rental_start
    db_rental.rental_end=rental.rental_end
    
    db.commit()
    db.refresh(db_rental)
    
    return db_rental