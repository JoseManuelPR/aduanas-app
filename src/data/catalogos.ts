/**
 * Catálogos del sistema - Datos maestros
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import type { 
  Aduana, 
  Seccion, 
  Articulo, 
  TipoDocumentoAduanero,
  EtapaFormulacion,
  Denunciante,
  Moneda 
} from './types';

// ============================================
// ADUANAS
// ============================================

export const aduanas: Aduana[] = [
  { id: 'adu-001', codigo: '901', nombre: 'Valparaíso', region: 'Valparaíso' },
  { id: 'adu-002', codigo: '902', nombre: 'Santiago', region: 'Metropolitana' },
  { id: 'adu-003', codigo: '903', nombre: 'Antofagasta', region: 'Antofagasta' },
  { id: 'adu-004', codigo: '904', nombre: 'Iquique', region: 'Tarapacá' },
  { id: 'adu-005', codigo: '905', nombre: 'Los Andes', region: 'Valparaíso' },
  { id: 'adu-006', codigo: '906', nombre: 'Arica', region: 'Arica y Parinacota' },
  { id: 'adu-007', codigo: '907', nombre: 'Talcahuano', region: 'Biobío' },
  { id: 'adu-008', codigo: '908', nombre: 'Puerto Montt', region: 'Los Lagos' },
  { id: 'adu-009', codigo: '909', nombre: 'Punta Arenas', region: 'Magallanes' },
  { id: 'adu-010', codigo: '910', nombre: 'Coyhaique', region: 'Aysén' },
  { id: 'adu-011', codigo: '911', nombre: 'Osorno', region: 'Los Lagos' },
  { id: 'adu-012', codigo: '912', nombre: 'Temuco', region: 'Araucanía' },
];

export const getAduanaPorCodigo = (codigo: string) => 
  aduanas.find(a => a.codigo === codigo);

export const getAduanaPorNombre = (nombre: string) => 
  aduanas.find(a => a.nombre === nombre);

// ============================================
// SECCIONES
// ============================================

export const secciones: Seccion[] = [
  { id: 'sec-001', codigo: 'FISC', nombre: 'Fiscalización', aduanaCodigo: '901' },
  { id: 'sec-002', codigo: 'FISC-OP', nombre: 'Fiscalización Operativa', aduanaCodigo: '901' },
  { id: 'sec-003', codigo: 'FISC-PD', nombre: 'Fiscalización Post-Despacho', aduanaCodigo: '901' },
  { id: 'sec-004', codigo: 'FISC-DOC', nombre: 'Fiscalización Documental', aduanaCodigo: '901' },
  { id: 'sec-005', codigo: 'FISC-ZP', nombre: 'Fiscalización Zona Primaria', aduanaCodigo: '901' },
  { id: 'sec-006', codigo: 'FISC-TER', nombre: 'Fiscalización Terrestre', aduanaCodigo: '905' },
  { id: 'sec-007', codigo: 'FISC-EXP', nombre: 'Fiscalización Exportaciones', aduanaCodigo: '903' },
  { id: 'sec-008', codigo: 'JUR', nombre: 'Jurídico', aduanaCodigo: '901' },
  { id: 'sec-009', codigo: 'CONT', nombre: 'Control Interno', aduanaCodigo: '901' },
  { id: 'sec-010', codigo: 'ADMIN', nombre: 'Administración', aduanaCodigo: '901' },
];

export const getSeccionesPorAduana = (aduanaCodigo: string) =>
  secciones.filter(s => s.aduanaCodigo === aduanaCodigo);

// ============================================
// ARTÍCULOS (ORDENANZA DE ADUANAS)
// ============================================

export const articulos: Articulo[] = [
  // Artículos Infraccionales
  {
    id: 'art-168',
    codigo: '168',
    nombre: 'Art. 168 - Contrabando',
    descripcion: 'Contrabando de mercancías, introducción o extracción clandestina de mercancías',
    tipoArticulo: 'Infraccional',
    multaMinima: 50000,
    multaMaxima: 500000000,
    permiteAllanamiento: true,
    porcentajeAllanamiento: 50,
    normaLegal: 'Ordenanza de Aduanas Art. 168',
    vigente: true,
  },
  {
    id: 'art-169',
    codigo: '169',
    nombre: 'Art. 169 - Falsificación de Documentos',
    descripcion: 'Falsificación de documentos aduaneros, certificados de origen u otros',
    tipoArticulo: 'Infraccional',
    multaMinima: 100000,
    multaMaxima: 100000000,
    permiteAllanamiento: false,
    normaLegal: 'Ordenanza de Aduanas Art. 169',
    vigente: true,
  },
  {
    id: 'art-174',
    codigo: '174',
    nombre: 'Art. 174 - Declaración Falsa',
    descripcion: 'Declaración falsa en documentos aduaneros, diferencias de cantidad, calidad o valor',
    tipoArticulo: 'Infraccional',
    multaMinima: 25000,
    multaMaxima: 50000000,
    permiteAllanamiento: true,
    porcentajeAllanamiento: 40,
    normaLegal: 'Ordenanza de Aduanas Art. 174',
    vigente: true,
  },
  {
    id: 'art-175',
    codigo: '175',
    nombre: 'Art. 175 - Documentación Incompleta',
    descripcion: 'Mercancía sin documentación aduanera completa o válida',
    tipoArticulo: 'Infraccional',
    multaMinima: 10000,
    multaMaxima: 10000000,
    permiteAllanamiento: true,
    porcentajeAllanamiento: 50,
    normaLegal: 'Ordenanza de Aduanas Art. 175',
    vigente: true,
  },
  {
    id: 'art-176',
    codigo: '176',
    nombre: 'Art. 176 - Clasificación Arancelaria Incorrecta',
    descripcion: 'Clasificación arancelaria incorrecta que resulte en menor pago de derechos',
    tipoArticulo: 'Infraccional',
    multaMinima: 50000,
    multaMaxima: 25000000,
    permiteAllanamiento: true,
    porcentajeAllanamiento: 30,
    normaLegal: 'Ordenanza de Aduanas Art. 176',
    vigente: true,
  },
  {
    id: 'art-177',
    codigo: '177',
    nombre: 'Art. 177 - Valor Aduanero Incorrecto',
    descripcion: 'Declaración de valor aduanero inferior al real, subfacturación',
    tipoArticulo: 'Infraccional',
    multaMinima: 50000,
    multaMaxima: 75000000,
    permiteAllanamiento: true,
    porcentajeAllanamiento: 35,
    normaLegal: 'Ordenanza de Aduanas Art. 177',
    vigente: true,
  },
  {
    id: 'art-178',
    codigo: '178',
    nombre: 'Art. 178 - Fraude Aduanero',
    descripcion: 'Fraude aduanero mediante cualquier acto u omisión',
    tipoArticulo: 'Infraccional',
    multaMinima: 100000,
    multaMaxima: 200000000,
    permiteAllanamiento: false,
    normaLegal: 'Ordenanza de Aduanas Art. 178',
    vigente: true,
  },
  // Artículos Penales
  {
    id: 'art-pen-168',
    codigo: 'PEN-168',
    nombre: 'Contrabando Penal',
    descripcion: 'Contrabando que constituye delito penal por monto o circunstancias agravantes',
    tipoArticulo: 'Penal',
    permiteAllanamiento: false,
    normaLegal: 'Código Penal Art. 178',
    vigente: true,
  },
  {
    id: 'art-pen-193',
    codigo: 'PEN-193',
    nombre: 'Falsificación Documental Penal',
    descripcion: 'Falsificación de documentos públicos con fines aduaneros',
    tipoArticulo: 'Penal',
    permiteAllanamiento: false,
    normaLegal: 'Código Penal Art. 193',
    vigente: true,
  },
  {
    id: 'art-pen-97',
    codigo: 'PEN-97',
    nombre: 'Evasión Tributaria',
    descripcion: 'Evasión de derechos e impuestos aduaneros',
    tipoArticulo: 'Penal',
    permiteAllanamiento: false,
    normaLegal: 'DL 825 Art. 97',
    vigente: true,
  },
];

export const getArticuloPorCodigo = (codigo: string) =>
  articulos.find(a => a.codigo === codigo);

export const getArticulosPorTipo = (tipo: 'Infraccional' | 'Penal') =>
  articulos.filter(a => a.tipoArticulo === tipo && a.vigente);

export const getArticulosInfraccionales = () =>
  articulos.filter(a => a.tipoArticulo === 'Infraccional' && a.vigente);

export const getArticulosPenales = () =>
  articulos.filter(a => a.tipoArticulo === 'Penal' && a.vigente);

// ============================================
// TIPOS DE DOCUMENTO ADUANERO
// ============================================

export const tiposDocumentoAduanero: TipoDocumentoAduanero[] = [
  { id: 'tda-001', codigo: 'DIN', nombre: 'Declaración de Ingreso', sigla: 'DIN' },
  { id: 'tda-002', codigo: 'DUS', nombre: 'Declaración Única de Salida', sigla: 'DUS' },
  { id: 'tda-003', codigo: 'MIC-DTA', nombre: 'Manifiesto Internacional de Carga/Declaración de Tránsito Aduanero', sigla: 'MIC/DTA' },
  { id: 'tda-004', codigo: 'DAT', nombre: 'Declaración de Admisión Temporal', sigla: 'DAT' },
  { id: 'tda-005', codigo: 'DI', nombre: 'Declaración de Importación', sigla: 'DI' },
  { id: 'tda-006', codigo: 'BL', nombre: 'Bill of Lading', sigla: 'B/L' },
  { id: 'tda-007', codigo: 'AWB', nombre: 'Air Waybill', sigla: 'AWB' },
  { id: 'tda-008', codigo: 'FACT', nombre: 'Factura Comercial', sigla: 'FACT' },
  { id: 'tda-009', codigo: 'CO', nombre: 'Certificado de Origen', sigla: 'C/O' },
  { id: 'tda-010', codigo: 'LIST', nombre: 'Lista de Empaque', sigla: 'P/L' },
];

// ============================================
// ETAPAS DE FORMULACIÓN
// ============================================

export const etapasFormulacion: EtapaFormulacion[] = [
  { id: 'etf-001', codigo: 'INICIAL', nombre: 'Formulación Inicial', orden: 1 },
  { id: 'etf-002', codigo: 'REVISION', nombre: 'En Revisión', orden: 2 },
  { id: 'etf-003', codigo: 'APROBACION', nombre: 'Pendiente Aprobación', orden: 3 },
  { id: 'etf-004', codigo: 'FORMALIZADA', nombre: 'Formalizada', orden: 4 },
  { id: 'etf-005', codigo: 'NOTIFICACION', nombre: 'En Notificación', orden: 5 },
  { id: 'etf-006', codigo: 'TRAMITACION', nombre: 'En Tramitación', orden: 6 },
  { id: 'etf-007', codigo: 'CIERRE', nombre: 'Cierre', orden: 7 },
];

// ============================================
// DENUNCIANTES (para denuncias penales)
// ============================================

export const denunciantes: Denunciante[] = [
  { id: 'den-001', codigo: 'SNA', nombre: 'Servicio Nacional de Aduanas', tipo: 'Institución' },
  { id: 'den-002', codigo: 'PDI', nombre: 'Policía de Investigaciones', tipo: 'Institución' },
  { id: 'den-003', codigo: 'CAR', nombre: 'Carabineros de Chile', tipo: 'Institución' },
  { id: 'den-004', codigo: 'SII', nombre: 'Servicio de Impuestos Internos', tipo: 'Institución' },
  { id: 'den-005', codigo: 'MP', nombre: 'Ministerio Público', tipo: 'Institución' },
  { id: 'den-006', codigo: 'PART', nombre: 'Particular', tipo: 'Persona' },
  { id: 'den-007', codigo: 'ANON', nombre: 'Anónimo', tipo: 'Anónimo' },
];

// ============================================
// MONEDAS
// ============================================

export const monedas: Moneda[] = [
  { id: 'mon-001', codigo: 'CLP', nombre: 'Peso Chileno', simbolo: '$' },
  { id: 'mon-002', codigo: 'USD', nombre: 'Dólar Estadounidense', simbolo: 'US$' },
  { id: 'mon-003', codigo: 'EUR', nombre: 'Euro', simbolo: '€' },
  { id: 'mon-004', codigo: 'CNY', nombre: 'Yuan Chino', simbolo: '¥' },
  { id: 'mon-005', codigo: 'JPY', nombre: 'Yen Japonés', simbolo: '¥' },
  { id: 'mon-006', codigo: 'GBP', nombre: 'Libra Esterlina', simbolo: '£' },
];

// ============================================
// TIPOS DE INFRACCIÓN (simplificado)
// ============================================

export const tiposInfraccion = [
  { id: 'ti-001', codigo: 'CONTRABANDO', nombre: 'Contrabando' },
  { id: 'ti-002', codigo: 'DEC_FALSA', nombre: 'Declaración Falsa' },
  { id: 'ti-003', codigo: 'FRAUDE', nombre: 'Fraude Aduanero' },
  { id: 'ti-004', codigo: 'CLASIF', nombre: 'Clasificación Incorrecta' },
  { id: 'ti-005', codigo: 'VALOR', nombre: 'Valor Incorrecto' },
  { id: 'ti-006', codigo: 'DOC', nombre: 'Documentación Incompleta' },
  { id: 'ti-007', codigo: 'FALSIF', nombre: 'Falsificación Documental' },
  { id: 'ti-008', codigo: 'EVASION', nombre: 'Evasión Tributaria' },
  { id: 'ti-009', codigo: 'OTRO', nombre: 'Otros' },
];

// ============================================
// ESTADOS PARA SELECTS
// ============================================

export const estadosDenuncia = [
  { value: 'Borrador', label: 'Borrador', color: 'gray' },
  { value: 'Ingresada', label: 'Ingresada', color: 'blue' },
  { value: 'En Revisión', label: 'En Revisión', color: 'yellow' },
  { value: 'Formulada', label: 'Formulada', color: 'indigo' },
  { value: 'Notificada', label: 'Notificada', color: 'purple' },
  { value: 'En Proceso', label: 'En Proceso', color: 'orange' },
  { value: 'Observada', label: 'Observada', color: 'red' },
  { value: 'Allanada', label: 'Allanada', color: 'teal' },
  { value: 'Reclamada', label: 'Reclamada', color: 'pink' },
  { value: 'Cerrada', label: 'Cerrada', color: 'green' },
  { value: 'Archivada', label: 'Archivada', color: 'slate' },
];

export const tiposInvolucrado = [
  { value: 'Infractor Principal', label: 'Infractor Principal' },
  { value: 'Infractor Secundario', label: 'Infractor Secundario' },
  { value: 'Responsable Solidario', label: 'Responsable Solidario' },
  { value: 'Agente de Aduanas', label: 'Agente de Aduanas' },
  { value: 'Importador', label: 'Importador' },
  { value: 'Exportador', label: 'Exportador' },
  { value: 'Transportista', label: 'Transportista' },
];

// ============================================
// USUARIOS (para compatibilidad)
// ============================================

import type { Usuario } from './types';

export const usuarios: Usuario[] = [
  { id: 'usr-001', rut: '12.345.678-9', nombre: 'Juan Rodríguez', email: 'jrodriguez@aduana.cl', rol: 'Funcionario Fiscalizador', aduana: 'Valparaíso', activo: true },
  { id: 'usr-002', rut: '13.456.789-0', nombre: 'María González', email: 'mgonzalez@aduana.cl', rol: 'Funcionario Fiscalizador', aduana: 'Santiago', activo: true },
  { id: 'usr-003', rut: '14.567.890-1', nombre: 'Carlos Pérez', email: 'cperez@aduana.cl', rol: 'Funcionario Fiscalizador', aduana: 'Antofagasta', activo: true },
  { id: 'usr-004', rut: '15.678.901-2', nombre: 'Ana Martínez', email: 'amartinez@aduana.cl', rol: 'Jefe de Sección', aduana: 'Iquique', activo: true },
  { id: 'usr-005', rut: '16.789.012-3', nombre: 'Pedro López', email: 'plopez@aduana.cl', rol: 'Funcionario Fiscalizador', aduana: 'Los Andes', activo: true },
  { id: 'usr-006', rut: '17.890.123-4', nombre: 'Laura Soto', email: 'lsoto@aduana.cl', rol: 'Administrador', aduana: 'Valparaíso', activo: true },
  { id: 'usr-007', rut: '18.901.234-5', nombre: 'Diego Vargas', email: 'dvargas@aduana.cl', rol: 'Abogado', aduana: 'Santiago', activo: true },
  { id: 'usr-008', rut: '19.012.345-6', nombre: 'Carmen Silva', email: 'csilva@aduana.cl', rol: 'Auditor', aduana: 'Valparaíso', activo: true },
];

export const getUsuarioPorRut = (rut: string) =>
  usuarios.find(u => u.rut === rut);

export const getUsuariosPorAduana = (aduana: string) =>
  usuarios.filter(u => u.aduana === aduana);

export const getUsuariosPorRol = (rol: Usuario['rol']) =>
  usuarios.filter(u => u.rol === rol);

export const getNombresAduanas = () =>
  aduanas.map(a => a.nombre);

export const getNombresTiposInfraccion = () =>
  tiposInfraccion.map(t => t.nombre);
