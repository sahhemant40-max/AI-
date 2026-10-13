import React from 'react';

export const RiskScoreGauge = ({ score = 0, size = 120, strokeWidth = 10, label = 'RISK SCORE' }) => {
  const normalizedScore = Math.max(0, Math.min(100, Math.round(score || 0)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  let color = '#39FF88'; // Low
  let tier = 'LOW RISK';

  if (normalizedScore > 85) {
    color = '#FF4D5A';
    tier = 'CRITICAL';
  } else if (normalizedScore > 60) {
    color = '#FF9B50';
    tier = 'HIGH';
  } else if (normalizedScore > 30) {
    color = '#FFD166';
    tier = 'MEDIUM';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#12271B"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated score arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 1s ease-in-out, stroke 0.5s ease',
              filter: `drop-shadow(0 0 6px ${color}66)`,
            }}
          />
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold font-mono tracking-tighter" style={{ color }}>
            {normalizedScore}
          </span>
          <span className="text-[10px] uppercase font-mono text-[#729B81] tracking-wider -mt-0.5">
            / 100
          </span>
        </div>
      </div>

      <div className="mt-2 text-center">
        <span
          className="text-xs font-mono font-semibold px-2 py-0.5 rounded border"
          style={{
            color: color,
            borderColor: `${color}40`,
            backgroundColor: `${color}15`,
          }}
        >
          {tier}
        </span>
        {label && <p className="text-[11px] text-[#9CB4A3] mt-1 font-mono">{label}</p>}
      </div>
    </div>
  );
};
