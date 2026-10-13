import React from 'react';

export const Card = ({
  title,
  subtitle,
  badge,
  action,
  children,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  glow = false,
}) => {
  return (
    <div
      className={`bg-[#0E1D15] border border-[#20392A] rounded-lg transition-all duration-200 ${
        glow ? 'border-[#39FF88]/40 shadow-neon-glow' : 'hover:border-[#20392A]/80'
      } ${className}`}
    >
      {(title || subtitle || action || badge) && (
        <div
          className={`px-5 py-4 border-b border-[#20392A]/70 flex flex-wrap items-center justify-between gap-3 ${headerClassName}`}
        >
          <div>
            <div className="flex items-center gap-2.5">
              {title && (
                <h3 className="text-sm font-semibold text-[#E8F5EC] tracking-wide uppercase font-mono flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#39FF88] rounded-full inline-block"></span>
                  {title}
                </h3>
              )}
              {badge && <div>{badge}</div>}
            </div>
            {subtitle && <p className="text-xs text-[#9CB4A3] mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className={`p-5 ${bodyClassName}`}>{children}</div>
    </div>
  );
};
