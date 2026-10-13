import React from 'react';

export const SeverityBadge = ({ severity }) => {
  const sev = (severity || 'low').toLowerCase();

  const styles = {
    critical: 'bg-[#FF4D5A]/15 text-[#FF4D5A] border-[#FF4D5A]/30',
    high: 'bg-[#FF9B50]/15 text-[#FF9B50] border-[#FF9B50]/30',
    medium: 'bg-[#FFD166]/15 text-[#FFD166] border-[#FFD166]/30',
    low: 'bg-[#39FF88]/15 text-[#39FF88] border-[#39FF88]/30',
  };

  const currentStyle = styles[sev] || styles.low;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border uppercase tracking-wider ${currentStyle}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {severity}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const stat = (status || 'queued').toLowerCase();

  const styles = {
    queued: 'bg-zinc-800/60 text-zinc-300 border-zinc-700',
    running: 'bg-[#19C96B]/15 text-[#39FF88] border-[#39FF88]/40 animate-pulse',
    completed: 'bg-[#39FF88]/15 text-[#39FF88] border-[#39FF88]/30',
    failed: 'bg-[#FF4D5A]/15 text-[#FF4D5A] border-[#FF4D5A]/30',
    open: 'bg-[#FF9B50]/15 text-[#FF9B50] border-[#FF9B50]/30',
    in_progress: 'bg-[#FFD166]/15 text-[#FFD166] border-[#FFD166]/30',
    resolved: 'bg-[#39FF88]/15 text-[#39FF88] border-[#39FF88]/30',
    accepted: 'bg-zinc-700/30 text-zinc-400 border-zinc-700',
  };

  const currentStyle = styles[stat] || 'bg-zinc-800 text-zinc-300 border-zinc-700';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono font-medium border uppercase tracking-wider ${currentStyle}`}
    >
      {stat === 'running' && <span className="w-1.5 h-1.5 rounded-full bg-[#39FF88] animate-ping"></span>}
      {status ? status.replace('_', ' ') : 'UNKNOWN'}
    </span>
  );
};

export const TechBadge = ({ label, variant = 'default' }) => {
  const variants = {
    default: 'bg-[#0E1D15] text-[#9CB4A3] border-[#20392A]',
    neon: 'bg-[#39FF88]/10 text-[#39FF88] border-[#39FF88]/30',
    muted: 'bg-[#08130E] text-[#729B81] border-[#20392A]',
  };

  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono border ${variants[variant] || variants.default}`}>
      {label}
    </span>
  );
};
