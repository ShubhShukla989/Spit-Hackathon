import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
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
  const base = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 select-none transform hover:scale-105 shadow-md hover:shadow-lg';
  
  const variants = {
    primary: 'bg-[#1E293B] text-white border-2 border-[#D4A657] hover:bg-[#D4A657] hover:text-[#1E293B] disabled:bg-gray-300 disabled:border-gray-400',
    secondary: 'bg-white border-2 border-[#D4A657] text-[#1E293B] hover:bg-[#FAF9F7] disabled:bg-slate-100',
    success: 'bg-[#9CAFAA] text-white border-2 border-[#9CAFAA] hover:bg-[#8A9F9A] disabled:bg-gray-300',
    danger: 'bg-[#E74C3C] text-white border-2 border-[#E74C3C] hover:bg-[#C0392B] disabled:bg-gray-300',
    ghost: 'text-[#1E293B] hover:bg-[#FAF9F7] disabled:text-gray-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
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
