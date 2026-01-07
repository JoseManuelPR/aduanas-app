import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from "he-button-custom-library";
import CustomLayout from '../../Layout/Layout';
import { CustomInput } from '../../components/Input/Input';
import { Badge } from '../../components/UI';
import { Tabs } from '../../components/UI/Tabs';
import { Pagination } from '../../components/Pagination';
import { ERoutePaths } from '../../routes/routes';

// Datos centralizados
import {
  notificacionesDenuncias,
  notificacionesReclamos,
  notificacionesCargos,
  getTodasLasNotificaciones,
  getConteoNotificaciones,
  usuarioActual,
} from '../../data';

import type { 
  NotificacionDenuncia, 
  NotificacionReclamo, 
  NotificacionCargo 
} from '../../data';

// Sidebar menu
import CONSTANTS_APP from '../../constants/sidebar-menu';

type TabType = 'denuncias' | 'reclamos' | 'cargos';

// Configuración de tipos con iconos y colores
const TIPO_CONFIG = {
  denuncias: { icon: 'FileWarning', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  reclamos: { icon: 'AlertCircle', color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
  cargos: { icon: 'Receipt', color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
};

export const NotificacionesList: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('denuncias');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [prioridadFiltro, setPrioridadFiltro] = useState<string>('');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const itemsPerPage = 15;

  const conteoNotificaciones = getConteoNotificaciones();

  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    if (dateStr.includes('-') && dateStr.split('-')[0].length <= 2) {
      const [day, month, year] = dateStr.split('-').map(Number);
      if (!day || !month || !year) return null;
      return new Date(year, month - 1, day);
    }
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  };

  // Determinar prioridad de una notificación
  const getPrioridad = (item: any): 'alta' | 'media' | 'baja' => {
    if (!item.leido && item.diasVencimiento !== undefined && item.diasVencimiento <= 3) return 'alta';
    if (!item.leido) return 'media';
    return 'baja';
  };

  // Filtrar datos
  const filterData = <T extends { 
    numeroNotificacion: string; 
    descripcion: string; 
    fechaGeneracion: string;
    leido: boolean;
  }>(data: T[]): T[] => {
    return data.filter((item) => {
      const matchesSearch = 
        !searchTerm ||
        item.numeroNotificacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (('numeroDenuncia' in item && String(item.numeroDenuncia).toLowerCase().includes(searchTerm.toLowerCase())) ||
         ('numeroReclamo' in item && String(item.numeroReclamo).toLowerCase().includes(searchTerm.toLowerCase())) ||
         ('numeroCargo' in item && String(item.numeroCargo).toLowerCase().includes(searchTerm.toLowerCase())));

      const itemDate = parseDate(item.fechaGeneracion);
      let matchesDate = true;
      if (fechaDesde && itemDate) {
        const desdeDate = parseDate(fechaDesde);
        if (desdeDate) {
          const itemDateOnly = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
          const desdeDateOnly = new Date(desdeDate.getFullYear(), desdeDate.getMonth(), desdeDate.getDate());
          if (itemDateOnly < desdeDateOnly) matchesDate = false;
        }
      }
      if (fechaHasta && itemDate) {
        const hastaDate = parseDate(fechaHasta);
        if (hastaDate) {
          const itemDateOnly = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
          const hastaDateOnly = new Date(hastaDate.getFullYear(), hastaDate.getMonth(), hastaDate.getDate());
          if (itemDateOnly > hastaDateOnly) matchesDate = false;
        }
      }

      // Filtro de prioridad
      let matchesPrioridad = true;
      if (prioridadFiltro) {
        const prioridad = getPrioridad(item);
        if (prioridadFiltro !== prioridad) matchesPrioridad = false;
      }

      return matchesSearch && matchesDate && matchesPrioridad;
    });
  };

  const getFilteredAndPaginatedData = <T extends { 
    numeroNotificacion: string; 
    descripcion: string; 
    fechaGeneracion: string;
    leido: boolean;
  }>(data: T[]) => {
    const filtered = filterData(data);
    // Ordenar: no leídas primero, luego por prioridad
    const sorted = [...filtered].sort((a, b) => {
      if (!a.leido && b.leido) return -1;
      if (a.leido && !b.leido) return 1;
      return 0;
    });
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      filtered: sorted,
      paginated: sorted.slice(startIndex, endIndex),
      totalPages: Math.ceil(sorted.length / itemsPerPage),
    };
  };

  const denunciasData = useMemo(() => 
    getFilteredAndPaginatedData(notificacionesDenuncias),
    [searchTerm, fechaDesde, fechaHasta, prioridadFiltro, currentPage]
  );

  const reclamosData = useMemo(() => 
    getFilteredAndPaginatedData(notificacionesReclamos),
    [searchTerm, fechaDesde, fechaHasta, prioridadFiltro, currentPage]
  );

  const cargosData = useMemo(() => 
    getFilteredAndPaginatedData(notificacionesCargos),
    [searchTerm, fechaDesde, fechaHasta, prioridadFiltro, currentPage]
  );

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as TabType);
    setCurrentPage(1);
  };

  const allNotifications = getTodasLasNotificaciones();

  // Truncar descripción
  const truncateDesc = (text: string, maxLength: number = 80): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  // Handler de navegación según tipo
  const handleRowClick = (
    tipo: TabType,
    row: NotificacionDenuncia | NotificacionReclamo | NotificacionCargo
  ) => {
    switch (tipo) {
      case 'denuncias':
        {
          const denuncia = row as NotificacionDenuncia;
          const hallazgoId = denuncia.hallazgoId;
          const numeroHallazgo = denuncia.numeroHallazgo ||
            (typeof denuncia.descripcion === 'string'
              ? (denuncia.descripcion.match(/PFI-\d+/i)?.[0]?.toUpperCase() ?? undefined)
              : undefined);

          const path = hallazgoId
            ? `${ERoutePaths.DENUNCIAS_NUEVA}?hallazgoId=${encodeURIComponent(hallazgoId)}`
            : numeroHallazgo
              ? `${ERoutePaths.DENUNCIAS_NUEVA}?numeroHallazgo=${encodeURIComponent(numeroHallazgo)}`
              : ERoutePaths.DENUNCIAS_NUEVA;

          navigate(path, {
            state: {
              origen: 'NOTIFICACION_DENUNCIA',
              hallazgoId,
              numeroHallazgo,
              notificacionId: denuncia.id,
            },
          });
        }
        break;
      case 'reclamos':
        navigate(ERoutePaths.RECLAMOS);
        break;
      case 'cargos':
        navigate(ERoutePaths.CARGOS);
        break;
    }
  };

  // Renderizar fila de notificación
  const renderNotificationRow = (
    item: NotificacionDenuncia | NotificacionReclamo | NotificacionCargo,
    tipo: TabType
  ) => {
    const prioridad = getPrioridad(item);
    const isHovered = hoveredRow === item.id;
    const config = TIPO_CONFIG[tipo];
    
    // Obtener número de referencia según tipo
    const numeroRef = tipo === 'denuncias' 
      ? (item as NotificacionDenuncia).numeroDenuncia 
      : tipo === 'reclamos'
        ? (item as NotificacionReclamo).numeroReclamo
        : (item as NotificacionCargo).numeroCargo;

    return (
      <div
        key={item.id}
        className={`
          group relative flex items-center gap-4 px-4 py-3 border-b border-gray-100 cursor-pointer transition-all
          ${!item.leido ? 'bg-blue-50/40' : 'bg-white'}
          ${isHovered ? 'bg-gray-50' : ''}
          ${prioridad === 'alta' ? 'border-l-4 border-l-red-400' : prioridad === 'media' ? 'border-l-4 border-l-amber-400' : 'border-l-4 border-l-transparent'}
        `}
        onMouseEnter={() => setHoveredRow(item.id)}
        onMouseLeave={() => setHoveredRow(null)}
        onClick={() => handleRowClick(tipo, item)}
      >
        {/* Indicador de prioridad */}
        <div className="flex-shrink-0">
          {prioridad === 'alta' ? (
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <Icon name="AlertTriangle" size={16} className="text-red-500" />
            </div>
          ) : prioridad === 'media' ? (
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
              <Icon name="Clock" size={16} className="text-amber-500" />
            </div>
          ) : (
            <div className={`w-8 h-8 rounded-full ${config.bgColor} flex items-center justify-center`}>
              <Icon name={config.icon as any} size={16} className={config.color} />
            </div>
          )}
        </div>

        {/* Contenido principal */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            {/* Indicador de no leído */}
            {!item.leido && (
              <span className={`w-2 h-2 rounded-full ${prioridad === 'alta' ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}`} />
            )}
            {/* Número de referencia */}
            <span className="text-sm font-semibold text-gray-900">
              {numeroRef}
            </span>
            {/* Badge de tipo (solo en denuncias) */}
            {tipo === 'denuncias' && (item as NotificacionDenuncia).tipoDenuncia && (
              <Badge 
                variant={(item as NotificacionDenuncia).tipoDenuncia === 'Infraccional' ? 'info' : 'error'} 
                size="sm"
              >
                {(item as NotificacionDenuncia).tipoDenuncia}
              </Badge>
            )}
            {/* Badge de urgencia */}
            {prioridad === 'alta' && (
              <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium">
                URGENTE
              </span>
            )}
          </div>
          {/* Descripción truncada */}
          <p className="text-sm text-gray-600 truncate">
            {truncateDesc(item.descripcion)}
          </p>
        </div>

        {/* Metadatos */}
        <div className="flex-shrink-0 text-right hidden sm:block">
          <p className="text-xs text-gray-500">{item.fechaGeneracion}</p>
          <p className="text-[10px] text-gray-400 uppercase mt-0.5">{item.numeroNotificacion}</p>
        </div>

        {/* Indicador de navegación - siempre visible */}
        <div className="flex-shrink-0 pl-2">
          <Icon 
            name="ChevronRight" 
            size={18} 
            className={`transition-colors ${isHovered ? 'text-aduana-azul' : 'text-gray-300'}`} 
          />
        </div>
      </div>
    );
  };

  // Contenido de cada tab
  const getTabContent = (tabId: TabType) => {
    const tabData = tabId === 'denuncias' ? denunciasData :
                    tabId === 'reclamos' ? reclamosData :
                    cargosData;

    const emptyMessages = {
      denuncias: { title: 'Sin notificaciones de denuncias', icon: 'FileText' },
      reclamos: { title: 'Sin notificaciones de reclamos', icon: 'AlertCircle' },
      cargos: { title: 'Sin notificaciones de cargos', icon: 'Receipt' },
    };

    if (tabData.filtered.length === 0) {
      return (
        <div className="py-16 text-center">
          <Icon name={emptyMessages[tabId].icon as any} size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">{emptyMessages[tabId].title}</p>
          <p className="text-sm text-gray-400 mt-1">Ajusta los filtros o revisa más tarde</p>
        </div>
      );
    }

    return (
      <div>
        {/* Lista de notificaciones */}
        <div className="divide-y divide-gray-100">
          {tabData.paginated.map((item) => renderNotificationRow(item, tabId))}
        </div>
        
        {/* Paginación */}
        {tabData.totalPages > 1 && (
          <div className="p-4 border-t border-gray-100">
            <Pagination
              currentPage={currentPage}
              totalPages={tabData.totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={tabData.filtered.length}
            />
          </div>
        )}
      </div>
    );
  };

  // Contar urgentes por tipo
  const urgentesCount = {
    denuncias: notificacionesDenuncias.filter(n => !n.leido && getPrioridad(n) === 'alta').length,
    reclamos: notificacionesReclamos.filter(n => !n.leido && getPrioridad(n) === 'alta').length,
    cargos: notificacionesCargos.filter(n => !n.leido && getPrioridad(n) === 'alta').length,
  };

  const tabs = useMemo(() => [
    {
      id: 'denuncias',
      label: 'Denuncias',
      badge: conteoNotificaciones.denuncias.noLeidas,
      badgeVariant: urgentesCount.denuncias > 0 ? 'danger' as const : 'default' as const,
      content: getTabContent('denuncias'),
    },
    {
      id: 'cargos',
      label: 'Cargos',
      badge: conteoNotificaciones.cargos.noLeidas,
      badgeVariant: urgentesCount.cargos > 0 ? 'danger' as const : 'default' as const,
      content: getTabContent('cargos'),
    },
    {
      id: 'reclamos',
      label: 'Reclamos',
      badge: conteoNotificaciones.reclamos.noLeidas,
      badgeVariant: urgentesCount.reclamos > 0 ? 'danger' as const : 'default' as const,
      content: getTabContent('reclamos'),
    },
  ], [activeTab, currentPage, searchTerm, fechaDesde, fechaHasta, prioridadFiltro, denunciasData, reclamosData, cargosData, hoveredRow]);

  const hayFiltrosActivos = searchTerm || fechaDesde || fechaHasta || prioridadFiltro;

  return (
    <CustomLayout
      platformName="Sistema de Tramitación de Denuncias"
      sidebarItems={CONSTANTS_APP.ITEMS_SIDEBAR_MENU}
      options={[]}
      onLogout={() => navigate(ERoutePaths.LOGIN)}
      notifications={allNotifications}
      user={{
        initials: usuarioActual.initials,
        name: usuarioActual.name,
        email: usuarioActual.email,
        role: usuarioActual.role,
      }}
    >
      <div className="min-h-full space-y-4 animate-fade-in pb-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <button
                onClick={() => navigate(ERoutePaths.DASHBOARD)}
                className="hover:text-aduana-azul transition-colors"
              >
                Dashboard
              </button>
              <Icon name="ChevronRight" size={14} />
              <span className="text-gray-900 font-medium">Notificaciones</span>
            </nav>
            <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
          </div>

          {/* Resumen rápido de urgentes */}
          {(urgentesCount.denuncias > 0 || urgentesCount.reclamos > 0 || urgentesCount.cargos > 0) && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
              <Icon name="AlertTriangle" size={16} className="text-red-500" />
              <span className="text-sm text-red-700">
                <strong>{urgentesCount.denuncias + urgentesCount.reclamos + urgentesCount.cargos}</strong> urgente(s) requieren atención
              </span>
            </div>
          )}
        </div>

        {/* Card principal */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Filtros compactos */}
          <div className="flex flex-wrap items-end gap-3 p-4 bg-gray-50 border-b border-gray-100">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-500 mb-1">Buscar</label>
              <CustomInput
                type="text"
                placeholder="Número o descripción..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full !py-2"
              />
            </div>
            <div className="w-36">
              <label className="block text-xs font-medium text-gray-500 mb-1">Desde</label>
              <CustomInput
                type="date"
                value={fechaDesde}
                onChange={(e) => {
                  setFechaDesde(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full !py-2"
              />
            </div>
            <div className="w-36">
              <label className="block text-xs font-medium text-gray-500 mb-1">Hasta</label>
              <CustomInput
                type="date"
                value={fechaHasta}
                onChange={(e) => {
                  setFechaHasta(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full !py-2"
              />
            </div>
            <div className="w-32">
              <label className="block text-xs font-medium text-gray-500 mb-1">Prioridad</label>
              <select
                value={prioridadFiltro}
                onChange={(e) => {
                  setPrioridadFiltro(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-aduana-azul-200 focus:border-aduana-azul"
              >
                <option value="">Todas</option>
                <option value="alta">🔴 Alta</option>
                <option value="media">🟡 Media</option>
                <option value="baja">🟢 Baja</option>
              </select>
            </div>
            {hayFiltrosActivos && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFechaDesde('');
                  setFechaHasta('');
                  setPrioridadFiltro('');
                  setCurrentPage(1);
                }}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Icon name="X" size={14} />
                Limpiar
              </button>
            )}
          </div>

          {/* Tabs */}
          <Tabs
            tabs={tabs}
            defaultTab={activeTab}
            onChange={handleTabChange}
            variant="underline"
          />
        </section>
      </div>
    </CustomLayout>
  );
};

export default NotificacionesList;
