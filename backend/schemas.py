from pydantic import BaseModel, Field, EmailStr, field_validator
from datetime import date
from typing import Optional
import re
import models

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

class UserBase(BaseModel):
    username: str = Field(..., description="The username of the user")
    email: EmailStr = Field(..., description="The email of the user")
    date_of_birth: date = Field(..., description="The date of birth of the user in YYYY-MM-DD format")
    role: str = Field(default='user')


    @field_validator('username')
    def username_alphanumeric(cls, v):
        if not re.match(r'^[a-zA-Z0-9_]+$', v):
            raise ValueError('Username must be alphanumeric')
        if not (4 <= len(v) <= 30):
            raise ValueError('Username must be between 4 and 30 characters long')
        return v

    @field_validator('date_of_birth')
    def check_age(cls, v):
        today = date.today()
        age = today.year - v.year - ((today.month, today.day) < (v.month, v.day))
        if age < 18:
            raise ValueError('User must be at least 18 years old')
        return v
        
    
class UserCreate(UserBase):
    password: str = Field(...,min_length=8, description="The password for the user")

    @field_validator('password')
    def password_strength(cls, v):
        if (len(v) < 8 or
            not re.search(r'[A-Z]', v) or
            not re.search(r'[a-z]', v) or
            not re.search(r'[0-9]', v) or
            not re.search(r'[\W_]', v)):
            raise ValueError('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character')
        return v

        
class UserResponse(UserBase):
    id: int = Field(..., description="The unique identifier of the user")

    class Config:
        from_attributes = True


class CarBase(BaseModel):
    brand: str = Field(..., description="The brand of the car")
    model: str = Field(..., description="The model of the car")
    production_year: int = Field(..., description="The production year of the car in YYYY-MM-DD format")
    daily_rental_price: float = Field(..., description="The daily rental price of the car")
    description: str  = Field(None, description="A brief description of the car")

    @field_validator('brand')
    def brand_length(cls, v):
        if not (2 <= len(v) <= 20):
            raise ValueError('brand name must be between 2 and 20 characters long')
        return v
    
    @field_validator('model')
    def model_length(cls, v):
        if not (2 <= len(v) <= 20):
            raise ValueError('Model name must be between 2 and 20 characters long')
        return v
    
    @field_validator('production_year')
    def valid_production_year(cls, v):
        # current_year = date.today().year
        today = date.today()
        if v < 2000 or v > today.year:
            raise ValueError(f'Production year must be between 2000 and {today.year}')
        return v

    @field_validator('daily_rental_price')
    def valid_price(cls, v):
        if v <= 100:
            raise ValueError('Daily rental price must be higher than 100')
        return v
    



class CarResponse(CarBase):
    id: int

    class Config:
        from_attributes = True



class RentalBase(BaseModel):
    user_id: int = Field(..., description="The ID of the user renting the car")
    car_id: int = Field(..., description="The ID of the car being rented")
    rental_start: date = Field(..., description="The start date of the rental in YYYY-MM-DD format")
    rental_end: Optional[date] = Field(None, description="The end date of the rental in YYYY-MM-DD format")


    @field_validator('rental_end')
    def check_rental_dates(cls, v, info):
        rental_start = info.data.get('rental_start')
        if v and rental_start and v < rental_start:
            raise ValueError("rental_end must be after rental_start")
        return v


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
class UserPagination(BaseModel):
    items: list[UserResponse]
    total: int
    skip: int
    limit: int

class CarPagination(BaseModel):
    items: list[CarResponse]
    total: int
    skip: int
    limit: int

class RentalPagination(BaseModel):
    items: list[RentalDetail]
    total: int
    skip: int
    limit: int

class RentalSimplePagination(BaseModel):
    items: list[RentalUpdate]
    total: int
    skip: int
    limit: int

class UserWithRentalsPagination(BaseModel):
    items: list[UserWithRentals]
    total: int
    skip: int
    limit: int

class CarsWithRentalsPagination(BaseModel):
    items: list[CarsWithRentals]
    total: int
    skip: int
    limit: int
