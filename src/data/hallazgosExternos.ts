/**
 * Hallazgos Externos - Procesamiento de Payloads del Sistema PFI
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 * 
 * Este módulo maneja la recepción, validación y transformación de datos
 * provenientes del sistema externo de denuncias (PFI).
 */

import type { Hallazgo, TipoHallazgo, EstadoHallazgo } from './types';
import { 
  getAduanaPorCodigoExterno, 
  getSeccionPorCodigoExterno,
  getTipoIdentificadorPorCodigo,
  getTipoDocumentoAduaneroPorCodigo,
  getArticuloPorCodigoExterno,
  getEtapaPorCodigoExterno,
} from './catalogosExternos';

// ============================================
// INTERFACES PARA PAYLOAD EXTERNO
// ============================================

/**
 * Estructura del payload completo recibido del sistema externo
 */
export interface PayloadDenunciaExterna {
  level: 'info' | 'warning' | 'error';
  context: string;
  transactionId: string;
  service: string;
  operation: string;
  url: string;
  payload: {
    denuncia: DenunciaExterna;
  };
  timestamp: string;
  message: string;
}

/**
 * Estructura de la denuncia dentro del payload
 */
export interface DenunciaExterna {
  identificacion: IdentificacionExterna;
  infraccion: InfraccionExterna;
  multas: MultasExterna;
  denunciados: DenunciadosExterna;
  documentos_aduaneros: DocumentoAduaneroExterno[];
  descripcion_hechos: DescripcionHechosExterna;
}

/**
 * Datos de identificación de la denuncia
 */
export interface IdentificacionExterna {
  usuario: string;
  numero_provisorio: string | null;
  agente_aduana: string | null;
  aduana: string;               // Código numérico de aduana
  seccion: string;              // Código numérico de sección
  fecha_ocurrencia: string;     // Formato DD/MM/YYYY
  etapa_formulacion: number;    // Código de etapa de formulación
}

/**
 * Datos de la infracción
 */
export interface InfraccionExterna {
  articulo: string;             // Código de artículo
  tipo: string;                 // "1" = Infraccional, "2" = Penal
}

/**
 * Datos de multas
 */
export interface MultasExterna {
  maxima: string;               // Monto máximo de multa
  sin_allanamiento: string | null;
  con_allanamiento: string | null;
  autodenuncio: string;         // "1" = Sí, "0" = No
}

/**
 * Estructura de denunciados
 */
export interface DenunciadosExterna {
  infractor: InfractorExterno;
}

/**
 * Datos del infractor
 */
export interface InfractorExterno {
  tipo_identificador: number;   // Código tipo de identificador (19=RUT, 1=Pasaporte, etc.)
  documento_identificador: string;
  tipo: string;                 // "1"=Persona Natural, "2"=Persona Jurídica, "3"=Otro
  nombre: string;
  apellido_paterno: string | null;
  apellido_materno: string | null;
  nacionalidad: string | null;
  direccion: string | null;
  comuna: string | null;
  tipo_direccion: string | null;
}

/**
 * Documento aduanero externo
 */
export interface DocumentoAduaneroExterno {
  tipo_documento_aduanero: number;  // Código de tipo de documento
  numero_documento: string;
  numero_referencia: string | null;
}

/**
 * Descripción de hechos
 */
export interface DescripcionHechosExterna {
  obs: string;
}

// ============================================
// INTERFACES PARA HALLAZGO TRANSFORMADO
// ============================================

/**
 * Hallazgo procesado y normalizado para el sistema interno
 */
export interface HallazgoProcesado extends Hallazgo {
  // Datos adicionales del payload externo
  transactionId: string;
  timestampRecepcion: string;
  usuarioOrigen: string;
  
  // Datos de la infracción
  codigoArticulo: string;
  nombreArticulo?: string;
  tipoInfraccionCodigo: string;
  
  // Datos de multas
  multaMaxima: number;
  multaSinAllanamiento: number | null;
  multaConAllanamiento: number | null;
  esAutodenuncio: boolean;
  
  // Datos del infractor procesados
  infractor: InfractorProcesado;
  
  // Documentos aduaneros procesados
  documentosAduanerosProcesados: DocumentoAduaneroProcesado[];
  
