import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, SessionLocal
from app.models import Meeting
from app.seed import seed_database
from app.routes import meetings, transcript, action_items, topics

app = FastAPI(
    title="MeetFlow API",
    description="FastAPI Backend for MeetFlow Meeting Transcription & Assistant Workspace",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event to ensure tables exist and initial seed data is populated
@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        count = db.query(Meeting).count()
        if count == 0:
            print("No meetings found in DB. Auto-running seed script...")
            seed_database()
    except Exception as e:
        print(f"Error checking database startup status: {e}")
    finally:
        db.close()

# Health check route
@app.get("/health", tags=["health"])
def health_check():
    return {
        "status": "ok",
        "service": "MeetFlow Backend API",
        "version": "1.0.0"
    }

# Register routers
app.include_router(meetings.router)
app.include_router(transcript.router)
app.include_router(action_items.router)
app.include_router(topics.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
