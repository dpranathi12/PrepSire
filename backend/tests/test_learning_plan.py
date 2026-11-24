def test_30_day_learning_plan(client):
    reg = client.post("/api/v1/auth/register", json={
        "email": "planner.user@example.com",
        "full_name": "Planner User",
        "password": "Password123!"
    })
    token = reg.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Fetch active plan
    plan_res = client.get("/api/v1/learning-plan", headers=headers)
    assert plan_res.status_code == 200
    plan_data = plan_res.json()
    assert plan_data["total_days"] == 30
    assert len(plan_data["tasks"]) == 150  # 30 days * 5 tasks

    first_task = plan_data["tasks"][0]
    assert first_task["status"] == "pending"

    # Toggle task completed
    toggle_res = client.put(f"/api/v1/learning-plan/tasks/{first_task['id']}/toggle", headers=headers)
    assert toggle_res.status_code == 200
    assert toggle_res.json()["status"] == "completed"

    # Verify plan shows updated completion
    plan_res2 = client.get("/api/v1/learning-plan", headers=headers)
    assert plan_res2.json()["completed_days"] >= 1
