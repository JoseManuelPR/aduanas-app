/**
 * InvolucradosList - Bandeja de Involucrados
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
import { Badge } from "../../components/UI";
import type { BadgeVariant } from "../../components/UI";
import { ERoutePaths } from "../../routes/routes";
import {
  TIPOS_IDENTIFICACION_DTTA,
  getPlaceholderPorTipoId,
  type TipoIdentificacionDTTA,
} from '../../constants/tipos-identificacion';

import {
  involucrados,
  getConteoInvolucrados,
  getTodasLasNotificaciones,
  usuarioActual,
  formatRut,
  type Involucrado,
  type TipoPersona,
  type EstadoInvolucrado,
} from '../../data';

// Tipo de filtros
interface FiltrosInvolucrado {
  tipoId: TipoIdentificacionDTTA | '';
  numeroId: string;
  nombre: string;
  tipoPersona: TipoPersona | '';
  estado: EstadoInvolucrado | '';
}

const initialFiltros: FiltrosInvolucrado = {
  tipoId: '',
  numeroId: '',
  nombre: '',
  tipoPersona: '',
  estado: '',
};

export const InvolucradosList: React.FC = () => {
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState<FiltrosInvolucrado>(initialFiltros);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const labelBaseClass = "block text-sm font-semibold text-gray-800";
  const inputContainerClass = "!flex-col !items-start gap-1 lg:!flex-col lg:!items-start lg:!gap-1";

  const conteoInvolucrados = getConteoInvolucrados();
  const allNotifications = getTodasLasNotificaciones();

  // Contar filtros activos
  const filtrosActivos = useMemo(() => {
    return Object.entries(filtros).filter(([_, value]) => value !== '').length;
  }, [filtros]);

  // Filtrar involucrados
  const involucradosFiltrados = useMemo(() => {
    const normalizarId = (valor: string) => valor.replace(/\./g, '').replace(/-/g, '').toUpperCase();
    return involucrados.filter(inv => {
      if (filtros.tipoId && inv.tipoIdentificacion !== filtros.tipoId) return false;

      const aplicaFiltroId = Boolean(filtros.tipoId && filtros.numeroId);
      if (aplicaFiltroId) {
        const idInv = normalizarId(`${inv.numeroIdentificacion}${inv.digitoVerificador || ''}`);
        if (!idInv.includes(normalizarId(filtros.numeroId))) return false;
      }

      if (filtros.nombre && !inv.nombreCompleto.toLowerCase().includes(filtros.nombre.toLowerCase())) return false;
      if (filtros.tipoPersona && inv.tipoPersona !== filtros.tipoPersona) return false;
      if (filtros.estado && inv.estado !== filtros.estado) return false;
      return true;
    });
  }, [filtros]);

  const handleFiltroChange = (campo: keyof FiltrosInvolucrado, valor: string) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const handleTipoIdChange = (valor: TipoIdentificacionDTTA | '') => {
    setFiltros(prev => ({
      ...prev,
      tipoId: valor,
      numeroId: valor ? prev.numeroId : '',
    }));
  };

  const limpiarFiltros = () => {
    setFiltros(initialFiltros);
  };

  const removerFiltro = (campo: keyof FiltrosInvolucrado) => {
    setFiltros(prev => ({ ...prev, [campo]: '' }));
  };

  const handleBuscar = useCallback(() => {
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 500);
  }, []);

  const getFiltroLabel = (campo: keyof FiltrosInvolucrado, valor: string): string => {
    switch (campo) {
      case 'nombre': return `Nombre: ${valor}`;
      case 'tipoPersona': return valor;
      case 'estado': return valor;
      default: return valor;
    }
  };

  const getRutFormateado = (inv: Involucrado): string => {
    if (inv.tipoIdentificacion === 'RUT') {
      return formatRut(`${inv.numeroIdentificacion}${inv.digitoVerificador || ''}`);
    }
    return inv.numeroIdentificacion;
  };

  const getCantidadProcesos = (inv: Involucrado): number => {
    return (inv.denunciasAsociadas?.length || 0) +
           (inv.cargosAsociados?.length || 0) +
           (inv.girosAsociados?.length || 0) +
           (inv.reclamosAsociados?.length || 0);
  };

  const getEstadoVariant = (estado: EstadoInvolucrado): { variant: BadgeVariant; muted: boolean } => {
    return estado === 'Activo' 
      ? { variant: 'resuelto', muted: true } 
      : { variant: 'default', muted: true };
  };

  const handleActions = (row: Involucrado) => (
    <div className="flex flex-col w-full gap-1.5">
      <CustomButton 
        variant="primary" 
        className="w-full !text-xs !py-1.5 flex items-center justify-center gap-1.5"
        onClick={() => navigate(ERoutePaths.INVOLUCRADOS_DETALLE.replace(':id', row.id))}
      >
        <Icon name="Eye" className="hidden md:block" size={12} />
        <span>Ver Ficha</span>
      </CustomButton>
      <CustomButton 
        variant="secondary" 
        className="w-full !text-xs !py-1.5 flex items-center justify-center gap-1.5"
        onClick={() => navigate(ERoutePaths.INVOLUCRADOS_EDITAR.replace(':id', row.id))}
      >
        <Icon name="Edit" className="hidden md:block" size={12} />
        <span>Editar</span>
      </CustomButton>
    </div>
  );

  const columnasInvolucrados = [
    { 
      key: 'numeroIdentificacion' as const, 
      label: 'ID / RUT', 
      sortable: true,
      sticky: true,
      render: (row: Involucrado) => (
        <div>
          <span className="font-mono text-aduana-azul font-medium">
            {getRutFormateado(row)}
          </span>
          {row.tipoIdentificacion !== 'RUT' && (
            <span className="text-xs text-gray-500 ml-1">({row.tipoIdentificacion})</span>
          )}
        </div>
      )
    },
    { 
      key: 'nombreCompleto' as const, 
      label: 'Nombre / Razón Social', 
      sortable: true,
      render: (row: Involucrado) => (
        <div className="max-w-xs">
          <p className="font-medium truncate">{row.nombreCompleto}</p>
          {row.tipoPersona === 'Jurídica' && row.giro && (
            <p className="text-xs text-gray-500 truncate">{row.giro}</p>
          )}
        </div>
      )
    },
    { 
      key: 'tipoPersona' as const, 
      label: 'Tipo', 
      sortable: true,
      render: (row: Involucrado) => (
        <span className={`text-xs font-medium px-2 py-0.5 rounded ${
          row.tipoPersona === 'Jurídica' 
            ? 'bg-blue-50 text-blue-700' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {row.tipoPersona}
        </span>
      )
    },
    { 
      key: 'email' as const, 
      label: 'Email', 
      sortable: true,
      render: (row: Involucrado) => row.email || '-'
    },
    { 
      key: 'telefono' as const, 
      label: 'Teléfono', 
      sortable: true,
      render: (row: Involucrado) => row.telefono || '-'
    },
    { 
      key: 'estado' as const, 
      label: 'Estado', 
      sortable: true,
      sticky: true,
      render: (row: Involucrado) => {
        const { variant, muted } = getEstadoVariant(row.estado);
        return (
          <Badge variant={variant} dot size="sm" className={muted ? 'opacity-80' : ''}>
            {row.estado}
          </Badge>
        );
      }
    },
    { 
      key: 'denunciasAsociadas' as const, 
      label: 'Procesos', 
      sortable: false,
      render: (row: Involucrado) => {
        const cantidad = getCantidadProcesos(row);
        return cantidad > 0 ? (
          <div className="relative group">
            <Badge variant="proceso" size="sm">{cantidad}</Badge>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              {cantidad} proceso(s) asociado(s)
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        );
      }
    },
  ];

  // Chips de estado
  const estadosChips = [
    { label: 'Total', count: conteoInvolucrados.total, variant: 'neutral' as const },
    { label: 'Activos', count: conteoInvolucrados.activos, variant: 'success' as const },
    { label: 'P. Naturales', count: conteoInvolucrados.personasNaturales, variant: 'info' as const },
    { label: 'P. Jurídicas', count: conteoInvolucrados.personasJuridicas, variant: 'info' as const },
    { label: 'Con procesos', count: conteoInvolucrados.conProcesos, variant: 'warning' as const, critical: true },
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
              <span className="text-gray-900 font-medium">Involucrados</span>
            </nav>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Involucrados</h1>
            <p className="text-gray-500 mt-1">
              Administración centralizada de involucrados en procesos
            </p>
          </div>
          <CustomButton 
            variant="primary"
            className="flex items-center gap-2"
            onClick={() => navigate(ERoutePaths.INVOLUCRADOS_NUEVO)}
          >
            <Icon name="Plus" size={16} />
            Nuevo Involucrado
          </CustomButton>
        </div>

        {/* Estadísticas */}
        <div className="flex flex-wrap items-center gap-2">
          {estadosChips.map((chip) => (
            <button
              key={chip.label}
              onClick={() => {
                if (chip.label === 'Activos') handleFiltroChange('estado', 'Activo');
                else if (chip.label === 'P. Naturales') handleFiltroChange('tipoPersona', 'Natural');
                else if (chip.label === 'P. Jurídicas') handleFiltroChange('tipoPersona', 'Jurídica');
                else limpiarFiltros();
              }}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                flex items-center gap-2 min-w-[44px] min-h-[44px]
                ${chip.critical 
                  ? 'bg-amber-100 text-amber-800 border-2 border-amber-300 hover:bg-amber-200 shadow-sm'
                  : chip.variant === 'neutral'
                    ? 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    : chip.variant === 'success'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                }
              `}
            >
              {chip.critical && chip.count > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              )}
              <span>{chip.label}:</span>
              <strong className="tabular-nums">{chip.count}</strong>
            </button>
          ))}
        </div>

        {/* Card principal */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header azul */}
          <div className="bg-aduana-azul py-3 px-6">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium flex items-center gap-2">
                <Icon name="Users" size={18} />
                Búsqueda de Involucrados
              </span>
              <span className="text-white/80 text-sm">
                {involucradosFiltrados.length} de {involucrados.length} registros
              </span>
            </div>
          </div>

          {/* Filtros básicos */}
          <div className="p-5 bg-white border-b border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className={`${labelBaseClass} mb-1`}>Documento de identidad</label>
                <div className="flex gap-2">
                  <select
                    className="form-input w-28 min-h-[44px]"
                    value={filtros.tipoId}
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
                    placeholder={filtros.tipoId ? getPlaceholderPorTipoId(filtros.tipoId) : 'Seleccione tipo primero'}
                    disabled={!filtros.tipoId}
                    value={filtros.numeroId}
                    onChange={(e) => handleFiltroChange('numeroId', e.target.value)}
                    aria-label="Número de documento"
                  />
                </div>
              </div>
              <InputField
                label="Nombre / Razón Social"
                id="filtroNombre"
                type="text"
                placeholder="Buscar por nombre..."
                labelClassName={labelBaseClass}
                containerClassName={inputContainerClass}
                value={filtros.nombre}
                onChange={(e) => handleFiltroChange('nombre', e.target.value)}
              />
              <div>
                <label htmlFor="tipoPersona" className={`${labelBaseClass} mb-1`}>Tipo Persona</label>
                <select 
                  id="tipoPersona"
                  className="form-input min-h-[44px]"
                  value={filtros.tipoPersona}
                  onChange={(e) => handleFiltroChange('tipoPersona', e.target.value as TipoPersona | '')}
                >
                  <option value="">Seleccione tipo...</option>
                  <option value="Natural">Persona Natural</option>
                  <option value="Jurídica">Persona Jurídica</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filtros avanzados - colapsables */}
          <div 
            className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${showAdvancedFilters ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}
            `}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 p-5 bg-gray-50 border-b border-gray-100">
              <div>
                <label htmlFor="estado" className={`${labelBaseClass} mb-1`}>Estado</label>
                <select 
                  id="estado"
                  className="form-input min-h-[44px]"
                  value={filtros.estado}
                  onChange={(e) => handleFiltroChange('estado', e.target.value as EstadoInvolucrado | '')}
                >
                  <option value="">Seleccione estado...</option>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
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
                          {getFiltroLabel(campo as keyof FiltrosInvolucrado, valor)}
                          <button
                            onClick={() => removerFiltro(campo as keyof FiltrosInvolucrado)}
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
                <span className="font-semibold text-gray-900">{involucradosFiltrados.length}</span> resultados encontrados
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
                    involucradosFiltrados.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={involucradosFiltrados.length === 0}
                  title={involucradosFiltrados.length === 0 ? 'No hay datos para exportar' : 'Exportar a Excel'}
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
                  <span className="text-sm text-gray-500">Buscando involucrados...</span>
                </div>
              </div>
            ) : involucradosFiltrados.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Icon name="FileX" size={48} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-1">No se encontraron involucrados</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {filtrosActivos > 0 
                    ? 'Intenta ajustar los filtros de búsqueda' 
                    : 'No hay involucrados registrados en el sistema'}
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
                  headers={columnasInvolucrados}
                  data={involucradosFiltrados}
                  actions={handleActions}
                />
              </div>
            )}
          </div>

          {/* Paginación */}
          {involucradosFiltrados.length > 0 && (
            <div className="flex flex-col md:flex-row items-center justify-between px-5 py-4 border-t border-gray-100 bg-white gap-3">
              <p className="text-sm text-gray-500">
                Mostrando <strong className="text-gray-700">1</strong> a <strong className="text-gray-700">{Math.min(involucradosFiltrados.length, 20)}</strong> de <strong className="text-gray-700">{involucradosFiltrados.length}</strong> registros
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

export default InvolucradosList;
