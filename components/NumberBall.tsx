import React from 'react';

interface NumberBallProps {
  number: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'gold' | 'red' | 'green';
  className?: string;
}

const NumberBall: React.FC<NumberBallProps> = ({ number, size = 'md', color = 'gold', className = '' }) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-lg font-bold',
    md: 'w-16 h-16 text-2xl font-bold',
    lg: 'w-24 h-24 text-4xl font-extrabold',
  };

  const colorClasses = {
    gold: 'bg-gradient-to-br from-amber-300 to-amber-500 text-white border-amber-200',
    red: 'bg-gradient-to-br from-red-400 to-red-600 text-white border-red-300',
    green: 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white border-emerald-300',
  };

  return (
    <div className={`lottery-ball rounded-full flex items-center justify-center border-2 shadow-lg transform transition-transform hover:scale-105 ${sizeClasses[size]} ${colorClasses[color]} ${className}`}>
      {number}
    </div>
  );
};

export default NumberBall;