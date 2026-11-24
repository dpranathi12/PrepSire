"""Test CareerFit PDF upload end-to-end"""
import requests
import os
import json

BASE = "http://127.0.0.1:8000"

# 1. Get a valid token - try login first
users_to_try = [
    {"email": "test@example.com", "password": "test123"},
    {"email": "admin@prepspire.com", "password": "admin123"},
]

token = None
for creds in users_to_try:
    r = requests.post(f"{BASE}/api/v1/auth/login", json=creds)
    if r.status_code == 200:
        token = r.json().get("access_token")
        print(f"[OK] Logged in as {creds['email']}")
        break
    else:
        print(f"[SKIP] Login failed for {creds['email']}: {r.status_code}")

# If no token, try without (backend falls back to first user)
headers = {}
if token:
    headers["Authorization"] = f"Bearer {token}"
else:
    print("[INFO] No token - relying on backend guest fallback")

# 2. Create a minimal valid PDF bytes (text-based)
# This is a simple hand-crafted PDF with readable text
PDF_CONTENT = b"""%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792]
/Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj << /Length 300 >>
stream
BT
/F1 12 Tf
50 750 Td
(John Doe - Software Engineer) Tj
0 -20 Td
(Email: john@example.com | Phone: 555-1234) Tj
0 -20 Td
(Skills: Python, JavaScript, React, FastAPI, PostgreSQL, Git) Tj
0 -20 Td
(Experience: 3 years as Software Engineer at TechCorp) Tj
0 -20 Td
(Education: B.Tech Computer Science, 2020) Tj
0 -20 Td
(Projects: Built REST APIs, React dashboards, deployed on AWS) Tj
ET
endstream
endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000266 00000 n
0000000618 00000 n
trailer << /Size 6 /Root 1 0 R >>
startxref
700
%%EOF"""

# 3. Test POST /careerfit/analyze with file upload
print("\n[TEST] Uploading PDF resume + pasted job description...")
try:
    resp = requests.post(
        f"{BASE}/api/v1/careerfit/analyze",
        files={"resume_file": ("test_resume.pdf", PDF_CONTENT, "application/pdf")},
        data={
            "job_desc_option": "paste",
            "job_desc_text_input": (
                "We are looking for a Software Engineer with 2+ years experience. "
                "Required skills: Python, JavaScript, React, REST APIs, SQL, Git. "
                "Responsibilities: Build and maintain backend APIs, develop React frontend, "
                "write clean maintainable code, participate in code reviews, deploy on cloud."
            )
        },
        headers=headers,
        timeout=120
    )
    print(f"Status: {resp.status_code}")
    if resp.status_code == 200:
        data = resp.json()
        print(f"[SUCCESS] Match score: {data.get('match_score')}%")
        print(f"  Job title: {data.get('job_title')}")
        print(f"  Matching skills: {data.get('matching_skills', [])[:3]}")
        print(f"  Missing skills: {data.get('missing_skills', [])[:3]}")
    else:
        print(f"[ERROR] Response: {resp.text[:500]}")
except Exception as e:
    print(f"[EXCEPTION] {type(e).__name__}: {e}")
