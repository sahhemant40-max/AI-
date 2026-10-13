import os
from typing import List
from fastapi import APIRouter, status, HTTPException, Query
from fastapi.responses import FileResponse
from backend.app.schemas.reports import ReportCreate, ReportResponse
from backend.app.services import report_service

router = APIRouter(prefix="/api/reports", tags=["Governance & Technical Reports"])


@router.get("", response_model=List[ReportResponse], summary="List all compiled reports")
async def list_reports():
    """Retrieve all archived PDF and Word reports."""
    return await report_service.list_reports()


@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED, summary="Generate report")
async def generate_report(payload: ReportCreate):
    """Compile PDF and DOCX reports for a completed scan."""
    return await report_service.create_report(
        scan_id=payload.scan_id,
        report_type=payload.report_type,
        title=payload.title,
    )


@router.get("/{report_id}/download", summary="Download report file (PDF or DOCX)")
async def download_report(
    report_id: str,
    format: str = Query("pdf", description="'pdf' or 'docx'"),
):
    """Download physical PDF or Word DOCX dossier."""
    report = await report_service.get_report_by_id(report_id)
    fmt = format.lower().strip()

    if fmt == "pdf":
        filepath = report.get("pdf_path")
        media_type = "application/pdf"
        filename = f"AI-SENTINEL-{report_id}.pdf"
    elif fmt == "docx":
        filepath = report.get("docx_path")
        media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        filename = f"AI-SENTINEL-{report_id}.docx"
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported format. Only 'pdf' and 'docx' are supported.",
        )

    if not filepath or not os.path.exists(filepath):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Report file {filename} not found on server storage.",
        )

    return FileResponse(
        path=filepath,
        media_type=media_type,
        filename=filename,
    )
