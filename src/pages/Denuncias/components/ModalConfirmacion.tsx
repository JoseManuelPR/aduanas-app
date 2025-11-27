import { Icon } from "he-button-custom-library";
import { CustomButton } from "../../../components/Button/Button";

interface ModalConfirmacionProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  titulo: string;
  mensaje: string;
  tipo?: 'info' | 'warning' | 'error' | 'success';
  textoConfirmar?: string;
  textoCancelar?: string;
  children?: React.ReactNode;
}

export const ModalConfirmacion: React.FC<ModalConfirmacionProps> = ({
  isOpen,
  onClose,
  onConfirm,
  titulo,
  mensaje,
  tipo = 'info',
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  children,
}) => {
  if (!isOpen) return null;

  const getIconConfig = () => {
    switch (tipo) {
      case 'success':
        return { name: 'CheckCircle', bgColor: 'bg-emerald-100', iconColor: 'text-emerald-600' };
      case 'warning':
        return { name: 'AlertTriangle', bgColor: 'bg-amber-100', iconColor: 'text-amber-600' };
      case 'error':
        return { name: 'AlertCircle', bgColor: 'bg-red-100', iconColor: 'text-red-600' };
      default:
        return { name: 'Info', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' };
    }
  };

  const iconConfig = getIconConfig();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full animate-fade-in">
          {/* Header */}
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full ${iconConfig.bgColor}`}>
                <Icon name={iconConfig.name as any} size={24} className={iconConfig.iconColor} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{titulo}</h3>
                <p className="mt-2 text-sm text-gray-600">{mensaje}</p>
              </div>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            
            {/* Contenido adicional */}
            {children && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                {children}
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-xl">
            <CustomButton 
              variant="secondary" 
              onClick={onClose}
            >
              {textoCancelar}
            </CustomButton>
            <CustomButton 
              variant="primary"
              onClick={onConfirm}
              className={
                tipo === 'error' ? 'bg-red-600 hover:bg-red-700' :
                tipo === 'warning' ? 'bg-amber-600 hover:bg-amber-700' :
                tipo === 'success' ? 'bg-emerald-600 hover:bg-emerald-700' :
                ''
              }
            >
              {textoConfirmar}
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacion;

