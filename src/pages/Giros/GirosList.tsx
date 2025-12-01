/**
 * GirosList - Bandeja de Giros
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import React, { useState, useMemo } from 'react';
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

export const GirosList: React.FC = () => {
  const navigate = useNavigate();

  // Estados de filtros
  const [filtros, setFiltros] = useState({
    numeroGiro: '',
    rutDeudor: '',
    estado: '' as EstadoGiro | '',
    tipo: '' as TipoGiro | '',
    origen: '' as OrigenGiro | '',
    aduana: '',
    fechaDesde: '',
    fechaHasta: '',
  });

  // Obtener conteos desde datos centralizados
  const conteoGiros = getConteoGiros();
  const allNotifications = getTodasLasNotificaciones();

  // Filtrar giros
  const girosFiltrados = useMemo(() => {
    return giros.filter(giro => {
      if (filtros.numeroGiro && !giro.numeroGiro.toLowerCase().includes(filtros.numeroGiro.toLowerCase())) {
        return false;
      }
      if (filtros.rutDeudor && !giro.rutDeudor.includes(filtros.rutDeudor)) {
        return false;
      }
      if (filtros.estado && giro.estado !== filtros.estado) {
        return false;
      }
      if (filtros.tipo && giro.tipoGiro !== filtros.tipo) {
        return false;
      }
      if (filtros.origen && giro.origenGiro !== filtros.origen) {
        return false;
      }
      if (filtros.aduana && giro.aduana !== filtros.aduana && giro.codigoAduana !== filtros.aduana) {
        return false;
      }
      return true;
    });
  }, [filtros]);

  const handleFiltroChange = (campo: string, valor: string) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      numeroGiro: '',
      rutDeudor: '',
      estado: '',
      tipo: '',
      origen: '',
      aduana: '',
      fechaDesde: '',
      fechaHasta: '',
    });
  };

  const handleActions = (row: Giro) => (
    <div className="flex flex-col w-full gap-1">
      <CustomButton 
        variant="primary" 
        className="w-full text-xs"
        onClick={() => navigate(`/giros/${row.id}`)}
      >
        <Icon name="Eye" className="hidden md:block" size={14} />
        Ver Detalle
      </CustomButton>
      {(row.estado === 'Emitido' || row.estado === 'Notificado' || row.estado === 'Vencido' || row.estado === 'Parcialmente Pagado') && (
        <CustomButton 
          variant="secondary" 
          className="w-full text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={() => navigate(`/giros/${row.id}`)}
        >
          <Icon name="CreditCard" className="hidden md:block" size={14} />
          Registrar Pago
        </CustomButton>
      )}
    </div>
  );

  // Obtener badge variant según estado
  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'Pagado': return 'success';
      case 'Parcialmente Pagado': return 'warning';
      case 'Vencido': return 'error';
      case 'Anulado': return 'error';
      case 'Notificado': return 'info';
      default: return 'proceso';
    }
  };

  // Columnas para la tabla
  const columnasGiros = [
    { 
      key: 'numeroGiro' as const, 
      label: 'N° Giro', 
      sortable: true,
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
        <Badge variant={row.tipoGiro === 'F09' ? 'info' : row.tipoGiro === 'F16' ? 'warning' : 'default'}>
          {row.tipoGiro}
        </Badge>
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
      render: (row: Giro) => (
        <Badge variant={getEstadoBadgeVariant(row.estado)} dot pulse={row.estado === 'Vencido'}>
          {row.estado}
        </Badge>
      )
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
          <span className="text-xs text-gray-500">{row.rutDeudor}</span>
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
        return (
          <Badge 
            variant={dias < 0 ? 'error' : dias <= 5 ? 'warning' : 'info'} 
            pulse={dias < 0}
          >
            {dias < 0 ? `${Math.abs(dias)}d vencido` : dias === 0 ? 'Hoy' : `${dias} días`}
          </Badge>
        );
      }
    },
  ];

  // Estados para el filtro
  const estadosGiro: EstadoGiro[] = [
    'Emitido', 'Notificado', 'Pagado', 'Parcialmente Pagado', 'Vencido', 'Anulado'
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
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Giros</h1>
            </div>
            <p className="text-gray-600 mt-1 ml-7">
              Emisión, seguimiento y recaudación de giros (F09/F16/F17)
            </p>
          </div>
          <CustomButton 
            className="btn-primary flex items-center gap-2"
            onClick={() => navigate(ERoutePaths.GIROS_NUEVO)}
          >
            <Icon name="Plus" size={18} />
            Emitir Giro
          </CustomButton>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total Giros"
            value={conteoGiros.total}
            subtitle="Este período"
            colorScheme="azul"
            icon={<Icon name="Receipt" size={24} />}
          />
          <StatCard
            title="Pendientes"
            value={conteoGiros.pendientes}
            subtitle="Emitidos y notificados"
            colorScheme="amarillo"
            icon={<Icon name="Clock" size={24} />}
          />
          <StatCard
            title="Pagados"
            value={conteoGiros.pagados}
            subtitle="Recaudación exitosa"
            colorScheme="verde"
            icon={<Icon name="CheckCircle" size={24} />}
          />
          <StatCard
            title="Vencidos"
            value={conteoGiros.vencidos}
            subtitle="Requieren gestión"
            colorScheme="rojo"
            icon={<Icon name="AlertCircle" size={24} />}
          />
          <StatCard
            title="Monto Recaudado"
            value={conteoGiros.montoRecaudadoFormateado}
            subtitle={`Pendiente: ${conteoGiros.montoPendienteFormateado}`}
            colorScheme="verde"
            icon={<Icon name="TrendingUp" size={24} />}
          />
        </div>

        {/* Card principal */}
        <section className="card overflow-hidden">
          {/* Header */}
          <div className="bg-aduana-azul py-3 px-6 flex items-center justify-between">
            <span className="text-white font-medium flex items-center gap-2">
              <Icon name="Receipt" size={18} />
              Bandeja de Giros
            </span>
            <div className="flex items-center gap-4">
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

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-gray-50 border-b border-gray-200">
            <InputField
              label="N° Giro"
              id="nroGiro"
              type="text"
              placeholder="F09-2024-XXXXX"
              value={filtros.numeroGiro}
              onChange={(e) => handleFiltroChange('numeroGiro', e.target.value)}
            />
            <InputField
              label="RUT Deudor"
              id="rutDeudor"
              type="text"
              placeholder="12.345.678-9"
              value={filtros.rutDeudor}
              onChange={(e) => handleFiltroChange('rutDeudor', e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                value={filtros.tipo}
                onChange={(e) => handleFiltroChange('tipo', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aduana-azul/20 focus:border-aduana-azul"
              >
                <option value="">Todos los tipos</option>
                <option value="F09">F09 - Desde Cargo</option>
                <option value="F16">F16 - Desde Denuncia</option>
                <option value="F17">F17 - Otros</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={filtros.estado}
                onChange={(e) => handleFiltroChange('estado', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aduana-azul/20 focus:border-aduana-azul"
              >
                <option value="">Todos los estados</option>
                {estadosGiro.map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Origen</label>
              <select
                value={filtros.origen}
                onChange={(e) => handleFiltroChange('origen', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aduana-azul/20 focus:border-aduana-azul"
              >
                <option value="">Todos los orígenes</option>
                <option value="CARGO">Desde Cargo</option>
                <option value="DENUNCIA">Desde Denuncia</option>
                <option value="MANUAL">Manual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aduana</label>
              <select
                value={filtros.aduana}
                onChange={(e) => handleFiltroChange('aduana', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aduana-azul/20 focus:border-aduana-azul"
              >
                <option value="">Todas las aduanas</option>
                {aduanas.map(aduana => (
                  <option key={aduana.id} value={aduana.nombre}>{aduana.nombre}</option>
                ))}
              </select>
            </div>
            <InputField
              label="Fecha desde"
              id="fechaDesde"
              type="date"
              value={filtros.fechaDesde}
              onChange={(e) => handleFiltroChange('fechaDesde', e.target.value)}
              icon={<Icon name="CalendarDays" size={18} color="#6B7280" />}
            />
            <InputField
              label="Fecha hasta"
              id="fechaHasta"
              type="date"
              value={filtros.fechaHasta}
              onChange={(e) => handleFiltroChange('fechaHasta', e.target.value)}
              icon={<Icon name="CalendarDays" size={18} color="#6B7280" />}
            />
          </div>

          {/* Acciones de filtro */}
          <div className="flex flex-col md:flex-row justify-end items-center px-5 py-3 gap-3 border-b border-gray-200">
            <CustomButton 
              variant="secondary" 
              className="flex items-center gap-1 text-sm"
              onClick={limpiarFiltros}
            >
              <Icon name="Eraser" size={16} />
              Limpiar
            </CustomButton>
            <CustomButton variant="secondary" className="flex items-center gap-1 text-sm">
              <Icon name="FileDown" size={16} />
              Exportar
            </CustomButton>
            <CustomButton variant="primary" className="flex items-center gap-1 text-sm">
              <Icon name="Search" size={16} />
              Buscar
            </CustomButton>
          </div>

          {/* Tabla */}
          <div className="p-4">
            <Table
              classHeader="bg-aduana-azul text-white text-xs"
              headers={columnasGiros}
              data={girosFiltrados}
              actions={handleActions}
            />
          </div>
        </section>
      </div>
    </CustomLayout>
  );
};

export default GirosList;
