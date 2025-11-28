/**
 * ModalConfirmacion - Modal de confirmación genérico
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import React from 'react';
import { Icon } from 'he-button-custom-library';
import { CustomButton } from '../../../components/Button/Button';

type IconName = 'AlertCircle' | 'AlertTriangle' | 'Check' | 'X' | 'Info' | 'Send' | 'Receipt' | 'Trash2';

interface ModalConfirmacionProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'secondary' | 'danger';
  icon?: IconName;
}

export const ModalConfirmacion: React.FC<ModalConfirmacionProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmVariant = 'primary',
  icon = 'AlertCircle',
}) => {
  if (!isOpen) return null;
  
  const getIconColor = () => {
    switch (confirmVariant) {
      case 'danger': return 'text-red-500 bg-red-100';
      case 'primary': return 'text-aduana-azul bg-blue-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };
  
  const getConfirmButtonClass = () => {
    switch (confirmVariant) {
      case 'danger': return 'bg-red-600 hover:bg-red-700 text-white';
      case 'primary': return 'bg-aduana-azul hover:bg-aduana-azul/90 text-white';
      default: return '';
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full transform transition-all animate-fade-in">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
          
          {/* Content */}
          <div className="p-6">
            {/* Icon */}
            <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${getIconColor()}`}>
              <Icon name={icon} size={24} />
            </div>
            
            {/* Title */}
            <h3 className="mt-4 text-lg font-semibold text-center text-gray-900">
              {title}
            </h3>
            
            {/* Message */}
            <p className="mt-2 text-sm text-gray-600 text-center whitespace-pre-line">
              {message}
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3 px-6 pb-6">
            <CustomButton
              variant="secondary"
              className="flex-1"
              onClick={onClose}
            >
              {cancelText}
            </CustomButton>
            <CustomButton
              variant={confirmVariant === 'danger' ? 'secondary' : 'primary'}
              className={`flex-1 ${getConfirmButtonClass()}`}
              onClick={onConfirm}
            >
              {confirmText}
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacion;

