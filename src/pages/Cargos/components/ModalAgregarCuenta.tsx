/**
 * ModalAgregarCuenta - Modal para agregar cuenta de cargo
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import React, { useState } from 'react';
import { Icon } from 'he-button-custom-library';
import { CustomButton } from '../../../components/Button/Button';
import { type CargoCuenta, cuentasCatalogo, formatMonto } from '../../../data';

interface ModalAgregarCuentaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cuenta: Omit<CargoCuenta, 'id'>) => void;
  cuentaEditar?: CargoCuenta;
}

export const ModalAgregarCuenta: React.FC<ModalAgregarCuentaProps> = ({
  isOpen,
  onClose,
  onSave,
  cuentaEditar,
}) => {
  const [formData, setFormData] = useState({
    codigoCuenta: cuentaEditar?.codigoCuenta || '',
    monto: cuentaEditar?.monto?.toString() || '',
    moneda: cuentaEditar?.moneda || 'CLP',
    descripcion: cuentaEditar?.descripcion || '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Obtener nombre de cuenta seleccionada
  const cuentaSeleccionada = cuentasCatalogo.find(c => c.codigo === formData.codigoCuenta);
  
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.codigoCuenta) {
      newErrors.codigoCuenta = 'Seleccione una cuenta';
    }
    
    if (!formData.monto) {
      newErrors.monto = 'Ingrese el monto';
    } else if (isNaN(Number(formData.monto)) || Number(formData.monto) <= 0) {
      newErrors.monto = 'El monto debe ser mayor a 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (!validate()) return;
    
    const cuenta: Omit<CargoCuenta, 'id'> = {
      codigoCuenta: formData.codigoCuenta,
      nombreCuenta: cuentaSeleccionada?.nombre || formData.codigoCuenta,
      monto: Number(formData.monto),
      moneda: formData.moneda,
      descripcion: formData.descripcion,
      orden: Date.now(), // Orden temporal
    };
    
    onSave(cuenta);
    handleClose();
  };
  
  const handleClose = () => {
    setFormData({
      codigoCuenta: '',
      monto: '',
      moneda: 'CLP',
      descripcion: '',
    });
    setErrors({});
    onClose();
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
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-aduana-azul/10 rounded-lg">
                <Icon name="Calculator" size={24} className="text-aduana-azul" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {cuentaEditar ? 'Editar Cuenta' : 'Agregar Cuenta de Cargo'}
                </h3>
                <p className="text-sm text-gray-500">
                  Complete los datos de la cuenta
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
          
          {/* Body */}
          <div className="p-6 space-y-4">
            {/* Selector de cuenta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cuenta <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.codigoCuenta}
                onChange={(e) => handleChange('codigoCuenta', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-aduana-azul/20 focus:border-aduana-azul transition-all ${
                  errors.codigoCuenta ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccione una cuenta...</option>
                {cuentasCatalogo.filter(c => c.activo).map(cuenta => (
                  <option key={cuenta.id} value={cuenta.codigo}>
                    {cuenta.codigo} - {cuenta.nombre}
                  </option>
                ))}
              </select>
              {errors.codigoCuenta && (
                <p className="text-sm text-red-500 mt-1">{errors.codigoCuenta}</p>
              )}
              {cuentaSeleccionada && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Tipo:</span> {cuentaSeleccionada.tipoCuenta}
                  </p>
                  <p className="text-sm text-blue-700">
                    {cuentaSeleccionada.descripcion}
                  </p>
                </div>
              )}
            </div>
            
            {/* Monto y Moneda */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={formData.monto}
                    onChange={(e) => handleChange('monto', e.target.value)}
                    placeholder="0"
                    className={`w-full pl-8 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-aduana-azul/20 focus:border-aduana-azul transition-all ${
                      errors.monto ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.monto && (
                  <p className="text-sm text-red-500 mt-1">{errors.monto}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Moneda
                </label>
                <select
                  value={formData.moneda}
                  onChange={(e) => handleChange('moneda', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aduana-azul/20 focus:border-aduana-azul transition-all"
                >
                  <option value="CLP">CLP - Peso Chileno</option>
                  <option value="USD">USD - Dólar</option>
                  <option value="EUR">EUR - Euro</option>
                </select>
              </div>
            </div>
            
            {/* Preview del monto */}
            {formData.monto && !isNaN(Number(formData.monto)) && (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">Monto a agregar</p>
                <p className="text-2xl font-bold text-aduana-azul">
                  {formatMonto(Number(formData.monto))}
                </p>
              </div>
            )}
            
            {/* Descripción opcional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción (opcional)
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                rows={2}
                placeholder="Descripción adicional de la cuenta..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aduana-azul/20 focus:border-aduana-azul transition-all resize-none"
              />
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <CustomButton
              variant="secondary"
              className="flex-1"
              onClick={handleClose}
            >
              Cancelar
            </CustomButton>
            <CustomButton
              variant="primary"
              className="flex-1"
              onClick={handleSubmit}
            >
              <Icon name="Plus" size={16} />
              {cuentaEditar ? 'Guardar Cambios' : 'Agregar Cuenta'}
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAgregarCuenta;

