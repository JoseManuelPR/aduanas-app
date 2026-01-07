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
  numeroReferencia?: string;
  prioridad?: 'alta' | 'media' | 'baja';
  diasRestantes?: number;
}

interface NotificationDropdownProps {
  notifications: NotificationItem[];
  unreadCount: number;
}

// Configuración de tipos con iconos y colores
const TIPO_CONFIG: Record<string, { icon: string; color: string; bgColor: string }> = {
  hallazgo: { icon: 'Search', color: 'text-purple-600', bgColor: 'bg-purple-50' },
  denuncia: { icon: 'FileWarning', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  reclamo: { icon: 'AlertCircle', color: 'text-amber-600', bgColor: 'bg-amber-50' },
  cargo: { icon: 'Receipt', color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
};

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  unreadCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  // Ordenar: no leídas primero, luego por prioridad
  const sortedNotifications = [...notifications]
    .sort((a, b) => {
      // No leídas primero
      if (!a.leido && b.leido) return -1;
      if (a.leido && !b.leido) return 1;
      // Por prioridad
      const prioridadOrder = { alta: 0, media: 1, baja: 2 };
      const prioA = prioridadOrder[a.prioridad || 'baja'];
      const prioB = prioridadOrder[b.prioridad || 'baja'];
      return prioA - prioB;
    })
    .slice(0, 8);

  // Agrupar por urgencia para mostrar conteo
  const urgentes = notifications.filter(n => !n.leido && (n.prioridad === 'alta' || (n.diasRestantes !== undefined && n.diasRestantes <= 3))).length;

  // Formatear fecha relativa
  const formatRelativeDate = (dateString: string): string => {
    const date = new Date(dateString.split('-').reverse().join('-'));
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return dateString;
  };

  // Truncar descripción
  const truncate = (text: string, maxLength: number = 60): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  // Determinar indicador de urgencia
  const getUrgencyIndicator = (notification: NotificationItem) => {
    if (notification.prioridad === 'alta' || (notification.diasRestantes !== undefined && notification.diasRestantes <= 3)) {
      return { color: 'bg-red-500', pulse: true };
    }
    if (notification.prioridad === 'media' || (notification.diasRestantes !== undefined && notification.diasRestantes <= 7)) {
      return { color: 'bg-amber-500', pulse: false };
    }
    return { color: 'bg-blue-500', pulse: false };
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
          <span className={`absolute -top-0.5 -right-0.5 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 ${urgentes > 0 ? 'bg-red-500' : 'bg-aduana-azul'}`}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          {/* Header compacto */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 text-sm">Notificaciones</span>
              {urgentes > 0 && (
                <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-medium">
                  {urgentes} urgente{urgentes > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <button 
              className="text-xs text-aduana-azul hover:underline"
              onClick={() => {
                navigate(ERoutePaths.NOTIFICACIONES);
                setIsOpen(false);
              }}
            >
              Ver todas
            </button>
          </div>

          {/* Lista compacta */}
          <div className="max-h-[320px] overflow-y-auto">
            {sortedNotifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Icon name="CheckCircle" size={28} className="mx-auto mb-2 text-emerald-400" />
                <p className="text-sm text-gray-500">Sin notificaciones pendientes</p>
              </div>
            ) : (
              <div className="py-1">
                {sortedNotifications.map((notification) => {
                  const tipoConfig = TIPO_CONFIG[notification.tipo];
                  const urgency = getUrgencyIndicator(notification);
                  
                  return (
                    <div
                      key={notification.id}
                      className={`px-3 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer border-l-3 ${
                        !notification.leido ? 'bg-blue-50/50 border-l-blue-500' : 'border-l-transparent'
                      }`}
                      onClick={() => {
                        navigate(ERoutePaths.NOTIFICACIONES);
                        setIsOpen(false);
                      }}
                    >
                      <div className="flex items-start gap-2.5">
                        {/* Icono de tipo */}
                        <div className={`p-1.5 rounded-lg ${tipoConfig.bgColor} flex-shrink-0`}>
                          <Icon name={tipoConfig.icon as any} size={14} className={tipoConfig.color} />
                        </div>
                        
                        {/* Contenido */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            {/* Indicador de urgencia */}
                            {!notification.leido && (
                              <span className={`w-1.5 h-1.5 rounded-full ${urgency.color} ${urgency.pulse ? 'animate-pulse' : ''}`} />
                            )}
                            {/* Referencia */}
                            <span className="text-xs font-medium text-gray-900">
                              {notification.numeroReferencia || notification.numeroNotificacion}
                            </span>
                            {/* Días restantes si es urgente */}
                            {notification.diasRestantes !== undefined && notification.diasRestantes <= 5 && (
                              <span className={`text-[10px] px-1 py-0.5 rounded ${
                                notification.diasRestantes <= 2 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {notification.diasRestantes <= 0 ? 'Vencido' : `${notification.diasRestantes}d`}
                              </span>
                            )}
                          </div>
                          {/* Descripción truncada */}
                          <p className="text-xs text-gray-600 leading-snug">
                            {truncate(notification.descripcion)}
                          </p>
                          {/* Fecha relativa */}
                          <span className="text-[10px] text-gray-400 mt-0.5 block">
                            {formatRelativeDate(notification.fecha)}
                          </span>
                        </div>

                        {/* Flecha de navegación */}
                        <Icon name="ChevronRight" size={14} className="text-gray-300 flex-shrink-0 mt-1" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer con acción rápida */}
          {sortedNotifications.length > 0 && (
            <div className="px-3 py-2 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => {
                  // Marcar todas como leídas (simulado)
                  navigate(ERoutePaths.NOTIFICACIONES);
                  setIsOpen(false);
                }}
                className="w-full text-[11px] text-gray-500 hover:text-gray-700 transition-colors"
              >
                Marcar todas como leídas
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
