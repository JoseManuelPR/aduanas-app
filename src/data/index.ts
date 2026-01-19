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
  getDenunciaPorId,
  getDenunciasPorEstado,
  getDenunciasPorTipo,
  getDenunciasVencidas,
  getDenunciasPorVencer,
  getDenunciasPorHallazgo,
  getDenunciasPorAduana,
  getDenunciasConCargos,
  getDenunciasConReclamos,
  getDenunciasObservadas,
  getConteoDenuncias,
  validarDenuncia,
  generarNumeroInterno,
  getPermisosPorEstado,
} from './denuncias';

// Cargos
export {
  cargos,
  cuentasCatalogo,
  normasCatalogo,
  fundamentosCatalogo,
  getCargoPorId,
  getCargoPorNumero,
  getCargosPorEstado,
  getCargosPorOrigen,
  getCargosVencidos,
  getCargosPorVencer,
  getCargosPorDenuncia,
  getCargosPorDenunciaNumero,
  getCargosPorAduana,
  getCargosConGiros,
  calcularTotalCargo,
  puedeGenerarCargo,
  getPermisosCargo,
  getConteoCargos,
  formatMonto,
  crearCargo,
  actualizarCargo,
  getCuentaPorCodigo,
  getNormaPorCodigo,
  getFundamentoPorCodigo,
} from './cargos';

// Giros
export {
  giros,
  getGiroPorId,
  getGiroPorNumero,
  getGirosPorEstado,
  getGirosPorTipo,
  getGirosPorOrigen,
  getGirosVencidos,
  getGirosPorVencer,
  getGirosPorCargo,
  getGirosPorCargoNumero,
  getGirosPorDenuncia,
  getGirosPorDeudor,
  getGirosPorAduana,
  calcularTotalGiro,
  calcularSaldoPendiente,
  puedeRegistrarPago,
  validarPago,
  puedeAnularGiro,
  getPermisosGiro,
  getConteoGiros,
  crearGiro,
  actualizarGiro,
  registrarPagoGiro,
  anularGiro,
} from './giros';

// Reclamos
export {
  reclamos,
  getReclamoPorId,
  getReclamoPorNumero,
  getReclamosPorEstado,
  getReclamosPorTipo,
  getReclamosPorOrigen,
  getReclamosPorDenuncia,
  getReclamosPorCargo,
  getReclamosPorGiro,
  getReclamosPorAduana,
  getReclamosPorVencer,
  puedeRegistrarAdmisibilidad,
  puedeRegistrarFallo,
  getPermisosReclamo,
  getConteoReclamos,
  crearReclamo,
  actualizarReclamo,
  registrarAdmisibilidad,
  registrarFallo,
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
  secciones,
  articulos,
  tiposDocumentoAduanero,
  etapasFormulacion,
  denunciantes,
  monedas,
  tiposInfraccion,
  estadosDenuncia,
  tiposInvolucrado,
  getAduanaPorCodigo,
  getAduanaPorNombre,
  getSeccionesPorAduana,
  getArticuloPorCodigo,
  getArticulosPorTipo,
  getArticulosInfraccionales,
  getArticulosPenales,
} from './catalogos';

// KPIs
export {
  getKPIDashboard,
  getKPIDashboard as getKPIs, // Alias para compatibilidad
  getEstadisticasGenerales,
} from './kpis';

// Seguimiento de Mercancía (movimientos)
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

// Mercancías
export {
  mercancias,
  getMercanciaPorId,
  getMercanciaPorCodigo,
  getMercanciasPorEstado,
  getMercanciasPorAduana,
  getMercanciasPorDenuncia,
  getMercanciasPorCargo,
  getMercanciasConAlerta,
  getMercanciasPendientesDisposicion,
  getPermisosMercancia,
  puedeRegistrarEvento,
  getConteoMercancias,
  registrarEventoMercancia,
  crearMercancia,
} from './mercancias';

// Involucrados
export {
  involucrados,
  tiposIdentificacion,
  tiposPersona,
  tiposDireccion,
  regiones,
  getInvolucradoPorId,
  getInvolucradoPorRut,
  getInvolucradosPorTipoPersona,
  getInvolucradosPorEstado,
  buscarInvolucrados,
  getConteoInvolucrados,
  getPermisosInvolucrado,
  getHistorialCasos,
  validarRut,
  formatRut,
  crearInvolucrado,
  actualizarInvolucrado,
  agregarDireccion,
  eliminarDireccion,
  inactivarInvolucrado,
  activarInvolucrado,
} from './involucrados';

// Documentos Aduaneros
export {
  documentosAduaneros,
  getDocumentosAduanerosPorDenuncia,
  getDocumentosAduanerosPorCargo,
  getDocumentosAduanerosPorReclamo,
  getDocumentosAduanerosPorGiro,
  getDocumentoAduaneroPorId,
} from './documentosAduaneros';

// Expedientes Digitales
export {
  expedientesDigitales,
  documentosObligatorios,
  getExpedientePorEntidad,
  getExpedientePorId,
  getDocumentosObligatoriosPorTipo,
  calcularCompletitud,
  getPermisosArchivo,
  crearExpedienteParaEntidad,
  getOrCrearExpedientePorEntidad,
  agregarArchivosAExpediente,
  eliminarArchivoDeExpediente,
} from './expedientes';

