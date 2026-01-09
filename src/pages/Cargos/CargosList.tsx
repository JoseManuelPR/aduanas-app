/**
 * CargosList - Bandeja de Cargos
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
import { Badge, getDiasVencimientoBadgeVariant } from "../../components/UI";
import type { BadgeVariant } from "../../components/UI";
import { ERoutePaths } from "../../routes/routes";

// Datos centralizados
import {
  cargos,
  getConteoCargos,
  formatMonto,
  getTodasLasNotificaciones,
  usuarioActual,
  aduanas,
  type Cargo,
  type EstadoCargo,
  type OrigenCargo,
} from '../../data';
import {
  TIPOS_IDENTIFICACION_DTTA,
  getPlaceholderPorTipoId,
  type TipoIdentificacionDTTA,
} from '../../constants/tipos-identificacion';

// Tipo de filtros
interface FiltrosCargo {
  numeroCargo: string;
  tipoIdDeudor: TipoIdentificacionDTTA | '';
  numeroIdDeudor: string;
  estado: EstadoCargo | '';
  aduana: string;
  origen: OrigenCargo | '';
  fechaDesde: string;
  fechaHasta: string;
  montoMinimo: string;
  montoMaximo: string;
}

const initialFiltros: FiltrosCargo = {
  numeroCargo: '',
  tipoIdDeudor: '',
  numeroIdDeudor: '',
  estado: '',
  aduana: '',
  origen: '',
  fechaDesde: '',
  fechaHasta: '',
  montoMinimo: '',
  montoMaximo: '',
};

export const CargosList: React.FC = () => {
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState<FiltrosCargo>(initialFiltros);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const labelBaseClass = "block text-sm font-semibold text-gray-800";
  const inputContainerClass = "!flex-col !items-start gap-1 lg:!flex-col lg:!items-start lg:!gap-1";

  // Obtener conteos desde datos centralizados
  const conteoCargos = getConteoCargos();
  const allNotifications = getTodasLasNotificaciones();

  // Contar filtros activos
  const filtrosActivos = useMemo(() => {
    return Object.entries(filtros).filter(([_, value]) => value !== '').length;
  }, [filtros]);

  // Filtrar cargos
  const cargosFiltrados = useMemo(() => {
    return cargos.filter(cargo => {
      if (filtros.numeroCargo && !cargo.numeroCargo.toLowerCase().includes(filtros.numeroCargo.toLowerCase())) {
        return false;
      }
      const aplicaFiltroId = Boolean(filtros.tipoIdDeudor && filtros.numeroIdDeudor);
      if (aplicaFiltroId && !cargo.rutDeudor.includes(filtros.numeroIdDeudor)) {
        return false;
      }
      if (filtros.estado && cargo.estado !== filtros.estado) {
        return false;
      }
      if (filtros.aduana && cargo.aduana !== filtros.aduana && cargo.codigoAduana !== filtros.aduana) {
        return false;
      }
      if (filtros.origen && cargo.origen !== filtros.origen) {
        return false;
      }
      if (filtros.montoMinimo) {
        const monto = parseInt(cargo.montoTotal.replace(/[$,.]/g, ''));
        if (monto < parseInt(filtros.montoMinimo)) return false;
      }
      if (filtros.montoMaximo) {
        const monto = parseInt(cargo.montoTotal.replace(/[$,.]/g, ''));
        if (monto > parseInt(filtros.montoMaximo)) return false;
      }
      return true;
    });
  }, [filtros]);

  const handleFiltroChange = (campo: keyof FiltrosCargo, valor: string) => {
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

  const removerFiltro = (campo: keyof FiltrosCargo) => {
    setFiltros(prev => ({ ...prev, [campo]: '' }));
  };

  const handleBuscar = useCallback(() => {
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 500);
  }, []);

  const getFiltroLabel = (campo: keyof FiltrosCargo, valor: string): string => {
    switch (campo) {
      case 'numeroCargo': return `N° ${valor}`;
      case 'estado': return valor;
      case 'aduana': return valor;
      case 'origen': return valor === 'DENUNCIA' ? 'Denuncia' : valor === 'TRAMITE_ADUANERO' ? 'Trámite' : 'Otro';
      case 'fechaDesde': return `Desde ${valor}`;
      case 'fechaHasta': return `Hasta ${valor}`;
      default: return valor;
    }
  };

  // Función para obtener variant de estado
  const getEstadoVariant = (estado: string): { variant: BadgeVariant; muted: boolean } => {
    const estadoLower = estado.toLowerCase();
    if (estadoLower.includes('vencid') || estadoLower.includes('rechazad') || estadoLower.includes('anulad')) 
      return { variant: 'vencido', muted: false };
    if (estadoLower.includes('cerrad') || estadoLower.includes('aprobad')) 
      return { variant: 'resuelto', muted: true };
    if (estadoLower.includes('borrador')) return { variant: 'default', muted: true };
    return { variant: 'proceso', muted: true };
  };

  const handleActions = (row: Cargo) => {
    const puedeGenerarGiro = row.estado === 'Emitido' || row.estado === 'Aprobado' || row.estado === 'Notificado';
    
    return (
      <div className="flex flex-col w-full gap-1.5">
        <CustomButton 
          variant="secondary" 
          className="w-full !text-xs !py-1.5 flex items-center justify-center gap-1.5"
          onClick={() => navigate(`/cargos/${row.id}/editar`)}
        >
          <Icon name="Edit" size={12} />
          <span>Editar</span>
        </CustomButton>
        {puedeGenerarGiro && (
          <CustomButton 
            variant="primary" 
            className="w-full !text-xs !py-1.5 flex items-center justify-center gap-1.5"
            onClick={() => navigate(`/giros/nuevo?cargoId=${row.id}`)}
          >
            <Icon name="Receipt" size={12} />
            <span>Giro</span>
          </CustomButton>
        )}
      </div>
    );
  };

  // Columnas para la tabla - Estado+Plazo como anclas visuales
  const columnasCargos = [
    { 
      key: 'numeroCargo' as const, 
      label: 'N° Cargo', 
      sortable: true,
      sticky: true,
      render: (row: Cargo) => (
        <div className="flex flex-col">
          <button 
            onClick={() => navigate(`/cargos/${row.id}`)}
            className="font-semibold text-aduana-azul hover:underline text-left"
          >
            {row.numeroCargo}
          </button>
          <span className="text-[10px] text-gray-400">{row.fechaIngreso}</span>
        </div>
      )
    },
    { 
      key: 'estado' as const, 
      label: 'Estado / Plazo', 
      sortable: true,
      sticky: true,
      render: (row: Cargo) => {
        const { variant, muted } = getEstadoVariant(row.estado);
        const dias = row.diasVencimiento;
        const plazoVariant = getDiasVencimientoBadgeVariant(dias);
        const esVencido = dias < 0;
        
        return (
          <div className="flex flex-col gap-1">
            <Badge variant={variant} dot size="sm" className={muted ? 'opacity-80' : ''}>
              {row.estado}
            </Badge>
            <Badge variant={plazoVariant} pulse={esVencido} size="sm">
              {dias < 0 ? `${Math.abs(dias)}d vencido` : dias === 0 ? 'Hoy' : `${dias}d`}
            </Badge>
          </div>
        );
      }
    },
    { 
      key: 'origen' as const, 
      label: 'Origen', 
      sortable: true,
      render: (row: Cargo) => (
        <span className={`text-xs font-medium px-2 py-0.5 rounded ${
          row.origen === 'DENUNCIA' 
            ? 'bg-blue-50 text-blue-700' 
            : row.origen === 'TRAMITE_ADUANERO'
              ? 'bg-amber-50 text-amber-700'
              : 'bg-gray-100 text-gray-600'
        }`}>
          {row.origen === 'DENUNCIA' ? 'Denuncia' : row.origen === 'TRAMITE_ADUANERO' ? 'Trámite' : 'Otro'}
        </span>
      )
    },
    { key: 'aduana' as const, label: 'Aduana', sortable: true },
    { 
      key: 'nombreDeudor' as const, 
      label: 'Deudor', 
      sortable: true,
      render: (row: Cargo) => (
        <div className="flex flex-col">
          <span className="truncate max-w-[150px] text-sm" title={row.nombreDeudor}>
            {row.nombreDeudor}
          </span>
          <span className="text-[10px] text-gray-400">{row.rutDeudor}</span>
        </div>
      )
    },
    { 
      key: 'montoTotal' as const, 
      label: 'Monto', 
      sortable: true,
      render: (row: Cargo) => (
        <span className="font-semibold text-aduana-azul whitespace-nowrap">{row.montoTotal}</span>
      )
    },
    { 
      key: 'denunciaNumero' as const, 
      label: 'Ref.', 
      sortable: true,
      render: (row: Cargo) => row.denunciaNumero ? (
        <button 
          onClick={() => navigate(`/denuncias/${row.denunciaAsociada}`)}
          className="text-blue-600 hover:underline text-xs"
        >
          {row.denunciaNumero}
        </button>
      ) : <span className="text-gray-300">—</span>
    },
  ];

  // Estados para el filtro
  const estadosCargo: EstadoCargo[] = [
    'Borrador', 'Observado', 'Pendiente Aprobación', 'En Revisión', 
    'Emitido', 'Aprobado', 'Rechazado', 'Notificado', 'Cerrado', 'Anulado'
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
              <span className="text-gray-900 font-medium">Cargos</span>
            </nav>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Cargos</h1>
            <p className="text-gray-500 mt-1">
              Determinación de deuda y gestión de cargos administrativos
            </p>
          </div>
          <CustomButton 
            variant="primary"
            className="flex items-center gap-2"
            onClick={() => navigate(ERoutePaths.CARGOS_NUEVO)}
          >
            <Icon name="Plus" size={16} />
            Nuevo Cargo
          </CustomButton>
        </div>

        {/* Estadísticas - Prioridad visual solo en críticos */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: 'Total', count: conteoCargos.total, variant: 'neutral' as const },
            { label: 'Pendientes', count: conteoCargos.pendientes, variant: 'warning' as const, critical: true },
            { label: 'Vencidos', count: conteoCargos.vencidos, variant: 'danger' as const, critical: true },
            { label: 'Emitidos', count: conteoCargos.aprobados, variant: 'success' as const },
          ].map((chip) => (
            <button
              key={chip.label}
              onClick={() => {
                if (chip.label === 'Pendientes') handleFiltroChange('estado', 'Pendiente Aprobación');
                else if (chip.label === 'Vencidos') handleFiltroChange('estado', 'Observado');
                else if (chip.label === 'Emitidos') handleFiltroChange('estado', 'Emitido');
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
          <span className="px-3 py-2 rounded-lg bg-blue-50 text-aduana-azul border border-blue-100 text-sm">
            Monto Total: <strong>{formatMonto(conteoCargos.montoTotal)}</strong>
          </span>
        </div>

        {/* Card principal */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header azul */}
          <div className="bg-aduana-azul py-3 px-6">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium flex items-center gap-2">
                <Icon name="DollarSign" size={18} />
                Bandeja de Cargos
              </span>
              <span className="text-white/80 text-sm">
                {cargosFiltrados.length} de {cargos.length} registros
              </span>
            </div>
          </div>

          {/* Filtros básicos */}
          <div className="p-5 bg-white border-b border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <InputField
                label="N° Cargo"
                id="nroCargo"
                type="text"
                placeholder="Ej: CAR-2024-00001"
                labelClassName={labelBaseClass}
                containerClassName={inputContainerClass}
                value={filtros.numeroCargo}
                onChange={(e) => handleFiltroChange('numeroCargo', e.target.value)}
              />
              <div>
                <label htmlFor="estado" className={`${labelBaseClass} mb-1`}>Estado</label>
                <select
                  id="estado"
                  value={filtros.estado}
                  onChange={(e) => handleFiltroChange('estado', e.target.value as EstadoCargo | '')}
                  className="form-input min-h-[44px]"
                >
                  <option value="">Seleccione un estado...</option>
                  {estadosCargo.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="aduana" className={`${labelBaseClass} mb-1`}>Aduana</label>
                <select
                  id="aduana"
                  value={filtros.aduana}
                  onChange={(e) => handleFiltroChange('aduana', e.target.value)}
                  className="form-input min-h-[44px]"
                >
                  <option value="">Seleccione una aduana...</option>
                  {aduanas.map(aduana => (
                    <option key={aduana.id} value={aduana.nombre}>{aduana.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="origen" className={`${labelBaseClass} mb-1`}>Origen</label>
                <select
                  id="origen"
                  value={filtros.origen}
                  onChange={(e) => handleFiltroChange('origen', e.target.value as OrigenCargo | '')}
                  className="form-input min-h-[44px]"
                >
                  <option value="">Seleccione origen...</option>
                  <option value="DENUNCIA">Denuncia</option>
                  <option value="TRAMITE_ADUANERO">Trámite Aduanero</option>
                  <option value="OTRO">Otro</option>
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
                <label className={`${labelBaseClass} mb-1`}>ID del Deudor</label>
                <div className="flex gap-2">
                  <select
                    className="form-input w-28 min-h-[44px]"
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
                    placeholder={filtros.tipoIdDeudor ? getPlaceholderPorTipoId(filtros.tipoIdDeudor) : 'Seleccione tipo primero'}
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
              <InputField
                label="Monto desde ($)"
                id="montoMinimo"
                type="number"
                placeholder="0"
                labelClassName={labelBaseClass}
                containerClassName={inputContainerClass}
                value={filtros.montoMinimo}
                onChange={(e) => handleFiltroChange('montoMinimo', e.target.value)}
              />
              <InputField
                label="Monto hasta ($)"
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
                          {getFiltroLabel(campo as keyof FiltrosCargo, valor)}
                          <button
                            onClick={() => removerFiltro(campo as keyof FiltrosCargo)}
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
                <span className="font-semibold text-gray-900">{cargosFiltrados.length}</span> resultados encontrados
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
                    cargosFiltrados.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={cargosFiltrados.length === 0}
                  title={cargosFiltrados.length === 0 ? 'No hay datos para exportar' : 'Exportar a Excel'}
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
                  <span className="text-sm text-gray-500">Buscando cargos...</span>
                </div>
              </div>
            ) : cargosFiltrados.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Icon name="FileX" size={48} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-1">No se encontraron cargos</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {filtrosActivos > 0 
                    ? 'Intenta ajustar los filtros de búsqueda' 
                    : 'No hay cargos registrados en el sistema'}
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
                  headers={columnasCargos}
                  data={cargosFiltrados}
                  actions={handleActions}
                />
              </div>
            )}
          </div>

          {/* Paginación */}
          {cargosFiltrados.length > 0 && (
            <div className="flex flex-col md:flex-row items-center justify-between px-5 py-4 border-t border-gray-100 bg-white gap-3">
              <p className="text-sm text-gray-500">
                Mostrando <strong className="text-gray-700">1</strong> a <strong className="text-gray-700">{Math.min(cargosFiltrados.length, 20)}</strong> de <strong className="text-gray-700">{cargosFiltrados.length}</strong> registros
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

export default CargosList;
