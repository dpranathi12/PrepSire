import os
import sys
import unittest
import docx
from pypdf import PdfWriter

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app
from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash, create_access_token


class CareerFitE2ETest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)
        db = SessionLocal()
        # Find or create a test user
        user = db.query(User).filter(User.email == "test_careerfit@prepspire.ai").first()
        if not user:
            user = User(
                email="test_careerfit@prepspire.ai",
                hashed_password=get_password_hash("SecretPassword123!"),
                full_name="Alex Mercer",
                is_active=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        cls.user = user
        cls.token = create_access_token(user.id)
        db.close()

    def test_01_analyze_resume_and_jd_paste(self):
        resume_text = """
        Alex Mercer
        Email: alex@example.com | Phone: +1 555-0199 | GitHub: github.com/alexmercer
        Education: B.Tech in Computer Science and Engineering, 2024
        
        Technical Skills:
        - Languages: Java, Python, SQL, JavaScript
        - Core CS: Data Structures, Algorithms, Object-Oriented Programming (OOP)
        - Frameworks: React, Spring Boot, HTML5, CSS3
        - Tools: Git, GitHub
        
        Projects:
        1. E-Commerce Backend Service (Java, Spring Boot, PostgreSQL)
           - Built REST APIs for product catalog and order processing.
           - Designed relational database schema with indexed queries.
        2. Portfolio Dashboard (React, JavaScript)
           - Developed responsive front-end dashboard with interactive charts.
        """

        jd_text = """
        Job Title: Senior Java Developer
        
        Requirements:
        - 1-3 years experience in Java and Spring Boot.
        - Strong foundation in Object-Oriented Programming, Data Structures and Algorithms.
        - Experience with SQL databases (PostgreSQL or MySQL).
        - Familiarity with Docker, Kubernetes, CI/CD, and Redis caching.
        - Understanding of REST APIs and Microservices architecture.
        - Excellent Problem Solving and Team Collaboration abilities.
        """

        headers = {"Authorization": f"Bearer {self.token}"}
        data = {
            "resume_text_input": resume_text,
            "job_desc_option": "paste",
            "job_desc_text_input": jd_text
        }

        response = self.client.post("/api/v1/careerfit/analyze", data=data, headers=headers)
        self.assertEqual(response.status_code, 200, response.text)
        res_json = response.json()

        # Check required fields
        self.assertIn("id", res_json)
        self.assertIn("match_score", res_json)
        self.assertGreater(res_json["match_score"], 40.0)
        self.assertIn("matching_skills", res_json)
        self.assertIn("missing_skills", res_json)
        self.assertIn("improvement_skills", res_json)
        self.assertIn("roadmap_7_day", res_json)
        self.assertIn("roadmap_30_day", res_json)
        self.assertIn("resume_suggestions", res_json)

        # Check matching skills contains Java and Spring Boot
        matching = [s.lower() for s in res_json["matching_skills"]]
        self.assertTrue(any("java" in s for s in matching))

        # Check missing skills identified Docker or Redis
        missing = [s.lower() for s in res_json["missing_skills"]]
        self.assertTrue(any("docker" in s or "redis" in s or "kubernetes" in s for s in missing))

        self.__class__.analysis_id = res_json["id"]

    def test_02_get_history(self):
        headers = {"Authorization": f"Bearer {self.token}"}
        response = self.client.get("/api/v1/careerfit/history", headers=headers)
        self.assertEqual(response.status_code, 200)
        history = response.json()
        self.assertIsInstance(history, list)
        self.assertGreater(len(history), 0)

    def test_03_get_detail_and_download_report(self):
        headers = {"Authorization": f"Bearer {self.token}"}
        aid = getattr(self.__class__, "analysis_id", None)
        if not aid:
            self.skipTest("No analysis ID from test_01")

        # Get detail
        detail_resp = self.client.get(f"/api/v1/careerfit/history/{aid}", headers=headers)
        self.assertEqual(detail_resp.status_code, 200)
        detail = detail_resp.json()
        self.assertEqual(detail["id"], aid)

        # Download PDF Report
        report_resp = self.client.get(f"/api/v1/careerfit/report/{aid}", headers=headers)
        self.assertEqual(report_resp.status_code, 200)
        self.assertEqual(report_resp.headers["content-type"], "application/pdf")
        self.assertTrue(report_resp.content.startswith(b"%PDF"))
        self.assertGreater(len(report_resp.content), 2000)

    def test_04_ai_career_coach_answers_technical_question(self):
        headers = {"Authorization": f"Bearer {self.token}"}
        # Send a direct question about quicksort
        coach_req = {"message": "How does quicksort work and what is its time complexity?"}
        response = self.client.post("/api/v1/coach/message", json=coach_req, headers=headers)
        self.assertEqual(response.status_code, 200)
        res = response.json()
        self.assertIn("reply", res)
        # Verify it explains QuickSort, pivot/partition, and time complexity
        reply_lower = res["reply"].lower()
        self.assertTrue(any(term in reply_lower for term in ["quick", "sort"]))
        self.assertTrue(any(term in reply_lower for term in ["pivot", "partition", "divide"]))
        self.assertTrue(any(term in reply_lower for term in ["o(n log n)", "n log n", "log", "complexity", "time"]))


if __name__ == "__main__":
    unittest.main()

