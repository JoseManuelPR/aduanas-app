import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'he-button-custom-library';
import { ERoutePaths } from '../../routes/routes';

export interface NotificationItem {
  id: string;
  numeroNotificacion: string;
  descripcion: string;
  fecha: string;
  tipo: 'hallazgo' | 'denuncia' | 'reclamo' | 'cargo';
  leido: boolean;
  numeroReferencia?: string; // PFI-XXX para hallazgos, número para otros
}

interface NotificationDropdownProps {
  notifications: NotificationItem[];
  unreadCount: number;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  unreadCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Obtener últimas 10 notificaciones
  const lastNotifications = notifications.slice(0, 10);

  // Formatear fecha a dd-mm-aaaa
  const formatDate = (dateString: string): string => {
    // Si la fecha ya está en formato dd-mm-aaaa, devolverla tal cual
    if (dateString && dateString.includes('-') && dateString.split('-')[0].length <= 2) {
      return dateString;
    }
    
    // Si viene en formato ISO o otro formato, parsearlo
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // Si no se puede parsear, devolver la fecha original
      return dateString;
    }
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Obtener tipo de notificación en texto
  const getTipoTexto = (tipo: string): string => {
    const tipos: Record<string, string> = {
      hallazgo: 'Hallazgo',
      denuncia: 'Denuncia',
      reclamo: 'Reclamo',
      cargo: 'Cargo',
    };
    return tipos[tipo] || tipo;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-aduana-azul transition-colors"
        aria-label="Notificaciones"
      >
        <Icon name="Bell" size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-aduana-rojo text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[600px] flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Notificaciones</h3>
            {unreadCount > 0 && (
              <span className="text-xs text-gray-500">
                {unreadCount} sin leer
              </span>
            )}
          </div>

          {/* Lista de notificaciones */}
          <div className="overflow-y-auto max-h-[400px]">
            {lastNotifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <Icon name="Bell" size={32} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No hay notificaciones</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {lastNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.leido ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => {
                      navigate(ERoutePaths.NOTIFICACIONES);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-aduana-azul">
                            {getTipoTexto(notification.tipo)}
                          </span>
                          {!notification.leido && (
                            <span className="w-2 h-2 bg-aduana-rojo rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-900 line-clamp-2">
                          {notification.descripcion}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {formatDate(notification.fecha)}
                          </span>
                          {notification.numeroReferencia && (
                            <>
                              <span className="text-xs text-gray-300">•</span>
                              <span className="text-xs text-gray-600 font-medium">
                                {notification.numeroReferencia}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-200">
            <button
              onClick={() => {
                navigate(ERoutePaths.NOTIFICACIONES);
                setIsOpen(false);
              }}
              className="w-full text-sm font-medium text-aduana-azul hover:text-aduana-azul-600 transition-colors"
            >
              Ver todo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;

