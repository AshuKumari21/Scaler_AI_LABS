from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field

# --- Participant Schemas ---
class ParticipantBase(BaseModel):
    name: str
    email: Optional[str] = None

class ParticipantCreate(ParticipantBase):
    pass

class ParticipantResponse(ParticipantBase):
    id: str
    meeting_id: str

    model_config = ConfigDict(from_attributes=True)

# --- Transcript Segment Schemas ---
class TranscriptSegmentBase(BaseModel):
    speaker: str
    timestamp_seconds: int = 0
    text: str
    sequence_number: int = 0

class TranscriptSegmentCreate(TranscriptSegmentBase):
    pass

class TranscriptSegmentResponse(TranscriptSegmentBase):
    id: str
    meeting_id: str

    model_config = ConfigDict(from_attributes=True)

# --- Action Item Schemas ---
class ActionItemBase(BaseModel):
    task: str
    assignee: str = "Unassigned"
    due_date: Optional[str] = None
    completed: bool = False

class ActionItemCreate(ActionItemBase):
    pass

class ActionItemUpdate(BaseModel):
    task: Optional[str] = None
    assignee: Optional[str] = None
    due_date: Optional[str] = None
    completed: Optional[bool] = None

class ActionItemResponse(ActionItemBase):
    id: str
    meeting_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# --- Topic Schemas ---
class TopicBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: int = 0

class TopicCreate(TopicBase):
    pass

class TopicResponse(TopicBase):
    id: str
    meeting_id: str

    model_config = ConfigDict(from_attributes=True)

# --- Meeting Schemas ---
class MeetingBase(BaseModel):
    title: str
    meeting_date: datetime
    duration: str = "30 mins"
    summary: Optional[str] = None

class MeetingCreate(MeetingBase):
    participants: List[str] = Field(default_factory=list, description="List of participant names or emails")
    raw_transcript: Optional[str] = Field(default=None, description="Pasted formatted transcript text")

class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    meeting_date: Optional[datetime] = None
    duration: Optional[str] = None
    summary: Optional[str] = None
    participants: Optional[List[str]] = None

class MeetingResponse(MeetingBase):
    id: str
    created_at: datetime
    updated_at: datetime
    participants: List[ParticipantResponse] = []
    topics: List[TopicResponse] = []
    transcript_segments_count: int = 0

    model_config = ConfigDict(from_attributes=True)

class MeetingDetailResponse(MeetingResponse):
    transcript_segments: List[TranscriptSegmentResponse] = []
    action_items: List[ActionItemResponse] = []

    model_config = ConfigDict(from_attributes=True)
