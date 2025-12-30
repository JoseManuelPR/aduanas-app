/**
 * Catálogos Externos - Mapeo de códigos del sistema PFI
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 * 
 * Este módulo contiene los catálogos de mapeo entre los códigos numéricos
 * utilizados por el sistema externo (PFI) y los datos del sistema interno.
 */

// ============================================
// ADUANAS - Mapeo de códigos numéricos
// ============================================

export interface AduanaExterna {
  codigoExterno: string;
  codigoInterno: string;
  nombre: string;
  region: string;
  activa: boolean;
}

export const aduanasExternas: AduanaExterna[] = [
  { codigoExterno: '1', codigoInterno: '901', nombre: 'Arica', region: 'Arica y Parinacota', activa: true },
  { codigoExterno: '2', codigoInterno: '902', nombre: 'Iquique', region: 'Tarapacá', activa: true },
  { codigoExterno: '3', codigoInterno: '903', nombre: 'Antofagasta', region: 'Antofagasta', activa: true },
  { codigoExterno: '4', codigoInterno: '904', nombre: 'Valparaíso', region: 'Valparaíso', activa: true },
  { codigoExterno: '5', codigoInterno: '905', nombre: 'Santiago - Metropolitana', region: 'Metropolitana', activa: true },
  { codigoExterno: '6', codigoInterno: '906', nombre: 'Los Andes', region: 'Valparaíso', activa: true },
  { codigoExterno: '7', codigoInterno: '907', nombre: 'Talcahuano', region: 'Biobío', activa: true },
  { codigoExterno: '8', codigoInterno: '908', nombre: 'Temuco', region: 'Araucanía', activa: true },
  { codigoExterno: '9', codigoInterno: '909', nombre: 'Puerto Montt', region: 'Los Lagos', activa: true },
  { codigoExterno: '10', codigoInterno: '910', nombre: 'Coyhaique', region: 'Aysén', activa: true },
  { codigoExterno: '11', codigoInterno: '911', nombre: 'Punta Arenas', region: 'Magallanes', activa: true },
  { codigoExterno: '12', codigoInterno: '912', nombre: 'Osorno', region: 'Los Lagos', activa: true },
  { codigoExterno: '13', codigoInterno: '913', nombre: 'San Antonio', region: 'Valparaíso', activa: true },
  { codigoExterno: '14', codigoInterno: '914', nombre: 'Chañaral', region: 'Atacama', activa: true },
  { codigoExterno: '15', codigoInterno: '915', nombre: 'Tocopilla', region: 'Antofagasta', activa: true },
];

export const getAduanaPorCodigoExterno = (codigo: string): AduanaExterna | undefined => {
  return aduanasExternas.find(a => a.codigoExterno === codigo);
};

export const getAduanaPorCodigoInterno = (codigo: string): AduanaExterna | undefined => {
  return aduanasExternas.find(a => a.codigoInterno === codigo);
};

// ============================================
// SECCIONES - Mapeo de códigos numéricos
// ============================================

export interface SeccionExterna {
  codigoExterno: string;
  codigoInterno: string;
  nombre: string;
  aduanaCodigoExterno?: string;
  activa: boolean;
}

