from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
import hashlib 
from datetime import date

# Ensure tables exist
models.Base.metadata.create_all(bind=engine)

def seed_data():
    db: Session = SessionLocal()

    # Check if admin exists
    if db.query(models.User).filter(models.User.email == 'admin@carrental.pl').first():
        print("Data already seeded.")
        db.close()
        return

    print("Seeding data...")

    # Users
    # Hasła: admin -> Admin123!
    # User -> User123!
    
    # Hash SHA-256 for 'Admin123!'
    admin_hash = hashlib.sha256('Admin123!'.encode('utf-8')).hexdigest()
    # Hash SHA-256 for 'User123!'
    user_hash = hashlib.sha256('User123!'.encode('utf-8')).hexdigest()

    admin = models.User(
        username='admin',
        email='admin@carrental.pl',
        date_of_birth=date(1988, 3, 12),
        hashed_password=admin_hash,
        role='admin'
    )
    user1 = models.User(
        username='jan_kowalski',
        email='jan.k@gmail.com',
        date_of_birth=date(1995, 11, 20),
        hashed_password=user_hash,
        role='user'
    )
    user2 = models.User(
        username='anna_nowak',
        email='anna.n@yahoo.com',
        date_of_birth=date(1990, 7, 15),
        hashed_password=user_hash,
        role='user'
    )
    
    db.add_all([admin, user1, user2])
    db.commit()

    # Cars
    car1 = models.Car(brand='Toyota', model='Corolla', production_year=2022, daily_rental_price=150.00, description='Niezawodny sedan')
    car2 = models.Car(brand='Tesla', model='Model 3', production_year=2023, daily_rental_price=450.00, description='Elektryczny')
    car3 = models.Car(brand='BMW', model='X5', production_year=2021, daily_rental_price=350.00, description='SUV')
    car4 = models.Car(brand='Ford', model='Focus', production_year=2020, daily_rental_price=120.00, description='Hatchback')
    
    db.add_all([car1, car2, car3, car4])
    db.commit()

    # Rentals
    # User ID 2 (user1) -> Car 1
    r1 = models.Rental(user_id=2, car_id=1, rental_start=date(2024, 1, 10), rental_end=date(2024, 1, 15))
    # User ID 2 (user1) -> Car 3
    r2 = models.Rental(user_id=2, car_id=3, rental_start=date(2024, 2, 1), rental_end=None)
    
    db.add_all([r1, r2])
    db.commit()

    print("Seeding complete.")
    db.close()

if __name__ == "__main__":
    seed_data()
