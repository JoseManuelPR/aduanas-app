/**
 * GiroPagos - Historial de pagos del giro
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import React from 'react';
import { Icon } from 'he-button-custom-library';
import { CustomButton } from '../../../components/Button/Button';
import { Badge } from '../../../components/UI';
import { type GiroPago, formatMonto } from '../../../data';

interface GiroPagosProps {
  pagos: GiroPago[];
  montoTotal: number;
  saldoPendiente: number;
  puedeRegistrar: boolean;
  onRegistrarPago?: () => void;
}

export const GiroPagos: React.FC<GiroPagosProps> = ({
  pagos,
  montoTotal,
  saldoPendiente,
  puedeRegistrar,
  onRegistrarPago,
}) => {
  // Calcular total pagado
  const totalPagado = pagos.reduce((sum, p) => sum + p.monto, 0);
  
  // Obtener icono por forma de pago
  const getFormaPagoIcon = (forma: string) => {
    switch (forma) {
      case 'Transferencia': return 'ArrowRightLeft';
      case 'Depósito': return 'Building2';
      case 'Efectivo': return 'Banknote';
      case 'Cheque': return 'FileText';
      case 'Vale Vista': return 'Receipt';
      default: return 'CreditCard';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header con botón */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Historial de Pagos</h3>
          <p className="text-sm text-gray-500">
            {pagos.length} pago(s) registrado(s)
          </p>
        </div>
        {puedeRegistrar && saldoPendiente > 0 && (
          <CustomButton 
            variant="primary" 
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={onRegistrarPago}
          >
            <Icon name="CreditCard" size={16} />
            Registrar Pago
          </CustomButton>
        )}
      </div>
      
      {/* Resumen de pagos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">Monto Total</p>
          <p className="text-xl font-bold text-aduana-azul">{formatMonto(montoTotal)}</p>
        </div>
        <div className="bg-emerald-50 rounded-lg p-4 text-center border border-emerald-200">
          <p className="text-sm text-emerald-700 mb-1">Total Pagado</p>
          <p className="text-xl font-bold text-emerald-600">{formatMonto(totalPagado)}</p>
          <p className="text-xs text-emerald-600 mt-1">
            {montoTotal > 0 ? ((totalPagado / montoTotal) * 100).toFixed(1) : 0}% del total
          </p>
        </div>
        <div className={`rounded-lg p-4 text-center ${
          saldoPendiente > 0 
            ? 'bg-amber-50 border border-amber-200' 
            : 'bg-emerald-50 border border-emerald-200'
        }`}>
          <p className={`text-sm mb-1 ${saldoPendiente > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
            Saldo Pendiente
          </p>
          <p className={`text-xl font-bold ${saldoPendiente > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {formatMonto(saldoPendiente)}
          </p>
          {saldoPendiente === 0 && (
            <p className="text-xs text-emerald-600 flex items-center justify-center gap-1 mt-1">
              <Icon name="CheckCircle" size={12} />
              Pagado completo
            </p>
          )}
        </div>
      </div>
      
      {/* Lista de pagos */}
      {pagos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Icon name="CreditCard" size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 mb-4">No hay pagos registrados</p>
          {puedeRegistrar && saldoPendiente > 0 && (
            <CustomButton 
              variant="secondary" 
              onClick={onRegistrarPago}
            >
              <Icon name="Plus" size={16} />
              Registrar primer pago
            </CustomButton>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {pagos.map((pago, idx) => (
            <div 
              key={pago.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-100 rounded-full">
                  <Icon 
                    name={getFormaPagoIcon(pago.formaPago)} 
                    size={24} 
                    className="text-emerald-600" 
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-emerald-600">
                        {formatMonto(pago.monto)}
                      </span>
                      <Badge variant="success">Pago #{idx + 1}</Badge>
                    </div>
                    <span className="text-sm text-gray-500">{pago.fecha}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Forma de Pago</p>
                      <p className="font-medium">{pago.formaPago}</p>
                    </div>
                    {pago.numeroComprobante && (
                      <div>
                        <p className="text-gray-500">N° Comprobante</p>
                        <p className="font-medium font-mono">{pago.numeroComprobante}</p>
                      </div>
                    )}
                    {pago.banco && (
                      <div>
                        <p className="text-gray-500">Banco</p>
                        <p className="font-medium">{pago.banco}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-500">Registrado por</p>
                      <p className="font-medium">{pago.usuarioRegistro}</p>
                    </div>
                  </div>
                  
                  {pago.observaciones && (
                    <p className="text-sm text-gray-600 mt-2 italic">
                      "{pago.observaciones}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Timeline de pagos */}
      {pagos.length > 1 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Progreso de Pagos</p>
          <div className="space-y-2">
            {pagos.map((pago, idx) => {
              const acumulado = pagos.slice(0, idx + 1).reduce((sum, p) => sum + p.monto, 0);
              const porcentaje = (acumulado / montoTotal) * 100;
              return (
                <div key={pago.id} className="flex items-center gap-4">
                  <span className="text-xs text-gray-500 w-20">{pago.fecha}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-emerald-500 transition-all"
                      style={{ width: `${Math.min(porcentaje, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-700 w-16 text-right">
                    {porcentaje.toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default GiroPagos;