  // Metadatos de procesamiento
  etapaFormulacionCodigo: number;
  etapaFormulacionNombre?: string;
  agenteAduana: string | null;
  numeroProvisorio: string | null;
  
  // Payload original para auditoría
  payloadOriginal?: PayloadDenunciaExterna;
}

/**
 * Infractor procesado
 */
export interface InfractorProcesado {
  tipoIdentificadorCodigo: number;
  tipoIdentificadorNombre: string;
  documentoIdentificador: string;
  tipoPersonaCodigo: string;
  tipoPersonaNombre: string;
  nombreCompleto: string;
  nombre: string;
  apellidoPaterno: string | null;
  apellidoMaterno: string | null;
  nacionalidad: string | null;
  direccion: string | null;
  comuna: string | null;
  tipoDireccion: string | null;
}

/**
 * Documento aduanero procesado
 */
export interface DocumentoAduaneroProcesado {
  tipoDocumentoCodigo: number;
  tipoDocumentoNombre: string;
  tipoDocumentoSigla: string;
  numeroDocumento: string;
  numeroReferencia: string | null;
}

// ============================================
// FUNCIONES DE TRANSFORMACIÓN
// ============================================

/**
 * Valida el payload externo
 */
export const validarPayloadExterno = (payload: unknown): { 
  valido: boolean; 
  errores: string[];
  payload?: PayloadDenunciaExterna;
} => {
  const errores: string[] = [];
  
  if (!payload || typeof payload !== 'object') {
    return { valido: false, errores: ['Payload inválido o vacío'] };
  }
  
  const p = payload as Record<string, unknown>;
  
  // Validar campos obligatorios del wrapper
  if (!p.transactionId) errores.push('Falta transactionId');
  if (!p.timestamp) errores.push('Falta timestamp');
  if (!p.payload) errores.push('Falta payload');
  
  // Validar estructura de denuncia
  if (p.payload && typeof p.payload === 'object') {
    const payloadInterno = p.payload as Record<string, unknown>;
    if (!payloadInterno.denuncia) {
      errores.push('Falta objeto denuncia en payload');
    } else {
      const denuncia = payloadInterno.denuncia as Record<string, unknown>;
      
      // Validar identificacion
      if (!denuncia.identificacion) {
        errores.push('Falta identificacion en denuncia');
      } else {
        const ident = denuncia.identificacion as Record<string, unknown>;
        if (!ident.aduana) errores.push('Falta código de aduana');
        if (!ident.fecha_ocurrencia) errores.push('Falta fecha de ocurrencia');
      }
      
      // Validar infraccion
      if (!denuncia.infraccion) {
        errores.push('Falta infraccion en denuncia');
      } else {
        const infr = denuncia.infraccion as Record<string, unknown>;
        if (!infr.articulo) errores.push('Falta artículo de infracción');
        if (!infr.tipo) errores.push('Falta tipo de infracción');
      }
      
      // Validar denunciados
      if (!denuncia.denunciados) {
        errores.push('Falta denunciados en denuncia');
      } else {
        const denunc = denuncia.denunciados as Record<string, unknown>;
        if (!denunc.infractor) errores.push('Falta infractor en denunciados');
      }
    }
  }
  
  if (errores.length > 0) {
    return { valido: false, errores };
  }
  
  return { 
    valido: true, 
    errores: [], 
    payload: payload as PayloadDenunciaExterna 
  };
};

/**
 * Genera un número de hallazgo único
 */
export const generarNumeroHallazgo = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `PFI-${timestamp.toString().slice(-6)}${random}`;
};

/**
 * Convierte fecha del formato DD/MM/YYYY a formato interno dd-mm-aaaa
 */
export const convertirFechaExterna = (fechaExterna: string): string => {
  if (!fechaExterna) return '';
  
  // Si ya está en formato dd-mm-aaaa, retornar
  if (/^\d{2}-\d{2}-\d{4}$/.test(fechaExterna)) {
    return fechaExterna;
  }
  
  // Convertir de DD/MM/YYYY a dd-mm-aaaa
  const partes = fechaExterna.split('/');
  if (partes.length === 3) {
    return `${partes[0]}-${partes[1]}-${partes[2]}`;
  }
  
  return fechaExterna;
};

