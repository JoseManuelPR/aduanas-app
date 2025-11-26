/**
 * Tipos de datos para la base de datos mock
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

// ============================================
// NOTIFICACIONES
// ============================================

export type TipoHallazgo = 'Infraccional' | 'Penal';
export type TipoDenuncia = 'Infraccional' | 'Penal';
export type TipoReclamo = 'TTA' | 'Reposición Administrativa';
export type EstadoNotificacion = 'Nuevo' | 'Pendiente' | 'Vencido' | 'Actualizado' | 'En gestión';

export interface NotificacionHallazgo {
  id: string;
  numeroNotificacion: string;
  descripcion: string;
  numeroHallazgo: string; // Formato PFI-XXX
  fechaGeneracion: string; // Formato dd-mm-aaaa
  tipoHallazgo: TipoHallazgo;
  leido: boolean;
  estado: EstadoNotificacion;
}

export interface NotificacionDenuncia {
  id: string;
  numeroNotificacion: string;
  descripcion: string;
  numeroDenuncia: string;
  tipoDenuncia: TipoDenuncia;
  fechaGeneracion: string;
  leido: boolean;
  estado: EstadoNotificacion;
}

export interface NotificacionReclamo {
  id: string;
  numeroNotificacion: string;
  descripcion: string;
  numeroReclamo: string;
  tipoReclamo: TipoReclamo;
  fechaGeneracion: string;
  leido: boolean;
  estado: EstadoNotificacion;
}

export interface NotificacionCargo {
  id: string;
  numeroNotificacion: string;
  descripcion: string;
  numeroCargo: string;
  fechaGeneracion: string;
  leido: boolean;
  estado: EstadoNotificacion;
}

// ============================================
// HALLAZGOS (PFI)
// ============================================

export type EstadoHallazgo = 
  | 'Ingresado' 
  | 'En Análisis' 
  | 'Notificar Denuncia' 
  | 'Derivado' 
  | 'Cerrado';

export interface Hallazgo {
  id: string;
  numeroHallazgo: string; // PFI-XXX
  fechaIngreso: string;
  estado: EstadoHallazgo;
  tipoHallazgo: TipoHallazgo;
  aduana: string;
  rutInvolucrado: string;
  nombreInvolucrado: string;
  descripcion: string;
  montoEstimado: string;
  diasVencimiento: number;
  funcionarioAsignado: string;
}

// ============================================
// DENUNCIAS
// ============================================

export type EstadoDenuncia = 
  | 'Ingresada' 
  | 'En Revisión' 
  | 'Formulada' 
  | 'Notificada' 
  | 'En Proceso' 
  | 'Cerrada';

export interface Denuncia {
  id: string;
  numeroDenuncia: string;
  fechaIngreso: string;
  estado: EstadoDenuncia;
  tipoDenuncia: TipoDenuncia;
  aduana: string;
  rutDeudor: string;
  nombreDeudor: string;
  tipoInfraccion: string;
  diasVencimiento: number;
  montoEstimado: string;
  hallazgoOrigen?: string; // PFI-XXX si viene de un hallazgo
}

// ============================================
// CARGOS
// ============================================

export type EstadoCargo = 
  | 'Pendiente Aprobación' 
  | 'En Revisión' 
  | 'Aprobado' 
  | 'Rechazado' 
  | 'Notificado';

export interface Cargo {
  id: string;
  numeroCargo: string;
  fechaIngreso: string;
  estado: EstadoCargo;
  aduana: string;
  rutDeudor: string;
  nombreDeudor: string;
  montoTotal: string;
  diasVencimiento: number;
  denunciaAsociada?: string;
}

// ============================================
// GIROS
// ============================================

export type TipoGiro = 'F09' | 'F16' | 'F17';
export type EstadoGiro = 'Emitido' | 'Pagado' | 'Vencido' | 'Anulado';

export interface Giro {
  id: string;
  numeroGiro: string;
  tipoGiro: TipoGiro;
  fechaEmision: string;
  fechaVencimiento: string;
  estado: EstadoGiro;
  montoTotal: string;
  emitidoA: string;
  rutDeudor: string;
  cargoAsociado?: string;
}

// ============================================
// RECLAMOS
// ============================================

export type TipoReclamoCompleto = 'Art. 117' | 'Reposición' | 'TTA';
export type EstadoReclamo = 
  | 'Ingresado' 
  | 'En Análisis' 
  | 'Pendiente Resolución' 
  | 'Derivado a Tribunal' 
  | 'Resuelto';

export interface Reclamo {
  id: string;
  numeroReclamo: string;
  tipoReclamo: TipoReclamoCompleto;
  fechaIngreso: string;
  estado: EstadoReclamo;
  denunciaAsociada: string;
  reclamante: string;
  rutReclamante: string;
  diasRespuesta: number;
  descripcion: string;
}

// ============================================
// USUARIOS
// ============================================

export type RolUsuario = 
  | 'Funcionario Fiscalizador' 
  | 'Jefe de Sección' 
  | 'Administrador' 
  | 'Auditor';

export interface Usuario {
  id: string;
  rut: string;
  nombre: string;
  email: string;
  rol: RolUsuario;
  aduana: string;
  activo: boolean;
}

// ============================================
// ADUANAS
// ============================================

export interface Aduana {
  id: string;
  codigo: string;
  nombre: string;
  region: string;
}

// ============================================
// KPIs Y ESTADÍSTICAS
// ============================================

export interface KPIDashboard {
  denuncias: {
    total: number;
    pendientes: number;
    enProceso: number;
    resueltas: number;
    porVencer: number;
    vencidas: number;
  };
  cargos: {
    total: number;
    pendientes: number;
    aprobados: number;
    rechazados: number;
    montoTotal: string;
  };
  giros: {
    total: number;
    emitidos: number;
    pagados: number;
    vencidos: number;
    montoRecaudado: string;
  };
  reclamos: {
    total: number;
    enAnalisis: number;
    resueltos: number;
    derivadosTTA: number;
    tiempoPromedioRespuesta: number;
  };
  notificaciones: {
    enviadas: number;
    leidas: number;
    pendientes: number;
    conError: number;
    tasaExito: number;
  };
}

// ============================================
// ALERTAS
// ============================================

export type TipoAlerta = 'vencido' | 'critico' | 'advertencia' | 'informativo';

export interface Alerta {
  id: string;
  tipo: TipoAlerta;
  titulo: string;
  descripcion: string;
  expediente: string;
  fechaVencimiento?: string;
  diasVencidos?: number;
  diasRestantes?: number;
  cantidad?: number;
}

// ============================================
// SEGUIMIENTO DE MERCANCÍA
// ============================================

export type EstadoMovimiento = 'En Tránsito' | 'En Puerto' | 'Despacho Terrestre' | 'Entregado' | 'Con Alerta';
export type StatusTimeline = 'completed' | 'current' | 'pending';

export interface MovimientoMercancia {
  id: string;
  contenedor: string;
  manifiesto: string;
  origen: string;
  destino: string;
  estado: string;
  fechaEstimada: string;
  ubicacionActual: string;
  porcentaje: number;
}

export interface TimelineItem {
  id: string;
  title: string;
  date: string;
  status: StatusTimeline;
  description: string;
  time?: string;
  user?: string;
}

export interface AlertaTrazabilidad {
  id: string;
  tipo: 'critico' | 'advertencia' | 'informativo';
  contenedor: string;
  titulo: string;
  descripcion: string;
}

