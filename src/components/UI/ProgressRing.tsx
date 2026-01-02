import React from 'react';

interface ProgressRingProps {
  value: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'red' | 'amber' | 'gray';
  showValue?: boolean;
  label?: string;
  thickness?: number;
  className?: string;
}

const sizeConfig = {
  sm: { diameter: 48, textSize: 'text-xs' },
  md: { diameter: 64, textSize: 'text-sm' },
  lg: { diameter: 80, textSize: 'text-base' },
};

const colorConfig = {
  blue: { stroke: '#013171', track: '#e6edf5' },
  green: { stroke: '#10B981', track: '#D1FAE5' },
  red: { stroke: '#DC2626', track: '#FEE2E2' },
  amber: { stroke: '#F59E0B', track: '#FEF3C7' },
  gray: { stroke: '#6B7280', track: '#F3F4F6' },
};

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  size = 'md',
  color = 'blue',
  showValue = true,
  label,
  thickness = 4,
  className = '',
}) => {
  const config = sizeConfig[size];
  const colors = colorConfig[color];
  const radius = (config.diameter - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      <svg
        width={config.diameter}
        height={config.diameter}
        className="transform -rotate-90"
      >
        {/* Track */}
        <circle
          cx={config.diameter / 2}
          cy={config.diameter / 2}
          r={radius}
          fill="none"
          stroke={colors.track}
          strokeWidth={thickness}
        />
        {/* Progress */}
        <circle
          cx={config.diameter / 2}
          cy={config.diameter / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${config.textSize}`} style={{ color: colors.stroke }}>
            {Math.round(value)}%
          </span>
        </div>
      )}
      
      {label && (
        <span className="mt-1 text-xs text-gray-500 text-center">{label}</span>
      )}
    </div>
  );
};

export default ProgressRing;

