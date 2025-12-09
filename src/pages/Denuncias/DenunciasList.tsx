import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from "he-button-custom-library";
import CONSTANTS_APP from "../../constants/sidebar-menu";
import CustomLayout from "../../Layout/Layout";
import InputField from "../../organisms/InputField/InputField";
import { CustomButton } from "../../components/Button/Button";
import { Table } from "../../components/Table/Table";
import { Badge, getEstadoBadgeVariant, getDiasVencimientoBadgeVariant } from "../../components/UI";
import type { BadgeVariant } from "../../components/UI";
import { ERoutePaths } from "../../routes/routes";

// Datos centralizados
import {
  denuncias,
  getConteoDenuncias,
  getTodasLasNotificaciones,
  usuarioActual,
  aduanas,
  estadosDenuncia,
  tiposInfraccion,
  type Denuncia,
} from '../../data';

// Tipos de ID disponibles
const tiposIdentificador = [
  { value: 'RUT', label: 'RUT' },
  { value: 'PASAPORTE', label: 'Pasaporte' },
  { value: 'DNI', label: 'DNI' },
  { value: 'RUC', label: 'RUC' },
  { value: 'OTRO', label: 'Otro' },
];

// Tipos de filtros
interface FiltrosDenuncia {
  numeroDenuncia: string;
  numeroInterno: string;
  tipoDenuncia: string;
  estado: string;
  aduana: string;
  tipoInfraccion: string;
  tipoIdInfractor: string;
  numeroIdInfractor: string;
  fechaDesde: string;
  fechaHasta: string;
  montoMinimo: string;
  montoMaximo: string;
  mercanciaAfecta: string;
}

const initialFiltros: FiltrosDenuncia = {
  numeroDenuncia: '',
  numeroInterno: '',
  tipoDenuncia: '',
  estado: '',
  aduana: '',
  tipoInfraccion: '',
  tipoIdInfractor: '',
  numeroIdInfractor: '',
  fechaDesde: '',
  fechaHasta: '',
  montoMinimo: '',
  montoMaximo: '',
  mercanciaAfecta: '',
};

