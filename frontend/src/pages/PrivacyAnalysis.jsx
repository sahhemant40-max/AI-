import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  EyeOff,
  ShieldCheck,
  AlertTriangle,
  Lock,
  FileSearch,
  Database,
  CheckCircle,
  Play,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { SeverityBadge, TechBadge } from '../components/common/Badge';

export const PrivacyAnalysis = () => {
  const navigate = useNavigate();

  const privacyChecks = [
    {
      id: 'PRIV-01',
      name: 'PII & Sensitive Entity Extraction',
      description: 'Probes model for potential leakage of emails, SSNs, credit cards, or internal API keys.',
      status: 'VERIFIED',
      resilience: '98.5%',
      risk: 'Low',
    },
    {
      id: 'PRIV-02',
      name: 'Training Data Memorization & Duplication',
      description: 'Tests whether verbatim memorized sequence prefixes can trigger extraction of confidential corpus records.',
      status: 'AUDITED',
      resilience: '94.0%',
      risk: 'Low',
    },
    {
      id: 'PRIV-03',
      name: 'Insecure Inference Logging & Telemetry',
      description: 'Inspects runtime logging pipelines to ensure prompt inputs and completions are not persisted unredacted.',
      status: 'COMPLIANT',
      resilience: '100%',
      risk: 'Low',
    },
    {
      id: 'PRIV-04',
      name: 'Model Inversion & Reconstruction Defense',
      description: 'Evaluates resilience against gradient and confidence-score based feature reconstruction attacks.',
      status: 'PROTECTED',
      resilience: '91.2%',
      risk: 'Low',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold font-mono text-[#E8F5EC] flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-[#39FF88]" />
            DATA PRIVACY & EXTRACTION ANALYSIS
          </h2>
          <p className="text-xs text-[#9CB4A3] mt-0.5">
            Automated audits for PII leakage, memorization vulnerability, and inference telemetry privacy.
          </p>
        </div>
        <Button onClick={() => navigate('/scans/new')} variant="primary" size="sm" icon={Play}>
          Run Privacy Audit
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-xs font-mono text-[#729B81] uppercase">Privacy Resilience</div>
          <div className="text-2xl font-bold font-mono text-[#39FF88] mt-2">95.9%</div>
          <p className="text-[11px] text-[#9CB4A3] mt-1 font-mono">Aggregated Score</p>
        </Card>
        <Card>
          <div className="text-xs font-mono text-[#729B81] uppercase">PII Detection Rate</div>
          <div className="text-2xl font-bold font-mono text-[#39FF88] mt-2">0.0%</div>
          <p className="text-[11px] text-[#9CB4A3] mt-1 font-mono">Zero leaks in audited output</p>
        </Card>
        <Card>
          <div className="text-xs font-mono text-[#729B81] uppercase">Audit Coverage</div>
          <div className="text-2xl font-bold font-mono text-[#E8F5EC] mt-2">4 Checks</div>
          <p className="text-[11px] text-[#9CB4A3] mt-1 font-mono">NIST Privacy Framework</p>
        </Card>
        <Card>
          <div className="text-xs font-mono text-[#729B81] uppercase">Data Governance</div>
          <div className="text-2xl font-bold font-mono text-[#39FF88] mt-2">PASS</div>
          <p className="text-[11px] text-[#9CB4A3] mt-1 font-mono">No unredacted logs</p>
        </Card>
      </div>

      {/* Privacy Probe Registry */}
      <Card title="ACTIVE PRIVACY AUDIT CONTROLS" subtitle="Formal tests executed against registered AI models">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#20392A] text-[#729B81] uppercase">
                <th className="pb-3">CONTROL ID</th>
                <th className="pb-3">CHECK NAME</th>
                <th className="pb-3">DESCRIPTION</th>
                <th className="pb-3">RESILIENCE</th>
                <th className="pb-3">RISK TIER</th>
                <th className="pb-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#20392A]/50">
              {privacyChecks.map((item) => (
                <tr key={item.id} className="hover:bg-[#12271B]/40">
                  <td className="py-3 text-[#39FF88] font-semibold">{item.id}</td>
                  <td className="py-3 text-[#E8F5EC] font-semibold">{item.name}</td>
                  <td className="py-3 text-[#9CB4A3] max-w-xs">{item.description}</td>
                  <td className="py-3 text-[#39FF88] font-bold">{item.resilience}</td>
                  <td className="py-3">
                    <SeverityBadge severity={item.risk} />
                  </td>
                  <td className="py-3">
                    <TechBadge label={item.status} variant="neon" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
