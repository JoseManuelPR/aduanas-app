import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from "he-button-custom-library";
import CONSTANTS_APP from "../../constants/sidebar-menu";
import CustomLayout from "../../Layout/Layout";
import InputField from "../../organisms/InputField/InputField";
import { CustomButton } from "../../components/Button/Button";
import { Table } from "../../components/Table/Table";
import { Badge, StatCard, getDiasVencimientoBadgeVariant } from "../../components/UI";
import { ERoutePaths } from "../../routes/routes";

// Datos centralizados
import {
  reclamos,
  getConteoReclamos,
  getTodasLasNotificaciones,
  usuarioActual,
  aduanas,
  type Reclamo,
  type EstadoReclamo,
  type TipoReclamoCompleto,
  type OrigenReclamo,
} from '../../data';

// Opciones para filtros
const estadosReclamo: EstadoReclamo[] = [
  'Ingresado', 'En Admisibilidad', 'Admitido', 'En Análisis', 
  'En Tramitación', 'Pendiente Resolución', 'Derivado a Tribunal',
  'Fallado', 'Resuelto', 'Rechazado', 'Acogido', 'Acogido Parcialmente', 'Cerrado'
];

const tiposReclamo: TipoReclamoCompleto[] = ['Reposición', 'TTA'];
const origenesReclamo: OrigenReclamo[] = ['DENUNCIA', 'CARGO', 'GIRO', 'OTRO'];

