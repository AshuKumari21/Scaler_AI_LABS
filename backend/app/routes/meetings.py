import re
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc

from app.database import get_db
from app.models import Meeting, Participant, TranscriptSegment, ActionItem, Topic
from app.schemas import (
    MeetingCreate,
    MeetingUpdate,
    MeetingResponse,
    MeetingDetailResponse,
)

router = APIRouter(prefix="/meetings", tags=["meetings"])

def parse_time_str(time_str: str) -> int:
    """Converts HH:MM:SS or MM:SS timestamp string to total seconds."""
    parts = time_str.strip().split(":")
    try:
        if len(parts) == 3:
            return int(parts[0]) * 3600 + int(parts[1]) * 60 + int(parts[2])
        elif len(parts) == 2:
            return int(parts[0]) * 60 + int(parts[1])
        elif len(parts) == 1:
            return int(parts[0])
    except ValueError:
        return 0
    return 0

def parse_transcript_text(raw_text: str) -> List[dict]:
    """
    Parses pasted transcript string format into transcript segment dicts.
    Supports formats like:
    [00:12] Sarah:
    Spoken text...
    OR
    00:12 John Doe: Good morning.
    """
    if not raw_text or not raw_text.strip():
        return []

    lines = [l.strip() for l in raw_text.strip().split("\n") if l.strip()]
    segments = []
    current_speaker = "Speaker"
    current_timestamp = 0
    current_text_lines = []
    seq_num = 0

    header_pattern = re.compile(r'^(?:\[?(\d{1,2}:\d{2}(?::\d{2})?)\]?\s*)?(?:([^:]+):)?\s*(.*)$')

    for line in lines:
        match = header_pattern.match(line)
        if match:
            time_part, speaker_part, text_part = match.groups()
            
            # If line has clear timestamp or speaker header
            if (time_part or speaker_part) and text_part:
                if current_text_lines:
                    segments.append({
                        "speaker": current_speaker,
                        "timestamp_seconds": current_timestamp,
                        "text": " ".join(current_text_lines),
                        "sequence_number": seq_num
                    })
                    seq_num += 1
                    current_text_lines = []
                
                if time_part:
                    current_timestamp = parse_time_str(time_part)
                if speaker_part:
                    current_speaker = speaker_part.strip()
                current_text_lines.append(text_part.strip())
                continue
            elif (time_part or speaker_part) and not text_part:
                if current_text_lines:
                    segments.append({
                        "speaker": current_speaker,
                        "timestamp_seconds": current_timestamp,
                        "text": " ".join(current_text_lines),
                        "sequence_number": seq_num
                    })
                    seq_num += 1
                    current_text_lines = []
                
                if time_part:
                    current_timestamp = parse_time_str(time_part)
                if speaker_part:
                    current_speaker = speaker_part.strip()
                continue
        
        current_text_lines.append(line)

    if current_text_lines:
        segments.append({
            "speaker": current_speaker,
            "timestamp_seconds": current_timestamp,
            "text": " ".join(current_text_lines),
            "sequence_number": seq_num
        })

    return segments

def format_meeting_response(meeting: Meeting) -> dict:
    return {
        "id": meeting.id,
        "title": meeting.title,
        "meeting_date": meeting.meeting_date,
        "duration": meeting.duration,
        "summary": meeting.summary,
        "created_at": meeting.created_at,
        "updated_at": meeting.updated_at,
        "participants": [
            {"id": p.id, "meeting_id": p.meeting_id, "name": p.name, "email": p.email}
            for p in meeting.participants
        ],
        "transcript_segments_count": len(meeting.transcript_segments)
    }

@router.get("", response_model=List[MeetingResponse])
def get_meetings(
    q: Optional[str] = Query(None, description="Search query against title or participant name"),
    participant: Optional[str] = Query(None, description="Filter by participant name"),
    sort_by: str = Query("newest", description="Sorting option: newest, oldest, duration"),
    db: Session = Depends(get_db)
):
    query = db.query(Meeting)

    if q and q.strip():
        search_term = f"%{q.strip()}%"
        # Match meeting title or participant names
        query = query.outerjoin(Meeting.participants).filter(
            or_(
                Meeting.title.ilike(search_term),
                Participant.name.ilike(search_term)
            )
        ).distinct()

    if participant and participant.strip():
        part_term = f"%{participant.strip()}%"
        query = query.outerjoin(Meeting.participants).filter(
            Participant.name.ilike(part_term)
        ).distinct()

    if sort_by == "oldest":
        query = query.order_by(asc(Meeting.meeting_date))
    elif sort_by == "duration":
        query = query.order_by(desc(Meeting.duration))
    else:  # newest default
        query = query.order_by(desc(Meeting.meeting_date))

    meetings = query.all()
    return [format_meeting_response(m) for m in meetings]

