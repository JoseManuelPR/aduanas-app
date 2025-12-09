/**
 * Rutas de la aplicación DECARE
 * Sistema de Denuncias, Cargos y Reclamos - Servicio Nacional de Aduanas de Chile
 */

enum ERoutePaths {
  // Autenticación
  LOGIN = '/login',
  
  // Dashboard Principal
  DASHBOARD = '/dashboard',
  
  // Módulo de Denuncias
  DENUNCIAS = '/denuncias',
  DENUNCIAS_NUEVA = '/denuncias/nueva',
  DENUNCIAS_DETALLE = '/denuncias/:id',
  DENUNCIAS_EDITAR = '/denuncias/:id/editar',
  
  // Expediente Digital
  EXPEDIENTE = '/expediente/:id',
  EXPEDIENTE_DENUNCIA = '/denuncias/:id/expediente',
  EXPEDIENTE_CARGO = '/cargos/:id/expediente',
  EXPEDIENTE_RECLAMO = '/reclamos/:id/expediente',
  EXPEDIENTE_GIRO = '/giros/:id/expediente',

  // Documentos Aduaneros
  DOCUMENTOS_ADUANEROS = '/documentos-aduaneros',
  DOCUMENTOS_ADUANEROS_DETALLE = '/documentos-aduaneros/:id',
  
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
  
  // Gestión de Mercancías
  MERCANCIAS = '/mercancias',
  MERCANCIAS_NUEVO = '/mercancias/nuevo',
  MERCANCIAS_DETALLE = '/mercancias/:id',
  MERCANCIAS_EDITAR = '/mercancias/:id/editar',
  
  // Movimientos Terrestres
  MOVIMIENTOS_TERRESTRES = '/movimientos-terrestres',
  
  // Reportes y Auditoría
  REPORTES = '/reportes',
  INDICADORES = '/indicadores',
  AUDITORIA = '/auditoria',
  
  // Gestión de Involucrados
  INVOLUCRADOS = '/involucrados',
  INVOLUCRADOS_NUEVO = '/involucrados/nuevo',
  INVOLUCRADOS_DETALLE = '/involucrados/:id',
  INVOLUCRADOS_EDITAR = '/involucrados/:id/editar',
  
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
