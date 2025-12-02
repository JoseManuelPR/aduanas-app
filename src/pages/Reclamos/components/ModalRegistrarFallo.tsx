/**
 * ModalRegistrarFallo - Modal para registrar fallo TTA
 */

import React, { useState } from 'react';
import { Icon } from 'he-button-custom-library';
import { type Reclamo, type TipoFalloTTA, formatMonto } from '../../../data';

interface ModalRegistrarFalloProps {
  reclamo: Reclamo;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (tipoFallo: TipoFalloTTA, fundamento: string, monto?: number, esApelacion?: boolean) => void;
  esApelacion?: boolean;
}

const tiposFallo: TipoFalloTTA[] = [
  'Acogido',
  'Rechazado',
  'Acogido Parcialmente',
  'Inadmisible',
  'Desistido',
];

export const ModalRegistrarFallo: React.FC<ModalRegistrarFalloProps> = ({
  reclamo,
  isOpen,
  onClose,
  onConfirm,
  esApelacion = false,
}) => {
  const [tipoFallo, setTipoFallo] = useState<TipoFalloTTA | ''>('');
  const [fundamento, setFundamento] = useState('');
  const [monto, setMonto] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  
  if (!isOpen) return null;
  
  const handleSubmit = () => {
    const newErrors: string[] = [];
    
    if (!tipoFallo) {
      newErrors.push('Debe seleccionar el tipo de fallo.');
    }
    
    if (!fundamento.trim()) {
      newErrors.push('Debe indicar el fundamento del fallo.');
    }
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const montoNum = monto ? parseFloat(monto.replace(/\./g, '').replace(',', '.')) : undefined;
    onConfirm(tipoFallo as TipoFalloTTA, fundamento, montoNum, esApelacion);
    handleClose();
  };
  
  const handleClose = () => {
    setTipoFallo('');
    setFundamento('');
    setMonto('');
    setErrors([]);
    onClose();
  };
  
  const getFalloIcon = (fallo: TipoFalloTTA): "CheckCircle" | "XCircle" | "AlertCircle" | "MinusCircle" | "LogOut" => {
    const iconMap: Record<TipoFalloTTA, "CheckCircle" | "XCircle" | "AlertCircle" | "MinusCircle" | "LogOut"> = {
      'Acogido': 'CheckCircle',
      'Rechazado': 'XCircle',
      'Acogido Parcialmente': 'AlertCircle',
      'Inadmisible': 'MinusCircle',
      'Desistido': 'LogOut',
    };
    return iconMap[fallo];
  };
  
  const getFalloColor = (fallo: TipoFalloTTA, selected: boolean) => {
    if (!selected) return 'border-gray-200 hover:border-gray-300';
    const colorMap: Record<TipoFalloTTA, string> = {
      'Acogido': 'border-emerald-500 bg-emerald-50 text-emerald-700',
      'Rechazado': 'border-red-500 bg-red-50 text-red-700',
      'Acogido Parcialmente': 'border-amber-500 bg-amber-50 text-amber-700',
      'Inadmisible': 'border-gray-500 bg-gray-50 text-gray-700',
      'Desistido': 'border-blue-500 bg-blue-50 text-blue-700',
    };
    return colorMap[fallo];
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-aduana-azul px-6 py-4 flex items-center justify-between flex-shrink-0">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Icon name="Gavel" size={24} />
            {esApelacion ? 'Registrar Fallo de Apelación' : 'Registrar Fallo Primera Instancia'}
          </h2>
          <button onClick={handleClose} className="text-white/80 hover:text-white">
            <Icon name="X" size={24} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Info del reclamo */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Reclamo</p>
                <p className="font-semibold text-aduana-azul">{reclamo.numeroReclamo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Monto Reclamado</p>
                <p className="font-semibold">{reclamo.montoReclamado ? formatMonto(reclamo.montoReclamado) : '-'}</p>
              </div>
              {reclamo.datosTTA?.rolTTA && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 mb-1">ROL TTA</p>
                  <p className="font-medium">{reclamo.datosTTA.rolTTA}</p>
                </div>
              )}
            </div>
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
          
          {/* Selector de tipo de fallo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de Fallo *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {tiposFallo.map((fallo) => (
                <button
                  key={fallo}
                  onClick={() => setTipoFallo(fallo)}
                  className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 ${getFalloColor(fallo, tipoFallo === fallo)}`}
                >
                  <Icon 
                    name={getFalloIcon(fallo)} 
                    size={20} 
                    className={tipoFallo === fallo ? '' : 'text-gray-400'} 
                  />
                  <span className="font-medium text-sm">{fallo}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Monto resuelto */}
          {(tipoFallo === 'Acogido' || tipoFallo === 'Acogido Parcialmente') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monto Resuelto (opcional)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="text"
                  value={monto}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setMonto(value ? parseInt(value).toLocaleString('es-CL') : '');
                  }}
                  placeholder="0"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-8 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                />
              </div>
            </div>
          )}
          
          {/* Fundamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fundamento del Fallo *
            </label>
            <textarea
              value={fundamento}
              onChange={(e) => setFundamento(e.target.value)}
              placeholder="Indique el fundamento del fallo emitido por el tribunal..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent resize-none"
              rows={5}
            />
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 flex-shrink-0 border-t">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!tipoFallo}
            className="px-6 py-2 bg-aduana-azul text-white rounded-lg hover:bg-aduana-azul-dark disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
          >
            <Icon name="Check" size={18} />
            Registrar Fallo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalRegistrarFallo;