export const seccionesExternas: SeccionExterna[] = [
  // Secciones de Fiscalización
  { codigoExterno: '40', codigoInterno: 'FISC-GEN', nombre: 'Fiscalización General', activa: true },
  { codigoExterno: '41', codigoInterno: 'FISC-OP', nombre: 'Fiscalización Operativa', activa: true },
  { codigoExterno: '42', codigoInterno: 'FISC-PD', nombre: 'Fiscalización Post-Despacho', activa: true },
  { codigoExterno: '43', codigoInterno: 'FISC-DOC', nombre: 'Fiscalización Documental', activa: true },
  { codigoExterno: '44', codigoInterno: 'FISC-ZP', nombre: 'Fiscalización Zona Primaria', activa: true },
  { codigoExterno: '45', codigoInterno: 'FISC-TER', nombre: 'Fiscalización Terrestre', activa: true },
  { codigoExterno: '46', codigoInterno: 'FISC-EXP', nombre: 'Fiscalización Exportaciones', activa: true },
  { codigoExterno: '47', codigoInterno: 'FISC-MAR', nombre: 'Fiscalización Marítima', activa: true },
  { codigoExterno: '48', codigoInterno: 'FISC-AER', nombre: 'Fiscalización Aérea', activa: true },
  // Secciones Jurídicas
  { codigoExterno: '50', codigoInterno: 'JUR-GEN', nombre: 'Jurídico General', activa: true },
  { codigoExterno: '51', codigoInterno: 'JUR-DEN', nombre: 'Jurídico Denuncias', activa: true },
  { codigoExterno: '52', codigoInterno: 'JUR-REC', nombre: 'Jurídico Reclamos', activa: true },
  // Secciones Administrativas
  { codigoExterno: '60', codigoInterno: 'ADMIN', nombre: 'Administración', activa: true },
  { codigoExterno: '61', codigoInterno: 'CONT', nombre: 'Control Interno', activa: true },
];

export const getSeccionPorCodigoExterno = (codigo: string): SeccionExterna | undefined => {
  return seccionesExternas.find(s => s.codigoExterno === codigo);
};

// ============================================
// TIPOS DE IDENTIFICADOR - Mapeo de códigos
// ============================================

export interface TipoIdentificadorExterno {
  codigo: number;
  nombre: string;
  sigla: string;
  descripcion: string;
  formatoEjemplo: string;
  activo: boolean;
}

export const tiposIdentificadorExternos: TipoIdentificadorExterno[] = [
  { codigo: 1, nombre: 'Pasaporte', sigla: 'PAS', descripcion: 'Pasaporte extranjero', formatoEjemplo: 'ABC123456', activo: true },
  { codigo: 2, nombre: 'DNI', sigla: 'DNI', descripcion: 'Documento Nacional de Identidad (extranjeros)', formatoEjemplo: '12345678', activo: true },
  { codigo: 3, nombre: 'Carnet de Identidad', sigla: 'CI', descripcion: 'Cédula de identidad chilena', formatoEjemplo: '12.345.678-9', activo: true },
  { codigo: 4, nombre: 'RUC', sigla: 'RUC', descripcion: 'Registro Único de Contribuyentes (Perú)', formatoEjemplo: '12345678901', activo: true },
  { codigo: 5, nombre: 'CUIT', sigla: 'CUIT', descripcion: 'Clave Única de Identificación Tributaria (Argentina)', formatoEjemplo: '20-12345678-9', activo: true },
  { codigo: 10, nombre: 'NIT', sigla: 'NIT', descripcion: 'Número de Identificación Tributaria (Colombia/Bolivia)', formatoEjemplo: '123456789-0', activo: true },
  { codigo: 15, nombre: 'RFC', sigla: 'RFC', descripcion: 'Registro Federal de Contribuyentes (México)', formatoEjemplo: 'ABCD123456XYZ', activo: true },
  { codigo: 19, nombre: 'RUT', sigla: 'RUT', descripcion: 'Rol Único Tributario de Chile', formatoEjemplo: '76.123.456-7', activo: true },
  { codigo: 20, nombre: 'RUT Empresa', sigla: 'RUT-E', descripcion: 'RUT de persona jurídica chilena', formatoEjemplo: '96.123.456-7', activo: true },
  { codigo: 99, nombre: 'Otro', sigla: 'OTR', descripcion: 'Otro tipo de identificación', formatoEjemplo: 'Variable', activo: true },
];

export const getTipoIdentificadorPorCodigo = (codigo: number): TipoIdentificadorExterno | undefined => {
  return tiposIdentificadorExternos.find(t => t.codigo === codigo);
};

export const getTipoIdentificadorPorSigla = (sigla: string): TipoIdentificadorExterno | undefined => {
  return tiposIdentificadorExternos.find(t => t.sigla === sigla);
};

// ============================================
// TIPOS DE DOCUMENTO ADUANERO - Mapeo de códigos
// ============================================

