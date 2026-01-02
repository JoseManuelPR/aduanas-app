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
import {
  TIPOS_IDENTIFICACION_DTTA,
  getPlaceholderPorTipoId,
  type TipoIdentificacionDTTA,
} from '../../constants/tipos-identificacion';

// Tipos de filtros
interface FiltrosDenuncia {
  numeroDenuncia: string;
  numeroInterno: string;
  tipoDenuncia: string;
  estado: string;
  aduana: string;
  tipoInfraccion: string;
  tipoIdInfractor: TipoIdentificacionDTTA | '';
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
  const labelBaseClass = "block text-sm font-semibold text-black";
  const inputContainerClass = "!flex-col !items-start gap-1 lg:!flex-col lg:!items-start lg:!gap-1";

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
      // Filtro por ID del infractor (se exige tipo de ID antes de aplicar)
      const aplicaFiltroId = Boolean(filtros.tipoIdInfractor && filtros.numeroIdInfractor);
      if (aplicaFiltroId && !d.rutDeudor.includes(filtros.numeroIdInfractor)) return false;
      if (filtros.mercanciaAfecta === 'si' && !d.mercanciaAfecta) return false;
      if (filtros.mercanciaAfecta === 'no' && d.mercanciaAfecta) return false;
      return true;
    });
  }, [filtros]);

  const handleFiltroChange = (campo: keyof FiltrosDenuncia, valor: string) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const handleTipoIdChange = (valor: TipoIdentificacionDTTA | '') => {
    setFiltros(prev => ({
      ...prev,
      tipoIdInfractor: valor,
      // Si se borra el tipo, vaciar el número para evitar búsquedas inconsistentes
      numeroIdInfractor: valor ? prev.numeroIdInfractor : '',
    }));
  };

  const limpiarFiltros = () => {
    setFiltros(initialFiltros);
  };

  const handleActions = (row: Denuncia) => (
    <div className="flex flex-col w-full gap-1.5">
      <CustomButton 
        variant="primary" 
        className="w-full !text-xs !py-1.5 flex items-center justify-center gap-1.5"
        onClick={() => navigate(`/denuncias/${row.id}`)}
      >
        <Icon name="Eye" className="hidden md:block" size={12} />
        <span>Ver Detalle</span>
      </CustomButton>
      <CustomButton 
        variant="secondary" 
        className="w-full !text-xs !py-1.5 flex items-center justify-center gap-1.5"
        onClick={() => navigate(`/expediente/${row.id}`)}
      >
        <Icon name="FolderOpen" className="hidden md:block" size={12} />
        <span>Expediente</span>
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
      label: 'Mercancía',
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
              <span className="text-gray-900 font-medium">Denuncias</span>
            </nav>
            <h1 className="text-2xl font-bold text-gray-900">Listado de Denuncias</h1>
            <p className="text-gray-500 mt-1">
              Gestión y seguimiento de denuncias aduaneras
            </p>
          </div>
          <CustomButton 
            variant="primary"
            className="flex items-center gap-2"
            onClick={() => navigate(ERoutePaths.DENUNCIAS_NUEVA)}
          >
            <Icon name="Plus" size={16} />
            Nueva Denuncia
          </CustomButton>
        </div>

        {/* Estadísticas compactas */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700">
            Total: <strong>{conteoDenuncias.total}</strong>
          </span>
          <span className="px-3 py-2 rounded-lg bg-slate-50 text-gray-700 border border-gray-200">
            Borrador: <strong>{conteoDenuncias.porEstado.borrador}</strong>
          </span>
          <span className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
            Ingresadas: <strong>{conteoDenuncias.porEstado.ingresada + conteoDenuncias.porEstado.enRevision}</strong>
          </span>
          <span className="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
            En proceso: <strong>{conteoDenuncias.enProceso}</strong>
          </span>
          <span className="px-3 py-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
            Por vencer: <strong>{conteoDenuncias.porVencer}</strong>
          </span>
          <span className="px-3 py-2 rounded-lg bg-red-50 text-red-700 border border-red-200">
            Vencidas: <strong>{conteoDenuncias.vencidas}</strong>
          </span>
          <span className="px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            Resueltas: <strong>{conteoDenuncias.resueltas}</strong>
          </span>
        </div>

        {/* Card principal */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-5 bg-white border-b border-gray-100">
            <InputField
              label="N° Denuncia"
              id="numeroDenuncia"
              type="text"
              placeholder="Ej: 993519"
              labelClassName={labelBaseClass}
              containerClassName={inputContainerClass}
              value={filtros.numeroDenuncia}
              onChange={(e) => handleFiltroChange('numeroDenuncia', e.target.value)}
            />
            <div>
              <label className={`${labelBaseClass} mb-1`}>Tipo</label>
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
              <label className={`${labelBaseClass} mb-1`}>Estado</label>
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
              <label className={`${labelBaseClass} mb-1`}>Aduana</label>
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-5 bg-gray-50 border-b border-gray-100">
              <InputField
                label="N° Interno"
                id="numeroInterno"
                type="text"
                placeholder="INT-2025-XXXXXX"
                labelClassName={labelBaseClass}
                containerClassName={inputContainerClass}
                value={filtros.numeroInterno}
                onChange={(e) => handleFiltroChange('numeroInterno', e.target.value)}
              />
              <div>
                <label className={`${labelBaseClass} mb-1`}>Tipo Infracción</label>
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
                <label className={`${labelBaseClass} mb-1`}>Mercancía Afecta</label>
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
              {/* ID Infractor anidado */}
              <div className="md:col-span-2 xl:col-span-2">
                <label className={`${labelBaseClass} mb-1`}>ID del Infractor</label>
                <div className="flex gap-2">
                  <select
                    className="form-input w-1/3"
                    value={filtros.tipoIdInfractor}
                    onChange={(e) => handleTipoIdChange(e.target.value as TipoIdentificacionDTTA | '')}
                  >
                    <option value="">Tipo ID</option>
                    {TIPOS_IDENTIFICACION_DTTA.map(tipo => (
                      <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    className="form-input flex-1 disabled:opacity-60 disabled:cursor-not-allowed"
                    placeholder={getPlaceholderPorTipoId(filtros.tipoIdInfractor)}
                    disabled={!filtros.tipoIdInfractor}
                    value={filtros.numeroIdInfractor}
                    onChange={(e) => handleFiltroChange('numeroIdInfractor', e.target.value)}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Primero selecciona el tipo de documento y luego ingresa el número.
                </p>
              </div>
              <InputField
                label="Fecha Desde"
                id="fechaDesde"
                type="date"
                labelClassName={labelBaseClass}
                containerClassName={inputContainerClass}
                value={filtros.fechaDesde}
                onChange={(e) => handleFiltroChange('fechaDesde', e.target.value)}
              />
              <InputField
                label="Fecha Hasta"
                id="fechaHasta"
                type="date"
                labelClassName={labelBaseClass}
                containerClassName={inputContainerClass}
                value={filtros.fechaHasta}
                onChange={(e) => handleFiltroChange('fechaHasta', e.target.value)}
              />
              <InputField
                label="Monto Mínimo ($)"
                id="montoMinimo"
                type="number"
                placeholder="0"
                labelClassName={labelBaseClass}
                containerClassName={inputContainerClass}
                value={filtros.montoMinimo}
                onChange={(e) => handleFiltroChange('montoMinimo', e.target.value)}
              />
              <InputField
                label="Monto Máximo ($)"
                id="montoMaximo"
                type="number"
                placeholder="999.999.999"
                labelClassName={labelBaseClass}
                containerClassName={inputContainerClass}
                value={filtros.montoMaximo}
                onChange={(e) => handleFiltroChange('montoMaximo', e.target.value)}
              />
            </div>
          )}

          {/* Acciones */}
          <div className="flex flex-col md:flex-row justify-between items-center px-5 py-3 gap-3 bg-white border-b border-gray-100">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center gap-1.5 text-gray-600 hover:text-aduana-azul transition-colors"
              >
                <Icon name={showAdvancedFilters ? "ChevronUp" : "SlidersHorizontal"} size={16} />
                {showAdvancedFilters ? 'Ocultar filtros' : 'Más filtros'}
              </button>
              {selectedRows.length > 0 && (
                <span className="bg-aduana-azul/10 text-aduana-azul px-2.5 py-1 rounded-full text-xs font-medium">
                  {selectedRows.length} seleccionados
                </span>
              )}
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <CustomButton 
                variant="secondary"
                className="flex items-center gap-1.5 !bg-transparent !border-0 hover:!bg-gray-100"
                onClick={limpiarFiltros}
              >
                <Icon name="X" size={14} />
                Limpiar
              </CustomButton>
              <CustomButton variant="secondary" className="flex items-center gap-1.5">
                <Icon name="Download" size={14} />
                Exportar
              </CustomButton>
              <CustomButton variant="primary" className="flex items-center gap-1.5">
                <Icon name="Search" size={14} />
                Buscar
              </CustomButton>
            </div>
          </div>

          {/* Tabla */}
          <div className="p-4">
            <Table
              classHeader="bg-gray-50 text-gray-700 text-xs font-semibold uppercase tracking-wide"
              headers={columnasDenuncias}
              data={denunciasFiltradas}
              actions={handleActions}
            />
          </div>

          {/* Paginación - más limpia */}
          <div className="flex flex-col md:flex-row items-center justify-between px-5 py-4 border-t border-gray-100 bg-white">
            <p className="text-sm text-gray-500">
              Mostrando <strong className="text-gray-700">1</strong> a <strong className="text-gray-700">{Math.min(denunciasFiltradas.length, 20)}</strong> de <strong className="text-gray-700">{denunciasFiltradas.length}</strong> registros
            </p>
            <div className="flex items-center gap-1 mt-3 md:mt-0">
              <button className="px-3 py-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors" disabled>
                <Icon name="ChevronLeft" size={16} />
              </button>
              <button className="px-3.5 py-1.5 text-sm bg-aduana-azul text-white rounded-lg font-medium">
                1
              </button>
              <button className="px-3.5 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                2
              </button>
              <button className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Icon name="ChevronRight" size={16} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </CustomLayout>
  );
};

export default DenunciasList;
