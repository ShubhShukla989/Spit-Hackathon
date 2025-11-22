import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  iconLeft,
  iconRight,
  children,
  className = '',
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-150 select-none';
  
  const variants = {
    primary: 'bg-[#0EA5A4] text-white hover:bg-[#0D938F] active:bg-[#0B7F7A] disabled:bg-gray-300 disabled:text-gray-500',
    secondary: 'border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:bg-slate-100',
    danger: 'bg-[#EF4444] text-white hover:bg-[#DC2626] disabled:bg-gray-300',
    ghost: 'text-slate-600 hover:bg-slate-100 disabled:text-gray-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {iconLeft && <span className="mr-2">{iconLeft}</span>}
      {children}
      {iconRight && <span className="ml-2">{iconRight}</span>}
    </button>
  );
};
