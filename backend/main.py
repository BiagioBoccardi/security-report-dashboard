from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from routes.health import router as health_router
from routes.reports import router as reports_router
from routes.vulnerabilities import router as vulnerabilities_router
from routes.analytics import router as analytics_router
from routes.export import router as export_router

load_dotenv()

app = FastAPI(
    title="Security Report Dashboard API",
    description="REST API for CyberSonar security report visualization",
    version="1.0.0",
)

cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(reports_router, prefix="/api/v1")
app.include_router(vulnerabilities_router, prefix="/api/v1")
app.include_router(analytics_router, prefix="/api/v1")
app.include_router(export_router, prefix="/api/v1")
