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
  denuncias,
  getConteoDenuncias,
  getTodasLasNotificaciones,
  usuarioActual,
  type Denuncia,
} from '../../data';

export const DenunciasList: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Obtener conteos desde datos centralizados
  const conteoDenuncias = getConteoDenuncias();
  const allNotifications = getTodasLasNotificaciones();

  const handleActions = (row: Denuncia) => (
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
        onClick={() => navigate(`/denuncias/${row.id}`)}
      >
        <Icon name="Eye" className="hidden md:block" size={14} />
        Ver Detalle
      </CustomButton>
    </div>
  );

  // Columnas para la tabla de denuncias
  const columnasDenuncias = [
    { key: 'numeroDenuncia' as const, label: 'N° Denuncia', sortable: true },
    { key: 'fechaIngreso' as const, label: 'Fecha Ingreso', sortable: true },
    { 
      key: 'estado' as const, 
      label: 'Estado', 
      sortable: true,
      render: (row: Denuncia) => (
        <Badge variant={getEstadoBadgeVariant(row.estado)} dot>
          {row.estado}
        </Badge>
      )
    },
    { key: 'aduana' as const, label: 'Aduana', sortable: true },
    { key: 'rutDeudor' as const, label: 'RUT Deudor', sortable: true },
    { key: 'nombreDeudor' as const, label: 'Nombre Deudor', sortable: true },
    { key: 'tipoInfraccion' as const, label: 'Tipo Infracción', sortable: true },
    { 
      key: 'diasVencimiento' as const, 
      label: 'Días Plazo', 
      sortable: true,
      render: (row: Denuncia) => {
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
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Denuncias</h1>
            </div>
            <p className="text-gray-600 mt-1 ml-7">
              Registro y seguimiento de denuncias aduaneras
            </p>
          </div>
          <CustomButton 
            className="btn-primary flex items-center gap-2"
            onClick={() => navigate(ERoutePaths.DENUNCIAS_NUEVA)}
          >
            <Icon name="Plus" size={18} />
            Nueva Denuncia
          </CustomButton>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-4 border-l-4 border-l-amber-500">
            <p className="text-sm text-gray-600">Pendientes</p>
            <p className="text-2xl font-bold text-amber-600">
              {conteoDenuncias.pendientes}
            </p>
          </div>
          <div className="card p-4 border-l-4 border-l-blue-500">
            <p className="text-sm text-gray-600">En Proceso</p>
            <p className="text-2xl font-bold text-blue-600">
              {conteoDenuncias.enProceso}
            </p>
          </div>
          <div className="card p-4 border-l-4 border-l-red-500">
            <p className="text-sm text-gray-600">Vencidas</p>
            <p className="text-2xl font-bold text-red-600">
              {conteoDenuncias.vencidas}
            </p>
          </div>
          <div className="card p-4 border-l-4 border-l-emerald-500">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">
              {conteoDenuncias.total}
            </p>
          </div>
        </div>

        {/* Card principal */}
        <section className="card overflow-hidden">
          {/* Header azul */}
          <div className="bg-aduana-azul py-3 px-6 flex items-center justify-between">
            <span className="text-white font-medium flex items-center gap-2">
              <Icon name="FileSearch" size={18} />
              Búsqueda de Denuncias
            </span>
            <span className="text-white/80 text-sm">
              {denuncias.length} registros encontrados
            </span>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5 bg-gray-50 border-b border-gray-200">
            {CONSTANTS_APP.FILTERS_DENUNCIAS.map((filter) => (
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
              headers={columnasDenuncias}
              data={denuncias}
              actions={handleActions}
            />
          </div>

          {/* Paginación */}
          <div className="flex flex-col md:flex-row items-center justify-between px-5 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Mostrando 1 a {denuncias.length} de {denuncias.length} registros
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

export default DenunciasList;

