import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from "he-button-custom-library";
import CONSTANTS_APP from "../../constants/sidebar-menu";
import CustomLayout from "../../Layout/Layout";
import InputField from "../../organisms/InputField/InputField";
import { CustomButton } from "../../components/Button/Button";
import { Table } from "../../components/Table/Table";
import { Badge, getDiasVencimientoBadgeVariant } from "../../components/UI";
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
  const [filtros, setFiltros] = useState<FiltrosDenuncia>(initialFiltros);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const labelBaseClass = "block text-sm font-semibold text-gray-800";
  const inputContainerClass = "!flex-col !items-start gap-1 lg:!flex-col lg:!items-start lg:!gap-1";

  // Obtener conteos desde datos centralizados
  const conteoDenuncias = getConteoDenuncias();
  const allNotifications = getTodasLasNotificaciones();

  // Contar filtros activos
  const filtrosActivos = useMemo(() => {
    return Object.entries(filtros).filter(([_, value]) => value !== '').length;
  }, [filtros]);

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

  // Remover un filtro específico
  const removerFiltro = (campo: keyof FiltrosDenuncia) => {
    setFiltros(prev => ({ ...prev, [campo]: '' }));
  };

  // Simular búsqueda con loading
  const handleBuscar = useCallback(() => {
    setIsSearching(true);
    // Simular delay de búsqueda
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  }, []);

  // Obtener label para filtro activo
  const getFiltroLabel = (campo: keyof FiltrosDenuncia, valor: string): string => {
    switch (campo) {
      case 'numeroDenuncia': return `N° ${valor}`;
      case 'tipoDenuncia': return valor;
      case 'estado': return valor;
      case 'aduana': return valor;
      case 'tipoInfraccion': return valor;
      case 'mercanciaAfecta': return valor === 'si' ? 'Con mercancía' : 'Sin mercancía';
      case 'fechaDesde': return `Desde ${valor}`;
      case 'fechaHasta': return `Hasta ${valor}`;
      default: return valor;
    }
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

  // Función para obtener variant de estado - simplificada para reducir ruido visual
  const getEstadoVariant = (estado: string): { variant: BadgeVariant; muted: boolean } => {
    const estadoLower = estado.toLowerCase();
    // Solo estados críticos con color fuerte
    if (estadoLower.includes('vencid')) return { variant: 'vencido', muted: false };
    // Estados neutros - más suaves
    if (estadoLower.includes('cerrad') || estadoLower.includes('archivad')) 
      return { variant: 'resuelto', muted: true };
    if (estadoLower.includes('borrador')) return { variant: 'default', muted: true };
    // Estados en proceso - color medio
    return { variant: 'proceso', muted: true };
  };

  // Columnas para la tabla de denuncias
  const columnasDenuncias = [
    { key: 'numeroDenuncia' as const, label: 'N° Denuncia', sortable: true, sticky: true },
    { 
      key: 'tipoDenuncia' as const, 
      label: 'Tipo', 
      sortable: true,
      render: (row: Denuncia) => (
        <span className={`text-xs font-medium px-2 py-0.5 rounded ${
          row.tipoDenuncia === 'Penal' 
            ? 'bg-red-50 text-red-700' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {row.tipoDenuncia}
        </span>
      )
    },
    { key: 'fechaIngreso' as const, label: 'Fecha', sortable: true },
    { 
      key: 'estado' as const, 
      label: 'Estado', 
      sortable: true,
      sticky: true,
      render: (row: Denuncia) => {
        const { variant, muted } = getEstadoVariant(row.estado);
        return (
          <Badge 
            variant={variant} 
            dot 
            size="sm"
            className={muted ? 'opacity-80' : ''}
          >
            {row.estado}
          </Badge>
        );
      }
    },
    { key: 'aduana' as const, label: 'Aduana', sortable: true, sticky: true },
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
        const isCritical = dias <= 0;
        
        // Tooltip text
        const tooltipText = dias < 0 
          ? `Vencido hace ${Math.abs(dias)} días` 
          : dias === 0 
            ? 'Vence hoy - Acción urgente requerida'
            : `Quedan ${dias} días de plazo`;
        
        return (
          <div className="relative group">
            <Badge 
              variant={variant} 
              pulse={dias < 0} 
              size="sm"
              className={isCritical ? 'font-bold' : ''}
            >
              {dias < 0 ? `${Math.abs(dias)}d venc.` : dias === 0 ? 'Hoy' : `${dias}d`}
            </Badge>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              {tooltipText}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
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

  // Chips de estado para la barra superior - solo críticos con color
  const estadosChips = [
    { label: 'Total', count: conteoDenuncias.total, variant: 'neutral' as const },
    { label: 'Por vencer', count: conteoDenuncias.porVencer, variant: 'warning' as const, critical: true },
    { label: 'Vencidas', count: conteoDenuncias.vencidas, variant: 'danger' as const, critical: true },
    { label: 'En proceso', count: conteoDenuncias.enProceso, variant: 'info' as const },
    { label: 'Resueltas', count: conteoDenuncias.resueltas, variant: 'success' as const },
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
        {/* Header de la sección */}
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

        {/* Estadísticas - Prioridad visual solo en críticos */}
        <div className="flex flex-wrap items-center gap-2">
          {estadosChips.map((chip) => (
            <button
              key={chip.label}
              onClick={() => {
                if (chip.label === 'Por vencer') handleFiltroChange('estado', 'En Proceso');
                else if (chip.label === 'Vencidas') handleFiltroChange('estado', 'Observada');
                else if (chip.label === 'En proceso') handleFiltroChange('estado', 'En Proceso');
                else if (chip.label === 'Resueltas') handleFiltroChange('estado', 'Cerrada');
                else limpiarFiltros();
              }}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                flex items-center gap-2 min-w-[44px] min-h-[44px]
                ${chip.critical 
                  ? chip.variant === 'danger'
                    ? 'bg-red-100 text-red-800 border-2 border-red-300 hover:bg-red-200 shadow-sm'
                    : 'bg-amber-100 text-amber-800 border-2 border-amber-300 hover:bg-amber-200 shadow-sm'
                  : chip.variant === 'neutral'
                    ? 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    : chip.variant === 'success'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                }
              `}
            >
              {chip.critical && chip.count > 0 && (
                <span className={`w-2 h-2 rounded-full ${chip.variant === 'danger' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`} />
              )}
              <span>{chip.label}:</span>
              <strong className="tabular-nums">{chip.count}</strong>
            </button>
          ))}
        </div>

        {/* Card principal */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header azul con separación visual */}
          <div className="bg-aduana-azul py-3 px-6">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium flex items-center gap-2">
                <Icon name="FileSearch" size={18} />
                Búsqueda de Denuncias
              </span>
              <span className="text-white/80 text-sm">
                {denunciasFiltradas.length} de {denuncias.length} registros
              </span>
            </div>
          </div>

          {/* Filtros básicos - siempre visibles */}
          <div className="p-5 bg-white border-b border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
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
                <label htmlFor="tipoDenuncia" className={`${labelBaseClass} mb-1`}>Tipo</label>
                <select
                  id="tipoDenuncia"
                  className="form-input min-h-[44px]"
                  value={filtros.tipoDenuncia}
                  onChange={(e) => handleFiltroChange('tipoDenuncia', e.target.value)}
                >
                  <option value="">Seleccione un tipo...</option>
                  <option value="Infraccional">Infraccional</option>
                  <option value="Penal">Penal</option>
                </select>
              </div>
              <div>
                <label htmlFor="estado" className={`${labelBaseClass} mb-1`}>Estado</label>
                <select
                  id="estado"
                  className="form-input min-h-[44px]"
                  value={filtros.estado}
                  onChange={(e) => handleFiltroChange('estado', e.target.value)}
                >
                  <option value="">Seleccione un estado...</option>
                  {estadosDenuncia.map(estado => (
                    <option key={estado.value} value={estado.value}>{estado.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="aduana" className={`${labelBaseClass} mb-1`}>Aduana</label>
                <select
                  id="aduana"
                  className="form-input min-h-[44px]"
                  value={filtros.aduana}
                  onChange={(e) => handleFiltroChange('aduana', e.target.value)}
                >
                  <option value="">Seleccione una aduana...</option>
                  {aduanas.map(aduana => (
                    <option key={aduana.id} value={aduana.nombre}>{aduana.nombre}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Filtros avanzados - colapsables */}
          <div 
            className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${showAdvancedFilters ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
            `}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 p-5 bg-gray-50 border-b border-gray-100">
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
                <label htmlFor="tipoInfraccion" className={`${labelBaseClass} mb-1`}>Tipo Infracción</label>
                <select
                  id="tipoInfraccion"
                  className="form-input min-h-[44px]"
                  value={filtros.tipoInfraccion}
                  onChange={(e) => handleFiltroChange('tipoInfraccion', e.target.value)}
                >
                  <option value="">Seleccione tipo de infracción...</option>
                  {tiposInfraccion.map(tipo => (
                    <option key={tipo.id} value={tipo.nombre}>{tipo.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="mercanciaAfecta" className={`${labelBaseClass} mb-1`}>Mercancía Afecta</label>
                <select
                  id="mercanciaAfecta"
                  className="form-input min-h-[44px]"
                  value={filtros.mercanciaAfecta}
                  onChange={(e) => handleFiltroChange('mercanciaAfecta', e.target.value)}
                >
                  <option value="">Seleccione opción...</option>
                  <option value="si">Sí</option>
                  <option value="no">No</option>
                </select>
              </div>
              {/* ID Infractor anidado */}
              <div className="sm:col-span-2 xl:col-span-1">
                <label className={`${labelBaseClass} mb-1`}>ID del Infractor</label>
                <div className="flex gap-2">
                  <select
                    className="form-input w-28 min-h-[44px]"
                    value={filtros.tipoIdInfractor}
                    onChange={(e) => handleTipoIdChange(e.target.value as TipoIdentificacionDTTA | '')}
                    aria-label="Tipo de documento"
                  >
                    <option value="">Tipo</option>
                    {TIPOS_IDENTIFICACION_DTTA.map(tipo => (
                      <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    className="form-input flex-1 min-h-[44px] disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                    placeholder={filtros.tipoIdInfractor ? getPlaceholderPorTipoId(filtros.tipoIdInfractor) : 'Seleccione tipo primero'}
                    disabled={!filtros.tipoIdInfractor}
                    value={filtros.numeroIdInfractor}
                    onChange={(e) => handleFiltroChange('numeroIdInfractor', e.target.value)}
                    aria-label="Número de documento"
                  />
                </div>
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
          </div>

          {/* Barra de acciones */}
          <div className="flex flex-col gap-3 px-5 py-4 bg-white border-b border-gray-100">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-aduana-azul transition-colors min-h-[36px] px-2"
              >
                <Icon name={showAdvancedFilters ? "ChevronUp" : "SlidersHorizontal"} size={16} />
                {showAdvancedFilters ? 'Ocultar filtros avanzados' : 'Mostrar filtros avanzados'}
              </button>
              
              {/* Chips de filtros activos */}
              {filtrosActivos > 0 && (
                <>
                  <span className="text-gray-300">|</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-500">{filtrosActivos} filtro(s):</span>
                    {Object.entries(filtros).map(([campo, valor]) => {
                      if (!valor) return null;
                      return (
                        <span
                          key={campo}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-aduana-azul-50 text-aduana-azul text-xs font-medium rounded-full"
                        >
                          {getFiltroLabel(campo as keyof FiltrosDenuncia, valor)}
                          <button
                            onClick={() => removerFiltro(campo as keyof FiltrosDenuncia)}
                            className="hover:bg-aduana-azul-100 rounded-full p-0.5 transition-colors"
                            aria-label={`Quitar filtro ${campo}`}
                          >
                            <Icon name="X" size={12} />
                          </button>
                        </span>
                      );
                    })}
                    <button
                      onClick={limpiarFiltros}
                      className="text-xs text-gray-500 hover:text-red-600 underline underline-offset-2"
                    >
                      Quitar todos
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{denunciasFiltradas.length}</span> resultados encontrados
              </div>
              
              <div className="flex flex-wrap gap-2">
                <CustomButton 
                  variant="secondary"
                  className="flex items-center justify-center gap-1.5 !px-4 !py-2 min-w-[100px] !bg-white hover:!bg-gray-50"
                  onClick={limpiarFiltros}
                  disabled={filtrosActivos === 0}
                >
                  <Icon name="X" size={14} />
                  Limpiar
                </CustomButton>
                <CustomButton 
                  variant="secondary" 
                  className={`flex items-center justify-center gap-1.5 !px-4 !py-2 min-w-[100px] ${
                    denunciasFiltradas.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={denunciasFiltradas.length === 0}
                  title={denunciasFiltradas.length === 0 ? 'No hay datos para exportar' : 'Exportar a Excel'}
                >
                  <Icon name="Download" size={14} />
                  Exportar
                </CustomButton>
                <CustomButton 
                  variant="primary" 
                  className="flex items-center justify-center gap-1.5 !px-6 !py-2 min-w-[120px] font-semibold"
                  onClick={handleBuscar}
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Icon name="Search" size={14} />
                      Buscar
                    </>
                  )}
                </CustomButton>
              </div>
            </div>
          </div>

          {/* Tabla con scroll horizontal mejorado */}
          <div className="p-4">
            {isSearching ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-3 border-aduana-azul/30 border-t-aduana-azul rounded-full animate-spin" />
                  <span className="text-sm text-gray-500">Buscando denuncias...</span>
                </div>
              </div>
            ) : denunciasFiltradas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Icon name="FileX" size={48} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-1">No se encontraron denuncias</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {filtrosActivos > 0 
                    ? 'Intenta ajustar los filtros de búsqueda' 
                    : 'No hay denuncias registradas en el sistema'}
                </p>
                {filtrosActivos > 0 && (
                  <CustomButton variant="secondary" onClick={limpiarFiltros}>
                    <Icon name="X" size={14} />
                    Limpiar filtros
                  </CustomButton>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto -mx-4 px-4">
                <Table
                  classHeader="bg-gray-50 text-gray-700 text-xs font-semibold uppercase tracking-wide"
                  headers={columnasDenuncias}
                  data={denunciasFiltradas}
                  actions={handleActions}
                />
              </div>
            )}
          </div>

          {/* Paginación */}
          {denunciasFiltradas.length > 0 && (
            <div className="flex flex-col md:flex-row items-center justify-between px-5 py-4 border-t border-gray-100 bg-white gap-3">
              <p className="text-sm text-gray-500">
                Mostrando <strong className="text-gray-700">1</strong> a <strong className="text-gray-700">{Math.min(denunciasFiltradas.length, 20)}</strong> de <strong className="text-gray-700">{denunciasFiltradas.length}</strong> registros
              </p>
              <div className="flex items-center gap-1">
                <button 
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors" 
                  disabled
                  aria-label="Página anterior"
                >
                  <Icon name="ChevronLeft" size={16} />
                </button>
                <button className="min-w-[44px] min-h-[44px] flex items-center justify-center text-sm bg-aduana-azul text-white rounded-lg font-medium">
                  1
                </button>
                <button className="min-w-[44px] min-h-[44px] flex items-center justify-center text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  2
                </button>
                <button 
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  aria-label="Página siguiente"
                >
                  <Icon name="ChevronRight" size={16} />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </CustomLayout>
  );
};

export default DenunciasList;
