/**
 * Base de datos mock - Hallazgos (PFI)
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import type { Hallazgo } from './types';

export const hallazgos: Hallazgo[] = [
  {
    id: "h-001",
    numeroHallazgo: "PFI-123",
    fechaIngreso: "15-11-2025",
    estado: "Notificar Denuncia",
    tipoHallazgo: "Infraccional",
    aduana: "Valparaíso",
    rutInvolucrado: "76.123.456-7",
    nombreInvolucrado: "Importadora Global S.A.",
    descripcion: "Diferencias en declaración de mercancías. Se detectaron inconsistencias entre las cantidades declaradas en la DIN y las efectivamente importadas durante fiscalización de zona primaria.",
    montoEstimado: "$12.500.000",
    diasVencimiento: 5,
    funcionarioAsignado: "Juan Rodríguez",
    datosDenuncia: {
      seccion: "Fiscalización",
      tipoInfraccion: "Declaración Falsa",
      normaInfringida: "Art. 174 Ordenanza de Aduanas",
      fundamentoLegal: "Ley 18.483 Art. 168",
      mercanciaInvolucrada: "Equipos electrónicos - Notebooks y tablets",
      direccionInvolucrado: "Av. Argentina 1234, Valparaíso",
      emailInvolucrado: "legal@importadoraglobal.cl",
      telefonoInvolucrado: "+56 32 2456789",
      representanteLegal: "Roberto Sánchez Muñoz",
      codigoAgente: "AGT-0156",
      nombreAgente: "Agencia de Aduanas Pacífico Sur",
      documentoAduanero: "6020-24-0012345",
      tipoDocumento: "DIN - Declaración de Ingreso",
      documentosAdjuntos: [
        { id: "doc-001", nombre: "declaracion_importacion.pdf", tipo: "pdf", tamanio: "2.4 MB", fechaSubida: "15-11-2025" },
        { id: "doc-002", nombre: "acta_fiscalizacion.pdf", tipo: "pdf", tamanio: "1.8 MB", fechaSubida: "15-11-2025" },
        { id: "doc-003", nombre: "foto_mercancia.jpg", tipo: "jpg", tamanio: "3.2 MB", fechaSubida: "15-11-2025" },
      ],
    },
  },
  {
    id: "h-002",
    numeroHallazgo: "PFI-124",
    fechaIngreso: "10-11-2025",
    estado: "En Análisis",
    tipoHallazgo: "Penal",
    aduana: "Santiago",
    rutInvolucrado: "77.987.654-3",
    nombreInvolucrado: "Comercial Los Andes Ltda.",
    descripcion: "Sospecha de contrabando de mercancías. Detección de contenedor con doble fondo conteniendo mercancías no declaradas durante inspección rutinaria.",
    montoEstimado: "$45.000.000",
    diasVencimiento: -2,
    funcionarioAsignado: "María González",
    datosDenuncia: {
      seccion: "Fiscalización Operativa",
      tipoInfraccion: "Contrabando",
      normaInfringida: "Art. 168 Ordenanza de Aduanas",
      fundamentoLegal: "Código Penal Art. 178",
      mercanciaInvolucrada: "Textiles y confecciones de origen asiático",
      direccionInvolucrado: "Camino a Melipilla 5678, Maipú, Santiago",
      emailInvolucrado: "contacto@losandes.cl",
      telefonoInvolucrado: "+56 2 27896543",
      representanteLegal: "Carmen Torres Vidal",
      codigoAgente: "AGT-0234",
      nombreAgente: "Despachadora Central Ltda.",
      documentoAduanero: "6020-24-0034567",
      tipoDocumento: "DIN - Declaración de Ingreso",
      documentosAdjuntos: [
        { id: "doc-004", nombre: "informe_contenedor.pdf", tipo: "pdf", tamanio: "4.1 MB", fechaSubida: "10-11-2025" },
        { id: "doc-005", nombre: "fotos_inspeccion.pdf", tipo: "pdf", tamanio: "8.5 MB", fechaSubida: "10-11-2025" },
      ],
    },
  },
  {
    id: "h-003",
    numeroHallazgo: "PFI-125",
    fechaIngreso: "20-11-2025",
    estado: "Ingresado",
    tipoHallazgo: "Infraccional",
    aduana: "Antofagasta",
    rutInvolucrado: "80.456.123-5",
    nombreInvolucrado: "Minera del Norte SpA",
    descripcion: "Clasificación arancelaria incorrecta. Se detectó que maquinaria industrial fue declarada bajo partida arancelaria de menor arancel.",
    montoEstimado: "$8.750.000",
    diasVencimiento: 15,
    funcionarioAsignado: "Carlos Pérez",
    datosDenuncia: {
      seccion: "Fiscalización Post-Despacho",
      tipoInfraccion: "Clasificación Incorrecta",
      normaInfringida: "Art. 176 Ordenanza de Aduanas",
      fundamentoLegal: "Ley 18.525 Art. 12",
      mercanciaInvolucrada: "Maquinaria minera - Chancadores y molinos",
      direccionInvolucrado: "Av. Angamos 2345, Antofagasta",
      emailInvolucrado: "comercio@mineranorte.cl",
      telefonoInvolucrado: "+56 55 2345678",
      representanteLegal: "Fernando Díaz Campos",
      documentoAduanero: "6020-24-0056789",
      tipoDocumento: "DIN - Declaración de Ingreso",
      documentosAdjuntos: [
        { id: "doc-006", nombre: "analisis_arancelario.pdf", tipo: "pdf", tamanio: "1.2 MB", fechaSubida: "20-11-2025" },
        { id: "doc-007", nombre: "factura_proveedor.pdf", tipo: "pdf", tamanio: "0.8 MB", fechaSubida: "20-11-2025" },
      ],
    },
  },
  {
    id: "h-004",
    numeroHallazgo: "PFI-126",
    fechaIngreso: "05-11-2025",
    estado: "Derivado",
    tipoHallazgo: "Penal",
    aduana: "Iquique",
    rutInvolucrado: "81.321.654-9",
    nombreInvolucrado: "Zona Franca del Pacífico",
    descripcion: "Falsificación de documentos de origen. Certificados de origen asiáticos presentan inconsistencias que sugieren falsificación.",
    montoEstimado: "$67.300.000",
    diasVencimiento: 0,
    funcionarioAsignado: "Ana Martínez",
    datosDenuncia: {
      seccion: "Fiscalización Documental",
      tipoInfraccion: "Falsificación Documental",
      normaInfringida: "Art. 169 Ordenanza de Aduanas",
      fundamentoLegal: "Código Penal Art. 193",
      mercanciaInvolucrada: "Electrodomésticos línea blanca",
      direccionInvolucrado: "Zofri Galpón 12, Iquique",
      emailInvolucrado: "admin@zfpacifico.cl",
      telefonoInvolucrado: "+56 57 2567890",
      representanteLegal: "Patricia Morales Ruiz",
      codigoAgente: "AGT-0567",
      nombreAgente: "Agencia Norte Ltda.",
      documentoAduanero: "6020-24-0078901",
      tipoDocumento: "DIN - Declaración de Ingreso",
      documentosAdjuntos: [
        { id: "doc-008", nombre: "certificados_origen.pdf", tipo: "pdf", tamanio: "3.5 MB", fechaSubida: "05-11-2025" },
        { id: "doc-009", nombre: "informe_pericial.pdf", tipo: "pdf", tamanio: "2.1 MB", fechaSubida: "05-11-2025" },
        { id: "doc-010", nombre: "respuesta_consulado.pdf", tipo: "pdf", tamanio: "0.9 MB", fechaSubida: "06-11-2025" },
      ],
    },
  },
  {
    id: "h-005",
    numeroHallazgo: "PFI-127",
    fechaIngreso: "28-10-2025",
    estado: "Cerrado",
    tipoHallazgo: "Infraccional",
    aduana: "Los Andes",
    rutInvolucrado: "79.147.258-6",
    nombreInvolucrado: "Transportes Cordillera Ltda.",
    descripcion: "Error en valor declarado. Se regularizó diferencia de valor FOB por ajuste de tipo de cambio.",
    montoEstimado: "$3.450.000",
    diasVencimiento: 30,
    funcionarioAsignado: "Pedro López",
    datosDenuncia: {
      seccion: "Fiscalización Terrestre",
      tipoInfraccion: "Valor Incorrecto",
      normaInfringida: "Art. 177 Ordenanza de Aduanas",
      fundamentoLegal: "Acuerdo OMC Valoración Aduanera",
      mercanciaInvolucrada: "Repuestos automotrices",
      direccionInvolucrado: "Ruta 60 CH Km 85, Los Andes",
      emailInvolucrado: "operaciones@cordillera.cl",
      telefonoInvolucrado: "+56 34 2123456",
      documentoAduanero: "6020-24-0023456",
      tipoDocumento: "MIC/DTA",
      documentosAdjuntos: [
        { id: "doc-011", nombre: "mic_dta_original.pdf", tipo: "pdf", tamanio: "1.5 MB", fechaSubida: "28-10-2025" },
      ],
    },
  },
  {
    id: "h-006",
    numeroHallazgo: "PFI-128",
    fechaIngreso: "12-11-2025",
    estado: "En Análisis",
    tipoHallazgo: "Penal",
    aduana: "Valparaíso",
    rutInvolucrado: "76.852.963-1",
    nombreInvolucrado: "Distribuidora Nacional S.A.",
    descripcion: "Posible subfacturación sistemática. Análisis de precios revela patrones de subfacturación en múltiples operaciones durante el último año.",
    montoEstimado: "$89.500.000",
    diasVencimiento: 8,
    funcionarioAsignado: "Juan Rodríguez",
    datosDenuncia: {
      seccion: "Fiscalización Post-Despacho",
      tipoInfraccion: "Fraude Aduanero",
      normaInfringida: "Art. 168 Ordenanza de Aduanas",
      fundamentoLegal: "Ley 18.483 Art. 172",
      mercanciaInvolucrada: "Productos de consumo masivo - Alimentos y bebidas",
      direccionInvolucrado: "Av. España 789, Valparaíso",
      emailInvolucrado: "legal@distribuidoranacional.cl",
      telefonoInvolucrado: "+56 32 2654321",
      representanteLegal: "Miguel Ángel Fuentes",
      codigoAgente: "AGT-0189",
      nombreAgente: "Aduanas y Comercio Exterior SpA",
      documentoAduanero: "6020-24-0045678",
      tipoDocumento: "DIN - Declaración de Ingreso",
      documentosAdjuntos: [
        { id: "doc-012", nombre: "analisis_precios.xlsx", tipo: "xls", tamanio: "2.8 MB", fechaSubida: "12-11-2025" },
        { id: "doc-013", nombre: "comparativo_mercado.pdf", tipo: "pdf", tamanio: "1.9 MB", fechaSubida: "12-11-2025" },
        { id: "doc-014", nombre: "historial_importaciones.xlsx", tipo: "xls", tamanio: "4.2 MB", fechaSubida: "12-11-2025" },
      ],
    },
  },
  {
    id: "h-007",
    numeroHallazgo: "PFI-129",
    fechaIngreso: "18-11-2025",
    estado: "Ingresado",
    tipoHallazgo: "Infraccional",
    aduana: "Santiago",
    rutInvolucrado: "78.456.789-0",
    nombreInvolucrado: "Importaciones del Sur Ltda.",
    descripcion: "Mercancía sin documentación. Carga arribada sin BL original ni factura comercial válida.",
    montoEstimado: "$15.200.000",
    diasVencimiento: 12,
    funcionarioAsignado: "María González",
    datosDenuncia: {
      seccion: "Fiscalización Zona Primaria",
      tipoInfraccion: "Documentación Incompleta",
      normaInfringida: "Art. 175 Ordenanza de Aduanas",
      fundamentoLegal: "Compendio Normas Aduaneras Cap. II",
      mercanciaInvolucrada: "Materiales de construcción - Acero y fierro",
      direccionInvolucrado: "Av. Presidente Riesco 5432, Las Condes",
      emailInvolucrado: "importaciones@delsur.cl",
      telefonoInvolucrado: "+56 2 29876543",
      representanteLegal: "Andrea Paz González",
      documentoAduanero: "6020-24-0067890",
      tipoDocumento: "DIN - Declaración de Ingreso",
      documentosAdjuntos: [
        { id: "doc-015", nombre: "acta_retencion.pdf", tipo: "pdf", tamanio: "0.7 MB", fechaSubida: "18-11-2025" },
      ],
    },
  },
  {
    id: "h-008",
    numeroHallazgo: "PFI-130",
    fechaIngreso: "22-11-2025",
    estado: "Notificar Denuncia",
    tipoHallazgo: "Penal",
    aduana: "Antofagasta",
    rutInvolucrado: "80.159.753-2",
    nombreInvolucrado: "Exportaciones Mineras SpA",
    descripcion: "Evasión de derechos aduaneros. Exportación de concentrado de cobre sin declarar contenido de metales preciosos (oro y plata).",
    montoEstimado: "$125.000.000",
    diasVencimiento: 3,
    funcionarioAsignado: "Carlos Pérez",
    datosDenuncia: {
      seccion: "Fiscalización Exportaciones",
      tipoInfraccion: "Evasión Tributaria",
      normaInfringida: "Art. 168 Ordenanza de Aduanas",
      fundamentoLegal: "DL 825 Art. 97",
      mercanciaInvolucrada: "Concentrado de cobre con contenido de Au y Ag",
      direccionInvolucrado: "Av. Balmaceda 1234, Antofagasta",
      emailInvolucrado: "exportaciones@expomineras.cl",
      telefonoInvolucrado: "+56 55 2789012",
      representanteLegal: "Gonzalo Vera Pizarro",
      codigoAgente: "AGT-0345",
      nombreAgente: "Servicios Aduaneros Norte Grande",
      documentoAduanero: "6020-24-0089012",
      tipoDocumento: "DUS - Declaración Única de Salida",
      documentosAdjuntos: [
        { id: "doc-016", nombre: "analisis_laboratorio.pdf", tipo: "pdf", tamanio: "2.3 MB", fechaSubida: "22-11-2025" },
        { id: "doc-017", nombre: "informe_fiscalizacion.pdf", tipo: "pdf", tamanio: "3.8 MB", fechaSubida: "22-11-2025" },
        { id: "doc-018", nombre: "declaracion_exportacion.pdf", tipo: "pdf", tamanio: "1.1 MB", fechaSubida: "22-11-2025" },
        { id: "doc-019", nombre: "certificado_embarque.pdf", tipo: "pdf", tamanio: "0.6 MB", fechaSubida: "22-11-2025" },
      ],
    },
  },
];

// ============================================
// FUNCIONES HELPER PARA HALLAZGOS
// ============================================

export const getHallazgoPorNumero = (numero: string) => 
  hallazgos.find(h => h.numeroHallazgo === numero);

export const getHallazgoPorId = (id: string) =>
  hallazgos.find(h => h.id === id);

export const getHallazgosPorEstado = (estado: Hallazgo['estado']) =>
  hallazgos.filter(h => h.estado === estado);

export const getHallazgosPorTipo = (tipo: Hallazgo['tipoHallazgo']) =>
  hallazgos.filter(h => h.tipoHallazgo === tipo);

export const getHallazgosVencidos = () =>
  hallazgos.filter(h => h.diasVencimiento < 0);

export const getHallazgosPorVencer = (dias: number = 5) =>
  hallazgos.filter(h => h.diasVencimiento >= 0 && h.diasVencimiento <= dias);

// Obtener hallazgos que pueden ser gestionados (convertidos a denuncia)
export const getHallazgosGestionables = () =>
  hallazgos.filter(h => 
    h.estado === 'Notificar Denuncia' || 
    h.estado === 'En Análisis' || 
    h.estado === 'Ingresado'
  );

export const getConteoHallazgos = () => ({
  total: hallazgos.length,
  porEstado: {
    ingresado: hallazgos.filter(h => h.estado === 'Ingresado').length,
    enAnalisis: hallazgos.filter(h => h.estado === 'En Análisis').length,
    notificarDenuncia: hallazgos.filter(h => h.estado === 'Notificar Denuncia').length,
    derivado: hallazgos.filter(h => h.estado === 'Derivado').length,
    cerrado: hallazgos.filter(h => h.estado === 'Cerrado').length,
    convertidoADenuncia: hallazgos.filter(h => h.estado === 'Convertido a Denuncia').length,
  },
  porTipo: {
    infraccional: hallazgos.filter(h => h.tipoHallazgo === 'Infraccional').length,
    penal: hallazgos.filter(h => h.tipoHallazgo === 'Penal').length,
  },
  vencidos: hallazgos.filter(h => h.diasVencimiento < 0).length,
  porVencer: hallazgos.filter(h => h.diasVencimiento >= 0 && h.diasVencimiento <= 5).length,
  gestionables: hallazgos.filter(h => 
    h.estado === 'Notificar Denuncia' || 
    h.estado === 'En Análisis' || 
    h.estado === 'Ingresado'
  ).length,
});

// ============================================
// FUNCIONES PARA CONVERSIÓN HALLAZGO -> DENUNCIA
// ============================================

/**
 * Genera un número de denuncia único basado en el hallazgo
 */