export interface TipoDocumentoAduaneroExterno {
  codigo: number;
  codigoInterno: string;
  nombre: string;
  sigla: string;
  descripcion: string;
  activo: boolean;
}

export const tiposDocumentoAduaneroExternos: TipoDocumentoAduaneroExterno[] = [
  { codigo: 1, codigoInterno: 'DIN', nombre: 'Declaración de Ingreso', sigla: 'DIN', descripcion: 'Declaración para importaciones', activo: true },
  { codigo: 2, codigoInterno: 'DUS', nombre: 'Declaración Única de Salida', sigla: 'DUS', descripcion: 'Declaración para exportaciones', activo: true },
  { codigo: 3, codigoInterno: 'MIC-DTA', nombre: 'Manifiesto Internacional de Carga', sigla: 'MIC/DTA', descripcion: 'Documento de tránsito aduanero', activo: true },
  { codigo: 4, codigoInterno: 'DAT', nombre: 'Declaración de Admisión Temporal', sigla: 'DAT', descripcion: 'Admisión temporal de mercancías', activo: true },
  { codigo: 5, codigoInterno: 'DI', nombre: 'Declaración de Importación', sigla: 'DI', descripcion: 'Declaración general de importación', activo: true },
  { codigo: 10, codigoInterno: 'BL', nombre: 'Bill of Lading', sigla: 'B/L', descripcion: 'Conocimiento de embarque marítimo', activo: true },
  { codigo: 11, codigoInterno: 'AWB', nombre: 'Air Waybill', sigla: 'AWB', descripcion: 'Guía aérea', activo: true },
  { codigo: 15, codigoInterno: 'FACT', nombre: 'Factura Comercial', sigla: 'FACT', descripcion: 'Factura de compraventa internacional', activo: true },
  { codigo: 16, codigoInterno: 'CO', nombre: 'Certificado de Origen', sigla: 'C/O', descripcion: 'Certificado que acredita origen de mercancía', activo: true },
  { codigo: 17, codigoInterno: 'LIST', nombre: 'Lista de Empaque', sigla: 'P/L', descripcion: 'Packing list o lista de contenido', activo: true },
  { codigo: 20, codigoInterno: 'MANIF', nombre: 'Manifiesto de Carga', sigla: 'MANIF', descripcion: 'Manifiesto general de carga', activo: true },
  { codigo: 30, codigoInterno: 'CERT-FIT', nombre: 'Certificado Fitosanitario', sigla: 'FIT', descripcion: 'Certificado SAG', activo: true },
  { codigo: 31, codigoInterno: 'CERT-ZOO', nombre: 'Certificado Zoosanitario', sigla: 'ZOO', descripcion: 'Certificado sanitario animal', activo: true },
  { codigo: 40, codigoInterno: 'SEG', nombre: 'Póliza de Seguro', sigla: 'SEG', descripcion: 'Póliza de seguro de transporte', activo: true },
  { codigo: 45, codigoInterno: 'RES-LIBR', nombre: 'Resolución de Liberación', sigla: 'RES', descripcion: 'Resolución que autoriza retiro de mercancía', activo: true },
  { codigo: 46, codigoInterno: 'OTR-DOC', nombre: 'Otro Documento', sigla: 'OTR', descripcion: 'Otros documentos aduaneros', activo: true },
  { codigo: 50, codigoInterno: 'ACTA', nombre: 'Acta de Fiscalización', sigla: 'ACTA', descripcion: 'Acta de fiscalización o inspección', activo: true },
  { codigo: 51, codigoInterno: 'INFORME', nombre: 'Informe de Fiscalización', sigla: 'INF', descripcion: 'Informe técnico de fiscalización', activo: true },
];

export const getTipoDocumentoAduaneroPorCodigo = (codigo: number): TipoDocumentoAduaneroExterno | undefined => {
  return tiposDocumentoAduaneroExternos.find(t => t.codigo === codigo);
};

export const getTipoDocumentoAduaneroPorCodigoInterno = (codigoInterno: string): TipoDocumentoAduaneroExterno | undefined => {
  return tiposDocumentoAduaneroExternos.find(t => t.codigoInterno === codigoInterno);
};

