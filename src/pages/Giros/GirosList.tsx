/**
 * GirosList - Bandeja de Giros
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import React, { useState, useMemo, useCallback } from 'react';
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

// Datos centralizados
import {
  giros,
  getConteoGiros,
  getTodasLasNotificaciones,
  usuarioActual,
  formatMonto,
  aduanas,
  type Giro,
  type EstadoGiro,
  type TipoGiro,
  type OrigenGiro,
} from '../../data';
import {
  TIPOS_IDENTIFICACION_DTTA,
  getPlaceholderPorTipoId,
  type TipoIdentificacionDTTA,
} from '../../constants/tipos-identificacion';

// Tipo de filtros
interface FiltrosGiro {
  numeroGiro: string;
  tipoIdDeudor: TipoIdentificacionDTTA | '';
  numeroIdDeudor: string;
  estado: EstadoGiro | '';
  tipo: TipoGiro | '';
  origen: OrigenGiro | '';
  aduana: string;
  fechaDesde: string;
  fechaHasta: string;
}

const initialFiltros: FiltrosGiro = {
  numeroGiro: '',
  tipoIdDeudor: '',
  numeroIdDeudor: '',
  estado: '',
  tipo: '',
  origen: '',
  aduana: '',
  fechaDesde: '',
  fechaHasta: '',
};

export const GirosList: React.FC = () => {
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState<FiltrosGiro>(initialFiltros);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const labelBaseClass = "block text-sm font-semibold text-gray-800";
  const inputContainerClass = "!flex-col !items-start gap-1 lg:!flex-col lg:!items-start lg:!gap-1";

  // Obtener conteos desde datos centralizados
  const conteoGiros = getConteoGiros();
  const allNotifications = getTodasLasNotificaciones();

  // Contar filtros activos
  const filtrosActivos = useMemo(() => {
    return Object.entries(filtros).filter(([_, value]) => value !== '').length;
  }, [filtros]);

  // Filtrar giros
  const girosFiltrados = useMemo(() => {
    return giros.filter(giro => {
      if (filtros.numeroGiro && !giro.numeroGiro.toLowerCase().includes(filtros.numeroGiro.toLowerCase())) {
        return false;
      }
      const aplicaFiltroId = Boolean(filtros.tipoIdDeudor && filtros.numeroIdDeudor);
      if (aplicaFiltroId) {
        const tipoIdGiro = giro.tipoIdDeudor || 'RUT';
        if (tipoIdGiro !== filtros.tipoIdDeudor) return false;
        if (!giro.rutDeudor.includes(filtros.numeroIdDeudor)) return false;
      }
      if (filtros.estado && giro.estado !== filtros.estado) return false;
      if (filtros.tipo && giro.tipoGiro !== filtros.tipo) return false;
      if (filtros.origen && giro.origenGiro !== filtros.origen) return false;
      if (filtros.aduana && giro.aduana !== filtros.aduana && giro.codigoAduana !== filtros.aduana) return false;
      return true;
    });
  }, [filtros]);

  const handleFiltroChange = (campo: keyof FiltrosGiro, valor: string) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const handleTipoIdChange = (valor: TipoIdentificacionDTTA | '') => {
    setFiltros(prev => ({
      ...prev,
      tipoIdDeudor: valor,
      numeroIdDeudor: valor ? prev.numeroIdDeudor : '',
    }));
  };

  const limpiarFiltros = () => {
    setFiltros(initialFiltros);
  };

  const removerFiltro = (campo: keyof FiltrosGiro) => {
    setFiltros(prev => ({ ...prev, [campo]: '' }));
  };

  const handleBuscar = useCallback(() => {
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 500);
  }, []);

  const getFiltroLabel = (campo: keyof FiltrosGiro, valor: string): string => {
    switch (campo) {
      case 'numeroGiro': return `N° ${valor}`;
      case 'estado': return valor;
      case 'tipo': return valor;
      case 'origen': return valor === 'CARGO' ? 'Desde Cargo' : valor === 'DENUNCIA' ? 'Desde Denuncia' : 'Manual';
      case 'aduana': return valor;
      case 'fechaDesde': return `Desde ${valor}`;
      case 'fechaHasta': return `Hasta ${valor}`;
      default: return valor;
    }
  };

  // Obtener badge variant según estado
  const getEstadoVariant = (estado: string): { variant: BadgeVariant; muted: boolean } => {
    switch (estado) {
      case 'Pagado': return { variant: 'resuelto', muted: true };
      case 'Parcialmente Pagado': return { variant: 'warning', muted: false };
      case 'Vencido': return { variant: 'vencido', muted: false };
      case 'Anulado': return { variant: 'rechazado', muted: true };
      case 'Notificado': return { variant: 'info', muted: true };
      default: return { variant: 'proceso', muted: true };
    }
  };

  const handleActions = (row: Giro) => (
    <div className="flex flex-col w-full gap-1.5">
      <CustomButton 
        variant="primary" 
        className="w-full !text-xs !py-1.5 flex items-center justify-center gap-1.5"
        onClick={() => navigate(`/giros/${row.id}`)}
      >
        <Icon name="Eye" className="hidden md:block" size={12} />
        <span>Ver Detalle</span>
      </CustomButton>
      {(row.estado === 'Emitido' || row.estado === 'Notificado' || row.estado === 'Vencido' || row.estado === 'Parcialmente Pagado') && (
        <CustomButton 
          variant="primary" 
          className="w-full !text-xs !py-1.5 flex items-center justify-center gap-1.5 !bg-emerald-600 hover:!bg-emerald-700"
          onClick={() => navigate(`/giros/${row.id}`)}
        >
          <Icon name="CreditCard" className="hidden md:block" size={12} />
          <span>Registrar Pago</span>
        </CustomButton>
      )}
    </div>
  );

  // Columnas para la tabla
  const columnasGiros = [
    { 
      key: 'numeroGiro' as const, 
      label: 'N° Giro', 
      sortable: true,
      sticky: true,
      render: (row: Giro) => (
        <button 
          onClick={() => navigate(`/giros/${row.id}`)}
          className="font-semibold text-aduana-azul hover:underline"
        >
          {row.numeroGiro}
        </button>
      )
    },
    { 
      key: 'tipoGiro' as const, 
      label: 'Tipo', 
      sortable: true,
      render: (row: Giro) => (
        <span className={`text-xs font-medium px-2 py-0.5 rounded ${
          row.tipoGiro === 'F09' 
            ? 'bg-blue-50 text-blue-700' 
            : row.tipoGiro === 'F16'
              ? 'bg-amber-50 text-amber-700'
              : 'bg-purple-50 text-purple-700'
        }`}>
          {row.tipoGiro}
        </span>
      )
    },
    { 
      key: 'origenGiro' as const, 
      label: 'Origen', 
      sortable: true,
      render: (row: Giro) => (
        <span className="text-sm">
          {row.origenGiro === 'CARGO' ? 'Cargo' : row.origenGiro === 'DENUNCIA' ? 'Denuncia' : 'Manual'}
          {row.numeroEntidadOrigen && (
            <span className="text-xs text-gray-500 block">{row.numeroEntidadOrigen}</span>
          )}
        </span>
      )
    },
    { key: 'fechaEmision' as const, label: 'Emisión', sortable: true },
    { key: 'fechaVencimiento' as const, label: 'Vencimiento', sortable: true },
    { 
      key: 'estado' as const, 
      label: 'Estado', 
      sortable: true,
      sticky: true,
      render: (row: Giro) => {
        const { variant, muted } = getEstadoVariant(row.estado);
        return (
          <Badge variant={variant} dot pulse={row.estado === 'Vencido'} size="sm" className={muted ? 'opacity-80' : ''}>
            {row.estado}
          </Badge>
        );
      }
    },
    { 
      key: 'montoTotal' as const, 
      label: 'Monto Total', 
      sortable: true,
      render: (row: Giro) => (
        <span className="font-semibold text-aduana-azul">{row.montoTotal}</span>
      )
    },
    { 
      key: 'montoPagado' as const, 
      label: 'Pagado', 
      sortable: true,
      render: (row: Giro) => (
        <span className={`font-medium ${(row.montoPagado || 0) > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>
          {formatMonto(row.montoPagado || 0)}
        </span>
      )
    },
    { 
      key: 'saldoPendiente' as const, 
      label: 'Saldo', 
      sortable: true,
      render: (row: Giro) => {
        const saldo = row.saldoPendiente ?? 0;
        return (
          <span className={`font-medium ${saldo > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {formatMonto(saldo)}
          </span>
        );
      }
    },
    { 
      key: 'emitidoA' as const, 
      label: 'Deudor', 
      sortable: true,
      render: (row: Giro) => (
        <div>
          <span className="truncate max-w-[120px] block font-medium" title={row.emitidoA}>
            {row.emitidoA}
          </span>
          <span className="text-xs text-gray-500">
            {(row.tipoIdDeudor || 'RUT')}: {row.rutDeudor}
          </span>
        </div>
      )
    },
    { 
      key: 'diasVencimiento' as const, 
      label: 'Plazo', 
      sortable: true,
      render: (row: Giro) => {
        const dias = row.diasVencimiento ?? 0;
        if (row.estado === 'Pagado' || row.estado === 'Anulado') {
          return <span className="text-gray-400">-</span>;
        }
        
        const tooltipText = dias < 0 
          ? `Vencido hace ${Math.abs(dias)} días` 
          : dias === 0 
            ? 'Vence hoy - Acción urgente requerida'
            : `Quedan ${dias} días de plazo`;
        
        return (
          <div className="relative group">
            <Badge 
              variant={dias < 0 ? 'vencido' : dias <= 5 ? 'warning' : 'info'} 
              pulse={dias < 0}
              size="sm"
            >
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

  // Estados para el filtro
  const estadosGiro: EstadoGiro[] = [
    'Emitido', 'Notificado', 'Pagado', 'Parcialmente Pagado', 'Vencido', 'Anulado'
  ];

  // Chips de estado con prioridad visual
  const estadosChips = [
    { label: 'Total', count: conteoGiros.total, variant: 'neutral' as const },
    { label: 'Pendientes', count: conteoGiros.pendientes, variant: 'warning' as const, critical: true },
    { label: 'Vencidos', count: conteoGiros.vencidos, variant: 'danger' as const, critical: true },
    { label: 'Pagados', count: conteoGiros.pagados, variant: 'success' as const },
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
              <span className="text-gray-900 font-medium">Giros</span>
            </nav>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Giros</h1>
            <p className="text-gray-500 mt-1">
              Emisión, seguimiento y recaudación de giros (F09/F16/F17)
            </p>
          </div>
          <CustomButton 
            variant="primary"
            className="flex items-center gap-2"
            onClick={() => navigate(ERoutePaths.GIROS_NUEVO)}
          >
            <Icon name="Plus" size={16} />
            Emitir Giro
          </CustomButton>
        </div>

        {/* Estadísticas - Prioridad visual solo en críticos */}
        <div className="flex flex-wrap items-center gap-2">
          {estadosChips.map((chip) => (
            <button
              key={chip.label}
              onClick={() => {
                if (chip.label === 'Pendientes') handleFiltroChange('estado', 'Emitido');
                else if (chip.label === 'Vencidos') handleFiltroChange('estado', 'Vencido');
                else if (chip.label === 'Pagados') handleFiltroChange('estado', 'Pagado');
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
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
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
          {/* Header azul */}
          <div className="bg-aduana-azul py-3 px-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-white font-medium flex items-center gap-2">
                <Icon name="Receipt" size={18} />
                Bandeja de Giros
              </span>
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-white/80 text-sm flex items-center gap-2">
                  <span className="bg-blue-500 px-2 py-0.5 rounded text-xs">F09</span> Cargo
                </span>
                <span className="text-white/80 text-sm flex items-center gap-2">
                  <span className="bg-amber-500 px-2 py-0.5 rounded text-xs">F16</span> Denuncia
                </span>
                <span className="text-white/80 text-sm flex items-center gap-2">
                  <span className="bg-purple-500 px-2 py-0.5 rounded text-xs">F17</span> Otros
                </span>
                <span className="text-white/80 text-sm">
                  {girosFiltrados.length} de {giros.length} registros
                </span>
              </div>
            </div>
          </div>

          {/* Filtros básicos */}
          <div className="p-5 bg-white border-b border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <InputField
                label="N° Giro"
                id="nroGiro"
                type="text"
                placeholder="Ej: F09-2024-00001"
                labelClassName={labelBaseClass}
                containerClassName={inputContainerClass}
                value={filtros.numeroGiro}
                onChange={(e) => handleFiltroChange('numeroGiro', e.target.value)}
              />
              <div>
                <label htmlFor="tipo" className={`${labelBaseClass} mb-1`}>Tipo</label>
                <select
                  id="tipo"
                  value={filtros.tipo}
                  onChange={(e) => handleFiltroChange('tipo', e.target.value as TipoGiro | '')}
                  className="form-input min-h-[44px]"
                >
                  <option value="">Seleccione tipo...</option>
                  <option value="F09">F09 - Desde Cargo</option>
                  <option value="F16">F16 - Desde Denuncia</option>
                  <option value="F17">F17 - Otros</option>
                </select>
              </div>
              <div>
                <label htmlFor="estado" className={`${labelBaseClass} mb-1`}>Estado</label>
                <select
                  id="estado"
                  value={filtros.estado}
                  onChange={(e) => handleFiltroChange('estado', e.target.value as EstadoGiro | '')}
                  className="form-input min-h-[44px]"
                >
                  <option value="">Seleccione estado...</option>
                  {estadosGiro.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="origen" className={`${labelBaseClass} mb-1`}>Origen</label>
                <select
                  id="origen"
                  value={filtros.origen}
                  onChange={(e) => handleFiltroChange('origen', e.target.value as OrigenGiro | '')}
                  className="form-input min-h-[44px]"
                >
                  <option value="">Seleccione origen...</option>
                  <option value="CARGO">Desde Cargo</option>
                  <option value="DENUNCIA">Desde Denuncia</option>
                  <option value="MANUAL">Manual</option>
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
              <div>
                <label htmlFor="aduana" className={`${labelBaseClass} mb-1`}>Aduana</label>
                <select
                  id="aduana"
                  value={filtros.aduana}
                  onChange={(e) => handleFiltroChange('aduana', e.target.value)}
                  className="form-input min-h-[44px]"
                >
                  <option value="">Seleccione aduana...</option>
                  {aduanas.map(aduana => (
                    <option key={aduana.id} value={aduana.nombre}>{aduana.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2 xl:col-span-1">
                <label className={`${labelBaseClass} mb-1`}>ID del Deudor</label>
                <div className="flex gap-2">
                  <select
                    className="form-input w-24 min-h-[44px]"
                    value={filtros.tipoIdDeudor}
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
                    placeholder={filtros.tipoIdDeudor ? getPlaceholderPorTipoId(filtros.tipoIdDeudor) : 'Tipo primero'}
                    disabled={!filtros.tipoIdDeudor}
                    value={filtros.numeroIdDeudor}
                    onChange={(e) => handleFiltroChange('numeroIdDeudor', e.target.value)}
                    aria-label="Número de documento"
                  />
                </div>
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
              <InputField
                label="Fecha hasta"
                id="fechaHasta"
                type="date"
                labelClassName={labelBaseClass}
                containerClassName={inputContainerClass}
                value={filtros.fechaHasta}
                onChange={(e) => handleFiltroChange('fechaHasta', e.target.value)}
              />
            </div>
          </div>

          {/* Barra de acciones */}
          <div className="flex flex-col gap-3 px-5 py-4 bg-white border-b border-gray-100">
            <div className="flex flex-wrap items-center gap-3">
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
                          {getFiltroLabel(campo as keyof FiltrosGiro, valor)}
                          <button
                            onClick={() => removerFiltro(campo as keyof FiltrosGiro)}
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

            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{girosFiltrados.length}</span> resultados encontrados
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
                    girosFiltrados.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={girosFiltrados.length === 0}
                  title={girosFiltrados.length === 0 ? 'No hay datos para exportar' : 'Exportar a Excel'}
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
                  <span className="text-sm text-gray-500">Buscando giros...</span>
                </div>
              </div>
            ) : girosFiltrados.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Icon name="FileX" size={48} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-1">No se encontraron giros</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {filtrosActivos > 0 
                    ? 'Intenta ajustar los filtros de búsqueda' 
                    : 'No hay giros registrados en el sistema'}
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
                  headers={columnasGiros}
                  data={girosFiltrados}
                  actions={handleActions}
                />
              </div>
            )}
          </div>

          {/* Paginación */}
          {girosFiltrados.length > 0 && (
            <div className="flex flex-col md:flex-row items-center justify-between px-5 py-4 border-t border-gray-100 bg-white gap-3">
              <p className="text-sm text-gray-500">
                Mostrando <strong className="text-gray-700">1</strong> a <strong className="text-gray-700">{Math.min(girosFiltrados.length, 20)}</strong> de <strong className="text-gray-700">{girosFiltrados.length}</strong> registros
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

export default GirosList;
