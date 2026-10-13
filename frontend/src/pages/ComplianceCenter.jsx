import React, { useState } from 'react';
import {
  CheckSquare,
  Shield,
  Layers,
  Activity,
  FileCheck,
  AlertCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { TechBadge } from '../components/common/Badge';

export const ComplianceCenter = () => {
  const [activeTab, setActiveTab] = useState('GOVERN');

  const functions = [
    { id: 'GOVERN', name: 'GOVERN', count: '4 Controls', desc: 'Cultivate a culture of risk management and oversight.' },
    { id: 'MAP', name: 'MAP', count: '4 Controls', desc: 'Contextualize AI system risks, impact, and dependencies.' },
    { id: 'MEASURE', name: 'MEASURE', count: '5 Controls', desc: 'Quantify and evaluate performance, bias, and robustness.' },
    { id: 'MANAGE', name: 'MANAGE', count: '4 Controls', desc: 'Allocate resources and apply controls to mitigate AI risks.' },
  ];

  const controlsData = {
    GOVERN: [
      {
        id: 'GV-1.1',
        title: 'Legal and Regulatory Compliance',
        category: 'Governance & Culture',
        description: 'Policies, legal requirements, and ethical guidelines for AI model deployment are established and documented.',
        evidence: 'Automated platform audit logs track all model registration, owners, and versions.',
        status: 'IMPLEMENTED',
        coverage: '100%',
      },
      {
        id: 'GV-1.2',
        title: 'Accountability & Roles Structure',
        category: 'Governance & Culture',
        description: 'Roles, responsibilities, and lines of communication for AI risk management are assigned.',
        evidence: 'Model owner and team attribution recorded with every model inventory entry.',
        status: 'IMPLEMENTED',
        coverage: '100%',
      },
      {
        id: 'GV-2.1',
        title: 'Continuous Risk Monitoring System',
        category: 'Oversight & Monitoring',
        description: 'Mechanisms are in place to periodically monitor, evaluate, and review AI risks post-deployment.',
        evidence: 'Periodic automated scheduled scans with persistence in local MongoDB.',
        status: 'IMPLEMENTED',
        coverage: '95%',
      },
      {
        id: 'GV-3.1',
        title: 'Third-Party AI & Supply Chain Verification',
        category: 'Supply Chain',
        description: 'Risks associated with third-party foundation models, APIs, and pre-trained weights are accounted for.',
        evidence: 'Model source type and API endpoints recorded with rate-limiting and SSRF safeguards.',
        status: 'IN_PROGRESS',
        coverage: '80%',
      },
    ],
    MAP: [
      {
        id: 'MP-1.1',
        title: 'Intended Purpose & Environment Context',
        category: 'Context Mapping',
        description: 'The intended purpose, business benefits, operational environment, and limitations are specified.',
        evidence: 'Model metadata explicitly registers environment (Dev/Staging/Prod) and intended use.',
        status: 'IMPLEMENTED',
        coverage: '100%',
      },
      {
        id: 'MP-2.1',
        title: 'Scientific Categorization of AI System',
        category: 'Categorization',
        description: 'Model architectural class (Traditional ML, Deep Learning, LLM) and training framework are documented.',
        evidence: 'Framework identification (scikit-learn, PyTorch, HuggingFace, OpenAI) persisted in database.',
        status: 'IMPLEMENTED',
        coverage: '100%',
      },
      {
        id: 'MP-3.1',
        title: 'Impact Assessment & Stakeholder Groups',
        category: 'Impact Mapping',
        description: 'Potential disparate impacts across individuals and demographic groups are anticipated.',
        evidence: 'Demographic sensitive attribute selection (gender, age, ethnicity) integrated in scan configuration.',
        status: 'IMPLEMENTED',
        coverage: '90%',
      },
      {
        id: 'MP-4.1',
        title: 'Risk Tier Categorization',
        category: 'Risk Classification',
        description: 'Models are classified into Low, Medium, High, and Critical impact tiers.',
        evidence: 'Automated 0-100 deterministic risk engine classifies models based on vulnerability metrics.',
        status: 'IMPLEMENTED',
        coverage: '100%',
      },
    ],
    MEASURE: [
      {
        id: 'MS-1.1',
        title: 'Adversarial Robustness Testing',
        category: 'Technical Metrics',
        description: 'Empirical measurement of model behavior under adversarial perturbations and noise.',
        evidence: 'Adversarial evasion attacks (FGSM/ART probes) evaluate accuracy drops under epsilon budgets.',
        status: 'IMPLEMENTED',
        coverage: '100%',
      },
      {
        id: 'MS-2.1',
        title: 'Algorithmic Fairness & Disparity Measurement',
        category: 'Fairness Metrics',
        description: 'Demographic parity differences and equalized odds metrics are evaluated quantitatively.',
        evidence: 'Fairlearn calculations for selection rate and TPR parity across demographic cohorts.',
        status: 'IMPLEMENTED',
        coverage: '100%',
      },
      {
        id: 'MS-2.5',
        title: 'Privacy and Memorization Audits',
        category: 'Data Privacy',
        description: 'Model inference is evaluated for sensitive entity leakage and memorized confidential strings.',
        evidence: 'PII pattern probes and extraction resilience tests executed against model completions.',
        status: 'IMPLEMENTED',
        coverage: '95%',
      },
      {
        id: 'MS-3.1',
        title: 'LLM Prompt Injection Resistance',
        category: 'Generative AI Security',
        description: 'Direct and indirect prompt injection probes test guardrail enforcement.',
        evidence: 'Automated injection jailbreak suite aligned with OWASP Top 10 for LLMs.',
        status: 'IMPLEMENTED',
        coverage: '95%',
      },
      {
        id: 'MS-4.1',
        title: 'Formal Test Coverage & Assessment Completeness',
        category: 'Completeness',
        description: 'Overall assessment completeness is computed based on executed versus skipped modules.',
        evidence: 'Completeness index computed deterministically and displayed in all generated reports.',
        status: 'IMPLEMENTED',
        coverage: '100%',
      },
    ],
    MANAGE: [
      {
        id: 'MG-1.1',
        title: 'Systematic Findings & Remediation Management',
        category: 'Remediation Workflow',
        description: 'Vulnerabilities discovered during testing are tracked through resolution workflows.',
        evidence: 'Findings management lifecycle: Open -> In Progress -> Resolved -> Accepted status tracking.',
        status: 'IMPLEMENTED',
        coverage: '100%',
      },
      {
        id: 'MG-2.1',
        title: 'Formal Risk Reporting & Archival',
        category: 'Governance Documentation',
        description: 'Technical and executive reports are generated and preserved for compliance review.',
        evidence: 'Automated ReportLab PDF and python-docx report generation directly from MongoDB scan data.',
        status: 'IMPLEMENTED',
        coverage: '100%',
      },
      {
        id: 'MG-3.1',
        title: 'Incident Response & Fallback Protocols',
        category: 'Operational Controls',
        description: 'Contingency plans for deployed AI models exhibiting abnormal outputs or security failure.',
        evidence: 'Automated finding severity categorization triggers alerts for High and Critical vulnerabilities.',
        status: 'IMPLEMENTED',
        coverage: '90%',
      },
      {
        id: 'MG-4.1',
        title: 'Continuous Audit Trail & Logging',
        category: 'Auditability',
        description: 'Full traceability of scans, model changes, and user decisions.',
        evidence: 'Audit logs collection in MongoDB tracks diagnostic operations and scan timestamps.',
        status: 'IMPLEMENTED',
        coverage: '100%',
      },
    ],
  };

  const activeControls = controlsData[activeTab] || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold font-mono text-[#E8F5EC] flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-[#39FF88]" />
            NIST AI RMF 1.0 COMPLIANCE CENTER
          </h2>
          <p className="text-xs text-[#9CB4A3] mt-0.5">
            Cross-mapping of empirical security scan evidence to the NIST AI Risk Management Framework.
          </p>
        </div>
      </div>

      {/* NIST Functions Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {functions.map((f) => (
          <div
            key={f.id}
            onClick={() => setActiveTab(f.id)}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              activeTab === f.id
                ? 'bg-[#12271B] border-[#39FF88] shadow-neon-glow'
                : 'bg-[#0E1D15] border-[#20392A] hover:border-[#729B81]'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold font-mono text-[#E8F5EC]">{f.name}</span>
              <TechBadge label={f.count} variant={activeTab === f.id ? 'neon' : 'default'} />
            </div>
            <p className="text-[11px] text-[#9CB4A3] line-clamp-2">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Controls Table */}
      <Card
        title={`NIST AI RMF: ${activeTab} FUNCTION CONTROLS`}
        subtitle="Automated evidence and governance verification mapping"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#20392A] text-[#729B81] uppercase">
                <th className="pb-3">CONTROL ID</th>
                <th className="pb-3">PRACTICE TITLE</th>
                <th className="pb-3">REQUIREMENT</th>
                <th className="pb-3">AUTOMATED PLATFORM EVIDENCE</th>
                <th className="pb-3">COVERAGE</th>
                <th className="pb-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#20392A]/50">
              {activeControls.map((c) => (
                <tr key={c.id} className="hover:bg-[#12271B]/40">
                  <td className="py-3 text-[#39FF88] font-bold">{c.id}</td>
                  <td className="py-3 text-[#E8F5EC] font-semibold">{c.title}</td>
                  <td className="py-3 text-[#9CB4A3] max-w-xs">{c.description}</td>
                  <td className="py-3 text-[#39FF88]/90 max-w-xs">{c.evidence}</td>
                  <td className="py-3 text-[#E8F5EC] font-bold">{c.coverage}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        c.status === 'IMPLEMENTED'
                          ? 'bg-[#39FF88]/15 text-[#39FF88] border-[#39FF88]/40'
                          : 'bg-[#FFD166]/15 text-[#FFD166] border-[#FFD166]/40'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Compliance Disclaimer */}
      <div className="p-3 bg-[#08130E] border border-[#20392A] rounded text-[11px] font-mono text-[#729B81] flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-[#FFD166] shrink-0" />
        <span>
          Governance Mapping Notice: AI Sentinel provides empirical technical audit evidence mapped to NIST AI RMF 1.0 guidelines. This mapping does not constitute formal third-party regulatory certification.
        </span>
      </div>
    </div>
  );
};
