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