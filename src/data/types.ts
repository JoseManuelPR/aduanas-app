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
  | 'Cerrado'
  | 'Convertido a Denuncia';

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
  // Datos extendidos para formulario de denuncia (pre-rellenado)
  datosDenuncia?: HallazgoDenunciaData;
}

// Datos adicionales del hallazgo necesarios para crear una denuncia
export interface HallazgoDenunciaData {
  // Datos Generales
  seccion: string;
  tipoInfraccion: string;
  normaInfringida: string;
  fundamentoLegal: string;
  mercanciaInvolucrada: string;
  
  // Datos del Involucrado/Denunciado
  direccionInvolucrado: string;
  emailInvolucrado: string;
  telefonoInvolucrado: string;
  representanteLegal?: string;
  
  // Datos del Agente de Aduanas (si aplica)
  codigoAgente?: string;
  nombreAgente?: string;
  
  // Documentos asociados
  documentoAduanero?: string;
  tipoDocumento?: string;
  documentosAdjuntos: DocumentoAdjunto[];
}

export interface DocumentoAdjunto {
  id: string;
  nombre: string;
  tipo: 'pdf' | 'doc' | 'xls' | 'jpg' | 'png';
  tamanio: string;
  fechaSubida: string;
}

// ============================================
// DENUNCIAS - MODELO COMPLETO
// ============================================

export type EstadoDenuncia = 
  | 'Borrador'
  | 'Ingresada' 
  | 'En Revisión' 
  | 'Formulada' 
  | 'Notificada' 
  | 'En Proceso'
  | 'Observada'
  | 'Allanada'
  | 'Reclamada'
  | 'Cerrada'
  | 'Archivada';

// Tipo de involucrado en la denuncia
export type TipoInvolucrado = 
  | 'Infractor Principal'
  | 'Infractor Secundario'
  | 'Responsable Solidario'
  | 'Agente de Aduanas'
  | 'Importador'
  | 'Exportador'
  | 'Transportista';

// Involucrado en una denuncia (DENUNCIA_INFRACTOR)
export interface DenunciaInvolucrado {
  id: string;
  tipoInvolucrado: TipoInvolucrado;
  rut: string;
  nombre: string;
  direccion?: string;
  email?: string;
  telefono?: string;
  representanteLegal?: string;
  orden: number;
  esPrincipal: boolean;
}

// Documento aduanero asociado (DENUNCIA_DOC_ADUANERO)
export interface DenunciaDocumentoAduanero {
  id: string;
  tipoDocumento: string;
  numeroDocumento: string;
  numeroAceptacion?: string;
  fecha: string;
  aduana: string;
  descripcion?: string;
}

// Modelo completo de Denuncia
export interface Denuncia {
  id: string;
  
  // Identificadores
  numeroDenuncia: string;           // NRO_DENUNCIA (autogenerado)
  numeroInterno?: string;           // NRO_INTERNO (devuelve a PFI)
  
  // Fechas
  fechaIngreso: string;             // Fecha de registro
  fechaEmision?: string;            // FECHA_EMISION
  fechaOcurrencia?: string;         // FECHA_OCURRENCIA
  
  // Estado y tipo
  estado: EstadoDenuncia;
  tipoDenuncia: TipoDenuncia;
  
  // Ubicación
  aduana: string;                   // COD_ADUANA
  aduanaEmision?: string;           // COD_ADUANA_EMISION
  seccion?: string;                 // COD_SECCION
  
  // Datos del deudor/infractor principal (legacy, para compatibilidad)
  rutDeudor: string;
  nombreDeudor: string;
  
  // Involucrados (nuevo modelo completo)
  involucrados?: DenunciaInvolucrado[];
  
  // Tipificación
  tipoInfraccion: string;
  codigoArticulo?: string;          // COD_ARTICULO
  etapaFormulacion?: string;        // COD_ETAPA_FORMULACION
  
  // Montos - Infraccional
  montoEstimado: string;
  multa?: number;                   // MULTA
  multaMaxima?: number;             // MULTA_MAXIMA (readonly)
  multaAllanamiento?: number;       // MULTA_ALLANAMIENTO
  montoDerechos?: number;           // MONTO_DERECHOS (calculado)
  montoDerechosCancelados?: number; // MONTO_DERECHOS_CANCELADOS
  montoRetencion?: number;          // MONTO_RETENCION
  montoNoDeclarado?: number;        // MONTO_NO_DECLARADO
  codigoMoneda?: string;            // CODIGO_MONEDA
  
