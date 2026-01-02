/**
 * MercanciasList - Bandeja de Mercancías
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from "he-button-custom-library";
import CONSTANTS_APP from "../../constants/sidebar-menu";
import CustomLayout from "../../Layout/Layout";
import InputField from "../../organisms/InputField/InputField";
import { CustomButton } from "../../components/Button/Button";
import { Table } from "../../components/Table/Table";
import { Badge } from "../../components/UI";
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


export const MercanciasList: React.FC = () => {
  const navigate = useNavigate();
  
  // Estados de filtros
  const [filtroTipoMercancia, setFiltroTipoMercancia] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroDenunciaAsociada, setFiltroDenunciaAsociada] = useState('');
  const labelBaseClass = "block text-sm font-semibold text-black";
  const inputContainerClass = "!flex-col !items-start gap-1 lg:!flex-col lg:!items-start lg:!gap-1";

  const tiposMercancia = useMemo(() => {
    const tipos = mercancias.map((m) => m.descripcion.split(' - ')[0] || m.descripcion);
    return Array.from(new Set(tipos));
  }, []);

  // Obtener conteos desde datos centralizados
  const conteoMercancias = getConteoMercancias();
  const allNotifications = getTodasLasNotificaciones();

  // Filtrar mercancías por: tipo, estado, denuncia asociada
  const mercanciasFiltradas = useMemo(() => {
    return mercancias.filter(m => {
      if (filtroTipoMercancia && !m.descripcion.toLowerCase().includes(filtroTipoMercancia.toLowerCase())) return false;
      if (filtroEstado && m.estado !== filtroEstado) return false;
      if (filtroDenunciaAsociada && !m.denunciaId?.includes(filtroDenunciaAsociada)) return false;
      return true;
    });
  }, [filtroTipoMercancia, filtroEstado, filtroDenunciaAsociada]);

  const limpiarFiltros = () => {
    setFiltroTipoMercancia('');
    setFiltroEstado('');
    setFiltroDenunciaAsociada('');
  };

  const getEstadoBadgeVariant = (estado: EstadoMercancia) => {
    const variantMap: Record<EstadoMercancia, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'proceso'> = {
      'En Custodia': 'warning',
      'Comisada': 'danger',
      'Entregada': 'success',
      'Subastada': 'info',
      'Destruida': 'default',
      'Donada': 'success',
      'Entregada por RAP': 'success',
      'Incautada Judicialmente': 'danger',
      'Pendiente Disposición': 'proceso',
      'En Tránsito': 'info',
      'En Puerto': 'warning',
      'En Depósito': 'warning',
      'Retenida': 'danger',
      'Liberada': 'success',
    };
    return variantMap[estado] || 'default';
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

  // Columnas para la tabla - Cambiar ID Mercancía por N° Denuncia
  const columnasMercancias = [
    { 
      key: 'denunciaId' as const, 
      label: 'N° Denuncia', 
      sortable: true,
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
      render: (row: Mercancia) => (
        <div className="flex items-center gap-2">
          <Badge variant={getEstadoBadgeVariant(row.estado)} dot>
            {row.estado}
          </Badge>
          {row.tieneAlertaDisposicion && (
            <Icon name="AlertTriangle" size={14} className="text-amber-500" />
          )}
        </div>
      )
    },
    { key: 'fechaIngreso' as const, label: 'Fecha Ingreso', sortable: true },
    { 
      key: 'nombreAduanaIngreso' as const, 
      label: 'Aduana', 
      sortable: true,
      render: (row: Mercancia) => row.nombreAduanaIngreso || row.codigoAduanaIngreso || '-'
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
      <div className="min-h-full space-y-4 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigate(ERoutePaths.DASHBOARD)}
                className="text-gray-500 hover:text-aduana-azul transition-colors"
              >
                <Icon name="ArrowLeft" size={20} />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Mercancías</h1>
            </div>
            <p className="text-gray-600 mt-1 ml-7">
              Visualización de mercancías recibidas desde sistemas externos
            </p>
          </div>
        </div>

        {/* Estadísticas compactas */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700">
            Total: <strong>{conteoMercancias.total}</strong>
          </span>
          <span className="px-3 py-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
            En custodia: <strong>{conteoMercancias.porEstado.enCustodia}</strong>
          </span>
          <span className="px-3 py-2 rounded-lg bg-red-50 text-red-700 border border-red-200">
            Comisadas: <strong>{conteoMercancias.porEstado.comisada}</strong>
          </span>
          <span className="px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            Con alerta: <strong>{conteoMercancias.conAlerta}</strong>
          </span>
        </div>

        {/* Alertas */}
        {conteoMercancias.conAlerta > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
            <Icon name="AlertTriangle" size={24} className="text-amber-500" />
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
        <section className="card overflow-hidden">
          {/* Header */}
          <div className="bg-aduana-azul py-3 px-6 flex items-center justify-between">
            <span className="text-white font-medium flex items-center gap-2">
              <Icon name="Package" size={18} />
              Búsqueda de Mercancías
            </span>
            <span className="text-white/80 text-sm">
              Valor total: {conteoMercancias.valorTotalFormateado}
            </span>
          </div>

          {/* Filtros - Por tipo de mercancía, estado, denuncia asociada */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-5 bg-gray-50 border-b border-gray-200">
            <div>
              <label className={`${labelBaseClass} mb-1`}>Tipo de Mercancía</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                value={filtroTipoMercancia}
                onChange={(e) => setFiltroTipoMercancia(e.target.value)}
              >
                <option value="">Todos los tipos</option>
                {tiposMercancia.map((tipo) => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`${labelBaseClass} mb-1`}>Estado</label>
              <select 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="">Todos los estados</option>
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
              value={filtroDenunciaAsociada}
              onChange={(e) => setFiltroDenunciaAsociada(e.target.value)}
            />
          </div>

          {/* Acciones */}
          <div className="flex flex-col md:flex-row justify-between items-center px-5 py-3 gap-3 border-b border-gray-200">
            <span className="text-sm text-gray-500">
              {mercanciasFiltradas.length} de {mercancias.length} mercancías
            </span>
            <div className="flex gap-3">
              <CustomButton variant="secondary" className="flex items-center gap-1 text-sm" onClick={limpiarFiltros}>
                <Icon name="Eraser" size={16} />
                Limpiar
              </CustomButton>
              <CustomButton variant="secondary" className="flex items-center gap-1 text-sm">
                <Icon name="FileDown" size={16} />
                Exportar
              </CustomButton>
            </div>
          </div>

          {/* Tabla */}
          <div className="p-4">
            <Table
              classHeader="bg-aduana-azul text-white text-xs"
              headers={columnasMercancias}
              data={mercanciasFiltradas}
              actions={handleActions}
            />
          </div>
        </section>
      </div>
    </CustomLayout>
  );
};

export default MercanciasList;

