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
  /**
   * Referencia opcional a un hallazgo (PFI) que origina la creación/gestión
   * de la denuncia. Se usa para precargar el formulario de "Crear Denuncia".
   */
  hallazgoId?: string;
  numeroHallazgo?: string; // Formato PFI-XXX
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

export type OrigenCargo = 'DENUNCIA' | 'TRAMITE_ADUANERO' | 'OTRO';

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
  fechaGeneracion?: string;       // FECHA_GENERACION (obligatorio)
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
// GIROS - MODELO COMPLETO
// ============================================

export type TipoGiro = 'F09' | 'F16' | 'F17';
export type EstadoGiro = 'Emitido' | 'Notificado' | 'Pagado' | 'Parcialmente Pagado' | 'Vencido' | 'Anulado';
export type OrigenGiro = 'CARGO' | 'DENUNCIA' | 'MANUAL';
export type FormaPago = 'Transferencia' | 'Depósito' | 'Efectivo' | 'Cheque' | 'Vale Vista' | 'Otro';

// Cuenta de giro (CUENTA_GIRO)
export interface GiroCuenta {
  id: string;
  codigoCuenta: string;
  nombreCuenta: string;
  monto: number;
  moneda: string;
  descripcion?: string;
  orden: number;
}

// Pago registrado en el giro
export interface GiroPago {
  id: string;
  fecha: string;
  monto: number;
  formaPago: FormaPago;
  numeroComprobante?: string;
  banco?: string;
  observaciones?: string;
  usuarioRegistro: string;
  fechaRegistro: string;
}

// Modelo completo de Giro
export interface Giro {
  id: string;
  
  // Identificadores
  numeroGiro: string;                    // NRO_GIRO (autogenerado)
  
  // Tipo y estado
  tipoGiro: TipoGiro;
  estado: EstadoGiro;
  
  // Origen
  origenGiro: OrigenGiro;                // ORIGEN_GIRO
  entidadOrigenId?: string;              // ID del cargo o denuncia
  numeroEntidadOrigen?: string;          // NRO_ENTIDAD_ORIGEN
  
  // Fechas
  fechaEmision: string;                  // FECHA_EMISION
  fechaVencimiento: string;              // FECHA_VENCIMIENTO
  fechaNotificacion?: string;
  fechaPago?: string;                    // FECHA_PAGO (último pago completo)
  
  // Plazo y cálculo de vencimiento
  plazo?: number;                        // PLAZO en días
  diaHabil?: boolean;                    // DIA_HABIL
  
  // Deudor
  emitidoA: string;                      // Nombre del deudor
  tipoIdDeudor?: TipoIdentificacion;     // Tipo de identificación (RUT, Pasaporte, etc.)
  rutDeudor: string;
  direccionDeudor?: string;
  emailDeudor?: string;
  telefonoDeudor?: string;
  
  // Ubicación
  aduana?: string;
  codigoAduana?: string;
  
  // Montos
  montoTotal: string;                    // MONTO_TOTAL (formateado)
  montoTotalNumero?: number;             // MONTO_TOTAL numérico
  montoPagado?: number;                  // MONTO_PAGADO
  saldoPendiente?: number;               // Calculado: montoTotal - montoPagado
  
  // Cuentas de giro (CUENTA_GIRO)
  cuentas?: GiroCuenta[];
  
  // Pagos registrados
  pagos?: GiroPago[];
  
  // Relaciones heredadas (para compatibilidad)
  cargoAsociado?: string;                // ID del cargo
  cargoNumero?: string;                  // Número del cargo
  denunciaAsociada?: string;             // ID de la denuncia
  denunciaNumero?: string;               // Número de la denuncia
  mercanciaId?: string;                  // Mercancía asociada (liberación condicionada)
  reclamosAsociados?: string[];          // IDs de reclamos
  
  // Comprobantes
  numeroComprobante?: string;            // Último comprobante de pago
  expedienteDigitalId?: string;
  
  // Días de vencimiento (calculado)
  diasVencimiento?: number;
  
  // Workflow y auditoría
  loginFuncionario?: string;
  fechaCreacion?: string;
  fechaModificacion?: string;
  usuarioCreacion?: string;
  usuarioModificacion?: string;
  
  // Observaciones
  observaciones?: string;
  motivoAnulacion?: string;
}

// ============================================
// RECLAMOS - MODELO COMPLETO
// ============================================

