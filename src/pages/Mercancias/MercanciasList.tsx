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
import { Badge, StatCard } from "../../components/UI";
import { ERoutePaths } from "../../routes/routes";

// Datos centralizados
import {
  mercancias,
  getConteoMercancias,
  getTodasLasNotificaciones,
  usuarioActual,
  aduanas,
  type Mercancia,
  type EstadoMercancia,
  type TipoEventoMercancia,
} from '../../data';

// Estados de mercancía para filtros
const estadosMercancia: EstadoMercancia[] = [
  'En Custodia', 'Comisada', 'Entregada', 'Subastada', 'Destruida', 
  'Donada', 'Entregada por RAP', 'Incautada Judicialmente', 
  'Pendiente Disposición', 'Retenida'
];

// Tipos de evento para filtros
const tiposEvento: TipoEventoMercancia[] = [
  'Ingreso', 'Retención', 'Incautación', 'Comiso', 'Devolución',
  'Destrucción', 'Subasta', 'Donación', 'Entrega RAP'
];

export const MercanciasList: React.FC = () => {
  const navigate = useNavigate();
  
  // Estados de filtros
  const [filtroCodigo, setFiltroCodigo] = useState('');
  const [filtroDescripcion, setFiltroDescripcion] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroAduana, setFiltroAduana] = useState('');
  const [filtroTipoEvento, setFiltroTipoEvento] = useState('');

  // Obtener conteos desde datos centralizados
  const conteoMercancias = getConteoMercancias();
  const allNotifications = getTodasLasNotificaciones();

  // Filtrar mercancías
  const mercanciasFiltradas = useMemo(() => {
    return mercancias.filter(m => {
      if (filtroCodigo && !m.codigoMercancia?.toLowerCase().includes(filtroCodigo.toLowerCase())) return false;
      if (filtroDescripcion && !m.descripcion.toLowerCase().includes(filtroDescripcion.toLowerCase())) return false;
      if (filtroEstado && m.estado !== filtroEstado) return false;
      if (filtroAduana && m.codigoAduanaIngreso !== filtroAduana) return false;
      if (filtroTipoEvento && !m.seguimientos?.some(s => s.tipoEvento === filtroTipoEvento)) return false;
      return true;
    });
  }, [filtroCodigo, filtroDescripcion, filtroEstado, filtroAduana, filtroTipoEvento]);

  const limpiarFiltros = () => {
    setFiltroCodigo('');
    setFiltroDescripcion('');
    setFiltroEstado('');
    setFiltroAduana('');
    setFiltroTipoEvento('');
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

  // Columnas para la tabla
  const columnasMercancias = [
    { 
      key: 'codigoMercancia' as const, 
      label: 'ID Mercancía', 
      sortable: true,
      render: (row: Mercancia) => (
        <span className="font-mono text-aduana-azul font-medium">
          {row.codigoMercancia || row.id}
        </span>
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

        {/* Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total Mercancías"
            value={conteoMercancias.total}
            subtitle="Registradas"
            colorScheme="azul"
            icon={<Icon name="Package" size={24} />}
          />
          <StatCard
            title="En Custodia"
            value={conteoMercancias.porEstado.enCustodia}
            subtitle="Pendientes"
            colorScheme="amarillo"
            icon={<Icon name="Warehouse" size={24} />}
          />
          <StatCard
            title="Comisadas"
            value={conteoMercancias.porEstado.comisada}
            subtitle="Por disponer"
            colorScheme="rojo"
            icon={<Icon name="Lock" size={24} />}
          />
          <StatCard
            title="Pend. Disposición"
            value={conteoMercancias.pendientesDisposicion}
            subtitle="Requieren acción"
            colorScheme="amarillo"
            icon={<Icon name="Clock" size={24} />}
          />
          <StatCard
            title="Con Alerta"
            value={conteoMercancias.conAlerta}
            subtitle="Revisar"
            colorScheme="rojo"
            icon={<Icon name="AlertTriangle" size={24} />}
          />
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

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5 bg-gray-50 border-b border-gray-200">
            <InputField
              label="ID / Código"
              id="codigo"
              type="text"
              placeholder="MER-2024-XXXXX"
              value={filtroCodigo}
              onChange={(e) => setFiltroCodigo(e.target.value)}
            />
            <InputField
              label="Descripción"
              id="descripcion"
              type="text"
              placeholder="Buscar por descripción..."
              value={filtroDescripcion}
              onChange={(e) => setFiltroDescripcion(e.target.value)}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aduana Ingreso</label>
              <select 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                value={filtroAduana}
                onChange={(e) => setFiltroAduana(e.target.value)}
              >
                <option value="">Todas las aduanas</option>
                {aduanas.map(aduana => (
                  <option key={aduana.codigo} value={aduana.codigo}>{aduana.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Evento</label>
              <select 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                value={filtroTipoEvento}
                onChange={(e) => setFiltroTipoEvento(e.target.value)}
              >
                <option value="">Todos los eventos</option>
                {tiposEvento.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
            <InputField
              label="Fecha Ingreso"
              id="fechaIngreso"
              type="date"
              icon={<Icon name="CalendarDays" size={18} color="#6B7280" />}
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

