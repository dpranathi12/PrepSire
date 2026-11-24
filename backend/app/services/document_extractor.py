import os
import re
from typing import Optional, Tuple

# PDF Extraction using pypdf (installed and verified)
try:
    import pypdf
except ImportError:
    pypdf = None

# DOCX Extraction using python-docx (installed and verified)
try:
    import docx
except ImportError:
    docx = None

# Optional OCR via pytesseract
try:
    import pytesseract
except ImportError:
    pytesseract = None


def extract_text_from_pdf(file_path: str) -> str:
    """Extract complete text from a multi-page PDF document."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    
    if pypdf is None:
        raise RuntimeError("pypdf is required for PDF parsing.")
    
    extracted_text = []
    try:
        reader = pypdf.PdfReader(file_path)
        for page_idx, page in enumerate(reader.pages):
            text = page.extract_text()
            if text and text.strip():
                extracted_text.append(text.strip())
    except Exception as e:
        raise RuntimeError(f"Error reading PDF file: {str(e)}")
    
    full_text = "\n\n".join(extracted_text).strip()
    
    # If standard text extraction yielded almost nothing, attempt OCR if available
    if len(full_text) < 30 and pytesseract is not None:
        try:
            from PIL import Image
            # Check if pdf has extractable images or scanned page renders
            ocr_text = []
            reader = pypdf.PdfReader(file_path)
            for page in reader.pages:
                for img_obj in page.images:
                    img = Image.open(img_obj.data)
                    txt = pytesseract.image_to_string(img)
                    if txt.strip():
                        ocr_text.append(txt.strip())
            if ocr_text:
                full_text = "\n\n".join(ocr_text).strip()
        except Exception:
            pass  # Fallback to existing extracted text
            
    return full_text


def extract_text_from_docx(file_path: str) -> str:
    """Extract complete text from Word .docx file including paragraphs and tables."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    
    if docx is None:
        raise RuntimeError("python-docx is required for DOCX parsing.")
    
    doc = docx.Document(file_path)
    lines = []
    
    for p in doc.paragraphs:
        txt = p.text.strip()
        if txt:
            lines.append(txt)
            
    # Also extract any tables (resumes often put skills or education in tables)
    for table in doc.tables:
        for row in table.rows:
            row_cells = [cell.text.strip() for cell in row.cells if cell.text.strip()]
            if row_cells:
                lines.append(" | ".join(row_cells))
                
    return "\n\n".join(lines).strip()


def extract_text_from_doc(file_path: str) -> str:
    """
    Extract readable text from legacy binary .doc files by parsing text streams
    and filtering ASCII/UTF-8 alphanumeric clusters.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    
    try:
        # Binary reading with ASCII/UTF-8 extraction
        with open(file_path, "rb") as f:
            content = f.read()
            
        # Clean text tokens from binary stream
        decoded = content.decode("latin-1", errors="ignore")
        # Extract sequences of readable text
        strings = re.findall(r'[\x20-\x7E\r\n\t]{4,}', decoded)
        cleaned_lines = []
        for s in strings:
            s_clean = s.strip()
            # Filter out binary metadata noise
            if len(s_clean) > 3 and not s_clean.startswith(('Microsoft', 'WordDocument', 'Root Entry', 'CompObj')):
                cleaned_lines.append(s_clean)
        return "\n".join(cleaned_lines).strip()
    except Exception as e:
        raise RuntimeError(f"Could not extract legacy .doc file: {str(e)}")


def extract_document_text(file_path: str, filename: str) -> Tuple[str, str]:
    """
    Inspects extension and dispatches to appropriate extractor.
    Returns (extracted_text, detected_type).
    """
    ext = os.path.splitext(filename.lower())[1]
    
    if ext == ".pdf":
        text = extract_text_from_pdf(file_path)
        return text, "pdf"
    elif ext == ".docx":
        text = extract_text_from_docx(file_path)
        return text, "docx"
    elif ext == ".doc":
        text = extract_text_from_doc(file_path)
        return text, "doc"
    else:
        raise ValueError(f"Unsupported document format '{ext}'. Supported: .pdf, .docx, .doc")