export type TipoReclamoCompleto = 'Reposición' | 'TTA';
export type OrigenReclamo = 'DENUNCIA' | 'CARGO' | 'GIRO' | 'OTRO';
export type CodigoProcesoReclamo = 'REP' | 'TTA' | 'REC';
export type TipoFalloTTA = 'Acogido' | 'Rechazado' | 'Acogido Parcialmente' | 'Inadmisible' | 'Desistido';

export type EstadoReclamo = 
  | 'Ingresado' 
  | 'En Admisibilidad'
  | 'Admitido'
  | 'En Análisis' 
  | 'En Tramitación'
  | 'Pendiente Resolución' 
  | 'Derivado a Tribunal' 
  | 'Fallado'
  | 'Resuelto'
  | 'Rechazado'
  | 'Acogido'
  | 'Acogido Parcialmente'
  | 'Cerrado';

// Datos específicos del TTA (RECLAMO_TTA)
export interface ReclamoTTA {
  id: string;
  reclamoId: string;
  rolTTA?: string;
  tribunalCompetente?: string;
  fechaPresentacionTTA?: string;
  fechaAdmisibilidad?: string;
  fechaContestacion?: string;
  fechaAudiencia?: string;
  fechaSentencia?: string;
  fechaApelacion?: string;
  fechaFalloFinal?: string;
  admisible?: boolean;
  motivoInadmisibilidad?: string;
  fallo1raInstancia?: TipoFalloTTA;
  fundamentoFallo1ra?: string;
  montoFallo1ra?: number;
  tieneApelacion?: boolean;
  quienApela?: 'Contribuyente' | 'Aduana' | 'Ambos';
  falloApelacion?: TipoFalloTTA;
  fundamentoFalloApelacion?: string;
  falloFinal?: TipoFalloTTA;
  fundamentoFalloFinal?: string;
  montoFalloFinal?: number;
  plazoProbatorio?: number;
  fechaVencimientoProbatorio?: string;
  plazoContestacion?: number;
  informeAduanas?: string;
  escritoPresentacion?: string;
  contestacionDemanda?: string;
  observaciones?: string;
}

// Modelo completo de Reclamo
export interface Reclamo {
  id: string;
  numeroReclamo: string;
  tipoReclamo: TipoReclamoCompleto;
  codigoProcesoReclamo?: CodigoProcesoReclamo;
  estado: EstadoReclamo;
  fechaIngreso: string;
  fechaPresentacion?: string;
  fechaAdmisibilidad?: string;
  fechaResolucion?: string;
  origenReclamo: OrigenReclamo;
  entidadOrigenId?: string;
  numeroEntidadOrigen?: string;
  denunciaAsociada: string;
  cargoAsociado?: string;
  giroAsociado?: string;
  reclamante: string;
  rutReclamante: string;
  direccionReclamante?: string;
  emailReclamante?: string;
  telefonoReclamante?: string;
  representanteLegal?: string;
  montoReclamado?: number;
  montoResuelto?: number;
  fundamentoReclamo?: string;
  peticiones?: string;
  descripcion: string;
  resolucion?: string;
  tipoResolucion?: 'Acogida' | 'Rechazada' | 'Acogida Parcialmente';
  fundamentoResolucion?: string;
  datosTTA?: ReclamoTTA;
  aduana?: string;
  codigoAduana?: string;
  diasRespuesta: number;
  plazo?: number;
  fechaVencimiento?: string;
  loginFuncionario?: string;
  loginAbogado?: string;
  expedienteDigitalId?: string;
  instanciaJbpm?: string;
  fechaCreacion?: string;
  fechaModificacion?: string;
  usuarioCreacion?: string;
  usuarioModificacion?: string;
  observaciones?: string;
}

// Permisos según estado del reclamo
export interface PermisosReclamo {
  puedeEditar: boolean;
  puedeRegistrarAdmisibilidad: boolean;
  puedeRegistrarFallo: boolean;
  puedeRegistrarApelacion: boolean;
  puedeCerrar: boolean;
  puedeGenerarInforme: boolean;
  camposEditables: string[];
}

// ============================================
// MERCANCÍA - MODELO COMPLETO
// ============================================

export type EstadoMercancia = 
  | 'En Custodia'
  | 'Comisada'
  | 'Entregada'
  | 'Subastada'
  | 'Destruida'
  | 'Donada'
  | 'Entregada por RAP'
  | 'Incautada Judicialmente'
  | 'Pendiente Disposición'
  | 'En Tránsito'
  | 'En Puerto'
  | 'En Depósito'
  | 'Retenida'
  | 'Liberada';

