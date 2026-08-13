from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Meeting, TranscriptSegment
from app.schemas import TranscriptSegmentResponse

router = APIRouter(prefix="/meetings", tags=["transcript"])

@router.get("/{meeting_id}/transcript", response_model=List[TranscriptSegmentResponse])
def get_meeting_transcript(meeting_id: str, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")

    segments = db.query(TranscriptSegment)\
        .filter(TranscriptSegment.meeting_id == meeting_id)\
        .order_by(TranscriptSegment.sequence_number)\
        .all()
    
    return segments
