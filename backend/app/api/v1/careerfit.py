import os
import tempfile
import shutil
from typing import Dict, Any, List, Optional, Tuple
from fastapi import APIRouter, Depends, File, UploadFile, Form, HTTPException, status, Response
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.models.careerfit_analysis import CareerFitAnalysis
from app.api.deps import get_optional_current_user, get_current_user
from app.services.document_extractor import extract_document_text
from app.services.ai_service import analyze_match
from app.services.report_generator import generate_report

router = APIRouter(prefix="/careerfit", tags=["CareerFit AI"])

MAX_FILE_SIZE = 15 * 1024 * 1024  # 15 MB
ALLOWED_EXTENSIONS = {".pdf", ".docx", ".doc"}


def _validate_and_save_temp(upload_file: UploadFile) -> Tuple[str, str, str]:
    filename = upload_file.filename or "uploaded_document"
    ext = os.path.splitext(filename.lower())[1]
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported format '{ext}'. Allowed: PDF (.pdf), Word (.docx, .doc)"
        )
    
    # Save to a temporary file
    temp_dir = tempfile.mkdtemp()
    temp_path = os.path.join(temp_dir, filename)
    with open(temp_path, "wb") as f:
        shutil.copyfileobj(upload_file.file, f)
        
    file_size = os.path.getsize(temp_path)
    if file_size > MAX_FILE_SIZE:
        try:
            shutil.rmtree(temp_dir, ignore_errors=True)
        except Exception:
            pass
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File exceeds maximum allowed size of 15MB (got {file_size / (1024*1024):.1f}MB)."
        )
    return temp_path, ext, temp_dir


