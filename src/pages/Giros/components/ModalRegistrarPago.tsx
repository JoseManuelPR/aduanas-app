/**
 * ModalRegistrarPago - Modal para registrar pago de giro
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import React, { useState } from 'react';
import { Icon } from 'he-button-custom-library';
import { CustomButton } from '../../../components/Button/Button';
import { 
  type Giro, 
  type FormaPago,
  formatMonto, 
  registrarPagoGiro,
  usuarioActual,
} from '../../../data';

interface ModalRegistrarPagoProps {
  isOpen: boolean;
  onClose: () => void;
  giro: Giro;
  saldoPendiente: number;
  onPagoRegistrado: () => void;
}

const formasPago: FormaPago[] = ['Transferencia', 'Depósito', 'Efectivo', 'Cheque', 'Vale Vista', 'Otro'];

export const ModalRegistrarPago: React.FC<ModalRegistrarPagoProps> = ({
  isOpen,
  onClose,
  giro,
  saldoPendiente,
  onPagoRegistrado,
}) => {
  const [formData, setFormData] = useState({
    monto: '',
    fecha: new Date().toISOString().split('T')[0],
    formaPago: 'Transferencia' as FormaPago,
    numeroComprobante: '',
    banco: '',
    observaciones: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.monto) {
      newErrors.monto = 'Ingrese el monto del pago';
    } else if (isNaN(Number(formData.monto)) || Number(formData.monto) <= 0) {
      newErrors.monto = 'El monto debe ser mayor a 0';
    } else if (Number(formData.monto) > saldoPendiente) {
      newErrors.monto = `El monto no puede exceder el saldo pendiente (${formatMonto(saldoPendiente)})`;
    }
    
    if (!formData.fecha) {
      newErrors.fecha = 'Seleccione la fecha de pago';
    } else {
      const fechaPago = new Date(formData.fecha);
      const hoy = new Date();
      hoy.setHours(23, 59, 59, 999);
      if (fechaPago > hoy) {
        newErrors.fecha = 'La fecha de pago no puede ser futura';
      }
    }
    
    if (!formData.formaPago) {
      newErrors.formaPago = 'Seleccione la forma de pago';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      const resultado = registrarPagoGiro(giro.id, {
        fecha: formData.fecha,
        monto: Number(formData.monto),
        formaPago: formData.formaPago,
        numeroComprobante: formData.numeroComprobante || undefined,
        banco: formData.banco || undefined,
        observaciones: formData.observaciones || undefined,
        usuarioRegistro: usuarioActual.login,
        fechaRegistro: new Date().toISOString(),
      });
      
      if (resultado.exito) {
        onPagoRegistrado();
      } else {
        setErrors({ submit: resultado.error || 'Error al registrar el pago' });
      }
    } catch {
      setErrors({ submit: 'Error al procesar el pago' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleClose = () => {
    setFormData({
      monto: '',
      fecha: new Date().toISOString().split('T')[0],
      formaPago: 'Transferencia',
      numeroComprobante: '',
      banco: '',
      observaciones: '',
    });
    setErrors({});
    onClose();
  };
  
  // Botón de pago total
  const handlePagoTotal = () => {
    setFormData(prev => ({ ...prev, monto: saldoPendiente.toString() }));
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full transform transition-all animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-emerald-50 rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Icon name="CreditCard" size={24} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Registrar Pago
                </h3>
                <p className="text-sm text-gray-500">
                  Giro {giro.numeroGiro}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
          
          {/* Info del giro */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Total Giro</p>
                <p className="font-semibold text-aduana-azul">{giro.montoTotal}</p>
              </div>
              <div>
                <p className="text-gray-500">Ya Pagado</p>
                <p className="font-semibold text-emerald-600">{formatMonto(giro.montoPagado || 0)}</p>
              </div>
              <div>
                <p className="text-gray-500">Saldo Pendiente</p>
                <p className="font-semibold text-amber-600">{formatMonto(saldoPendiente)}</p>
              </div>
            </div>
          </div>
          
          {/* Body */}
          <div className="p-6 space-y-4">
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                <Icon name="AlertCircle" size={18} className="text-red-500" />
                <p className="text-sm text-red-700">{errors.submit}</p>
              </div>
            )}
            
            {/* Monto */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Monto del Pago *
                </label>
                <button
                  type="button"
                  onClick={handlePagoTotal}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Pagar total ({formatMonto(saldoPendiente)})
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                <input
                  type="number"
                  value={formData.monto}
                  onChange={(e) => handleChange('monto', e.target.value)}
                  placeholder="0"
                  className={`w-full pl-8 pr-4 py-2.5 border rounded-lg text-lg font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                    errors.monto ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.monto && (
                <p className="text-sm text-red-500 mt-1">{errors.monto}</p>
              )}
            </div>
            
            {/* Fecha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Pago *
              </label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => handleChange('fecha', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                  errors.fecha ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fecha && (
                <p className="text-sm text-red-500 mt-1">{errors.fecha}</p>
              )}
            </div>
            
            {/* Forma de pago y Banco */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Forma de Pago *
                </label>
                <select
                  value={formData.formaPago}
                  onChange={(e) => handleChange('formaPago', e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                    errors.formaPago ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {formasPago.map(forma => (
                    <option key={forma} value={forma}>{forma}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Banco
                </label>
                <input
                  type="text"
                  value={formData.banco}
                  onChange={(e) => handleChange('banco', e.target.value)}
                  placeholder="Ej: Banco Estado"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
            
            {/* N° Comprobante */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                N° Comprobante
              </label>
              <input
                type="text"
                value={formData.numeroComprobante}
                onChange={(e) => handleChange('numeroComprobante', e.target.value)}
                placeholder="Ej: TRF-2024-00001"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
            
            {/* Observaciones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observaciones
              </label>
              <textarea
                value={formData.observaciones}
                onChange={(e) => handleChange('observaciones', e.target.value)}
                rows={2}
                placeholder="Notas adicionales del pago..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
              />
            </div>
            
            {/* Preview */}
            {formData.monto && !isNaN(Number(formData.monto)) && Number(formData.monto) > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emerald-700">Monto a registrar</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {formatMonto(Number(formData.monto))}
                    </p>
                  </div>
                  {Number(formData.monto) === saldoPendiente && (
                    <div className="flex items-center gap-1 text-emerald-600">
                      <Icon name="CheckCircle" size={20} />
                      <span className="text-sm font-medium">Pago total</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-emerald-600 mt-2">
                  Saldo después del pago: {formatMonto(saldoPendiente - Number(formData.monto))}
                </p>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <CustomButton
              variant="secondary"
              className="flex-1"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </CustomButton>
            <CustomButton
              variant="primary"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Icon name="Check" size={16} />
                  Registrar Pago
                </>
              )}
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalRegistrarPago;

