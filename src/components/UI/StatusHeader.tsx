import React from 'react';
import { Icon } from "he-button-custom-library";

interface StatusAlert {
  tipo: 'error' | 'warning' | 'info' | 'success';
  mensaje: string;
  accion?: string;
  onAccion?: () => void;
}

interface QuickAction {
  label: string;
  icon: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  disabled?: boolean;
}

interface StatusHeaderProps {
  // Información principal
  titulo: string;
  subtitulo?: string;
  numero: string;
  estado: string;
  estadoVariant?: 'success' | 'warning' | 'error' | 'info';
  tipo?: string;
  tipoVariant?: 'error' | 'info';
  
  // Métricas críticas (mostradas prominentemente)
  metricasCriticas?: {
    label: string;
    value: string | number;
    variant?: 'critical' | 'warning' | 'success' | 'neutral';
    icon?: string;
    description?: string;
  }[];
  
  // Alertas activas (vencimientos, reclamos, etc.)
  alertas?: StatusAlert[];
  
  // Acciones principales
  acciones?: QuickAction[];
  accionesSecundarias?: QuickAction[];
  
  // Navegación
  onBack?: () => void;
  breadcrumbs?: { label: string; onClick?: () => void }[];
  
  // Indicadores adicionales
  badges?: React.ReactNode[];
  
  className?: string;
}

/**
 * StatusHeader - Cabecera de estado para páginas de detalle
 * Diseño sobrio y profesional con acentos de color para indicar estado
 */
