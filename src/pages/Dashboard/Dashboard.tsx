import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from "he-button-custom-library";
import CONSTANTS_APP from "../../constants/sidebar-menu";
import CustomLayout from "../../Layout/Layout";
import { Badge } from "../../components/UI";
import { ERoutePaths } from "../../routes/routes";

// Datos centralizados
import {
  cargos,
  denuncias,
  giros,
  reclamos,
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

  // Alertas y plazos críticos desde mock base
  const alertasCriticas = useMemo(() => getAlertasCriticas(), []);
  const alertasYPlazos = useMemo(() => {
    const iconByTipo: Record<string, string> = {
      critico: 'AlertTriangle',
      vencido: 'Clock',
      advertencia: 'AlertCircle',
      informativo: 'Info',
    };
    const colorByTipo: Record<string, string> = {
      critico: 'text-red-600',
      vencido: 'text-red-600',
      advertencia: 'text-amber-600',
      informativo: 'text-sky-600',
    };
    const bgByTipo: Record<string, string> = {
      critico: 'bg-red-100',
      vencido: 'bg-red-100',
      advertencia: 'bg-amber-100',
      informativo: 'bg-sky-100',
    };
    return alertasCriticas.map((a) => ({
      id: a.id,
      titulo: a.titulo,
      descripcion: a.descripcion,
      expediente: a.expediente,
      tiempo: a.fechaVencimiento || '—',
      icono: iconByTipo[a.tipo] || 'Info',
      color: colorByTipo[a.tipo] || 'text-gray-600',
      bgColor: bgByTipo[a.tipo] || 'bg-gray-100',
    }));
  }, [alertasCriticas]);

  const actividadReciente = useMemo(() => {
    const eventos = [
      ...denuncias.map((d) => ({
        id: `den-${d.numeroDenuncia}`,
        accion: 'Denuncia creada',
        referencia: d.numeroDenuncia,
        usuario: d.usuarioCreacion || 'Sistema',
        tiempo: d.fechaCreacion || d.fechaIngreso,
        estado: d.estado,
        estadoColor: estadoColorMap[d.estado] || 'info',
        fecha: parseFecha(d.fechaCreacion || d.fechaIngreso),
      })),
      ...cargos.map((c) => ({
        id: `car-${c.numeroCargo}`,
        accion: 'Cargo registrado',
        referencia: c.numeroCargo,
        usuario: c.usuarioCreacion || 'Sistema',
        tiempo: c.fechaCreacion || c.fechaIngreso,
        estado: c.estado,
        estadoColor: estadoColorMap[c.estado] || 'info',
        fecha: parseFecha(c.fechaCreacion || c.fechaIngreso),
      })),
      ...giros.map((g) => ({
        id: `gir-${g.numeroGiro}`,
        accion: 'Giro emitido',
        referencia: g.numeroGiro,
        usuario: g.usuarioCreacion || 'Sistema',
        tiempo: g.fechaCreacion || g.fechaEmision,
        estado: g.estado,
        estadoColor: estadoColorMap[g.estado] || 'info',
        fecha: parseFecha(g.fechaCreacion || g.fechaEmision),
      })),
      ...reclamos.map((r) => ({
        id: `rec-${r.numeroReclamo}`,
        accion: 'Reclamo ingresado',
        referencia: r.numeroReclamo,
        usuario: r.usuarioCreacion || 'Sistema',
        tiempo: r.fechaCreacion || r.fechaIngreso,
        estado: r.estado,
        estadoColor: estadoColorMap[r.estado] || 'info',
        fecha: parseFecha(r.fechaCreacion || r.fechaIngreso),
      })),
    ];
    return eventos
      .sort((a, b) => b.fecha - a.fecha)
      .slice(0, 5);
  }, []);

  const plazosCriticos = useMemo(() => {
    const proximasDenuncias = getDenunciasPorVencer(1).map((d) => ({
      id: `pd-${d.numeroDenuncia}`,
      tipo: 'Denuncia',
      numero: d.numeroDenuncia,
      dias: d.diasVencimiento,
    }));
    const proximosCargos = getCargosPorVencer(1).map((c) => ({
      id: `pc-${c.numeroCargo}`,
      tipo: 'Cargo',
      numero: c.numeroCargo,
      dias: c.diasVencimiento,
    }));
    const proximosGiros = getGirosPorVencer(1).map((g) => ({
      id: `pg-${g.numeroGiro}`,
      tipo: 'Giro',
      numero: g.numeroGiro,
      dias: g.diasVencimiento ?? 0,
    }));

    const formatTiempo = (dias: number) => {
      if (dias < 0) return `Vencido hace ${Math.abs(dias)}d`;
      if (dias === 0) return 'Vence hoy';
      if (dias === 1) return 'Vence en 1 día';
      return `Vence en ${dias} días`;
    };

    return [...proximasDenuncias, ...proximosCargos, ...proximosGiros].map((p) => ({
      ...p,
      tiempo: formatTiempo(p.dias),
      horas: p.dias === 0 ? 'hoy' : `${p.dias}d`,
    }));
  }, []);

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
                    <button
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100"
                      onClick={() => {
                        const navigated = handleNavigateToDetalle(alerta.expediente);
                        if (!navigated) {
                          navigate(ERoutePaths.NOTIFICACIONES);
                        }
                      }}
                    >
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
                      <button
                        onClick={() => handleNavigateToDetalle(actividad.referencia)}
                        className="font-semibold text-aduana-azul hover:underline"
                      >
                        {actividad.referencia}
                      </button>
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
                  <button
                    onClick={() => handleNavigateToDetalle(plazo.numero)}
                    className="font-medium text-aduana-azul hover:underline"
                  >
                    {plazo.tipo} {plazo.numero}
                  </button>
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
