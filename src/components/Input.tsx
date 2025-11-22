import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold mb-2"
          style={{ color: '#1E293B' }}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-4 py-2.5 rounded-lg border-2 transition-all duration-300 ${className}`}
        style={{
          borderColor: error ? '#E74C3C' : '#D4A657',
          backgroundColor: '#FFFFFF',
          color: '#1E293B',
        }}
        onFocus={(e) => {
          if (!error) {
            e.target.style.borderColor = '#D4A657';
            e.target.style.boxShadow = '0 0 0 3px rgba(212,166,87,0.1)';
          }
        }}
        onBlur={(e) => {
          e.target.style.boxShadow = 'none';
        }}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm" style={{ color: '#E74C3C' }} role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
