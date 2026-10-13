import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FileText,
  Download,
  Plus,
  RefreshCw,
  FileCheck,
  FileType,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { TechBadge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { reportsApi, scansApi } from '../services/api';

export const Reports = () => {
  const [searchParams] = useSearchParams();
  const preselectedScanId = searchParams.get('scan');

  const [reports, setReports] = useState([]);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const [formData, setFormData] = useState({
    scan_id: preselectedScanId || '',
    report_type: 'Comprehensive Technical Audit',
    title: 'AI Sentinel Risk Assessment Report',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [reportsRes, scansRes] = await Promise.allSettled([
        reportsApi.getReports(),
        scansApi.getScans(),
      ]);

      const rList = reportsRes.status === 'fulfilled' && Array.isArray(reportsRes.value) ? reportsRes.value : [];
      const sList = scansRes.status === 'fulfilled' && Array.isArray(scansRes.value) ? scansRes.value : [];

      setReports(rList);
      setScans(sList);
      if (sList.length > 0 && !formData.scan_id) {
        setFormData((prev) => ({ ...prev, scan_id: sList[0].id }));
      }
    } catch (err) {
      console.error('Failed to load reports data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    if (preselectedScanId) {
      setIsModalOpen(true);
    }
  }, [preselectedScanId]);

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    try {
      setGenerating(true);
      await reportsApi.generateReport(formData);
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      alert(`Report generation failed: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (reportId, format) => {
    try {
      setDownloadingId(`${reportId}-${format}`);
      const blob = await reportsApi.downloadReport(reportId, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AI-SENTINEL-${reportId}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(`Download failed: ${err.message}`);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold font-mono text-[#E8F5EC] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#39FF88]" />
            GOVERNANCE & AUDIT REPORTS
          </h2>
          <p className="text-xs text-[#9CB4A3] mt-0.5">
            Downloadable executive summaries, technical audit dossiers, and NIST compliance packages.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={loadData} variant="secondary" size="sm" icon={RefreshCw}>
            Refresh
          </Button>
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="primary"
            size="sm"
            icon={Plus}
            className="shadow-neon-glow"
          >
            Generate Report
          </Button>
        </div>
      </div>

      {/* Reports Catalog */}
      {loading ? (
        <div className="p-12 text-center text-xs font-mono text-[#729B81] animate-pulse">
          Fetching persisted audit reports from database...
        </div>
      ) : reports.length === 0 ? (
        <EmptyState
          title="No Reports Generated Yet"
          description="Compile a formalized PDF or DOCX risk dossier from any completed security scan."
          actionLabel="Generate First Report"
          onAction={() => setIsModalOpen(true)}
          actionIcon={FileText}
        />
      ) : (
        <Card title="GENERATED AUDIT DOSSIERS" subtitle="Archived reports ready for export">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#20392A] text-[#729B81] uppercase">
                  <th className="pb-3">REPORT ID</th>
                  <th className="pb-3">REPORT TITLE</th>
                  <th className="pb-3">SCAN REF</th>
                  <th className="pb-3">TYPE</th>
                  <th className="pb-3">GENERATED AT</th>
                  <th className="pb-3 text-right">EXPORTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#20392A]/50">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-[#12271B]/40">
                    <td className="py-3 text-[#39FF88] font-bold">{report.id}</td>
                    <td className="py-3 text-[#E8F5EC] font-semibold">{report.title}</td>
                    <td className="py-3 text-[#729B81]">{report.scan_id}</td>
                    <td className="py-3">
                      <TechBadge label={report.report_type} variant="neon" />
                    </td>
                    <td className="py-3 text-[#9CB4A3]">
                      {new Date(report.created_at || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          onClick={() => handleDownload(report.id, 'pdf')}
                          disabled={downloadingId === `${report.id}-pdf`}
                          size="sm"
                          variant="outline"
                          icon={Download}
                        >
                          {downloadingId === `${report.id}-pdf` ? 'Exporting...' : 'PDF'}
                        </Button>
                        <Button
                          onClick={() => handleDownload(report.id, 'docx')}
                          disabled={downloadingId === `${report.id}-docx`}
                          size="sm"
                          variant="secondary"
                          icon={Download}
                        >
                          {downloadingId === `${report.id}-docx` ? 'Exporting...' : 'DOCX'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Report Generation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="GENERATE RISK ASSESSMENT REPORT"
        subtitle="Compile persistent scan telemetry into formal PDF or Word dossiers"
      >
        <form onSubmit={handleGenerateReport} className="space-y-4 text-xs font-mono">
          <div>
            <label className="block text-[#729B81] mb-1">Target Security Scan *</label>
            <select
              value={formData.scan_id}
              onChange={(e) => setFormData({ ...formData, scan_id: e.target.value })}
              required
              className="w-full bg-[#08130E] border border-[#20392A] rounded p-2 text-[#E8F5EC] focus:border-[#39FF88] focus:outline-none"
            >
              {scans.length === 0 ? (
                <option value="">No completed scans found in database</option>
              ) : (
                scans.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.id}) &bull; Risk: {s.risk_score ?? 'N/A'}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-[#729B81] mb-1">Report Format & Scope</label>
            <select
              value={formData.report_type}
              onChange={(e) => setFormData({ ...formData, report_type: e.target.value })}
              className="w-full bg-[#08130E] border border-[#20392A] rounded p-2 text-[#E8F5EC] focus:border-[#39FF88] focus:outline-none"
            >
              <option value="Comprehensive Technical Audit">Comprehensive Technical Audit (Deep Dive)</option>
              <option value="Executive Summary">Executive Summary (C-Suite / Stakeholders)</option>
              <option value="NIST AI RMF Compliance Dossier">NIST AI RMF 1.0 Compliance Dossier</option>
            </select>
          </div>

          <div>
            <label className="block text-[#729B81] mb-1">Report Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-[#08130E] border border-[#20392A] rounded p-2 text-[#E8F5EC] focus:border-[#39FF88] focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-[#20392A] flex justify-end gap-3">
            <Button onClick={() => setIsModalOpen(false)} variant="outline" size="sm">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={generating}
              disabled={!formData.scan_id}
            >
              Compile & Save Report
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
