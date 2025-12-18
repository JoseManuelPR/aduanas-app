/**
 * CargosList - Bandeja de Cargos
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
import { Badge, getEstadoBadgeVariant, getDiasVencimientoBadgeVariant } from "../../components/UI";
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

export const CargosList: React.FC = () => {
  const navigate = useNavigate();

  // Estados de filtros
  const [filtros, setFiltros] = useState({
    numeroCargo: '',
    tipoIdDeudor: '' as TipoIdentificacionDTTA | '',
    numeroIdDeudor: '',
    estado: '' as EstadoCargo | '',
    aduana: '',
    origen: '' as OrigenCargo | '',
    fechaDesde: '',
    fechaHasta: '',
    montoMinimo: '',
    montoMaximo: '',
  });
  const labelBaseClass = "block text-sm font-semibold text-black";
  const inputContainerClass = "!flex-col !items-start gap-1 lg:!flex-col lg:!items-start lg:!gap-1";

  // Obtener conteos desde datos centralizados
  const conteoCargos = getConteoCargos();
  const allNotifications = getTodasLasNotificaciones();

  // Filtrar cargos
  const cargosFiltrados = useMemo(() => {
    return cargos.filter(cargo => {
      if (filtros.numeroCargo && !cargo.numeroCargo.toLowerCase().includes(filtros.numeroCargo.toLowerCase())) {
        return false;
      }
      // Filtro por ID del deudor: se exige seleccionar tipo antes de ingresar número
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
      // Filtros de monto (simplificado)
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

  const handleFiltroChange = (campo: string, valor: string) => {
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
    setFiltros({
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
    });
  };

  const handleActions = (row: Cargo) => (
    <div className="flex flex-col w-full gap-1">
      <CustomButton 
        variant="primary" 
        className="w-full text-xs"
        onClick={() => navigate(`/cargos/${row.id}/editar`)}
      >
        <Icon name="Edit" className="hidden md:block" size={14} />
        Editar Cargo
      </CustomButton>
      {(row.estado === 'Emitido' || row.estado === 'Aprobado' || row.estado === 'Notificado') && (
        <CustomButton 
          variant="secondary" 
          className="w-full text-xs"
          onClick={() => navigate(`/giros/nuevo?cargoId=${row.id}`)}
        >
          <Icon name="Receipt" className="hidden md:block" size={14} />
          Generar Giro
        </CustomButton>
      )}
    </div>
  );

  // Columnas para la tabla
  const columnasCargos = [
    { 
      key: 'numeroCargo' as const, 
      label: 'N° Cargo', 
      sortable: true,
      render: (row: Cargo) => (
        <button 
          onClick={() => navigate(`/cargos/${row.id}`)}
          className="font-semibold text-aduana-azul hover:underline"
        >
          {row.numeroCargo}
        </button>
      )
    },
    { 
      key: 'origen' as const, 
      label: 'Origen', 
      sortable: true,
      render: (row: Cargo) => (
        <Badge variant={row.origen === 'DENUNCIA' ? 'info' : row.origen === 'TRAMITE_ADUANERO' ? 'warning' : 'default'}>
          {row.origen === 'DENUNCIA' ? 'Denuncia' : row.origen === 'TRAMITE_ADUANERO' ? 'Trámite Aduanero' : 'Otro'}
        </Badge>
      )
    },
    { key: 'fechaIngreso' as const, label: 'Fecha Ingreso', sortable: true },
    { 
      key: 'estado' as const, 
      label: 'Estado', 
      sortable: true,
      render: (row: Cargo) => (
        <Badge variant={getEstadoBadgeVariant(row.estado)} dot>
          {row.estado}
        </Badge>
      )
    },
    { key: 'aduana' as const, label: 'Aduana', sortable: true },
    { key: 'rutDeudor' as const, label: 'ID Deudor', sortable: true },
    { 
      key: 'nombreDeudor' as const, 
      label: 'Deudor', 
      sortable: true,
      render: (row: Cargo) => (
        <span className="truncate max-w-[150px] block" title={row.nombreDeudor}>
          {row.nombreDeudor}
        </span>
      )
    },
    { 
      key: 'montoTotal' as const, 
      label: 'Monto Total', 
      sortable: true,
      render: (row: Cargo) => (
        <span className="font-semibold text-aduana-azul">{row.montoTotal}</span>
      )
    },
    { 
      key: 'denunciaNumero' as const, 
      label: 'Denuncia', 
      sortable: true,
      render: (row: Cargo) => row.denunciaNumero ? (
        <button 
          onClick={() => navigate(`/denuncias/${row.denunciaAsociada}`)}
          className="text-blue-600 hover:underline text-sm"
        >
          {row.denunciaNumero}
        </button>
      ) : '-'
    },
    { 
      key: 'diasVencimiento' as const, 
      label: 'Plazo', 
      sortable: true,
      render: (row: Cargo) => {
        const dias = row.diasVencimiento;
        const variant = getDiasVencimientoBadgeVariant(dias);
        return (
          <Badge variant={variant} pulse={dias < 0}>
            {dias < 0 ? `${Math.abs(dias)}d vencido` : dias === 0 ? 'Hoy' : `${dias} días`}
          </Badge>
        );
      }
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
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Cargos</h1>
            </div>
            <p className="text-gray-600 mt-1 ml-7">
              Determinación de deuda y gestión de cargos administrativos
            </p>
          </div>
          <CustomButton 
            className="btn-primary flex items-center gap-2"
            onClick={() => navigate(ERoutePaths.CARGOS_NUEVO)}
          >
            <Icon name="Plus" size={18} />
            Nuevo Cargo
          </CustomButton>
        </div>

        {/* Estadísticas compactas (misma visual que Giros) */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700">
            Total: <strong>{conteoCargos.total}</strong>
          </span>
          <span className="px-3 py-2 rounded-lg bg-slate-50 text-gray-700 border border-gray-200">
            Borradores: <strong>{conteoCargos.porEstado.borrador}</strong>
          </span>
          <span className="px-3 py-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
            Pendientes: <strong>{conteoCargos.pendientes}</strong>
          </span>
          <span className="px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            Emitidos/Aprobados: <strong>{conteoCargos.aprobados}</strong>
          </span>
          <span className="px-3 py-2 rounded-lg bg-red-50 text-red-700 border border-red-200">
            Vencidos: <strong>{conteoCargos.vencidos}</strong>
          </span>
          <span className="px-3 py-2 rounded-lg bg-blue-50 text-aduana-azul border border-blue-100">
            Monto Total: <strong>{formatMonto(conteoCargos.montoTotal)}</strong>
          </span>
        </div>

        {/* Card principal */}
        <section className="card overflow-hidden">
          {/* Header */}
          <div className="bg-aduana-azul py-3 px-6 flex items-center justify-between">
            <span className="text-white font-medium flex items-center gap-2">
              <Icon name="DollarSign" size={18} />
              Bandeja de Cargos
            </span>
            <span className="text-white/80 text-sm">
              {cargosFiltrados.length} de {cargos.length} registros
            </span>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-5 bg-gray-50 border-b border-gray-200">
            <InputField
              label="N° Cargo"
              id="nroCargo"
              type="text"
              placeholder="CAR-2024-XXXXX"
              labelClassName={labelBaseClass}
              containerClassName={inputContainerClass}
              value={filtros.numeroCargo}
              onChange={(e) => handleFiltroChange('numeroCargo', e.target.value)}
            />
            <div>
              <label className={`${labelBaseClass} mb-1`}>Estado</label>
              <select
                value={filtros.estado}
                onChange={(e) => handleFiltroChange('estado', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aduana-azul/20 focus:border-aduana-azul"
              >
                <option value="">Todos los estados</option>
                {estadosCargo.map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`${labelBaseClass} mb-1`}>Aduana</label>
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
            <div>
              <label className={`${labelBaseClass} mb-1`}>Origen</label>
              <select
                value={filtros.origen}
                onChange={(e) => handleFiltroChange('origen', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aduana-azul/20 focus:border-aduana-azul"
              >
                <option value="">Todos los orígenes</option>
                <option value="DENUNCIA">Denuncia</option>
                <option value="TRAMITE_ADUANERO">Trámite Aduanero</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>
            {/* ID Deudor anidado */}
            <div className="md:col-span-2 xl:col-span-2">
              <label className={`${labelBaseClass} mb-1`}>ID del Deudor</label>
              <div className="flex gap-2">
                <select
                  className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aduana-azul/20 focus:border-aduana-azul"
                  value={filtros.tipoIdDeudor}
                  onChange={(e) => handleTipoIdChange(e.target.value as TipoIdentificacionDTTA | '')}
                >
                  <option value="">Tipo ID</option>
                  {TIPOS_IDENTIFICACION_DTTA.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aduana-azul/20 focus:border-aduana-azul disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder={getPlaceholderPorTipoId(filtros.tipoIdDeudor)}
                  disabled={!filtros.tipoIdDeudor}
                  value={filtros.numeroIdDeudor}
                  onChange={(e) => handleFiltroChange('numeroIdDeudor', e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Selecciona el tipo de documento antes de escribir el número.
              </p>
            </div>
            <InputField
              label="Fecha desde"
              id="fechaDesde"
              type="date"
              labelClassName={labelBaseClass}
              containerClassName={inputContainerClass}
              value={filtros.fechaDesde}
              onChange={(e) => handleFiltroChange('fechaDesde', e.target.value)}
              icon={<Icon name="CalendarDays" size={18} color="#6B7280" />}
            />
            <InputField
              label="Fecha hasta"
              id="fechaHasta"
              type="date"
              labelClassName={labelBaseClass}
              containerClassName={inputContainerClass}
              value={filtros.fechaHasta}
              onChange={(e) => handleFiltroChange('fechaHasta', e.target.value)}
              icon={<Icon name="CalendarDays" size={18} color="#6B7280" />}
            />
            <InputField
              label="Monto desde"
              id="montoMinimo"
              type="number"
              placeholder="0"
              labelClassName={labelBaseClass}
              containerClassName={inputContainerClass}
              value={filtros.montoMinimo}
              onChange={(e) => handleFiltroChange('montoMinimo', e.target.value)}
            />
            <InputField
              label="Monto hasta"
              id="montoMaximo"
              type="number"
              placeholder="∞"
              labelClassName={labelBaseClass}
              containerClassName={inputContainerClass}
              value={filtros.montoMaximo}
              onChange={(e) => handleFiltroChange('montoMaximo', e.target.value)}
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
              Exportar Excel
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
              headers={columnasCargos}
              data={cargosFiltrados}
              actions={handleActions}
            />
          </div>
        </section>
      </div>
    </CustomLayout>
  );
};

export default CargosList;
