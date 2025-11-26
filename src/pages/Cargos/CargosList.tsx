import { useNavigate } from 'react-router-dom';
import { Icon } from "he-button-custom-library";
import CONSTANTS_APP from "../../constants/sidebar-menu";
import CustomLayout from "../../Layout/Layout";
import InputField from "../../organisms/InputField/InputField";
import { CustomButton } from "../../components/Button/Button";
import { Table } from "../../components/Table/Table";
import { Badge, getEstadoBadgeVariant, getDiasVencimientoBadgeVariant } from "../../components/UI";
import { ERoutePaths } from "../../routes/routes";

// Datos centralizados
import {
  cargos,
  getConteoCargos,
  formatMonto,
  getTodasLasNotificaciones,
  usuarioActual,
  type Cargo,
} from '../../data';

export const CargosList: React.FC = () => {
  const navigate = useNavigate();

  // Obtener conteos desde datos centralizados
  const conteoCargos = getConteoCargos();
  const allNotifications = getTodasLasNotificaciones();

  const handleActions = (row: Cargo) => (
    <div className="flex flex-col w-full gap-1">
      <CustomButton 
        variant="primary" 
        className="w-full text-xs"
        onClick={() => navigate(`/expediente/${row.id}`)}
      >
        <Icon name="FileText" className="hidden md:block" size={14} />
        Expediente
      </CustomButton>
      <CustomButton 
        variant="secondary" 
        className="w-full text-xs"
        onClick={() => navigate(`/cargos/${row.id}`)}
      >
        <Icon name="Eye" className="hidden md:block" size={14} />
        Ver Detalle
      </CustomButton>
    </div>
  );

  // Columnas para la tabla
  const columnasCargos = [
    { key: 'numeroCargo' as const, label: 'N° Cargo', sortable: true },
    { key: 'fechaIngreso' as const, label: 'Fecha Ingreso', sortable: true },
    { 
      key: 'estado' as const, 
      label: 'Estado', 
      sortable: true,
      render: (row: Cargo) => (
        <Badge variant={getEstadoBadgeVariant(row.estado)} dot>
          {row.estado}
        </Badge>
      )
    },
    { key: 'aduana' as const, label: 'Aduana', sortable: true },
    { key: 'rutDeudor' as const, label: 'RUT Deudor', sortable: true },
    { key: 'nombreDeudor' as const, label: 'Nombre Deudor', sortable: true },
    { 
      key: 'montoTotal' as const, 
      label: 'Monto Total', 
      sortable: true,
      render: (row: Cargo) => (
        <span className="font-semibold text-aduana-azul">{row.montoTotal}</span>
      )
    },
    { 
      key: 'diasVencimiento' as const, 
      label: 'Días Plazo', 
      sortable: true,
      render: (row: Cargo) => {
        const dias = row.diasVencimiento;
        const variant = getDiasVencimientoBadgeVariant(dias);
        return (
          <Badge variant={variant} pulse={dias < 0}>
            {dias < 0 ? `${Math.abs(dias)}d vencido` : dias === 0 ? 'Hoy' : `${dias} días`}
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
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Cargos</h1>
            </div>
            <p className="text-gray-600 mt-1 ml-7">
              Registro y seguimiento de cargos administrativos
            </p>
          </div>
          <CustomButton 
            className="btn-primary flex items-center gap-2"
            onClick={() => navigate(ERoutePaths.CARGOS_NUEVO)}
          >
            <Icon name="Plus" size={18} />
            Nuevo Cargo
          </CustomButton>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-4 border-l-4 border-l-amber-500">
            <p className="text-sm text-gray-600">Pendientes Aprobación</p>
            <p className="text-2xl font-bold text-amber-600">{conteoCargos.pendientes}</p>
          </div>
          <div className="card p-4 border-l-4 border-l-emerald-500">
            <p className="text-sm text-gray-600">Aprobados</p>
            <p className="text-2xl font-bold text-emerald-600">{conteoCargos.aprobados}</p>
          </div>
          <div className="card p-4 border-l-4 border-l-red-500">
            <p className="text-sm text-gray-600">Rechazados</p>
            <p className="text-2xl font-bold text-red-600">{conteoCargos.rechazados}</p>
          </div>
          <div className="card p-4 border-l-4 border-l-aduana-azul">
            <p className="text-sm text-gray-600">Monto Total</p>
            <p className="text-xl font-bold text-aduana-azul">{formatMonto(conteoCargos.montoTotal)}</p>
          </div>
        </div>

        {/* Card principal */}
        <section className="card overflow-hidden">
          {/* Header */}
          <div className="bg-aduana-azul py-3 px-6 flex items-center justify-between">
            <span className="text-white font-medium flex items-center gap-2">
              <Icon name="DollarSign" size={18} />
              Búsqueda de Cargos
            </span>
            <span className="text-white/80 text-sm">
              {cargos.length} registros encontrados
            </span>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5 bg-gray-50 border-b border-gray-200">
            <InputField
              label="N° Cargo"
              id="nroCargo"
              type="text"
              placeholder="CAR-2024-XXXXX"
            />
            <InputField
              label="RUT Deudor"
              id="rutDeudor"
              type="text"
              placeholder="12.345.678-9"
            />
            <InputField
              label="Estado"
              id="estado"
              type="text"
              placeholder="Seleccione estado"
            />
            <InputField
              label="Aduana"
              id="aduana"
              type="text"
              placeholder="Seleccione aduana"
            />
            <InputField
              label="Fecha desde"
              id="fechaDesde"
              type="date"
              icon={<Icon name="CalendarDays" size={18} color="#6B7280" />}
            />
            <InputField
              label="Fecha hasta"
              id="fechaHasta"
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
              Exportar Excel
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
              headers={columnasCargos}
              data={cargos}
              actions={handleActions}
            />
          </div>
        </section>
      </div>
    </CustomLayout>
  );
};

export default CargosList;
