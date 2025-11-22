import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const clickableClass = onClick ? 'cursor-pointer hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300' : '';
  
  return (
    <div
      className={`bg-white border-[1.5px] border-[#D4A657] rounded-xl p-5 shadow-card ${clickableClass} ${className}`}
      style={{ backgroundColor: '#FFFEFB' }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {children}
    </div>
  );
};
