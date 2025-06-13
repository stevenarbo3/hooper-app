from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..database.db import (
    get_comparison_quota,
    create_comparison,
    create_game,
    create_comparison_quota,
    reset_quota_if_needed,
    get_user_games
)
from ..ai_generator import generate_comparison_with_ai
from ..utils import authenticate_and_get_user_details
from ..database.models import get_db
import json
from datetime import datetime, date

router = APIRouter()

class StatLine(BaseModel):
    points: int
    assists: int
    rebounds: int

class ComparisonRequest(StatLine):
    era: str
    
    class Config:
        json_schema_extra = {'example': {'era': 'All-Time'}}
        
class GameRequest(BaseModel):
    points: int
    assists: int
    rebounds: int
    game_date: date
    

@router.post('/generate-comparison')
async def generate_comparison(request: ComparisonRequest, request_obj: Request, db: Session = Depends(get_db)):
    try:
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details.get('user_id')
        if user_id is None:
            raise HTTPException(status_code=401, detail='User ID not found in authentication details')
        
        quota = get_comparison_quota(db, user_id)
        if not quota:
            quota = create_comparison_quota(db, user_id)
            
        quota = reset_quota_if_needed(db, quota)
        
        if quota.remaining_quota <= 0:
            raise HTTPException(status_code=429, detail='quota exhausted')
        
        comparison_data = generate_comparison_with_ai(request.era, request.points, request.rebounds, request.assists)
        
        new_comparison = create_comparison(
            db=db,
            era=request.era,
            created_by=user_id,
            **comparison_data
        )
        
        quota.remaining_quota -= 1
        db.commit()
        
        return {
            'id': new_comparison.id,
            'era': request.era,
            'player_name': new_comparison.player_name,
            'explanation': new_comparison.explanation,
            'timestamp': new_comparison.date_created.isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.post('/game')
async def create_game_route(request: GameRequest, request_obj: Request, db: Session = Depends(get_db)):
    try:
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details.get('user_id')
        
        new_game = create_game(
            db=db,
            created_by=user_id,
            points=request.points,
            rebounds=request.rebounds,
            assists=request.assists,
            game_date=request.game_date
        )
        
        db.commit()
        
        return {
            'id': new_game.id,
            'points': new_game.points,
            'rebounds': new_game.rebounds,
            'assists': new_game.assists,
            'game_date': new_game.game_date
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get('/my-history')
async def my_history(request: Request, db: Session = Depends(get_db)):
    user_details = authenticate_and_get_user_details(request)
    user_id = user_details.get('user_id')
    
    games = get_user_games(db, user_id)
    return {'games': games}


@router.get('/quota')
async def get_quota(request: Request, db: Session = Depends(get_db)):
    user_details = authenticate_and_get_user_details(request)
    user_id = user_details.get('user_id')
    
    quota = get_comparison_quota(db, user_id)
    if not quota:
        return {
            'user_id': user_id,
            'quota_remaining': 0,
            'last_reset_date': datetime.now()
        }
    quota = reset_quota_if_needed(db, quota)
    return quota
    