import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-lime-900 border border-lime-800 rounded-lg shadow-2xl p-6 sm:p-8 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;