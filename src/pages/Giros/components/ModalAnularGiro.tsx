/**
 * ModalAnularGiro - Modal de confirmación para anular giro
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import React, { useState } from 'react';
import { Icon } from 'he-button-custom-library';
import { CustomButton } from '../../../components/Button/Button';
import { type Giro, anularGiro } from '../../../data';

interface ModalAnularGiroProps {
  isOpen: boolean;
  onClose: () => void;
  giro: Giro;
  onAnulado: () => void;
}

export const ModalAnularGiro: React.FC<ModalAnularGiroProps> = ({
  isOpen,
  onClose,
  giro,
  onAnulado,
}) => {
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async () => {
    if (!motivo.trim()) {
      setError('Debe ingresar el motivo de anulación');
      return;
    }
    
    if (motivo.trim().length < 10) {
      setError('El motivo debe tener al menos 10 caracteres');
      return;
    }
    
    setLoading(true);
    
    try {
      const resultado = anularGiro(giro.id, motivo.trim());
      
      if (resultado.exito) {
        onAnulado();
      } else {
        setError(resultado.error || 'Error al anular el giro');
      }
    } catch {
      setError('Error al procesar la anulación');
    } finally {
      setLoading(false);
    }
  };
  
  const handleClose = () => {
    setMotivo('');
    setError('');
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
        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full transform transition-all animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-red-50 rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Icon name="AlertTriangle" size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Anular Giro
                </h3>
                <p className="text-sm text-gray-500">
                  {giro.numeroGiro}
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
            {/* Advertencia */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Icon name="AlertCircle" size={20} className="text-amber-500 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800">
                    ¿Está seguro que desea anular este giro?
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    Esta acción no se puede deshacer. El giro quedará marcado como anulado 
                    y no se podrá registrar pagos.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Info del giro */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Monto Total</p>
                  <p className="font-semibold">{giro.montoTotal}</p>
                </div>
                <div>
                  <p className="text-gray-500">Deudor</p>
                  <p className="font-semibold">{giro.emitidoA}</p>
                </div>
                <div>
                  <p className="text-gray-500">Estado Actual</p>
                  <p className="font-semibold">{giro.estado}</p>
                </div>
                <div>
                  <p className="text-gray-500">Fecha Emisión</p>
                  <p className="font-semibold">{giro.fechaEmision}</p>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                <Icon name="AlertCircle" size={18} className="text-red-500" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            {/* Motivo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo de Anulación *
              </label>
              <textarea
                value={motivo}
                onChange={(e) => {
                  setMotivo(e.target.value);
                  if (error) setError('');
                }}
                rows={3}
                placeholder="Ingrese el motivo por el cual se anula el giro..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {motivo.length}/200 caracteres (mínimo 10)
              </p>
            </div>
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
              variant="secondary"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              onClick={handleSubmit}
              disabled={loading || !motivo.trim()}
            >
              {loading ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Icon name="XCircle" size={16} />
                  Anular Giro
                </>
              )}
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAnularGiro;