export const StatusHeader: React.FC<StatusHeaderProps> = ({
  titulo,
  subtitulo,
  numero,
  estado,
  estadoVariant = 'info',
  tipo,
  tipoVariant = 'info',
  metricasCriticas = [],
  alertas = [],
  acciones = [],
  accionesSecundarias = [],
  onBack,
  breadcrumbs = [],
  badges = [],
  className = '',
}) => {
  const getEstadoStyles = () => {
    switch (estadoVariant) {
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'warning':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'error':
        return 'bg-red-50 text-red-700 border border-red-200';
      default:
        return 'bg-blue-50 text-blue-700 border border-blue-200';
    }
  };

  const getMetricaStyles = (variant?: string) => {
    switch (variant) {
      case 'critical':
        return {
          bg: 'bg-red-50 border border-red-200',
          text: 'text-red-700',
          label: 'text-red-600',
          icon: 'text-red-500',
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 border border-amber-200',
          text: 'text-amber-700',
          label: 'text-amber-600',
          icon: 'text-amber-500',
        };
      case 'success':
        return {
          bg: 'bg-emerald-50 border border-emerald-200',
          text: 'text-emerald-700',
          label: 'text-emerald-600',
          icon: 'text-emerald-500',
        };
      default:
        return {
          bg: 'bg-gray-50 border border-gray-200',
          text: 'text-gray-900',
          label: 'text-gray-500',
          icon: 'text-gray-400',
        };
    }
  };

  const getAccionStyles = (variant?: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-aduana-azul text-white hover:bg-aduana-azul-600 shadow-sm';
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700 shadow-sm';
      case 'success':
        return 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm';
      default:
        return 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300';
    }
  };

  const hasCriticalAlert = alertas.some(a => a.tipo === 'error');
  const hasWarningAlert = alertas.some(a => a.tipo === 'warning');

  // Determinar el color del borde izquierdo según criticidad
  const getBorderAccent = () => {
    if (hasCriticalAlert) return 'border-l-red-500';
    if (hasWarningAlert) return 'border-l-amber-500';
    return 'border-l-aduana-azul';
  };

  return (
    <div className={`${className}`}>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <Icon name="ChevronRight" size={14} />}
              {crumb.onClick ? (
                <button onClick={crumb.onClick} className="hover:text-aduana-azul transition-colors">
                  {crumb.label}
                </button>
              ) : (
                <span className="text-gray-900 font-medium">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Main Header Card - Diseño sobrio */}
      <div className={`
        bg-white rounded-xl shadow-sm border border-gray-200
        border-l-4 ${getBorderAccent()}
        overflow-hidden
      `}>
        {/* Alert Banner - Solo si hay alertas */}
        {alertas.length > 0 && (
          <div className={`
            px-6 py-2.5 border-b flex items-center gap-3 flex-wrap
            ${hasCriticalAlert 
              ? 'bg-red-50 border-red-100' 
              : hasWarningAlert 
                ? 'bg-amber-50 border-amber-100'
                : 'bg-blue-50 border-blue-100'
            }
          `}>
            {alertas.map((alerta, index) => (
              <div 
                key={index}
                className={`
                  flex items-center gap-2 text-sm font-medium
                  ${alerta.tipo === 'error' 
                    ? 'text-red-700' 
                    : alerta.tipo === 'warning'
                      ? 'text-amber-700'
                      : 'text-blue-700'
                  }
                `}
              >
                <Icon 
                  name={alerta.tipo === 'error' ? 'AlertCircle' : alerta.tipo === 'warning' ? 'AlertTriangle' : 'Info'} 
                  size={16} 
                />
                <span>{alerta.mensaje}</span>
                {alerta.accion && alerta.onAccion && (
                  <button 
                    onClick={alerta.onAccion}
                    className="ml-1 underline hover:no-underline"
                  >
                    {alerta.accion}
                  </button>
                )}
                {index < alertas.length - 1 && (
                  <span className="text-gray-300 mx-2">•</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Main Content */}
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            {/* Left: Title and info */}
            <div className="flex-1">
              <div className="flex items-start gap-4">
                {onBack && (
                  <button
                    onClick={onBack}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 mt-0.5"
                  >
                    <Icon name="ArrowLeft" size={20} />
                  </button>
                )}
                
                <div>
                  {/* Main title */}
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3 flex-wrap">
                    {titulo} <span className="text-gray-500 font-normal">N° {numero}</span>
                  </h1>
                  
                  {/* Badges row */}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {/* Estado badge */}
                    <span className={`
                      inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-medium
                      ${getEstadoStyles()}
                    `}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        estadoVariant === 'success' ? 'bg-emerald-500' :
                        estadoVariant === 'warning' ? 'bg-amber-500' :
                        estadoVariant === 'error' ? 'bg-red-500' :
                        'bg-blue-500'
                      }`} />
                      {estado}
                    </span>
                    
                    {/* Tipo badge */}
                    {tipo && (
                      <span className={`
                        inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium border
                        ${tipoVariant === 'error' 
                          ? 'bg-red-50 text-red-700 border-red-200' 
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                        }
                      `}>
                        {tipo}
                      </span>
                    )}
                    
                    {/* Custom badges */}
                    {badges}
                  </div>
                  
                  {/* Subtitulo */}
                  {subtitulo && (
                    <p className="text-gray-500 mt-2 text-sm">{subtitulo}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Critical Metrics */}
            {metricasCriticas.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {metricasCriticas.map((metrica, index) => {
                  const styles = getMetricaStyles(metrica.variant);
                  return (
                    <div 
                      key={index}
                      className={`
                        ${styles.bg} rounded-lg px-4 py-3 min-w-[110px]
                      `}
                    >
                      <div className="flex items-center gap-1.5">
                        {metrica.icon && (
                          <Icon name={metrica.icon as any} size={14} className={styles.icon} />
                        )}
                        <p className={`text-xs uppercase tracking-wide font-medium ${styles.label}`}>
                          {metrica.label}
                        </p>
                      </div>
                      <p className={`text-xl font-bold ${styles.text}`}>
                        {metrica.value}
                      </p>
                      {metrica.description && (
                        <p className={`text-xs ${styles.label}`}>
                          {metrica.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Actions Row */}
          {(acciones.length > 0 || accionesSecundarias.length > 0) && (
            <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-gray-100">
              {/* Primary actions */}
              {acciones.map((accion, index) => (
                <button
                  key={index}
                  onClick={accion.onClick}
                  disabled={accion.disabled}
                  className={`
                    inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
                    transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                    ${getAccionStyles(accion.variant)}
                  `}
                >
                  <Icon name={accion.icon as any} size={16} />
                  {accion.label}
                </button>
              ))}
              
              {/* Secondary actions */}
              {accionesSecundarias.map((accion, index) => (
                <button
                  key={index}
                  onClick={accion.onClick}
                  disabled={accion.disabled}
                  className={`
                    inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
                    transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                    ${getAccionStyles(accion.variant || 'secondary')}
                  `}
                >
                  <Icon name={accion.icon as any} size={16} />
                  {accion.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusHeader;