// Hallazgos Externos (Sistema PFI)
export {
  // Tipos
  type PayloadDenunciaExterna,
  type DenunciaExterna,
  type IdentificacionExterna,
  type InfraccionExterna,
  type MultasExterna,
  type DenunciadosExterna,
  type InfractorExterno,
  type DocumentoAduaneroExterno,
  type DescripcionHechosExterna,
  type HallazgoProcesado,
  type InfractorProcesado,
  type DocumentoAduaneroProcesado,
  // Funciones de validación y transformación
  validarPayloadExterno,
  transformarPayloadAHallazgo,
  recibirHallazgoExterno,
  generarNumeroHallazgo,
  convertirFechaExterna,
  determinarTipoHallazgo,
  determinarTipoPersona,
  construirNombreCompleto,
  formatearMontoChileno,
  calcularDiasVencimiento,
  // Datos y funciones de acceso
  hallazgosExternos,
  getHallazgosExternos,
  getHallazgoExternoPorTransactionId,
  getHallazgoExternoPorNumero,
  getConteoHallazgosExternos,
  // Ejemplo de payload
  ejemploPayloadExterno,
} from './hallazgosExternos';

// Jefes Revisores (CU-005: Asignación del jefe revisor)
export {
  jefesRevisores,
  historialAsignaciones,
  getJefesRevisoresActivos,
  getJefesRevisoresPorAduana,
  getJefesRevisoresDisponibles,
  getJefesRevisoresDisponiblesPorAduana,
  getJefeRevisorPorId,
  verificarDisponibilidad,
  getColorDisponibilidad,
  calcularCargaTrabajo,
  getColorCargaTrabajo,
  registrarAsignacion,
  getHistorialAsignacionesPorDenuncia,
  getEstadisticasJefesRevisores,
  type JefeRevisor,
  type AsignacionJefeRevisor,
  type DisponibilidadJefeRevisor,
} from './jefesRevisores';

// Audiencias
export {
  audiencias,
  salasAudiencia,
  getAudienciaPorId,
  getAudienciaPorNumero,
  getAudienciasPorDenuncia,
  getAudienciasPorNumeroDenuncia,
  getAudienciasPorEstado,
  getAudienciasPorResultado,
  getAudienciasProgramadas,
  getAudienciasHoy,
  getAudienciasPorJuez,
  getConteoAudiencias,
  generarNumeroAudiencia,
  generarNumeroActa,
  calcularMultaAtenuada,
  getPermisosAudiencia,
  crearAudiencia,
  actualizarAudiencia,
  iniciarAudiencia,
  finalizarAudiencia,
  generarActaAudiencia,
  agregarDeclaracion,
  agregarAntecedente,
  getSalaPorCodigo,
  getSalasPorAduana,
  // Emitir Acta de Audiencia y Resultado
  actasAudienciaEmitidas,
  emitirActaAudiencia,
  getActaPorAudiencia,
  getActasPorDenuncia,
  puedeEmitirActa,
  getAudienciasPendientesActa,
  getConteoActasEmitidas,
  type Audiencia,
  type DeclaracionAudiencia,
  type DocumentoAudiencia,
  type TipoResultadoAudiencia,
  type EstadoAudiencia,
  type CalculoMultaAtenuada,
  type PermisosAudiencia,
  type ResultadoActaAudiencia,
  type ActaAudienciaEmitida,
} from './audiencias';

// Catálogos Externos (Mapeo con Sistema PFI)
export {
  // Aduanas
  type AduanaExterna,
  aduanasExternas,
  getAduanaPorCodigoExterno,
  getAduanaPorCodigoInterno,
  getNombreAduanaPorCodigoExterno,
  esCodigoAduanaValido,
  // Secciones
  type SeccionExterna,
  seccionesExternas,
  getSeccionPorCodigoExterno,
  getNombreSeccionPorCodigoExterno,
  // Tipos de Identificador
  type TipoIdentificadorExterno,
  tiposIdentificadorExternos,
  getTipoIdentificadorPorCodigo,
  getTipoIdentificadorPorSigla,
  getNombreTipoIdentificadorPorCodigo,
  // Tipos de Documento Aduanero
  type TipoDocumentoAduaneroExterno,
  tiposDocumentoAduaneroExternos,
  getTipoDocumentoAduaneroPorCodigo,
  getTipoDocumentoAduaneroPorCodigoInterno,
  // Artículos
  type ArticuloExterno,
  articulosExternos,
  getArticuloPorCodigoExterno,
  esCodigoArticuloValido,
  // Etapas de Formulación
  type EtapaFormulacionExterna,
  etapasFormulacionExternas,
  getEtapaPorCodigoExterno,
  getEtapaPorCodigoInterno,
  // Tipos de Infracción
  type TipoInfraccionExterna,
  tiposInfraccionExternos,
  getTipoInfraccionPorCodigo,
  // Tipos de Persona
  type TipoPersonaExterna,
  tiposPersonaExternos,
  getTipoPersonaPorCodigo,
  // Comunas
  type ComunaExterna,
  comunasExternas,
  getComunaPorCodigo,
} from './catalogosExternos';

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
  login: "jrodriguez",
};

// ============================================
// FUNCIONES DE COMPATIBILIDAD (legacy)
// ============================================

// Re-exportar usuarios si existe en catalogos antiguo
export { usuarios, getUsuarioPorRut, getUsuariosPorAduana, getUsuariosPorRol, getNombresAduanas, getNombresTiposInfraccion } from './catalogos';
