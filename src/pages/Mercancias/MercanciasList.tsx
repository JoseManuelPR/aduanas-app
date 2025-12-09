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
    <div className="flex flex-col w-full gap-1">
      <CustomButton 
        variant="primary" 
        className="w-full text-xs"
        onClick={() => navigate(ERoutePaths.MERCANCIAS_DETALLE.replace(':id', row.id))}
      >
        <Icon name="Eye" className="hidden md:block" size={14} />
        Ver Detalle
      </CustomButton>
      {row.denunciaId && (
        <CustomButton 
          variant="secondary" 
          className="w-full text-xs"
          onClick={() => navigate(ERoutePaths.DENUNCIAS_DETALLE.replace(':id', row.denunciaId!))}
        >
          <Icon name="FileWarning" className="hidden md:block" size={14} />
          Ver Denuncia
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
              Control del ciclo de vida de mercancías asociadas a procesos
            </p>
          </div>
          <CustomButton 
            className="btn-primary flex items-center gap-2"
            onClick={() => navigate(ERoutePaths.MERCANCIAS_NUEVO)}
          >
            <Icon name="Plus" size={18} />
            Nueva Mercancía
          </CustomButton>
        </div>

        {/* Estadísticas - Reducidas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="card p-3 border-l-4 border-l-aduana-azul">
            <p className="text-xs text-gray-600">Total</p>
            <p className="text-xl font-bold text-aduana-azul">{conteoMercancias.total}</p>
          </div>
          <div className="card p-3 border-l-4 border-l-amber-500">
            <p className="text-xs text-gray-600">En Custodia</p>
            <p className="text-xl font-bold text-amber-600">{conteoMercancias.porEstado.enCustodia}</p>
          </div>
          <div className="card p-3 border-l-4 border-l-red-500">
            <p className="text-xs text-gray-600">Comisadas</p>
            <p className="text-xl font-bold text-red-600">{conteoMercancias.porEstado.comisada}</p>
          </div>
          <div className="card p-3 border-l-4 border-l-emerald-500">
            <p className="text-xs text-gray-600">Con Alerta</p>
            <p className="text-xl font-bold text-emerald-600">{conteoMercancias.conAlerta}</p>
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-gray-50 border-b border-gray-200">
            <InputField
              label="Tipo de Mercancía"
              id="tipoMercancia"
              type="text"
              placeholder="Buscar por tipo..."
              value={filtroTipoMercancia}
              onChange={(e) => setFiltroTipoMercancia(e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
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

