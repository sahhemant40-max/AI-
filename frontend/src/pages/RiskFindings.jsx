import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Search,
  Filter,
  CheckCircle,
  Clock,
  ExternalLink,
  ShieldAlert,
  ChevronRight,
  FileCheck,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { SeverityBadge, StatusBadge, TechBadge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { findingsApi } from '../services/api';

export const RiskFindings = () => {
  const [findings, setFindings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [updating, setUpdating] = useState(false);

  const loadFindings = async () => {
    try {
      setLoading(true);
      const res = await findingsApi.getFindings();
      setFindings(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error('Failed to load findings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFindings();
  }, []);

  const handleUpdateStatus = async (findingId, newStatus) => {
    try {
      setUpdating(true);
      await findingsApi.updateFinding(findingId, { status: newStatus });
      // Update local state
      setFindings((prev) =>
        prev.map((f) => (f.id === findingId ? { ...f, status: newStatus } : f))
      );
      if (selectedFinding && selectedFinding.id === findingId) {
        setSelectedFinding((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const filteredFindings = findings.filter((f) => {
    const matchesSearch =
      f.title?.toLowerCase().includes(search.toLowerCase()) ||
      f.description?.toLowerCase().includes(search.toLowerCase()) ||
      f.id?.toLowerCase().includes(search.toLowerCase());
    const matchesSev = filterSeverity === 'ALL' || (f.severity || '').toLowerCase() === filterSeverity.toLowerCase();
    const matchesStat = filterStatus === 'ALL' || (f.status || '').toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesSev && matchesStat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold font-mono text-[#E8F5EC] flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#FF9B50]" />
            RISK & VULNERABILITY FINDINGS
          </h2>
          <p className="text-xs text-[#9CB4A3] mt-0.5">
            Security vulnerabilities, bias disparities, and privacy exposures discovered during scans.
          </p>
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
            placeholder="Search findings by title, ID, or description..."
            className="w-full bg-[#08130E] border border-[#20392A] rounded pl-9 pr-4 py-1.5 text-xs text-[#E8F5EC] placeholder-[#729B81] focus:outline-none focus:border-[#39FF88] font-mono"
          />
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-[#729B81]">Severity:</span>
          {['ALL', 'Critical', 'High', 'Medium', 'Low'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2 py-0.5 rounded border transition-colors ${
                filterSeverity === sev
                  ? 'bg-[#12271B] text-[#39FF88] border-[#39FF88]/40 shadow-neon-glow'
                  : 'bg-[#08130E] text-[#9CB4A3] border-[#20392A] hover:border-[#729B81]'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-[#729B81]">Status:</span>
          {['ALL', 'open', 'in_progress', 'resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2 py-0.5 rounded border capitalize transition-colors ${
                filterStatus === st
                  ? 'bg-[#12271B] text-[#39FF88] border-[#39FF88]/40 shadow-neon-glow'
                  : 'bg-[#08130E] text-[#9CB4A3] border-[#20392A] hover:border-[#729B81]'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Findings List */}
      {loading ? (
        <div className="p-12 text-center text-xs font-mono text-[#729B81] animate-pulse">
          Loading findings from MongoDB...
        </div>
      ) : filteredFindings.length === 0 ? (
        <EmptyState
          title="No Findings Detected"
          description="Either no scans have been performed yet, or all inspected models have passed safety criteria."
          actionLabel="View Scan History"
          onAction={() => {}}
        />
      ) : (
        <div className="space-y-3">
          {filteredFindings.map((finding) => (
            <div
              key={finding.id}
              onClick={() => setSelectedFinding(finding)}
              className="p-4 bg-[#0E1D15] border border-[#20392A] rounded-lg hover:border-[#39FF88]/50 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono text-[#39FF88] font-semibold">{finding.id}</span>
                  <SeverityBadge severity={finding.severity} />
                  <StatusBadge status={finding.status} />
                  <TechBadge label={finding.module || 'SECURITY'} />
                </div>
                <h3 className="text-sm font-bold font-mono text-[#E8F5EC] truncate">{finding.title}</h3>
                <p className="text-xs text-[#9CB4A3] line-clamp-1">{finding.description}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Button size="sm" variant="ghost" icon={ChevronRight}>
                  Review
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Finding Detail Modal */}
      <Modal
        isOpen={!!selectedFinding}
        onClose={() => setSelectedFinding(null)}
        title={selectedFinding?.title || 'FINDING DETAIL'}
        subtitle={`Finding ID: ${selectedFinding?.id} &bull; Module: ${selectedFinding?.module}`}
        maxWidth="max-w-3xl"
      >
        {selectedFinding && (
          <div className="space-y-5 text-xs font-mono">
            {/* Metadata Pills */}
            <div className="flex items-center gap-3 pb-3 border-b border-[#20392A] flex-wrap">
              <SeverityBadge severity={selectedFinding.severity} />
              <StatusBadge status={selectedFinding.status} />
              <TechBadge label={`Model: ${selectedFinding.model_name || selectedFinding.model_id}`} />
              <span className="text-[#729B81] text-[11px]">
                Detected: {new Date(selectedFinding.created_at || Date.now()).toLocaleDateString()}
              </span>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-[#39FF88] font-bold uppercase mb-1">Description</h4>
              <p className="text-[#E8F5EC] bg-[#08130E] p-3 rounded border border-[#20392A] leading-relaxed">
                {selectedFinding.description}
              </p>
            </div>

            {/* Empirical Evidence */}
            {selectedFinding.evidence && (
              <div>
                <h4 className="text-[#39FF88] font-bold uppercase mb-1">Empirical Evidence & Metrics</h4>
                <div className="bg-[#08130E] p-3 rounded border border-[#20392A] text-[#9CB4A3] overflow-x-auto">
                  <pre className="text-[11px] leading-tight">
                    {typeof selectedFinding.evidence === 'object'
                      ? JSON.stringify(selectedFinding.evidence, null, 2)
                      : selectedFinding.evidence}
                  </pre>
                </div>
              </div>
            )}

            {/* Potential Impact */}
            {selectedFinding.potential_impact && (
              <div>
                <h4 className="text-[#FF9B50] font-bold uppercase mb-1">Potential Security & Compliance Impact</h4>
                <p className="text-[#E8F5EC] bg-[#08130E] p-3 rounded border border-[#20392A]">
                  {selectedFinding.potential_impact}
                </p>
              </div>
            )}

            {/* Remediation Recommendation */}
            <div>
              <h4 className="text-[#39FF88] font-bold uppercase mb-1">Remediation Guidance</h4>
              <p className="text-[#E8F5EC] bg-[#12271B]/50 p-3 rounded border border-[#39FF88]/30">
                {selectedFinding.remediation || 'Apply defensive training or input sanitization filters.'}
              </p>
            </div>

            {/* Status Workflow Action */}
            <div className="pt-4 border-t border-[#20392A] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[#729B81]">Update Status:</span>
                {['open', 'in_progress', 'resolved', 'accepted'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(selectedFinding.id, st)}
                    disabled={updating || selectedFinding.status === st}
                    className={`px-2.5 py-1 rounded border text-xs capitalize transition-colors ${
                      selectedFinding.status === st
                        ? 'bg-[#39FF88] text-[#07110D] font-bold border-[#39FF88]'
                        : 'bg-[#08130E] text-[#9CB4A3] border-[#20392A] hover:border-[#39FF88]'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <Button onClick={() => setSelectedFinding(null)} variant="outline" size="sm">
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
