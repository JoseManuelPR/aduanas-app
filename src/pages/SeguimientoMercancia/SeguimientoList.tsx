import { useNavigate } from 'react-router-dom';
import { Icon } from "he-button-custom-library";
import CONSTANTS_APP from "../../constants/sidebar-menu";
import CustomLayout from "../../Layout/Layout";
import InputField from "../../organisms/InputField/InputField";
import { CustomButton } from "../../components/Button/Button";
import { Badge, StatCard, Timeline } from "../../components/UI";
import { ERoutePaths } from "../../routes/routes";

// Datos centralizados
import {
  getTodasLasNotificaciones,
  usuarioActual,
  movimientosActivos,
  timelineMovimientoEjemplo,
  alertasTrazabilidad,
  estadisticasSeguimiento,
} from '../../data';

export const SeguimientoList: React.FC = () => {
  const navigate = useNavigate();
  
  // Obtener notificaciones para el header
  const allNotifications = getTodasLasNotificaciones();

  // Datos de seguimiento centralizados
  const timelineMovimiento = timelineMovimientoEjemplo;

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
              <h1 className="text-2xl font-bold text-gray-900">Seguimiento de Mercancía</h1>
            </div>
            <p className="text-gray-600 mt-1 ml-7">
              Trazabilidad de movimientos terrestres y marítimos
            </p>
          </div>
          <div className="flex gap-2">
            <CustomButton variant="secondary" className="flex items-center gap-2">
              <Icon name="MapPin" size={18} />
              Ver Mapa
            </CustomButton>
            <CustomButton className="btn-primary flex items-center gap-2">
              <Icon name="Plus" size={18} />
              Registrar Movimiento
            </CustomButton>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="En Tránsito"
            value={estadisticasSeguimiento.enTransito}
            subtitle="Contenedores"
            accent="blue"
            icon="Ship"
          />
          <StatCard
            title="En Puerto"
            value={estadisticasSeguimiento.enPuerto}
            subtitle="Pendientes de aforo"
            accent="amber"
            icon="Anchor"
          />
          <StatCard
            title="Transporte Terrestre"
            value={estadisticasSeguimiento.transporteTerrestre}
            subtitle="En ruta"
            accent="green"
            icon="Truck"
          />
          <StatCard
            title="Con Alerta"
            value={estadisticasSeguimiento.conAlerta}
            subtitle="Requieren atención"
            accent="red"
            icon="AlertTriangle"
          />
        </div>

        {/* Búsqueda rápida */}
        <div className="card p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <InputField
              label="N° Contenedor"
              id="contenedor"
              type="text"
              placeholder="MSKU1234567"
            />
            <InputField
              label="N° Manifiesto"
              id="manifiesto"
              type="text"
              placeholder="MAN-2024-XXXXX"
            />
            <InputField
              label="Estado"
              id="estado"
              type="text"
              placeholder="Seleccione estado"
            />
            <div className="flex items-end">
              <CustomButton variant="primary" className="w-full flex items-center justify-center gap-2">
                <Icon name="Search" size={18} />
                Buscar
              </CustomButton>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de movimientos */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Movimientos Activos</h3>
            {movimientosActivos.map((mov) => (
              <div key={mov.id} className="card p-5 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h4 className="font-bold text-gray-900">{mov.contenedor}</h4>
                      <Badge 
                        variant={
                          mov.estado === 'En Tránsito' ? 'proceso' :
                          mov.estado === 'En Puerto' ? 'warning' :
                          'success'
                        }
                        dot
                      >
                        {mov.estado}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Manifiesto: {mov.manifiesto}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className="flex items-center gap-1 text-gray-600">
                        <Icon name="MapPin" size={14} />
                        {mov.origen}
                      </span>
                      <Icon name="ArrowRight" size={14} className="text-gray-400" />
                      <span className="flex items-center gap-1 text-gray-600">
                        <Icon name="Target" size={14} />
                        {mov.destino}
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Ubicación: {mov.ubicacionActual}</span>
                        <span>ETA: {mov.fechaEstimada}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-aduana-azul h-2 rounded-full transition-all"
                          style={{ width: `${mov.porcentaje}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Icon name="ChevronRight" size={20} className="text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline del movimiento seleccionado */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Icon name="Route" size={20} />
              Detalle de Ruta
            </h3>
            <div className="mb-4 p-3 bg-aduana-azul-50 rounded-lg">
              <p className="text-sm text-aduana-azul font-medium">MSKU1234567</p>
              <p className="text-xs text-aduana-azul-600">Shanghai → Valparaíso</p>
            </div>
            <Timeline items={timelineMovimiento} />
          </div>
        </div>

        {/* Alertas de movimientos */}
        <div className="card p-6 border-l-4 border-l-aduana-rojo">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="AlertTriangle" size={20} className="text-aduana-rojo" />
            Alertas de Trazabilidad
          </h3>
          <div className="space-y-3">
            {alertasTrazabilidad.map((alerta) => (
              <div 
                key={alerta.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  alerta.tipo === 'critico' ? 'bg-red-50' :
                  alerta.tipo === 'advertencia' ? 'bg-amber-50' :
                  'bg-blue-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon 
                    name={alerta.tipo === 'critico' ? 'AlertCircle' : alerta.tipo === 'advertencia' ? 'Clock' : 'Info'} 
                    size={20} 
                    className={
                      alerta.tipo === 'critico' ? 'text-red-600' :
                      alerta.tipo === 'advertencia' ? 'text-amber-600' :
                      'text-blue-600'
                    } 
                  />
                  <div>
                    <p className={`font-medium ${
                      alerta.tipo === 'critico' ? 'text-red-800' :
                      alerta.tipo === 'advertencia' ? 'text-amber-800' :
                      'text-blue-800'
                    }`}>
                      {alerta.contenedor} - {alerta.titulo}
                    </p>
                    <p className={`text-sm ${
                      alerta.tipo === 'critico' ? 'text-red-600' :
                      alerta.tipo === 'advertencia' ? 'text-amber-600' :
                      'text-blue-600'
                    }`}>
                      {alerta.descripcion}
                    </p>
                  </div>
                </div>
                <CustomButton variant="secondary" className="text-xs">
                  {alerta.tipo === 'critico' ? 'Verificar' : 'Ver Detalle'}
                </CustomButton>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CustomLayout>
  );
};

export default SeguimientoList;

