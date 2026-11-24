import os
import sys
import csv
import ast
import re
import uuid
import logging
from datetime import datetime
from typing import Dict, Any, Optional

# Add parent directory to sys.path so app modules can be imported
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.core.config import settings
from app.db.session import SessionLocal
from app.models.question import Question
from app.models.dataset import DatasetImport

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

REQUIRED_COLUMNS = [
    "question",
    "keywords",
    "role",
    "sector",
    "interview_stage",
    "interviewer",
    "question_category",
    "question_level"
]

def normalize_text(text: Optional[str]) -> str:
    if not text:
        return ""
    # Strip leading/trailing whitespace, collapse multiple spaces/newlines, lowercase
    cleaned = re.sub(r'\s+', ' ', text.strip()).lower()
    return cleaned

def parse_keywords(raw: Optional[str]) -> list:
    if not raw:
        return []
    raw = raw.strip()
    if raw.startswith("[") and raw.endswith("]"):
        try:
            parsed = ast.literal_eval(raw)
            if isinstance(parsed, list):
                return [str(k).strip() for k in parsed if str(k).strip()]
        except Exception:
            pass
    # Fallback comma-split
    return [k.strip().strip("'\"") for k in raw.split(",") if k.strip()]

def import_dataset(csv_path: Optional[str] = None, max_rows: Optional[int] = None) -> Dict[str, Any]:
    file_path = csv_path or settings.DATASET_PATH
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Dataset CSV file not found at: {file_path}")

    logger.info(f"Starting dataset import from {file_path}")
    db = SessionLocal()
    
    import_record = DatasetImport(
        filename=os.path.basename(file_path),
        source="interview_forge_v3_complete.csv",
        status="running"
    )
    db.add(import_record)
    db.commit()

    total_rows = 0
    imported_count = 0
    duplicate_count = 0
    invalid_count = 0
    skipped_count = 0

    try:
        # Load existing normalized questions into memory for fast duplicate lookup
        logger.info("Loading existing questions for deduplication check...")
        existing_normalized = set(
            row[0] for row in db.query(Question.normalized_question).all()
        )
        logger.info(f"Loaded {len(existing_normalized)} existing questions from database.")

        batch = []
        batch_size = 1000

        with open(file_path, mode="r", encoding="utf-8", errors="ignore") as f:
            reader = csv.DictReader(f)
            
            # Validate required headers
            headers = [h.strip() for h in (reader.fieldnames or [])]
            for col in REQUIRED_COLUMNS:
                if col not in headers:
                    raise ValueError(f"Missing required CSV column: {col}. Available columns: {headers}")

            for row in reader:
                total_rows += 1
                if max_rows and total_rows > max_rows:
                    break

                q_text = row.get("question", "").strip()
                if not q_text or len(q_text) < 5:
                    invalid_count += 1
                    continue

                role = row.get("role", "").strip() or "General"
                norm_q = normalize_text(q_text)

                if norm_q in existing_normalized:
                    duplicate_count += 1
                    continue

                existing_normalized.add(norm_q)

                keywords_list = parse_keywords(row.get("keywords", ""))
                sector = row.get("sector", "").strip() or None
                stage = row.get("interview_stage", "").strip() or "General Screening"
                interviewer = row.get("interviewer", "").strip() or None
                category = row.get("question_category", "").strip() or "General"
                level = row.get("question_level", "").strip() or "Foundational"

                question_obj = {
                    "id": str(uuid.uuid4()),
                    "question_text": q_text,
                    "normalized_question": norm_q,
                    "keywords": keywords_list,
                    "role": role,
                    "sector": sector,
                    "interview_stage": stage,
                    "interviewer": interviewer,
                    "question_category": category,
                    "question_level": level,
                    "source": "imported_dataset",
                    "created_at": datetime.utcnow()
                }
                batch.append(question_obj)
                imported_count += 1

                if len(batch) >= batch_size:
                    db.bulk_insert_mappings(Question, batch)
                    db.commit()
                    batch.clear()
                    if imported_count % 5000 == 0:
                        logger.info(f"Progress: {imported_count} questions imported...")

            if batch:
                db.bulk_insert_mappings(Question, batch)
                db.commit()
                batch.clear()

        # Update import record
        import_record.total_rows = total_rows
        import_record.imported_count = imported_count
        import_record.duplicate_count = duplicate_count
        import_record.invalid_count = invalid_count
        import_record.skipped_count = skipped_count
        import_record.status = "completed"
        db.commit()

        summary = {
            "file": file_path,
            "total_rows_scanned": total_rows,
            "imported": imported_count,
            "duplicates": duplicate_count,
            "invalid": invalid_count,
            "skipped": skipped_count,
            "status": "completed"
        }
        logger.info(f"Dataset import completed: {summary}")
        return summary

    except Exception as e:
        db.rollback()
        import_record.status = "failed"
        import_record.error_message = str(e)
        db.commit()
        logger.error(f"Dataset import failed: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    csv_arg = sys.argv[1] if len(sys.argv) > 1 else None
    result = import_dataset(csv_arg)
    print("\n--- IMPORT SUMMARY ---")
    for k, v in result.items():
        print(f"{k}: {v}")
