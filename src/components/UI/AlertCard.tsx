import React from 'react';
import { Icon } from 'he-button-custom-library';

type AlertSeverity = 'critical' | 'warning' | 'info' | 'success';

interface AlertCardProps {
  severity: AlertSeverity;
  title: string;
  description?: string;
  reference?: string;
  timeInfo?: string;
  onAction?: () => void;
  actionLabel?: string;
  compact?: boolean;
  className?: string;
}

const severityConfig: Record<AlertSeverity, {
  bg: string;
  border: string;
  iconBg: string;
  iconColor: string;
  textColor: string;
  titleColor: string;
  icon: string;
  actionBg: string;
  actionText: string;
}> = {
  critical: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    iconBg: 'bg-red-600',
    iconColor: 'text-white',
    textColor: 'text-red-700',
    titleColor: 'text-red-900',
    icon: 'AlertTriangle',
    actionBg: 'bg-red-600 hover:bg-red-700',
    actionText: 'text-white',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    iconBg: 'bg-amber-500',
    iconColor: 'text-white',
    textColor: 'text-amber-700',
    titleColor: 'text-amber-900',
    icon: 'Clock',
    actionBg: 'bg-amber-500 hover:bg-amber-600',
    actionText: 'text-white',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    iconBg: 'bg-blue-500',
    iconColor: 'text-white',
    textColor: 'text-blue-700',
    titleColor: 'text-blue-900',
    icon: 'Info',
    actionBg: 'bg-blue-500 hover:bg-blue-600',
    actionText: 'text-white',
  },
  success: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    iconBg: 'bg-emerald-500',
    iconColor: 'text-white',
    textColor: 'text-emerald-700',
    titleColor: 'text-emerald-900',
    icon: 'CheckCircle',
    actionBg: 'bg-emerald-500 hover:bg-emerald-600',
    actionText: 'text-white',
  },
};

export const AlertCard: React.FC<AlertCardProps> = ({
  severity,
  title,
  description,
  reference,
  timeInfo,
  onAction,
  actionLabel = 'Gestionar',
  compact = false,
  className = '',
}) => {
  const config = severityConfig[severity];

  if (compact) {
    return (
      <div 
        className={`
          flex items-center gap-3 p-3 rounded-lg border
          ${config.bg} ${config.border}
          ${className}
        `}
      >
        <div className={`p-1.5 rounded-lg ${config.iconBg}`}>
          <Icon name={config.icon as any} size={14} className={config.iconColor} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`font-semibold text-sm ${config.titleColor} truncate`}>
              {title}
            </span>
            {reference && (
              <span className={`text-xs ${config.textColor} font-mono`}>
                {reference}
              </span>
            )}
          </div>
        </div>
        
        {timeInfo && (
          <span className={`text-xs font-bold ${config.textColor} whitespace-nowrap`}>
            {timeInfo}
          </span>
        )}
        
        {onAction && (
          <button
            onClick={onAction}
            className={`
              px-3 py-1 text-xs font-semibold rounded-md
              ${config.actionBg} ${config.actionText}
              transition-colors
            `}
          >
            {actionLabel}
          </button>
        )}
      </div>
    );
  }

  return (
    <div 
      className={`
        p-4 rounded-xl border-2 
        ${config.bg} ${config.border}
        ${severity === 'critical' ? 'animate-pulse-alert' : ''}
        ${className}
      `}
    >
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-xl ${config.iconBg} flex-shrink-0`}>
          <Icon name={config.icon as any} size={20} className={config.iconColor} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className={`font-bold ${config.titleColor}`}>
                {title}
              </h4>
              {description && (
                <p className={`text-sm mt-1 ${config.textColor}`}>
                  {description}
                </p>
              )}
              {reference && (
                <p className={`text-xs mt-2 font-mono ${config.textColor} opacity-75`}>
                  Ref: {reference}
                </p>
              )}
            </div>
            
            {timeInfo && (
              <span className={`
                px-2 py-1 rounded-md text-sm font-bold whitespace-nowrap
                ${severity === 'critical' ? 'bg-red-600 text-white' : `${config.textColor} bg-white/50`}
              `}>
                {timeInfo}
              </span>
            )}
          </div>
          
          {onAction && (
            <div className="mt-3">
              <button
                onClick={onAction}
                className={`
                  px-4 py-2 text-sm font-semibold rounded-lg
                  ${config.actionBg} ${config.actionText}
                  transition-all hover:shadow-md
                  flex items-center gap-2
                `}
              >
                {actionLabel}
                <Icon name="ArrowRight" size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertCard;
