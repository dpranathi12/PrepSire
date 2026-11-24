def test_communication_practice(client):
    reg = client.post("/api/v1/auth/register", json={
        "email": "comm.user@example.com",
        "full_name": "Comm User",
        "password": "Password123!"
    })
    token = reg.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Fetch prompts
    prompts_res = client.get("/api/v1/communication/prompts")
    assert prompts_res.status_code == 200

    # Submit communication session
    sub_res = client.post("/api/v1/communication/sessions", json={
        "category": "Self-introduction",
        "prompt_text": "Deliver a professional 60-second elevator pitch.",
        "prep_time_seconds": 30,
        "response_duration_seconds": 60,
        "actual_duration_seconds": 58,
        "response_text": "Hello, I am a dedicated software engineer specializing in scalable backend systems. I have built distributed microservices and optimized query indexing. Looking forward to contributing to high-impact products.",
        "response_method": "speech"
    }, headers=headers)
    assert sub_res.status_code == 200
    res_data = sub_res.json()
    assert res_data["overall_score"] > 60
    assert res_data["words_per_minute"] > 0
    assert len(res_data["strengths"]) > 0

def test_jam_topic_repetition_and_submission(client):
    reg = client.post("/api/v1/auth/register", json={
        "email": "jam.user@example.com",
        "full_name": "JAM User",
        "password": "Password123!"
    })
    token = reg.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Fetch first topic (unseen)
    t1_res = client.get("/api/v1/jam/topic", headers=headers)
    assert t1_res.status_code == 200
    t1 = t1_res.json()
    assert t1["is_revision"] is False

    # 2. Submit session for topic 1
    sub1 = client.post("/api/v1/jam/sessions", json={
        "topic_id": t1["id"],
        "topic_text": t1["topic_text"],
        "category": t1["category"],
        "prep_duration_seconds": 30,
        "speaking_duration_seconds": 60,
        "actual_duration_seconds": 59,
        "transcript": "Artificial intelligence creates remarkable opportunities for engineers. It automates repetitive boilerplate and elevates our focus toward high-level system architecture and reliability.",
        "response_method": "speech"
    }, headers=headers)
    assert sub1.status_code == 200
    assert sub1.json()["total_score"] > 0

    # 3. Fetch next topic -> must not repeat t1 immediately if other topics are available
    t2_res = client.get("/api/v1/jam/topic", headers=headers)
    assert t2_res.status_code == 200
    t2 = t2_res.json()
    assert t2["id"] != t1["id"]
