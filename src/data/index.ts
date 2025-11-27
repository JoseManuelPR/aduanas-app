/**
 * Base de datos mock - Index
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 * 
 * Este archivo centraliza todos los datos mock de la aplicación
 * para ser utilizados de manera uniforme en toda la plataforma.
 */

// Tipos
export * from './types';

// Notificaciones
export {
  notificacionesHallazgos,
  notificacionesDenuncias,
  notificacionesReclamos,
  notificacionesCargos,
  getNotificacionesNoLeidas,
  getConteoNotificaciones,
  getTodasLasNotificaciones,
} from './notificaciones';

// Hallazgos
export {
  hallazgos,
  getHallazgoPorNumero,
  getHallazgoPorId,
  getHallazgosPorEstado,
  getHallazgosPorTipo,
  getHallazgosVencidos,
  getHallazgosPorVencer,
  getHallazgosGestionables,
  getConteoHallazgos,
  generarNumeroDenuncia,
  prepararDatosFormularioDenuncia,
} from './hallazgos';

// Denuncias
export {
  denuncias,
  getDenunciaPorNumero,
  getDenunciasPorEstado,
  getDenunciasPorTipo,
  getDenunciasVencidas,
  getDenunciasPorVencer,
  getDenunciasPorHallazgo,
  getConteoDenuncias,
} from './denuncias';

// Cargos
export {
  cargos,
  getCargoPorNumero,
  getCargosPorEstado,
  getCargosVencidos,
  getCargosPorVencer,
  getCargosPorDenuncia,
  getConteoCargos,
  formatMonto,
} from './cargos';

// Giros
export {
  giros,
  getGiroPorNumero,
  getGirosPorEstado,
  getGirosPorTipo,
  getGirosVencidos,
  getGirosPorCargo,
  getConteoGiros,
} from './giros';

// Reclamos
export {
  reclamos,
  getReclamoPorNumero,
  getReclamosPorEstado,
  getReclamosPorTipo,
  getReclamosPorDenuncia,
  getConteoReclamos,
} from './reclamos';

// Alertas
export {
  alertas,
  getAlertasPorTipo,
  getAlertasVencidas,
  getAlertasCriticas,
  getConteoAlertas,
} from './alertas';

// Catálogos
export {
  aduanas,
  usuarios,
  tiposInfraccion,
  getAduanaPorCodigo,
  getAduanaPorNombre,
  getUsuarioPorRut,
  getUsuariosPorAduana,
  getUsuariosPorRol,
  getNombresAduanas,
  getNombresTiposInfraccion,
} from './catalogos';

// KPIs
export {
  getKPIDashboard,
  getKPIDashboard as getKPIs, // Alias para compatibilidad
  getEstadisticasGenerales,
} from './kpis';

// Seguimiento de Mercancía
export {
  movimientosActivos,
  timelineMovimientoEjemplo,
  alertasTrazabilidad,
  estadisticasSeguimiento,
  getMovimientoPorId,
  getMovimientoPorContenedor,
  getMovimientosPorEstado,
  getMovimientosConAlerta,
} from './seguimientoMercancia';

// ============================================
// USUARIO ACTUAL (para prototipo)
// ============================================

export const usuarioActual = {
  id: "usr-001",
  initials: "JR",
  name: "Juan Rodríguez",
  email: "jrodriguez@aduana.cl",
  role: "Funcionario Fiscalizador",
  aduana: "Valparaíso",
};

