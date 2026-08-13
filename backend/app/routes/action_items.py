from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Meeting, ActionItem
from app.schemas import ActionItemCreate, ActionItemUpdate, ActionItemResponse

router = APIRouter(tags=["action-items"])

@router.post("/meetings/{meeting_id}/action-items", response_model=ActionItemResponse, status_code=status.HTTP_201_CREATED)
def create_action_item(meeting_id: str, data: ActionItemCreate, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")

    action_item = ActionItem(
        meeting_id=meeting_id,
        task=data.task,
        assignee=data.assignee,
        due_date=data.due_date,
        completed=data.completed
    )
    db.add(action_item)
    db.commit()
    db.refresh(action_item)
    return action_item

@router.put("/action-items/{action_item_id}", response_model=ActionItemResponse)
def update_action_item(action_item_id: str, data: ActionItemUpdate, db: Session = Depends(get_db)):
    action_item = db.query(ActionItem).filter(ActionItem.id == action_item_id).first()
    if not action_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Action item not found")

    if data.task is not None:
        action_item.task = data.task
    if data.assignee is not None:
        action_item.assignee = data.assignee
    if data.due_date is not None:
        action_item.due_date = data.due_date
    if data.completed is not None:
        action_item.completed = data.completed

    action_item.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(action_item)
    return action_item

@router.delete("/action-items/{action_item_id}", status_code=status.HTTP_200_OK)
def delete_action_item(action_item_id: str, db: Session = Depends(get_db)):
    action_item = db.query(ActionItem).filter(ActionItem.id == action_item_id).first()
    if not action_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Action item not found")

    db.delete(action_item)
    db.commit()
    return {"message": "Action item deleted successfully", "id": action_item_id}
