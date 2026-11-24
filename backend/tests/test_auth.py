def test_register_and_login(client):
    # 1. Register User A
    reg_res = client.post("/api/v1/auth/register", json={
        "email": "user.a@example.com",
        "full_name": "User Alpha",
        "password": "SecretPassword123!"
    })
    assert reg_res.status_code == 200
    token_a = reg_res.json()["access_token"]
    assert token_a is not None

    # 2. Duplicate registration fails
    dup_res = client.post("/api/v1/auth/register", json={
        "email": "user.a@example.com",
        "full_name": "User Alpha Dup",
        "password": "AnotherPassword!"
    })
    assert dup_res.status_code == 400

    # 3. Login User A
    login_res = client.post("/api/v1/auth/login", json={
        "email": "user.a@example.com",
        "password": "SecretPassword123!"
    })
    assert login_res.status_code == 200
    assert "access_token" in login_res.json()

    # 4. Access /me
    me_res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token_a}"})
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "user.a@example.com"

def test_user_data_isolation(client):
    # Register User 1
    u1_res = client.post("/api/v1/auth/register", json={
        "email": "student1@example.com",
        "full_name": "Student One",
        "password": "Password123!"
    })
    token1 = u1_res.json()["access_token"]

    # Register User 2
    u2_res = client.post("/api/v1/auth/register", json={
        "email": "student2@example.com",
        "full_name": "Student Two",
        "password": "Password123!"
    })
    token2 = u2_res.json()["access_token"]

    # User 1 creates an interview session
    sess_res = client.post(
        "/api/v1/interviews",
        json={"role": "Software Developer", "interview_type": "Technical", "total_questions": 2},
        headers={"Authorization": f"Bearer {token1}"}
    )
    assert sess_res.status_code == 200
    session_id_u1 = sess_res.json()["id"]

    # User 2 attempts to fetch User 1's session -> must be 404 forbidden/not found
    cross_res = client.get(
        f"/api/v1/interviews/{session_id_u1}",
        headers={"Authorization": f"Bearer {token2}"}
    )
    assert cross_res.status_code == 404