export const ReclamosList: React.FC = () => {
  const navigate = useNavigate();

  // Estados de filtros
  const [filtroNumero, setFiltroNumero] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroOrigen, setFiltroOrigen] = useState('');
  const [filtroReclamante, setFiltroReclamante] = useState('');
  const [filtroAduana, setFiltroAduana] = useState('');

  // Obtener conteos desde datos centralizados
  const conteoReclamos = getConteoReclamos();
  const allNotifications = getTodasLasNotificaciones();

  // Filtrar reclamos
  const reclamosFiltrados = useMemo(() => {
    return reclamos.filter(r => {
      if (filtroNumero && !r.numeroReclamo.toLowerCase().includes(filtroNumero.toLowerCase())) return false;
      if (filtroTipo && r.tipoReclamo !== filtroTipo) return false;
      if (filtroEstado && r.estado !== filtroEstado) return false;
      if (filtroOrigen && r.origenReclamo !== filtroOrigen) return false;
      if (filtroReclamante && !r.reclamante.toLowerCase().includes(filtroReclamante.toLowerCase()) && 
          !r.rutReclamante.includes(filtroReclamante)) return false;
      if (filtroAduana && r.codigoAduana !== filtroAduana && r.aduana !== filtroAduana) return false;
      return true;
    });
  }, [filtroNumero, filtroTipo, filtroEstado, filtroOrigen, filtroReclamante, filtroAduana]);

  const limpiarFiltros = () => {
    setFiltroNumero('');
    setFiltroTipo('');
    setFiltroEstado('');
    setFiltroOrigen('');
    setFiltroReclamante('');
    setFiltroAduana('');
  };

  const handleActions = (row: Reclamo) => (
    <div className="flex flex-col w-full gap-1">
      <CustomButton 
        variant="primary" 
        className="w-full text-xs"
        onClick={() => navigate(ERoutePaths.RECLAMOS_DETALLE.replace(':id', row.id))}
      >
        <Icon name="Eye" className="hidden md:block" size={14} />
        Ver Detalle
      </CustomButton>
      <CustomButton 
        variant="secondary" 
        className="w-full text-xs"
        onClick={() => navigate(ERoutePaths.RECLAMOS_EDITAR.replace(':id', row.id))}
      >
        <Icon name="Edit" className="hidden md:block" size={14} />
        Editar
      </CustomButton>
    </div>
  );

  // Columnas para la tabla
  const columnasReclamos = [
    { key: 'numeroReclamo' as const, label: 'N° Reclamo', sortable: true },
    { 
      key: 'tipoReclamo' as const, 
      label: 'Tipo', 
      sortable: true,
      render: (row: Reclamo) => {
        const colorMap: Record<string, 'info' | 'warning' | 'danger'> = {
          'Reposición': 'warning',
          'TTA': 'danger',
        };
        return (
          <Badge variant={colorMap[row.tipoReclamo] || 'info'}>
            {row.tipoReclamo}
          </Badge>
        );
      }
    },
    { key: 'fechaIngreso' as const, label: 'Fecha Ingreso', sortable: true },
    { 
      key: 'estado' as const, 
      label: 'Estado', 
      sortable: true,
      render: (row: Reclamo) => {
        const estadoMap: Record<string, 'pendiente' | 'proceso' | 'resuelto' | 'danger' | 'success' | 'info'> = {
          'Ingresado': 'info',
          'En Admisibilidad': 'pendiente',
          'Admitido': 'info',
          'En Análisis': 'proceso',
          'En Tramitación': 'proceso',
          'Pendiente Resolución': 'pendiente',
          'Derivado a Tribunal': 'danger',
          'Fallado': 'success',
          'Resuelto': 'resuelto',
          'Rechazado': 'danger',
          'Acogido': 'success',
          'Acogido Parcialmente': 'proceso',
          'Cerrado': 'resuelto',
        };
        return (
          <Badge variant={estadoMap[row.estado] || 'info'} dot>
            {row.estado}
          </Badge>
        );
      }
    },
    { 
      key: 'origenReclamo' as const, 
      label: 'Origen', 
      sortable: true,
      render: (row: Reclamo) => (
        <span className="text-sm">
          {row.origenReclamo}
          {row.numeroEntidadOrigen && (
            <span className="text-gray-500 block text-xs">{row.numeroEntidadOrigen}</span>
          )}
        </span>
      )
    },
    { key: 'reclamante' as const, label: 'Reclamante', sortable: true },
    { 
      key: 'montoReclamado' as const, 
      label: 'Monto', 
      sortable: true,
      render: (row: Reclamo) => row.montoReclamado 
        ? `$${row.montoReclamado.toLocaleString('es-CL')}` 
        : '-'
    },
    { 
      key: 'diasRespuesta' as const, 
      label: 'Días', 
      sortable: true,
      render: (row: Reclamo) => {
        const dias = row.diasRespuesta;
        const variant = getDiasVencimientoBadgeVariant(dias);
        return (
          <Badge variant={variant}>
            {dias === 0 ? '✓' : `${dias}d`}
          </Badge>
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
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Reclamos</h1>
            </div>
            <p className="text-gray-600 mt-1 ml-7">
              Reclamos Reposición y Tribunal Tributario Aduanero
            </p>
          </div>
          <CustomButton 
            className="btn-primary flex items-center gap-2"
            onClick={() => navigate(ERoutePaths.RECLAMOS_NUEVO)}
          >
            <Icon name="Plus" size={18} />
            Nuevo Reclamo
          </CustomButton>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Reclamos"
            value={conteoReclamos.total}
            subtitle="Este período"
            colorScheme="azul"
            icon={<Icon name="MessageCircle" size={24} />}
          />
          <StatCard
            title="En Análisis"
            value={conteoReclamos.enAnalisis}
            subtitle="Pendientes resolución"
            colorScheme="amarillo"
            icon={<Icon name="Clock" size={24} />}
          />
          <StatCard
            title="Resueltos"
            value={conteoReclamos.resueltos}
            subtitle="Finalizados"
            colorScheme="verde"
            icon={<Icon name="CheckCircle" size={24} />}
          />
          <StatCard
            title="Derivados TTA"
            value={conteoReclamos.derivadosTTA}
            subtitle="Tribunal Tributario"
            colorScheme="rojo"
            icon={<Icon name="Scale" size={24} />}
          />
        </div>

        {/* Info sobre tipos de reclamo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-4 border-l-4 border-l-amber-500">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Badge variant="warning">Reposición</Badge>
            </h4>
            <p className="text-sm text-gray-600 mt-2">
              Recurso de reposición ante la misma autoridad. Plazo: 5 días hábiles.
            </p>
          </div>
          <div className="card p-4 border-l-4 border-l-red-500">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Badge variant="danger">TTA</Badge>
            </h4>
            <p className="text-sm text-gray-600 mt-2">
              Tribunal Tributario y Aduanero. Instancia judicial de revisión.
            </p>
          </div>
        </div>

        {/* Card principal */}
        <section className="card overflow-hidden">
          {/* Header */}
          <div className="bg-aduana-azul py-3 px-6 flex items-center justify-between">
            <span className="text-white font-medium flex items-center gap-2">
              <Icon name="MessageSquare" size={18} />
              Búsqueda de Reclamos
            </span>
            <span className="text-white/80 text-sm">
              Tiempo promedio respuesta: {conteoReclamos.tiempoPromedioRespuesta} días
            </span>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5 bg-gray-50 border-b border-gray-200">
            <InputField
              label="N° Reclamo"
              id="nroReclamo"
              type="text"
              placeholder="REC-XXX-2024-XXXX"
              value={filtroNumero}
              onChange={(e) => setFiltroNumero(e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Reclamo</label>
              <select 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
              >
                <option value="">Todos los tipos</option>
                {tiposReclamo.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="">Todos los estados</option>
                {estadosReclamo.map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Origen</label>
              <select 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                value={filtroOrigen}
                onChange={(e) => setFiltroOrigen(e.target.value)}
              >
                <option value="">Todos los orígenes</option>
                {origenesReclamo.map(origen => (
                  <option key={origen} value={origen}>{origen}</option>
                ))}
              </select>
            </div>
            <InputField
              label="Reclamante"
              id="reclamante"
              type="text"
              placeholder="Nombre o RUT"
              value={filtroReclamante}
              onChange={(e) => setFiltroReclamante(e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aduana</label>
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
          </div>

          {/* Acciones */}
          <div className="flex flex-col md:flex-row justify-between items-center px-5 py-3 gap-3 border-b border-gray-200">
            <span className="text-sm text-gray-500">
              {reclamosFiltrados.length} de {reclamos.length} reclamos
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
              headers={columnasReclamos}
              data={reclamosFiltrados}
              actions={handleActions}
            />
          </div>
        </section>
      </div>
    </CustomLayout>
  );
};

export default ReclamosList;
