import { useNavigate } from 'react-router-dom';
import { Icon } from "he-button-custom-library";
import CONSTANTS_APP from "../../constants/sidebar-menu";
import CustomLayout from "../../Layout/Layout";
import InputField from "../../organisms/InputField/InputField";
import { CustomButton } from "../../components/Button/Button";
import { Table } from "../../components/Table/Table";
import { Badge, StatCard, getDiasVencimientoBadgeVariant } from "../../components/UI";
import { ERoutePaths } from "../../routes/routes";

// Datos centralizados
import {
  reclamos,
  getConteoReclamos,
  getTodasLasNotificaciones,
  usuarioActual,
  type Reclamo,
} from '../../data';

export const ReclamosList: React.FC = () => {
  const navigate = useNavigate();

  // Obtener conteos desde datos centralizados
  const conteoReclamos = getConteoReclamos();
  const allNotifications = getTodasLasNotificaciones();

  const handleActions = (row: Reclamo) => (
    <div className="flex flex-col w-full gap-1">
      <CustomButton 
        variant="primary" 
        className="w-full text-xs"
        onClick={() => navigate(`/reclamos/${row.id}`)}
      >
        <Icon name="Eye" className="hidden md:block" size={14} />
        Ver Detalle
      </CustomButton>
      <CustomButton 
        variant="secondary" 
        className="w-full text-xs"
        onClick={() => navigate(`/expediente/${row.id}`)}
      >
        <Icon name="FileText" className="hidden md:block" size={14} />
        Expediente
      </CustomButton>
    </div>
  );

  // Columnas para la tabla
  const columnasReclamos = [
    { key: 'numeroReclamo' as const, label: 'N° Reclamo', sortable: true },
    { 
      key: 'tipoReclamo' as const, 
      label: 'Tipo', 
      sortable: true,
      render: (row: Reclamo) => {
        const colorMap: Record<string, 'info' | 'warning' | 'danger'> = {
          'Reposición': 'warning',
          'TTA': 'danger',
        };
        return (
          <Badge variant={colorMap[row.tipoReclamo] || 'info'}>
            {row.tipoReclamo}
          </Badge>
        );
      }
    },
    { key: 'fechaIngreso' as const, label: 'Fecha Ingreso', sortable: true },
    { 
      key: 'estado' as const, 
      label: 'Estado', 
      sortable: true,
      render: (row: Reclamo) => {
        const estadoMap: Record<string, 'pendiente' | 'proceso' | 'resuelto' | 'danger'> = {
          'Ingresado': 'pendiente',
          'En Análisis': 'proceso',
          'Pendiente Resolución': 'proceso',
          'Derivado a Tribunal': 'danger',
          'Resuelto': 'resuelto',
        };
        return (
          <Badge variant={estadoMap[row.estado] || 'info'} dot>
            {row.estado}
          </Badge>
        );
      }
    },
    { key: 'denunciaAsociada' as const, label: 'Denuncia Asociada', sortable: true },
    { key: 'reclamante' as const, label: 'Reclamante', sortable: true },
    { 
      key: 'diasRespuesta' as const, 
      label: 'Días Respuesta', 
      sortable: true,
      render: (row: Reclamo) => {
        const dias = row.diasRespuesta;
        const variant = getDiasVencimientoBadgeVariant(dias);
        return (
          <Badge variant={variant}>
            {dias === 0 ? 'Derivado' : `${dias} días`}
          </Badge>
        );
      }
    },
  ];

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
            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigate(ERoutePaths.DASHBOARD)}
                className="text-gray-500 hover:text-aduana-azul transition-colors"
              >
                <Icon name="ArrowLeft" size={20} />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Reclamos</h1>
            </div>
            <p className="text-gray-600 mt-1 ml-7">
              Reclamos Reposición y Tribunal Tributario Aduanero
            </p>
          </div>
          <CustomButton 
            className="btn-primary flex items-center gap-2"
            onClick={() => navigate(ERoutePaths.RECLAMOS_NUEVO)}
          >
            <Icon name="Plus" size={18} />
            Nuevo Reclamo
          </CustomButton>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Reclamos"
            value={conteoReclamos.total}
            subtitle="Este período"
            colorScheme="azul"
            icon={<Icon name="MessageCircle" size={24} />}
          />
          <StatCard
            title="En Análisis"
            value={conteoReclamos.enAnalisis}
            subtitle="Pendientes resolución"
            colorScheme="amarillo"
            icon={<Icon name="Clock" size={24} />}
          />
          <StatCard
            title="Resueltos"
            value={conteoReclamos.resueltos}
            subtitle="Finalizados"
            colorScheme="verde"
            icon={<Icon name="CheckCircle" size={24} />}
          />
          <StatCard
            title="Derivados TTA"
            value={conteoReclamos.derivadosTTA}
            subtitle="Tribunal Tributario"
            colorScheme="rojo"
            icon={<Icon name="Scale" size={24} />}
          />
        </div>

        {/* Info sobre tipos de reclamo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-4 border-l-4 border-l-amber-500">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Badge variant="warning">Reposición</Badge>
            </h4>
            <p className="text-sm text-gray-600 mt-2">
              Recurso de reposición ante la misma autoridad. Plazo: 5 días hábiles.
            </p>
          </div>
          <div className="card p-4 border-l-4 border-l-red-500">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Badge variant="danger">TTA</Badge>
            </h4>
            <p className="text-sm text-gray-600 mt-2">
              Tribunal Tributario y Aduanero. Instancia judicial de revisión.
            </p>
          </div>
        </div>

        {/* Card principal */}
        <section className="card overflow-hidden">
          {/* Header */}
          <div className="bg-aduana-azul py-3 px-6 flex items-center justify-between">
            <span className="text-white font-medium flex items-center gap-2">
              <Icon name="MessageSquare" size={18} />
              Búsqueda de Reclamos
            </span>
            <span className="text-white/80 text-sm">
              Tiempo promedio respuesta: {conteoReclamos.tiempoPromedioRespuesta} días
            </span>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5 bg-gray-50 border-b border-gray-200">
            <InputField
              label="N° Reclamo"
              id="nroReclamo"
              type="text"
              placeholder="REC-XXX-2024-XXXX"
            />
            <InputField
              label="Tipo de Reclamo"
              id="tipoReclamo"
              type="text"
              placeholder="Reposición / TTA"
            />
            <InputField
              label="Estado"
              id="estado"
              type="text"
              placeholder="Seleccione estado"
            />
            <InputField
              label="Denuncia Asociada"
              id="denunciaAsociada"
              type="text"
              placeholder="Ej: 993519"
            />
            <InputField
              label="Reclamante"
              id="reclamante"
              type="text"
              placeholder="Nombre o RUT"
            />
            <InputField
              label="Fecha ingreso"
              id="fechaIngreso"
              type="date"
              icon={<Icon name="CalendarDays" size={18} color="#6B7280" />}
            />
          </div>

          {/* Acciones */}
          <div className="flex flex-col md:flex-row justify-end items-center px-5 py-3 gap-3 border-b border-gray-200">
            <CustomButton variant="secondary" className="flex items-center gap-1 text-sm">
              <Icon name="Eraser" size={16} />
              Limpiar
            </CustomButton>
            <CustomButton variant="secondary" className="flex items-center gap-1 text-sm">
              <Icon name="FileDown" size={16} />
              Exportar
            </CustomButton>
            <CustomButton variant="primary" className="flex items-center gap-1 text-sm">
              <Icon name="Search" size={16} />
              Buscar
            </CustomButton>
          </div>

          {/* Tabla */}
          <div className="p-4">
            <Table
              classHeader="bg-aduana-azul text-white text-xs"
              headers={columnasReclamos}
              data={reclamos}
              actions={handleActions}
            />
          </div>
        </section>
      </div>
    </CustomLayout>
  );
};

export default ReclamosList;