  // Flags
  autodenuncio?: boolean;           // AUTODENUNCIO
  retencion?: boolean;              // RETENCION
  mercanciaAfecta?: boolean;        // MERCANCIA_AFECTA
  observada?: boolean;              // OBSERVADA
  
  // Tipificación Penal
  codigoDenunciante?: string;       // COD_DENUNCIANTE
  numeroOficio?: string;            // NRO_OFICIO
  fechaOficio?: string;             // FECHA_OFICIO
  
  // Descripción
  descripcionHechos?: string;       // HTML_DESCRIPCION
  fundamentoLegal?: string;
  normaInfringida?: string;
  
  // Mercancía
  mercanciaId?: string;             // MERCANCIA_ID
  mercanciaDescripcion?: string;
  
  // Documentos Aduaneros
  documentosAduaneros?: DenunciaDocumentoAduanero[];
  
  // Documentos adjuntos (expediente)
  documentosAdjuntos?: DocumentoAdjunto[];
  
  // Workflow
  instanciaJbpm?: string;           // INSTANCIA_JBPM
  loginFuncionario?: string;        // LOGIN_FUNCIONARIO
  loginFiscalizador?: string;       // LOGIN_FISCALIZADOR
  
  // Relaciones
  hallazgoOrigen?: string;          // PFI-XXX si viene de un hallazgo
  cargosAsociados?: string[];       // IDs de cargos
  girosAsociados?: string[];        // IDs de giros
  reclamosAsociados?: string[];     // IDs de reclamos
  
  // Auditoría
  fechaCreacion?: string;
  fechaModificacion?: string;
  usuarioCreacion?: string;
  usuarioModificacion?: string;
  
  // Control de plazos
  diasVencimiento: number;
}

// ============================================
// ARTÍCULOS (para tipificación)
// ============================================

export interface Articulo {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  tipoArticulo: 'Infraccional' | 'Penal';  // 1 = Infraccional, 2 = Penal
  multaMinima?: number;
  multaMaxima?: number;
  permiteAllanamiento: boolean;
  porcentajeAllanamiento?: number;  // % de reducción por allanamiento
  normaLegal: string;
  vigente: boolean;
}

// ============================================
// CATÁLOGOS
// ============================================

export interface Aduana {
  id: string;
  codigo: string;
  nombre: string;
  region: string;
}

export interface Seccion {
  id: string;
  codigo: string;
  nombre: string;
  aduanaCodigo: string;
}

export interface TipoDocumentoAduanero {
  id: string;
  codigo: string;
  nombre: string;
  sigla: string;
}

export interface EtapaFormulacion {
  id: string;
  codigo: string;
  nombre: string;
  orden: number;
}

export interface Denunciante {
  id: string;
  codigo: string;
  nombre: string;
  tipo: string;
}

export interface Moneda {
  id: string;
  codigo: string;
  nombre: string;
  simbolo: string;
}

// ============================================
// CARGOS - MODELO COMPLETO
// ============================================

export type EstadoCargo = 
  | 'Borrador'
  | 'Observado'
  | 'Pendiente Aprobación' 
  | 'En Revisión' 
  | 'Emitido'
  | 'Aprobado' 
  | 'Rechazado' 
  | 'Notificado'
  | 'Cerrado'
  | 'Anulado';

export type OrigenCargo = 'DENUNCIA' | 'FISCALIZACION' | 'OTRO';

// Tipo de cuenta de cargo (CARGO_CUENTA)
export interface CargoCuenta {
  id: string;
  codigoCuenta: string;           // CODIGO_CUENTA
  nombreCuenta: string;           // NOMBRE_CUENTA (readonly)
  monto: number;                  // MONTO (obligatorio)
  moneda: string;                 // MONEDA
  descripcion?: string;
  orden: number;
}

// Operación de cargo (CARGO_OPERACION)
export interface CargoOperacion {
  id: string;
  tipoOperacion: string;          // TIPO_OPERACION
  descripcion: string;            // DESCRIPCION
  monto: number;                  // MONTO
  fecha: string;
  moneda?: string;
}

