import React from 'react';

export type BadgeVariant = 'default' | 'pendiente' | 'proceso' | 'resuelto' | 'rechazado' | 'vencido' | 'info' | 'success' | 'warning' | 'danger' | 'error';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  pulse?: boolean;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-800 border-gray-200',
  pendiente: 'bg-amber-100 text-amber-800 border-amber-200',
  proceso: 'bg-blue-100 text-blue-800 border-blue-200',
  resuelto: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  rechazado: 'bg-red-100 text-red-800 border-red-200',
  vencido: 'bg-red-500 text-white border-red-600',
  info: 'bg-aduana-azul-50 text-aduana-azul border-aduana-azul-200',
  success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  warning: 'bg-amber-100 text-amber-800 border-amber-200',
  danger: 'bg-aduana-rojo-50 text-aduana-rojo border-aduana-rojo-200',
  error: 'bg-red-100 text-red-800 border-red-200',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-gray-500',
  pendiente: 'bg-amber-500',
  proceso: 'bg-blue-500',
  resuelto: 'bg-emerald-500',
  rechazado: 'bg-red-500',
  vencido: 'bg-white',
  info: 'bg-aduana-azul',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-aduana-rojo',
  error: 'bg-red-500',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'info',
  size = 'sm',
  dot = false,
  pulse = false,
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full border
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${pulse && variant === 'vencido' ? 'animate-pulse-alert' : ''}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} ${
            pulse ? 'animate-pulse' : ''
          }`}
        />
      )}
      {children}
    </span>
  );
};

// Función helper para determinar el variant según el estado
export const getEstadoBadgeVariant = (estado: string): BadgeVariant => {
  const estadoLower = estado.toLowerCase();
  
  if (estadoLower.includes('vencid') || estadoLower.includes('error')) return 'vencido';
  if (estadoLower.includes('pendiente') || estadoLower.includes('ingresad')) return 'pendiente';
  if (estadoLower.includes('proceso') || estadoLower.includes('revisión') || estadoLower.includes('análisis')) return 'proceso';
  if (estadoLower.includes('resuel') || estadoLower.includes('aproba') || estadoLower.includes('pagad') || estadoLower.includes('leída') || estadoLower.includes('cerrad') || estadoLower.includes('enviada')) return 'resuelto';
  if (estadoLower.includes('rechazad') || estadoLower.includes('denegad')) return 'rechazado';
  
  return 'info';
};

// Función helper para determinar variant según días de vencimiento
export const getDiasVencimientoBadgeVariant = (dias: number): BadgeVariant => {
  if (dias < 0) return 'vencido';
  if (dias === 0) return 'danger';
  if (dias <= 3) return 'warning';
  if (dias <= 7) return 'proceso';
  return 'success';
};

export default Badge;