@router.get("/{meeting_id}", response_model=MeetingDetailResponse)
def get_meeting_by_id(meeting_id: str, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")
    
    return {
        "id": meeting.id,
        "title": meeting.title,
        "meeting_date": meeting.meeting_date,
        "duration": meeting.duration,
        "summary": meeting.summary,
        "created_at": meeting.created_at,
        "updated_at": meeting.updated_at,
        "participants": [
            {"id": p.id, "meeting_id": p.meeting_id, "name": p.name, "email": p.email}
            for p in meeting.participants
        ],
        "transcript_segments_count": len(meeting.transcript_segments),
        "transcript_segments": [
            {
                "id": s.id,
                "meeting_id": s.meeting_id,
                "speaker": s.speaker,
                "timestamp_seconds": s.timestamp_seconds,
                "text": s.text,
                "sequence_number": s.sequence_number
            }
            for s in meeting.transcript_segments
        ],
        "action_items": [
            {
                "id": a.id,
                "meeting_id": a.meeting_id,
                "task": a.task,
                "assignee": a.assignee,
                "due_date": a.due_date,
                "completed": a.completed,
                "created_at": a.created_at,
                "updated_at": a.updated_at
            }
            for a in meeting.action_items
        ],
        "topics": [
            {
                "id": t.id,
                "meeting_id": t.meeting_id,
                "title": t.title,
                "description": t.description,
                "start_time": t.start_time
            }
            for t in meeting.topics
        ]
    }

@router.post("", response_model=MeetingDetailResponse, status_code=status.HTTP_201_CREATED)
def create_meeting(data: MeetingCreate, db: Session = Depends(get_db)):
    new_meeting = Meeting(
        title=data.title,
        meeting_date=data.meeting_date,
        duration=data.duration,
        summary=data.summary or f"Meeting discussion regarding {data.title}. Key decisions and action items were reviewed by participants."
    )
    db.add(new_meeting)
    db.flush()

    # Add participants
    for name_or_email in data.participants:
        clean_str = name_or_email.strip()
        if clean_str:
            p_name = clean_str.split("<")[0].strip() if "<" in clean_str else clean_str
            p_email = clean_str.split("<")[1].replace(">", "").strip() if "<" in clean_str else None
            db.add(Participant(meeting_id=new_meeting.id, name=p_name, email=p_email))

    # Parse and add transcript segments if provided
    segments_data = []
    if data.raw_transcript and data.raw_transcript.strip():
        segments_data = parse_transcript_text(data.raw_transcript)
        for seg in segments_data:
            db.add(TranscriptSegment(
                meeting_id=new_meeting.id,
                speaker=seg["speaker"],
                timestamp_seconds=seg["timestamp_seconds"],
                text=seg["text"],
                sequence_number=seg["sequence_number"]
            ))

    # Generate basic topics if segments exist
    if segments_data:
        topic_count = min(3, len(segments_data))
        step = max(1, len(segments_data) // topic_count)
        for i in range(topic_count):
            idx = i * step
            if idx < len(segments_data):
                db.add(Topic(
                    meeting_id=new_meeting.id,
                    title=f"Discussion Topic {i+1}",
                    description=segments_data[idx]["text"][:80] + "...",
                    start_time=segments_data[idx]["timestamp_seconds"]
                ))
    else:
        # Default topic
        db.add(Topic(
            meeting_id=new_meeting.id,
            title="General Overview",
            description="Introduction and preliminary discussion",
            start_time=0
        ))

    db.commit()
    db.refresh(new_meeting)
    return get_meeting_by_id(new_meeting.id, db)

@router.put("/{meeting_id}", response_model=MeetingDetailResponse)
def update_meeting(meeting_id: str, data: MeetingUpdate, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")

    if data.title is not None:
        meeting.title = data.title
    if data.meeting_date is not None:
        meeting.meeting_date = data.meeting_date
    if data.duration is not None:
        meeting.duration = data.duration
    if data.summary is not None:
        meeting.summary = data.summary

    if data.participants is not None:
        # Delete old participants and add updated ones
        db.query(Participant).filter(Participant.meeting_id == meeting_id).delete()
        for name_or_email in data.participants:
            clean_str = name_or_email.strip()
            if clean_str:
                p_name = clean_str.split("<")[0].strip() if "<" in clean_str else clean_str
                p_email = clean_str.split("<")[1].replace(">", "").strip() if "<" in clean_str else None
                db.add(Participant(meeting_id=meeting.id, name=p_name, email=p_email))

    meeting.updated_at = datetime.utcnow()
    db.commit()
    return get_meeting_by_id(meeting_id, db)

@router.delete("/{meeting_id}", status_code=status.HTTP_200_OK)
def delete_meeting(meeting_id: str, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")

    db.delete(meeting)
    db.commit()
    return {"message": "Meeting deleted successfully", "id": meeting_id}
