/**
 * MercanciasList - Bandeja de Mercancías
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

// Datos centralizados
import {
  mercancias,
  getConteoMercancias,
  getTodasLasNotificaciones,
  usuarioActual,
  type Mercancia,
  type EstadoMercancia,
} from '../../data';

// Estados de mercancía para filtros
const estadosMercancia: EstadoMercancia[] = [
  'En Custodia', 'Comisada', 'Entregada', 'Subastada', 'Destruida', 
  'Donada', 'Entregada por RAP', 'Incautada Judicialmente', 
  'Pendiente Disposición', 'Retenida'
];

// Tipo de filtros
interface FiltrosMercancia {
  tipoMercancia: string;
  estado: string;
  denunciaAsociada: string;
}

const initialFiltros: FiltrosMercancia = {
  tipoMercancia: '',
  estado: '',
  denunciaAsociada: '',
};

export const MercanciasList: React.FC = () => {
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState<FiltrosMercancia>(initialFiltros);
  const [isSearching, setIsSearching] = useState(false);
  
  const labelBaseClass = "block text-sm font-semibold text-gray-800";
  const inputContainerClass = "!flex-col !items-start gap-1 lg:!flex-col lg:!items-start lg:!gap-1";

  const tiposMercancia = useMemo(() => {
    const tipos = mercancias.map((m) => m.descripcion.split(' - ')[0] || m.descripcion);
    return Array.from(new Set(tipos));
  }, []);

  // Obtener conteos desde datos centralizados
  const conteoMercancias = getConteoMercancias();
  const allNotifications = getTodasLasNotificaciones();

  // Contar filtros activos
  const filtrosActivos = useMemo(() => {
    return Object.entries(filtros).filter(([_, value]) => value !== '').length;
  }, [filtros]);

  // Filtrar mercancías
  const mercanciasFiltradas = useMemo(() => {
    return mercancias.filter(m => {
      if (filtros.tipoMercancia && !m.descripcion.toLowerCase().includes(filtros.tipoMercancia.toLowerCase())) return false;
      if (filtros.estado && m.estado !== filtros.estado) return false;
      if (filtros.denunciaAsociada && !m.denunciaId?.includes(filtros.denunciaAsociada)) return false;
      return true;
    });
  }, [filtros]);

  const handleFiltroChange = (campo: keyof FiltrosMercancia, valor: string) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const limpiarFiltros = () => {
    setFiltros(initialFiltros);
  };

  const removerFiltro = (campo: keyof FiltrosMercancia) => {
    setFiltros(prev => ({ ...prev, [campo]: '' }));
  };

  const handleBuscar = useCallback(() => {
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 500);
  }, []);

  const getFiltroLabel = (campo: keyof FiltrosMercancia, valor: string): string => {
    switch (campo) {
      case 'tipoMercancia': return `Tipo: ${valor}`;
      case 'estado': return valor;
      case 'denunciaAsociada': return `Denuncia: ${valor}`;
      default: return valor;
    }
  };

  const getEstadoVariant = (estado: EstadoMercancia): { variant: BadgeVariant; muted: boolean } => {
    const variantMap: Record<string, { variant: BadgeVariant; muted: boolean }> = {
      'En Custodia': { variant: 'warning', muted: false },
      'Comisada': { variant: 'vencido', muted: false },
      'Entregada': { variant: 'resuelto', muted: true },
      'Subastada': { variant: 'info', muted: true },
      'Destruida': { variant: 'default', muted: true },
      'Donada': { variant: 'resuelto', muted: true },
      'Entregada por RAP': { variant: 'resuelto', muted: true },
      'Incautada Judicialmente': { variant: 'vencido', muted: false },
      'Pendiente Disposición': { variant: 'proceso', muted: false },
      'En Tránsito': { variant: 'info', muted: true },
      'En Puerto': { variant: 'warning', muted: true },
      'En Depósito': { variant: 'warning', muted: true },
      'Retenida': { variant: 'vencido', muted: false },
      'Liberada': { variant: 'resuelto', muted: true },
    };
    return variantMap[estado] || { variant: 'default', muted: true };
  };

  const handleActions = (row: Mercancia) => (
    <div className="flex flex-col w-full gap-1.5">
      <CustomButton 
        variant="primary" 
        className="w-full !text-xs !py-1.5 flex items-center justify-center gap-1.5"
        onClick={() => navigate(ERoutePaths.MERCANCIAS_DETALLE.replace(':id', row.id))}
      >
        <Icon name="Eye" className="hidden md:block" size={12} />
        <span>Ver Detalle</span>
      </CustomButton>
      {row.denunciaId && (
        <CustomButton 
          variant="secondary" 
          className="w-full !text-xs !py-1.5 flex items-center justify-center gap-1.5"
          onClick={() => navigate(ERoutePaths.DENUNCIAS_DETALLE.replace(':id', row.denunciaId!))}
        >
          <Icon name="FileWarning" className="hidden md:block" size={12} />
          <span>Ver Denuncia</span>
        </CustomButton>
      )}
    </div>
  );

  // Columnas para la tabla
  const columnasMercancias = [
    { 
      key: 'denunciaId' as const, 
      label: 'N° Denuncia', 
      sortable: true,
      sticky: true,
      render: (row: Mercancia) => (
        row.denunciaId ? (
          <button 
            onClick={() => navigate(ERoutePaths.DENUNCIAS_DETALLE.replace(':id', row.denunciaId!))}
            className="font-mono text-aduana-azul font-medium hover:underline"
          >
            {row.denunciaId}
          </button>
        ) : (
          <span className="text-gray-400">Sin denuncia</span>
        )
      )
    },
    { 
      key: 'descripcion' as const, 
      label: 'Descripción', 
      sortable: true,
      render: (row: Mercancia) => (
        <div className="max-w-xs">
          <p className="font-medium truncate">{row.descripcion}</p>
          {row.partida && (
            <p className="text-xs text-gray-500">Partida: {row.partida}</p>
          )}
        </div>
      )
    },
    { 
      key: 'numeroBultos' as const, 
      label: 'Bultos', 
      sortable: true,
      render: (row: Mercancia) => row.numeroBultos || row.cantidad || '-'
    },
    { 
      key: 'pesoBruto' as const, 
      label: 'Peso (kg)', 
      sortable: true,
      render: (row: Mercancia) => row.pesoBruto?.toLocaleString('es-CL') || '-'
    },
    { 
      key: 'valorCIF' as const, 
      label: 'Valor CIF', 
      sortable: true,
      render: (row: Mercancia) => row.valorCIF 
        ? `$${row.valorCIF.toLocaleString('es-CL')} ${row.moneda || 'USD'}` 
        : '-'
    },
    { 
      key: 'estado' as const, 
      label: 'Estado', 
      sortable: true,
      sticky: true,
      render: (row: Mercancia) => {
        const { variant, muted } = getEstadoVariant(row.estado);
        return (
          <div className="flex items-center gap-2">
            <Badge variant={variant} dot size="sm" className={muted ? 'opacity-80' : ''}>
              {row.estado}
            </Badge>
            {row.tieneAlertaDisposicion && (
              <Icon name="AlertTriangle" size={14} className="text-amber-500" />
            )}
          </div>
        );
      }
    },
    { key: 'fechaIngreso' as const, label: 'Fecha Ingreso', sortable: true },
    { 
      key: 'nombreAduanaIngreso' as const, 
      label: 'Aduana', 
      sortable: true,
      sticky: true,
      render: (row: Mercancia) => row.nombreAduanaIngreso || row.codigoAduanaIngreso || '-'
    },
  ];

  // Chips de estado con prioridad visual
  const estadosChips = [
    { label: 'Total', count: conteoMercancias.total, variant: 'neutral' as const },
    { label: 'En custodia', count: conteoMercancias.porEstado.enCustodia, variant: 'warning' as const, critical: true },
    { label: 'Comisadas', count: conteoMercancias.porEstado.comisada, variant: 'danger' as const, critical: true },
    { label: 'Con alerta', count: conteoMercancias.conAlerta, variant: 'danger' as const, critical: true },
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
              <span className="text-gray-900 font-medium">Mercancías</span>
            </nav>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Mercancías</h1>
            <p className="text-gray-500 mt-1">
              Visualización de mercancías recibidas desde sistemas externos
            </p>
          </div>
        </div>

        {/* Estadísticas - Prioridad visual solo en críticos */}
        <div className="flex flex-wrap items-center gap-2">
          {estadosChips.map((chip) => (
            <button
              key={chip.label}
              onClick={() => {
                if (chip.label === 'En custodia') handleFiltroChange('estado', 'En Custodia');
                else if (chip.label === 'Comisadas') handleFiltroChange('estado', 'Comisada');
                else limpiarFiltros();
              }}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                flex items-center gap-2 min-w-[44px] min-h-[44px]
                ${chip.critical 
                  ? chip.variant === 'danger'
                    ? 'bg-red-100 text-red-800 border-2 border-red-300 hover:bg-red-200 shadow-sm'
                    : 'bg-amber-100 text-amber-800 border-2 border-amber-300 hover:bg-amber-200 shadow-sm'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
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
            Valor total: <strong>{conteoMercancias.valorTotalFormateado}</strong>
          </span>
        </div>

        {/* Alertas */}
        {conteoMercancias.conAlerta > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
            <Icon name="AlertTriangle" size={24} className="text-amber-500 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-700">
                Hay {conteoMercancias.conAlerta} mercancía(s) que requieren atención
              </p>
              <p className="text-sm text-amber-600">
                Algunas mercancías están sin disposición final con proceso cerrado o tienen eventos contradictorios.
              </p>
            </div>
          </div>
        )}

        {/* Card principal */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header azul */}
          <div className="bg-aduana-azul py-3 px-6">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium flex items-center gap-2">
                <Icon name="Package" size={18} />
                Búsqueda de Mercancías
              </span>
              <span className="text-white/80 text-sm">
                {mercanciasFiltradas.length} de {mercancias.length} registros
              </span>
            </div>
          </div>

          {/* Filtros */}
          <div className="p-5 bg-white border-b border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              <div>
                <label htmlFor="tipoMercancia" className={`${labelBaseClass} mb-1`}>Tipo de Mercancía</label>
                <select
                  id="tipoMercancia"
                  className="form-input min-h-[44px]"
                  value={filtros.tipoMercancia}
                  onChange={(e) => handleFiltroChange('tipoMercancia', e.target.value)}
                >
                  <option value="">Seleccione tipo...</option>
                  {tiposMercancia.map((tipo) => (
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
                  {estadosMercancia.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </div>
              <InputField
                label="Denuncia Asociada"
                id="denunciaAsociada"
                type="text"
                placeholder="N° de denuncia..."
                labelClassName={labelBaseClass}
                containerClassName={inputContainerClass}
                value={filtros.denunciaAsociada}
                onChange={(e) => handleFiltroChange('denunciaAsociada', e.target.value)}
              />
            </div>
          </div>

          {/* Barra de acciones */}
          <div className="flex flex-col gap-3 px-5 py-4 bg-white border-b border-gray-100">
            <div className="flex flex-wrap items-center gap-3">
              {filtrosActivos > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-500">{filtrosActivos} filtro(s):</span>
                  {Object.entries(filtros).map(([campo, valor]) => {
                    if (!valor) return null;
                    return (
                      <span
                        key={campo}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-aduana-azul-50 text-aduana-azul text-xs font-medium rounded-full"
                      >
                        {getFiltroLabel(campo as keyof FiltrosMercancia, valor)}
                        <button
                          onClick={() => removerFiltro(campo as keyof FiltrosMercancia)}
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
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{mercanciasFiltradas.length}</span> resultados encontrados
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
                    mercanciasFiltradas.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={mercanciasFiltradas.length === 0}
                  title={mercanciasFiltradas.length === 0 ? 'No hay datos para exportar' : 'Exportar a Excel'}
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
                  <span className="text-sm text-gray-500">Buscando mercancías...</span>
                </div>
              </div>
            ) : mercanciasFiltradas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Icon name="FileX" size={48} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-1">No se encontraron mercancías</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {filtrosActivos > 0 
                    ? 'Intenta ajustar los filtros de búsqueda' 
                    : 'No hay mercancías registradas en el sistema'}
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
                  headers={columnasMercancias}
                  data={mercanciasFiltradas}
                  actions={handleActions}
                />
              </div>
            )}
          </div>

          {/* Paginación */}
          {mercanciasFiltradas.length > 0 && (
            <div className="flex flex-col md:flex-row items-center justify-between px-5 py-4 border-t border-gray-100 bg-white gap-3">
              <p className="text-sm text-gray-500">
                Mostrando <strong className="text-gray-700">1</strong> a <strong className="text-gray-700">{Math.min(mercanciasFiltradas.length, 20)}</strong> de <strong className="text-gray-700">{mercanciasFiltradas.length}</strong> registros
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

export default MercanciasList;