// ============================================
// ARTÍCULOS DE INFRACCIÓN - Mapeo de códigos
// ============================================

export interface ArticuloExterno {
  codigoExterno: string;
  codigoInterno: string;
  nombre: string;
  descripcion: string;
  tipoArticulo: 'Infraccional' | 'Penal';
  normaLegal: string;
  multaMinima?: number;
  multaMaxima?: number;
  permiteAllanamiento: boolean;
  porcentajeAllanamiento?: number;
  activo: boolean;
}

export const articulosExternos: ArticuloExterno[] = [
  // Artículos Infraccionales
  {
    codigoExterno: '4',
    codigoInterno: '4',
    nombre: 'Art. 4 - Monto No Declarado',
    descripcion: 'Diferencias de monto no declarado y retenciones asociadas',
    tipoArticulo: 'Infraccional',
    normaLegal: 'Ordenanza de Aduanas Art. 4',
    permiteAllanamiento: false,
    activo: true,
  },
  {
    codigoExterno: '16',
    codigoInterno: '16',
    nombre: 'Art. 16 - Mercancía Infractora',
    descripcion: 'Mercancía infractora en operación de salida o entrada',
    tipoArticulo: 'Infraccional',
    normaLegal: 'Ordenanza de Aduanas Art. 16',
    permiteAllanamiento: true,
    porcentajeAllanamiento: 20,
    activo: true,
  },
  {
    codigoExterno: '23',
    codigoInterno: '23',
    nombre: 'Art. 23 - Documentos Aduaneros',
    descripcion: 'Errores u omisiones en documentos de destinación aduanera',
    tipoArticulo: 'Infraccional',
    normaLegal: 'Ordenanza de Aduanas Art. 23',
    permiteAllanamiento: true,
    porcentajeAllanamiento: 20,
    activo: true,
  },
  {
    codigoExterno: '40',
    codigoInterno: '40',
    nombre: 'Art. 40 - Infracción General',
    descripcion: 'Infracción general a la normativa aduanera',
    tipoArticulo: 'Infraccional',
    normaLegal: 'Ordenanza de Aduanas Art. 40',
    permiteAllanamiento: true,
    porcentajeAllanamiento: 25,
    activo: true,
  },
  {
    codigoExterno: '168',
    codigoInterno: '168',
    nombre: 'Art. 168 - Contrabando',
    descripcion: 'Contrabando de mercancías, introducción o extracción clandestina',
    tipoArticulo: 'Infraccional',
    normaLegal: 'Ordenanza de Aduanas Art. 168',
    multaMinima: 50000,
    multaMaxima: 500000000,
    permiteAllanamiento: true,
    porcentajeAllanamiento: 50,
    activo: true,
  },
  {
    codigoExterno: '169',
    codigoInterno: '169',
    nombre: 'Art. 169 - Falsificación de Documentos',
    descripcion: 'Falsificación de documentos aduaneros, certificados de origen u otros',
    tipoArticulo: 'Infraccional',
    normaLegal: 'Ordenanza de Aduanas Art. 169',
    multaMinima: 100000,
    multaMaxima: 100000000,
    permiteAllanamiento: false,
    activo: true,
  },
  {
    codigoExterno: '174',
    codigoInterno: '174',
    nombre: 'Art. 174 - Declaración Falsa',
    descripcion: 'Declaración falsa en documentos aduaneros',
    tipoArticulo: 'Infraccional',
    normaLegal: 'Ordenanza de Aduanas Art. 174',
    multaMinima: 25000,
    multaMaxima: 50000000,
    permiteAllanamiento: true,
    porcentajeAllanamiento: 40,
    activo: true,
  },
  {
    codigoExterno: '175',
    codigoInterno: '175',
    nombre: 'Art. 175 - Documentación Incompleta',
    descripcion: 'Mercancía sin documentación aduanera completa',
    tipoArticulo: 'Infraccional',
    normaLegal: 'Ordenanza de Aduanas Art. 175',
    multaMinima: 10000,
    multaMaxima: 10000000,
    permiteAllanamiento: true,
    porcentajeAllanamiento: 50,
    activo: true,
  },
  {
    codigoExterno: '176',
    codigoInterno: '176',
    nombre: 'Art. 176 - Clasificación Arancelaria Incorrecta',
    descripcion: 'Clasificación arancelaria incorrecta',
    tipoArticulo: 'Infraccional',
    normaLegal: 'Ordenanza de Aduanas Art. 176',
    multaMinima: 50000,
    multaMaxima: 25000000,
    permiteAllanamiento: true,
    porcentajeAllanamiento: 30,
    activo: true,
  },
  {
    codigoExterno: '177',
    codigoInterno: '177',
    nombre: 'Art. 177 - Valor Aduanero Incorrecto',
    descripcion: 'Declaración de valor aduanero inferior al real',
    tipoArticulo: 'Infraccional',
    normaLegal: 'Ordenanza de Aduanas Art. 177',
    multaMinima: 50000,
    multaMaxima: 75000000,
    permiteAllanamiento: true,
    porcentajeAllanamiento: 35,
    activo: true,
  },
  {
    codigoExterno: '178',
    codigoInterno: '178',
    nombre: 'Art. 178 - Fraude Aduanero',
    descripcion: 'Fraude aduanero mediante cualquier acto u omisión',
    tipoArticulo: 'Infraccional',
    normaLegal: 'Ordenanza de Aduanas Art. 178',
    multaMinima: 100000,
    multaMaxima: 200000000,
    permiteAllanamiento: false,
    activo: true,
  },
  // Artículos Penales
  {
    codigoExterno: 'PEN-168',
    codigoInterno: 'PEN-168',
    nombre: 'Contrabando Penal',
    descripcion: 'Contrabando que constituye delito penal',
    tipoArticulo: 'Penal',
    normaLegal: 'Código Penal Art. 178',
    permiteAllanamiento: false,
    activo: true,
  },
  {
    codigoExterno: 'PEN-193',
    codigoInterno: 'PEN-193',
    nombre: 'Falsificación Documental Penal',
    descripcion: 'Falsificación de documentos públicos',
    tipoArticulo: 'Penal',
    normaLegal: 'Código Penal Art. 193',
    permiteAllanamiento: false,
    activo: true,
  },
];

