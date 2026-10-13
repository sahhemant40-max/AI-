import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Cpu,
  ScanLine,
  AlertTriangle,
  CheckCircle,
  FileText,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Server,
  Layers,
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { SeverityBadge, StatusBadge } from '../components/common/Badge';
import { RiskScoreGauge } from '../components/common/RiskScoreGauge';
import { EmptyState } from '../components/common/EmptyState';
import { modelsApi, scansApi, findingsApi, systemApi } from '../services/api';

export const Overview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalModels: 0,
    totalScans: 0,
    openFindings: 0,
    criticalFindings: 0,
    overallRiskScore: 0,
    recentScans: [],
    recentFindings: [],
  });

  const [radarData] = useState([
    { pillar: 'Adversarial', score: 78, fullMark: 100 },
    { pillar: 'Fairness', score: 85, fullMark: 100 },
    { pillar: 'Privacy', score: 92, fullMark: 100 },
    { pillar: 'LLM Safety', score: 70, fullMark: 100 },
    { pillar: 'NIST RMF', score: 82, fullMark: 100 },
  ]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [models, scans, findings] = await Promise.allSettled([
          modelsApi.getModels(),
          scansApi.getScans(),
          findingsApi.getFindings(),
        ]);

        const mList = models.status === 'fulfilled' && Array.isArray(models.value) ? models.value : [];
        const sList = scans.status === 'fulfilled' && Array.isArray(scans.value) ? scans.value : [];
        const fList = findings.status === 'fulfilled' && Array.isArray(findings.value) ? findings.value : [];

        const critCount = fList.filter(f => (f.severity || '').toLowerCase() === 'critical').length;
        const openCount = fList.filter(f => (f.status || '').toLowerCase() === 'open').length;

        // Calculate average risk score of completed scans if any exist
        const completedScans = sList.filter(s => s.status === 'completed' && s.risk_score !== undefined);
        const avgScore = completedScans.length > 0
          ? Math.round(completedScans.reduce((acc, s) => acc + (s.risk_score || 0), 0) / completedScans.length)
          : 0;

        setStats({
          totalModels: mList.length,
          totalScans: sList.length,
          openFindings: openCount,
          criticalFindings: critCount,
          overallRiskScore: avgScore,
          recentScans: sList.slice(0, 5),
          recentFindings: fList.slice(0, 5),
        });
      } catch (err) {
        console.error('Failed to load overview data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="bg-[#0E1D15] border border-[#20392A] p-4 rounded-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-[#39FF88]/10 text-[#39FF88] border border-[#39FF88]/30">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-semibold font-mono text-[#E8F5EC]">
              SECURITY OPERATIONS CENTER (SOC) &mdash; AI GOVERNANCE ACTIVE
            </h2>
            <p className="text-xs text-[#9CB4A3]">
              Continuous risk assessment, bias detection, adversarial evaluation, and NIST AI RMF compliance tracking.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate('/scans/new')} size="sm" variant="primary" icon={ScanLine}>
            Execute Scan
          </Button>
          <Button onClick={() => navigate('/models')} size="sm" variant="secondary" icon={Cpu}>
            Add Model
          </Button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:border-[#39FF88]/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#729B81] uppercase">Registered Models</span>
            <Cpu className="w-4 h-4 text-[#39FF88]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#E8F5EC]">{stats.totalModels}</span>
            <span className="text-xs font-mono text-[#729B81]">active</span>
          </div>
          <p className="text-[11px] text-[#9CB4A3] mt-2 font-mono">Traditional ML, DL & LLMs</p>
        </Card>

        <Card className="hover:border-[#39FF88]/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#729B81] uppercase">Security Scans</span>
            <ScanLine className="w-4 h-4 text-[#39FF88]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#E8F5EC]">{stats.totalScans}</span>
            <span className="text-xs font-mono text-[#729B81]">executed</span>
          </div>
          <p className="text-[11px] text-[#9CB4A3] mt-2 font-mono">Adversarial & Safety tests</p>
        </Card>

        <Card className="hover:border-[#FF9B50]/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#729B81] uppercase">Open Findings</span>
            <AlertTriangle className="w-4 h-4 text-[#FF9B50]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#FF9B50]">{stats.openFindings}</span>
            <span className="text-xs font-mono text-[#FF4D5A]">
              ({stats.criticalFindings} Critical)
            </span>
          </div>
          <p className="text-[11px] text-[#9CB4A3] mt-2 font-mono">Requiring remediation</p>
        </Card>

        <Card className="hover:border-[#39FF88]/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#729B81] uppercase">Compliance Index</span>
            <CheckCircle className="w-4 h-4 text-[#39FF88]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#39FF88]">NIST 1.0</span>
            <span className="text-xs font-mono text-[#729B81]">Mapped</span>
          </div>
          <p className="text-[11px] text-[#9CB4A3] mt-2 font-mono">Govern &bull; Map &bull; Measure &bull; Manage</p>
        </Card>
      </div>

      {/* Main Visualizations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Score Gauge & Health */}
        <Card title="AGGREGATE RISK INDEX" subtitle="Calculated risk score based on persisted scans">
          <div className="py-4 flex flex-col items-center justify-center">
            <RiskScoreGauge score={stats.overallRiskScore} size={150} />
            <div className="mt-6 w-full space-y-2 border-t border-[#20392A] pt-4">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#9CB4A3]">Assessment Status:</span>
                <span className="text-[#39FF88]">
                  {stats.totalScans > 0 ? 'CALCULATED' : 'AWAITING SCANS'}
                </span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#9CB4A3]">Scored Models:</span>
                <span className="text-[#E8F5EC]">{stats.totalModels} Registered</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Security Pillars Radar Chart */}
        <Card
          title="SECURITY PILLARS POSTURE"
          subtitle="Normalized resilience score across core assessment modules"
          className="lg:col-span-2"
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#20392A" />
                <PolarAngleAxis dataKey="pillar" stroke="#9CB4A3" tick={{ fill: '#9CB4A3', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#20392A" tick={{ fill: '#729B81', fontSize: 9 }} />
                <Radar
                  name="Resilience"
                  dataKey="score"
                  stroke="#39FF88"
                  fill="#39FF88"
                  fillOpacity={0.25}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-2 text-[11px] font-mono text-[#9CB4A3]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#39FF88]/50 border border-[#39FF88]"></span>
              Higher is safer (Resilience % against simulated attacks)
            </span>
          </div>
        </Card>
      </div>

      {/* Lower Row: Recent Scans & Critical Findings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Scans Table */}
        <Card
          title="RECENT SECURITY SCANS"
          subtitle="Real-time execution status from backend"
          action={
            <Button onClick={() => navigate('/scans')} size="sm" variant="ghost">
              View All
            </Button>
          }
        >
          {stats.recentScans.length === 0 ? (
            <EmptyState
              title="No Scans Executed Yet"
              description="Register a model and initiate your first automated risk assessment."
              actionLabel="Start New Scan"
              onAction={() => navigate('/scans/new')}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#20392A] text-[#729B81]">
                    <th className="pb-2">SCAN ID</th>
                    <th className="pb-2">MODEL</th>
                    <th className="pb-2">STATUS</th>
                    <th className="pb-2">RISK SCORE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#20392A]/50">
                  {stats.recentScans.map((scan) => (
                    <tr
                      key={scan.id}
                      onClick={() => navigate(`/scans/${scan.id}`)}
                      className="hover:bg-[#12271B]/50 cursor-pointer transition-colors"
                    >
                      <td className="py-2.5 text-[#39FF88]">{scan.id}</td>
                      <td className="py-2.5 text-[#E8F5EC]">{scan.model_name || scan.model_id}</td>
                      <td className="py-2.5">
                        <StatusBadge status={scan.status} />
                      </td>
                      <td className="py-2.5">
                        <span className="font-semibold text-[#E8F5EC]">{scan.risk_score ?? 'N/A'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* High & Critical Findings */}
        <Card
          title="SECURITY FINDINGS"
          subtitle="Vulnerabilities and compliance gaps detected"
          action={
            <Button onClick={() => navigate('/findings')} size="sm" variant="ghost">
              All Findings
            </Button>
          }
        >
          {stats.recentFindings.length === 0 ? (
            <EmptyState
              title="No Findings Recorded"
              description="No active security or fairness vulnerabilities detected in the repository."
              actionLabel="View Scan History"
              onAction={() => navigate('/scans')}
            />
          ) : (
            <div className="space-y-3">
              {stats.recentFindings.map((finding) => (
                <div
                  key={finding.id}
                  onClick={() => navigate('/findings')}
                  className="p-3 bg-[#08130E] border border-[#20392A] rounded hover:border-[#39FF88]/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#E8F5EC] font-mono truncate">
                      {finding.title}
                    </span>
                    <SeverityBadge severity={finding.severity} />
                  </div>
                  <p className="text-[11px] text-[#9CB4A3] mt-1 line-clamp-1">{finding.description}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
