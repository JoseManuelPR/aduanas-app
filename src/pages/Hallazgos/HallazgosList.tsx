/**
 * HallazgosList - Bandeja de Hallazgos
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
  hallazgos,
  getConteoHallazgos,
  getTodasLasNotificaciones,
  usuarioActual,
  type Hallazgo,
  type EstadoHallazgo,
  // Hallazgos externos
  hallazgosExternos,
  getConteoHallazgosExternos,
  type HallazgoProcesado,
} from '../../data';

// Tipo de filtros
interface FiltrosHallazgo {
  numeroHallazgo: string;
  fechaDesde: string;
  fechaHasta: string;
  estado: EstadoHallazgo | '';
  tipoHallazgo: string;
  tipoIdInvolucrado: TipoIdentificacionDTTA | '';
  numeroIdInvolucrado: string;
}

const initialFiltros: FiltrosHallazgo = {
  numeroHallazgo: '',
  fechaDesde: '',
  fechaHasta: '',
  estado: '',
  tipoHallazgo: '',
  tipoIdInvolucrado: '',
  numeroIdInvolucrado: '',
};

// Mapeo de variantes para estados de hallazgo
const getEstadoVariant = (estado: EstadoHallazgo): { variant: BadgeVariant; muted: boolean } => {
  switch (estado) {
    case 'Ingresado': return { variant: 'info', muted: true };
    case 'En Análisis': return { variant: 'warning', muted: false };
    case 'Notificar Denuncia': return { variant: 'vencido', muted: false };
    case 'Derivado': return { variant: 'default', muted: true };
    case 'Cerrado': return { variant: 'resuelto', muted: true };
    case 'Convertido a Denuncia': return { variant: 'resuelto', muted: true };
    default: return { variant: 'default', muted: true };
  }
};

// Tipo combinado para tabla
type HallazgoListItem = (Hallazgo | HallazgoProcesado) & { 
  esExterno?: boolean;
  transactionId?: string;
};

export const HallazgosList: React.FC = () => {
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState<FiltrosHallazgo>(initialFiltros);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [mostrarExternos, setMostrarExternos] = useState(true);

  const labelBaseClass = "block text-sm font-semibold text-gray-800";
  const inputContainerClass = "!flex-col !items-start gap-1 lg:!flex-col lg:!items-start lg:!gap-1";

  // Obtener conteos desde datos centralizados
  const conteoHallazgos = getConteoHallazgos();
  const conteoExternos = getConteoHallazgosExternos();
  const allNotifications = getTodasLasNotificaciones();

  // Contar filtros activos
  const filtrosActivos = useMemo(() => {
    return Object.entries(filtros).filter(([_, value]) => value !== '').length;
  }, [filtros]);

  // Combinar hallazgos internos y externos
  const hallazgosCombinados = useMemo<HallazgoListItem[]>(() => {
    const internos: HallazgoListItem[] = hallazgos.map(h => ({ ...h, esExterno: false }));
    
    if (!mostrarExternos) return internos;
    
    const externos: HallazgoListItem[] = hallazgosExternos.map(h => ({ 
      ...h, 
      esExterno: true,
      transactionId: h.transactionId 
    }));
    
    return [...externos, ...internos];
  }, [mostrarExternos]);

  // Filtrar hallazgos
  const hallazgosFiltrados = useMemo(() => {
    return hallazgosCombinados.filter(h => {
      if (filtros.numeroHallazgo && !h.numeroHallazgo.toLowerCase().includes(filtros.numeroHallazgo.toLowerCase())) return false;
      if (filtros.estado && h.estado !== filtros.estado) return false;
      if (filtros.tipoHallazgo && h.tipoHallazgo !== filtros.tipoHallazgo) return false;
      
      const aplicaFiltroId = Boolean(filtros.tipoIdInvolucrado && filtros.numeroIdInvolucrado);
      if (aplicaFiltroId && !h.rutInvolucrado?.includes(filtros.numeroIdInvolucrado)) return false;
      
      return true;
    });
  }, [hallazgosCombinados, filtros]);

  const handleFiltroChange = (campo: keyof FiltrosHallazgo, valor: string) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const handleTipoIdChange = (valor: TipoIdentificacionDTTA | '') => {
    setFiltros(prev => ({
      ...prev,
      tipoIdInvolucrado: valor,
      numeroIdInvolucrado: valor ? prev.numeroIdInvolucrado : '',
    }));
  };

  const limpiarFiltros = () => {
    setFiltros(initialFiltros);
  };

  const removerFiltro = (campo: keyof FiltrosHallazgo) => {
    setFiltros(prev => ({ ...prev, [campo]: '' }));
  };

  const handleBuscar = useCallback(() => {
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 500);
  }, []);

  const getFiltroLabel = (campo: keyof FiltrosHallazgo, valor: string): string => {
    switch (campo) {
      case 'numeroHallazgo': return `N° ${valor}`;
      case 'estado': return valor;
      case 'tipoHallazgo': return valor;
      case 'fechaDesde': return `Desde ${valor}`;
      case 'fechaHasta': return `Hasta ${valor}`;
      default: return valor;
    }
  };

  // Verificar si el hallazgo puede ser gestionado
  const puedeGestionar = (estado: EstadoHallazgo): boolean => {
    return ['Ingresado', 'En Análisis', 'Notificar Denuncia'].includes(estado);
  };

  const handleActions = (row: HallazgoListItem) => {
    const navigationId = row.esExterno && (row as HallazgoProcesado).transactionId 
      ? (row as HallazgoProcesado).transactionId 
      : row.id;

    return (
      <div className="flex flex-col w-full gap-1.5">
        {puedeGestionar(row.estado) ? (
          <CustomButton 
            variant="primary" 
            className="w-full !text-xs !py-1.5 flex items-center justify-center gap-1.5 !bg-emerald-600 hover:!bg-emerald-700"
            onClick={() => navigate(`/hallazgos/${row.id}/gestionar`)}
          >
            <Icon name="FileCheck" className="hidden md:block" size={12} />
            <span>Gestionar</span>
          </CustomButton>
        ) : (
          <CustomButton 
            variant="secondary" 
            className="w-full !text-xs !py-1.5 flex items-center justify-center gap-1.5"
            disabled={row.estado === 'Cerrado' || row.estado === 'Convertido a Denuncia'}
            onClick={() => navigate(`/expediente/${row.id}`)}
          >
            <Icon name="FileText" className="hidden md:block" size={12} />
            <span>Ver Expediente</span>
          </CustomButton>
        )}
        <CustomButton 
          variant="secondary" 
          className="w-full !text-xs !py-1.5 flex items-center justify-center gap-1.5"
          onClick={() => navigate(`/hallazgos/${navigationId}/detalle`)}
        >
          <Icon name="Eye" className="hidden md:block" size={12} />
          <span>Ver Detalle</span>
        </CustomButton>
      </div>
    );
  };

  // Columnas para la tabla de hallazgos
  const columnasHallazgos = [
    { 
      key: 'numeroHallazgo' as const, 
      label: 'N° Hallazgo', 
      sortable: true,
      sticky: true,
      render: (row: HallazgoListItem) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.numeroHallazgo}</span>
          {row.esExterno && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700" title="Hallazgo de origen externo (PFI)">
              <Icon name="Globe" size={10} className="mr-0.5" />
              PFI
            </span>
          )}
        </div>
      )
    },
    { key: 'fechaIngreso' as const, label: 'Fecha Ingreso', sortable: true },
    { 
      key: 'estado' as const, 
      label: 'Estado', 
      sortable: true,
      sticky: true,
      render: (row: HallazgoListItem) => {
        const { variant, muted } = getEstadoVariant(row.estado);
        return (
          <Badge variant={variant} dot size="sm" className={muted ? 'opacity-80' : ''}>
            {row.estado}
          </Badge>
        );
      }
    },
    { 
      key: 'tipoHallazgo' as const, 
      label: 'Tipo', 
      sortable: true,
      render: (row: HallazgoListItem) => (
        <span className={`text-xs font-medium px-2 py-0.5 rounded ${
          row.tipoHallazgo === 'Penal' 
            ? 'bg-red-50 text-red-700' 
            : 'bg-blue-50 text-blue-700'
        }`}>
          {row.tipoHallazgo}
        </span>
      )
    },
    { key: 'aduana' as const, label: 'Aduana', sortable: true, sticky: true },
    { key: 'rutInvolucrado' as const, label: 'RUT/ID Involucrado', sortable: true },
    { key: 'nombreInvolucrado' as const, label: 'Nombre Involucrado', sortable: true },
    { key: 'montoEstimado' as const, label: 'Monto Estimado', sortable: true },
    { 
      key: 'diasVencimiento' as const, 
      label: 'Días Plazo', 
      sortable: true,
      render: (row: HallazgoListItem) => {
        const dias = row.diasVencimiento;
        const variant = getDiasVencimientoBadgeVariant(dias);
        const tooltipText = dias < 0 
          ? `Vencido hace ${Math.abs(dias)} días` 
          : dias === 0 
            ? 'Vence hoy - Acción urgente requerida'
            : `Quedan ${dias} días de plazo`;
        
        return (
          <div className="relative group">
            <Badge variant={variant} pulse={dias < 0} size="sm">
              {dias < 0 ? `${Math.abs(dias)}d venc.` : dias === 0 ? 'Hoy' : `${dias}d`}
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
  const totalInternos = conteoHallazgos.total;
  const totalExternos = conteoExternos.total;
  const estadosChips = [
    { label: 'Total', count: totalInternos + totalExternos, variant: 'neutral' as const },
    { label: 'Ingresados', count: conteoHallazgos.porEstado.ingresado + conteoExternos.porEstado.ingresado, variant: 'info' as const },
    { label: 'En Análisis', count: conteoHallazgos.porEstado.enAnalisis + conteoExternos.porEstado.enAnalisis, variant: 'warning' as const, critical: true },
    { label: 'Por Notificar', count: conteoHallazgos.porEstado.notificarDenuncia + conteoExternos.porEstado.notificarDenuncia, variant: 'danger' as const, critical: true },
    { label: 'Gestionables', count: conteoHallazgos.gestionables, variant: 'success' as const },
  ];

  // Estados para el filtro
  const estadosHallazgo: EstadoHallazgo[] = [
    'Ingresado', 'En Análisis', 'Notificar Denuncia', 'Derivado', 'Cerrado', 'Convertido a Denuncia'
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
              <span className="text-gray-900 font-medium">Hallazgos</span>
            </nav>
            <h1 className="text-2xl font-bold text-gray-900">Listado de Hallazgos (PFI)</h1>
            <p className="text-gray-500 mt-1">
              Gestión y seguimiento de hallazgos de fiscalización
            </p>
          </div>
        </div>

        {/* Alerta informativa */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Icon name="Info" size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-900">Proceso de Gestión de Hallazgos</p>
              <p className="text-sm text-amber-700 mt-1">
                Los hallazgos en estado <strong>"Notificar Denuncia"</strong>, <strong>"En Análisis"</strong> o <strong>"Ingresado"</strong> pueden 
                ser gestionados para convertirse en denuncias formales. Haga clic en <strong>"Gestionar"</strong> para 
                revisar y completar el formulario.
              </p>
            </div>
          </div>
        </div>

        {/* Estadísticas - Prioridad visual solo en críticos */}
        <div className="flex flex-wrap items-center gap-2">
          {estadosChips.map((chip) => (
            <button
              key={chip.label}
              onClick={() => {
                if (chip.label === 'En Análisis') handleFiltroChange('estado', 'En Análisis');
                else if (chip.label === 'Por Notificar') handleFiltroChange('estado', 'Notificar Denuncia');
                else if (chip.label === 'Ingresados') handleFiltroChange('estado', 'Ingresado');
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
          <span className="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 text-sm flex items-center gap-1">
            <Icon name="Globe" size={14} />
            Externos: <strong>{totalExternos}</strong>
          </span>
        </div>

        {/* Card principal */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header azul */}
          <div className="bg-aduana-azul py-3 px-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-white font-medium flex items-center gap-2">
                <Icon name="FileSearch" size={18} />
                Búsqueda de Hallazgos
              </span>
              <div className="flex items-center gap-4 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={mostrarExternos}
                    onChange={(e) => setMostrarExternos(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-aduana-azul focus:ring-aduana-azul"
                  />
                  <span className="text-white/90 text-sm flex items-center gap-1">
                    <Icon name="Globe" size={14} />
                    Incluir externos (PFI)
                  </span>
                </label>
                <span className="text-white/80 text-sm">
                  {hallazgosFiltrados.length} registros encontrados
                </span>
              </div>
            </div>
          </div>

          {/* Filtros básicos */}
          <div className="p-5 bg-white border-b border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <InputField
                label="N° Hallazgo"
                id="numeroHallazgo"
                type="text"
                placeholder="Ej: PFI-2024-00001"
                labelClassName={labelBaseClass}
                containerClassName={inputContainerClass}
                value={filtros.numeroHallazgo}
                onChange={(e) => handleFiltroChange('numeroHallazgo', e.target.value)}
              />
              <div>
                <label htmlFor="estado" className={`${labelBaseClass} mb-1`}>Estado</label>
                <select
                  id="estado"
                  className="form-input min-h-[44px]"
                  value={filtros.estado}
                  onChange={(e) => handleFiltroChange('estado', e.target.value as EstadoHallazgo | '')}
                >
                  <option value="">Seleccione estado...</option>
                  {estadosHallazgo.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="tipoHallazgo" className={`${labelBaseClass} mb-1`}>Tipo</label>
                <select
                  id="tipoHallazgo"
                  className="form-input min-h-[44px]"
                  value={filtros.tipoHallazgo}
                  onChange={(e) => handleFiltroChange('tipoHallazgo', e.target.value)}
                >
                  <option value="">Seleccione tipo...</option>
                  <option value="Penal">Penal</option>
                  <option value="Administrativo">Administrativo</option>
                </select>
              </div>
              <InputField
                label="Fecha desde"
                id="fechaDesde"
                type="date"
                labelClassName={labelBaseClass}
                containerClassName={inputContainerClass}
                value={filtros.fechaDesde}
                onChange={(e) => handleFiltroChange('fechaDesde', e.target.value)}
              />
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
              <InputField
                label="Fecha hasta"
                id="fechaHasta"
                type="date"
                labelClassName={labelBaseClass}
                containerClassName={inputContainerClass}
                value={filtros.fechaHasta}
                onChange={(e) => handleFiltroChange('fechaHasta', e.target.value)}
              />
              <div className="sm:col-span-2 xl:col-span-2">
                <label className={`${labelBaseClass} mb-1`}>ID del Involucrado</label>
                <div className="flex gap-2">
                  <select
                    className="form-input w-28 min-h-[44px]"
                    value={filtros.tipoIdInvolucrado}
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
                    placeholder={filtros.tipoIdInvolucrado ? getPlaceholderPorTipoId(filtros.tipoIdInvolucrado) : 'Seleccione tipo primero'}
                    disabled={!filtros.tipoIdInvolucrado}
                    value={filtros.numeroIdInvolucrado}
                    onChange={(e) => handleFiltroChange('numeroIdInvolucrado', e.target.value)}
                    aria-label="Número de documento"
                  />
                </div>
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
                          {getFiltroLabel(campo as keyof FiltrosHallazgo, valor)}
                          <button
                            onClick={() => removerFiltro(campo as keyof FiltrosHallazgo)}
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
                <span className="font-semibold text-gray-900">{hallazgosFiltrados.length}</span> resultados encontrados
                {mostrarExternos && conteoExternos.total > 0 && (
                  <span className="ml-2 text-indigo-600">
                    ({conteoExternos.total} externos)
                  </span>
                )}
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
                    hallazgosFiltrados.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={hallazgosFiltrados.length === 0}
                  title={hallazgosFiltrados.length === 0 ? 'No hay datos para exportar' : 'Exportar a Excel'}
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
                  <span className="text-sm text-gray-500">Buscando hallazgos...</span>
                </div>
              </div>
            ) : hallazgosFiltrados.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Icon name="FileX" size={48} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-1">No se encontraron hallazgos</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {filtrosActivos > 0 
                    ? 'Intenta ajustar los filtros de búsqueda' 
                    : 'No hay hallazgos registrados en el sistema'}
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
                  headers={columnasHallazgos}
                  data={hallazgosFiltrados}
                  actions={handleActions}
                />
              </div>
            )}
          </div>

          {/* Paginación */}
          {hallazgosFiltrados.length > 0 && (
            <div className="flex flex-col md:flex-row items-center justify-between px-5 py-4 border-t border-gray-100 bg-white gap-3">
              <p className="text-sm text-gray-500">
                Mostrando <strong className="text-gray-700">1</strong> a <strong className="text-gray-700">{Math.min(hallazgosFiltrados.length, 20)}</strong> de <strong className="text-gray-700">{hallazgosFiltrados.length}</strong> registros
                {mostrarExternos && conteoExternos.total > 0 && (
                  <span className="ml-2 text-indigo-600">
                    ({conteoExternos.total} externos)
                  </span>
                )}
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

export default HallazgosList;
