from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy.ext.declarative import declarative_base

Base=declarative_base()
class User(Base):
    __tablename__='users'

    id = Column(Integer,primary_key=True)
    username = Column(String,nullable=False)
    email = Column(String,unique=True,nullable=False)
    date_of_birth=Column(Date,nullable=False)
    hashed_password=Column(String,nullable=False)
    role=Column(String,nullable=False,default='user')
    
    rentals=relationship("Rental",back_populates="user")

class Car(Base):
    __tablename__='cars'

    id=Column(Integer,primary_key=True)
    brand=Column(String,nullable=False)
    model=Column(String,nullable=False)
    production_year=Column(Date,nullable=False)
    
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