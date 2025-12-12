/**
 * Base de datos mock - Denuncias
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import type { Denuncia } from './types';

export const denuncias: Denuncia[] = [
  {
    id: "d-001",
    numeroDenuncia: "993519",
    numeroInterno: "INT-2025-001519",
    fechaIngreso: "15-11-2025",
    fechaEmision: "15-11-2025",
    fechaOcurrencia: "10-11-2025",
    estado: "En Revisión",
    tipoDenuncia: "Infraccional",
    aduana: "Valparaíso",
    aduanaEmision: "Valparaíso",
    seccion: "Fiscalización",
    rutDeudor: "76.123.456-7",
    nombreDeudor: "Importadora Global S.A.",
    tipoInfraccion: "Declaración Falsa",
    codigoArticulo: "174",
    etapaFormulacion: "REVISION",
    montoEstimado: "$12.500.000",
    multa: 5000000,
    multaMaxima: 50000000,
    multaAllanamiento: 3000000,
    montoDerechos: 2500000,
    montoDerechosCancelados: 0,
    codigoMoneda: "CLP",
    autodenuncio: false,
    retencion: true,
    mercanciaAfecta: true,
    observada: false,
    descripcionHechos: "Se detectaron diferencias en la declaración de importación DIN 6020-24-0012345. Las cantidades declaradas de equipos electrónicos (notebooks y tablets) no coinciden con las efectivamente internadas según fiscalización realizada en zona primaria del puerto de Valparaíso el día 10 de noviembre de 2025.",
    fundamentoLegal: "Ley 18.483 Art. 168",
    normaInfringida: "Art. 174 Ordenanza de Aduanas",
    mercanciaId: "m-001",
    mercanciaDescripcion: "Equipos electrónicos - Televisores LED 55\"",
    involucrados: [
      {
        id: "inv-001",
        tipoInvolucrado: "Infractor Principal",
        rut: "76.123.456-7",
        nombre: "Importadora Global S.A.",
        direccion: "Av. Argentina 1234, Valparaíso",
        email: "legal@importadoraglobal.cl",
        telefono: "+56 32 2456789",
        representanteLegal: "Roberto Sánchez Muñoz",
        orden: 1,
        esPrincipal: true,
      },
      {
        id: "inv-002",
        tipoInvolucrado: "Agente de Aduanas",
        rut: "78.456.789-0",
        nombre: "Agencia de Aduanas Pacífico Sur",
        direccion: "Blanco 1234, Valparaíso",
        email: "operaciones@pacificosur.cl",
        telefono: "+56 32 2654321",
        orden: 2,
        esPrincipal: false,
      },
    ],
    documentosAduaneros: [
      {
        id: "doc-adu-001",
        tipoDocumento: "DIN",
        numeroDocumento: "6020-24-0012345",
        numeroAceptacion: "2024-11-05-001234",
        fecha: "05-11-2025",
        aduana: "Valparaíso",
        descripcion: "Declaración de Ingreso - Equipos electrónicos",
      },
    ],
    documentosAdjuntos: [
      { id: "doc-001", nombre: "declaracion_importacion.pdf", tipo: "pdf", tamanio: "2.4 MB", fechaSubida: "15-11-2025" },
      { id: "doc-002", nombre: "acta_fiscalizacion.pdf", tipo: "pdf", tamanio: "1.8 MB", fechaSubida: "15-11-2025" },
      { id: "doc-003", nombre: "foto_mercancia.jpg", tipo: "jpg", tamanio: "3.2 MB", fechaSubida: "15-11-2025" },
    ],
    loginFuncionario: "jrodriguez",
    loginFiscalizador: "jrodriguez",
    diasVencimiento: 5,
    hallazgoOrigen: "PFI-123",
    cargosAsociados: ["c-001"],
    girosAsociados: ["g-001"],
    reclamosAsociados: ["r-001"],
    fechaCreacion: "15-11-2025",
    usuarioCreacion: "jrodriguez",
  },
  {
    id: "d-002",
    numeroDenuncia: "993520",
    numeroInterno: "INT-2025-001520",
    fechaIngreso: "10-11-2025",
    fechaEmision: "10-11-2025",
    fechaOcurrencia: "08-11-2025",
    estado: "Formulada",
    tipoDenuncia: "Penal",
    aduana: "Santiago",
    aduanaEmision: "Santiago",
    seccion: "Fiscalización Operativa",
    rutDeudor: "77.987.654-3",
    nombreDeudor: "Comercial Los Andes Ltda.",
    tipoInfraccion: "Contrabando",
    codigoArticulo: "PEN-168",
    etapaFormulacion: "FORMALIZADA",
    montoEstimado: "$45.000.000",
    montoDerechos: 8750000,
    codigoMoneda: "CLP",
    mercanciaAfecta: true,
    observada: false,
    codigoDenunciante: "SNA",
    numeroOficio: "OF-2025-00456",
    fechaOficio: "10-11-2025",
    descripcionHechos: "Detección de contenedor con doble fondo conteniendo mercancías no declaradas (textiles y confecciones de origen asiático) durante inspección rutinaria. La mercancía oculta tiene un valor estimado de $45.000.000 CLP.",
    fundamentoLegal: "Código Penal Art. 178",
    normaInfringida: "Art. 168 Ordenanza de Aduanas",
    mercanciaId: "m-002",
    mercanciaDescripcion: "Ropa deportiva - Zapatillas marca falsificada",
    involucrados: [
      {
        id: "inv-003",
        tipoInvolucrado: "Infractor Principal",
        rut: "77.987.654-3",
        nombre: "Comercial Los Andes Ltda.",
        direccion: "Camino a Melipilla 5678, Maipú, Santiago",
        email: "contacto@losandes.cl",
        telefono: "+56 2 27896543",
        representanteLegal: "Carmen Torres Vidal",
        orden: 1,
        esPrincipal: true,
      },
    ],
    documentosAduaneros: [
      {
        id: "doc-adu-002",
        tipoDocumento: "DIN",
        numeroDocumento: "6020-24-0034567",
        fecha: "03-11-2025",
        aduana: "Santiago",
        descripcion: "Declaración de Ingreso - Contenedor TRIU1234567",
      },
    ],
    documentosAdjuntos: [
      { id: "doc-004", nombre: "informe_contenedor.pdf", tipo: "pdf", tamanio: "4.1 MB", fechaSubida: "10-11-2025" },
      { id: "doc-005", nombre: "fotos_inspeccion.pdf", tipo: "pdf", tamanio: "8.5 MB", fechaSubida: "10-11-2025" },
    ],
    loginFuncionario: "mgonzalez",
    loginFiscalizador: "mgonzalez",
    diasVencimiento: -2,
    hallazgoOrigen: "PFI-124",
    cargosAsociados: ["c-002"],
    girosAsociados: ["g-002"],
    reclamosAsociados: ["r-002", "r-008"],
    fechaCreacion: "10-11-2025",
    usuarioCreacion: "mgonzalez",
  },
  {
    id: "d-003",
    numeroDenuncia: "993521",
    numeroInterno: "INT-2025-001521",
    fechaIngreso: "20-11-2025",
    fechaEmision: "20-11-2025",
    fechaOcurrencia: "18-11-2025",
    estado: "Ingresada",
    tipoDenuncia: "Infraccional",
    aduana: "Antofagasta",
    aduanaEmision: "Antofagasta",
    seccion: "Fiscalización Post-Despacho",
    rutDeudor: "80.456.123-5",
    nombreDeudor: "Minera del Norte SpA",
    tipoInfraccion: "Clasificación Incorrecta",
    codigoArticulo: "176",
    etapaFormulacion: "INICIAL",
    montoEstimado: "$8.750.000",
    multa: 2500000,
    multaMaxima: 25000000,
    montoDerechos: 8750000,
    codigoMoneda: "CLP",
    autodenuncio: false,
    retencion: false,
    mercanciaAfecta: false,
    observada: false,
    descripcionHechos: "Se detectó que maquinaria industrial minera fue declarada bajo partida arancelaria 8474.20.00 cuando correspondía 8474.10.00, resultando en un menor pago de derechos aduaneros.",
    fundamentoLegal: "Ley 18.525 Art. 12",
    normaInfringida: "Art. 176 Ordenanza de Aduanas",
    mercanciaDescripcion: "Maquinaria minera - Chancadores y molinos",
    involucrados: [
      {
        id: "inv-004",
        tipoInvolucrado: "Infractor Principal",
        rut: "80.456.123-5",
        nombre: "Minera del Norte SpA",
        direccion: "Av. Angamos 2345, Antofagasta",
        email: "comercio@mineranorte.cl",
        telefono: "+56 55 2345678",
        representanteLegal: "Fernando Díaz Campos",
        orden: 1,
        esPrincipal: true,
      },
    ],
    documentosAduaneros: [
      {
        id: "doc-adu-003",
        tipoDocumento: "DIN",
        numeroDocumento: "6020-24-0056789",
        fecha: "15-11-2025",
        aduana: "Antofagasta",
      },
    ],
    loginFuncionario: "cperez",
    diasVencimiento: 15,
    cargosAsociados: ["c-003"],
    girosAsociados: ["g-004"],
    reclamosAsociados: ["r-003"],
    fechaCreacion: "20-11-2025",
    usuarioCreacion: "cperez",
  },
  {
    id: "d-004",
    numeroDenuncia: "993522",
    numeroInterno: "INT-2025-001522",
    fechaIngreso: "05-11-2025",
    fechaEmision: "05-11-2025",
    fechaOcurrencia: "01-11-2025",
    estado: "Notificada",
    tipoDenuncia: "Penal",
    aduana: "Iquique",
    aduanaEmision: "Iquique",
    seccion: "Fiscalización Documental",
    rutDeudor: "81.321.654-9",
    nombreDeudor: "Zona Franca del Pacífico",
    tipoInfraccion: "Falsificación Documental",
    codigoArticulo: "PEN-193",
    etapaFormulacion: "NOTIFICACION",
    montoEstimado: "$67.300.000",
    montoDerechos: 3450000,
    codigoMoneda: "CLP",
    mercanciaAfecta: true,
    observada: false,
    codigoDenunciante: "SNA",
    numeroOficio: "OF-2025-00123",
    fechaOficio: "05-11-2025",
    descripcionHechos: "Certificados de origen asiáticos presentan inconsistencias que sugieren falsificación. Se detectaron sellos y firmas que no corresponden a las entidades emisoras verificadas.",
    fundamentoLegal: "Código Penal Art. 193",
    normaInfringida: "Art. 169 Ordenanza de Aduanas",
    mercanciaDescripcion: "Electrodomésticos línea blanca",
    involucrados: [
      {
        id: "inv-005",
        tipoInvolucrado: "Infractor Principal",
        rut: "81.321.654-9",
        nombre: "Zona Franca del Pacífico",
        direccion: "Zofri Galpón 12, Iquique",
        email: "admin@zfpacifico.cl",
        telefono: "+56 57 2567890",
        representanteLegal: "Patricia Morales Ruiz",
        orden: 1,
        esPrincipal: true,
      },
    ],
    loginFuncionario: "amartinez",
    diasVencimiento: 0,
    cargosAsociados: ["c-004"],
    girosAsociados: ["g-003"],
    reclamosAsociados: ["r-004", "r-010"],
    fechaCreacion: "05-11-2025",
    usuarioCreacion: "amartinez",
  },
  {
    id: "d-005",
    numeroDenuncia: "993523",
    numeroInterno: "INT-2025-001523",
    fechaIngreso: "28-10-2025",
    fechaEmision: "28-10-2025",
    fechaOcurrencia: "25-10-2025",
    estado: "Cerrada",
    tipoDenuncia: "Infraccional",
    aduana: "Los Andes",
    aduanaEmision: "Los Andes",
    seccion: "Fiscalización Terrestre",
    rutDeudor: "79.147.258-6",
    nombreDeudor: "Transportes Cordillera Ltda.",
    tipoInfraccion: "Valor Incorrecto",
    codigoArticulo: "177",
    etapaFormulacion: "CIERRE",
    montoEstimado: "$3.450.000",
    multa: 1250000,
    multaMaxima: 75000000,
    montoDerechos: 1250000,
    montoDerechosCancelados: 1250000,
    codigoMoneda: "CLP",
    autodenuncio: false,
    retencion: false,
    mercanciaAfecta: false,
    observada: false,
    descripcionHechos: "Error en valor declarado por ajuste de tipo de cambio. El importador regularizó la diferencia de valor FOB mediante pago voluntario de los derechos adicionales.",
    fundamentoLegal: "Acuerdo OMC Valoración Aduanera",
    normaInfringida: "Art. 177 Ordenanza de Aduanas",
    mercanciaDescripcion: "Repuestos automotrices",
    involucrados: [
      {
        id: "inv-006",
        tipoInvolucrado: "Infractor Principal",
        rut: "79.147.258-6",
        nombre: "Transportes Cordillera Ltda.",
        direccion: "Ruta 60 CH Km 85, Los Andes",
        email: "operaciones@cordillera.cl",
        telefono: "+56 34 2123456",
        orden: 1,
        esPrincipal: true,
      },
    ],
    loginFuncionario: "plopez",
    diasVencimiento: 30,
    cargosAsociados: ["c-005"],
    girosAsociados: ["g-009", "g-010"],
    reclamosAsociados: ["r-005"],
    fechaCreacion: "28-10-2025",
    usuarioCreacion: "plopez",
  },
  {
    id: "d-006",
    numeroDenuncia: "993524",
    numeroInterno: "INT-2025-001524",
    fechaIngreso: "12-11-2025",
    fechaEmision: "12-11-2025",
    fechaOcurrencia: "08-11-2025",
    estado: "En Proceso",
    tipoDenuncia: "Penal",
    aduana: "Valparaíso",
    aduanaEmision: "Valparaíso",
    seccion: "Fiscalización Post-Despacho",
    rutDeudor: "76.852.963-1",
    nombreDeudor: "Distribuidora Nacional S.A.",
    tipoInfraccion: "Fraude Aduanero",
    codigoArticulo: "PEN-168",
    etapaFormulacion: "TRAMITACION",
    montoEstimado: "$89.500.000",
    montoDerechos: 67500000,
    codigoMoneda: "CLP",
    mercanciaAfecta: true,
    observada: false,
    codigoDenunciante: "SNA",
    numeroOficio: "OF-2025-00789",
    fechaOficio: "12-11-2025",
    descripcionHechos: "Análisis de precios revela patrones de subfacturación sistemática en múltiples operaciones durante el último año. Se estima un perjuicio fiscal de $89.500.000 CLP.",
    fundamentoLegal: "Ley 18.483 Art. 172",
    normaInfringida: "Art. 168 Ordenanza de Aduanas",
    mercanciaDescripcion: "Productos de consumo masivo - Alimentos y bebidas",
    involucrados: [
      {
        id: "inv-007",
        tipoInvolucrado: "Infractor Principal",
        rut: "76.852.963-1",
        nombre: "Distribuidora Nacional S.A.",
        direccion: "Av. España 789, Valparaíso",
        email: "legal@distribuidoranacional.cl",
        telefono: "+56 32 2654321",
        representanteLegal: "Miguel Ángel Fuentes",
        orden: 1,
        esPrincipal: true,
      },
    ],
    loginFuncionario: "jrodriguez",
    diasVencimiento: 8,
    hallazgoOrigen: "PFI-128",
    cargosAsociados: ["c-006"],
    girosAsociados: ["g-006"],
    reclamosAsociados: ["r-006"],
    fechaCreacion: "12-11-2025",
    usuarioCreacion: "jrodriguez",
  },
  {
    id: "d-007",
    numeroDenuncia: "993525",
    numeroInterno: "INT-2025-001525",
    fechaIngreso: "18-11-2025",
    fechaEmision: "18-11-2025",
    fechaOcurrencia: "15-11-2025",
    estado: "Observada",
    tipoDenuncia: "Infraccional",
    aduana: "Santiago",
    aduanaEmision: "Santiago",
    seccion: "Fiscalización Zona Primaria",
    rutDeudor: "78.456.789-0",
    nombreDeudor: "Importaciones del Sur Ltda.",
    tipoInfraccion: "Documentación Incompleta",
    codigoArticulo: "175",
    etapaFormulacion: "REVISION",
    montoEstimado: "$15.200.000",
    multa: 2000000,
    multaMaxima: 10000000,
    montoDerechos: 9800000,
    codigoMoneda: "CLP",
    autodenuncio: false,
    retencion: true,
    mercanciaAfecta: true,
    observada: true,
    descripcionHechos: "Carga arribada sin BL original ni factura comercial válida. La mercancía fue retenida hasta presentación de documentos completos.",
    fundamentoLegal: "Compendio Normas Aduaneras Cap. II",
    normaInfringida: "Art. 175 Ordenanza de Aduanas",
    mercanciaDescripcion: "Materiales de construcción - Acero y fierro",
    involucrados: [
      {
        id: "inv-008",
        tipoInvolucrado: "Infractor Principal",
        rut: "78.456.789-0",
        nombre: "Importaciones del Sur Ltda.",
        direccion: "Av. Presidente Riesco 5432, Las Condes",
        email: "importaciones@delsur.cl",
        telefono: "+56 2 29876543",
        representanteLegal: "Andrea Paz González",
        orden: 1,
        esPrincipal: true,
      },
    ],
    loginFuncionario: "mgonzalez",
    diasVencimiento: 3,
    cargosAsociados: ["c-007"],
    girosAsociados: ["g-008"],
    fechaCreacion: "18-11-2025",
    usuarioCreacion: "mgonzalez",
  },
  {
    id: "d-008",
    numeroDenuncia: "993526",
    numeroInterno: "INT-2025-001526",
    fechaIngreso: "22-11-2025",
    fechaEmision: "22-11-2025",
    fechaOcurrencia: "20-11-2025",
    estado: "Borrador",
    tipoDenuncia: "Infraccional",
    aduana: "Antofagasta",
    aduanaEmision: "Antofagasta",
    seccion: "Fiscalización Exportaciones",
    rutDeudor: "80.159.753-2",
    nombreDeudor: "Exportaciones Mineras SpA",
    tipoInfraccion: "Evasión Tributaria",
    codigoArticulo: "178",
    etapaFormulacion: "INICIAL",
    montoEstimado: "$125.000.000",
    montoDerechos: 125000000,
    codigoMoneda: "CLP",
    autodenuncio: false,
    retencion: false,
    mercanciaAfecta: false,
    observada: false,
    descripcionHechos: "Exportación de concentrado de cobre sin declarar contenido de metales preciosos (oro y plata). El análisis de laboratorio revela concentraciones significativas no reportadas.",
    fundamentoLegal: "DL 825 Art. 97",
    normaInfringida: "Art. 168 Ordenanza de Aduanas",
    mercanciaDescripcion: "Concentrado de cobre con contenido de Au y Ag",
    involucrados: [
      {
        id: "inv-009",
        tipoInvolucrado: "Infractor Principal",
        rut: "80.159.753-2",
        nombre: "Exportaciones Mineras SpA",
        direccion: "Av. Balmaceda 1234, Antofagasta",
        email: "exportaciones@expomineras.cl",
        telefono: "+56 55 2789012",
        representanteLegal: "Gonzalo Vera Pizarro",
        orden: 1,
        esPrincipal: true,
      },
    ],
    documentosAduaneros: [
      {
        id: "doc-adu-004",
        tipoDocumento: "DUS",
        numeroDocumento: "6020-24-0089012",
        fecha: "18-11-2025",
        aduana: "Antofagasta",
        descripcion: "Declaración Única de Salida - Concentrado de cobre",
      },
    ],
    loginFuncionario: "cperez",
    diasVencimiento: 20,
    hallazgoOrigen: "PFI-130",
    cargosAsociados: ["c-008"],
    girosAsociados: ["g-005"],
    reclamosAsociados: ["r-009"],
    fechaCreacion: "22-11-2025",
    usuarioCreacion: "cperez",
  },
];

// ============================================
// FUNCIONES HELPER PARA DENUNCIAS
// ============================================

export const getDenunciaPorNumero = (numero: string) => 
  denuncias.find(d => d.numeroDenuncia === numero);

export const getDenunciaPorId = (id: string) =>
  denuncias.find(d => d.id === id);

export const getDenunciasPorEstado = (estado: Denuncia['estado']) =>
  denuncias.filter(d => d.estado === estado);

export const getDenunciasPorTipo = (tipo: Denuncia['tipoDenuncia']) =>
  denuncias.filter(d => d.tipoDenuncia === tipo);

export const getDenunciasVencidas = () =>
  denuncias.filter(d => d.diasVencimiento < 0);

export const getDenunciasPorVencer = (dias: number = 5) =>
  denuncias.filter(d => d.diasVencimiento >= 0 && d.diasVencimiento <= dias);

export const getDenunciasPorHallazgo = (hallazgoNumero: string) =>
  denuncias.filter(d => d.hallazgoOrigen === hallazgoNumero);

export const getDenunciasPorAduana = (aduana: string) =>
  denuncias.filter(d => d.aduana === aduana);

export const getDenunciasConCargos = () =>
  denuncias.filter(d => d.cargosAsociados && d.cargosAsociados.length > 0);

export const getDenunciasConReclamos = () =>
  denuncias.filter(d => d.reclamosAsociados && d.reclamosAsociados.length > 0);

export const getDenunciasObservadas = () =>
  denuncias.filter(d => d.observada === true);

export const getConteoDenuncias = () => ({
  total: denuncias.length,
  porEstado: {
    borrador: denuncias.filter(d => d.estado === 'Borrador').length,
    ingresada: denuncias.filter(d => d.estado === 'Ingresada').length,
    enRevision: denuncias.filter(d => d.estado === 'En Revisión').length,
    formulada: denuncias.filter(d => d.estado === 'Formulada').length,
    notificada: denuncias.filter(d => d.estado === 'Notificada').length,
    enProceso: denuncias.filter(d => d.estado === 'En Proceso').length,
    observada: denuncias.filter(d => d.estado === 'Observada').length,
    allanada: denuncias.filter(d => d.estado === 'Allanada').length,
    reclamada: denuncias.filter(d => d.estado === 'Reclamada').length,
    cerrada: denuncias.filter(d => d.estado === 'Cerrada').length,
    archivada: denuncias.filter(d => d.estado === 'Archivada').length,
  },
  porTipo: {
    infraccional: denuncias.filter(d => d.tipoDenuncia === 'Infraccional').length,
    penal: denuncias.filter(d => d.tipoDenuncia === 'Penal').length,
  },
  vencidas: denuncias.filter(d => d.diasVencimiento < 0).length,
  porVencer: denuncias.filter(d => d.diasVencimiento >= 0 && d.diasVencimiento <= 5).length,
  pendientes: denuncias.filter(d => ['Borrador', 'Ingresada', 'En Revisión'].includes(d.estado)).length,
  enProceso: denuncias.filter(d => ['Formulada', 'Notificada', 'En Proceso'].includes(d.estado)).length,
  resueltas: denuncias.filter(d => ['Cerrada', 'Archivada'].includes(d.estado)).length,
  conCargos: denuncias.filter(d => d.cargosAsociados && d.cargosAsociados.length > 0).length,
  conReclamos: denuncias.filter(d => d.reclamosAsociados && d.reclamosAsociados.length > 0).length,
});

// ============================================
// VALIDACIONES DE DENUNCIA
// ============================================

export interface ValidacionDenuncia {
  esValida: boolean;
  errores: string[];
  advertencias: string[];
}

export const validarDenuncia = (denuncia: Partial<Denuncia>): ValidacionDenuncia => {
  const errores: string[] = [];
  const advertencias: string[] = [];

  // Validaciones obligatorias
  if (!denuncia.tipoDenuncia) {
    errores.push('Debe seleccionar el tipo de denuncia (Infraccional/Penal)');
  }

  if (!denuncia.aduana) {
    errores.push('Debe seleccionar la aduana');
  }

  if (!denuncia.fechaOcurrencia) {
    errores.push('Debe ingresar la fecha de ocurrencia');
  }

  // Validar fecha de ocurrencia
  if (denuncia.fechaOcurrencia && denuncia.fechaEmision) {
    // Fecha de ocurrencia no puede ser posterior a fecha de emisión
    const fechaOcurrencia = new Date(denuncia.fechaOcurrencia.split('-').reverse().join('-'));
    const fechaEmision = new Date(denuncia.fechaEmision.split('-').reverse().join('-'));
    const hoy = new Date();
    
    if (fechaOcurrencia > fechaEmision) {
      errores.push('La fecha de ocurrencia no puede ser posterior a la fecha de emisión');
    }
    
    if (fechaOcurrencia > hoy) {
      errores.push('La fecha de ocurrencia no puede ser futura');
    }
  }

  // Validaciones para infraccional
  if (denuncia.tipoDenuncia === 'Infraccional') {
    if (!denuncia.codigoArticulo) {
      errores.push('Debe seleccionar un artículo para la denuncia infraccional');
    }
  }

  // Validaciones para penal
  if (denuncia.tipoDenuncia === 'Penal') {
    if (!denuncia.codigoDenunciante) {
      advertencias.push('Se recomienda indicar el denunciante para denuncias penales');
    }
  }

  // Validar involucrados
  if (!denuncia.involucrados || denuncia.involucrados.length === 0) {
    errores.push('Debe agregar al menos un involucrado/infractor');
  } else {
    const principales = denuncia.involucrados.filter(i => i.esPrincipal);
    if (principales.length === 0) {
      errores.push('Debe existir al menos un infractor principal');
    }
  }

  // Validar descripción
  if (!denuncia.descripcionHechos || denuncia.descripcionHechos.length < 50) {
    errores.push('La descripción de los hechos debe tener al menos 50 caracteres');
  }

  return {
    esValida: errores.length === 0,
    errores,
    advertencias,
  };
};

// ============================================
// GENERADORES
// ============================================

let contadorDenuncia = 993527;

export const generarNumeroDenuncia = (): string => {
  return String(contadorDenuncia++);
};

export const generarNumeroInterno = (numeroDenuncia: string): string => {
  const año = new Date().getFullYear();
  return `INT-${año}-${numeroDenuncia.padStart(6, '0')}`;
};

// ============================================
// PERMISOS POR ESTADO
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

export const getPermisosPorEstado = (estado: Denuncia['estado']): PermisosEstado => {
  switch (estado) {
    case 'Borrador':
      return {
        puedeEditar: true,
        puedeEliminar: true,
        puedeFormalizar: true,
        puedeGenerarCargo: false,
        puedeCrearReclamo: false,
        puedeNotificar: false,
        puedeCerrar: false,
        camposEditables: ['*'], // Todos los campos
      };
    case 'Ingresada':
    case 'En Revisión':
      return {
        puedeEditar: true,
        puedeEliminar: false,
        puedeFormalizar: true,
        puedeGenerarCargo: false,
        puedeCrearReclamo: false,
        puedeNotificar: false,
        puedeCerrar: false,
        camposEditables: ['descripcionHechos', 'multa', 'involucrados', 'documentosAdjuntos'],
      };
    case 'Formulada':
      return {
        puedeEditar: true,
        puedeEliminar: false,
        puedeFormalizar: false,
        puedeGenerarCargo: true,
        puedeCrearReclamo: false,
        puedeNotificar: true,
        puedeCerrar: false,
        camposEditables: ['observaciones', 'documentosAdjuntos'],
      };
    case 'Notificada':
    case 'En Proceso':
      return {
        puedeEditar: true,
        puedeEliminar: false,
        puedeFormalizar: false,
        puedeGenerarCargo: true,
        puedeCrearReclamo: true,
        puedeNotificar: true,
        puedeCerrar: false,
        camposEditables: ['observaciones', 'documentosAdjuntos'],
      };
    case 'Observada':
      return {
        puedeEditar: true,
        puedeEliminar: false,
        puedeFormalizar: false,
        puedeGenerarCargo: false,
        puedeCrearReclamo: false,
        puedeNotificar: false,
        puedeCerrar: false,
        camposEditables: ['descripcionHechos', 'multa', 'documentosAdjuntos'],
      };
    case 'Reclamada':
      return {
        puedeEditar: false,
        puedeEliminar: false,
        puedeFormalizar: false,
        puedeGenerarCargo: false,
        puedeCrearReclamo: false,
        puedeNotificar: false,
        puedeCerrar: false,
        camposEditables: [],
      };
    case 'Cerrada':
    case 'Archivada':
      return {
        puedeEditar: false,
        puedeEliminar: false,
        puedeFormalizar: false,
        puedeGenerarCargo: false,
        puedeCrearReclamo: false,
        puedeNotificar: false,
        puedeCerrar: false,
        camposEditables: ['documentosAdjuntos'], // Solo agregar al expediente
      };
    default:
      return {
        puedeEditar: false,
        puedeEliminar: false,
        puedeFormalizar: false,
        puedeGenerarCargo: false,
        puedeCrearReclamo: false,
        puedeNotificar: false,
        puedeCerrar: false,
        camposEditables: [],
      };
  }
};
