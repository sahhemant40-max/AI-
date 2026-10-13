import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Database,
  Server,
  Shield,
  Sliders,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Terminal,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { TechBadge } from '../components/common/Badge';
import { useSystemStatus } from '../context/SystemStatusContext';
import { systemApi } from '../services/api';

export const Settings = () => {
  const { backendOnline, dbReady, dbLatency, refreshStatus } = useSystemStatus();
  const [testResult, setTestResult] = useState(null);
  const [testingDb, setTestingDb] = useState(false);

  const handleTestDbPing = async () => {
    try {
      setTestingDb(true);
      const res = await systemApi.testDb('Diagnostic verification ping from UI Settings');
      setTestResult({
        success: true,
        message: res.message,
        recordId: res.record_id,
        timestamp: res.inserted_at,
      });
      refreshStatus();
    } catch (err) {
      setTestResult({
        success: false,
        message: err.message || 'Database test failed',
      });
    } finally {
      setTestingDb(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold font-mono text-[#E8F5EC] flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-[#39FF88]" />
          PLATFORM CONFIGURATION & SYSTEM TELEMETRY
        </h2>
        <p className="text-xs text-[#9CB4A3] mt-0.5">
          Local services management, MongoDB Compass telemetry, risk score thresholds, and Atlas migration.
        </p>
      </div>

      {/* Grid: Environment & Database Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backend & API Server Settings */}
        <Card title="BACKEND API SERVICE" subtitle="FastAPI asynchronous engine status">
          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between items-center py-1 border-b border-[#20392A]">
              <span className="text-[#729B81]">Base URL:</span>
              <span className="text-[#E8F5EC]">http://127.0.0.1:8000</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#20392A]">
              <span className="text-[#729B81]">Documentation:</span>
              <a
                href="http://127.0.0.1:8000/docs"
                target="_blank"
                rel="noreferrer"
                className="text-[#39FF88] hover:underline flex items-center gap-1"
              >
                /docs (Swagger UI) <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#20392A]">
              <span className="text-[#729B81]">Liveness Probe:</span>
              <span className={backendOnline ? 'text-[#39FF88] font-bold' : 'text-[#FF4D5A]'}>
                {backendOnline ? 'ONLINE (200 OK)' : 'UNREACHABLE'}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-[#729B81]">Framework:</span>
              <span className="text-[#E8F5EC]">FastAPI 0.110+ (Python 3.13)</span>
            </div>
          </div>
        </Card>

        {/* MongoDB Database Configuration */}
        <Card title="MONGODB COMMUNITY SERVER" subtitle="Primary persistent document database">
          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between items-center py-1 border-b border-[#20392A]">
              <span className="text-[#729B81]">Connection URI:</span>
              <span className="text-[#39FF88]">mongodb://127.0.0.1:27017</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#20392A]">
              <span className="text-[#729B81]">Database Name:</span>
              <span className="text-[#E8F5EC]">ai_sentinel</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#20392A]">
              <span className="text-[#729B81]">Server Status:</span>
              <span className={dbReady ? 'text-[#39FF88] font-bold' : 'text-[#FF4D5A]'}>
                {dbReady ? `CONNECTED (${dbLatency || 1}ms)` : 'NOT CONNECTED'}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-[#729B81]">Active Collections:</span>
              <span className="text-[#E8F5EC]">models, scans, findings, reports, audit_logs</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#20392A] flex items-center justify-between">
            <Button
              onClick={handleTestDbPing}
              variant="secondary"
              size="sm"
              loading={testingDb}
              icon={Database}
            >
              Test Write & Read Record
            </Button>
            <Button onClick={refreshStatus} variant="ghost" size="sm" icon={RefreshCw}>
              Refresh Health
            </Button>
          </div>

          {testResult && (
            <div
              className={`mt-3 p-3 rounded text-[11px] font-mono border ${
                testResult.success
                  ? 'bg-[#39FF88]/10 text-[#39FF88] border-[#39FF88]/30'
                  : 'bg-[#FF4D5A]/10 text-[#FF4D5A] border-[#FF4D5A]/30'
              }`}
            >
              <div className="font-bold">{testResult.message}</div>
              {testResult.recordId && (
                <div className="text-[#9CB4A3] mt-1">
                  Inserted Document ID: <span className="text-[#E8F5EC]">{testResult.recordId}</span> into audit_logs collection.
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* MongoDB Compass Inspection Guide */}
      <Card
        title="VISUAL INSPECTION VIA MONGODB COMPASS"
        subtitle="Steps to inspect persistent collections in the Compass desktop client"
      >
        <div className="space-y-3 text-xs font-mono text-[#9CB4A3]">
          <p className="leading-relaxed">
            You can visually inspect, query, and filter all documents saved by AI Sentinel using MongoDB Compass:
          </p>
          <ol className="list-decimal list-inside space-y-1.5 pl-2 text-[#E8F5EC]">
            <li>Open <strong className="text-[#39FF88]">MongoDB Compass</strong> on Windows.</li>
            <li>In the New Connection screen, enter: <code className="bg-[#08130E] px-1.5 py-0.5 rounded text-[#39FF88]">mongodb://127.0.0.1:27017</code></li>
            <li>Click <strong className="text-[#39FF88]">Connect</strong>.</li>
            <li>Select the <code className="bg-[#08130E] px-1.5 py-0.5 rounded text-[#39FF88]">ai_sentinel</code> database from the left sidebar.</li>
            <li>Browse the collections: <code className="text-[#39FF88]">models</code>, <code className="text-[#39FF88]">scans</code>, <code className="text-[#39FF88]">findings</code>, <code className="text-[#39FF88]">reports</code>.</li>
          </ol>
        </div>
      </Card>

      {/* Risk Thresholds Tuning */}
      <Card
        title="DETERMINISTIC RISK SCORING WEIGHTS"
        subtitle="Documented calculation matrix used by the risk engine"
      >
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 bg-[#08130E] border border-[#39FF88]/30 rounded">
            <span className="text-[#39FF88] font-bold block mb-1">LOW RISK (0 - 30)</span>
            <p className="text-[11px] text-[#9CB4A3]">Negligible adversarial drop, high fairness parity, zero PII leaks.</p>
          </div>
          <div className="p-3 bg-[#08130E] border border-[#FFD166]/30 rounded">
            <span className="text-[#FFD166] font-bold block mb-1">MEDIUM (31 - 60)</span>
            <p className="text-[11px] text-[#9CB4A3]">Minor boundary perturbation sensitivity or slight subgroup disparity.</p>
          </div>
          <div className="p-3 bg-[#08130E] border border-[#FF9B50]/30 rounded">
            <span className="text-[#FF9B50] font-bold block mb-1">HIGH (61 - 85)</span>
            <p className="text-[11px] text-[#9CB4A3]">Significant adversarial vulnerability, demographic gap &gt; 15%.</p>
          </div>
          <div className="p-3 bg-[#08130E] border border-[#FF4D5A]/30 rounded">
            <span className="text-[#FF4D5A] font-bold block mb-1">CRITICAL (86 - 100)</span>
            <p className="text-[11px] text-[#9CB4A3]">Prompt injection jailbreak bypass or sensitive data leakage.</p>
          </div>
        </div>
      </Card>

      {/* Migration to Atlas */}
      <Card
        title="FUTURE MIGRATION TO MONGODB ATLAS"
        subtitle="Zero code rewrite required &mdash; environment variable driven"
      >
        <div className="text-xs font-mono text-[#9CB4A3] space-y-2">
          <p>
            To migrate this deployment to production MongoDB Atlas in the cloud, simply update the <code className="text-[#39FF88]">backend/.env</code> file:
          </p>
          <pre className="p-3 bg-[#08130E] border border-[#20392A] rounded text-[#39FF88] text-[11px] overflow-x-auto">
{`# In backend/.env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=ai_sentinel`}
          </pre>
          <p className="text-[11px] text-[#729B81]">
            FastAPI will automatically route all queries to the Atlas cluster upon restart.
          </p>
        </div>
      </Card>
    </div>
  );
};
