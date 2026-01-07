
from sqlalchemy import Column, Integer, String, Date,Double,Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy.ext.declarative import declarative_base

Base=declarative_base()
class User(Base):
    __tablename__='users'

    id = Column(Integer,primary_key=True)
    username = Column(String(25),nullable=False)
    email = Column(String(25),unique=True,nullable=False)
    date_of_birth=Column(Date,nullable=False)
    hashed_password=Column(String(255),nullable=False)
    role=Column(String(25),nullable=False,default='user')
    
    rentals=relationship("Rental",back_populates="user")

class Car(Base):
    __tablename__='cars'

    id=Column(Integer,primary_key=True)
    brand=Column(String(25),nullable=False)
    model=Column(String(25),nullable=False)
    production_year=Column(Integer,nullable=False)
    daily_rental_price=Column(Float,nullable=False)
    description=Column(String(150),nullable=True)
    
    rentals=relationship("Rental",back_populates="car")

class Rental(Base):
    __tablename__='rentals'

    id=Column(Integer,primary_key=True)
    user_id=Column(Integer,ForeignKey('users.id'), nullable=False)
    car_id=Column(Integer,ForeignKey('cars.id'),nullable=False)
    rental_start=Column(Date,nullable=False)
    rental_end=Column(Date,nullable=True)

    user=relationship("User",back_populates="rentals")
    car=relationship("Car",back_populates="rentals")