import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from "he-button-custom-library";
import CustomLayout from '../../Layout/Layout';
import { CustomInput } from '../../components/Input/Input';
import { Table } from '../../components/Table/Table';
import { Badge } from '../../components/UI';
import { Tabs } from '../../components/UI/Tabs';
import { Pagination } from '../../components/Pagination';
import { CustomButton } from '../../components/Button/Button';
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

// Sidebar menu (solo para el menú del sidebar)
import CONSTANTS_APP from '../../constants/sidebar-menu';

type TabType = 'denuncias' | 'reclamos' | 'cargos';

export const NotificacionesList: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('denuncias');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState<string>('');

  const itemsPerPage = 25;

  // Obtener conteos de notificaciones
  const conteoNotificaciones = getConteoNotificaciones();

  // Formatear fecha de dd-mm-aaaa a Date para comparación
  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    // Si viene en formato dd-mm-aaaa
    if (dateStr.includes('-') && dateStr.split('-')[0].length <= 2) {
      const [day, month, year] = dateStr.split('-').map(Number);
      if (!day || !month || !year) return null;
      return new Date(year, month - 1, day);
    }
    // Si viene en formato yyyy-mm-dd (de input date)
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  };

  // Filtrar datos según búsqueda y filtros
  const filterData = <T extends { 
    numeroNotificacion: string; 
    descripcion: string; 
    fechaGeneracion: string;
    leido: boolean;
  }>(data: T[]): T[] => {
    return data.filter((item) => {
      // Filtro de búsqueda
      const matchesSearch = 
        !searchTerm ||
        item.numeroNotificacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (('numeroDenuncia' in item && String(item.numeroDenuncia).toLowerCase().includes(searchTerm.toLowerCase())) ||
         ('numeroReclamo' in item && String(item.numeroReclamo).toLowerCase().includes(searchTerm.toLowerCase())) ||
         ('numeroCargo' in item && String(item.numeroCargo).toLowerCase().includes(searchTerm.toLowerCase())));

      // Filtro de fecha - comparar solo fechas (sin hora)
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

      // Filtro de estado
      let matchesEstado = true;
      if (estadoFiltro) {
        if (estadoFiltro === 'Pendiente' && item.leido) matchesEstado = false;
        if (estadoFiltro === 'Vencido' && !item.leido) matchesEstado = false;
        if (estadoFiltro === 'Actualizado' && !item.leido) matchesEstado = false;
        if (estadoFiltro === 'En gestión' && item.leido) matchesEstado = false;
      }

      return matchesSearch && matchesDate && matchesEstado;
    });
  };

  // Obtener datos filtrados y paginados
  const getFilteredAndPaginatedData = <T extends { 
    numeroNotificacion: string; 
    descripcion: string; 
    fechaGeneracion: string;
    leido: boolean;
  }>(data: T[]) => {
    const filtered = filterData(data);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      filtered,
      paginated: filtered.slice(startIndex, endIndex),
      totalPages: Math.ceil(filtered.length / itemsPerPage),
    };
  };

  // Datos por tab - usando datos centralizados
  const denunciasData = useMemo(() => 
    getFilteredAndPaginatedData(notificacionesDenuncias),
    [searchTerm, fechaDesde, fechaHasta, estadoFiltro, currentPage]
  );

  const reclamosData = useMemo(() => 
    getFilteredAndPaginatedData(notificacionesReclamos),
    [searchTerm, fechaDesde, fechaHasta, estadoFiltro, currentPage]
  );

  const cargosData = useMemo(() => 
    getFilteredAndPaginatedData(notificacionesCargos),
    [searchTerm, fechaDesde, fechaHasta, estadoFiltro, currentPage]
  );

  // Resetear página cuando cambia el tab
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as TabType);
    setCurrentPage(1);
  };

  // Preparar notificaciones para el dropdown del header
  const allNotifications = getTodasLasNotificaciones();

  // Columnas para Denuncias - Con columna de origen
  const columnsDenuncias = [
    { key: 'numeroNotificacion' as const, label: 'N° Notificación', sortable: true },
    { key: 'descripcion' as const, label: 'Descripción', sortable: true },
    { key: 'numeroDenuncia' as const, label: 'N° Denuncia', sortable: true },
    { 
      key: 'tipoDenuncia' as const, 
      label: 'Tipo', 
      sortable: true,
      render: (row: NotificacionDenuncia) => (
        <Badge variant={row.tipoDenuncia === 'Infraccional' ? 'info' : 'danger'}>
          {row.tipoDenuncia}
        </Badge>
      ),
    },
    { 
      key: 'origen' as const, 
      label: 'Origen', 
      sortable: true,
      render: () => (
        <Badge variant="default">
          Manual
        </Badge>
      ),
    },
    { key: 'fechaGeneracion' as const, label: 'Fecha', sortable: true },
  ];

  // Columnas para Reclamos
  const columnsReclamos = [
    { key: 'numeroNotificacion' as const, label: 'Número de Notificación', sortable: true },
    { key: 'descripcion' as const, label: 'Descripción de la notificación', sortable: true },
    { key: 'numeroReclamo' as const, label: 'Número de Reclamo', sortable: true },
    { 
      key: 'tipoReclamo' as const, 
      label: 'Tipo de Reclamo', 
      sortable: true,
      render: (row: NotificacionReclamo) => (
        <Badge variant="info">
          {row.tipoReclamo}
        </Badge>
      ),
    },
    { key: 'fechaGeneracion' as const, label: 'Fecha de generación', sortable: true },
  ];

  // Columnas para Cargos
  const columnsCargos = [
    { key: 'numeroNotificacion' as const, label: 'Número de Notificación', sortable: true },
    { key: 'descripcion' as const, label: 'Descripción de la notificación', sortable: true },
    { key: 'numeroCargo' as const, label: 'Número de Cargo', sortable: true },
    { key: 'fechaGeneracion' as const, label: 'Fecha de generación', sortable: true },
  ];

  // Acciones para cada tipo - Navegar a gestionar denuncia
  const handleGestionar = (
    tipo: TabType,
    row: NotificacionDenuncia | NotificacionReclamo | NotificacionCargo
  ) => {
    switch (tipo) {
      case 'denuncias':
        // Ir a "Crear Denuncia" con datos precargados (desde hallazgo asociado a la notificación)
        {
          const denuncia = row as NotificacionDenuncia;
          const hallazgoId = denuncia.hallazgoId;
          const numeroHallazgo =
            denuncia.numeroHallazgo ||
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

  const getActions = (tipo: TabType) => {
    return (row: NotificacionDenuncia | NotificacionReclamo | NotificacionCargo) => (
      <div className="flex justify-center items-center w-full">
        <CustomButton
          variant="primary"
          className="text-xs"
          onClick={() => {
            handleGestionar(tipo, row);
          }}
        >
          Gestionar Denuncia
        </CustomButton>
      </div>
    );
  };

  // Función para obtener el contenido de cada tab dinámicamente
  const getTabContent = (tabId: TabType) => {
    const tabData = tabId === 'denuncias' ? denunciasData :
                    tabId === 'reclamos' ? reclamosData :
                    cargosData;
    
    const columns = tabId === 'denuncias' ? columnsDenuncias :
                   tabId === 'reclamos' ? columnsReclamos :
                   columnsCargos;

    const emptyMessages = {
      denuncias: { title: 'No hay notificaciones de denuncias', description: 'No se encontraron notificaciones que coincidan con los filtros aplicados.' },
      reclamos: { title: 'No hay notificaciones de reclamos', description: 'No se encontraron notificaciones que coincidan con los filtros aplicados.' },
      cargos: { title: 'No hay notificaciones de cargos', description: 'No se encontraron notificaciones que coincidan con los filtros aplicados.' },
    };

    return (
      <div>
        <Table
          headers={columns as any}
          data={tabData.paginated as any}
          actions={getActions(tabId)}
          emptyState={emptyMessages[tabId]}
        />
        {tabData.totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={tabData.totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={tabData.filtered.length}
          />
        )}
      </div>
    );
  };

  // Recalcular tabs cuando cambian los datos o el tab activo - Sin Hallazgos
  const tabs = useMemo(() => [
    {
      id: 'denuncias',
      label: 'Denuncias',
      badge: conteoNotificaciones.denuncias.noLeidas,
      badgeVariant: 'danger' as const,
      content: getTabContent('denuncias'),
    },
    {
      id: 'cargos',
      label: 'Cargos',
      badge: conteoNotificaciones.cargos.noLeidas,
      badgeVariant: 'danger' as const,
      content: getTabContent('cargos'),
    },
    {
      id: 'reclamos',
      label: 'Reclamos',
      badge: conteoNotificaciones.reclamos.noLeidas,
      badgeVariant: 'danger' as const,
      content: getTabContent('reclamos'),
    },
  ], [activeTab, currentPage, searchTerm, fechaDesde, fechaHasta, estadoFiltro, denunciasData, reclamosData, cargosData]);

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
      <div className="min-h-full space-y-5 animate-fade-in pb-8">
        {/* Header de la sección - más limpio y con mejor jerarquía */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2">
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
            <p className="text-gray-500 mt-1">
              Gestión y seguimiento de notificaciones del sistema aduanero
            </p>
          </div>
        </div>

        {/* Estadísticas compactas */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700">
            Total: <strong>{conteoNotificaciones.totalGeneral}</strong>
          </span>
          <span className="px-3 py-2 rounded-lg bg-red-50 text-red-700 border border-red-200">
            Sin leer: <strong>{conteoNotificaciones.totalNoLeidas}</strong>
          </span>
          <span className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
            Denuncias: <strong>{conteoNotificaciones.denuncias.total}</strong>
          </span>
          <span className="px-3 py-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
            Reclamos: <strong>{conteoNotificaciones.reclamos.total}</strong>
          </span>
          <span className="px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            Cargos: <strong>{conteoNotificaciones.cargos.total}</strong>
          </span>
        </div>

        {/* Card principal */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header azul */}
          <div className="bg-aduana-azul py-3 px-6 flex items-center justify-between">
            <span className="text-white font-medium flex items-center gap-2">
              <Icon name="Bell" size={18} />
              Gestión de Notificaciones
            </span>
            <span className="text-white/80 text-sm">
              {conteoNotificaciones.totalGeneral} notificaciones totales
            </span>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-white border-b border-gray-100">
            <div>
              <label className="block text-sm font-semibold text-black mb-1">
                Buscar
              </label>
              <CustomInput
                type="text"
                placeholder="Número o texto"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-1">
                Fecha desde
              </label>
              <CustomInput
                type="date"
                value={fechaDesde}
                onChange={(e) => {
                  setFechaDesde(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-1">
                Fecha hasta
              </label>
              <CustomInput
                type="date"
                value={fechaHasta}
                onChange={(e) => {
                  setFechaHasta(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-1">
                Estado (opcional)
              </label>
              <select
                value={estadoFiltro}
                onChange={(e) => {
                  setEstadoFiltro(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-aduana-azul-200 focus:border-aduana-azul"
              >
                <option value="">Todos</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Vencido">Vencido</option>
                <option value="Actualizado">Actualizado</option>
                <option value="En gestión">En gestión</option>
              </select>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex flex-col md:flex-row justify-between items-center px-5 py-3 gap-3 bg-white border-b border-gray-100">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="bg-aduana-azul/10 text-aduana-azul px-2.5 py-1 rounded-full text-xs font-medium">
                {activeTab === 'denuncias' ? conteoNotificaciones.denuncias.total :
                 activeTab === 'reclamos' ? conteoNotificaciones.reclamos.total :
                 conteoNotificaciones.cargos.total} registros
              </span>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <CustomButton
                variant="secondary"
                className="flex items-center gap-1.5 !bg-transparent !border-0 hover:!bg-gray-100"
                onClick={() => {
                  setSearchTerm('');
                  setFechaDesde('');
                  setFechaHasta('');
                  setEstadoFiltro('');
                  setCurrentPage(1);
                }}
              >
                <Icon name="X" size={14} />
                Limpiar
              </CustomButton>
            </div>
          </div>

          {/* Tabs */}
          <div className="p-4">
            <Tabs
              tabs={tabs}
              defaultTab={activeTab}
              onChange={handleTabChange}
              variant="underline"
            />
          </div>
        </section>
      </div>
    </CustomLayout>
  );
};

export default NotificacionesList;
