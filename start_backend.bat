@echo off
title PrepSpire AI - Backend Server
echo ==============================================
echo   Starting PrepSpire AI FastAPI Backend Server
echo ==============================================
cd backend
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
pause
