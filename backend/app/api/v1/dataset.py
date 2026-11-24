from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.db.session import get_db
from app.models.user import User
from app.models.dataset import DatasetImport
from app.api.deps import get_current_user
from scripts.import_dataset import import_dataset

router = APIRouter(prefix="/dataset", tags=["Dataset Management"])

@router.get("/status")
def get_dataset_imports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    imports = db.query(DatasetImport).order_by(DatasetImport.created_at.desc()).all()
    return imports

@router.post("/import")
def trigger_dataset_import(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        summary = import_dataset()
        return {"message": "Dataset import completed successfully.", "summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Import failed: {str(e)}")
