/**
 * GiroTimeline - Historial de eventos del giro
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import React from 'react';
import { Icon } from 'he-button-custom-library';
import { Badge } from '../../../components/UI';
import { type Giro, formatMonto } from '../../../data';

interface GiroTimelineProps {
  giro: Giro;
}

export const GiroTimeline: React.FC<GiroTimelineProps> = ({
  giro,
}) => {
  // Generar timeline con eventos del giro
  const eventos = [
    {
      id: 'create',
      title: 'Giro Emitido',
      date: giro.fechaEmision,
      status: 'completed' as const,
      description: `Giro ${giro.numeroGiro} emitido por ${formatMonto(giro.montoTotalNumero || 0)}`,
      icon: 'Receipt',
      color: 'emerald',
      user: giro.usuarioCreacion,
    },
    ...(giro.origenGiro !== 'MANUAL' && giro.numeroEntidadOrigen ? [{
      id: 'origen',
      title: `Vinculado a ${giro.origenGiro === 'CARGO' ? 'Cargo' : 'Denuncia'}`,
      date: giro.fechaEmision,
      status: 'completed' as const,
      description: `Origen: ${giro.numeroEntidadOrigen}`,
      icon: 'Link' as const,
      color: 'blue' as const,
    }] : []),
    ...(giro.pagos || []).map((pago, idx) => ({
      id: `pago-${pago.id}`,
      title: `Pago #${idx + 1} Registrado`,
      date: pago.fecha,
      status: 'completed' as const,
      description: `${formatMonto(pago.monto)} vía ${pago.formaPago}${pago.numeroComprobante ? ` (${pago.numeroComprobante})` : ''}`,
      icon: 'CreditCard' as const,
      color: 'emerald' as const,
      user: pago.usuarioRegistro,
    })),
    ...(giro.estado === 'Pagado' && giro.fechaPago ? [{
      id: 'pagado',
      title: 'Pago Completo',
      date: giro.fechaPago,
      status: 'completed' as const,
      description: `Giro pagado en su totalidad (${formatMonto(giro.montoTotalNumero || 0)})`,
      icon: 'CheckCircle' as const,
      color: 'emerald' as const,
    }] : []),
    ...(giro.estado === 'Vencido' ? [{
      id: 'vencido',
      title: 'Giro Vencido',
      date: giro.fechaVencimiento,
      status: 'completed' as const,
      description: `Saldo pendiente: ${formatMonto(giro.saldoPendiente || 0)}`,
      icon: 'AlertTriangle' as const,
      color: 'red' as const,
    }] : []),
    ...(giro.estado === 'Anulado' ? [{
      id: 'anulado',
      title: 'Giro Anulado',
      date: giro.fechaModificacion || '',
      status: 'completed' as const,
      description: giro.motivoAnulacion || 'Giro anulado',
      icon: 'XCircle' as const,
      color: 'red' as const,
      user: giro.usuarioModificacion,
    }] : []),
    ...(giro.estado !== 'Pagado' && giro.estado !== 'Anulado' ? [{
      id: 'pending-pago',
      title: 'Pendiente de Pago',
      date: '',
      status: 'pending' as const,
      description: `Saldo por pagar: ${formatMonto(giro.saldoPendiente || 0)}`,
      icon: 'Clock' as const,
      color: 'gray' as const,
    }] : []),
  ];
  
  // Colores por tipo
  const getColorClasses = (color: string, status: string) => {
    if (status === 'pending') {
      return {
        bg: 'bg-gray-100',
        border: 'border-gray-300',
        icon: 'text-gray-400',
        cardBg: 'bg-gray-50 border-gray-200',
        text: 'text-gray-600',
      };
    }
    switch (color) {
      case 'emerald':
        return {
          bg: 'bg-emerald-100',
          border: 'border-emerald-500',
          icon: 'text-emerald-600',
          cardBg: 'bg-emerald-50 border-emerald-200',
          text: 'text-emerald-800',
        };
      case 'red':
        return {
          bg: 'bg-red-100',
          border: 'border-red-500',
          icon: 'text-red-600',
          cardBg: 'bg-red-50 border-red-200',
          text: 'text-red-800',
        };
      case 'blue':
        return {
          bg: 'bg-blue-100',
          border: 'border-blue-500',
          icon: 'text-blue-600',
          cardBg: 'bg-blue-50 border-blue-200',
          text: 'text-blue-800',
        };
      default:
        return {
          bg: 'bg-gray-100',
          border: 'border-gray-500',
          icon: 'text-gray-600',
          cardBg: 'bg-gray-50 border-gray-200',
          text: 'text-gray-800',
        };
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Historial del Giro</h3>
          <p className="text-sm text-gray-500">
            Trazabilidad de eventos y pagos
          </p>
        </div>
        <Badge variant={
          giro.estado === 'Pagado' ? 'success' :
          giro.estado === 'Anulado' || giro.estado === 'Vencido' ? 'error' :
          giro.estado === 'Parcialmente Pagado' ? 'warning' :
          'proceso'
        }>
          {giro.estado}
        </Badge>
      </div>
      
      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        <div className="space-y-6">
          {eventos.map((evento, index) => {
            const colors = getColorClasses(evento.color, evento.status);
            return (
              <div key={evento.id} className="relative flex gap-4">
                {/* Indicador */}
                <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${colors.bg} ${colors.border}`}>
                  <Icon 
                    name={evento.icon as any} 
                    size={16} 
                    className={colors.icon}
                  />
                </div>
                
                {/* Contenido */}
                <div className={`flex-1 pb-6 ${index === eventos.length - 1 ? 'pb-0' : ''}`}>
                  <div className={`rounded-lg p-4 border ${colors.cardBg}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`font-semibold ${colors.text}`}>
                          {evento.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {evento.description}
                        </p>
                      </div>
                      {evento.date && (
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                          {evento.date}
                        </span>
                      )}
                    </div>
                    {evento.user && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                        <Icon name="User" size={12} />
                        <span>{evento.user}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Información de auditoría */}
      <div className="bg-gray-50 rounded-lg p-4 mt-6">
        <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
          <Icon name="Info" size={16} />
          Información de Auditoría
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Emitido por</p>
            <p className="font-medium">{giro.usuarioCreacion || giro.loginFuncionario || '-'}</p>
          </div>
          <div>
            <p className="text-gray-500">Fecha Creación</p>
            <p className="font-medium">{giro.fechaCreacion || giro.fechaEmision}</p>
          </div>
          <div>
            <p className="text-gray-500">Última Modificación</p>
            <p className="font-medium">{giro.fechaModificacion || '-'}</p>
          </div>
          <div>
            <p className="text-gray-500">Modificado por</p>
            <p className="font-medium">{giro.usuarioModificacion || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiroTimeline;

