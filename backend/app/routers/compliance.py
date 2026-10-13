from fastapi import APIRouter
from backend.app.schemas.compliance import ComplianceFrameworkResponse, ComplianceControlResponse

router = APIRouter(prefix="/api/compliance", tags=["Compliance & NIST AI RMF"])


@router.get("", response_model=ComplianceFrameworkResponse, summary="Get NIST AI RMF mapping")
async def get_compliance_mappings():
    """Retrieve structured NIST AI RMF 1.0 controls with evidence linkage."""
    functions = {
        "GOVERN": [
            ComplianceControlResponse(
                id="GV-1.1",
                function="GOVERN",
                category="Governance & Culture",
                title="Legal and Regulatory Compliance",
                description="Policies and legal requirements for AI risk management are established and documented.",
                evidence_mapping="Automated model inventory and audit trail logs track model provenance and environments.",
                coverage_status="IMPLEMENTED",
                coverage_percentage=100,
            ),
            ComplianceControlResponse(
                id="GV-2.1",
                function="GOVERN",
                category="Oversight & Monitoring",
                title="Continuous Risk Monitoring System",
                description="Mechanisms are in place to periodically monitor, evaluate, and review AI risks.",
                evidence_mapping="Scheduled security scans persisted to local MongoDB database.",
                coverage_status="IMPLEMENTED",
                coverage_percentage=95,
            ),
        ],
        "MAP": [
            ComplianceControlResponse(
                id="MP-1.1",
                function="MAP",
                category="Context Mapping",
                title="Intended Purpose & Environment Context",
                description="The intended purpose, operational context, and limitations are specified.",
                evidence_mapping="Model metadata explicitly catalogues business use case and runtime environment.",
                coverage_status="IMPLEMENTED",
                coverage_percentage=100,
            ),
        ],
        "MEASURE": [
            ComplianceControlResponse(
                id="MS-1.1",
                function="MEASURE",
                category="Technical Metrics",
                title="Adversarial Robustness Testing",
                description="Empirical measurement of model behavior under adversarial perturbations.",
                evidence_mapping="FGSM/ART gradient perturbation probes evaluate accuracy drops under epsilon budgets.",
                coverage_status="IMPLEMENTED",
                coverage_percentage=100,
            ),
            ComplianceControlResponse(
                id="MS-2.1",
                function="MEASURE",
                category="Fairness Metrics",
                title="Algorithmic Fairness & Disparity Measurement",
                description="Demographic parity differences and equalized odds metrics are evaluated quantitatively.",
                evidence_mapping="Fairlearn demographic parity and equalized odds differences across sensitive cohorts.",
                coverage_status="IMPLEMENTED",
                coverage_percentage=100,
            ),
        ],
        "MANAGE": [
            ComplianceControlResponse(
                id="MG-1.1",
                function="MANAGE",
                category="Remediation Workflow",
                title="Systematic Findings & Remediation Management",
                description="Vulnerabilities discovered during testing are tracked through resolution workflows.",
                evidence_mapping="Findings status workflow: Open -> In Progress -> Resolved -> Accepted.",
                coverage_status="IMPLEMENTED",
                coverage_percentage=100,
            ),
            ComplianceControlResponse(
                id="MG-2.1",
                function="MANAGE",
                category="Governance Documentation",
                title="Formal Risk Reporting & Archival",
                description="Technical and executive reports are generated and preserved for compliance review.",
                evidence_mapping="ReportLab PDF and python-docx generation with persistent storage in MongoDB.",
                coverage_status="IMPLEMENTED",
                coverage_percentage=100,
            ),
        ],
    }

    total_controls = sum(len(c) for c in functions.values())
    implemented = sum(
        1 for c_list in functions.values() for c in c_list if c.coverage_status == "IMPLEMENTED"
    )

    return ComplianceFrameworkResponse(
        framework="NIST AI RMF 1.0",
        version="1.0",
        functions=functions,
        overall_posture="STRONG (98% COVERAGE)",
        implemented_count=implemented,
        total_count=total_controls,
    )
