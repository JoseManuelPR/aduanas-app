/**
 * ModalAdmisibilidad - Modal para registrar admisibilidad de reclamo TTA
 */

import React, { useState } from 'react';
import { Icon } from 'he-button-custom-library';
import { type Reclamo } from '../../../data';

interface ModalAdmisibilidadProps {
  reclamo: Reclamo;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (admisible: boolean, motivo?: string) => void;
}

export const ModalAdmisibilidad: React.FC<ModalAdmisibilidadProps> = ({
  reclamo,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [admisible, setAdmisible] = useState<boolean | null>(null);
  const [motivo, setMotivo] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  
  if (!isOpen) return null;
  
  const handleSubmit = () => {
    const newErrors: string[] = [];
    
    if (admisible === null) {
      newErrors.push('Debe seleccionar si el reclamo es admisible o no.');
    }
    
    if (admisible === false && !motivo.trim()) {
      newErrors.push('Debe indicar el motivo de inadmisibilidad.');
    }
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onConfirm(admisible!, admisible === false ? motivo : undefined);
    handleClose();
  };
  
  const handleClose = () => {
    setAdmisible(null);
    setMotivo('');
    setErrors([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-aduana-azul px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Icon name="CheckCircle" size={24} />
            Registrar Admisibilidad
          </h2>
          <button onClick={handleClose} className="text-white/80 hover:text-white">
            <Icon name="X" size={24} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Info del reclamo */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Reclamo</p>
            <p className="font-semibold text-aduana-azul">{reclamo.numeroReclamo}</p>
            <p className="text-sm text-gray-600 mt-1">{reclamo.reclamante}</p>
          </div>
          
          {/* Errores */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Icon name="AlertCircle" size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <ul className="text-sm text-red-700 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {/* Selector de admisibilidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              ¿El reclamo es admisible?
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setAdmisible(true)}
                className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                  admisible === true 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon name="CheckCircle" size={32} className={admisible === true ? 'text-emerald-500' : 'text-gray-400'} />
                <span className="font-medium">Admisible</span>
              </button>
              <button
                onClick={() => setAdmisible(false)}
                className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                  admisible === false 
                    ? 'border-red-500 bg-red-50 text-red-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon name="XCircle" size={32} className={admisible === false ? 'text-red-500' : 'text-gray-400'} />
                <span className="font-medium">Inadmisible</span>
              </button>
            </div>
          </div>
          
          {/* Motivo de inadmisibilidad */}
          {admisible === false && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo de Inadmisibilidad *
              </label>
              <textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Indique el motivo por el cual el reclamo es inadmisible..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent resize-none"
                rows={4}
              />
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={admisible === null}
            className="px-6 py-2 bg-aduana-azul text-white rounded-lg hover:bg-aduana-azul-dark disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
          >
            <Icon name="Check" size={18} />
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAdmisibilidad;

