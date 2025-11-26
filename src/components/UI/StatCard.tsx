import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  colorScheme?: 'azul' | 'rojo' | 'verde' | 'amarillo' | 'gray';
  onClick?: () => void;
}

const colorClasses = {
  azul: 'bg-aduana-azul-50 text-aduana-azul',
  rojo: 'bg-aduana-rojo-50 text-aduana-rojo',
  verde: 'bg-emerald-50 text-emerald-600',
  amarillo: 'bg-amber-50 text-amber-600',
  gray: 'bg-gray-100 text-gray-600',
};

const borderColors = {
  azul: 'border-l-aduana-azul',
  rojo: 'border-l-aduana-rojo',
  verde: 'border-l-emerald-500',
  amarillo: 'border-l-amber-500',
  gray: 'border-l-gray-400',
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  colorScheme = 'azul',
  onClick,
}) => {
  return (
    <div
      className={`
        card p-5 border-l-4 ${borderColors[colorScheme]}
        ${onClick ? 'cursor-pointer card-hover' : ''}
        animate-fade-in
      `}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
          )}
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-gray-500">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={`stat-icon ${colorClasses[colorScheme]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;

