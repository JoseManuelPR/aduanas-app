import { useNavigate } from 'react-router-dom';
import { Icon } from "he-button-custom-library";
import CONSTANTS_APP from "../../constants/sidebar-menu";
import CustomLayout from "../../Layout/Layout";
import { Badge } from "../../components/UI";
import { ERoutePaths } from "../../routes/routes";

// Datos centralizados
import {
  getKPIDashboard,
  getTodasLasNotificaciones,
  usuarioActual,
} from '../../data';

// Datos mock para alertas y actividad
const alertasYPlazos = [
  {
    id: '1',
    tipo: 'vencimiento',
    titulo: 'Plazo por vencer',
    descripcion: 'Denuncia #2024-00123 vence en 6 horas',
    tiempo: 'Vence hoy',
    icono: 'Clock',
    color: 'text-red-500',
    bgColor: 'bg-red-100',
  },
  {
    id: '2',
    tipo: 'documento',
    titulo: 'Documento pendiente',
    descripcion: 'Cargo #2024-00456 requiere resolución',
    tiempo: 'Hace 2 días',
    icono: 'FileText',
    color: 'text-amber-500',
    bgColor: 'bg-amber-100',
  },
  {
    id: '3',
    tipo: 'reclamo',
    titulo: 'Reclamo sin asignar',
    descripcion: 'Reclamo TTA #2024-00789 sin revisor',
    tiempo: 'Hace 5 horas',
    icono: 'AlertTriangle',
    color: 'text-red-500',
    bgColor: 'bg-red-100',
  },
];

const actividadReciente = [
  {
    id: '1',
    accion: 'Denuncia creada',
    referencia: '#2024-00890',
    usuario: 'María González',
    tiempo: 'Hace 15 min',
    estado: 'Pendiente',
    estadoColor: 'warning',
  },
  {
    id: '2',
    accion: 'Cargo aprobado',
    referencia: '#2024-00888',
    usuario: 'Carlos Ramírez',
    tiempo: 'Hace 1 hora',
    estado: 'Completado',
    estadoColor: 'success',
  },
  {
    id: '3',
    accion: 'Reclamo en revisión',
    referencia: '#2024-00885',
    usuario: 'Ana Silva',
    tiempo: 'Hace 2 horas',
    estado: 'En proceso',
    estadoColor: 'info',
  },
  {
    id: '4',
    accion: 'Documento adjuntado',
    referencia: '#2024-00880',
    usuario: 'Pedro Morales',
    tiempo: 'Hace 3 horas',
    estado: 'En proceso',
    estadoColor: 'info',
  },
  {
    id: '5',
    accion: 'Giro emitido',
    referencia: '#2024-00875',
    usuario: 'Laura Torres',
    tiempo: 'Hace 4 horas',
    estado: 'Completado',
    estadoColor: 'success',
  },
];

const plazosCriticos = [
  {
    id: '1',
    tipo: 'Denuncia',
    numero: '#2024-00123',
    tiempo: 'Vence en 6 horas',
    horas: '6h',
  },
  {
    id: '2',
    tipo: 'Cargo',
    numero: '#2024-00456',
    tiempo: 'Vence en 18 horas',
    horas: '18h',
  },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Obtener KPIs desde los datos centralizados
  const KPI_DASHBOARD = getKPIDashboard();
  const allNotifications = getTodasLasNotificaciones();

  // Calcular totales para las cards
  const denunciasActivas = KPI_DASHBOARD.denuncias.pendientes + KPI_DASHBOARD.denuncias.enProceso;
  const cargosProceso = KPI_DASHBOARD.cargos.pendientes;
  const girosEmitidos = KPI_DASHBOARD.giros.emitidos;
  const casosResueltos = KPI_DASHBOARD.denuncias.resueltas + (KPI_DASHBOARD.cargos.aprobados || 0);

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
      <div className="min-h-full space-y-6 animate-fade-in">
        {/* Header simple */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Resumen de actividad y gestión de expedientes
          </p>
        </div>

        {/* KPI Cards - 4 cards en fila */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Denuncias Activas */}
          <div 
            className="card p-5 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(ERoutePaths.DENUNCIAS)}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Denuncias Activas</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{denunciasActivas}</p>
                <p className="text-sm text-emerald-600 mt-2">+12% vs mes anterior</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Icon name="AlertCircle" size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          {/* Cargos en Proceso */}
          <div 
            className="card p-5 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(ERoutePaths.CARGOS)}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Cargos en Proceso</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{cargosProceso}</p>
                <p className="text-sm text-red-600 mt-2">-5% vs mes anterior</p>
              </div>
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Icon name="FileText" size={24} className="text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Giros Emitidos */}
          <div 
            className="card p-5 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(ERoutePaths.GIROS)}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Giros Emitidos</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{girosEmitidos}</p>
                <p className="text-sm text-emerald-600 mt-2">+8% vs mes anterior</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <Icon name="DollarSign" size={24} className="text-gray-600" />
              </div>
            </div>
          </div>

          {/* Casos Resueltos */}
          <div 
            className="card p-5 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(ERoutePaths.DENUNCIAS)}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Casos Resueltos</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{casosResueltos}</p>
                <p className="text-sm text-emerald-600 mt-2">+15% vs mes anterior</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <Icon name="CheckCircle" size={24} className="text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Dos columnas: Alertas y Actividad */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alertas y Plazos */}
          <div className="card">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Alertas y Plazos</h3>
              <Badge variant="error">{alertasYPlazos.length} urgentes</Badge>
            </div>
            <div className="divide-y divide-gray-100">
              {alertasYPlazos.map((alerta) => (
                <div key={alerta.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${alerta.bgColor}`}>
                      <Icon name={alerta.icono as any} size={18} className={alerta.color} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{alerta.titulo}</p>
                      <p className="text-sm text-gray-500">{alerta.descripcion}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{alerta.tiempo}</span>
                    <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100">
                      Ver
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-100">
              <button 
                onClick={() => navigate(ERoutePaths.NOTIFICACIONES)}
                className="w-full text-center text-sm text-gray-500 hover:text-aduana-azul"
              >
                Ver todas las alertas
              </button>
            </div>
          </div>

          {/* Actividad Reciente */}
          <div className="card">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Actividad Reciente</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {actividadReciente.map((actividad) => (
                <div key={actividad.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <p className="text-gray-900">
                      {actividad.accion}{' '}
                      <span className="font-semibold text-aduana-azul">{actividad.referencia}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      {actividad.usuario} • {actividad.tiempo}
                    </p>
                  </div>
                  <Badge 
                    variant={actividad.estadoColor as any}
                    size="sm"
                  >
                    {actividad.estado}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Plazos Críticos */}
        <div className="bg-red-50 border border-red-200 rounded-xl overflow-hidden">
          <div className="p-4 flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Icon name="Clock" size={20} className="text-red-600" />
            </div>
            <h3 className="font-semibold text-red-800">Plazos Críticos (Próximas 24 horas)</h3>
          </div>
          <div className="bg-white divide-y divide-red-100">
            {plazosCriticos.map((plazo) => (
              <div key={plazo.id} className="p-4 flex items-center justify-between hover:bg-red-50/50">
                <div>
                  <p className="font-medium text-gray-900">
                    {plazo.tipo} {plazo.numero}
                  </p>
                  <p className="text-sm text-gray-500">{plazo.tiempo}</p>
                </div>
                <span className="text-red-600 font-bold">{plazo.horas}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CustomLayout>
  );
};

export default Dashboard;
