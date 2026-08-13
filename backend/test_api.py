import requests

BASE_URL = "http://127.0.0.1:8000"

def test_api():
    print("--- Running API Integration Tests ---")

    # 1. Health check
    res = requests.get(f"{BASE_URL}/health")
    assert res.status_code == 200, f"Health check failed: {res.status_code}"
    print("[OK] Health Check Passed")

    # 2. Get meetings
    res = requests.get(f"{BASE_URL}/meetings")
    assert res.status_code == 200
    meetings = res.json()
    assert len(meetings) >= 6, f"Expected at least 6 meetings, got {len(meetings)}"
    print(f"[OK] GET /meetings Passed ({len(meetings)} meetings fetched)")

    # 3. Get single meeting detail
    m_id = meetings[0]["id"]
    res = requests.get(f"{BASE_URL}/meetings/{m_id}")
    assert res.status_code == 200
    detail = res.json()
    assert "transcript_segments" in detail
    assert "action_items" in detail
    assert "topics" in detail
    print(f"[OK] GET /meetings/{m_id} Passed (Segments: {len(detail['transcript_segments'])}, Topics: {len(detail['topics'])}, Action Items: {len(detail['action_items'])})")

    # 4. Create action item
    res = requests.post(f"{BASE_URL}/meetings/{m_id}/action-items", json={
        "task": "Test integration task",
        "assignee": "Test Runner",
        "completed": False
    })
    assert res.status_code == 201
    action_item = res.json()
    ai_id = action_item["id"]
    print("[OK] POST /meetings/{id}/action-items Passed")

    # 5. Update action item (toggle complete)
    res = requests.put(f"{BASE_URL}/action-items/{ai_id}", json={
        "completed": True
    })
    assert res.status_code == 200
    assert res.json()["completed"] == True
    print("[OK] PUT /action-items/{id} Passed")

    # 6. Delete action item
    res = requests.delete(f"{BASE_URL}/action-items/{ai_id}")
    assert res.status_code == 200
    print("[OK] DELETE /action-items/{id} Passed")

    # 7. Create new meeting with transcript
    res = requests.post(f"{BASE_URL}/meetings", json={
        "title": "API Test Meeting",
        "meeting_date": "2026-08-14T10:00:00Z",
        "duration": "15 mins",
        "participants": ["Alice <alice@test.com>", "Bob"],
        "raw_transcript": "[00:00] Alice:\nHello world!\n[00:10] Bob:\nHi Alice, everything looks great."
    })
    assert res.status_code == 201
    new_m = res.json()
    new_id = new_m["id"]
    assert len(new_m["transcript_segments"]) == 2
    print("[OK] POST /meetings with Transcript Parsing Passed")

    # 8. Delete meeting (cascade check)
    res = requests.delete(f"{BASE_URL}/meetings/{new_id}")
    assert res.status_code == 200
    print("[OK] DELETE /meetings/{id} Passed")

    print("--- ALL 8 INTEGRATION TESTS PASSED CLEANLY! ---")

if __name__ == "__main__":
    test_api()
