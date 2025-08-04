from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router as api_router

app = FastAPI()

origins = [
    "http://localhost:3000",   
    "http://127.0.0.1:3000",
    "https://your-frontend-domain.com",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,           
    allow_credentials=True,
    allow_methods=["*"],            
    allow_headers=["*"],             
)

app.include_router(api_router)