@router.post("/analyze", response_model=Dict[str, Any])
async def analyze_career_fit(
    resume_file: Optional[UploadFile] = File(None),
    resume_text_input: Optional[str] = Form(None),
    job_desc_option: str = Form("paste"),  # "paste", "pdf", "doc"
    job_desc_text_input: Optional[str] = Form(None),
    job_desc_file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Unified analysis endpoint accepting Resume (file or text) and 
    Job Description (Pasted text, uploaded PDF, or uploaded Word doc).
    """
    if not current_user:
        # Fallback to first user in system if guest
        current_user = db.query(User).first()
        if not current_user:
            raise HTTPException(status_code=401, detail="Please sign in or create an account to run CareerFit AI.")

    extracted_resume_text = ""
    resume_filename = "Pasted Resume"
    temp_dirs_to_clean = []

    # 1. Process Resume Input
    if resume_file and resume_file.filename:
        resume_filename = resume_file.filename
        temp_path, ext, temp_dir = _validate_and_save_temp(resume_file)
        temp_dirs_to_clean.append(temp_dir)
        try:
            text, _ = extract_document_text(temp_path, resume_filename)
            extracted_resume_text = text
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Could not extract resume content: {str(e)}"
            )
    elif resume_text_input and resume_text_input.strip():
        extracted_resume_text = resume_text_input.strip()
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please upload a resume (.pdf, .docx, .doc) or paste your resume content."
        )

    if len(extracted_resume_text.strip()) < 30:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="The uploaded resume contained little or no readable text. Please ensure the document is not an empty or password-protected scan."
        )

    # 2. Process Job Description Input (3 Options)
    extracted_jd_text = ""
    if job_desc_option == "paste" or (job_desc_text_input and not job_desc_file):
        if not job_desc_text_input or not job_desc_text_input.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Please paste the complete job description text."
            )
        extracted_jd_text = job_desc_text_input.strip()
    elif job_desc_file and job_desc_file.filename:
        jd_filename = job_desc_file.filename
        temp_path, ext, temp_dir = _validate_and_save_temp(job_desc_file)
        temp_dirs_to_clean.append(temp_dir)
        try:
            text, _ = extract_document_text(temp_path, jd_filename)
            extracted_jd_text = text
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Could not extract job description document: {str(e)}"
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a job description using one of the three options: Paste Text, Upload PDF, or Upload Word Document."
        )

    if len(extracted_jd_text.strip()) < 20:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="The job description text is too short to perform a meaningful match analysis."
        )

    # Clean up temp files
    for td in temp_dirs_to_clean:
        try:
            shutil.rmtree(td, ignore_errors=True)
        except Exception:
            pass

    # 3. Perform AI Semantic Match & Scored Comparison
    analysis_dict = await analyze_match(
        resume_text=extracted_resume_text,
        job_desc_text=extracted_jd_text,
        user_id=current_user.id
    )

    # 4. Save to Database
    analysis_record = CareerFitAnalysis(
        user_id=current_user.id,
        resume_filename=resume_filename,
        resume_text=extracted_resume_text,
        job_title=analysis_dict.get("job_title", "Target Role"),
        job_desc_text=extracted_jd_text,
        match_score=analysis_dict.get("match_score", 0.0),
        technical_score=analysis_dict.get("technical_score", 0.0),
        soft_skills_score=analysis_dict.get("soft_skills_score", 0.0),
        education_score=analysis_dict.get("education_score", 0.0),
        experience_score=analysis_dict.get("experience_score", 0.0),
        score_explanation=analysis_dict.get("score_explanation", ""),
        matching_skills=analysis_dict.get("matching_skills", []),
        missing_skills=analysis_dict.get("missing_skills", []),
        improvement_skills=analysis_dict.get("improvement_skills", []),
        resume_suggestions=analysis_dict.get("resume_suggestions", {}),
        roadmap_7_day=analysis_dict.get("roadmap_7_day", []),
        roadmap_30_day=analysis_dict.get("roadmap_30_day", []),
        ocr_pending=False
    )
    db.add(analysis_record)
    db.commit()
    db.refresh(analysis_record)

    # Return full result
    result = {
        "id": analysis_record.id,
        "resume_filename": resume_filename,
        "job_title": analysis_record.job_title,
        "match_score": analysis_record.match_score,
        "technical_score": analysis_record.technical_score,
        "soft_skills_score": analysis_record.soft_skills_score,
        "education_score": analysis_record.education_score,
        "experience_score": analysis_record.experience_score,
        "score_explanation": analysis_record.score_explanation,
        "matching_skills": analysis_record.matching_skills,
        "missing_skills": analysis_record.missing_skills,
        "improvement_skills": analysis_record.improvement_skills,
        "resume_suggestions": analysis_record.resume_suggestions,
        "roadmap_7_day": analysis_record.roadmap_7_day,
        "roadmap_30_day": analysis_record.roadmap_30_day,
        "created_at": analysis_record.created_at.isoformat() if analysis_record.created_at else None
    }
    return result


@router.get("/history", response_model=List[Dict[str, Any]])
def get_analysis_history(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """Retrieve previous analysis sessions for the current user."""
    if not current_user:
        current_user = db.query(User).first()
        if not current_user:
            return []

    analyses = (
        db.query(CareerFitAnalysis)
        .filter(CareerFitAnalysis.user_id == current_user.id)
        .order_by(CareerFitAnalysis.created_at.desc())
        .limit(30)
        .all()
    )

    return [
        {
            "id": a.id,
            "job_title": a.job_title,
            "resume_filename": a.resume_filename or "Resume",
            "match_score": a.match_score,
            "technical_score": a.technical_score,
            "created_at": a.created_at.isoformat() if a.created_at else None
        }
        for a in analyses
    ]


@router.get("/history/{analysis_id}", response_model=Dict[str, Any])
def get_analysis_detail(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """Retrieve full details of a past analysis session."""
    if not current_user:
        current_user = db.query(User).first()
        if not current_user:
            raise HTTPException(status_code=401, detail="User not authenticated.")

    analysis = (
        db.query(CareerFitAnalysis)
        .filter(CareerFitAnalysis.id == analysis_id, CareerFitAnalysis.user_id == current_user.id)
        .first()
    )
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis record not found.")

    return {
        "id": analysis.id,
        "resume_filename": analysis.resume_filename,
        "job_title": analysis.job_title,
        "match_score": analysis.match_score,
        "technical_score": analysis.technical_score,
        "soft_skills_score": analysis.soft_skills_score,
        "education_score": analysis.education_score,
        "experience_score": analysis.experience_score,
        "score_explanation": analysis.score_explanation,
        "matching_skills": analysis.matching_skills,
        "missing_skills": analysis.missing_skills,
        "improvement_skills": analysis.improvement_skills,
        "resume_suggestions": analysis.resume_suggestions,
        "roadmap_7_day": analysis.roadmap_7_day,
        "roadmap_30_day": analysis.roadmap_30_day,
        "created_at": analysis.created_at.isoformat() if analysis.created_at else None
    }


@router.get("/report/{analysis_id}")
def download_pdf_report(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """Generate and download the comprehensive analysis PDF report."""
    if not current_user:
        current_user = db.query(User).first()
        if not current_user:
            raise HTTPException(status_code=401, detail="User not authenticated.")

    analysis = (
        db.query(CareerFitAnalysis)
        .filter(CareerFitAnalysis.id == analysis_id, CareerFitAnalysis.user_id == current_user.id)
        .first()
    )
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis record not found.")

    user_name = current_user.full_name or "Candidate"
    pdf_bytes = generate_report(analysis, user_name=user_name)

    safe_title = "".join(c for c in (analysis.job_title or "Job") if c.isalnum() or c in (' ', '_', '-')).strip()
    safe_title = safe_title.replace(" ", "_")[:30]
    filename = f"PrepSpire_CareerFit_{safe_title}_{analysis.id}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )


@router.delete("/history/{analysis_id}")
def delete_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """Delete a past analysis session."""
    if not current_user:
        current_user = db.query(User).first()
        if not current_user:
            raise HTTPException(status_code=401, detail="User not authenticated.")

    analysis = (
        db.query(CareerFitAnalysis)
        .filter(CareerFitAnalysis.id == analysis_id, CareerFitAnalysis.user_id == current_user.id)
        .first()
    )
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis record not found.")

    db.delete(analysis)
    db.commit()
    return {"message": "Analysis deleted successfully", "id": analysis_id}
