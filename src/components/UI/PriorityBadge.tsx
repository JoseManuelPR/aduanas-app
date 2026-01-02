import React from 'react';
import { Icon } from 'he-button-custom-library';

type Priority = 'critical' | 'high' | 'medium' | 'low' | 'info';

interface PriorityBadgeProps {
  priority: Priority;
  label?: string;
  showIcon?: boolean;
  pulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const priorityConfig: Record<Priority, {
  bg: string;
  text: string;
  border: string;
  icon: string;
  defaultLabel: string;
}> = {
  critical: {
    bg: 'bg-red-600',
    text: 'text-white',
    border: 'border-red-700',
    icon: 'AlertTriangle',
    defaultLabel: 'Crítico',
  },
  high: {
    bg: 'bg-orange-500',
    text: 'text-white',
    border: 'border-orange-600',
    icon: 'AlertCircle',
    defaultLabel: 'Alto',
  },
  medium: {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-300',
    icon: 'Clock',
    defaultLabel: 'Medio',
  },
  low: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
    icon: 'Info',
    defaultLabel: 'Bajo',
  },
  info: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-200',
    icon: 'Info',
    defaultLabel: 'Info',
  },
};

const sizeConfig = {
  sm: {
    text: 'text-xs',
    icon: 12,
    padding: 'px-2 py-0.5',
    gap: 'gap-1',
  },
  md: {
    text: 'text-sm',
    icon: 14,
    padding: 'px-2.5 py-1',
    gap: 'gap-1.5',
  },
  lg: {
    text: 'text-base',
    icon: 16,
    padding: 'px-3 py-1.5',
    gap: 'gap-2',
  },
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  label,
  showIcon = true,
  pulse = false,
  size = 'sm',
  className = '',
}) => {
  const pConfig = priorityConfig[priority];
  const sConfig = sizeConfig[size];

  return (
    <span 
      className={`
        inline-flex items-center font-semibold rounded-full border
        ${pConfig.bg} ${pConfig.text} ${pConfig.border}
        ${sConfig.text} ${sConfig.padding} ${sConfig.gap}
        ${pulse && priority === 'critical' ? 'animate-pulse-alert' : ''}
        ${className}
      `}
    >
      {showIcon && (
        <Icon name={pConfig.icon as any} size={sConfig.icon} />
      )}
      <span>{label || pConfig.defaultLabel}</span>
    </span>
  );
};

export default PriorityBadge;

