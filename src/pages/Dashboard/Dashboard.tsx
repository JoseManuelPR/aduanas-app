import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from "he-button-custom-library";
import CONSTANTS_APP from "../../constants/sidebar-menu";
import CustomLayout from "../../Layout/Layout";
import { Badge, StatCard, ProgressRing } from "../../components/UI";
import { ERoutePaths } from "../../routes/routes";

// Datos centralizados
import {
  cargos,
  denuncias,
  giros,
  getAlertasCriticas,
  getCargoPorNumero,
  getDenunciaPorNumero,
  getCargosPorVencer,
  getGiroPorNumero,
  getDenunciasPorVencer,
  getReclamoPorNumero,
  getGirosPorVencer,
  getKPIDashboard,
  getTodasLasNotificaciones,
  usuarioActual,
  getConteoAlertas,
} from '../../data';

type EstadoColor = 'success' | 'warning' | 'info' | 'error';

const estadoColorMap: Record<string, EstadoColor> = {
  Borrador: 'info',
  Ingresada: 'info',
  'En Revisión': 'warning',
  Formulada: 'info',
  Notificada: 'warning',
  'En Proceso': 'warning',
  Observada: 'error',
  Cerrada: 'success',
  Archivada: 'info',
  'Pendiente Aprobación': 'warning',
  'En Revisión Cargo': 'warning',
  Emitido: 'info',
  Aprobado: 'success',
  Notificado: 'warning',
  Cerrado: 'success',
  Anulado: 'error',
  Vencido: 'error',
  Pagado: 'success',
};

const parseFecha = (fecha?: string): number => {
  if (!fecha) return 0;
  const parts = fecha.split('-');
  if (parts.length === 3) {
    const [dd, mm, yyyy] = parts;
    return new Date(Number(yyyy), Number(mm) - 1, Number(dd)).getTime();
  }
  const parsed = Date.parse(fecha);
  return Number.isNaN(parsed) ? 0 : parsed;
};

// Priority level for alerts
type AlertPriority = 'critical' | 'high' | 'medium' | 'low';

