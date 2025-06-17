from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from .routes import game, webhooks

app = FastAPI()

app.add_middleware(
    CORSMiddleware, 
    allow_origins=['*'], 
    allow_credentials=True, 
    allow_methods=['*'],
    allow_headers=['*']
)

app.include_router(game.router, prefix='/api')
app.include_router(webhooks.router, prefix='/webhooks')