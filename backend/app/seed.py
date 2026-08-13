import sys
from datetime import datetime, timedelta
from app.database import engine, Base, SessionLocal
from app.models import Meeting, Participant, TranscriptSegment, ActionItem, Topic

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Clear existing data if any
    db.query(Topic).delete()
    db.query(ActionItem).delete()
    db.query(TranscriptSegment).delete()
    db.query(Participant).delete()
    db.query(Meeting).delete()
    db.commit()

    print("Seeding SQLite database with initial meeting dataset...")

    now = datetime.utcnow()

    # Seed Data Definition
    meetings_data = [
        {
            "title": "Weekly Product Sync",
            "meeting_date": now - timedelta(days=1, hours=2),
            "duration": "25 mins",
            "summary": "The product team reviewed Q3 roadmap progress, frontend layout updates for the analytics dashboard, and customer feedback regarding performance. Decided to prioritize mobile responsiveness and real-time audio playback synchronization.",
            "participants": [
                {"name": "John Doe", "email": "john.doe@meetflow.io"},
                {"name": "Sarah Connor", "email": "sarah.c@meetflow.io"},
                {"name": "Mike Ross", "email": "mike.r@meetflow.io"},
                {"name": "Elena Rostova", "email": "elena.r@meetflow.io"}
            ],
            "topics": [
                {"title": "Q3 Product Roadmap Review", "description": "Status update on core feature deliverables for Q3", "start_time": 0},
                {"title": "Dashboard UI & UX Enhancements", "description": "Discussion on Fireflies-inspired sidebar and responsive cards", "start_time": 180},
                {"title": "Performance & Load Times", "description": "Analyzing database indexing and API endpoint latency", "start_time": 450},
                {"title": "Action Items & Next Steps", "description": "Assigning owner tasks for upcoming sprint release", "start_time": 720}
            ],
            "action_items": [
                {"task": "Finalize Q3 feature specification document", "assignee": "Sarah Connor", "due_date": "2026-08-20", "completed": True},
                {"task": "Optimize SQLite database indexing for search queries", "assignee": "Mike Ross", "due_date": "2026-08-18", "completed": False},
                {"task": "Update Figma design tokens for dark theme support", "assignee": "Elena Rostova", "due_date": "2026-08-22", "completed": False},
                {"task": "Review API error handling and CORS policies", "assignee": "John Doe", "due_date": "2026-08-16", "completed": True}
            ],
            "segments": [
                (0, "John Doe", "Good morning team! Let's kick off our Weekly Product Sync."),
                (15, "Sarah Connor", "Morning John! I've prepared the Q3 roadmap update summary."),
                (35, "Mike Ross", "Hey everyone. Excited to share the progress on the FastAPI backend."),
                (60, "Elena Rostova", "Hi team! I've updated the component library for the meeting detail page."),
                (90, "John Doe", "Great. Sarah, could you start by running us through the roadmap milestones?"),
                (120, "Sarah Connor", "Sure! We're on track with 85% of our core sprint goals. The main highlight is the transcript sync feature."),
                (180, "Mike Ross", "The transcript sync works by mapping audio timestamps directly to segment sequence numbers."),
                (240, "Elena Rostova", "From a design perspective, we ensured high visual contrast and fluid transitions during seeking."),
                (310, "John Doe", "That's fantastic. How is the backend handling large transcript payloads?"),
                (370, "Mike Ross", "FastAPI paired with SQLAlchemy handles parsing and persisting 500+ segments in under 40 milliseconds."),
                (450, "Sarah Connor", "What about customer feedback from the beta testers? Any major concerns?"),
                (520, "Elena Rostova", "Beta users loved the action item checklist and topic chapter seeking!"),
                (600, "John Doe", "Awesome. Let's make sure mobile responsiveness is fully verified before staging deployment."),
                (680, "Mike Ross", "Will do. I will run test suites across all breakpoints tonight."),
                (750, "Sarah Connor", "Thanks everyone! See you at tomorrow's standup.")
            ]
        },
        {
            "title": "Engineering Standup",
            "meeting_date": now - timedelta(days=2, hours=4),
            "duration": "15 mins",
            "summary": "Daily engineering standup focused on backend REST API optimizations, database migrations, and resolving React hydration warnings in Next.js App Router.",
            "participants": [
                {"name": "Mike Ross", "email": "mike.r@meetflow.io"},
                {"name": "Alex Chen", "email": "alex.c@meetflow.io"},
                {"name": "David Kim", "email": "david.k@meetflow.io"}
            ],
            "topics": [
                {"title": "Blockers & Hydration Fixes", "description": "Resolving browser extensions interference with Next.js state", "start_time": 0},
                {"title": "FastAPI Route Structure", "description": "Modularizing routes into separate domain files", "start_time": 150},
                {"title": "CI/CD Pipeline Updates", "description": "Automating pytest and compileall checks", "start_time": 400}
            ],
            "action_items": [
                {"task": "Fix Next.js hydration warning on audio player component", "assignee": "Alex Chen", "due_date": "2026-08-15", "completed": True},
                {"task": "Add Pydantic schema validation for action item endpoints", "assignee": "Mike Ross", "due_date": "2026-08-16", "completed": True},
                {"task": "Set up automated test scripts in root package", "assignee": "David Kim", "due_date": "2026-08-19", "completed": False}
            ],
            "segments": [
                (0, "Mike Ross", "Welcome to daily standup team. Alex, what's your update for today?"),
                (20, "Alex Chen", "Yesterday I worked on the media player scrub bar component in React."),
                (45, "Alex Chen", "No major blockers, but I'm fixing a minor hydration warning related to server vs client timestamp rendering."),
                (80, "David Kim", "I can help with that Alex. Make sure you use a useEffect hook for client-only audio states."),
                (120, "Mike Ross", "Good call David. What are you focused on today David?"),
                (150, "David Kim", "I'm refactoring the backend routes into modular files under backend/app/routes/."),
                (210, "David Kim", "Separating meetings, action_items, topics, and transcript routes makes the code much cleaner for interviews."),
                (270, "Mike Ross", "Exactly what we need. As for me, I'm writing the database seed script with 6 realistic meetings."),
                (340, "Alex Chen", "That will make the initial load experience super rich!"),
                (400, "Mike Ross", "Alright, let's wrap up and get back to coding. Let's touch base if any PR review is needed.")
            ]
        },
        {
            "title": "Marketing Strategy & Brand Launch",
            "meeting_date": now - timedelta(days=3, hours=1),
            "duration": "40 mins",
            "summary": "Marketing team aligned on the launch campaign for MeetFlow. Reviewed landing page copy, product screenshots, social media strategy, and promotional video assets.",
            "participants": [
                {"name": "Lisa Vance", "email": "lisa.v@meetflow.io"},
                {"name": "Tom Holland", "email": "tom.h@meetflow.io"},
                {"name": "Sarah Connor", "email": "sarah.c@meetflow.io"}
            ],
            "topics": [
                {"title": "Product Positioning & Messaging", "description": "Defining MeetFlow's value proposition relative to legacy tools", "start_time": 0},
                {"title": "Visual Assets & UI Screenshots", "description": "Selecting hero screenshots of the meeting workspace", "start_time": 300},
                {"title": "Launch Timeline & Channels", "description": "Product Hunt, Twitter/X, and tech newsletter outreach plan", "start_time": 700}
            ],
            "action_items": [
                {"task": "Draft Product Hunt launch title and key feature bullets", "assignee": "Lisa Vance", "due_date": "2026-08-21", "completed": False},
                {"task": "Capture high-resolution UI screenshots of transcript search", "assignee": "Tom Holland", "due_date": "2026-08-17", "completed": True},
                {"task": "Prepare demo video walkthrough of media player sync", "assignee": "Sarah Connor", "due_date": "2026-08-25", "completed": False}
            ],
            "segments": [
                (0, "Lisa Vance", "Hello everyone! Today we're mapping out our go-to-market strategy for MeetFlow."),
                (30, "Tom Holland", "Exciting times! The UI design is super clean, especially the compact left sidebar."),
                (75, "Sarah Connor", "Yes, users love how easy it is to search transcripts and check off action items."),
                (120, "Lisa Vance", "Let's focus our messaging on automated meeting notes and instant searchability."),
                (180, "Tom Holland", "I suggest we highlight 'Search any conversation in milliseconds' as the main tagline."),
                (250, "Sarah Connor", "I agree. We should also demo the topic timeline feature in our launch video."),
                (300, "Lisa Vance", "Tom, can you handle capturing polished screenshots of the dashboard and detail page?"),
                (360, "Tom Holland", "Absolutely. I'll take full-screen captures showing active highlights and badge components."),
                (450, "Lisa Vance", "Perfect. Sarah, how long will it take to record the 60-second walkthrough video?"),
                (530, "Sarah Connor", "I can have the script and recording finished by Tuesday afternoon."),
                (620, "Lisa Vance", "Great team effort! Let's touch base again on Thursday before final staging submission.")
            ]
        },
        {
            "title": "Client Project Review - Acme Corp",
            "meeting_date": now - timedelta(days=4, hours=5),
            "duration": "30 mins",
            "summary": "Quarterly review with Acme Corp stakeholders. Presented AI summary capabilities, customized action item management, and export functionality.",
            "participants": [
                {"name": "John Doe", "email": "john.doe@meetflow.io"},
                {"name": "Robert Ford", "email": "robert@acmecorp.com"},
                {"name": "Bernard Lowe", "email": "bernard@acmecorp.com"}
            ],
            "topics": [
                {"title": "Acme Corp Usage Overview", "description": "Reviewing active users and meeting volume metrics", "start_time": 0},
                {"title": "Feature Demo: Interactive Transcript", "description": "Demonstrating keyword search and audio seeking", "start_time": 240},
                {"title": "Custom Integration Requests", "description": "Discussing future Google Meet & Zoom bot extensions", "start_time": 600}
            ],
            "action_items": [
                {"task": "Send contract renewal proposal to Robert Ford", "assignee": "John Doe", "due_date": "2026-08-19", "completed": True},
                {"task": "Gather requirements for SSO and Enterprise security compliance", "assignee": "Bernard Lowe", "due_date": "2026-08-24", "completed": False},
                {"task": "Schedule follow-up technical architecture session", "assignee": "John Doe", "due_date": "2026-08-20", "completed": False}
            ],
            "segments": [
                (0, "John Doe", "Good afternoon Robert and Bernard! Thank you for joining our project review."),
                (25, "Robert Ford", "Hi John! We've been using MeetFlow across our executive leadership team."),
                (60, "Bernard Lowe", "The transcript accuracy and instant search have saved our team hours of note-taking."),
                (110, "John Doe", "That's wonderful to hear Bernard! Today I'd like to walk you through our latest updates."),
                (180, "John Doe", "Notice how clicking any transcript segment immediately syncs the media player position."),
                (240, "Robert Ford", "That timestamp synchronization is seamless! Can we click on chapter topics as well?"),
                (310, "John Doe", "Yes! Clicking any topic under Key Topics automatically jumps the timeline to that topic."),
                (390, "Bernard Lowe", "What about managing action items assigned to specific team members?"),
                (470, "John Doe", "You can add, edit, assign due dates, and check off completed items in real time."),
                (550, "Robert Ford", "Extremely practical. We'd like to discuss expanding our license count for Q4."),
                (630, "John Doe", "I will send over the renewal proposal and licensing options by tomorrow morning. Thank you both!")
            ]
        },
        {
            "title": "Sprint Planning & Backlog Refinement",
            "meeting_date": now - timedelta(days=5, hours=3),
            "duration": "45 mins",
            "summary": "Engineering and product teams refined user stories for Sprint 14. Estimated story points for full-stack API integration, SQLite cascade deletes, and frontend modal dialogs.",
            "participants": [
                {"name": "Mike Ross", "email": "mike.r@meetflow.io"},
                {"name": "Sarah Connor", "email": "sarah.c@meetflow.io"},
                {"name": "Alex Chen", "email": "alex.c@meetflow.io"},
                {"name": "Elena Rostova", "email": "elena.r@meetflow.io"}
            ],
            "topics": [
                {"title": "Sprint Velocity & Retrospective", "description": "Reviewing completion rate of Sprint 13 items", "start_time": 0},
                {"title": "Backlog Estimation & Story Points", "description": "Sizing backend CRUD routes and modal components", "start_time": 350},
                {"title": "Sprint Commitments & Goal Setting", "description": "Finalizing 2-week sprint deliverables", "start_time": 800}
            ],
            "action_items": [
                {"task": "Create Jira epics for Sprint 14 meeting management features", "assignee": "Sarah Connor", "due_date": "2026-08-14", "completed": True},
                {"task": "Implement DELETE cascade relations in SQLAlchemy models", "assignee": "Mike Ross", "due_date": "2026-08-15", "completed": True},
                {"task": "Build reusable Modal component with ESC key listener", "assignee": "Elena Rostova", "due_date": "2026-08-17", "completed": True},
                {"task": "Write end-to-end API test suite using pytest", "assignee": "Alex Chen", "due_date": "2026-08-21", "completed": False}
            ],
            "segments": [
                (0, "Sarah Connor", "Welcome to Sprint Planning everyone! Let's review our backlog for Sprint 14."),
                (30, "Mike Ross", "Last sprint we achieved 92% velocity, completing all core database schemas."),
                (75, "Alex Chen", "The frontend API layer lib/api.ts is also ready for all endpoint connections."),
                (130, "Elena Rostova", "Awesome! For this sprint, my priority is building the CreateMeetingModal component."),
                (190, "Sarah Connor", "Let's make sure the raw transcript parser in CreateMeetingModal handles custom timestamp formats."),
                (260, "Mike Ross", "I've added regular expression parsing on the backend to handle [MM:SS] and MM:SS patterns."),
                (330, "Alex Chen", "What about deleting meetings? Do we need confirmation modals?"),
                (400, "Elena Rostova", "Yes! DeleteMeetingModal will ask 'Are you sure you want to delete this meeting?' before sending DELETE request."),
                (480, "Mike Ross", "And on the backend, foreign key CASCADE ensures action items, topics, and transcripts are removed cleanly."),
                (570, "Sarah Connor", "Great alignment. Let's estimate story points for each task."),
                (660, "Alex Chen", "I'd estimate 3 points for action item CRUD and 5 points for transcript player sync."),
                (740, "Elena Rostova", "Sounds reasonable to me."),
                (820, "Sarah Connor", "Awesome! Sprint 14 scope is locked in. Let's build a fantastic product!")
            ]
        },
        {
            "title": "Design System & UI Architecture Review",
            "meeting_date": now - timedelta(days=6, hours=2),
            "duration": "35 mins",
            "summary": "Designers and frontend engineers audited MeetFlow's design system tokens, typography scales, color palettes (slate, indigo, violet), hover states, and accessibility compliance.",
            "participants": [
                {"name": "Elena Rostova", "email": "elena.r@meetflow.io"},
                {"name": "Alex Chen", "email": "alex.c@meetflow.io"},
                {"name": "John Doe", "email": "john.doe@meetflow.io"}
            ],
            "topics": [
                {"title": "Design System Foundations", "description": "Color palette, typography, and spacing tokens", "start_time": 0},
                {"title": "Component Library Standard", "description": "Reviewing Button, Badge, Modal, Toast, and Skeleton UI", "start_time": 250},
                {"title": "Accessibility & Responsive Touch Points", "description": "Ensuring proper aria tags, keyboard nav, and tap target sizes", "start_time": 600}
            ],
            "action_items": [
                {"task": "Publish UI component documentation in design system catalog", "assignee": "Elena Rostova", "due_date": "2026-08-23", "completed": False},
                {"task": "Audit focus rings and ARIA accessibility roles across modals", "assignee": "Alex Chen", "due_date": "2026-08-19", "completed": True},
                {"task": "Add skeleton loading states for dashboard meeting cards", "assignee": "Alex Chen", "due_date": "2026-08-18", "completed": True}
            ],
            "segments": [
                (0, "Elena Rostova", "Hi team! Today we are reviewing our design system architecture for MeetFlow."),
                (25, "John Doe", "Great timing. Visual aesthetics are super important for a productivity application."),
                (60, "Alex Chen", "We've established a slate-based color scheme with indigo and purple accents."),
                (110, "Elena Rostova", "Exactly. We avoid purple text on dark backgrounds or cheesy gradient text, keeping it crisp and modern."),
                (170, "John Doe", "The typography hierarchy with Inter font looks very professional."),
                (230, "Alex Chen", "I've implemented reusable UI components: Button, Modal, Badge, Toast, and LoadingSkeleton."),
                (300, "Elena Rostova", "Let's ensure all interactive elements have hover effects, focus states, and unique IDs for automated testing."),
                (380, "John Doe", "What about loading skeletons when fetching meeting details over slower networks?"),
                (450, "Alex Chen", "We have subtle pulse animations that mimic the exact meeting card layout while loading."),
                (540, "Elena Rostova", "Perfect. Let's do a final review of mobile breakpoint scaling for screens under 768px."),
                (620, "Alex Chen", "On mobile screens, the left sidebar transforms into a slide-out navigation overlay effortlessly."),
                (700, "John Doe", "Outstanding work team! The design system is solid and scalable.")
            ]
        }
    ]

    for m_data in meetings_data:
        meeting = Meeting(
            title=m_data["title"],
            meeting_date=m_data["meeting_date"],
            duration=m_data["duration"],
            summary=m_data["summary"]
        )
        db.add(meeting)
        db.flush()

        # Add participants
        for p in m_data["participants"]:
            db.add(Participant(
                meeting_id=meeting.id,
                name=p["name"],
                email=p["email"]
            ))

        # Add topics
        for t in m_data["topics"]:
            db.add(Topic(
                meeting_id=meeting.id,
                title=t["title"],
                description=t["description"],
                start_time=t["start_time"]
            ))

        # Add action items
        for a in m_data["action_items"]:
            db.add(ActionItem(
                meeting_id=meeting.id,
                task=a["task"],
                assignee=a["assignee"],
                due_date=a["due_date"],
                completed=a["completed"]
            ))

        # Add transcript segments
        for idx, (ts_sec, speaker, text) in enumerate(m_data["segments"]):
            db.add(TranscriptSegment(
                meeting_id=meeting.id,
                speaker=speaker,
                timestamp_seconds=ts_sec,
                text=text,
                sequence_number=idx
            ))

    db.commit()
    db.close()
    print("Database seeding completed successfully! 6 realistic meetings added.")

if __name__ == "__main__":
    seed_database()
