def test_mock_interview_flow(client):
    # Register candidate
    reg = client.post("/api/v1/auth/register", json={
        "email": "interview.tester@example.com",
        "full_name": "Interview Tester",
        "password": "Password123!"
    })
    token = reg.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create interview session
    create_res = client.post("/api/v1/interviews", json={
        "role": "Software Developer",
        "interview_type": "Technical",
        "difficulty": "Medium",
        "total_questions": 2,
        "ai_provider": "offline"
    }, headers=headers)
    assert create_res.status_code == 200
    session_data = create_res.json()
    assert session_data["status"] == "in_progress"
    assert len(session_data["questions"]) > 0

    first_q = session_data["questions"][0]

    # Submit answer with intentional fillers and technical terms
    answer_res = client.post(f"/api/v1/interviews/{session_data['id']}/answer", json={
        "interview_question_id": first_q["id"],
        "user_answer": "Um, in my project, like, I implemented an asynchronous queue with redis to reduce latency by 40%. Basically, we monitored cache hits.",
        "answer_method": "typed",
        "duration_seconds": 45
    }, headers=headers)
    assert answer_res.status_code == 200
    eval_data = answer_res.json()
    assert eval_data["overall_score"] > 0
    assert eval_data["evaluation_mode"] == "offline"
    assert eval_data["filler_count"] >= 2
    assert "follow_up_question" in eval_data

    # Finish interview
    finish_res = client.post(f"/api/v1/interviews/{session_data['id']}/finish", headers=headers)
    assert finish_res.status_code == 200
    finished_data = finish_res.json()
    assert finished_data["status"] == "completed"
    assert finished_data["overall_score"] > 0
    assert len(finished_data["strengths"]) > 0