/**
 * Determina el tipo de hallazgo basado en el código de infracción
 */
export const determinarTipoHallazgo = (tipoInfraccion: string): TipoHallazgo => {
  // "1" = Infraccional, "2" = Penal
  return tipoInfraccion === '2' ? 'Penal' : 'Infraccional';
};

/**
 * Determina el tipo de persona basado en el código
 */
export const determinarTipoPersona = (tipoCodigo: string): string => {
  switch (tipoCodigo) {
    case '1': return 'Persona Natural';
    case '2': return 'Persona Jurídica';
    case '3': return 'Otro';
    default: return 'No especificado';
  }
};

/**
 * Construye el nombre completo del infractor
 */
export const construirNombreCompleto = (infractor: InfractorExterno): string => {
  const partes: string[] = [];
  
  if (infractor.nombre) partes.push(infractor.nombre);
  if (infractor.apellido_paterno) partes.push(infractor.apellido_paterno);
  if (infractor.apellido_materno) partes.push(infractor.apellido_materno);
  
  return partes.join(' ') || 'Sin nombre';
};

/**
 * Formatea el monto a formato chileno
 */
export const formatearMontoChileno = (monto: string | number | null): string => {
  if (monto === null || monto === undefined) return '$0';
  
  const numero = typeof monto === 'string' ? parseInt(monto, 10) : monto;
  if (isNaN(numero)) return '$0';
  
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(numero);
};

/**
 * Calcula los días hasta vencimiento (por defecto 30 días desde la fecha de ocurrencia)
 */
export const calcularDiasVencimiento = (fechaOcurrencia: string, plazoBase: number = 30): number => {
  if (!fechaOcurrencia) return plazoBase;
  
  try {
    // Parsear fecha en formato dd-mm-yyyy o dd/mm/yyyy
    const partes = fechaOcurrencia.includes('/') 
      ? fechaOcurrencia.split('/') 
      : fechaOcurrencia.split('-');
    
    if (partes.length !== 3) return plazoBase;
    
    const fecha = new Date(
      parseInt(partes[2], 10),
      parseInt(partes[1], 10) - 1,
      parseInt(partes[0], 10)
    );
    
    const fechaVencimiento = new Date(fecha);
    fechaVencimiento.setDate(fechaVencimiento.getDate() + plazoBase);
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const diffTime = fechaVencimiento.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  } catch {
    return plazoBase;
  }
};

/**
 * Transforma el payload externo a un hallazgo procesado
 */