export const getArticuloPorCodigoExterno = (codigo: string): ArticuloExterno | undefined => {
  return articulosExternos.find(a => a.codigoExterno === codigo);
};

// ============================================
// ETAPAS DE FORMULACIÓN - Mapeo de códigos
// ============================================

export interface EtapaFormulacionExterna {
  codigo: number;
  codigoInterno: string;
  nombre: string;
  descripcion: string;
  orden: number;
  activa: boolean;
}

export const etapasFormulacionExternas: EtapaFormulacionExterna[] = [
  { codigo: 100, codigoInterno: 'INI', nombre: 'Inicio', descripcion: 'Etapa inicial del proceso', orden: 1, activa: true },
  { codigo: 110, codigoInterno: 'ING', nombre: 'Ingreso', descripcion: 'Hallazgo ingresado al sistema', orden: 2, activa: true },
  { codigo: 120, codigoInterno: 'REV', nombre: 'Revisión', descripcion: 'En revisión por fiscalizador', orden: 3, activa: true },
  { codigo: 130, codigoInterno: 'ANA', nombre: 'Análisis', descripcion: 'En análisis jurídico', orden: 4, activa: true },
  { codigo: 140, codigoInterno: 'FORM', nombre: 'Formulación', descripcion: 'En proceso de formulación', orden: 5, activa: true },
  { codigo: 141, codigoInterno: 'FORM-REV', nombre: 'Formulación en Revisión', descripcion: 'Formulación en revisión por jefatura', orden: 6, activa: true },
  { codigo: 142, codigoInterno: 'FORM-OBS', nombre: 'Formulación Observada', descripcion: 'Formulación con observaciones', orden: 7, activa: true },
  { codigo: 143, codigoInterno: 'FORM-APR', nombre: 'Formulación Aprobada', descripcion: 'Formulación aprobada, pendiente de envío', orden: 8, activa: true },
  { codigo: 150, codigoInterno: 'ENV', nombre: 'Enviado a DECARE', descripcion: 'Enviado al sistema DECARE', orden: 9, activa: true },
  { codigo: 160, codigoInterno: 'NOTIF', nombre: 'Notificación', descripcion: 'En proceso de notificación', orden: 10, activa: true },
  { codigo: 170, codigoInterno: 'TRAM', nombre: 'Tramitación', descripcion: 'En tramitación', orden: 11, activa: true },
  { codigo: 180, codigoInterno: 'RES', nombre: 'Resolución', descripcion: 'Pendiente de resolución', orden: 12, activa: true },
  { codigo: 190, codigoInterno: 'CIE', nombre: 'Cierre', descripcion: 'Proceso cerrado', orden: 13, activa: true },
  { codigo: 200, codigoInterno: 'ARCH', nombre: 'Archivado', descripcion: 'Proceso archivado', orden: 14, activa: true },
];

