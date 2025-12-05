/**
 * InvolucradosList - Bandeja de Involucrados
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

export const InvolucradosList: React.FC = () => {
  const navigate = useNavigate();
  
  // Estados de filtros
  const [filtroId, setFiltroId] = useState('');
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroTipoPersona, setFiltroTipoPersona] = useState<TipoPersona | ''>('');
  const [filtroEstado, setFiltroEstado] = useState<EstadoInvolucrado | ''>('');

  const conteoInvolucrados = getConteoInvolucrados();
  const allNotifications = getTodasLasNotificaciones();

  // Filtrar involucrados
  const involucradosFiltrados = useMemo(() => {
    return involucrados.filter(inv => {
      if (filtroId && !inv.numeroIdentificacion.includes(filtroId) && !inv.id.includes(filtroId)) return false;
      if (filtroNombre && !inv.nombreCompleto.toLowerCase().includes(filtroNombre.toLowerCase())) return false;
      if (filtroTipoPersona && inv.tipoPersona !== filtroTipoPersona) return false;
      if (filtroEstado && inv.estado !== filtroEstado) return false;
      return true;
    });
  }, [filtroId, filtroNombre, filtroTipoPersona, filtroEstado]);

  const limpiarFiltros = () => {
    setFiltroId('');
    setFiltroNombre('');
    setFiltroTipoPersona('');
    setFiltroEstado('');
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

  const handleActions = (row: Involucrado) => (
    <div className="flex flex-col w-full gap-1">
      <CustomButton 
        variant="primary" 
        className="w-full text-xs"
        onClick={() => navigate(ERoutePaths.INVOLUCRADOS_DETALLE.replace(':id', row.id))}
      >
        <Icon name="Eye" className="hidden md:block" size={14} />
        Ver Ficha
      </CustomButton>
      <CustomButton 
        variant="secondary" 
        className="w-full text-xs"
        onClick={() => navigate(ERoutePaths.INVOLUCRADOS_EDITAR.replace(':id', row.id))}
      >
        <Icon name="Edit" className="hidden md:block" size={14} />
        Editar
      </CustomButton>
    </div>
  );

  const columnasInvolucrados = [
    { 
      key: 'numeroIdentificacion' as const, 
      label: 'ID / RUT', 
      sortable: true,
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
        <Badge variant={row.tipoPersona === 'Jurídica' ? 'info' : 'default'}>
          {row.tipoPersona}
        </Badge>
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
      render: (row: Involucrado) => (
        <Badge variant={row.estado === 'Activo' ? 'success' : 'default'} dot>
          {row.estado}
        </Badge>
      )
    },
    { 
      key: 'denunciasAsociadas' as const, 
      label: 'Procesos', 
      sortable: false,
      render: (row: Involucrado) => {
        const cantidad = getCantidadProcesos(row);
        return cantidad > 0 ? (
          <Badge variant="proceso">{cantidad}</Badge>
        ) : (
          <span className="text-gray-400">-</span>
        );
      }
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
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Involucrados</h1>
            </div>
            <p className="text-gray-600 mt-1 ml-7">
              Administración centralizada de involucrados en procesos
            </p>
          </div>
          <CustomButton 
            className="btn-primary flex items-center gap-2"
            onClick={() => navigate(ERoutePaths.INVOLUCRADOS_NUEVO)}
          >
            <Icon name="Plus" size={18} />
            Nuevo Involucrado
          </CustomButton>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total"
            value={conteoInvolucrados.total}
            subtitle="Involucrados"
            colorScheme="azul"
            icon={<Icon name="Users" size={24} />}
          />
          <StatCard
            title="Activos"
            value={conteoInvolucrados.activos}
            subtitle="Disponibles"
            colorScheme="verde"
            icon={<Icon name="UserCheck" size={24} />}
          />
          <StatCard
            title="P. Naturales"
            value={conteoInvolucrados.personasNaturales}
            subtitle="Personas"
            colorScheme="amarillo"
            icon={<Icon name="User" size={24} />}
          />
          <StatCard
            title="P. Jurídicas"
            value={conteoInvolucrados.personasJuridicas}
            subtitle="Empresas"
            colorScheme="amarillo"
            icon={<Icon name="Building" size={24} />}
          />
          <StatCard
            title="Con Procesos"
            value={conteoInvolucrados.conProcesos}
            subtitle="Asociados"
            colorScheme="rojo"
            icon={<Icon name="FileWarning" size={24} />}
          />
        </div>

        {/* Card principal */}
        <section className="card overflow-hidden">
          {/* Header */}
          <div className="bg-aduana-azul py-3 px-6 flex items-center justify-between">
            <span className="text-white font-medium flex items-center gap-2">
              <Icon name="Users" size={18} />
              Búsqueda de Involucrados
            </span>
            <span className="text-white/80 text-sm">
              {involucradosFiltrados.length} de {involucrados.length} registros
            </span>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-gray-50 border-b border-gray-200">
            <InputField
              label="ID / RUT"
              id="filtroId"
              type="text"
              placeholder="Ej: 12.345.678-9"
              value={filtroId}
              onChange={(e) => setFiltroId(e.target.value)}
            />
            <InputField
              label="Nombre / Razón Social"
              id="filtroNombre"
              type="text"
              placeholder="Buscar..."
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Persona</label>
              <select 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                value={filtroTipoPersona}
                onChange={(e) => setFiltroTipoPersona(e.target.value as TipoPersona | '')}
              >
                <option value="">Todos</option>
                <option value="Natural">Persona Natural</option>
                <option value="Jurídica">Persona Jurídica</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value as EstadoInvolucrado | '')}
              >
                <option value="">Todos</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex flex-col md:flex-row justify-between items-center px-5 py-3 gap-3 border-b border-gray-200">
            <span className="text-sm text-gray-500">
              {involucradosFiltrados.length} registros encontrados
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
              headers={columnasInvolucrados}
              data={involucradosFiltrados}
              actions={handleActions}
            />
          </div>
        </section>
      </div>
    </CustomLayout>
  );
};

export default InvolucradosList;