export type TipoEventoMercancia = 
  | 'Ingreso'
  | 'Retención'
  | 'Incautación'
  | 'Comiso'
  | 'Devolución'
  | 'Destrucción'
  | 'Subasta'
  | 'Donación'
  | 'Entrega RAP'
  | 'Traslado'
  | 'Inventario'
  | 'Resolución Judicial'
  | 'Cambio Estado'
  | 'Observación';

// Item individual de mercancía
export interface ItemMercancia {
  id: string;
  mercanciaId: string;
  descripcionItem: string;
  cantidad: number;
  unidadMedida: string;
  valorUnitario?: number;
  valorTotal?: number;
  marca?: string;
  modelo?: string;
  serie?: string;
  estado: 'Bueno' | 'Regular' | 'Malo' | 'Destruido';
  observaciones?: string;
}

// Evento de seguimiento de mercancía
export interface SeguimientoMercancia {
  id: string;
  mercanciaId: string;
  tipoEvento: TipoEventoMercancia;
  fechaEvento: string;
  autoridad?: string;
  nroResolucion?: string;
  fechaResolucion?: string;
  ubicacionAnterior?: string;
  ubicacionNueva?: string;
  funcionarioResponsable: string;
  observaciones?: string;
  documentosAdjuntos?: string[];
  fechaRegistro: string;
  usuarioRegistro: string;
}

// Modelo completo de Mercancía
export interface Mercancia {
  id: string;
  
  // Identificadores
  codigoMercancia?: string;         // ID_MERCANCIA (autogenerado)
  
  // Descripción
  descripcion: string;              // DESCRIPCION_MERCANCIA
  descripcionDetallada?: string;
  
  // Clasificación arancelaria
  partida: string;
  subpartida?: string;
  posicionArancelaria?: string;
  
  // Cantidades y medidas
  cantidad: number;
  unidadMedida: string;
  numeroBultos?: number;            // NUMERO_BULTOS
  pesoBruto?: number;               // PESO_BRUTO (kg)
  pesoNeto?: number;
  volumen?: number;                 // m³
  
  // Valores
  valorFOB?: number;
  valorCIF?: number;                // VALOR_CIF
  valorAduanero?: number;
  moneda?: string;
  
  // Origen y procedencia
  paisOrigen?: string;
  paisProcedencia?: string;
  
  // Estado y ubicación
  estado: EstadoMercancia;          // ESTADO_MERCANCIA
  ubicacion?: string;
  bodega?: string;
  seccionBodega?: string;
  
  // Transporte
  contenedor?: string;
  manifiesto?: string;
  nave?: string;
  viaje?: string;
  
  // Aduana
  codigoAduanaIngreso?: string;     // COD_ADUANA_INGRESO
  nombreAduanaIngreso?: string;
  fechaIngreso: string;             // FECHA_INGRESO
  
  // Relaciones
  denunciaId?: string;
  denunciaNumero?: string;
  cargoId?: string;
  cargoNumero?: string;
  expedienteDigitalId?: string;
  
  // Items y seguimiento
  items?: ItemMercancia[];
  seguimientos?: SeguimientoMercancia[];
  
  // Disposición final
  disposicionFinal?: TipoEventoMercancia;
  fechaDisposicionFinal?: string;
  resolucionDisposicion?: string;
  
  // Auditoría
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaModificacion?: string;
  usuarioModificacion?: string;
  
  // Alertas
  tieneAlertaDisposicion?: boolean;
  alertaEventosContradictorios?: boolean;
}

// Permisos según estado de la mercancía
export interface PermisosMercancia {
  puedeRegistrarEvento: boolean;
  puedeDevolver: boolean;
  puedeComiso: boolean;
  puedeDestruir: boolean;
  puedeSubastar: boolean;
  puedeDonar: boolean;
  eventosDisponibles: TipoEventoMercancia[];
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
// DOCUMENTOS ADUANEROS
// ============================================

export type TipoDocAduanero =
  | 'DIN'        // Declaración de Ingreso
  | 'DUS'        // Declaración Única de Salida
  | 'TRS'        // Tránsito
  | 'DTS'        // Documento de Transferencia
  | 'CPT'        // Comprobante de Pago Tributario
  | 'BL'         // Bill of Lading
  | 'AWB'        // Air Waybill
  | 'CI'         // Commercial Invoice
  | 'PL'         // Packing List
  | 'CO'         // Certificate of Origin
  | 'Otro';

export type EstadoDocumentoAduanero =
  | 'Vigente'
  | 'Anulado'
  | 'Rectificado'
  | 'Cancelado';

export interface DocumentoAduanero {
  id: string;
  tipoDocumento: TipoDocAduanero;
  numeroDocumento: string;
  numeroAceptacion?: string;
  fechaEmision: string;
  fechaAceptacion?: string;
  aduana: string;
  codigoAduana?: string;
  estado: EstadoDocumentoAduanero;
  descripcion?: string;