export const DenunciasList: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRows, _setSelectedRows] = useState<string[]>([]);
  void _setSelectedRows; // For future use with bulk actions
  const [filtros, setFiltros] = useState<FiltrosDenuncia>(initialFiltros);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Obtener conteos desde datos centralizados
  const conteoDenuncias = getConteoDenuncias();
  const allNotifications = getTodasLasNotificaciones();

  // Filtrar denuncias
  const denunciasFiltradas = useMemo(() => {
    return denuncias.filter(d => {
      if (filtros.numeroDenuncia && !d.numeroDenuncia.includes(filtros.numeroDenuncia)) return false;
      if (filtros.numeroInterno && !d.numeroInterno?.includes(filtros.numeroInterno)) return false;
      if (filtros.tipoDenuncia && d.tipoDenuncia !== filtros.tipoDenuncia) return false;
      if (filtros.estado && d.estado !== filtros.estado) return false;
      if (filtros.aduana && d.aduana !== filtros.aduana) return false;
      if (filtros.tipoInfraccion && d.tipoInfraccion !== filtros.tipoInfraccion) return false;
      // Filtro por ID del infractor (busca en RUT por compatibilidad)
      if (filtros.numeroIdInfractor && !d.rutDeudor.includes(filtros.numeroIdInfractor)) return false;
      if (filtros.mercanciaAfecta === 'si' && !d.mercanciaAfecta) return false;
      if (filtros.mercanciaAfecta === 'no' && d.mercanciaAfecta) return false;
      return true;
    });
  }, [filtros]);

  const handleFiltroChange = (campo: keyof FiltrosDenuncia, valor: string) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const limpiarFiltros = () => {
    setFiltros(initialFiltros);
  };

  const handleActions = (row: Denuncia) => (
    <div className="flex flex-col w-full gap-1">
      <CustomButton 
        variant="primary" 
        className="w-full text-xs"
        onClick={() => navigate(`/denuncias/${row.id}`)}
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

  // Columnas para la tabla de denuncias
  const columnasDenuncias = [
    { key: 'numeroDenuncia' as const, label: 'N° Denuncia', sortable: true },
    { 
      key: 'tipoDenuncia' as const, 
      label: 'Tipo', 
      sortable: true,
      render: (row: Denuncia) => (
        <Badge variant={(row.tipoDenuncia === 'Penal' ? 'error' : 'info') as BadgeVariant} size="sm">
          {row.tipoDenuncia}
        </Badge>
      )
    },
    { key: 'fechaIngreso' as const, label: 'Fecha', sortable: true },
    { 
      key: 'estado' as const, 
      label: 'Estado', 
      sortable: true,
      render: (row: Denuncia) => (
        <Badge variant={getEstadoBadgeVariant(row.estado)} dot size="sm">
          {row.estado}
        </Badge>
      )
    },
    { key: 'aduana' as const, label: 'Aduana', sortable: true },
    { key: 'rutDeudor' as const, label: 'ID Infractor', sortable: true },
    { key: 'nombreDeudor' as const, label: 'Infractor', sortable: true },
    { key: 'tipoInfraccion' as const, label: 'Infracción', sortable: true },
    { key: 'montoEstimado' as const, label: 'Monto', sortable: true },
    { 
      key: 'diasVencimiento' as const, 
      label: 'Plazo', 
      sortable: true,
      render: (row: Denuncia) => {
        const dias = row.diasVencimiento;
        const variant = getDiasVencimientoBadgeVariant(dias);
        return (
          <Badge variant={variant} pulse={dias < 0} size="sm">
            {dias < 0 ? `${Math.abs(dias)}d venc.` : dias === 0 ? 'Hoy' : `${dias}d`}
          </Badge>
        );
      }
    },
    {
      key: 'mercanciaAfecta' as const,
      label: '',
      render: (row: Denuncia) => row.mercanciaAfecta ? (
        <button
          title="Ver mercancía asociada"
          onClick={() => row.mercanciaId && navigate(ERoutePaths.MERCANCIAS_DETALLE.replace(':id', row.mercanciaId))}
          className="text-amber-600 hover:text-amber-700"
          disabled={!row.mercanciaId}
        >
          <Icon name="Package" size={16} className="inline" />
        </button>
      ) : null
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
              <h1 className="text-2xl font-bold text-gray-900">Listado de Denuncias</h1>
            </div>
            <p className="text-gray-600 mt-1 ml-7">
              Gestión y seguimiento de denuncias aduaneras
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CustomButton 
              variant="primary"
              className="flex items-center gap-2"
              onClick={() => navigate(ERoutePaths.DENUNCIAS_NUEVA)}
            >
              <Icon name="Plus" size={18} />
              Nueva Denuncia
            </CustomButton>
          </div>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="card p-4 border-l-4 border-l-gray-400">
            <p className="text-sm text-gray-600">Borrador</p>
            <p className="text-2xl font-bold text-gray-600">
              {conteoDenuncias.porEstado.borrador}
            </p>
          </div>
          <div className="card p-4 border-l-4 border-l-blue-500">
            <p className="text-sm text-gray-600">Ingresadas</p>
            <p className="text-2xl font-bold text-blue-600">
              {conteoDenuncias.porEstado.ingresada + conteoDenuncias.porEstado.enRevision}
            </p>
          </div>
          <div className="card p-4 border-l-4 border-l-indigo-500">
            <p className="text-sm text-gray-600">En Proceso</p>
            <p className="text-2xl font-bold text-indigo-600">
              {conteoDenuncias.enProceso}
            </p>
          </div>
          <div className="card p-4 border-l-4 border-l-amber-500">
            <p className="text-sm text-gray-600">Por Vencer</p>
            <p className="text-2xl font-bold text-amber-600">
              {conteoDenuncias.porVencer}
            </p>
          </div>
          <div className="card p-4 border-l-4 border-l-red-500">
            <p className="text-sm text-gray-600">Vencidas</p>
            <p className="text-2xl font-bold text-red-600">
              {conteoDenuncias.vencidas}
            </p>
          </div>
          <div className="card p-4 border-l-4 border-l-emerald-500">
            <p className="text-sm text-gray-600">Cerradas</p>
            <p className="text-2xl font-bold text-emerald-600">
              {conteoDenuncias.resueltas}
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
              {denunciasFiltradas.length} de {denuncias.length} registros
            </span>
          </div>

          {/* Filtros básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-gray-50 border-b border-gray-200">
            <InputField
              label="N° Denuncia"
              id="numeroDenuncia"
              type="text"
              placeholder="Ej: 993519"
              labelClassName="font-medium text-sm text-gray-700"
              value={filtros.numeroDenuncia}
              onChange={(e) => handleFiltroChange('numeroDenuncia', e.target.value)}
            />
            <div>
              <label className="block font-medium text-sm text-gray-700 mb-1">Tipo</label>
              <select
                className="form-input"
                value={filtros.tipoDenuncia}
                onChange={(e) => handleFiltroChange('tipoDenuncia', e.target.value)}
              >
                <option value="">Todos</option>
                <option value="Infraccional">Infraccional</option>
                <option value="Penal">Penal</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-sm text-gray-700 mb-1">Estado</label>
              <select
                className="form-input"
                value={filtros.estado}
                onChange={(e) => handleFiltroChange('estado', e.target.value)}
              >
                <option value="">Todos</option>
                {estadosDenuncia.map(estado => (
                  <option key={estado.value} value={estado.value}>{estado.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium text-sm text-gray-700 mb-1">Aduana</label>
              <select
                className="form-input"
                value={filtros.aduana}
                onChange={(e) => handleFiltroChange('aduana', e.target.value)}
              >
                <option value="">Todas</option>
                {aduanas.map(aduana => (
                  <option key={aduana.id} value={aduana.nombre}>{aduana.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filtros avanzados */}
          {showAdvancedFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-gray-100 border-b border-gray-200">
              <InputField
                label="N° Interno"
                id="numeroInterno"
                type="text"
                placeholder="INT-2025-XXXXXX"
                labelClassName="font-medium text-sm text-gray-700"
                value={filtros.numeroInterno}
                onChange={(e) => handleFiltroChange('numeroInterno', e.target.value)}
              />
              {/* ID Infractor anidado */}
              <div className="lg:col-span-2">
                <label className="block font-medium text-sm text-gray-700 mb-1">ID del Infractor</label>
                <div className="flex gap-2">
                  <select
                    className="form-input w-1/3"
                    value={filtros.tipoIdInfractor}
                    onChange={(e) => handleFiltroChange('tipoIdInfractor', e.target.value)}
                  >
                    <option value="">Tipo ID</option>
                    {tiposIdentificador.map(tipo => (
                      <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    className="form-input flex-1"
                    placeholder="Número de ID"
                    value={filtros.numeroIdInfractor}
                    onChange={(e) => handleFiltroChange('numeroIdInfractor', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-sm text-gray-700 mb-1">Tipo Infracción</label>
                <select
                  className="form-input"
                  value={filtros.tipoInfraccion}
                  onChange={(e) => handleFiltroChange('tipoInfraccion', e.target.value)}
                >
                  <option value="">Todos</option>
                  {tiposInfraccion.map(tipo => (
                    <option key={tipo.id} value={tipo.nombre}>{tipo.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium text-sm text-gray-700 mb-1">Mercancía Afecta</label>
                <select
                  className="form-input"
                  value={filtros.mercanciaAfecta}
                  onChange={(e) => handleFiltroChange('mercanciaAfecta', e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="si">Sí</option>
                  <option value="no">No</option>
                </select>
              </div>
              <InputField
                label="Fecha Desde"
                id="fechaDesde"
                type="date"
                labelClassName="font-medium text-sm text-gray-700"
                value={filtros.fechaDesde}
                onChange={(e) => handleFiltroChange('fechaDesde', e.target.value)}
              />
              <InputField
                label="Fecha Hasta"
                id="fechaHasta"
                type="date"
                labelClassName="font-medium text-sm text-gray-700"
                value={filtros.fechaHasta}
                onChange={(e) => handleFiltroChange('fechaHasta', e.target.value)}
              />
              <InputField
                label="Monto Mínimo ($)"
                id="montoMinimo"
                type="number"
                placeholder="0"
                labelClassName="font-medium text-sm text-gray-700"
                value={filtros.montoMinimo}
                onChange={(e) => handleFiltroChange('montoMinimo', e.target.value)}
              />
              <InputField
                label="Monto Máximo ($)"
                id="montoMaximo"
                type="number"
                placeholder="999.999.999"
                labelClassName="font-medium text-sm text-gray-700"
                value={filtros.montoMaximo}
                onChange={(e) => handleFiltroChange('montoMaximo', e.target.value)}
              />
            </div>
          )}

          {/* Acciones */}
          <div className="flex flex-col md:flex-row justify-between items-center px-5 py-3 gap-3 border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center gap-1 text-aduana-azul hover:underline"
              >
                <Icon name={showAdvancedFilters ? "ChevronUp" : "ChevronDown"} size={16} />
                {showAdvancedFilters ? 'Ocultar filtros avanzados' : 'Mostrar filtros avanzados'}
              </button>
              {selectedRows.length > 0 && (
                <span className="bg-aduana-azul-50 text-aduana-azul px-2 py-1 rounded ml-4">
                  {selectedRows.length} seleccionados
                </span>
              )}
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <CustomButton 
                variant="secondary" 
                className="flex items-center gap-1 text-sm"
                onClick={limpiarFiltros}
              >
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
              data={denunciasFiltradas}
              actions={handleActions}
            />
          </div>

          {/* Paginación */}
          <div className="flex flex-col md:flex-row items-center justify-between px-5 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Mostrando 1 a {Math.min(denunciasFiltradas.length, 20)} de {denunciasFiltradas.length} registros
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
