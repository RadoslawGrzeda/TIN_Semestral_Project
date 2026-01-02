from fastapi import FastAPI
import models
from database import engine
from routers import users,cars,rentals
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)
app = FastAPI()

app.include_router(users.router)
app.include_router(cars.router)
app.include_router(rentals.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # W produkcji podasz tu adres frontendu
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Car Rental Service API"}