  // Datos específicos según tipo de documento
  importador?: string;
  rutImportador?: string;
  exportador?: string;
  rutExportador?: string;
  agenteAduana?: string;
  codigoAgente?: string;

  // Valores y montos
  valorFOB?: number;
  valorCIF?: number;
  moneda?: string;

  // Mercancía
  descripcionMercancia?: string;
  pesoNeto?: number;
  pesoBruto?: number;
  numeroBultos?: number;

  // Archivos asociados
  archivoXML?: string;          // Ruta o URL del XML
  archivoXMLContent?: string;   // Contenido del XML
  archivoXSL?: string;          // Ruta o URL del XSL
  archivoHTML?: string;         // HTML transformado para visualización
  archivoPDF?: string;          // PDF del documento

  // Relaciones
  denunciaId?: string;
  cargoId?: string;
  reclamoId?: string;
  giroId?: string;
  mercanciaId?: string;

  // Metadatos
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaModificacion?: string;
  usuarioModificacion?: string;
  observaciones?: string;
}

// ============================================
// EXPEDIENTE DIGITAL
// ============================================

export type TipoExpediente = 'DENUNCIA' | 'CARGO' | 'RECLAMO' | 'GIRO';

export type CategoriaArchivoExpediente =
  | 'Documento Aduanero'
  | 'Denuncia/Cargo'
  | 'Notificación'
  | 'Resolución'
  | 'Prueba/Evidencia'
  | 'Fotografía'
  | 'Informe Técnico'
  | 'Comunicación'
  | 'Reclamo/Recurso'
  | 'Sentencia'
  | 'Comprobante de Pago'
  | 'Otro';

export type TipoArchivoExpediente =
  | 'PDF'
  | 'XML'
  | 'DOC'
  | 'DOCX'
  | 'XLS'
  | 'XLSX'
  | 'JPG'
  | 'PNG'
  | 'ZIP'
  | 'RAR'
  | 'MSG'
  | 'EML'
  | 'TXT';

export type EstadoArchivoExpediente =
  | 'Vigente'
  | 'Reemplazado'
  | 'Anulado'
  | 'En Revisión';

export type OrigenArchivo =
  | 'Manual'            // Subido manualmente por usuario
  | 'Sistema'           // Generado automáticamente por el sistema
  | 'Importado'         // Importado desde otro sistema
  | 'Notificación';     // Generado por proceso de notificación

export interface ArchivoExpediente {
  id: string;
  expedienteId: string;
  nombre: string;
  nombreOriginal?: string;        // Nombre original del archivo subido
  tipo: TipoArchivoExpediente;
  extension?: string;
  tamanio: string;                // Formateado (ej: "1.2 MB")
  tamanioBytes?: number;          // Tamaño en bytes
  fechaSubida: string;
  horaSubida?: string;
  usuarioSubida: string;
  nombreUsuarioSubida?: string;   // Nombre completo del usuario
  estado: EstadoArchivoExpediente;
  categoria: CategoriaArchivoExpediente;
  origen: OrigenArchivo;

  // Ruta y acceso al archivo
  rutaArchivo?: string;
  urlDescarga?: string;
  urlVisualizacion?: string;

  // Metadatos adicionales
  descripcion?: string;
  observaciones?: string;
  esFirmado?: boolean;
  esConfidencial?: boolean;
  requiereValidacion?: boolean;

  // Para documentos XML
  contenidoXML?: string;
  tieneVistaHTML?: boolean;

  // Versionamiento
  version?: number;
  archivoReemplazadoId?: string;  // ID del archivo que fue reemplazado