export const getEtapaPorCodigoExterno = (codigo: number): EtapaFormulacionExterna | undefined => {
  return etapasFormulacionExternas.find(e => e.codigo === codigo);
};

export const getEtapaPorCodigoInterno = (codigoInterno: string): EtapaFormulacionExterna | undefined => {
  return etapasFormulacionExternas.find(e => e.codigoInterno === codigoInterno);
};

// ============================================
// TIPOS DE INFRACCIÓN - Mapeo de códigos
// ============================================

export interface TipoInfraccionExterna {
  codigo: string;
  nombre: string;
  descripcion: string;
  espenal: boolean;
}

export const tiposInfraccionExternos: TipoInfraccionExterna[] = [
  { codigo: '1', nombre: 'Infraccional', descripcion: 'Infracción administrativa aduanera', espenal: false },
  { codigo: '2', nombre: 'Penal', descripcion: 'Delito aduanero de carácter penal', espenal: true },
];

export const getTipoInfraccionPorCodigo = (codigo: string): TipoInfraccionExterna | undefined => {
  return tiposInfraccionExternos.find(t => t.codigo === codigo);
};

// ============================================
// TIPOS DE PERSONA/INFRACTOR - Mapeo de códigos
// ============================================

export interface TipoPersonaExterna {
  codigo: string;
  nombre: string;
  descripcion: string;
}

export const tiposPersonaExternos: TipoPersonaExterna[] = [
  { codigo: '1', nombre: 'Persona Natural', descripcion: 'Persona natural o física' },
  { codigo: '2', nombre: 'Persona Jurídica', descripcion: 'Persona jurídica o empresa' },
  { codigo: '3', nombre: 'Otro', descripcion: 'Otro tipo de entidad' },
];

export const getTipoPersonaPorCodigo = (codigo: string): TipoPersonaExterna | undefined => {
  return tiposPersonaExternos.find(t => t.codigo === codigo);
};

// ============================================
// COMUNAS - Catálogo básico
// ============================================

export interface ComunaExterna {
  codigo: string;
  nombre: string;
  region: string;
}