export const transformarPayloadAHallazgo = (
  payloadCompleto: PayloadDenunciaExterna
): HallazgoProcesado => {
  const { payload, transactionId, timestamp } = payloadCompleto;
  const { denuncia } = payload;
  const { identificacion, infraccion, multas, denunciados, documentos_aduaneros, descripcion_hechos } = denuncia;
  
  // Obtener datos de catálogos
  const aduana = getAduanaPorCodigoExterno(identificacion.aduana);
  const seccion = getSeccionPorCodigoExterno(identificacion.seccion);
  const tipoIdentificador = getTipoIdentificadorPorCodigo(denunciados.infractor.tipo_identificador);
  const articulo = getArticuloPorCodigoExterno(infraccion.articulo);
  const etapa = getEtapaPorCodigoExterno(identificacion.etapa_formulacion);
  
  // Procesar infractor
  const infractorProcesado: InfractorProcesado = {
    tipoIdentificadorCodigo: denunciados.infractor.tipo_identificador,
    tipoIdentificadorNombre: tipoIdentificador?.nombre || `Tipo ${denunciados.infractor.tipo_identificador}`,
    documentoIdentificador: denunciados.infractor.documento_identificador,
    tipoPersonaCodigo: denunciados.infractor.tipo,
    tipoPersonaNombre: determinarTipoPersona(denunciados.infractor.tipo),
    nombreCompleto: construirNombreCompleto(denunciados.infractor),
    nombre: denunciados.infractor.nombre,
    apellidoPaterno: denunciados.infractor.apellido_paterno,
    apellidoMaterno: denunciados.infractor.apellido_materno,
    nacionalidad: denunciados.infractor.nacionalidad,
    direccion: denunciados.infractor.direccion,
    comuna: denunciados.infractor.comuna,
    tipoDireccion: denunciados.infractor.tipo_direccion,
  };
  
  // Procesar documentos aduaneros
  const documentosAduanerosProcesados: DocumentoAduaneroProcesado[] = documentos_aduaneros.map(doc => {
    const tipoDoc = getTipoDocumentoAduaneroPorCodigo(doc.tipo_documento_aduanero);
    return {
      tipoDocumentoCodigo: doc.tipo_documento_aduanero,
      tipoDocumentoNombre: tipoDoc?.nombre || `Tipo ${doc.tipo_documento_aduanero}`,
      tipoDocumentoSigla: tipoDoc?.sigla || '',
      numeroDocumento: doc.numero_documento,
      numeroReferencia: doc.numero_referencia,
    };
  });
  
  // Generar número de hallazgo
  const numeroHallazgo = generarNumeroHallazgo();
  const fechaIngreso = convertirFechaExterna(identificacion.fecha_ocurrencia);
  const tipoHallazgo = determinarTipoHallazgo(infraccion.tipo);
  
  // Calcular monto estimado basado en multa máxima
  const multaMaxima = parseInt(multas.maxima, 10) || 0;
  
  // Construir hallazgo procesado
  const hallazgoProcesado: HallazgoProcesado = {
    // Datos base del Hallazgo
    id: `h-ext-${transactionId.substring(0, 8)}`,
    numeroHallazgo,
    fechaIngreso,
    estado: 'Ingresado' as EstadoHallazgo,
    tipoHallazgo,
    aduana: aduana?.nombre || `Aduana ${identificacion.aduana}`,
    rutInvolucrado: denunciados.infractor.documento_identificador,
    nombreInvolucrado: infractorProcesado.nombreCompleto,
    descripcion: descripcion_hechos.obs || 'Sin descripción',
    montoEstimado: formatearMontoChileno(multaMaxima),
    diasVencimiento: calcularDiasVencimiento(identificacion.fecha_ocurrencia),
    funcionarioAsignado: 'Pendiente asignación',
    
    // Datos adicionales del payload externo
    transactionId,
    timestampRecepcion: timestamp,
    usuarioOrigen: identificacion.usuario,
    
    // Datos de la infracción
    codigoArticulo: infraccion.articulo,
    nombreArticulo: articulo?.nombre,
    tipoInfraccionCodigo: infraccion.tipo,
    
    // Datos de multas
    multaMaxima,
    multaSinAllanamiento: multas.sin_allanamiento ? parseInt(multas.sin_allanamiento, 10) : null,
    multaConAllanamiento: multas.con_allanamiento ? parseInt(multas.con_allanamiento, 10) : null,
    esAutodenuncio: multas.autodenuncio === '1',
    
    // Datos del infractor procesados
    infractor: infractorProcesado,
    
    // Documentos aduaneros procesados
    documentosAduanerosProcesados,
    
    // Metadatos de procesamiento
    etapaFormulacionCodigo: identificacion.etapa_formulacion,
    etapaFormulacionNombre: etapa?.nombre,
    agenteAduana: identificacion.agente_aduana,
    numeroProvisorio: identificacion.numero_provisorio,
    
    // Datos para formulario de denuncia
    datosDenuncia: {
      seccion: seccion?.nombre || `Sección ${identificacion.seccion}`,
      tipoInfraccion: articulo?.descripcion || 'No especificado',
      normaInfringida: articulo?.normaLegal || 'Por determinar',
      fundamentoLegal: articulo?.normaLegal || 'Por determinar',
      mercanciaInvolucrada: 'Por determinar',
      direccionInvolucrado: denunciados.infractor.direccion || 'No especificada',
      emailInvolucrado: '',
      telefonoInvolucrado: '',
      documentosAdjuntos: [],
    },
    
    // Payload original para auditoría (opcional)
    payloadOriginal: payloadCompleto,
  };
  
  return hallazgoProcesado;
};

// ============================================
// ALMACENAMIENTO DE HALLAZGOS EXTERNOS
// ============================================

// Lista de hallazgos recibidos del sistema externo
export const hallazgosExternos: HallazgoProcesado[] = [];

