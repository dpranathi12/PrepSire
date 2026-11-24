import os
import tempfile
from typing import Optional
from fastapi import BackgroundTasks
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.careerfit_analysis import CareerFitAnalysis

# PDF to images conversion (requires poppler utils installed)
try:
    from pdf2image import convert_from_path
except ImportError:
    convert_from_path = None

import pytesseract

def is_scanned_pdf(file_path: str) -> bool:
    """Return True if PDF appears to be image‑only (no extractable text)."""
    if not os.path.exists(file_path):
        return False
    # quick heuristic: try to extract any text with pdfminer; if empty assume scanned
    try:
        from pdfminer.high_level import extract_text
        text = extract_text(file_path, maxpages=1)
        return not bool(text.strip())
    except Exception:
        return True

def ocr_pdf(file_path: str) -> str:
    """Run OCR on each page of a PDF and return concatenated text."""
    if convert_from_path is None:
        raise RuntimeError("pdf2image is not installed")
    images = convert_from_path(file_path)
    ocr_text = []
    for img in images:
        txt = pytesseract.image_to_string(img)
        ocr_text.append(txt)
    return "\n".join(ocr_text)

def process_resume_ocr(analysis_id: int, db: Session = None):
    """Background task – perform OCR on the stored resume file and update the DB.
    The resume file path is stored temporarily in the analysis record as
    `resume_file_path` (added dynamically for the task). After processing the
    temporary file is removed.
    """
    # Obtain a DB session if not provided (FastAPI will inject one when called via BackgroundTasks)
    if db is None:
        db = next(get_db())
    analysis: CareerFitAnalysis = db.query(CareerFitAnalysis).filter(CareerFitAnalysis.id == analysis_id).first()
    if not analysis:
        return
    # The temporary file path is stored in a hidden attribute on the model for this task
    file_path: Optional[str] = getattr(analysis, "_temp_resume_path", None)
    if not file_path or not os.path.exists(file_path):
        analysis.ocr_pending = False
        db.commit()
        return
    try:
        if is_scanned_pdf(file_path):
            extracted = ocr_pdf(file_path)
        else:
            # fallback to existing text extraction (pdfminer) if not scanned
            from pdfminer.high_level import extract_text
            extracted = extract_text(file_path)
        analysis.resume_text = extracted
    finally:
        # cleanup temp file
        try:
            os.remove(file_path)
        except OSError:
            pass
        analysis.ocr_pending = False
        # remove the helper attribute
        if hasattr(analysis, "_temp_resume_path"):
            delattr(analysis, "_temp_resume_path")
        db.commit()

