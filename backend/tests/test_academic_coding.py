def test_academic_quiz_flow(client):
    reg = client.post("/api/v1/auth/register", json={
        "email": "acad.user@example.com",
        "full_name": "Acad User",
        "password": "Password123!"
    })
    token = reg.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get academic questions
    q_res = client.get("/api/v1/academic/questions?limit=2")
    assert q_res.status_code == 200
    questions = q_res.json()
    assert len(questions) > 0

    first_q = questions[0]
    # Submit quiz
    quiz_res = client.post("/api/v1/academic/quiz", json={
        "subject": first_q["subject"],
        "topic": first_q["topic"],
        "answers": [
            {"question_id": first_q["id"], "user_answer": "O(N)"}
        ],
        "time_taken_seconds": 25
    }, headers=headers)
    assert quiz_res.status_code == 200
    data = quiz_res.json()
    assert data["total_questions"] == 1
    assert "score" in data

def test_coding_submission_practice_mode(client):
    reg = client.post("/api/v1/auth/register", json={
        "email": "coding.user@example.com",
        "full_name": "Coding User",
        "password": "Password123!"
    })
    token = reg.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # List challenges
    ch_res = client.get("/api/v1/coding/challenges")
    assert ch_res.status_code == 200
    challenges = ch_res.json()
    assert len(challenges) > 0

    target_ch = challenges[0]
    # Submit code
    sub_res = client.post("/api/v1/coding/submit", json={
        "challenge_id": target_ch["id"],
        "language": "python",
        "code": "def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen: return [seen[target - n], i]\n        seen[n] = i\n    return []"
    }, headers=headers)
    assert sub_res.status_code == 200
    sub_data = sub_res.json()
    assert sub_data["execution_mode"] in ["real_execution", "practice_mode"]
    assert "feedback" in sub_data
