def test_reports_and_comparison(client):
    reg = client.post("/api/v1/auth/register", json={
        "email": "report.user@example.com",
        "full_name": "Report User",
        "password": "Password123!"
    })
    token = reg.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create & finish Session 1
    s1 = client.post("/api/v1/interviews", json={"role": "Software Developer", "total_questions": 1}, headers=headers).json()
    client.post(f"/api/v1/interviews/{s1['id']}/finish", headers=headers)

    # Create & finish Session 2
    s2 = client.post("/api/v1/interviews", json={"role": "Software Developer", "total_questions": 1}, headers=headers).json()
    client.post(f"/api/v1/interviews/{s2['id']}/finish", headers=headers)

    # List reports
    rep_list = client.get("/api/v1/reports", headers=headers)
    assert rep_list.status_code == 200
    assert len(rep_list.json()) >= 2

    # Compare sessions
    comp_res = client.post("/api/v1/reports/compare", json={
        "session_id_1": s1["id"],
        "session_id_2": s2["id"],
        "session_type": "interview"
    }, headers=headers)
    assert comp_res.status_code == 200
    comp_data = comp_res.json()
    assert "point_difference" in comp_data
    assert len(comp_data["criterion_differences"]) > 0

    # CSV Export
    csv_res = client.get(f"/api/v1/reports/mock_interview/{s1['id']}/export-csv", headers=headers)
    assert csv_res.status_code == 200
    assert "text/csv" in csv_res.headers["content-type"]