const getPriorityConfig = (priority: AlertPriority) => {
  const configs = {
    critical: {
      bg: 'bg-red-600',
      bgLight: 'bg-red-50',
      border: 'border-red-600',
      text: 'text-red-900',
      textLight: 'text-red-700',
      icon: 'AlertTriangle',
      iconBg: 'bg-red-600',
      iconColor: 'text-white',
      actionBg: 'bg-red-600 hover:bg-red-700',
      pulse: true,
    },
    high: {
      bg: 'bg-orange-500',
      bgLight: 'bg-orange-50',
      border: 'border-orange-500',
      text: 'text-orange-900',
      textLight: 'text-orange-700',
      icon: 'AlertCircle',
      iconBg: 'bg-orange-500',
      iconColor: 'text-white',
      actionBg: 'bg-orange-500 hover:bg-orange-600',
      pulse: false,
    },
    medium: {
      bg: 'bg-amber-500',
      bgLight: 'bg-amber-50',
      border: 'border-amber-400',
      text: 'text-amber-900',
      textLight: 'text-amber-700',
      icon: 'Clock',
      iconBg: 'bg-amber-500',
      iconColor: 'text-white',
      actionBg: 'bg-amber-500 hover:bg-amber-600',
      pulse: false,
    },
    low: {
      bg: 'bg-blue-500',
      bgLight: 'bg-blue-50',
      border: 'border-blue-300',
      text: 'text-blue-900',
      textLight: 'text-blue-700',
      icon: 'Info',
      iconBg: 'bg-blue-500',
      iconColor: 'text-white',
      actionBg: 'bg-blue-500 hover:bg-blue-600',
      pulse: false,
    },
  };
  return configs[priority];
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const buildDetailPath = (template: string, id: string) =>
    template.replace(':id', id);

  const getDetallePath = (referencia?: string): string | null => {
    if (!referencia) return null;
    const ref = referencia.trim();

    const denuncia = getDenunciaPorNumero(ref);
    if (denuncia) return buildDetailPath(ERoutePaths.DENUNCIAS_DETALLE, denuncia.id);

    const cargo = getCargoPorNumero(ref);
    if (cargo) return buildDetailPath(ERoutePaths.CARGOS_DETALLE, cargo.id);

    const reclamo = getReclamoPorNumero(ref);
    if (reclamo) return buildDetailPath(ERoutePaths.RECLAMOS_DETALLE, reclamo.id);

    const giro = getGiroPorNumero(ref);
    if (giro) return buildDetailPath(ERoutePaths.GIROS_DETALLE, giro.id);

    return null;
  };

  const handleNavigateToDetalle = (referencia?: string): boolean => {
    const path = getDetallePath(referencia);
    if (path) {
      navigate(path);
      return true;
    }
    return false;
  };
  
  // Obtener KPIs desde los datos centralizados
  const KPI_DASHBOARD = getKPIDashboard();
  const allNotifications = getTodasLasNotificaciones();
  const conteoAlertas = getConteoAlertas();

  // Alertas procesadas con prioridad visual
  const alertasCriticas = useMemo(() => getAlertasCriticas(), []);
  const alertasConPrioridad = useMemo(() => {
    return alertasCriticas.map((a) => {
      let priority: AlertPriority = 'low';
      if (a.tipo === 'vencido' || (a.diasVencidos && a.diasVencidos > 0)) {
        priority = 'critical';
      } else if (a.tipo === 'critico') {
        priority = 'high';
      } else if (a.tipo === 'advertencia') {
        priority = 'medium';
      }

      return {
        id: a.id,
        titulo: a.titulo,
        descripcion: a.descripcion,
        expediente: a.expediente,
        fechaVencimiento: a.fechaVencimiento,
        diasVencidos: a.diasVencidos,
        diasRestantes: a.diasRestantes,
        priority,
        timeLabel: a.diasVencidos 
          ? `Vencido hace ${a.diasVencidos}d`
          : a.diasRestantes === 0 
            ? 'Vence hoy'
            : a.diasRestantes === 1
              ? 'Vence mañana'
              : a.diasRestantes 
                ? `${a.diasRestantes}d restantes`
                : '',
      };
    }).sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [alertasCriticas]);

  // Actividad reciente simplificada
  const actividadReciente = useMemo(() => {
    const eventos = [
      ...denuncias.slice(0, 3).map((d) => ({
        id: `den-${d.numeroDenuncia}`,
        tipo: 'Denuncia',
        referencia: d.numeroDenuncia,
        estado: d.estado,
        estadoColor: estadoColorMap[d.estado] || 'info',
        fecha: parseFecha(d.fechaCreacion || d.fechaIngreso),
      })),
      ...cargos.slice(0, 2).map((c) => ({
        id: `car-${c.numeroCargo}`,
        tipo: 'Cargo',
        referencia: c.numeroCargo,
        estado: c.estado,
        estadoColor: estadoColorMap[c.estado] || 'info',
        fecha: parseFecha(c.fechaCreacion || c.fechaIngreso),
      })),
      ...giros.slice(0, 2).map((g) => ({
        id: `gir-${g.numeroGiro}`,
        tipo: 'Giro',
        referencia: g.numeroGiro,
        estado: g.estado,
        estadoColor: estadoColorMap[g.estado] || 'info',
        fecha: parseFecha(g.fechaCreacion || g.fechaEmision),
      })),
    ];
    return eventos
      .sort((a, b) => b.fecha - a.fecha)
      .slice(0, 5);
  }, []);

  // Plazos críticos con prioridad visual
  const plazosCriticos = useMemo(() => {
    const proximasDenuncias = getDenunciasPorVencer(3).map((d) => ({
      id: `pd-${d.numeroDenuncia}`,
      tipo: 'Denuncia',
      numero: d.numeroDenuncia,
      dias: d.diasVencimiento,
    }));
    const proximosCargos = getCargosPorVencer(3).map((c) => ({
      id: `pc-${c.numeroCargo}`,
      tipo: 'Cargo',
      numero: c.numeroCargo,
      dias: c.diasVencimiento,
    }));
    const proximosGiros = getGirosPorVencer(3).map((g) => ({
      id: `pg-${g.numeroGiro}`,
      tipo: 'Giro',
      numero: g.numeroGiro,
      dias: g.diasVencimiento ?? 0,
    }));

    return [...proximasDenuncias, ...proximosCargos, ...proximosGiros]
      .sort((a, b) => a.dias - b.dias)
      .slice(0, 5)
      .map((p) => ({
        ...p,
        priority: p.dias < 0 ? 'critical' as AlertPriority 
          : p.dias === 0 ? 'critical' as AlertPriority
          : p.dias <= 2 ? 'high' as AlertPriority
          : 'medium' as AlertPriority,
        timeLabel: p.dias < 0 
          ? `Vencido hace ${Math.abs(p.dias)}d` 
          : p.dias === 0 
            ? 'Vence hoy'
            : p.dias === 1
              ? 'Vence mañana'
              : `${p.dias} días`,
      }));
  }, []);

  // Calcular totales para las cards
  const denunciasActivas = KPI_DASHBOARD.denuncias.pendientes + KPI_DASHBOARD.denuncias.enProceso;
  const cargosProceso = KPI_DASHBOARD.cargos.pendientes;
  const girosEmitidos = KPI_DASHBOARD.giros.emitidos;
  const casosResueltos = KPI_DASHBOARD.denuncias.resueltas + (KPI_DASHBOARD.cargos.aprobados || 0);

  // Cálculo de tasa de resolución
  const totalCasos = KPI_DASHBOARD.denuncias.total + KPI_DASHBOARD.cargos.total;
  const tasaResolucion = totalCasos > 0 ? Math.round((casosResueltos / totalCasos) * 100) : 0;

  // Conteo de urgentes para el panel ejecutivo
  const casosUrgentes = conteoAlertas.vencidas + conteoAlertas.criticas;
  const casosPorVencer = KPI_DASHBOARD.denuncias.porVencer;

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
      <div className="min-h-full">
        {/* ═══════════════════════════════════════════════════════════════════
            SECCIÓN 1: VISIÓN EJECUTIVA
            Responde: ¿Dónde estamos y qué está mal?
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="breathing-section-lg animate-fade-in">
          {/* Executive Summary Panel */}
          <div className="executive-panel mb-8">
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
                {/* Left: Greeting and status */}
                <div className="flex-1 min-w-0">
                  <p className="text-white/70 text-sm font-medium uppercase tracking-wide">
                    Panel de Control
                  </p>
                  <h1 className="text-2xl md:text-3xl font-bold text-white mt-1">
                    Buenos días, {usuarioActual.name.split(' ')[0]}
                  </h1>
                  <p className="text-white/80 mt-2">
                    {casosUrgentes > 0 
                      ? `Tienes ${casosUrgentes} casos que requieren atención inmediata.`
                      : 'No hay casos críticos pendientes. Buen trabajo.'}
                  </p>
                </div>

                {/* Right: Key metrics at a glance */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {/* Critical indicator */}
                  {casosUrgentes > 0 && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20 animate-pulse-subtle">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" />
                        <div>
                          <p className="text-white/70 text-xs uppercase tracking-wide">Críticos</p>
                          <p className="text-white text-2xl font-bold">{casosUrgentes}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Resolution rate */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                    <div className="flex items-center gap-3">
                      <ProgressRing 
                        value={tasaResolucion} 
                        size="sm" 
                        color="green"
                        showValue={false}
                      />
                      <div>
                        <p className="text-white/70 text-xs uppercase tracking-wide">Resolución</p>
                        <p className="text-white text-2xl font-bold">{tasaResolucion}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Pending */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                        <Icon name="Clock" size={20} className="text-amber-300" />
                      </div>
                      <div>
                        <p className="text-white/70 text-xs uppercase tracking-wide">Por vencer</p>
                        <p className="text-white text-2xl font-bold">{casosPorVencer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KPI Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="animate-fade-in-up-stagger animate-delay-100">
              <StatCard
                title="Denuncias Activas"
                value={denunciasActivas}
                icon="FileText"
                accent="blue"
                trend={{ value: 12, sentiment: 'negative', period: 'vs mes ant.' }}
                onClick={() => navigate(ERoutePaths.DENUNCIAS)}
              />
            </div>
            
            <div className="animate-fade-in-up-stagger animate-delay-150">
              <StatCard
                title="Cargos en Proceso"
                value={cargosProceso}
                icon="ClipboardList"
                accent="amber"
                trend={{ value: -5, sentiment: 'positive', period: 'vs mes ant.' }}
                onClick={() => navigate(ERoutePaths.CARGOS)}
              />
            </div>
            
            <div className="animate-fade-in-up-stagger animate-delay-200">
              <StatCard
                title="Giros Emitidos"
                value={girosEmitidos}
                icon="DollarSign"
                accent="green"
                trend={{ value: 8, sentiment: 'positive', period: 'vs mes ant.' }}
                onClick={() => navigate(ERoutePaths.GIROS)}
              />
            </div>
            
            <div className="animate-fade-in-up-stagger animate-delay-300">
              <StatCard
                title="Casos Resueltos"
                value={casosResueltos}
                icon="CheckCircle"
                accent="green"
                trend={{ value: 15, sentiment: 'positive', period: 'vs mes ant.' }}
                onClick={() => navigate(ERoutePaths.DENUNCIAS)}
              />
            </div>
          </div>
        </section>

        {/* Visual Separator */}
        <div className="section-divider" />

        {/* ═══════════════════════════════════════════════════════════════════
            SECCIÓN 2: DETALLE OPERATIVO  
            Responde: ¿Qué caso específico debo gestionar ahora y cómo?
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="breathing-section animate-fade-in animate-delay-300">
          <div className="dashboard-section-header mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Icon name="AlertTriangle" size={22} className="text-red-500" />
                Requiere tu atención
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Casos que necesitan acción inmediata ordenados por urgencia
              </p>
            </div>
          </div>

          {/* Critical Alerts - Visual Priority */}
          <div className="space-y-3 mb-8">
            {alertasConPrioridad.slice(0, 4).map((alerta, index) => {
              const config = getPriorityConfig(alerta.priority);
              return (
                <div 
                  key={alerta.id}
                  className={`
                    rounded-xl border-l-4 ${config.border} ${config.bgLight}
                    p-4 flex items-center gap-4 transition-all duration-200
                    hover:shadow-md cursor-pointer
                    animate-fade-in-up-stagger
                    ${config.pulse ? 'animate-pulse-subtle' : ''}
                  `}
                  style={{ animationDelay: `${(index + 1) * 75}ms` }}
                  onClick={() => {
                    const navigated = handleNavigateToDetalle(alerta.expediente);
                    if (!navigated) navigate(ERoutePaths.NOTIFICACIONES);
                  }}
                >
                  {/* Priority Icon */}
                  <div className={`w-10 h-10 rounded-xl ${config.iconBg} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <Icon name={config.icon as any} size={20} className={config.iconColor} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className={`font-semibold ${config.text} truncate`}>
                          {alerta.titulo}
                        </h4>
                        <p className={`text-sm ${config.textLight} mt-0.5 line-clamp-1`}>
                          {alerta.descripcion}
                        </p>
                      </div>
                      
                      {/* Time badge - prominent for critical */}
                      {alerta.timeLabel && (
                        <span className={`
                          px-3 py-1 rounded-lg text-sm font-bold whitespace-nowrap flex-shrink-0
                          ${alerta.priority === 'critical' 
                            ? 'bg-red-600 text-white shadow-sm' 
                            : `${config.bgLight} ${config.text}`
                          }
                        `}>
                          {alerta.timeLabel}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <button
                    className={`
                      px-4 py-2 rounded-lg text-sm font-semibold text-white
                      ${config.actionBg} shadow-sm transition-all
                      flex items-center gap-2 flex-shrink-0
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      const navigated = handleNavigateToDetalle(alerta.expediente);
                      if (!navigated) navigate(ERoutePaths.NOTIFICACIONES);
                    }}
                  >
                    Gestionar
                    <Icon name="ArrowRight" size={14} />
                  </button>
                </div>
              );
            })}

            {alertasConPrioridad.length > 4 && (
              <button
                onClick={() => navigate(ERoutePaths.NOTIFICACIONES)}
                className="w-full py-3 text-center text-sm font-medium text-aduana-azul hover:text-aduana-azul-600 hover:bg-aduana-azul-50 rounded-lg transition-colors"
              >
                Ver todas las alertas ({alertasConPrioridad.length} total)
              </button>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECCIÓN 3: PLAZOS Y ACTIVIDAD
            Información secundaria bien separada
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="breathing-section animate-fade-in animate-delay-400">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Plazos Críticos - Compact visual */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Icon name="Calendar" size={16} className="text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Próximos vencimientos</h3>
                    <p className="text-xs text-gray-500">Próximos 7 días</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full border border-gray-200">
                  {plazosCriticos.length} casos
                </span>
              </div>

              <div className="divide-y divide-gray-50">
                {plazosCriticos.map((plazo) => {
                  return (
                    <div 
                      key={plazo.id} 
                      className="px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleNavigateToDetalle(plazo.numero)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Priority dot */}
                        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                          plazo.priority === 'critical' ? 'bg-red-500 animate-pulse' :
                          plazo.priority === 'high' ? 'bg-orange-500' :
                          'bg-amber-500'
                        }`} />
                        
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {plazo.tipo} <span className="text-aduana-azul">{plazo.numero}</span>
                          </p>
                        </div>
                      </div>
                      
                      <span className={`text-sm font-bold ${
                        plazo.priority === 'critical' ? 'text-red-600' :
                        plazo.priority === 'high' ? 'text-orange-600' :
                        'text-amber-600'
                      }`}>
                        {plazo.timeLabel}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
                <button 
                  onClick={() => navigate(ERoutePaths.NOTIFICACIONES)}
                  className="w-full text-center text-sm font-medium text-gray-600 hover:text-aduana-azul transition-colors"
                >
                  Ver calendario completo →
                </button>
              </div>
            </div>

            {/* Actividad Reciente - Clean list */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Icon name="Activity" size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Actividad reciente</h3>
                    <p className="text-xs text-gray-500">Últimos movimientos</p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-50">
                {actividadReciente.map((actividad) => (
                  <div 
                    key={actividad.id} 
                    className="px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleNavigateToDetalle(actividad.referencia)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Type icon */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        actividad.tipo === 'Denuncia' ? 'bg-blue-100' :
                        actividad.tipo === 'Cargo' ? 'bg-amber-100' :
                        'bg-emerald-100'
                      }`}>
                        <Icon 
                          name={
                            actividad.tipo === 'Denuncia' ? 'FileText' :
                            actividad.tipo === 'Cargo' ? 'ClipboardList' :
                            'DollarSign'
                          } 
                          size={14} 
                          className={
                            actividad.tipo === 'Denuncia' ? 'text-blue-600' :
                            actividad.tipo === 'Cargo' ? 'text-amber-600' :
                            'text-emerald-600'
                          }
                        />
                      </div>
                      
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          <span className="text-aduana-azul">{actividad.referencia}</span>
                        </p>
                        <p className="text-xs text-gray-500">{actividad.tipo}</p>
                      </div>
                    </div>
                    
                    <Badge 
                      variant={actividad.estadoColor as any}
                      size="sm"
                      dot
                    >
                      {actividad.estado}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECCIÓN 4: ACCESO RÁPIDO
            Acciones frecuentes claramente visibles
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="breathing-section-lg animate-fade-in animate-delay-500">
          <div className="dashboard-section-header mb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Acceso rápido</h2>
              <p className="text-sm text-gray-500">Acciones frecuentes</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate(ERoutePaths.DENUNCIAS)}
              className="quick-action-card group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Icon name="FilePlus" size={24} className="text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Nueva Denuncia</p>
                <p className="text-xs text-gray-500">Crear expediente</p>
              </div>
            </button>

            <button
              onClick={() => navigate(ERoutePaths.CARGOS)}
              className="quick-action-card group"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                <Icon name="ClipboardList" size={24} className="text-amber-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Gestionar Cargos</p>
                <p className="text-xs text-gray-500">Ver pendientes</p>
              </div>
            </button>

            <button
              onClick={() => navigate(ERoutePaths.GIROS)}
              className="quick-action-card group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                <Icon name="DollarSign" size={24} className="text-emerald-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Emitir Giro</p>
                <p className="text-xs text-gray-500">Cobros pendientes</p>
              </div>
            </button>

            <button
              onClick={() => navigate(ERoutePaths.RECLAMOS)}
              className="quick-action-card group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <Icon name="FileQuestion" size={24} className="text-purple-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Ver Reclamos</p>
                <p className="text-xs text-gray-500">En tramitación</p>
              </div>
            </button>
          </div>
        </section>
      </div>
    </CustomLayout>
  );
};

export default Dashboard;
