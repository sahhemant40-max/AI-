import time
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from backend.app.database.session import get_database
from backend.app.schemas.scans import ScanCreate
from backend.app.services.model_service import get_model_by_id
from backend.app.services.assessments.robustness import run_adversarial_assessment
from backend.app.services.assessments.fairness import run_fairness_assessment
from backend.app.services.assessments.privacy import run_privacy_assessment
from backend.app.services.assessments.llm_security import run_llm_security_assessment
from backend.app.utils.risk_calculator import calculate_risk_profile
from backend.app.core.errors import ResourceNotFoundException
from backend.app.core.logging import logger


async def list_scans(model_id: Optional[str] = None, status: Optional[str] = None) -> List[Dict[str, Any]]:
    """List scans from MongoDB with optional model or status filters."""
    db = get_database()
    query = {}
    if model_id:
        query["model_id"] = model_id
    if status:
        query["status"] = status

    cursor = db["scans"].find(query, {"_id": 0}).sort("started_at", -1)
    return await cursor.to_list(length=500)


async def get_scan_by_id(scan_id: str) -> Dict[str, Any]:
    """Retrieve detailed scan by public ID."""
    db = get_database()
    scan = await db["scans"].find_one({"id": scan_id}, {"_id": 0})
    if not scan:
        raise ResourceNotFoundException("Scan", scan_id)
    return scan


async def create_and_execute_scan(payload: ScanCreate) -> Dict[str, Any]:
    """
    Creates scan record, runs requested security modules, calculates risk scores, 
    persists findings to MongoDB, and updates execution lifecycle.
    """
    db = get_database()
    target_model = await get_model_by_id(payload.model_id)

    scan_id = f"scan-{uuid.uuid4().hex[:8]}"
    start_time = time.perf_counter()
    now_iso = datetime.now(timezone.utc).isoformat()

    # Initial scan state: running
    scan_doc = {
        "id": scan_id,
        "name": payload.name,
        "model_id": payload.model_id,
        "model_name": target_model.get("name"),
        "intensity": payload.intensity,
        "modules": payload.modules,
        "parameters": payload.parameters or {},
        "status": "running",
        "progress_percentage": 10,
        "current_stage": "Initializing security assessment probes",
        "started_at": now_iso,
        "completed_at": None,
        "duration_seconds": None,
        "risk_score": None,
        "risk_category": None,
        "completeness": None,
        "findings_count": 0,
        "results": {},
        "error_message": None,
    }

    await db["scans"].insert_one(scan_doc)
    logger.info(f"Initiated security scan {scan_id} for model '{target_model.get('name')}'")

    try:
        module_results = {}
        all_findings = []
        modules_to_run = payload.modules

        # Step 1: Robustness
        if "robustness" in modules_to_run:
            rob_result, rob_findings = run_adversarial_assessment(target_model, payload.parameters or {})
            module_results["robustness"] = rob_result
            all_findings.extend(rob_findings)
            await db["scans"].update_one({"id": scan_id}, {"$set": {"progress_percentage": 35, "current_stage": "Robustness probes completed"}})

        # Step 2: Fairness
        if "fairness" in modules_to_run:
            fair_result, fair_findings = run_fairness_assessment(target_model, payload.parameters or {})
            module_results["fairness"] = fair_result
            all_findings.extend(fair_findings)
            await db["scans"].update_one({"id": scan_id}, {"$set": {"progress_percentage": 60, "current_stage": "Fairness evaluation completed"}})

        # Step 3: Privacy
        if "privacy" in modules_to_run:
            priv_result, priv_findings = run_privacy_assessment(target_model, payload.parameters or {})
            module_results["privacy"] = priv_result
            all_findings.extend(priv_findings)
            await db["scans"].update_one({"id": scan_id}, {"$set": {"progress_percentage": 80, "current_stage": "Privacy extraction probes completed"}})

        # Step 4: LLM Security
        if "llm_security" in modules_to_run:
            llm_result, llm_findings = run_llm_security_assessment(target_model, payload.parameters or {})
            module_results["llm_security"] = llm_result
            all_findings.extend(llm_findings)
            await db["scans"].update_one({"id": scan_id}, {"$set": {"progress_percentage": 90, "current_stage": "LLM guardrail probes completed"}})

        # Persist findings to MongoDB
        for f in all_findings:
            f["scan_id"] = scan_id
            f["model_id"] = payload.model_id
            f["model_name"] = target_model.get("name")
            f["created_at"] = datetime.now(timezone.utc).isoformat()
            f["updated_at"] = f["created_at"]
            await db["findings"].insert_one(f)

        # Deterministic Risk Scoring
        risk_score, risk_cat, completeness, score_meta = calculate_risk_profile(
            executed_modules=list(module_results.keys()),
            module_results=module_results,
            findings=all_findings,
        )

        duration = round(time.perf_counter() - start_time, 2)
        completed_iso = datetime.now(timezone.utc).isoformat()

        # Update final completed scan record in MongoDB
        update_doc = {
            "status": "completed",
            "progress_percentage": 100,
            "current_stage": "Assessment complete and indexed",
            "completed_at": completed_iso,
            "duration_seconds": duration,
            "risk_score": risk_score,
            "risk_category": risk_cat,
            "completeness": completeness,
            "findings_count": len(all_findings),
            "results": module_results,
            "scoring_metadata": score_meta,
        }

        await db["scans"].update_one({"id": scan_id}, {"$set": update_doc})

        # Audit log entry
        await db["audit_logs"].insert_one({
            "id": f"aud-{uuid.uuid4().hex[:8]}",
            "action": "SCAN_COMPLETED",
            "scan_id": scan_id,
            "model_id": payload.model_id,
            "risk_score": risk_score,
            "findings_count": len(all_findings),
            "timestamp": completed_iso,
        })

        logger.info(f"Scan {scan_id} finished in {duration}s. Risk score: {risk_score} ({risk_cat})")
        return await db["scans"].find_one({"id": scan_id}, {"_id": 0})

    except Exception as e:
        logger.error(f"Scan {scan_id} execution failed: {e}")
        await db["scans"].update_one(
            {"id": scan_id},
            {
                "$set": {
                    "status": "failed",
                    "error_message": str(e),
                    "completed_at": datetime.now(timezone.utc).isoformat(),
                }
            },
        )
        raise
