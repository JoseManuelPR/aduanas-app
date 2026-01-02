import React from 'react';
import { Icon } from 'he-button-custom-library';

type TrendDirection = 'up' | 'down' | 'neutral';
type TrendSentiment = 'positive' | 'negative' | 'neutral';

interface TrendIndicatorProps {
  value: number; // Percentage change
  direction?: TrendDirection;
  sentiment?: TrendSentiment; // Whether up is good or bad
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  period?: string;
  className?: string;
}

const sizeConfig = {
  sm: {
    text: 'text-xs',
    icon: 12,
    padding: 'px-1.5 py-0.5',
  },
  md: {
    text: 'text-sm',
    icon: 14,
    padding: 'px-2 py-1',
  },
  lg: {
    text: 'text-base',
    icon: 16,
    padding: 'px-2.5 py-1.5',
  },
};

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  value,
  direction,
  sentiment = 'positive', // Default: up is good
  showValue = true,
  size = 'sm',
  period,
  className = '',
}) => {
  // Determine direction from value if not provided
  const actualDirection: TrendDirection = direction ?? (value > 0 ? 'up' : value < 0 ? 'down' : 'neutral');
  
  // Determine color based on direction and sentiment
  const getColorClasses = (): string => {
    if (actualDirection === 'neutral') return 'text-gray-500 bg-gray-50';
    
    if (sentiment === 'positive') {
      return actualDirection === 'up' 
        ? 'text-emerald-700 bg-emerald-50' 
        : 'text-red-700 bg-red-50';
    } else {
      return actualDirection === 'up' 
        ? 'text-red-700 bg-red-50' 
        : 'text-emerald-700 bg-emerald-50';
    }
  };

  const getIcon = (): string => {
    if (actualDirection === 'up') return 'TrendingUp';
    if (actualDirection === 'down') return 'TrendingDown';
    return 'Minus';
  };

  const config = sizeConfig[size];

  return (
    <span 
      className={`
        inline-flex items-center gap-1 font-semibold rounded-full
        ${config.text} ${config.padding} ${getColorClasses()}
        ${className}
      `}
    >
      <Icon name={getIcon() as any} size={config.icon} />
      {showValue && (
        <span>
          {actualDirection === 'up' && '+'}
          {Math.abs(value)}%
        </span>
      )}
      {period && <span className="font-normal opacity-75">{period}</span>}
    </span>
  );
};

export default TrendIndicator;

