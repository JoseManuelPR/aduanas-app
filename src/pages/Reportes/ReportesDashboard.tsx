import React, { useState } from 'react';
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

// Tipo para ordenamiento de columnas
type SortColumn = 'aduana' | 'denuncias' | 'cargos' | 'giros' | 'recaudacion' | 'eficiencia';
type SortDirection = 'asc' | 'desc';

export const ReportesDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Estado para ordenamiento de tabla
  const [sortColumn, setSortColumn] = useState<SortColumn>('recaudacion');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Obtener datos centralizados
  const allNotifications = getTodasLasNotificaciones();
  const KPI_DASHBOARD = getKPIs();
  
  // Datos de la tabla con valores numéricos para ordenamiento
  const datosAduanas = [
    { aduana: 'Valparaíso', denuncias: 45, cargos: 32, giros: 78, recaudacion: 456, eficiencia: 92 },
    { aduana: 'Santiago', denuncias: 38, cargos: 28, giros: 65, recaudacion: 389, eficiencia: 88 },
    { aduana: 'Antofagasta', denuncias: 22, cargos: 15, giros: 34, recaudacion: 178, eficiencia: 85 },
    { aduana: 'Iquique', denuncias: 28, cargos: 18, giros: 42, recaudacion: 234, eficiencia: 90 },
    { aduana: 'Los Andes', denuncias: 23, cargos: 16, giros: 38, recaudacion: 156, eficiencia: 87 },
  ];
  
  // Función para ordenar datos
  const sortedData = [...datosAduanas].sort((a, b) => {
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortDirection === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });
  
  // Función para manejar click en columna
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };
  
  // Componente de encabezado ordenable
  const SortableHeader = ({ column, label }: { column: SortColumn; label: string }) => (
    <th 
      className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors select-none"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center justify-center gap-1">
        {label}
        <span className={`transition-opacity ${sortColumn === column ? 'opacity-100' : 'opacity-30'}`}>
          {sortColumn === column && sortDirection === 'asc' ? '↑' : '↓'}
        </span>
      </div>
    </th>
  );

  // Reportes disponibles
  const reportesDisponibles = [
    {
      id: 'denuncias-periodo',
      titulo: 'Denuncias por Período',
      descripcion: 'Resumen de denuncias ingresadas y cerradas',
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
              accent="blue"
              icon="FileCheck"
              trend={{ value: 8.5, period: 'vs mes anterior', sentiment: 'positive' }}
              highlighted={true}
              tooltip="Total de denuncias que han sido tramitadas (ingresadas, en proceso, resueltas) durante el período actual."
            />
            <StatCard
              title="Recaudación Total"
              value={KPI_DASHBOARD.giros.montoRecaudado}
              subtitle="Año fiscal (millones CLP)"
              accent="green"
              icon="Wallet"
              trend={{ value: 12.3, period: 'vs año anterior', sentiment: 'positive' }}
              highlighted={true}
              tooltip="Suma de todos los giros pagados durante el año fiscal vigente. Incluye multas, derechos e impuestos recaudados."
            />
            <StatCard
              title="Tasa de Notificación"
              value={`${KPI_DASHBOARD.notificaciones.tasaExito}%`}
              subtitle="Exitosas sobre enviadas"
              accent="amber"
              icon="Send"
              tooltip={`Porcentaje de notificaciones electrónicas exitosas sobre el total de notificaciones enviadas. Base: ${KPI_DASHBOARD.notificaciones.enviadas} notificaciones enviadas este período.`}
            />
            <StatCard
              title="Tiempo Prom. Resolución"
              value={`${KPI_DASHBOARD.reclamos.tiempoPromedioRespuesta} días`}
              subtitle="Reclamos administrativos"
              accent="blue"
              icon="Clock"
              tooltip="Tiempo promedio en días hábiles desde el ingreso de un reclamo administrativo (Reposición o TTA) hasta su resolución final. No incluye denuncias."
            />
          </div>

          {/* Gráficos de progreso */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Estado de Denuncias</h4>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Total: <strong>{KPI_DASHBOARD.denuncias.total}</strong> denuncias
                </span>
              </div>
              <div className="space-y-4">
                <ProgressBar
                  label="Resueltas"
                  value={KPI_DASHBOARD.denuncias.resueltas}
                  max={KPI_DASHBOARD.denuncias.total}
                  colorScheme="verde"
                  showAbsoluteValue
                />
                <ProgressBar
                  label="En Proceso"
                  value={KPI_DASHBOARD.denuncias.enProceso}
                  max={KPI_DASHBOARD.denuncias.total}
                  colorScheme="azul"
                  showAbsoluteValue
                />
                <ProgressBar
                  label="Pendientes"
                  value={KPI_DASHBOARD.denuncias.pendientes}
                  max={KPI_DASHBOARD.denuncias.total}
                  colorScheme="amarillo-soft"
                  showAbsoluteValue
                />
                <ProgressBar
                  label="Vencidas"
                  value={KPI_DASHBOARD.denuncias.vencidas}
                  max={KPI_DASHBOARD.denuncias.total}
                  colorScheme="rojo"
                  showAbsoluteValue
                />
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Cargos por Estado</h4>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Total: <strong>{KPI_DASHBOARD.cargos.total}</strong> cargos
                </span>
              </div>
              <div className="space-y-4">
                <ProgressBar
                  label="Aprobados"
                  value={KPI_DASHBOARD.cargos.aprobados}
                  max={KPI_DASHBOARD.cargos.total}
                  colorScheme="verde"
                  showAbsoluteValue
                />
                <ProgressBar
                  label="Pendientes"
                  value={KPI_DASHBOARD.cargos.pendientes}
                  max={KPI_DASHBOARD.cargos.total}
                  colorScheme="amarillo-soft"
                  showAbsoluteValue
                />
                <ProgressBar
                  label="Rechazados"
                  value={KPI_DASHBOARD.cargos.rechazados}
                  max={KPI_DASHBOARD.cargos.total}
                  colorScheme="rojo"
                  showAbsoluteValue
                />
              </div>
            </div>
          </div>

          {/* Métricas por Aduana */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Métricas por Aduana</h4>
              <span className="text-xs text-gray-500">
                Click en columnas para ordenar
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('aduana')}
                    >
                      <div className="flex items-center gap-1">
                        Aduana
                        <span className={`transition-opacity ${sortColumn === 'aduana' ? 'opacity-100' : 'opacity-30'}`}>
                          {sortColumn === 'aduana' && sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      </div>
                    </th>
                    <SortableHeader column="denuncias" label="Denuncias" />
                    <SortableHeader column="cargos" label="Cargos" />
                    <SortableHeader column="giros" label="Giros" />
                    <th 
                      className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('recaudacion')}
                    >
                      <div className="flex items-center justify-center gap-1 group relative">
                        <span>Recaudación</span>
                        <span className={`transition-opacity ${sortColumn === 'recaudacion' ? 'opacity-100' : 'opacity-30'}`}>
                          {sortColumn === 'recaudacion' && sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                        <Icon name="HelpCircle" size={12} className="text-gray-400 ml-1" />
                        <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 w-40 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 normal-case font-normal">
                          Valores en millones de pesos chilenos (CLP)
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                        </div>
                      </div>
                    </th>
                    <SortableHeader column="eficiencia" label="Eficiencia" />
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{row.aduana}</td>
                      <td className="px-4 py-3 text-center text-gray-600">{row.denuncias}</td>
                      <td className="px-4 py-3 text-center text-gray-600">{row.cargos}</td>
                      <td className="px-4 py-3 text-center text-gray-600">{row.giros}</td>
                      <td className="px-4 py-3 text-center font-semibold text-emerald-600">
                        ${row.recaudacion}M
                      </td>
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
                {/* Total de recaudación */}
                <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                  <tr>
                    <td className="px-4 py-3 font-bold text-gray-900">Total</td>
                    <td className="px-4 py-3 text-center font-semibold text-gray-700">
                      {datosAduanas.reduce((acc, row) => acc + row.denuncias, 0)}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-gray-700">
                      {datosAduanas.reduce((acc, row) => acc + row.cargos, 0)}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-gray-700">
                      {datosAduanas.reduce((acc, row) => acc + row.giros, 0)}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-emerald-700">
                      ${datosAduanas.reduce((acc, row) => acc + row.recaudacion, 0).toLocaleString('es-CL')}M
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-gray-700">
                      {Math.round(datosAduanas.reduce((acc, row) => acc + row.eficiencia, 0) / datosAduanas.length)}%
                    </td>
                  </tr>
                </tfoot>
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
          <div className="relative group">
            <CustomButton 
              className="btn-primary flex items-center gap-2"
              onClick={() => {}}
            >
              <Icon name="RefreshCw" size={18} />
              Actualizar Datos
            </CustomButton>
            {/* Tooltip explicativo */}
            <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <p className="font-semibold mb-1">Recarga de datos</p>
              <p className="text-gray-300">
                Reconsulta los indicadores y métricas desde la base de datos para mostrar la información más reciente.
              </p>
              <div className="absolute -top-1.5 right-6 w-3 h-3 bg-gray-900 rotate-45"></div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} variant="boxed" />
      </div>
    </CustomLayout>
  );
};

export default ReportesDashboard;