export const comunasExternas: ComunaExterna[] = [
  // Región Metropolitana
  { codigo: '13101', nombre: 'Santiago', region: 'Metropolitana' },
  { codigo: '13102', nombre: 'Cerrillos', region: 'Metropolitana' },
  { codigo: '13103', nombre: 'Cerro Navia', region: 'Metropolitana' },
  { codigo: '13104', nombre: 'Conchalí', region: 'Metropolitana' },
  { codigo: '13105', nombre: 'El Bosque', region: 'Metropolitana' },
  { codigo: '13106', nombre: 'Estación Central', region: 'Metropolitana' },
  { codigo: '13107', nombre: 'Huechuraba', region: 'Metropolitana' },
  { codigo: '13108', nombre: 'Independencia', region: 'Metropolitana' },
  { codigo: '13109', nombre: 'La Cisterna', region: 'Metropolitana' },
  { codigo: '13110', nombre: 'La Florida', region: 'Metropolitana' },
  { codigo: '13111', nombre: 'La Granja', region: 'Metropolitana' },
  { codigo: '13112', nombre: 'La Pintana', region: 'Metropolitana' },
  { codigo: '13113', nombre: 'La Reina', region: 'Metropolitana' },
  { codigo: '13114', nombre: 'Las Condes', region: 'Metropolitana' },
  { codigo: '13115', nombre: 'Lo Barnechea', region: 'Metropolitana' },
  { codigo: '13116', nombre: 'Lo Espejo', region: 'Metropolitana' },
  { codigo: '13117', nombre: 'Lo Prado', region: 'Metropolitana' },
  { codigo: '13118', nombre: 'Macul', region: 'Metropolitana' },
  { codigo: '13119', nombre: 'Maipú', region: 'Metropolitana' },
  { codigo: '13120', nombre: 'Ñuñoa', region: 'Metropolitana' },
  { codigo: '13121', nombre: 'Pedro Aguirre Cerda', region: 'Metropolitana' },
  { codigo: '13122', nombre: 'Peñalolén', region: 'Metropolitana' },
  { codigo: '13123', nombre: 'Providencia', region: 'Metropolitana' },
  { codigo: '13124', nombre: 'Pudahuel', region: 'Metropolitana' },
  { codigo: '13125', nombre: 'Quilicura', region: 'Metropolitana' },
  { codigo: '13126', nombre: 'Quinta Normal', region: 'Metropolitana' },
  { codigo: '13127', nombre: 'Recoleta', region: 'Metropolitana' },
  { codigo: '13128', nombre: 'Renca', region: 'Metropolitana' },
  { codigo: '13129', nombre: 'San Joaquín', region: 'Metropolitana' },
  { codigo: '13130', nombre: 'San Miguel', region: 'Metropolitana' },
  { codigo: '13131', nombre: 'San Ramón', region: 'Metropolitana' },
  { codigo: '13132', nombre: 'Vitacura', region: 'Metropolitana' },
  // Valparaíso
  { codigo: '05101', nombre: 'Valparaíso', region: 'Valparaíso' },
  { codigo: '05102', nombre: 'Viña del Mar', region: 'Valparaíso' },
  { codigo: '05103', nombre: 'Quilpué', region: 'Valparaíso' },
  { codigo: '05104', nombre: 'Villa Alemana', region: 'Valparaíso' },
  // Antofagasta
  { codigo: '02101', nombre: 'Antofagasta', region: 'Antofagasta' },
  { codigo: '02102', nombre: 'Mejillones', region: 'Antofagasta' },
  { codigo: '02201', nombre: 'Calama', region: 'Antofagasta' },
];

export const getComunaPorCodigo = (codigo: string): ComunaExterna | undefined => {
  return comunasExternas.find(c => c.codigo === codigo);
};

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Obtiene el nombre de una aduana por código externo
 */
export const getNombreAduanaPorCodigoExterno = (codigo: string): string => {
  const aduana = getAduanaPorCodigoExterno(codigo);
  return aduana?.nombre || `Aduana ${codigo}`;
};

/**
 * Obtiene el nombre de una sección por código externo
 */
export const getNombreSeccionPorCodigoExterno = (codigo: string): string => {
  const seccion = getSeccionPorCodigoExterno(codigo);
  return seccion?.nombre || `Sección ${codigo}`;
};

/**
 * Obtiene el nombre del tipo de identificador por código
 */
export const getNombreTipoIdentificadorPorCodigo = (codigo: number): string => {
  const tipo = getTipoIdentificadorPorCodigo(codigo);
  return tipo?.nombre || `Tipo ${codigo}`;
};

/**
 * Valida si un código de aduana externo es válido
 */
export const esCodigoAduanaValido = (codigo: string): boolean => {
  return aduanasExternas.some(a => a.codigoExterno === codigo && a.activa);
};

/**
 * Valida si un código de artículo externo es válido
 */
export const esCodigoArticuloValido = (codigo: string): boolean => {
  return articulosExternos.some(a => a.codigoExterno === codigo && a.activo);
};
