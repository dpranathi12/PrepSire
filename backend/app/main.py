import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.db.init_db import init_db

# Routers
from app.api.v1.auth import router as auth_router
from app.api.v1.profile import router as profile_router
from app.api.v1.questions import router as questions_router
from app.api.v1.interviews import router as interviews_router
from app.api.v1.communication import router as communication_router
from app.api.v1.jam import router as jam_router
from app.api.v1.academic import router as academic_router
from app.api.v1.coding import router as coding_router
from app.api.v1.learning_plan import router as learning_plan_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.reports import router as reports_router
from app.api.v1.settings import router as settings_router
from app.api.v1.dataset import router as dataset_router
from app.api.v1.coach import router as coach_router
from app.api.v1.careerfit import router as careerfit_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables and seeds exist without recreating or dropping existing data
    logger.info("PrepSpire AI Backend starting up...")
    try:
        init_db()
        logger.info("Database verified on startup.")
    except Exception as e:
        logger.error(f"Database initialization warning on startup: {e}")
    yield
    logger.info("PrepSpire AI Backend shutting down...")

app = FastAPI(
    title="PrepSpire AI API",
    description="Backend API for AI-Powered Interview Preparation and Skill Development Platform",
    version=settings.VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 Routers
api_v1_prefix = settings.API_V1_STR
app.include_router(auth_router, prefix=api_v1_prefix)
app.include_router(profile_router, prefix=api_v1_prefix)
app.include_router(questions_router, prefix=api_v1_prefix)
app.include_router(interviews_router, prefix=api_v1_prefix)
app.include_router(communication_router, prefix=api_v1_prefix)
app.include_router(jam_router, prefix=api_v1_prefix)
app.include_router(academic_router, prefix=api_v1_prefix)
app.include_router(coding_router, prefix=api_v1_prefix)
app.include_router(learning_plan_router, prefix=api_v1_prefix)
app.include_router(dashboard_router, prefix=api_v1_prefix)
app.include_router(reports_router, prefix=api_v1_prefix)
app.include_router(settings_router, prefix=api_v1_prefix)
app.include_router(dataset_router, prefix=api_v1_prefix)
app.include_router(coach_router, prefix=api_v1_prefix)
app.include_router(careerfit_router, prefix=api_v1_prefix)

@app.get("/")
def root():
    return {
        "project": settings.PROJECT_NAME,
        "tagline": "Prepare Smarter. Speak Better. Get Interview Ready.",
        "version": settings.VERSION,
        "docs_url": "/docs",
        "api_v1": api_v1_prefix,
        "status": "online"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "connected"}
