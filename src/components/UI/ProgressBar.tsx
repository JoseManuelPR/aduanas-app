import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  colorScheme?: 'azul' | 'rojo' | 'verde' | 'amarillo' | 'auto';
  className?: string;
}

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

const colorClasses = {
  azul: 'bg-aduana-azul',
  rojo: 'bg-aduana-rojo',
  verde: 'bg-emerald-500',
  amarillo: 'bg-amber-500',
};

const getAutoColor = (percentage: number): string => {
  if (percentage >= 80) return colorClasses.verde;
  if (percentage >= 50) return colorClasses.azul;
  if (percentage >= 25) return colorClasses.amarillo;
  return colorClasses.rojo;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  size = 'md',
  colorScheme = 'azul',
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const fillColor = colorScheme === 'auto' ? getAutoColor(percentage) : colorClasses[colorScheme];

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span className="text-sm font-medium text-gray-700">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-semibold text-gray-600">
              {percentage.toFixed(1)}%
            </span>
          )}
        </div>
      )}
      <div className={`progress-bar ${sizeClasses[size]} bg-gray-200 rounded-full overflow-hidden`}>
        <div
          className={`progress-fill ${fillColor} ${sizeClasses[size]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

