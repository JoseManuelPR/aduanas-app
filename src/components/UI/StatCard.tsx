import React from 'react';
import { Icon } from 'he-button-custom-library';
import TrendIndicator from './TrendIndicator';

type CardAccent = 'blue' | 'red' | 'green' | 'amber' | 'gray';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  trend?: {
    value: number;
    sentiment?: 'positive' | 'negative' | 'neutral';
    period?: string;
  };
  icon?: string;
  accent?: CardAccent;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const accentConfig: Record<CardAccent, {
  iconBg: string;
  iconText: string;
  accentBorder: string;
}> = {
  blue: {
    iconBg: 'bg-aduana-azul-50',
    iconText: 'text-aduana-azul',
    accentBorder: 'border-l-aduana-azul',
  },
  red: {
    iconBg: 'bg-red-50',
    iconText: 'text-red-600',
    accentBorder: 'border-l-red-500',
  },
  green: {
    iconBg: 'bg-emerald-50',
    iconText: 'text-emerald-600',
    accentBorder: 'border-l-emerald-500',
  },
  amber: {
    iconBg: 'bg-amber-50',
    iconText: 'text-amber-600',
    accentBorder: 'border-l-amber-500',
  },
  gray: {
    iconBg: 'bg-gray-100',
    iconText: 'text-gray-600',
    accentBorder: 'border-l-gray-400',
  },
};

const sizeConfig = {
  sm: {
    padding: 'p-4',
    titleSize: 'text-xs',
    valueSize: 'text-2xl',
    iconSize: 20,
    iconPadding: 'p-2',
  },
  md: {
    padding: 'p-5',
    titleSize: 'text-sm',
    valueSize: 'text-3xl',
    iconSize: 24,
    iconPadding: 'p-2.5',
  },
  lg: {
    padding: 'p-6',
    titleSize: 'text-base',
    valueSize: 'text-4xl',
    iconSize: 28,
    iconPadding: 'p-3',
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  accent = 'blue',
  onClick,
  className = '',
  size = 'md',
  loading = false,
}) => {
  const aConfig = accentConfig[accent];
  const sConfig = sizeConfig[size];

  return (
    <div 
      className={`
        bg-white rounded-xl shadow-sm border border-gray-100
        border-l-4 ${aConfig.accentBorder}
        transition-all duration-200
        ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''}
        ${sConfig.padding}
        ${className}
      `}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className={`${sConfig.titleSize} font-medium text-gray-500 uppercase tracking-wide`}>
            {title}
          </p>
          
          {loading ? (
            <div className="mt-2 h-9 w-20 bg-gray-200 rounded animate-pulse" />
          ) : (
            <p className={`${sConfig.valueSize} font-bold text-gray-900 mt-1 tabular-nums`}>
              {typeof value === 'number' ? value.toLocaleString('es-CL') : value}
            </p>
          )}
          
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          
          {trend && !loading && (
            <div className="mt-2">
              <TrendIndicator 
                value={trend.value} 
                sentiment={trend.sentiment}
                period={trend.period}
              />
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`${sConfig.iconPadding} ${aConfig.iconBg} rounded-xl flex-shrink-0`}>
            <Icon name={icon as any} size={sConfig.iconSize} className={aConfig.iconText} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
