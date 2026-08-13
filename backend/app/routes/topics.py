from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Meeting, Topic
from app.schemas import TopicResponse

router = APIRouter(prefix="/meetings", tags=["topics"])

@router.get("/{meeting_id}/topics", response_model=List[TopicResponse])
def get_meeting_topics(meeting_id: str, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")

    topics = db.query(Topic)\
        .filter(Topic.meeting_id == meeting_id)\
        .order_by(Topic.start_time)\
        .all()
    
    return topics
