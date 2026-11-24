import os
import sys
import uvicorn

backend_dir = r"e:\prepspire-2\backend"
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
os.chdir(backend_dir)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, log_level="info")