// Documento aduanero asociado al cargo (CARGO_DOC_ADUANERO)
export interface CargoDocumentoAduanero {
  id: string;
  tipoDocumento: string;
  numeroDocumento: string;
  numeroAceptacion?: string;
  fecha: string;
  aduana: string;
  descripcion?: string;
  montoRelacionado?: number;
}

export interface CargoInfractor {
  id: string;
  idInvolucrado: string;          // ID_INVOLUCRADO (selector)
  rut: string;
  nombre: string;
  tipoInfractor: TipoInvolucrado; // TIPO_INFRACTOR (selector)
  direccion?: string;
  email?: string;
  telefono?: string;
  montoAsignado?: number;
  porcentajeResponsabilidad?: number;
  esPrincipal: boolean;
}

export interface Cargo {
  id: string;
  
  // Identificadores
  numeroCargo: string;            // NRO_CARGO (autogenerado)
  numeroInterno?: string;         // NRO_INTERNO
  
  // Fechas
  fechaIngreso: string;           // FECHA_INGRESO
  fechaOcurrencia?: string;       // FECHA_OCURRENCIA
  fechaEmision?: string;          // FECHA_EMISION (obligatorio)
  fechaNotificacion?: string;
  
  // Estado y origen
  estado: EstadoCargo;
  origen: OrigenCargo;            // ORIGEN (selector, readonly si viene de Denuncia)
  
  // Ubicación
  aduana: string;                 // COD_ADUANA
  codigoAduana?: string;          // COD_ADUANA
  codigoAduanaDestino?: string;   // COD_ADUANA_DESTINO
  codigoSeccion?: string;         // COD_SECCION
  
  // Datos del deudor principal (legacy)
  rutDeudor: string;
  nombreDeudor: string;
  
  // Tipificación y fundamentación
  norma?: string;                 // NORMA (número, catálogo)
  fundamento?: string;            // FUNDAMENTO (catálogo)
  descripcionHechos?: string;     // DESCRIPCION_HECHOS (CLOB, editor texto)
  
  // Montos (calculados)
  montoTotal: string;             // TOTAL (suma de cuentas)
  montoDerechos?: number;
  montoMulta?: number;
  montoIntereses?: number;
  montoReajuste?: number;
  
  // Cuentas de cargo (CARGO_CUENTA)
  cuentas?: CargoCuenta[];
  
  // Operaciones (CARGO_OPERACION)
  operaciones?: CargoOperacion[];
  
  // Infractores (CARGO_INFRACTOR)
  infractores?: CargoInfractor[];
  
  // Documentos aduaneros (CARGO_DOC_ADUANERO)
  documentosAduaneros?: CargoDocumentoAduanero[];
  
  // Relaciones
  denunciaAsociada?: string;      // ID de la denuncia
  denunciaNumero?: string;        // Número de la denuncia
  mercanciaId?: string;           // MERCANCIA_ID (readonly, link)
  girosGenerados?: string[];      // IDs de giros generados
  reclamosAsociados?: string[];   // IDs de reclamos
  expedienteDigitalId?: string;
  
  // Control de plazos
  diasVencimiento: number;
  fechaVencimiento?: string;
  
  // Observaciones y notas
  observaciones?: string;
  
  // Workflow
  instanciaJbpm?: string;
  loginFuncionario?: string;
  
  // Auditoría
  fechaCreacion?: string;
  fechaModificacion?: string;
  usuarioCreacion?: string;
  usuarioModificacion?: string;
}

// Catálogo de cuentas de cargo
export interface CuentaCatalogo {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  tipoCuenta: 'Derechos' | 'Multa' | 'Intereses' | 'Reajuste' | 'Otro';
  activo: boolean;
}

// Catálogo de normas
export interface NormaCatalogo {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  tipoNorma: string;
  vigente: boolean;
}

// Catálogo de fundamentos
export interface FundamentoCatalogo {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  normaRelacionada?: string;
  vigente: boolean;
}

// ============================================
// GIROS
// ============================================

export type TipoGiro = 'F09' | 'F16' | 'F17';
export type EstadoGiro = 'Emitido' | 'Pagado' | 'Vencido' | 'Anulado' | 'Parcialmente Pagado';

