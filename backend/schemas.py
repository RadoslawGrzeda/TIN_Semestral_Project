from pydantic import BaseModel, Field, EmailStr, model_validator
from datetime import date
from typing import Optional

class UserBase(BaseModel):
    username: str = Field(..., description="The username of the user")
    email: EmailStr = Field(..., description="The email of the user")
    date_of_birth: date = Field(..., description="The date of birth of the user in YYYY-MM-DD format")
    role: str = Field(default='user')

class UserCreate(UserBase):
    password: str = Field(...,min_length=8, description="The password for the user")

class UserResponse(UserBase):
    id: int = Field(..., description="The unique identifier of the user")

    class Config:
        from_attributes = True

    

    

class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, description="The username of the user")
    email: Optional[EmailStr] = Field(None, description="The email of the user")
    date_of_birth: Optional[date] = Field(None, description="The date of birth of the user in YYYY-MM-DD format")
    role: Optional[str] = Field(None, description="The role of the user")
    class Config:
        from_attributes = True

class CarBase(BaseModel):
    brand: str = Field(..., description="The brand of the car")
    model: str = Field(..., description="The model of the car")
    production_year: date = Field(..., description="The production year of the car in YYYY-MM-DD format")
    daily_rental_price: float = Field(..., description="The daily rental price of the car")
    description: str  = Field(None, description="A brief description of the car")


class CarResponse(CarBase):
    id: int

    class Config:
        from_attributes = True



class RentalBase(BaseModel):
    user_id: int = Field(..., description="The ID of the user renting the car")
    car_id: int = Field(..., description="The ID of the car being rented")
    rental_start: date = Field(..., description="The start date of the rental in YYYY-MM-DD format")
    rental_end: Optional[date] = Field(None, description="The end date of the rental in YYYY-MM-DD format")

    @model_validator(mode='after')
    def check_dates(self):
        if self.rental_end and self.rental_start:
            if self.rental_end < self.rental_start:
                raise ValueError("rental_end must be after rental_start")
        return self

class RentalUpdate(RentalBase):
    id: int= Field(..., description="The unique identifier of the rental")

class RentalDetail(RentalBase):
    car: CarResponse
    user: UserResponse

class RentalOut(BaseModel):
    id: int
    rental_start: date
    rental_end: Optional[date] = None
    car: CarResponse

    class Config:
        from_attributes = True

class RentalOutUser(BaseModel):
    id: int
    rental_start: date
    rental_end: Optional[date] = None
    user: UserResponse

    class Config:
        from_attributes = True

class CarsWithRentals(CarResponse):
    rentals: list[RentalOutUser] = []

    class Config:
        from_attributes = True



class UserWithRentals(UserResponse):
    rentals: list[RentalOut] = []

    class Config:
        from_attributes = True