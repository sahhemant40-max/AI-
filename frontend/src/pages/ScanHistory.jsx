import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  Plus,
  Play,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge, SeverityBadge, TechBadge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { scansApi } from '../services/api';

export const ScanHistory = () => {
  const navigate = useNavigate();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');

  const loadScans = async () => {
    try {
      setLoading(true);
      const res = await scansApi.getScans();
      setScans(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error('Failed to load scans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScans();
    // Poll for status updates if any scan is running or queued
    const timer = setInterval(() => {
      scansApi.getScans().then((res) => {
        if (Array.isArray(res)) setScans(res);
      }).catch(() => {});
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const filteredScans = scans.filter((s) => {
    const matchesSearch =
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.id?.toLowerCase().includes(search.toLowerCase()) ||
      s.model_name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || (s.status || '').toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold font-mono text-[#E8F5EC] flex items-center gap-2">
            <History className="w-5 h-5 text-[#39FF88]" />
            SECURITY SCAN HISTORY
          </h2>
          <p className="text-xs text-[#9CB4A3] mt-0.5">
            Audit logs and assessment results for all executed vulnerability, fairness, and safety scans.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={loadScans} variant="secondary" size="sm" icon={RefreshCw}>
            Refresh
          </Button>
          <Button onClick={() => navigate('/scans/new')} variant="primary" size="sm" icon={Plus}>
            New Scan
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-[#0E1D15] p-3 rounded border border-[#20392A]">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-[#729B81] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by scan name, scan ID, or model..."
            className="w-full bg-[#08130E] border border-[#20392A] rounded pl-9 pr-4 py-1.5 text-xs text-[#E8F5EC] placeholder-[#729B81] focus:outline-none focus:border-[#39FF88] font-mono"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-[#729B81]">Status:</span>
          {['ALL', 'completed', 'running', 'queued', 'failed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded border capitalize transition-colors ${
                filterStatus === st
                  ? 'bg-[#12271B] text-[#39FF88] border-[#39FF88]/40 shadow-neon-glow'
                  : 'bg-[#08130E] text-[#9CB4A3] border-[#20392A] hover:border-[#729B81]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Scans Table */}
      {loading && scans.length === 0 ? (
        <div className="p-12 text-center text-xs font-mono text-[#729B81] animate-pulse">
          Connecting to MongoDB & fetching scan execution records...
        </div>
      ) : filteredScans.length === 0 ? (
        <EmptyState
          title="No Scans Matching Filter"
          description="Initiate an automated scan with adversarial, fairness, or privacy probes."
          actionLabel="Launch First Scan"
          onAction={() => navigate('/scans/new')}
          actionIcon={Play}
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#20392A] text-[#729B81] uppercase">
                  <th className="pb-3">SCAN ID</th>
                  <th className="pb-3">NAME & MODEL</th>
                  <th className="pb-3">MODULES</th>
                  <th className="pb-3">STATUS</th>
                  <th className="pb-3">RISK SCORE</th>
                  <th className="pb-3">COMPLETED</th>
                  <th className="pb-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#20392A]/50">
                {filteredScans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-[#12271B]/40 transition-colors">
                    <td className="py-3 text-[#39FF88] font-semibold">{scan.id}</td>
                    <td className="py-3">
                      <div className="text-[#E8F5EC] font-semibold">{scan.name}</div>
                      <div className="text-[11px] text-[#729B81]">{scan.model_name || scan.model_id}</div>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-1 flex-wrap">
                        {(scan.modules || []).map((m) => (
                          <TechBadge key={m} label={m} variant="default" />
                        ))}
                      </div>
                    </td>
                    <td className="py-3">
                      <StatusBadge status={scan.status} />
                    </td>
                    <td className="py-3">
                      {scan.risk_score !== undefined && scan.risk_score !== null ? (
                        <span className="font-bold text-[#E8F5EC] bg-[#12271B] px-2 py-0.5 rounded border border-[#20392A]">
                          {scan.risk_score} / 100
                        </span>
                      ) : (
                        <span className="text-[#729B81]">&mdash;</span>
                      )}
                    </td>
                    <td className="py-3 text-[#9CB4A3]">
                      {scan.completed_at ? new Date(scan.completed_at).toLocaleString() : 'In Progress'}
                    </td>
                    <td className="py-3 text-right">
                      <Button
                        onClick={() => navigate(`/reports?scan=${scan.id}`)}
                        variant="ghost"
                        size="sm"
                        icon={FileText}
                      >
                        Report
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
