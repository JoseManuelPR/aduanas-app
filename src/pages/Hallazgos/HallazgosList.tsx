import { useState } from 'react';
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
  hallazgos,
  getConteoHallazgos,
  getTodasLasNotificaciones,
  usuarioActual,
  type Hallazgo,
  type EstadoHallazgo,
} from '../../data';

// Mapeo de variantes para estados de hallazgo
const getEstadoHallazgoBadgeVariant = (estado: EstadoHallazgo): "default" | "success" | "warning" | "error" | "info" => {
  switch (estado) {
    case 'Ingresado':
      return 'info';
    case 'En Análisis':
      return 'warning';
    case 'Notificar Denuncia':
      return 'error';
    case 'Derivado':
      return 'default';
    case 'Cerrado':
      return 'success';
    case 'Convertido a Denuncia':
      return 'success';
    default:
      return 'default';
  }
};

export const HallazgosList: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Obtener conteos desde datos centralizados
  const conteoHallazgos = getConteoHallazgos();
  const allNotifications = getTodasLasNotificaciones();

  // Verificar si el hallazgo puede ser gestionado (convertido a denuncia)
  const puedeGestionar = (estado: EstadoHallazgo): boolean => {
    return ['Ingresado', 'En Análisis', 'Notificar Denuncia'].includes(estado);
  };

  const handleActions = (row: Hallazgo) => (
    <div className="flex flex-col w-full gap-1">
      {puedeGestionar(row.estado) ? (
        <CustomButton 
          variant="primary" 
          className="w-full text-xs bg-emerald-600 hover:bg-emerald-700"
          onClick={() => navigate(`/hallazgos/${row.id}/gestionar`)}
        >
          <Icon name="FileCheck" className="hidden md:block" size={14} />
          Gestionar
        </CustomButton>
      ) : (
        <CustomButton 
          variant="secondary" 
          className="w-full text-xs"
          disabled={row.estado === 'Cerrado' || row.estado === 'Convertido a Denuncia'}
          onClick={() => navigate(`/expediente/${row.id}`)}
        >
          <Icon name="FileText" className="hidden md:block" size={14} />
          Ver Expediente
        </CustomButton>
      )}
      <CustomButton 
        variant="secondary" 
        className="w-full text-xs"
        onClick={() => {/* Ver detalle del hallazgo */}}
      >
        <Icon name="Eye" className="hidden md:block" size={14} />
        Ver Detalle
      </CustomButton>
    </div>
  );

  // Columnas para la tabla de hallazgos
  const columnasHallazgos = [
    { key: 'numeroHallazgo' as const, label: 'N° Hallazgo', sortable: true },
    { key: 'fechaIngreso' as const, label: 'Fecha Ingreso', sortable: true },
    { 
      key: 'estado' as const, 
      label: 'Estado', 
      sortable: true,
      render: (row: Hallazgo) => (
        <Badge variant={getEstadoHallazgoBadgeVariant(row.estado)} dot>
          {row.estado}
        </Badge>
      )
    },
    { 
      key: 'tipoHallazgo' as const, 
      label: 'Tipo', 
      sortable: true,
      render: (row: Hallazgo) => (
        <Badge variant={row.tipoHallazgo === 'Penal' ? 'error' : 'info'}>
          {row.tipoHallazgo}
        </Badge>
      )
    },
    { key: 'aduana' as const, label: 'Aduana', sortable: true },
    { key: 'rutInvolucrado' as const, label: 'RUT Involucrado', sortable: true },
    { key: 'nombreInvolucrado' as const, label: 'Nombre Involucrado', sortable: true },
    { key: 'montoEstimado' as const, label: 'Monto Estimado', sortable: true },
    { 
      key: 'diasVencimiento' as const, 
      label: 'Días Plazo', 
      sortable: true,
      render: (row: Hallazgo) => {
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

  // Filtros de hallazgos
  const filtrosHallazgos = [
    { id: "numeroHallazgo", label: "N° Hallazgo", type: "text" as const, placeholder: "PFI-XXX", labelClassName: "text-xs font-medium text-gray-700" },
    { id: "fechaDesde", label: "Fecha Desde", type: "date" as const, labelClassName: "text-xs font-medium text-gray-700", icon: "CalendarDays" },
    { id: "fechaHasta", label: "Fecha Hasta", type: "date" as const, labelClassName: "text-xs font-medium text-gray-700", icon: "CalendarDays" },
    { id: "estado", label: "Estado", type: "text" as const, placeholder: "Todos los estados", labelClassName: "text-xs font-medium text-gray-700" },
    { id: "tipoHallazgo", label: "Tipo", type: "text" as const, placeholder: "Todos los tipos", labelClassName: "text-xs font-medium text-gray-700" },
    { id: "rutInvolucrado", label: "RUT Involucrado", type: "text" as const, placeholder: "12.345.678-9", labelClassName: "text-xs font-medium text-gray-700" },
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
        {/* Header de la sección */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigate(ERoutePaths.DASHBOARD)}
                className="text-gray-500 hover:text-aduana-azul transition-colors"
              >
                <Icon name="ArrowLeft" size={20} />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Listado de Hallazgos (PFI)</h1>
            </div>
            <p className="text-gray-600 mt-1 ml-7">
              Gestión y seguimiento de hallazgos de fiscalización
            </p>
          </div>
        </div>

        {/* Alerta informativa */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Icon name="Info" size={20} className="text-amber-600 mt-0.5" />
            <div>
              <p className="font-medium text-amber-900">Proceso de Gestión de Hallazgos</p>
              <p className="text-sm text-amber-700 mt-1">
                Los hallazgos en estado <strong>"Notificar Denuncia"</strong>, <strong>"En Análisis"</strong> o <strong>"Ingresado"</strong> pueden 
                ser gestionados para convertirse en denuncias formales. Haga clic en <strong>"Gestionar"</strong> para 
                revisar y completar el formulario de denuncia con los datos pre-rellenados del hallazgo.
              </p>
            </div>
          </div>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="card p-4 border-l-4 border-l-blue-500">
            <p className="text-sm text-gray-600">Ingresados</p>
            <p className="text-2xl font-bold text-blue-600">
              {conteoHallazgos.porEstado.ingresado}
            </p>
          </div>
          <div className="card p-4 border-l-4 border-l-amber-500">
            <p className="text-sm text-gray-600">En Análisis</p>
            <p className="text-2xl font-bold text-amber-600">
              {conteoHallazgos.porEstado.enAnalisis}
            </p>
          </div>
          <div className="card p-4 border-l-4 border-l-red-500">
            <p className="text-sm text-gray-600">Por Notificar</p>
            <p className="text-2xl font-bold text-red-600">
              {conteoHallazgos.porEstado.notificarDenuncia}
            </p>
          </div>
          <div className="card p-4 border-l-4 border-l-emerald-500">
            <p className="text-sm text-gray-600">Gestionables</p>
            <p className="text-2xl font-bold text-emerald-600">
              {conteoHallazgos.gestionables}
            </p>
          </div>
          <div className="card p-4 border-l-4 border-l-gray-500">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">
              {conteoHallazgos.total}
            </p>
          </div>
        </div>

        {/* Card principal */}
        <section className="card overflow-hidden">
          {/* Header azul */}
          <div className="bg-aduana-azul py-3 px-6 flex items-center justify-between">
            <span className="text-white font-medium flex items-center gap-2">
              <Icon name="FileSearch" size={18} />
              Búsqueda de Hallazgos
            </span>
            <span className="text-white/80 text-sm">
              {hallazgos.length} registros encontrados
            </span>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5 bg-gray-50 border-b border-gray-200">
            {filtrosHallazgos.map((filter) => (
              <InputField
                key={filter.id}
                label={filter.label}
                id={filter.id}
                type={filter.type}
                placeholder={filter.placeholder}
                labelClassName={filter.labelClassName}
                icon={filter.icon === "CalendarDays" ? <Icon name="CalendarDays" size={18} color="#6B7280" /> : undefined}
              />
            ))}
          </div>

          {/* Acciones */}
          <div className="flex flex-col md:flex-row justify-between items-center px-5 py-3 gap-3 border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {selectedRows.length > 0 && (
                <span className="bg-aduana-azul-50 text-aduana-azul px-2 py-1 rounded">
                  {selectedRows.length} seleccionados
                </span>
              )}
            </div>
            <div className="flex flex-wrap justify-end gap-2">
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
          </div>

          {/* Tabla */}
          <div className="p-4">
            <Table
              classHeader="bg-aduana-azul text-white text-xs"
              headers={columnasHallazgos}
              data={hallazgos}
              actions={handleActions}
            />
          </div>

          {/* Paginación */}
          <div className="flex flex-col md:flex-row items-center justify-between px-5 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Mostrando 1 a {hallazgos.length} de {hallazgos.length} registros
            </p>
            <div className="flex items-center gap-2 mt-3 md:mt-0">
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50" disabled>
                Anterior
              </button>
              <button className="px-3 py-1.5 text-sm bg-aduana-azul text-white rounded-md">
                1
              </button>
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100">
                2
              </button>
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100">
                Siguiente
              </button>
            </div>
          </div>
        </section>
      </div>
    </CustomLayout>
  );
};

export default HallazgosList;

