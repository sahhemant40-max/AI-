import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Cpu,
  ScanLine,
  History,
  AlertTriangle,
  Scale,
  EyeOff,
  Bot,
  CheckSquare,
  FileText,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  Terminal,
} from 'lucide-react';

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { to: '/', label: 'Overview', icon: LayoutDashboard },
    { to: '/models', label: 'Model Inventory', icon: Cpu },
    { to: '/scans/new', label: 'New Security Scan', icon: ScanLine, highlight: true },
    { to: '/scans', label: 'Scan History', icon: History },
    { to: '/findings', label: 'Risk Findings', icon: AlertTriangle },
    { to: '/fairness', label: 'Fairness & Bias', icon: Scale },
    { to: '/privacy', label: 'Privacy Analysis', icon: EyeOff },
    { to: '/llm-security', label: 'LLM Security', icon: Bot },
    { to: '/compliance', label: 'Compliance Center', icon: CheckSquare },
    { to: '/reports', label: 'Reports', icon: FileText },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`h-screen sticky top-0 bg-[#08130E] border-r border-[#20392A] flex flex-col justify-between transition-all duration-300 z-30 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Platform Branding */}
      <div>
        <div className="h-16 px-4 border-b border-[#20392A] flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded bg-[#12271B] border border-[#39FF88]/40 flex items-center justify-center shrink-0 shadow-neon-glow">
              <Shield className="w-5 h-5 text-[#39FF88]" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-mono font-bold text-sm tracking-wider text-[#E8F5EC] flex items-center gap-1.5">
                  AI SENTINEL
                  <span className="w-1.5 h-1.5 rounded-full bg-[#39FF88] animate-pulse"></span>
                </span>
                <span className="text-[10px] text-[#729B81] font-mono tracking-tight uppercase">
                  AI Risk & Governance
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-[#9CB4A3] hover:text-[#39FF88] p-1.5 rounded hover:bg-[#12271B] transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded text-xs font-mono font-medium transition-all group ${
                    isActive
                      ? 'bg-[#12271B] text-[#39FF88] border border-[#39FF88]/40 shadow-neon-glow'
                      : item.highlight
                      ? 'text-[#39FF88] hover:bg-[#12271B]/50 hover:text-[#39FF88]'
                      : 'text-[#9CB4A3] hover:text-[#E8F5EC] hover:bg-[#0E1D15]'
                  }`
                }
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${item.highlight ? 'text-[#39FF88]' : ''}`} />
                {!collapsed && (
                  <span className="truncate tracking-wide flex-1 flex items-center justify-between">
                    {item.label}
                    {item.highlight && (
                      <span className="text-[9px] bg-[#39FF88]/20 text-[#39FF88] px-1.5 py-0.2 rounded border border-[#39FF88]/40 uppercase font-mono">
                        SCAN
                      </span>
                    )}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Terminal Footer Status */}
      <div className="p-3 border-t border-[#20392A] bg-[#07110D]/80">
        {!collapsed ? (
          <div className="flex items-center justify-between text-[11px] font-mono text-[#729B81]">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#39FF88]" />
              OPERATIONS
            </span>
            <span className="px-1.5 py-0.5 rounded bg-[#12271B] border border-[#20392A] text-[10px] text-[#39FF88]">
              v1.0.0
            </span>
          </div>
        ) : (
          <div className="flex justify-center text-[#39FF88]">
            <Terminal className="w-4 h-4" />
          </div>
        )}
      </div>
    </aside>
  );
};