  // Auditoría
  fechaAnulacion?: string;
  usuarioAnulacion?: string;
  motivoAnulacion?: string;
}

export interface ExpedienteDigital {
  id: string;
  tipo: TipoExpediente;
  numeroExpediente: string;
  entidadId: string;
  entidadNumero?: string;         // Número de la denuncia/cargo/reclamo/giro
  fechaCreacion: string;
  fechaModificacion: string;

  // Archivos y documentos
  archivos: ArchivoExpediente[];
  documentosAduaneros?: DocumentoAduanero[];

  // Historial
  timeline: TimelineItem[];

  // Estado del expediente
  estado: string;
  completitud?: number;           // Porcentaje de documentos obligatorios presentes
  documentosFaltantes?: string[]; // Lista de documentos obligatorios faltantes

  // Alertas
  tieneDocumentosFaltantes?: boolean;
  tieneDocumentosVencidos?: boolean;

  // Auditoría
  usuarioCreacion?: string;
  fechaUltimaModificacion?: string;
  usuarioUltimaModificacion?: string;
}

// Permisos para gestión de archivos del expediente
export interface PermisosArchivoExpediente {
  puedeSubir: boolean;
  puedeDescargar: boolean;
  puedeVisualizar: boolean;
  puedeEliminar: boolean;
  puedeAnular: boolean;
  puedeReemplazar: boolean;
  motivoNoEliminar?: string;
}

// Configuración de documentos obligatorios por tipo de expediente
export interface DocumentoObligatorioConfig {
  tipo: TipoExpediente;
  categoria: CategoriaArchivoExpediente;
  nombre: string;
  descripcion: string;
  obligatorio: boolean;
  plazoMaximoDias?: number;
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

// ============================================
// INVOLUCRADOS - MÓDULO CENTRALIZADO
// ============================================

export type TipoPersona = 'Natural' | 'Jurídica';

export type TipoIdentificacion = 
  | 'RUT'
  | 'Pasaporte'
  | 'DNI'
  | 'RUC'
  | 'Otro';

export type TipoDireccion = 
  | 'Particular'
  | 'Comercial'
  | 'Legal'
  | 'Notificación';

export type EstadoInvolucrado = 'Activo' | 'Inactivo';

// Dirección de involucrado
export interface DireccionInvolucrado {
  id: string;
  involucradoId: string;
  tipoDireccion: TipoDireccion;
  direccion: string;
  numero?: string;
  departamento?: string;
  region: string;
  comuna: string;
  codigoPostal?: string;
  pais?: string;
  esPrincipal: boolean;
}

// Modelo centralizado de Involucrado
export interface Involucrado {
  id: string;
  
  // Identificación
  tipoIdentificacion: TipoIdentificacion;
  numeroIdentificacion: string;       // RUT, Pasaporte, etc.
  digitoVerificador?: string;         // Solo para RUT
  
  // Tipo de persona
  tipoPersona: TipoPersona;
  
  // Datos persona natural
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  
  // Datos persona jurídica
  razonSocial?: string;
  giro?: string;
  
  // Nombre completo (calculado o razón social)
  nombreCompleto: string;
  
  // Datos de contacto
  email?: string;
  emailSecundario?: string;
  telefono?: string;
  telefonoSecundario?: string;
  
  // Nacionalidad
  nacionalidad?: string;
  
  // Direcciones
  direcciones: DireccionInvolucrado[];
  
  // Representante legal (solo para persona jurídica)
  representanteLegalId?: string;
  representanteLegalNombre?: string;
  representanteLegalRut?: string;
  
  // Estado
  estado: EstadoInvolucrado;
  
  // Relaciones con procesos (IDs de entidades asociadas)
  denunciasAsociadas?: string[];
  cargosAsociados?: string[];
  girosAsociados?: string[];
  reclamosAsociados?: string[];
  
  // Auditoría
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaModificacion?: string;
  usuarioModificacion?: string;
  
  // Notas internas
  observaciones?: string;
}

// Permisos para gestión de involucrados
export interface PermisosInvolucrado {
  puedeEditar: boolean;
  puedeEliminar: boolean;
  puedeInactivar: boolean;
  motivoNoEliminar?: string;
}

// Historial de casos del involucrado
export interface HistorialCasoInvolucrado {
  tipo: 'DENUNCIA' | 'CARGO' | 'GIRO' | 'RECLAMO';
  id: string;
  numero: string;
  fecha: string;
  estado: string;
  tipoInvolucrado: TipoInvolucrado;
  monto?: string;
}
