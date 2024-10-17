import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  className: string;
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, className }) => {
  return (
    <button onClick={onClick} className={`px-2 py-1 rounded text-white ${className}`}>
      {label}
    </button>
  );
};
