import { useNavigate } from 'react-router-dom';
import { Icon } from "he-button-custom-library";
import CONSTANTS_APP from "../../constants/sidebar-menu";
import CustomLayout from "../../Layout/Layout";
import { StatCard, AlertCard, ProgressBar } from "../../components/UI";
import { ERoutePaths } from "../../routes/routes";

// Datos centralizados
import {
  getKPIDashboard,
  alertas,
  getTodasLasNotificaciones,
  getConteoNotificaciones,
  usuarioActual,
} from '../../data';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Obtener KPIs desde los datos centralizados
  const KPI_DASHBOARD = getKPIDashboard();
  const ALERTAS_PLAZOS = alertas;
  const allNotifications = getTodasLasNotificaciones();
  const conteoNotificaciones = getConteoNotificaciones();

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
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
            <p className="text-gray-600 mt-1">
              Bienvenido al Sistema DECARE - Servicio Nacional de Aduanas
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              Última actualización: {new Date().toLocaleString('es-CL')}
            </span>
            <button className="btn-secondary flex items-center gap-2">
              <Icon name="RefreshCw" size={16} />
              Actualizar
            </button>
          </div>
        </div>

        {/* Alertas de Plazos Críticos */}
        {ALERTAS_PLAZOS.filter(a => a.tipo === 'vencido' || a.tipo === 'critico').length > 0 && (
          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-aduana-rojo">
              <Icon name="AlertTriangle" size={20} />
              Alertas Críticas de Plazos
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {ALERTAS_PLAZOS.filter(a => a.tipo === 'vencido' || a.tipo === 'critico').map((alerta) => (
                <AlertCard
                  key={alerta.id}
                  variant={alerta.tipo as 'vencido' | 'critico'}
                  title={alerta.titulo}
                  description={alerta.descripcion}
                  expediente={alerta.expediente}
                  fechaVencimiento={alerta.fechaVencimiento}
                  diasVencidos={alerta.diasVencidos}
                  diasRestantes={alerta.diasRestantes}
                  onAction={() => navigate(`/expediente/${alerta.expediente}`)}
                  actionLabel="Ver expediente"
                />
              ))}
            </div>
          </section>
        )}

        {/* KPIs Principales */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Resumen General</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Denuncias Activas"
              value={KPI_DASHBOARD.denuncias.pendientes + KPI_DASHBOARD.denuncias.enProceso}
              subtitle={`${KPI_DASHBOARD.denuncias.vencidas} vencidas`}
              colorScheme={KPI_DASHBOARD.denuncias.vencidas > 0 ? 'rojo' : 'azul'}
              onClick={() => navigate(ERoutePaths.DENUNCIAS)}
              icon={
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              trend={{
                value: 12,
                label: 'vs mes anterior',
                isPositive: false,
              }}
            />
            <StatCard
              title="Cargos Pendientes"
              value={KPI_DASHBOARD.cargos.pendientes}
              subtitle={KPI_DASHBOARD.cargos.montoTotal}
              colorScheme="amarillo"
              onClick={() => navigate(ERoutePaths.CARGOS)}
              icon={
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard
              title="Giros Vencidos"
              value={KPI_DASHBOARD.giros.vencidos}
              subtitle="Requieren atención"
              colorScheme="rojo"
              onClick={() => navigate(ERoutePaths.GIROS)}
              icon={
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard
              title="Reclamos en Análisis"
              value={KPI_DASHBOARD.reclamos.enAnalisis}
              subtitle={`${KPI_DASHBOARD.reclamos.tiempoPromedioRespuesta} días promedio`}
              colorScheme="verde"
              onClick={() => navigate(ERoutePaths.RECLAMOS)}
              icon={
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              }
            />
          </div>
        </section>

        {/* Grid de dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Indicadores detallados */}
          <div className="lg:col-span-2 space-y-6">
            {/* Denuncias por Estado */}
            <section className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Estado de Denuncias</h3>
                <button 
                  onClick={() => navigate(ERoutePaths.DENUNCIAS)}
                  className="text-sm text-aduana-azul hover:underline flex items-center gap-1"
                >
                  Ver todas <Icon name="ArrowRight" size={14} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Pendientes</span>
                    <span className="font-semibold text-amber-600">{KPI_DASHBOARD.denuncias.pendientes}</span>
                  </div>
                  <ProgressBar 
                    value={KPI_DASHBOARD.denuncias.pendientes} 
                    max={KPI_DASHBOARD.denuncias.total} 
                    colorScheme="amarillo"
                    showPercentage={false}
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">En Proceso</span>
                    <span className="font-semibold text-blue-600">{KPI_DASHBOARD.denuncias.enProceso}</span>
                  </div>
                  <ProgressBar 
                    value={KPI_DASHBOARD.denuncias.enProceso} 
                    max={KPI_DASHBOARD.denuncias.total} 
                    colorScheme="azul"
                    showPercentage={false}
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Resueltas</span>
                    <span className="font-semibold text-emerald-600">{KPI_DASHBOARD.denuncias.resueltas}</span>
                  </div>
                  <ProgressBar 
                    value={KPI_DASHBOARD.denuncias.resueltas} 
                    max={KPI_DASHBOARD.denuncias.total} 
                    colorScheme="verde"
                    showPercentage={false}
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Por Vencer (próximos 5 días)</span>
                    <span className="font-semibold text-orange-600">{KPI_DASHBOARD.denuncias.porVencer}</span>
                  </div>
                  <ProgressBar 
                    value={KPI_DASHBOARD.denuncias.porVencer} 
                    max={KPI_DASHBOARD.denuncias.total} 
                    colorScheme="amarillo"
                    showPercentage={false}
                  />
                </div>
                {KPI_DASHBOARD.denuncias.vencidas > 0 && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-red-600 font-medium">⚠️ Vencidas</span>
                      <span className="font-bold text-red-600">{KPI_DASHBOARD.denuncias.vencidas}</span>
                    </div>
                    <ProgressBar 
                      value={KPI_DASHBOARD.denuncias.vencidas} 
                      max={KPI_DASHBOARD.denuncias.total} 
                      colorScheme="rojo"
                      showPercentage={false}
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Recaudación */}
            <section className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recaudación de Giros</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                  <p className="text-sm text-emerald-700 font-medium">Monto Recaudado</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">
                    {KPI_DASHBOARD.giros.montoRecaudado}
                  </p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700 font-medium">Giros Pagados</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    {KPI_DASHBOARD.giros.pagados}
                  </p>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <p className="text-sm text-amber-700 font-medium">Giros Emitidos</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">
                    {KPI_DASHBOARD.giros.emitidos}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <ProgressBar
                  label="Tasa de Pago"
                  value={KPI_DASHBOARD.giros.pagados}
                  max={KPI_DASHBOARD.giros.total}
                  colorScheme="auto"
                  size="lg"
                />
              </div>
            </section>
          </div>

          {/* Columna derecha - Alertas y accesos rápidos */}
          <div className="space-y-6">
            {/* Alertas pendientes */}
            <section className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Alertas de Plazos
              </h3>
              <div className="space-y-3">
                {ALERTAS_PLAZOS.slice(0, 4).map((alerta, index) => (
                  <AlertCard
                    key={alerta.id}
                    variant={alerta.tipo as 'vencido' | 'critico' | 'advertencia' | 'informativo'}
                    title={alerta.titulo}
                    description={alerta.descripcion}
                    onAction={() => navigate(`/expediente/${alerta.expediente}`)}
                    actionLabel="Ver"
                  />
                ))}
              </div>
            </section>

            {/* Notificaciones Electrónicas */}
            <section className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Notificaciones
                </h3>
                <span className="badge bg-aduana-azul-50 text-aduana-azul">
                  {conteoNotificaciones.totalNoLeidas} sin leer
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Total</span>
                  <span className="font-semibold text-gray-900">{conteoNotificaciones.totalGeneral}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Hallazgos</span>
                  <span className="font-semibold text-blue-600">
                    {conteoNotificaciones.hallazgos.total} ({conteoNotificaciones.hallazgos.noLeidas} sin leer)
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Denuncias</span>
                  <span className="font-semibold text-amber-600">
                    {conteoNotificaciones.denuncias.total} ({conteoNotificaciones.denuncias.noLeidas} sin leer)
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Reclamos</span>
                  <span className="font-semibold text-emerald-600">
                    {conteoNotificaciones.reclamos.total} ({conteoNotificaciones.reclamos.noLeidas} sin leer)
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Cargos</span>
                  <span className="font-semibold text-purple-600">
                    {conteoNotificaciones.cargos.total} ({conteoNotificaciones.cargos.noLeidas} sin leer)
                  </span>
                </div>
              </div>
              <button 
                onClick={() => navigate(ERoutePaths.NOTIFICACIONES)}
                className="w-full mt-4 btn-secondary text-sm"
              >
                Ver todas las notificaciones
              </button>
            </section>

            {/* Accesos Rápidos */}
            <section className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Accesos Rápidos
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => navigate(ERoutePaths.DENUNCIAS_NUEVA)}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-aduana-azul-50 hover:bg-aduana-azul-100 transition-colors"
                >
                  <Icon name="FilePlus" size={24} className="text-aduana-azul" />
                  <span className="text-sm font-medium text-aduana-azul">Nueva Denuncia</span>
                </button>
                <button 
                  onClick={() => navigate(ERoutePaths.CARGOS_NUEVO)}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors"
                >
                  <Icon name="DollarSign" size={24} className="text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-600">Nuevo Cargo</span>
                </button>
                <button 
                  onClick={() => navigate(ERoutePaths.REPORTES)}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors"
                >
                  <Icon name="BarChart2" size={24} className="text-amber-600" />
                  <span className="text-sm font-medium text-amber-600">Reportes</span>
                </button>
                <button 
                  onClick={() => navigate(ERoutePaths.INDICADORES)}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
                >
                  <Icon name="TrendingUp" size={24} className="text-purple-600" />
                  <span className="text-sm font-medium text-purple-600">Indicadores</span>
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </CustomLayout>
  );
};

export default Dashboard;
