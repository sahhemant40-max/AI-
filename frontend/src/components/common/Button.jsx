import React from 'react';

export const Button = ({
  children,
  onClick,
  variant = 'primary', // primary, secondary, outline, danger, ghost
  size = 'md',        // sm, md, lg
  disabled = false,
  loading = false,
  icon: Icon,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#39FF88] disabled:opacity-50 disabled:cursor-not-allowed select-none rounded';

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5 font-semibold',
  };

  const variants = {
    primary: 'bg-[#39FF88] text-[#07110D] hover:bg-[#19C96B] font-semibold hover:shadow-neon-glow active:scale-[0.99]',
    secondary: 'bg-[#12271B] text-[#E8F5EC] border border-[#20392A] hover:border-[#39FF88]/50 hover:bg-[#163323]',
    outline: 'border border-[#20392A] text-[#9CB4A3] hover:text-[#39FF88] hover:border-[#39FF88] bg-transparent',
    danger: 'bg-[#FF4D5A]/15 text-[#FF4D5A] border border-[#FF4D5A]/30 hover:bg-[#FF4D5A]/25 hover:border-[#FF4D5A]',
    ghost: 'text-[#9CB4A3] hover:text-[#E8F5EC] hover:bg-[#0E1D15]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
};
