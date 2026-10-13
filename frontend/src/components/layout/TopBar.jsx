import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Bell,
  Plus,
  RefreshCw,
  Server,
  Database,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { useSystemStatus } from '../../context/SystemStatusContext';
import { Button } from '../common/Button';

export const TopBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { backendOnline, dbReady, dbLatency, dbError, isChecking, lastChecked, refreshStatus } =
    useSystemStatus();
  const [showNotifications, setShowNotifications] = useState(false);

  // Generate page title and breadcrumb
  const pathnames = location.pathname.split('/').filter((x) => x);
  const currentTitle =
    pathnames.length === 0
      ? 'Overview Dashboard'
      : pathnames[0] === 'scans' && pathnames[1] === 'new'
      ? 'New Security Scan'
      : pathnames[0].replace('-', ' ').toUpperCase();

  return (
    <header className="h-16 px-6 bg-[#0B1711]/90 backdrop-blur-md border-b border-[#20392A] flex items-center justify-between sticky top-0 z-20">
      {/* Title & Breadcrumb */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-xs font-mono text-[#729B81]">
          <Link to="/" className="hover:text-[#39FF88] transition-colors">
            AI SENTINEL
          </Link>
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            return (
              <React.Fragment key={routeTo}>
                <span>/</span>
                {isLast ? (
                  <span className="text-[#39FF88] font-semibold">{name.toUpperCase()}</span>
                ) : (
                  <Link to={routeTo} className="hover:text-[#39FF88] transition-colors">
                    {name.toUpperCase()}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </div>
        <h1 className="text-base font-bold text-[#E8F5EC] font-mono tracking-wide mt-0.5">
          {currentTitle}
        </h1>
      </div>

      {/* Center Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#729B81] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search models, scans, findings, NIST controls..."
            className="w-full bg-[#0E1D15] border border-[#20392A] rounded pl-9 pr-4 py-1.5 text-xs text-[#E8F5EC] placeholder-[#729B81] focus:outline-none focus:border-[#39FF88] font-mono transition-colors"
          />
        </div>
      </div>

      {/* Right Controls & Honest Status Indicators */}
      <div className="flex items-center gap-3">
        {/* Backend Status Badge */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0E1D15] border border-[#20392A] text-[11px] font-mono"
          title={`Backend status checked: ${lastChecked || 'Pending'}`}
        >
          <Server className="w-3.5 h-3.5 text-[#729B81]" />
          <span className="text-[#9CB4A3]">API:</span>
          {backendOnline === true ? (
            <span className="text-[#39FF88] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#39FF88] animate-pulse"></span>
              ONLINE
            </span>
          ) : backendOnline === false ? (
            <span className="text-[#FF4D5A] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D5A]"></span>
              OFFLINE
            </span>
          ) : (
            <span className="text-[#FFD166] flex items-center gap-1">
              <Clock className="w-3 h-3 animate-spin" /> CHECKING
            </span>
          )}
        </div>

        {/* MongoDB Status Badge */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0E1D15] border border-[#20392A] text-[11px] font-mono"
          title={
            dbReady === true
              ? `MongoDB 127.0.0.1:27017 Connected (${dbLatency}ms latency)`
              : `MongoDB Error: ${dbError || 'Not Connected'}`
          }
        >
          <Database className="w-3.5 h-3.5 text-[#729B81]" />
          <span className="text-[#9CB4A3]">DB:</span>
          {dbReady === true ? (
            <span className="text-[#39FF88] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#39FF88]"></span>
              READY
              {dbLatency && <span className="text-[10px] text-[#729B81]">({dbLatency}ms)</span>}
            </span>
          ) : dbReady === false ? (
            <span className="text-[#FF4D5A] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D5A]"></span>
              DOWN
            </span>
          ) : (
            <span className="text-[#FFD166] flex items-center gap-1">
              <Clock className="w-3 h-3 animate-spin" />
            </span>
          )}

          <button
            onClick={refreshStatus}
            disabled={isChecking}
            className="text-[#729B81] hover:text-[#39FF88] ml-1 p-0.5 rounded transition-colors"
            title="Refresh connectivity health"
          >
            <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* New Security Scan CTA */}
        <Button
          onClick={() => navigate('/scans/new')}
          icon={Plus}
          variant="primary"
          size="sm"
          className="font-mono shadow-neon-glow"
        >
          New Scan
        </Button>

        {/* Notifications Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded bg-[#0E1D15] border border-[#20392A] text-[#9CB4A3] hover:text-[#39FF88] hover:border-[#39FF88]/40 transition-colors"
            title="System alerts"
          >
            <Bell className="w-4 h-4" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0E1D15] border border-[#20392A] rounded-lg shadow-2xl p-4 z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-[#20392A]">
                <span className="text-xs font-mono font-semibold text-[#E8F5EC]">SYSTEM AUDIT LOGS</span>
                <span className="text-[10px] font-mono text-[#39FF88]">LIVE</span>
              </div>
              <div className="py-3 text-xs text-[#9CB4A3] space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#39FF88] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#E8F5EC]">System Initialized</p>
                    <p className="text-[10px] text-[#729B81]">MongoDB connection verified on port 27017</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile / Operator */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#20392A]">
          <div className="w-7 h-7 rounded bg-[#12271B] border border-[#39FF88]/40 flex items-center justify-center text-[#39FF88]">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden lg:flex flex-col">
            <span className="text-xs font-mono font-medium text-[#E8F5EC]">SecOps Admin</span>
            <span className="text-[10px] font-mono text-[#729B81]">Local Dev Profile</span>
          </div>
        </div>
      </div>
    </header>
  );
};
