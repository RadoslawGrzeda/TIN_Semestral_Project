from fastapi import FastAPI
import models
from database import engine
from routers import users

models.Base.metadata.create_all(bind=engine)
app = FastAPI()

app.include_router(users.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Car Rental Service API"}