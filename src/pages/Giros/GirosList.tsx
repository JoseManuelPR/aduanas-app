import { useNavigate } from 'react-router-dom';
import { Icon } from "he-button-custom-library";
import CONSTANTS_APP from "../../constants/sidebar-menu";
import CustomLayout from "../../Layout/Layout";
import InputField from "../../organisms/InputField/InputField";
import { CustomButton } from "../../components/Button/Button";
import { Table } from "../../components/Table/Table";
import { Badge, StatCard } from "../../components/UI";
import { ERoutePaths } from "../../routes/routes";

// Datos centralizados
import {
  giros,
  getConteoGiros,
  getTodasLasNotificaciones,
  usuarioActual,
  type Giro,
} from '../../data';

export const GirosList: React.FC = () => {
  const navigate = useNavigate();

  // Obtener conteos desde datos centralizados
  const conteoGiros = getConteoGiros();
  const allNotifications = getTodasLasNotificaciones();

  const handleActions = (row: Giro) => (
    <div className="flex flex-col w-full gap-1">
      <CustomButton 
        variant="primary" 
        className="w-full text-xs"
        onClick={() => navigate(`/giros/${row.id}`)}
      >
        <Icon name="Eye" className="hidden md:block" size={14} />
        Ver Detalle
      </CustomButton>
      {row.estado === 'Emitido' && (
        <CustomButton 
          variant="secondary" 
          className="w-full text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Icon name="CreditCard" className="hidden md:block" size={14} />
          Registrar Pago
        </CustomButton>
      )}
    </div>
  );

  // Columnas para la tabla
  const columnasGiros = [
    { key: 'numeroGiro' as const, label: 'N° Giro', sortable: true },
    { 
      key: 'tipoGiro' as const, 
      label: 'Tipo', 
      sortable: true,
      render: (row: Giro) => (
        <Badge variant={row.tipoGiro === 'F09' ? 'info' : row.tipoGiro === 'F16' ? 'warning' : 'proceso'}>
          {row.tipoGiro}
        </Badge>
      )
    },
    { key: 'fechaEmision' as const, label: 'Fecha Emisión', sortable: true },
    { key: 'fechaVencimiento' as const, label: 'Vencimiento', sortable: true },
    { 
      key: 'estado' as const, 
      label: 'Estado', 
      sortable: true,
      render: (row: Giro) => {
        const variant = row.estado === 'Pagado' ? 'resuelto' : 
                       row.estado === 'Vencido' ? 'vencido' : 
                       row.estado === 'Anulado' ? 'rechazado' : 'proceso';
        return (
          <Badge variant={variant} dot pulse={row.estado === 'Vencido'}>
            {row.estado}
          </Badge>
        );
      }
    },
    { 
      key: 'montoTotal' as const, 
      label: 'Monto', 
      sortable: true,
      render: (row: Giro) => (
        <span className="font-semibold text-aduana-azul">{row.montoTotal}</span>
      )
    },
    { key: 'emitidoA' as const, label: 'Emitido A', sortable: true },
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
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Giros</h1>
            </div>
            <p className="text-gray-600 mt-1 ml-7">
              Emisión y seguimiento de giros de pago (F09/F16/F17)
            </p>
          </div>
          <CustomButton 
            className="btn-primary flex items-center gap-2"
            onClick={() => navigate(ERoutePaths.GIROS_NUEVO)}
          >
            <Icon name="Plus" size={18} />
            Emitir Giro
          </CustomButton>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Giros"
            value={conteoGiros.total}
            subtitle="Este período"
            colorScheme="azul"
            icon={<Icon name="Receipt" size={24} />}
          />
          <StatCard
            title="Giros Pagados"
            value={conteoGiros.pagados}
            subtitle="Recaudación exitosa"
            colorScheme="verde"
            icon={<Icon name="CheckCircle" size={24} />}
          />
          <StatCard
            title="Giros Vencidos"
            value={conteoGiros.vencidos}
            subtitle="Requieren gestión"
            colorScheme="rojo"
            icon={<Icon name="AlertCircle" size={24} />}
          />
          <StatCard
            title="Monto Recaudado"
            value={conteoGiros.montoRecaudadoFormateado}
            subtitle="Total histórico"
            colorScheme="verde"
            icon={<Icon name="TrendingUp" size={24} />}
          />
        </div>

        {/* Card principal */}
        <section className="card overflow-hidden">
          {/* Header */}
          <div className="bg-aduana-azul py-3 px-6 flex items-center justify-between">
            <span className="text-white font-medium flex items-center gap-2">
              <Icon name="Receipt" size={18} />
              Registro de Giros
            </span>
            <div className="flex items-center gap-4">
              <span className="text-white/80 text-sm flex items-center gap-2">
                <span className="bg-blue-500 px-2 py-0.5 rounded text-xs">F09</span> Desde Cargo
              </span>
              <span className="text-white/80 text-sm flex items-center gap-2">
                <span className="bg-amber-500 px-2 py-0.5 rounded text-xs">F16</span> Desde Denuncia
              </span>
              <span className="text-white/80 text-sm flex items-center gap-2">
                <span className="bg-purple-500 px-2 py-0.5 rounded text-xs">F17</span> Otros
              </span>
            </div>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-gray-50 border-b border-gray-200">
            <InputField
              label="N° Giro"
              id="nroGiro"
              type="text"
              placeholder="F09-2024-XXXXX"
            />
            <InputField
              label="Tipo"
              id="tipoGiro"
              type="text"
              placeholder="F09 / F16 / F17"
            />
            <InputField
              label="Estado"
              id="estado"
              type="text"
              placeholder="Seleccione estado"
            />
            <InputField
              label="Fecha emisión"
              id="fechaEmision"
              type="date"
              icon={<Icon name="CalendarDays" size={18} color="#6B7280" />}
            />
          </div>

          {/* Acciones */}
          <div className="flex flex-col md:flex-row justify-end items-center px-5 py-3 gap-3 border-b border-gray-200">
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
              headers={columnasGiros}
              data={giros}
              actions={handleActions}
            />
          </div>
        </section>
      </div>
    </CustomLayout>
  );
};

export default GirosList;