export interface Giro {
  id: string;
  numeroGiro: string;
  tipoGiro: TipoGiro;
  fechaEmision: string;
  fechaVencimiento: string;
  estado: EstadoGiro;
  montoTotal: string;
  montoPagado?: number;
  saldoPendiente?: number;
  emitidoA: string;
  rutDeudor: string;
  cargoAsociado?: string;
  denunciaAsociada?: string;
  fechaPago?: string;
  numeroComprobante?: string;
}

// ============================================
// RECLAMOS
// ============================================

export type TipoReclamoCompleto = 'Art. 117' | 'Reposición' | 'TTA';
export type OrigenReclamo = 'DENUNCIA' | 'CARGO' | 'GIRO' | 'OTRO';
export type EstadoReclamo = 
  | 'Ingresado' 
  | 'En Análisis' 
  | 'Pendiente Resolución' 
  | 'Derivado a Tribunal' 
  | 'Resuelto'
  | 'Rechazado'
  | 'Acogido'
  | 'Acogido Parcialmente';

export interface Reclamo {
  id: string;
  numeroReclamo: string;
  tipoReclamo: TipoReclamoCompleto;
  fechaIngreso: string;
  fechaPresentacion?: string;
  estado: EstadoReclamo;
  origenReclamo?: OrigenReclamo;
  entidadOrigenId?: string;        // ID de la denuncia/cargo/giro
  numeroEntidadOrigen?: string;    // Número de la entidad origen
  denunciaAsociada: string;
  reclamante: string;
  rutReclamante: string;
  diasRespuesta: number;
  descripcion: string;
  fundamentoReclamo?: string;
  resolucion?: string;
  fechaResolucion?: string;
}

// ============================================
// MERCANCÍA
// ============================================

export type EstadoMercancia = 
  | 'En Tránsito'
  | 'En Puerto'
  | 'En Depósito'
  | 'Retenida'
  | 'Liberada'
  | 'Decomisada'
  | 'Subastada';

export interface Mercancia {
  id: string;
  descripcion: string;
  partida: string;
  subpartida?: string;
  cantidad: number;
  unidadMedida: string;
  valorFOB?: number;
  valorCIF?: number;
  pesoKg?: number;
  paisOrigen?: string;
  estado: EstadoMercancia;
  ubicacion?: string;
  contenedor?: string;
  manifiesto?: string;
}

// ============================================
// USUARIOS
// ============================================

export type RolUsuario = 
  | 'Funcionario Fiscalizador' 
  | 'Jefe de Sección' 
  | 'Administrador' 
  | 'Auditor'
  | 'Abogado'
  | 'Usuario Control Interno';

export interface Usuario {
  id: string;
  rut: string;
  nombre: string;
  email: string;
  rol: RolUsuario;
  aduana: string;
  seccion?: string;
  activo: boolean;
  permisos?: string[];
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

// ============================================
// EXPEDIENTE DIGITAL
// ============================================

export type TipoExpediente = 'DENUNCIA' | 'CARGO' | 'RECLAMO' | 'GIRO';

export interface ExpedienteDigital {
  id: string;
  tipo: TipoExpediente;
  numeroExpediente: string;
  entidadId: string;
  fechaCreacion: string;
  fechaModificacion: string;
  archivos: ArchivoExpediente[];
  timeline: TimelineItem[];
}

export interface ArchivoExpediente {
  id: string;
  nombre: string;
  tipo: string;
  tamanio: string;
  fechaSubida: string;
  usuarioSubida: string;
  estado: 'Vigente' | 'Reemplazado' | 'Anulado';
  categoria: string;
}

// ============================================
// RAP (Resolución de Aplicación de Penas)
// ============================================

export interface RAP {
  id: string;
  numero: string;
  fecha: string;
  denunciaId: string;
  tipo: 'Multa' | 'Comiso' | 'Ambas';
  montoMulta?: number;
  descripcionComiso?: string;
  estado: 'Emitida' | 'Notificada' | 'Firme' | 'Reclamada';
}

// ============================================
// PERMISOS POR ESTADO (para UI)
// ============================================

export interface PermisosEstado {
  puedeEditar: boolean;
  puedeEliminar: boolean;
  puedeFormalizar: boolean;
  puedeGenerarCargo: boolean;
  puedeCrearReclamo: boolean;
  puedeNotificar: boolean;
  puedeCerrar: boolean;
  camposEditables: string[];
}