export const generarNumeroDenuncia = (): string => {
  const base = 993526; // Siguiente número disponible según datos mock
  const random = Math.floor(Math.random() * 1000);
  return String(base + random);
};

/**
 * Prepara los datos del hallazgo para pre-rellenar el formulario de denuncia
 */
export const prepararDatosFormularioDenuncia = (hallazgo: Hallazgo) => {
  if (!hallazgo.datosDenuncia) {
    return null;
  }

  return {
    // Datos del hallazgo original
    hallazgoOrigen: hallazgo.numeroHallazgo,
    hallazgoId: hallazgo.id,
    
    // Datos generales
    aduanaOrigen: hallazgo.aduana,
    seccion: hallazgo.datosDenuncia.seccion,
    fechaIngreso: hallazgo.fechaIngreso,
    tipoInfraccion: hallazgo.datosDenuncia.tipoInfraccion,
    tipoDenuncia: hallazgo.tipoHallazgo,
    normaInfringida: hallazgo.datosDenuncia.normaInfringida,
    fundamentoLegal: hallazgo.datosDenuncia.fundamentoLegal,
    descripcionHechos: hallazgo.descripcion,
    montoEstimado: hallazgo.montoEstimado,
    mercanciaInvolucrada: hallazgo.datosDenuncia.mercanciaInvolucrada,
    
    // Datos del denunciado
    rutDenunciado: hallazgo.rutInvolucrado,
    nombreDenunciado: hallazgo.nombreInvolucrado,
    direccionDenunciado: hallazgo.datosDenuncia.direccionInvolucrado,
    emailDenunciado: hallazgo.datosDenuncia.emailInvolucrado,
    telefonoDenunciado: hallazgo.datosDenuncia.telefonoInvolucrado,
    representanteLegal: hallazgo.datosDenuncia.representanteLegal,
    
    // Agente de aduanas
    codigoAgente: hallazgo.datosDenuncia.codigoAgente,
    nombreAgente: hallazgo.datosDenuncia.nombreAgente,
    
    // Documentos
    documentoAduanero: hallazgo.datosDenuncia.documentoAduanero,
    tipoDocumento: hallazgo.datosDenuncia.tipoDocumento,
    documentosAdjuntos: hallazgo.datosDenuncia.documentosAdjuntos,
  };
};

