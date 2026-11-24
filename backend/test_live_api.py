import json
import urllib.request
import urllib.parse

def test_live_server():
    base = "http://127.0.0.1:8000"
    
    # 1. Health check
    req = urllib.request.urlopen(f"{base}/health")
    health = json.loads(req.read().decode())
    print("Health check:", health)
    assert health["status"] == "healthy"

    # 2. CareerFit analyze
    data = urllib.parse.urlencode({
        "resume_text_input": """
        Candidate: Priya Sharma
        B.Tech Computer Science, 2024
        Skills: Java, Python, SQL, React, Git, Data Structures, Algorithms, REST APIs
        Project: E-Commerce Store in Java & Spring Boot, PostgreSQL database
        """,
        "job_desc_option": "paste",
        "job_desc_text_input": """
        Target Role: Backend Java Engineer
        Requirements:
        - Java, Spring Boot, Microservices, REST APIs
        - SQL, PostgreSQL, Redis caching
        - Docker, Kubernetes, CI/CD
        - Strong Problem Solving and Teamwork
        """
    }).encode("utf-8")

    req_analyze = urllib.request.Request(
        f"{base}/api/v1/careerfit/analyze",
        data=data,
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    res = urllib.request.urlopen(req_analyze)
    result = json.loads(res.read().decode())
    print("\nCareerFit Analysis Result:")
    print(f"- Target Role: {result.get('job_title')}")
    print(f"- Overall Match Score: {result.get('match_score')}%")
    print(f"- Technical Score: {result.get('technical_score')}%")
    print(f"- Experience Score: {result.get('experience_score')}%")
    print(f"- Matching Skills ({len(result.get('matching_skills', []))}): {result.get('matching_skills')}")
    print(f"- Missing Skills ({len(result.get('missing_skills', []))}): {result.get('missing_skills')}")
    print(f"- Skills to Improve ({len(result.get('improvement_skills', []))}): {[s['skill'] for s in result.get('improvement_skills', [])]}")
    print(f"- 7-Day Plan Days: {len(result.get('roadmap_7_day', []))}")
    print(f"- 30-Day Plan Weeks: {len(result.get('roadmap_30_day', []))}")
    print(f"- Score Explanation: {result.get('score_explanation')[:120]}...")

    aid = result["id"]

    # 3. Test PDF Report Download
    req_pdf = urllib.request.urlopen(f"{base}/api/v1/careerfit/report/{aid}")
    pdf_bytes = req_pdf.read()
    print(f"\nPDF Report downloaded: {len(pdf_bytes)} bytes, starts with: {pdf_bytes[:4]}")
    assert pdf_bytes.startswith(b"%PDF")

    # 4. Test History
    req_hist = urllib.request.urlopen(f"{base}/api/v1/careerfit/history")
    hist = json.loads(req_hist.read().decode())
    print(f"\nHistory items count: {len(hist)}")
    assert any(h["id"] == aid for h in hist)

    # 5. Test AI Career Coach with direct technical question
    coach_payload = json.dumps({"message": "What is QuickSort and how does it work?"}).encode("utf-8")
    req_coach = urllib.request.Request(
        f"{base}/api/v1/coach/message",
        data=coach_payload,
        headers={"Content-Type": "application/json"}
    )
    res_coach = urllib.request.urlopen(req_coach)
    coach_resp = json.loads(res_coach.read().decode())
    print("\nAI Career Coach Reply to 'What is QuickSort':")
    print(coach_resp["reply"][:250] + "...")
    assert "quicksort" in coach_resp["reply"].lower()
    assert "pivot" in coach_resp["reply"].lower()

    print("\n=======================================================")
    print("ALL CAREERFIT AI & COACH INTEGRATION TESTS PASSED 100%!")
    print("=======================================================")

if __name__ == "__main__":
    test_live_server()

