/**
 * ReclamosList - Bandeja de Reclamos
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

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
import {
  TIPOS_IDENTIFICACION_DTTA,
  getPlaceholderPorTipoId,
  type TipoIdentificacionDTTA,
} from '../../constants/tipos-identificacion';

// Datos centralizados
import {
  reclamos,
  getConteoReclamos,
  getTodasLasNotificaciones,
  usuarioActual,
  aduanas,
  type Reclamo,
  type EstadoReclamo,
  type TipoReclamoCompleto,
  type OrigenReclamo,
} from '../../data';

// Opciones para filtros
const estadosReclamo: EstadoReclamo[] = [
  'Ingresado', 'En Admisibilidad', 'Admitido', 'En Análisis', 
  'En Tramitación', 'Pendiente Resolución', 'Derivado a Tribunal',
  'Fallado', 'Resuelto', 'Rechazado', 'Acogido', 'Acogido Parcialmente', 'Cerrado'
];

const tiposReclamo: TipoReclamoCompleto[] = ['Reposición', 'TTA'];
const origenesReclamo: OrigenReclamo[] = ['DENUNCIA', 'CARGO', 'GIRO', 'OTRO'];

// Tipo de filtros
interface FiltrosReclamo {
  numero: string;
  tipo: string;
  estado: string;
  origen: string;
  tipoIdReclamante: TipoIdentificacionDTTA | '';
  idReclamante: string;
  nombreReclamante: string;
  aduana: string;
}

const initialFiltros: FiltrosReclamo = {
  numero: '',
  tipo: '',
  estado: '',
  origen: '',
  tipoIdReclamante: '',
  idReclamante: '',
  nombreReclamante: '',
  aduana: '',
};

export const ReclamosList: React.FC = () => {
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState<FiltrosReclamo>(initialFiltros);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const labelBaseClass = "block text-sm font-semibold text-gray-800";
  const inputContainerClass = "!flex-col !items-start gap-1 lg:!flex-col lg:!items-start lg:!gap-1";

  // Obtener conteos desde datos centralizados
  const conteoReclamos = getConteoReclamos();
  const allNotifications = getTodasLasNotificaciones();

  // Contar filtros activos
  const filtrosActivos = useMemo(() => {
    return Object.entries(filtros).filter(([_, value]) => value !== '').length;
  }, [filtros]);

  // Filtrar reclamos
  const reclamosFiltrados = useMemo(() => {
    const normalizarId = (valor: string) => valor.replace(/\./g, '').replace(/-/g, '').toUpperCase();
    return reclamos.filter(r => {
      if (filtros.numero && !r.numeroReclamo.toLowerCase().includes(filtros.numero.toLowerCase())) return false;
      if (filtros.tipo && r.tipoReclamo !== filtros.tipo) return false;
      if (filtros.estado && r.estado !== filtros.estado) return false;
      if (filtros.origen && r.origenReclamo !== filtros.origen) return false;
      if (filtros.nombreReclamante && !r.reclamante.toLowerCase().includes(filtros.nombreReclamante.toLowerCase())) return false;

      const aplicaFiltroId = Boolean(filtros.tipoIdReclamante && filtros.idReclamante);
      if (aplicaFiltroId) {
        const rutNormalizado = normalizarId(r.rutReclamante);
        if (!rutNormalizado.includes(normalizarId(filtros.idReclamante))) return false;
      }

      if (filtros.aduana && r.codigoAduana !== filtros.aduana && r.aduana !== filtros.aduana) return false;
      return true;
    });
  }, [filtros]);

  const handleFiltroChange = (campo: keyof FiltrosReclamo, valor: string) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const handleTipoIdChange = (valor: TipoIdentificacionDTTA | '') => {
    setFiltros(prev => ({
      ...prev,
      tipoIdReclamante: valor,
      idReclamante: valor ? prev.idReclamante : '',
    }));
  };

  const limpiarFiltros = () => {
    setFiltros(initialFiltros);
  };

  const removerFiltro = (campo: keyof FiltrosReclamo) => {
    setFiltros(prev => ({ ...prev, [campo]: '' }));
  };

  const handleBuscar = useCallback(() => {
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 500);
  }, []);

  const getFiltroLabel = (campo: keyof FiltrosReclamo, valor: string): string => {
    switch (campo) {
      case 'numero': return `N° ${valor}`;
      case 'tipo': return valor;
      case 'estado': return valor;
      case 'origen': return valor;
      case 'nombreReclamante': return `Nombre: ${valor}`;
      case 'aduana': return valor;
      default: return valor;
    }
  };

  // Función para obtener variant de estado
  const getEstadoVariant = (estado: string): { variant: BadgeVariant; muted: boolean } => {
    const estadoMap: Record<string, { variant: BadgeVariant; muted: boolean }> = {
      'Ingresado': { variant: 'info', muted: true },
      'En Admisibilidad': { variant: 'pendiente', muted: false },
      'Admitido': { variant: 'info', muted: true },
      'En Análisis': { variant: 'proceso', muted: true },
      'En Tramitación': { variant: 'proceso', muted: true },
      'Pendiente Resolución': { variant: 'warning', muted: false },
      'Derivado a Tribunal': { variant: 'danger', muted: false },
      'Fallado': { variant: 'resuelto', muted: true },
      'Resuelto': { variant: 'resuelto', muted: true },
      'Rechazado': { variant: 'rechazado', muted: false },
      'Acogido': { variant: 'resuelto', muted: true },
      'Acogido Parcialmente': { variant: 'proceso', muted: true },
      'Cerrado': { variant: 'resuelto', muted: true },
    };
    return estadoMap[estado] || { variant: 'info', muted: true };
  };

  const handleActions = (row: Reclamo) => (
    <div className="flex flex-col w-full gap-1.5">
      <CustomButton 
        variant="primary" 
        className="w-full !text-xs !py-1.5 flex items-center justify-center gap-1.5"
        onClick={() => navigate(ERoutePaths.RECLAMOS_DETALLE.replace(':id', row.id))}
      >
        <Icon name="Eye" className="hidden md:block" size={12} />
        <span>Ver Detalle</span>
      </CustomButton>
      <CustomButton 
        variant="secondary" 
        className="w-full !text-xs !py-1.5 flex items-center justify-center gap-1.5"
        onClick={() => navigate(ERoutePaths.RECLAMOS_EDITAR.replace(':id', row.id))}
      >
        <Icon name="Edit" className="hidden md:block" size={12} />
        <span>Editar</span>
      </CustomButton>
    </div>
  );

  // Columnas para la tabla
  const columnasReclamos = [
    { key: 'numeroReclamo' as const, label: 'N° Reclamo', sortable: true, sticky: true },
    { 
      key: 'tipoReclamo' as const, 
      label: 'Tipo', 
      sortable: true,
      render: (row: Reclamo) => (
        <span className={`text-xs font-medium px-2 py-0.5 rounded ${
          row.tipoReclamo === 'TTA' 
            ? 'bg-red-50 text-red-700' 
            : 'bg-amber-50 text-amber-700'
        }`}>
          {row.tipoReclamo}
        </span>
      )
    },
    { key: 'fechaIngreso' as const, label: 'Fecha Ingreso', sortable: true },
    { 
      key: 'estado' as const, 
      label: 'Estado', 
      sortable: true,
      sticky: true,
      render: (row: Reclamo) => {
        const { variant, muted } = getEstadoVariant(row.estado);
        return (
          <Badge variant={variant} dot size="sm" className={muted ? 'opacity-80' : ''}>
            {row.estado}
          </Badge>
        );
      }
    },
    { 
      key: 'origenReclamo' as const, 
      label: 'Origen', 
      sortable: true,
      render: (row: Reclamo) => (
        <span className="text-sm">
          {row.origenReclamo}
          {row.numeroEntidadOrigen && (
            <span className="text-gray-500 block text-xs">{row.numeroEntidadOrigen}</span>
          )}
        </span>
      )
    },
    { key: 'reclamante' as const, label: 'Reclamante', sortable: true },
    { 
      key: 'montoReclamado' as const, 
      label: 'Monto', 
      sortable: true,
      render: (row: Reclamo) => row.montoReclamado 
        ? `$${row.montoReclamado.toLocaleString('es-CL')}` 
        : '-'
    },
    { 
      key: 'diasRespuesta' as const, 
      label: 'Días', 
      sortable: true,
      render: (row: Reclamo) => {
        const dias = row.diasRespuesta;
        const variant = getDiasVencimientoBadgeVariant(dias);
        const tooltipText = dias === 0 
          ? 'Plazo cumplido'
          : dias < 0
            ? `Vencido hace ${Math.abs(dias)} días`
            : `Quedan ${dias} días de plazo`;
        
        return (
          <div className="relative group">
            <Badge variant={variant} size="sm">
              {dias === 0 ? '✓' : `${dias}d`}
            </Badge>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              {tooltipText}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        );
      }
    },
  ];

  // Chips de estado con prioridad visual
  const estadosChips = [
    { label: 'Total', count: conteoReclamos.total, variant: 'neutral' as const },
    { label: 'Pendientes', count: conteoReclamos.pendientes, variant: 'warning' as const, critical: true },
    { label: 'Derivados TTA', count: conteoReclamos.derivadosTTA, variant: 'danger' as const, critical: true },
    { label: 'En análisis', count: conteoReclamos.enAnalisis, variant: 'info' as const },
    { label: 'Resueltos', count: conteoReclamos.resueltos, variant: 'success' as const },
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
        {/* Header */}
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
              <span className="text-gray-900 font-medium">Reclamos</span>
            </nav>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Reclamos</h1>
            <p className="text-gray-500 mt-1">
              Reclamos Reposición y Tribunal Tributario Aduanero
            </p>
          </div>
          <CustomButton 
            variant="primary"
            className="flex items-center gap-2"
            onClick={() => navigate(ERoutePaths.RECLAMOS_NUEVO)}
          >
            <Icon name="Plus" size={16} />
            Nuevo Reclamo
          </CustomButton>
        </div>

        {/* Estadísticas - Prioridad visual solo en críticos */}
        <div className="flex flex-wrap items-center gap-2">
          {estadosChips.map((chip) => (
            <button
              key={chip.label}
              onClick={() => {
                if (chip.label === 'Pendientes') handleFiltroChange('estado', 'Pendiente Resolución');
                else if (chip.label === 'Derivados TTA') handleFiltroChange('estado', 'Derivado a Tribunal');
                else if (chip.label === 'En análisis') handleFiltroChange('estado', 'En Análisis');
                else if (chip.label === 'Resueltos') handleFiltroChange('estado', 'Resuelto');
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
          <span className="px-3 py-2 rounded-lg bg-slate-50 text-aduana-azul border border-slate-200 text-sm">
            Monto Total: <strong>{conteoReclamos.montoTotalFormateado}</strong>
          </span>
        </div>

        {/* Info sobre tipos de reclamo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 border-l-4 border-l-amber-500 border border-gray-100 shadow-sm">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-700">Reposición</span>
            </h4>
            <p className="text-sm text-gray-600 mt-2">
              Recurso de reposición ante la misma autoridad. Plazo: 5 días hábiles.
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border-l-4 border-l-red-500 border border-gray-100 shadow-sm">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-red-50 text-red-700">TTA</span>
            </h4>
            <p className="text-sm text-gray-600 mt-2">
              Tribunal Tributario y Aduanero. Instancia judicial de revisión.
            </p>
          </div>
        </div>

        {/* Card principal */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header azul */}
          <div className="bg-aduana-azul py-3 px-6">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium flex items-center gap-2">
                <Icon name="MessageSquare" size={18} />
                Búsqueda de Reclamos
              </span>
              <span className="text-white/80 text-sm">
                Tiempo promedio respuesta: {conteoReclamos.tiempoPromedioRespuesta} días
              </span>
            </div>
          </div>

          {/* Filtros básicos */}
          <div className="p-5 bg-white border-b border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <InputField
                label="N° Reclamo"
                id="nroReclamo"
                type="text"
                placeholder="Ej: REC-REP-2024-0001"
                labelClassName={labelBaseClass}
                containerClassName={inputContainerClass}
                value={filtros.numero}
                onChange={(e) => handleFiltroChange('numero', e.target.value)}
              />
              <div>
                <label htmlFor="tipo" className={`${labelBaseClass} mb-1`}>Tipo de Reclamo</label>
                <select 
                  id="tipo"
                  className="form-input min-h-[44px]"
                  value={filtros.tipo}
                  onChange={(e) => handleFiltroChange('tipo', e.target.value)}
                >
                  <option value="">Seleccione tipo...</option>
                  {tiposReclamo.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
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
                  <option value="">Seleccione estado...</option>
                  {estadosReclamo.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="origen" className={`${labelBaseClass} mb-1`}>Origen</label>
                <select 
                  id="origen"
                  className="form-input min-h-[44px]"
                  value={filtros.origen}
                  onChange={(e) => handleFiltroChange('origen', e.target.value)}
                >
                  <option value="">Seleccione origen...</option>
                  {origenesReclamo.map(origen => (
                    <option key={origen} value={origen}>{origen}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Filtros avanzados - colapsables */}
          <div 
            className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${showAdvancedFilters ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}
            `}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 p-5 bg-gray-50 border-b border-gray-100">
              <div className="sm:col-span-2">
                <label className={`${labelBaseClass} mb-1`}>Documento del Reclamante</label>
                <div className="flex gap-2">
                  <select 
                    className="form-input w-28 min-h-[44px]"
                    value={filtros.tipoIdReclamante}
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
                    placeholder={filtros.tipoIdReclamante ? getPlaceholderPorTipoId(filtros.tipoIdReclamante) : 'Seleccione tipo primero'}
                    disabled={!filtros.tipoIdReclamante}
                    value={filtros.idReclamante}
                    onChange={(e) => handleFiltroChange('idReclamante', e.target.value)}
                    aria-label="Número de documento"
                  />
                </div>
              </div>
              <InputField
                label="Nombre / Razón Social"
                id="reclamante"
                type="text"
                placeholder="Buscar por nombre..."
                labelClassName={labelBaseClass}
                containerClassName={inputContainerClass}
                value={filtros.nombreReclamante}
                onChange={(e) => handleFiltroChange('nombreReclamante', e.target.value)}
              />
              <div>
                <label htmlFor="aduana" className={`${labelBaseClass} mb-1`}>Aduana</label>
                <select 
                  id="aduana"
                  className="form-input min-h-[44px]"
                  value={filtros.aduana}
                  onChange={(e) => handleFiltroChange('aduana', e.target.value)}
                >
                  <option value="">Seleccione aduana...</option>
                  {aduanas.map(aduana => (
                    <option key={aduana.codigo} value={aduana.codigo}>{aduana.nombre}</option>
                  ))}
                </select>
              </div>
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
                          {getFiltroLabel(campo as keyof FiltrosReclamo, valor)}
                          <button
                            onClick={() => removerFiltro(campo as keyof FiltrosReclamo)}
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
                <span className="font-semibold text-gray-900">{reclamosFiltrados.length}</span> resultados encontrados
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
                    reclamosFiltrados.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={reclamosFiltrados.length === 0}
                  title={reclamosFiltrados.length === 0 ? 'No hay datos para exportar' : 'Exportar a Excel'}
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

          {/* Tabla */}
          <div className="p-4">
            {isSearching ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-3 border-aduana-azul/30 border-t-aduana-azul rounded-full animate-spin" />
                  <span className="text-sm text-gray-500">Buscando reclamos...</span>
                </div>
              </div>
            ) : reclamosFiltrados.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Icon name="FileX" size={48} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-1">No se encontraron reclamos</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {filtrosActivos > 0 
                    ? 'Intenta ajustar los filtros de búsqueda' 
                    : 'No hay reclamos registrados en el sistema'}
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
                  headers={columnasReclamos}
                  data={reclamosFiltrados}
                  actions={handleActions}
                />
              </div>
            )}
          </div>

          {/* Paginación */}
          {reclamosFiltrados.length > 0 && (
            <div className="flex flex-col md:flex-row items-center justify-between px-5 py-4 border-t border-gray-100 bg-white gap-3">
              <p className="text-sm text-gray-500">
                Mostrando <strong className="text-gray-700">1</strong> a <strong className="text-gray-700">{Math.min(reclamosFiltrados.length, 20)}</strong> de <strong className="text-gray-700">{reclamosFiltrados.length}</strong> registros
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

export default ReclamosList;
