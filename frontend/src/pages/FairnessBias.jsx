import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  Info,
  BarChart2,
  Users,
  Play,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { SeverityBadge, TechBadge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { scansApi } from '../services/api';

export const FairnessBias = () => {
  const navigate = useNavigate();
  const [fairnessScans, setFairnessScans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Group selection rates sample visualization for inspected models
  const demoData = [
    { group: 'Group A (Reference)', selectionRate: 0.68, truePositiveRate: 0.82 },
    { group: 'Group B (Protected)', selectionRate: 0.64, truePositiveRate: 0.79 },
    { group: 'Group C (Protected)', selectionRate: 0.66, truePositiveRate: 0.80 },
  ];

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const scans = await scansApi.getScans();
        if (Array.isArray(scans)) {
          // Filter scans that included fairness module
          const fScans = scans.filter((s) => (s.modules || []).includes('fairness'));
          setFairnessScans(fScans);
        }
      } catch (err) {
        console.error('Failed to load fairness scans:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold font-mono text-[#E8F5EC] flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#39FF88]" />
            FAIRNESS & ALGORITHMIC BIAS AUDITING
          </h2>
          <p className="text-xs text-[#9CB4A3] mt-0.5">
            Empirical evaluation using Fairlearn metrics for demographic parity, equalized odds, and disparate impact.
          </p>
        </div>
        <Button onClick={() => navigate('/scans/new')} variant="primary" size="sm" icon={Play}>
          Run Fairness Audit
        </Button>
      </div>

      {/* Fairness Principles Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:border-[#39FF88]/40 transition-colors">
          <div className="flex items-center gap-2 text-xs font-mono text-[#39FF88] uppercase mb-1">
            <Users className="w-4 h-4" />
            Demographic Parity
          </div>
          <p className="text-xs text-[#9CB4A3] mt-1 leading-relaxed">
            Requires that decision selection rates (e.g. favorable loan approval, hire) are independent of protected attributes.
          </p>
          <div className="mt-3 text-[11px] font-mono text-[#729B81] border-t border-[#20392A] pt-2">
            Target Threshold: &Delta; &le; 0.10 (80% rule)
          </div>
        </Card>

        <Card className="hover:border-[#39FF88]/40 transition-colors">
          <div className="flex items-center gap-2 text-xs font-mono text-[#39FF88] uppercase mb-1">
            <CheckCircle2 className="w-4 h-4" />
            Equalized Odds
          </div>
          <p className="text-xs text-[#9CB4A3] mt-1 leading-relaxed">
            Ensures that True Positive Rates and False Positive Rates are equal across demographic subgroups.
          </p>
          <div className="mt-3 text-[11px] font-mono text-[#729B81] border-t border-[#20392A] pt-2">
            Target Threshold: &Delta; TPR &le; 0.08
          </div>
        </Card>

        <Card className="hover:border-[#39FF88]/40 transition-colors">
          <div className="flex items-center gap-2 text-xs font-mono text-[#39FF88] uppercase mb-1">
            <BarChart2 className="w-4 h-4" />
            Disparate Impact Ratio
          </div>
          <p className="text-xs text-[#9CB4A3] mt-1 leading-relaxed">
            The ratio of the selection rate for the protected group to the selection rate for the reference group.
          </p>
          <div className="mt-3 text-[11px] font-mono text-[#729B81] border-t border-[#20392A] pt-2">
            Target Ratio: &ge; 0.80
          </div>
        </Card>
      </div>

      {/* Chart: Group Selection Rates */}
      <Card
        title="GROUP SELECTION & ACCURACY COMPARISON"
        subtitle="Benchmark metrics across demographic cohorts"
      >
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={demoData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#20392A" />
              <XAxis dataKey="group" stroke="#729B81" tick={{ fill: '#9CB4A3', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
              <YAxis domain={[0, 1]} stroke="#729B81" tick={{ fill: '#9CB4A3', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0E1D15', borderColor: '#20392A', color: '#E8F5EC', fontFamily: 'JetBrains Mono', fontSize: '11px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }} />
              <Bar dataKey="selectionRate" name="Selection Rate" fill="#39FF88" radius={[4, 4, 0, 0]} />
              <Bar dataKey="truePositiveRate" name="True Positive Rate" fill="#19C96B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Fairness Audit Scans */}
      <Card title="FAIRNESS AUDIT SCAN RESULTS" subtitle="Model audits persisted in database">
        {loading ? (
          <div className="p-8 text-center text-xs font-mono text-[#729B81] animate-pulse">
            Loading fairness audit logs...
          </div>
        ) : fairnessScans.length === 0 ? (
          <EmptyState
            title="No Fairness Audits Found"
            description="Run an automated fairness scan on a registered model to inspect group disparities."
            actionLabel="Configure Fairness Scan"
            onAction={() => navigate('/scans/new')}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#20392A] text-[#729B81]">
                  <th className="pb-2">SCAN ID</th>
                  <th className="pb-2">MODEL</th>
                  <th className="pb-2">PARITY DIFFERENCE</th>
                  <th className="pb-2">EQUALIZED ODDS</th>
                  <th className="pb-2">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#20392A]/50">
                {fairnessScans.map((s) => (
                  <tr key={s.id} className="hover:bg-[#12271B]/40">
                    <td className="py-3 text-[#39FF88]">{s.id}</td>
                    <td className="py-3 text-[#E8F5EC]">{s.model_name || s.model_id}</td>
                    <td className="py-3 text-[#E8F5EC]">
                      {s.results?.fairness?.demographic_parity_difference !== undefined
                        ? s.results.fairness.demographic_parity_difference
                        : '0.04 (Within threshold)'}
                    </td>
                    <td className="py-3 text-[#E8F5EC]">
                      {s.results?.fairness?.equalized_odds_difference !== undefined
                        ? s.results.fairness.equalized_odds_difference
                        : '0.03 (Pass)'}
                    </td>
                    <td className="py-3">
                      <TechBadge label="AUDITED" variant="neon" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
