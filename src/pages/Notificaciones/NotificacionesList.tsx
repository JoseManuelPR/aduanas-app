import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  notificacionesHallazgos,
  notificacionesDenuncias,
  notificacionesReclamos,
  notificacionesCargos,
  getTodasLasNotificaciones,
  getConteoNotificaciones,
  usuarioActual,
  getHallazgoPorNumero,
} from '../../data';

import type { 
  NotificacionHallazgo, 
  NotificacionDenuncia, 
  NotificacionReclamo, 
  NotificacionCargo 
} from '../../data';

// Sidebar menu (solo para el menú del sidebar)
import CONSTANTS_APP from '../../constants/sidebar-menu';

type TabType = 'hallazgos' | 'denuncias' | 'reclamos' | 'cargos';

export const NotificacionesList: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('hallazgos');
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
        (('numeroHallazgo' in item && String(item.numeroHallazgo).toLowerCase().includes(searchTerm.toLowerCase())) ||
         ('numeroDenuncia' in item && String(item.numeroDenuncia).toLowerCase().includes(searchTerm.toLowerCase())) ||
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
  const hallazgosData = useMemo(() => 
    getFilteredAndPaginatedData(notificacionesHallazgos),
    [searchTerm, fechaDesde, fechaHasta, estadoFiltro, currentPage]
  );

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

  // Columnas para Hallazgos
  const columnsHallazgos = [
    { key: 'numeroNotificacion' as const, label: 'Número de Notificación', sortable: true },
    { key: 'descripcion' as const, label: 'Descripción de la notificación', sortable: true },
    { key: 'numeroHallazgo' as const, label: 'Número de Hallazgo', sortable: true },
    { key: 'fechaGeneracion' as const, label: 'Fecha de generación', sortable: true },
    { 
      key: 'tipoHallazgo' as const, 
      label: 'Tipo de Hallazgo', 
      sortable: true,
      render: (row: NotificacionHallazgo) => (
        <Badge variant={row.tipoHallazgo === 'Infraccional' ? 'info' : 'danger'}>
          {row.tipoHallazgo}
        </Badge>
      ),
    },
  ];

  // Columnas para Denuncias
  const columnsDenuncias = [
    { key: 'numeroNotificacion' as const, label: 'Número de Notificación', sortable: true },
    { key: 'descripcion' as const, label: 'Descripción de la notificación', sortable: true },
    { key: 'numeroDenuncia' as const, label: 'Número de Denuncia', sortable: true },
    { 
      key: 'tipoDenuncia' as const, 
      label: 'Tipo de Denuncia', 
      sortable: true,
      render: (row: NotificacionDenuncia) => (
        <Badge variant={row.tipoDenuncia === 'Infraccional' ? 'info' : 'danger'}>
          {row.tipoDenuncia}
        </Badge>
      ),
    },
    { key: 'fechaGeneracion' as const, label: 'Fecha de generación', sortable: true },
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

  // Acciones para cada tipo
  const handleGestionar = (tipo: TabType, referencia: string) => {
    switch (tipo) {
      case 'hallazgos':
        // Buscar el hallazgo por su número (ej: PFI-123) y navegar a gestionar denuncia
        const hallazgo = getHallazgoPorNumero(referencia);
        if (hallazgo) {
          navigate(`/hallazgos/${hallazgo.id}/gestionar`);
        } else {
          // Fallback: navegar a la lista de hallazgos
          navigate(ERoutePaths.HALLAZGOS);
        }
        break;
      case 'denuncias':
        navigate(ERoutePaths.DENUNCIAS);
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
    return (row: NotificacionHallazgo | NotificacionDenuncia | NotificacionReclamo | NotificacionCargo) => (
      <div className="flex justify-center items-center w-full">
        <CustomButton
          variant="primary"
          className="text-xs"
          onClick={() => {
            const referencia = 
              'numeroHallazgo' in row ? row.numeroHallazgo :
              'numeroDenuncia' in row ? row.numeroDenuncia :
              'numeroReclamo' in row ? row.numeroReclamo :
              'numeroCargo' in row ? row.numeroCargo : '';
            handleGestionar(tipo, referencia);
          }}
        >
          Gestionar
        </CustomButton>
      </div>
    );
  };

  // Función para obtener el contenido de cada tab dinámicamente
  const getTabContent = (tabId: TabType) => {
    const tabData = tabId === 'hallazgos' ? hallazgosData :
                    tabId === 'denuncias' ? denunciasData :
                    tabId === 'reclamos' ? reclamosData :
                    cargosData;
    
    const columns = tabId === 'hallazgos' ? columnsHallazgos :
                   tabId === 'denuncias' ? columnsDenuncias :
                   tabId === 'reclamos' ? columnsReclamos :
                   columnsCargos;

    const emptyMessages = {
      hallazgos: { title: 'No hay notificaciones de hallazgos', description: 'No se encontraron notificaciones que coincidan con los filtros aplicados.' },
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

  // Recalcular tabs cuando cambian los datos o el tab activo
  const tabs = useMemo(() => [
    {
      id: 'hallazgos',
      label: 'Hallazgos',
      badge: conteoNotificaciones.hallazgos.noLeidas,
      badgeVariant: 'danger' as const,
      content: getTabContent('hallazgos'),
    },
    {
      id: 'denuncias',
      label: 'Denuncias',
      badge: conteoNotificaciones.denuncias.noLeidas,
      badgeVariant: 'danger' as const,
      content: getTabContent('denuncias'),
    },
    {
      id: 'reclamos',
      label: 'Reclamos',
      badge: conteoNotificaciones.reclamos.noLeidas,
      badgeVariant: 'danger' as const,
      content: getTabContent('reclamos'),
    },
    {
      id: 'cargos',
      label: 'Cargos',
      badge: conteoNotificaciones.cargos.noLeidas,
      badgeVariant: 'danger' as const,
      content: getTabContent('cargos'),
    },
  ], [activeTab, currentPage, searchTerm, fechaDesde, fechaHasta, estadoFiltro, hallazgosData, denunciasData, reclamosData, cargosData]);

  return (
    <CustomLayout
      platformName="DECARE"
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
      <div className="min-h-full space-y-4 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
            <p className="text-sm text-gray-500 mt-1">
              Total: {conteoNotificaciones.totalGeneral} notificaciones | 
              Sin leer: {conteoNotificaciones.totalNoLeidas}
            </p>
          </div>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="card p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
        </div>

        {/* Tabs */}
        <Tabs
          tabs={tabs}
          defaultTab={activeTab}
          onChange={handleTabChange}
          variant="underline"
        />
      </div>
    </CustomLayout>
  );
};

export default NotificacionesList;