/**
 * Recibe y procesa un payload externo
 */
export const recibirHallazgoExterno = (payload: unknown): {
  success: boolean;
  hallazgo?: HallazgoProcesado;
  errores?: string[];
} => {
  // Validar payload
  const validacion = validarPayloadExterno(payload);
  
  if (!validacion.valido || !validacion.payload) {
    return {
      success: false,
      errores: validacion.errores,
    };
  }
  
  try {
    // Transformar a hallazgo procesado
    const hallazgoProcesado = transformarPayloadAHallazgo(validacion.payload);
    
    // Agregar a la lista de hallazgos externos
    hallazgosExternos.push(hallazgoProcesado);
    
    return {
      success: true,
      hallazgo: hallazgoProcesado,
    };
  } catch (error) {
    return {
      success: false,
      errores: [`Error al procesar hallazgo: ${error instanceof Error ? error.message : 'Error desconocido'}`],
    };
  }
};

/**
 * Obtiene todos los hallazgos externos recibidos
 */
export const getHallazgosExternos = (): HallazgoProcesado[] => {
  return [...hallazgosExternos];
};

/**
 * Obtiene un hallazgo externo por su transactionId
 */
export const getHallazgoExternoPorTransactionId = (transactionId: string): HallazgoProcesado | undefined => {
  return hallazgosExternos.find(h => h.transactionId === transactionId);
};

/**
 * Obtiene un hallazgo externo por su número de hallazgo
 */
export const getHallazgoExternoPorNumero = (numeroHallazgo: string): HallazgoProcesado | undefined => {
  return hallazgosExternos.find(h => h.numeroHallazgo === numeroHallazgo);
};

/**
 * Conteo de hallazgos externos
 */
export const getConteoHallazgosExternos = () => ({
  total: hallazgosExternos.length,
  porEstado: {
    ingresado: hallazgosExternos.filter(h => h.estado === 'Ingresado').length,
    enAnalisis: hallazgosExternos.filter(h => h.estado === 'En Análisis').length,
    notificarDenuncia: hallazgosExternos.filter(h => h.estado === 'Notificar Denuncia').length,
  },
  porTipo: {
    infraccional: hallazgosExternos.filter(h => h.tipoHallazgo === 'Infraccional').length,
    penal: hallazgosExternos.filter(h => h.tipoHallazgo === 'Penal').length,
  },
  autodenuncios: hallazgosExternos.filter(h => h.esAutodenuncio).length,
});

// ============================================
// EJEMPLO DE USO
// ============================================

/**
 * Ejemplo de payload para testing/documentación
 */
export const ejemploPayloadExterno: PayloadDenunciaExterna = {
  level: "info",
  context: "DenunciasService",
  transactionId: "8f9a19f7-aa31-445c-b687-95dbe3e04de1",
  service: "DenunciaService",
  operation: "enviarDenunciaADecare",
  url: "http://Eap7test.aduana.cl/jsonToxmleap7/api/filter",
  payload: {
    denuncia: {
      identificacion: {
        usuario: "playera",
        numero_provisorio: null,
        agente_aduana: null,
        aduana: "3",
        seccion: "46",
        fecha_ocurrencia: "14/05/2025",
        etapa_formulacion: 143
      },
      infraccion: {
        articulo: "40",
        tipo: "1"
      },
      multas: {
        maxima: "0",
        sin_allanamiento: null,
        con_allanamiento: null,
        autodenuncio: "1"
      },
      denunciados: {
        infractor: {
          tipo_identificador: 19,
          documento_identificador: "11111111-1",
          tipo: "3",
          nombre: "Gerardo Fuentes",
          apellido_paterno: null,
          apellido_materno: null,
          nacionalidad: null,
          direccion: null,
          comuna: null,
          tipo_direccion: null
        }
      },
      documentos_aduaneros: [
        {
          tipo_documento_aduanero: 46,
          numero_documento: "-",
          numero_referencia: null
        }
      ],
      descripcion_hechos: {
        obs: "Esta es una prueba de denuncias #4"
      }
    }
  },
  timestamp: "2025-12-26T21:50:14.873Z",
  message: "Enviando denuncia a DECARE"
};
