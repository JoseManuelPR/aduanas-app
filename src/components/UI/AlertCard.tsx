import React from 'react';

type AlertVariant = 'vencido' | 'critico' | 'advertencia' | 'informativo' | 'exito';

interface AlertCardProps {
  variant: AlertVariant;
  title: string;
  description: string;
  expediente?: string;
  fechaVencimiento?: string;
  diasRestantes?: number;
  diasVencidos?: number;
  cantidad?: number;
  onAction?: () => void;
  actionLabel?: string;
  onDismiss?: () => void;
}

const variantConfig: Record<AlertVariant, {
  bgClass: string;
  borderClass: string;
  iconBgClass: string;
  textClass: string;
  icon: React.ReactNode;
}> = {
  vencido: {
    bgClass: 'bg-red-50',
    borderClass: 'border-red-200',
    iconBgClass: 'bg-red-100',
    textClass: 'text-red-800',
    icon: (
      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
      </svg>
    ),
  },
  critico: {
    bgClass: 'bg-orange-50',
    borderClass: 'border-orange-200',
    iconBgClass: 'bg-orange-100',
    textClass: 'text-orange-800',
    icon: (
      <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    ),
  },
  advertencia: {
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-200',
    iconBgClass: 'bg-amber-100',
    textClass: 'text-amber-800',
    icon: (
      <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5a.75.75 0 001.5 0V5zm-1.5 8.25a.75.75 0 011.5 0v.01a.75.75 0 01-1.5 0v-.01z" clipRule="evenodd" />
      </svg>
    ),
  },
  informativo: {
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-200',
    iconBgClass: 'bg-blue-100',
    textClass: 'text-blue-800',
    icon: (
      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
      </svg>
    ),
  },
  exito: {
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-200',
    iconBgClass: 'bg-emerald-100',
    textClass: 'text-emerald-800',
    icon: (
      <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
      </svg>
    ),
  },
};

export const AlertCard: React.FC<AlertCardProps> = ({
  variant,
  title,
  description,
  expediente,
  fechaVencimiento,
  diasRestantes,
  diasVencidos,
  cantidad,
  onAction,
  actionLabel = 'Ver detalle',
  onDismiss,
}) => {
  const config = variantConfig[variant];

  return (
    <div
      className={`
        ${config.bgClass} ${config.borderClass} border rounded-lg p-4
        animate-slide-up transition-all duration-200 hover:shadow-md
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`${config.iconBgClass} p-2 rounded-lg flex-shrink-0`}>
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`font-semibold ${config.textClass}`}>
              {title}
            </h4>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          <p className={`text-sm mt-1 ${config.textClass} opacity-80`}>
            {description}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
            {expediente && (
              <span className={`${config.textClass} opacity-70`}>
                <strong>Expediente:</strong> {expediente}
              </span>
            )}
            {fechaVencimiento && (
              <span className={`${config.textClass} opacity-70`}>
                <strong>Vencimiento:</strong> {fechaVencimiento}
              </span>
            )}
            {diasVencidos !== undefined && diasVencidos > 0 && (
              <span className="text-red-700 font-semibold">
                ⚠️ {diasVencidos} días vencido
              </span>
            )}
            {diasRestantes !== undefined && diasRestantes >= 0 && (
              <span className={diasRestantes <= 3 ? 'text-orange-700 font-semibold' : config.textClass}>
                🕐 {diasRestantes} días restantes
              </span>
            )}
            {cantidad !== undefined && (
              <span className={`${config.textClass} font-semibold`}>
                📋 {cantidad} elementos
              </span>
            )}
          </div>
          {onAction && (
            <button
              onClick={onAction}
              className={`
                mt-3 text-sm font-medium ${config.textClass} underline
                hover:no-underline transition-all
              `}
            >
              {actionLabel} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertCard;

