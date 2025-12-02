/**
 * Rutas de la aplicación DECARE
 * Sistema de Denuncias, Cargos y Reclamos - Servicio Nacional de Aduanas de Chile
 */

enum ERoutePaths {
  // Autenticación
  LOGIN = '/login',
  
  // Dashboard Principal
  DASHBOARD = '/dashboard',
  
  // Módulo de Hallazgos
  HALLAZGOS = '/hallazgos',
  HALLAZGOS_GESTIONAR = '/hallazgos/:hallazgoId/gestionar', // Convertir hallazgo a denuncia
  
  // Módulo de Denuncias
  DENUNCIAS = '/denuncias',
  DENUNCIAS_NUEVA = '/denuncias/nueva',
  DENUNCIAS_DESDE_HALLAZGO = '/denuncias/desde-hallazgo/:hallazgoId', // Crear denuncia desde hallazgo
  DENUNCIAS_DETALLE = '/denuncias/:id',
  DENUNCIAS_EDITAR = '/denuncias/:id/editar',
  
  // Expediente Digital
  EXPEDIENTE = '/expediente/:id',
  
  // Módulo de Cargos
  CARGOS = '/cargos',
  CARGOS_NUEVO = '/cargos/nuevo',
  CARGOS_DETALLE = '/cargos/:id',
  CARGOS_EDITAR = '/cargos/:id/editar',
  
  // Módulo de Giros
  GIROS = '/giros',
  GIROS_NUEVO = '/giros/nuevo',
  GIROS_DETALLE = '/giros/:id',
  
  // Módulo de Reclamos
  RECLAMOS = '/reclamos',
  RECLAMOS_NUEVO = '/reclamos/nuevo',
  RECLAMOS_DETALLE = '/reclamos/:id',
  RECLAMOS_EDITAR = '/reclamos/:id/editar',
  
  // Notificaciones
  NOTIFICACIONES = '/notificaciones',
  NOTIFICACIONES_DETALLE = '/notificaciones/:id',
  
  // Seguimiento de Mercancía
  SEGUIMIENTO_MERCANCIA = '/seguimiento-mercancia',
  SEGUIMIENTO_MERCANCIA_DETALLE = '/seguimiento-mercancia/:id',
  
  // Movimientos Terrestres
  MOVIMIENTOS_TERRESTRES = '/movimientos-terrestres',
  
  // Reportes y Auditoría
  REPORTES = '/reportes',
  INDICADORES = '/indicadores',
  AUDITORIA = '/auditoria',
  
  // Mantenedores (Administración)
  MANTENEDORES = '/mantenedores',
  MANTENEDORES_ADUANAS = '/mantenedores/aduanas',
  MANTENEDORES_SECCIONES = '/mantenedores/secciones',
  MANTENEDORES_FUNDAMENTOS = '/mantenedores/fundamentos',
  MANTENEDORES_NORMAS = '/mantenedores/normas',
  MANTENEDORES_USUARIOS = '/mantenedores/usuarios',
  
  // Configuración
  CONFIGURACION = '/configuracion',
  PERFIL = '/perfil',
}

export { ERoutePaths };
