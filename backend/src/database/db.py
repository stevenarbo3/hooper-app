from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from . import models


def get_comparison_quota(db: Session, user_id):
    return (db.query(models.ComparisonQuota)
            .filter(models.ComparisonQuota.user_id == user_id)
            .first())
    
    
def create_comparison_quota(db: Session, user_id):
    db_quota = models.ComparisonQuota(user_id=user_id)
    db.add(db_quota)
    db.commit()
    db.refresh(db_quota)
    
    return db_quota


def reset_quota_if_needed(db: Session, quota: models.ComparisonQuota):
    now = datetime.now()
    if now - quota.last_reset_date > timedelta(hours=24): # type: ignore
        quota.remaining_quota = 10
        quota.last_reset_date = datetime.now() # type: ignore
        db.commit()
        db.refresh(quota)
        
    return quota

def create_comparison(
    db: Session,
    era: str,
    created_by: str,
    player_name: str,
    explanation: str
):
    db_comparison = models.Comparison(
        era=era,
        created_by=created_by,
        player_name=player_name,
        explanation=explanation
    )
    db.add(db_comparison)
    db.commit()
    db.refresh(db_comparison)
    return db_comparison


def create_game(
    db: Session,
    points,
    rebounds,
    assists,
    created_by,
    game_date
):
    db_game = models.Game(
        points=points,
        rebounds=rebounds,
        assists=assists,
        created_by=created_by,
        game_date=game_date
    )
    db.add(db_game)
    db.commit()
    db.refresh(db_game)
    return db_game    


def get_user_games(db: Session, user_id):
    return (db.query(models.Game)
            .filter(models.Game.created_by == user_id)
            .all())