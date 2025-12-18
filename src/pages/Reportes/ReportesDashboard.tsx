import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from "he-button-custom-library";
import CONSTANTS_APP from "../../constants/sidebar-menu";
import CustomLayout from "../../Layout/Layout";
import { CustomButton } from "../../components/Button/Button";
import { StatCard, ProgressBar, Tabs } from "../../components/UI";
import { ERoutePaths } from "../../routes/routes";

// Datos centralizados
import {
  getTodasLasNotificaciones,
  getKPIs,
  usuarioActual,
} from '../../data';

export const ReportesDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Obtener datos centralizados
  const allNotifications = getTodasLasNotificaciones();
  const KPI_DASHBOARD = getKPIs();

  // Reportes disponibles
  const reportesDisponibles = [
    {
      id: 'denuncias-periodo',
      titulo: 'Denuncias por Período',
      descripcion: 'Resumen de denuncias ingresadas, formuladas y cerradas',
      icono: <Icon name="FileText" size={24} />,
      color: 'azul',
    },
    {
      id: 'cargos-monto',
      titulo: 'Cargos por Monto',
      descripcion: 'Detalle de cargos y montos por aduana y período',
      icono: <Icon name="DollarSign" size={24} />,
      color: 'verde',
    },
    {
      id: 'recaudacion',
      titulo: 'Recaudación de Giros',
      descripcion: 'Análisis de giros emitidos, pagados y pendientes',
      icono: <Icon name="TrendingUp" size={24} />,
      color: 'amarillo',
    },
    {
      id: 'plazos-vencidos',
      titulo: 'Control de Plazos',
      descripcion: 'Expedientes vencidos y por vencer por aduana',
      icono: <Icon name="Clock" size={24} />,
      color: 'rojo',
    },
    {
      id: 'notificaciones',
      titulo: 'Notificaciones Electrónicas',
      descripcion: 'Tasa de envío, lectura y errores',
      icono: <Icon name="Mail" size={24} />,
      color: 'azul',
    },
    {
      id: 'reclamos-resolucion',
      titulo: 'Reclamos y Resoluciones',
      descripcion: 'Tiempos de respuesta y resultados',
      icono: <Icon name="MessageSquare" size={24} />,
      color: 'amarillo',
    },
  ];

  const colorClasses = {
    azul: 'bg-aduana-azul-50 text-aduana-azul border-aduana-azul-200',
    verde: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    amarillo: 'bg-amber-50 text-amber-600 border-amber-200',
    rojo: 'bg-red-50 text-red-600 border-red-200',
  };

  const tabs = [
    {
      id: 'indicadores',
      label: 'Indicadores',
      icon: <Icon name="BarChart2" size={16} />,
      content: (
        <div className="space-y-6">
          {/* KPIs principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Denuncias Procesadas"
              value={KPI_DASHBOARD.denuncias.total}
              subtitle="Este mes"
              colorScheme="azul"
              icon={<Icon name="FileCheck" size={24} />}
              trend={{ value: 8.5, label: 'vs mes anterior', isPositive: true }}
            />
            <StatCard
              title="Recaudación Total"
              value={KPI_DASHBOARD.giros.montoRecaudado}
              subtitle="Año fiscal"
              colorScheme="verde"
              icon={<Icon name="Wallet" size={24} />}
              trend={{ value: 12.3, label: 'vs año anterior', isPositive: true }}
            />
            <StatCard
              title="Tasa de Notificación"
              value={`${KPI_DASHBOARD.notificaciones.tasaExito}%`}
              subtitle="Exitosas"
              colorScheme="amarillo"
              icon={<Icon name="Send" size={24} />}
            />
            <StatCard
              title="Tiempo Prom. Resolución"
              value={`${KPI_DASHBOARD.reclamos.tiempoPromedioRespuesta} días`}
              subtitle="Reclamos"
              colorScheme="azul"
              icon={<Icon name="Clock" size={24} />}
            />
          </div>

          {/* Gráficos de progreso */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Estado de Denuncias</h4>
              <div className="space-y-4">
                <ProgressBar
                  label="Resueltas"
                  value={KPI_DASHBOARD.denuncias.resueltas}
                  max={KPI_DASHBOARD.denuncias.total}
                  colorScheme="verde"
                />
                <ProgressBar
                  label="En Proceso"
                  value={KPI_DASHBOARD.denuncias.enProceso}
                  max={KPI_DASHBOARD.denuncias.total}
                  colorScheme="azul"
                />
                <ProgressBar
                  label="Pendientes"
                  value={KPI_DASHBOARD.denuncias.pendientes}
                  max={KPI_DASHBOARD.denuncias.total}
                  colorScheme="amarillo"
                />
                <ProgressBar
                  label="Vencidas"
                  value={KPI_DASHBOARD.denuncias.vencidas}
                  max={KPI_DASHBOARD.denuncias.total}
                  colorScheme="rojo"
                />
              </div>
            </div>

            <div className="card p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Cargos por Estado</h4>
              <div className="space-y-4">
                <ProgressBar
                  label="Aprobados"
                  value={KPI_DASHBOARD.cargos.aprobados}
                  max={KPI_DASHBOARD.cargos.total}
                  colorScheme="verde"
                />
                <ProgressBar
                  label="Pendientes"
                  value={KPI_DASHBOARD.cargos.pendientes}
                  max={KPI_DASHBOARD.cargos.total}
                  colorScheme="amarillo"
                />
                <ProgressBar
                  label="Rechazados"
                  value={KPI_DASHBOARD.cargos.rechazados}
                  max={KPI_DASHBOARD.cargos.total}
                  colorScheme="rojo"
                />
              </div>
            </div>
          </div>

          {/* Métricas por Aduana */}
          <div className="card p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Métricas por Aduana</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aduana</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Denuncias</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Cargos</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Giros</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Recaudación</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Eficiencia</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { aduana: 'Valparaíso', denuncias: 45, cargos: 32, giros: 78, recaudacion: '$456M', eficiencia: 92 },
                    { aduana: 'Santiago', denuncias: 38, cargos: 28, giros: 65, recaudacion: '$389M', eficiencia: 88 },
                    { aduana: 'Antofagasta', denuncias: 22, cargos: 15, giros: 34, recaudacion: '$178M', eficiencia: 85 },
                    { aduana: 'Iquique', denuncias: 28, cargos: 18, giros: 42, recaudacion: '$234M', eficiencia: 90 },
                    { aduana: 'Los Andes', denuncias: 23, cargos: 16, giros: 38, recaudacion: '$156M', eficiencia: 87 },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{row.aduana}</td>
                      <td className="px-4 py-3 text-center text-gray-600">{row.denuncias}</td>
                      <td className="px-4 py-3 text-center text-gray-600">{row.cargos}</td>
                      <td className="px-4 py-3 text-center text-gray-600">{row.giros}</td>
                      <td className="px-4 py-3 text-center font-semibold text-emerald-600">{row.recaudacion}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          row.eficiencia >= 90 ? 'bg-emerald-100 text-emerald-700' :
                          row.eficiencia >= 85 ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {row.eficiencia}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'reportes',
      label: 'Generador de Reportes',
      icon: <Icon name="FileSpreadsheet" size={16} />,
      content: (
        <div className="space-y-6">
          <div className="alert alert-info">
            <Icon name="Info" size={20} />
            <div>
              <p className="font-medium">Reportes Auditables</p>
              <p className="text-sm mt-1">
                Todos los reportes generados quedan registrados para efectos de auditoría y trazabilidad.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportesDisponibles.map((reporte) => (
              <div
                key={reporte.id}
                className={`card p-5 border cursor-pointer hover:shadow-md transition-all ${
                  colorClasses[reporte.color as keyof typeof colorClasses]
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">{reporte.icono}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{reporte.titulo}</h4>
                    <p className="text-sm opacity-80 mt-1">{reporte.descripcion}</p>
                    <CustomButton variant="secondary" className="mt-3 text-xs">
                      Generar
                    </CustomButton>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Formulario de reporte personalizado */}
          <div className="card p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Reporte Personalizado</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="form-label">Tipo de Reporte</label>
                <select className="form-select">
                  <option>Seleccione...</option>
                  <option>Denuncias</option>
                  <option>Cargos</option>
                  <option>Giros</option>
                  <option>Reclamos</option>
                  <option>Notificaciones</option>
                </select>
              </div>
              <div>
                <label className="form-label">Aduana</label>
                <select className="form-select">
                  <option>Todas</option>
                  <option>Valparaíso</option>
                  <option>Santiago</option>
                  <option>Antofagasta</option>
                </select>
              </div>
              <div>
                <label className="form-label">Fecha Desde</label>
                <input type="date" className="form-input" />
              </div>
              <div>
                <label className="form-label">Fecha Hasta</label>
                <input type="date" className="form-input" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <CustomButton variant="secondary" className="flex items-center gap-2">
                <Icon name="Eye" size={16} />
                Vista Previa
              </CustomButton>
              <CustomButton variant="primary" className="flex items-center gap-2">
                <Icon name="Download" size={16} />
                Descargar Excel
              </CustomButton>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'auditoria',
      label: 'Auditoría',
      icon: <Icon name="Shield" size={16} />,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-5 border-l-4 border-l-aduana-azul">
              <p className="text-sm text-gray-600">Acciones Registradas</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">12,456</p>
              <p className="text-xs text-gray-500">Últimos 30 días</p>
            </div>
            <div className="card p-5 border-l-4 border-l-emerald-500">
              <p className="text-sm text-gray-600">Usuarios Activos</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">65</p>
              <p className="text-xs text-gray-500">Funcionarios</p>
            </div>
            <div className="card p-5 border-l-4 border-l-amber-500">
              <p className="text-sm text-gray-600">Reportes Generados</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">234</p>
              <p className="text-xs text-gray-500">Este mes</p>
            </div>
          </div>

          <div className="card p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Últimas Acciones del Sistema</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Fecha/Hora</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Usuario</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Acción</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Módulo</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Detalle</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { fecha: '2024-11-20 14:35', usuario: 'jrodriguez', accion: 'Edición', modulo: 'Denuncias', detalle: '993519' },
                    { fecha: '2024-11-20 14:22', usuario: 'mgonzalez', accion: 'Aprobación', modulo: 'Cargos', detalle: 'CAR-2024-005678' },
                    { fecha: '2024-11-20 13:58', usuario: 'plopez', accion: 'Generación', modulo: 'Giros', detalle: 'F09-2024-001234' },
                    { fecha: '2024-11-20 13:45', usuario: 'jrodriguez', accion: 'Notificación', modulo: 'Notificaciones', detalle: 'NOT-2024-009876' },
                    { fecha: '2024-11-20 13:30', usuario: 'admin', accion: 'Reporte', modulo: 'Reportes', detalle: 'Exportación Excel' },
                  ].map((log, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600">{log.fecha}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{log.usuario}</td>
                      <td className="px-4 py-3 text-gray-600">{log.accion}</td>
                      <td className="px-4 py-3 text-gray-600">{log.modulo}</td>
                      <td className="px-4 py-3 text-aduana-azul">{log.detalle}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ),
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
              <h1 className="text-2xl font-bold text-gray-900">Reportes e Indicadores</h1>
            </div>
            <p className="text-gray-600 mt-1 ml-7">
              Análisis, métricas y generación de reportes del sistema
            </p>
          </div>
          <CustomButton 
            className="btn-primary flex items-center gap-2"
            onClick={() => {}}
          >
            <Icon name="RefreshCw" size={18} />
            Actualizar Datos
          </CustomButton>
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} variant="boxed" />
      </div>
    </CustomLayout>
  );
};

export default ReportesDashboard;

