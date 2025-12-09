/**
 * Base de datos mock - Reclamos
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import type { 
  Reclamo, 
  EstadoReclamo, 
  TipoReclamoCompleto, 
  OrigenReclamo,
  TipoFalloTTA,
  PermisosReclamo 
} from './types';

// ============================================
// DATOS MOCK - RECLAMOS COMPLETOS
// ============================================

export const reclamos: Reclamo[] = [
  {
    id: "r-001",
    numeroReclamo: "REC-TTA-2024-0011",
    tipoReclamo: "TTA",
    codigoProcesoReclamo: "TTA",
    estado: "Fallado",
    fechaIngreso: "15-09-2025",
    fechaPresentacion: "15-09-2025",
    fechaAdmisibilidad: "22-09-2025",
    fechaResolucion: "20-11-2025",
    origenReclamo: "DENUNCIA",
    entidadOrigenId: "d-001",
    numeroEntidadOrigen: "993519",
    denunciaAsociada: "993519",
    reclamante: "Importadora Global S.A.",
    rutReclamante: "76.123.456-7",
    direccionReclamante: "Av. Principal 1234, Valparaíso",
    emailReclamante: "legal@importadoraglobal.cl",
    telefonoReclamante: "+56 32 2345678",
    representanteLegal: "Juan Pérez Soto",
    montoReclamado: 15500000,
    montoResuelto: 8000000,
    fundamentoReclamo: "Se reclama contra la resolución que impone multa del artículo 173 de la Ordenanza de Aduanas, por cuanto no se acredita debidamente el dolo o culpa en la supuesta infracción.",
    peticiones: "Se solicita dejar sin efecto la multa impuesta, o en subsidio, rebajarla al mínimo legal.",
    descripcion: "Reclamo TTA por multa Art. 173 - Importadora Global",
    aduana: "Valparaíso",
    codigoAduana: "VLP",
    diasRespuesta: 0,
    plazo: 90,
    loginAbogado: "mgarcia",
    expedienteDigitalId: "exp-r-001",
    fechaCreacion: "15-09-2025",
    usuarioCreacion: "mgarcia",
    datosTTA: {
      id: "tta-001",
      reclamoId: "r-001",
      rolTTA: "TTA-VLP-2024-00234",
      tribunalCompetente: "Tribunal Tributario y Aduanero de Valparaíso",
      fechaPresentacionTTA: "15-09-2025",
      fechaAdmisibilidad: "22-09-2025",
      fechaContestacion: "10-10-2025",
      fechaAudiencia: "05-11-2025",
      fechaSentencia: "20-11-2025",
      admisible: true,
      fallo1raInstancia: "Acogido Parcialmente",
      fundamentoFallo1ra: "Se acoge parcialmente el reclamo, reduciendo la multa en un 50% por no acreditarse plenamente la intención dolosa.",
      montoFallo1ra: 8000000,
      tieneApelacion: false,
      plazoProbatorio: 20,
      fechaVencimientoProbatorio: "12-10-2025",
      plazoContestacion: 15,
      informeAduanas: "INF-ADU-2024-0234",
      contestacionDemanda: "CONT-2024-0234",
    },
  },
  {
    id: "r-002",
    numeroReclamo: "REC-REP-2024-0045",
    tipoReclamo: "Reposición",
    codigoProcesoReclamo: "REP",
    estado: "Pendiente Resolución",
    fechaIngreso: "10-11-2025",
    fechaPresentacion: "10-11-2025",
    origenReclamo: "CARGO",
    entidadOrigenId: "c-002",
    numeroEntidadOrigen: "CAR-2024-005679",
    denunciaAsociada: "993520",
    cargoAsociado: "CAR-2024-005679",
    reclamante: "Comercial Los Andes Ltda.",
    rutReclamante: "77.987.654-3",
    direccionReclamante: "Av. Apoquindo 5678, Santiago",
    emailReclamante: "gerencia@losandes.cl",
    montoReclamado: 8750000,
    fundamentoReclamo: "Se interpone recurso de reposición contra el cargo emitido, por cuanto existe error en la determinación de la base imponible.",
    peticiones: "Se solicita dejar sin efecto el cargo o corregir la base imponible según documentos acompañados.",
    descripcion: "Recurso de reposición contra cargo - Error en base imponible",
    aduana: "Santiago",
    codigoAduana: "SCL",
    diasRespuesta: 5,
    plazo: 15,
    loginFuncionario: "jperez",
    expedienteDigitalId: "exp-r-002",
    fechaCreacion: "10-11-2025",
    usuarioCreacion: "jperez",
  },
  {
    id: "r-003",
    numeroReclamo: "REC-TTA-2024-0012",
    tipoReclamo: "TTA",
    codigoProcesoReclamo: "TTA",
    estado: "En Tramitación",
    fechaIngreso: "28-10-2025",
    fechaPresentacion: "28-10-2025",
    fechaAdmisibilidad: "05-11-2025",
    origenReclamo: "DENUNCIA",
    entidadOrigenId: "d-003",
    numeroEntidadOrigen: "993521",
    denunciaAsociada: "993521",
    reclamante: "Minera del Norte SpA",
    rutReclamante: "80.456.123-5",
    direccionReclamante: "Av. Minería 5678, Antofagasta",
    emailReclamante: "legal@mineradelnorte.cl",
    representanteLegal: "Carlos Rodríguez Muñoz",
    montoReclamado: 45200000,
    fundamentoReclamo: "Se reclama contra la denuncia por presunto contrabando, alegando que la mercancía ingresó al país bajo el régimen de admisión temporal y fue debidamente declarada.",
    peticiones: "Se solicita el archivo de la denuncia y la liberación de la mercancía retenida.",
    descripcion: "Reclamo TTA ante Tribunal Tributario y Aduanero - Presunto contrabando",
    aduana: "Antofagasta",
    codigoAduana: "ANT",
    diasRespuesta: 0,
    plazo: 90,
    loginAbogado: "amorales",
    expedienteDigitalId: "exp-r-003",
    fechaCreacion: "28-10-2025",
    usuarioCreacion: "amorales",
    datosTTA: {
      id: "tta-003",
      reclamoId: "r-003",
      rolTTA: "TTA-ANT-2024-00089",
      tribunalCompetente: "Tribunal Tributario y Aduanero de Antofagasta",
      fechaPresentacionTTA: "28-10-2025",
      fechaAdmisibilidad: "05-11-2025",
      admisible: true,
      plazoProbatorio: 20,
      fechaVencimientoProbatorio: "25-11-2025",
      plazoContestacion: 15,
      informeAduanas: "INF-ADU-2024-0089",
      observaciones: "Pendiente presentación de prueba documental por parte del contribuyente",
    },
  },
  {
    id: "r-004",
    numeroReclamo: "REC-REP-2024-0044",
    tipoReclamo: "Reposición",
    codigoProcesoReclamo: "REP",
    estado: "Acogido",
    fechaIngreso: "01-11-2025",
    fechaPresentacion: "01-11-2025",
    fechaResolucion: "15-11-2025",
    origenReclamo: "GIRO",
    entidadOrigenId: "g-003",
    numeroEntidadOrigen: "F09-2024-001235",
    denunciaAsociada: "993522",
    giroAsociado: "F09-2024-001235",
    reclamante: "Zona Franca del Pacífico",
    rutReclamante: "81.321.654-9",
    direccionReclamante: "Zona Franca Iquique, Módulo 45",
    emailReclamante: "contabilidad@zofri.cl",
    montoReclamado: 3450000,
    montoResuelto: 0,
    fundamentoReclamo: "Se interpone recurso de reposición contra el giro emitido por existir duplicidad en el cobro de derechos.",
    peticiones: "Se solicita anular el giro por duplicidad de cobro.",
    descripcion: "Recurso de reposición contra giro - Duplicidad de cobro",
    resolucion: "Se acoge el recurso de reposición interpuesto, dejándose sin efecto el giro impugnado por acreditarse duplicidad en el cobro.",
    tipoResolucion: "Acogida",
    fundamentoResolucion: "Se verifica en sistemas que efectivamente existe otro giro por los mismos conceptos ya pagado.",
    aduana: "Iquique",
    codigoAduana: "IQQ",
    diasRespuesta: 14,
    plazo: 15,
    loginFuncionario: "crodriguez",
    expedienteDigitalId: "exp-r-004",
    fechaCreacion: "01-11-2025",
    usuarioCreacion: "crodriguez",
  },
  {
    id: "r-005",
    numeroReclamo: "REC-REP-2024-0046",
    tipoReclamo: "Reposición",
    codigoProcesoReclamo: "REP",
    estado: "Rechazado",
    fechaIngreso: "05-11-2025",
    fechaPresentacion: "05-11-2025",
    fechaResolucion: "20-11-2025",
    origenReclamo: "DENUNCIA",
    entidadOrigenId: "d-005",
    numeroEntidadOrigen: "993523",
    denunciaAsociada: "993523",
    reclamante: "Transportes Cordillera Ltda.",
    rutReclamante: "79.147.258-6",
    direccionReclamante: "Ruta 5 Norte Km 25, Los Andes",
    emailReclamante: "transportes@cordillera.cl",
    montoReclamado: 5600000,
    fundamentoReclamo: "Se interpone recurso de reposición contra la multa impuesta por atraso en la presentación de documentos.",
    peticiones: "Se solicita dejar sin efecto la multa o rebajarla al mínimo.",
    descripcion: "Recurso contra multa administrativa - Atraso documentos",
    resolucion: "Se rechaza el recurso de reposición interpuesto, manteniéndose la sanción impuesta.",
    tipoResolucion: "Rechazada",
    fundamentoResolucion: "No se acreditan las causales de fuerza mayor alegadas para justificar el atraso.",
    aduana: "Los Andes",
    codigoAduana: "LAN",
    diasRespuesta: 15,
    plazo: 15,
    loginFuncionario: "pmartin",
    expedienteDigitalId: "exp-r-005",
    fechaCreacion: "05-11-2025",
    usuarioCreacion: "pmartin",
  },
  {
    id: "r-006",
    numeroReclamo: "REC-TTA-2024-0013",
    tipoReclamo: "TTA",
    codigoProcesoReclamo: "TTA",
    estado: "En Admisibilidad",
    fechaIngreso: "20-11-2025",
    fechaPresentacion: "20-11-2025",
    origenReclamo: "CARGO",
    entidadOrigenId: "c-006",
    numeroEntidadOrigen: "CAR-2024-005683",
    denunciaAsociada: "993524",
    cargoAsociado: "CAR-2024-005683",
    reclamante: "Distribuidora Nacional S.A.",
    rutReclamante: "76.852.963-1",
    direccionReclamante: "Av. Comercio 4567, Valparaíso",
    emailReclamante: "gerencia@distribuidoranacional.cl",
    representanteLegal: "María González Pérez",
    montoReclamado: 67500000,
    fundamentoReclamo: "Se reclama contra el cargo emitido por la aduana, impugnando la clasificación arancelaria aplicada a la mercancía importada.",
    peticiones: "Se solicita modificar la clasificación arancelaria y reliquidar los derechos.",
    descripcion: "Impugnación de clasificación arancelaria - Cargo alto monto",
    aduana: "Valparaíso",
    codigoAduana: "VLP",
    diasRespuesta: 20,
    plazo: 90,
    loginAbogado: "mgarcia",
    expedienteDigitalId: "exp-r-006",
    fechaCreacion: "20-11-2025",
    usuarioCreacion: "mgarcia",
    datosTTA: {
      id: "tta-006",
      reclamoId: "r-006",
      tribunalCompetente: "Tribunal Tributario y Aduanero de Valparaíso",
      fechaPresentacionTTA: "20-11-2025",
      plazoProbatorio: 20,
      plazoContestacion: 15,
      observaciones: "Pendiente resolución de admisibilidad",
    },
  },
  {
    id: "r-007",
    numeroReclamo: "REC-TTA-2024-0014",
    tipoReclamo: "TTA",
    codigoProcesoReclamo: "TTA",
    estado: "Admitido",
    fechaIngreso: "15-11-2025",
    fechaPresentacion: "15-11-2025",
    fechaAdmisibilidad: "22-11-2025",
    origenReclamo: "DENUNCIA",
    entidadOrigenId: "d-007",
    numeroEntidadOrigen: "993525",
    denunciaAsociada: "993525",
    reclamante: "Exportadora del Sur S.A.",
    rutReclamante: "79.852.147-3",
    direccionReclamante: "Puerto Montt, Costanera 1234",
    emailReclamante: "gerencia@exportadoradelsur.cl",
    representanteLegal: "Pedro Muñoz Castro",
    montoReclamado: 22300000,
    fundamentoReclamo: "Se reclama contra la denuncia por subfacturación, alegando que los valores declarados corresponden a los efectivamente pagados según documentos bancarios.",
    peticiones: "Se solicita dejar sin efecto la denuncia y los cargos asociados.",
    descripcion: "Reclamo por subfacturación - Exportadora del Sur",
    aduana: "Puerto Montt",
    codigoAduana: "PMC",
    diasRespuesta: 15,
    plazo: 90,
    loginAbogado: "amorales",
    expedienteDigitalId: "exp-r-007",
    fechaCreacion: "15-11-2025",
    usuarioCreacion: "amorales",
    datosTTA: {
      id: "tta-007",
      reclamoId: "r-007",
      rolTTA: "TTA-PMC-2024-00045",
      tribunalCompetente: "Tribunal Tributario y Aduanero de Puerto Montt",
      fechaPresentacionTTA: "15-11-2025",
      fechaAdmisibilidad: "22-11-2025",
      admisible: true,
      plazoProbatorio: 20,
      fechaVencimientoProbatorio: "12-12-2025",
      plazoContestacion: 15,
      informeAduanas: "INF-ADU-2024-0045",
      observaciones: "Admitido a tramitación. Pendiente contestación de la demanda por parte de Aduanas.",
    },
  },
  {
    id: "r-008",
    numeroReclamo: "REC-REP-2024-0047",
    tipoReclamo: "Reposición",
    codigoProcesoReclamo: "REP",
    estado: "Ingresado",
    fechaIngreso: "28-11-2025",
    fechaPresentacion: "28-11-2025",
    origenReclamo: "DENUNCIA",
    entidadOrigenId: "d-002",
    numeroEntidadOrigen: "993520",
    denunciaAsociada: "993520",
    reclamante: "Comercial Los Andes Ltda.",
    rutReclamante: "77.987.654-3",
    direccionReclamante: "Av. Apoquindo 5678, Santiago",
    emailReclamante: "gerencia@losandes.cl",
    montoReclamado: 12500000,
    fundamentoReclamo: "Se interpone recurso de reposición contra la resolución que rechaza el anterior recurso presentado.",
    peticiones: "Se solicita reconsiderar la decisión anterior y acoger las alegaciones del contribuyente.",
    descripcion: "Segundo recurso de reposición - Comercial Los Andes",
    aduana: "Santiago",
    codigoAduana: "SCL",
    diasRespuesta: 3,
    plazo: 15,
    fechaCreacion: "28-11-2025",
    usuarioCreacion: "sistema",
  },
  {
    id: "r-009",
    numeroReclamo: "REC-TTA-2024-0015",
    tipoReclamo: "TTA",
    codigoProcesoReclamo: "TTA",
    estado: "Cerrado",
    fechaIngreso: "01-08-2025",
    fechaPresentacion: "01-08-2025",
    fechaAdmisibilidad: "10-08-2025",
    fechaResolucion: "15-10-2025",
    origenReclamo: "DENUNCIA",
    entidadOrigenId: "d-008",
    numeroEntidadOrigen: "993526",
    denunciaAsociada: "993526",
    reclamante: "Exportaciones Mineras SpA",
    rutReclamante: "80.159.753-2",
    direccionReclamante: "Av. Balmaceda 1234, Antofagasta",
    emailReclamante: "exportaciones@expomineras.cl",
    representanteLegal: "Gonzalo Vera Pizarro",
    montoReclamado: 15800000,
    montoResuelto: 15800000,
    fundamentoReclamo: "Se reclama contra la denuncia por omisión de metales preciosos en la exportación declarada.",
    peticiones: "Se solicita ajustar la denuncia considerando el contenido real reportado en laboratorio.",
    descripcion: "Reclamo TTA cerrado - Exportaciones Mineras",
    aduana: "Antofagasta",
    codigoAduana: "ANT",
    diasRespuesta: 0,
    plazo: 90,
    loginAbogado: "mgarcia",
    expedienteDigitalId: "exp-r-009",
    fechaCreacion: "01-08-2025",
    usuarioCreacion: "mgarcia",
    datosTTA: {
      id: "tta-009",
      reclamoId: "r-009",
      rolTTA: "TTA-ANT-2024-00023",
      tribunalCompetente: "Tribunal Tributario y Aduanero de Antofagasta",
      fechaPresentacionTTA: "01-08-2025",
      fechaAdmisibilidad: "10-08-2025",
      fechaContestacion: "25-08-2025",
      fechaAudiencia: "20-09-2025",
      fechaSentencia: "15-10-2025",
      admisible: true,
      fallo1raInstancia: "Acogido",
      fundamentoFallo1ra: "Se acoge íntegramente el reclamo, dejándose sin efecto la denuncia por no acreditarse las diferencias de aforo.",
      montoFallo1ra: 15800000,
      tieneApelacion: false,
      falloFinal: "Acogido",
      montoFalloFinal: 15800000,
      plazoProbatorio: 20,
      informeAduanas: "INF-ADU-2024-0023",
      contestacionDemanda: "CONT-2024-0023",
    },
  },
  {
    id: "r-010",
    numeroReclamo: "REC-REP-2024-0048",
    tipoReclamo: "Reposición",
    codigoProcesoReclamo: "REP",
    estado: "Acogido Parcialmente",
    fechaIngreso: "08-11-2025",
    fechaPresentacion: "08-11-2025",
    fechaResolucion: "25-11-2025",
    origenReclamo: "CARGO",
    entidadOrigenId: "c-004",
    numeroEntidadOrigen: "CAR-2024-005681",
    denunciaAsociada: "993522",
    cargoAsociado: "CAR-2024-005681",
    reclamante: "Importaciones del Sur Ltda.",
    rutReclamante: "78.456.789-0",
    direccionReclamante: "Av. Providencia 1234, Santiago",
    emailReclamante: "contabilidad@importsur.cl",
    montoReclamado: 9800000,
    montoResuelto: 4900000,
    fundamentoReclamo: "Se interpone recurso de reposición contra el cargo, alegando error en el cálculo de intereses.",
    peticiones: "Se solicita recalcular los intereses moratorios aplicados.",
    descripcion: "Recurso de reposición - Error en cálculo de intereses",
    resolucion: "Se acoge parcialmente el recurso, rebajándose los intereses moratorios en un 50%.",
    tipoResolucion: "Acogida Parcialmente",
    fundamentoResolucion: "Se verifica error parcial en la aplicación de la tasa de interés.",
    aduana: "Santiago",
    codigoAduana: "SCL",
    diasRespuesta: 17,
    plazo: 15,
    loginFuncionario: "mlopez",
    expedienteDigitalId: "exp-r-010",
    fechaCreacion: "08-11-2025",
    usuarioCreacion: "mlopez",
  },
];

// ============================================
// FUNCIONES HELPER PARA RECLAMOS
// ============================================

export const getReclamoPorId = (id: string) => 
  reclamos.find(r => r.id === id);

export const getReclamoPorNumero = (numero: string) => 
  reclamos.find(r => r.numeroReclamo === numero);

export const getReclamosPorEstado = (estado: EstadoReclamo) =>
  reclamos.filter(r => r.estado === estado);

export const getReclamosPorTipo = (tipo: TipoReclamoCompleto) =>
  reclamos.filter(r => r.tipoReclamo === tipo);

export const getReclamosPorOrigen = (origen: OrigenReclamo) =>
  reclamos.filter(r => r.origenReclamo === origen);

export const getReclamosPorDenuncia = (denunciaNumero: string) =>
  reclamos.filter(r => r.denunciaAsociada === denunciaNumero || r.numeroEntidadOrigen === denunciaNumero);

export const getReclamosPorCargo = (cargoNumero: string) =>
  reclamos.filter(r => r.cargoAsociado === cargoNumero || r.numeroEntidadOrigen === cargoNumero);

export const getReclamosPorGiro = (giroNumero: string) =>
  reclamos.filter(r => r.giroAsociado === giroNumero || r.numeroEntidadOrigen === giroNumero);

export const getReclamosPorAduana = (codigoAduana: string) =>
  reclamos.filter(r => r.codigoAduana === codigoAduana || r.aduana === codigoAduana);

export const getReclamosPorVencer = (dias: number = 5) =>
  reclamos.filter(r => r.diasRespuesta > 0 && r.diasRespuesta <= dias);

export const puedeRegistrarAdmisibilidad = (reclamo: Reclamo): { valido: boolean; errores: string[] } => {
  const errores: string[] = [];
  if (reclamo.tipoReclamo !== 'TTA') errores.push('Solo aplica para reclamos TTA.');
  if (reclamo.estado !== 'Ingresado' && reclamo.estado !== 'En Admisibilidad') {
    errores.push('El reclamo ya pasó la etapa de admisibilidad.');
  }
  return { valido: errores.length === 0, errores };
};

export const puedeRegistrarFallo = (reclamo: Reclamo): { valido: boolean; errores: string[] } => {
  const errores: string[] = [];
  if (reclamo.tipoReclamo !== 'TTA') errores.push('Solo aplica para reclamos TTA.');
  if (!reclamo.datosTTA?.admisible) errores.push('El reclamo debe estar admitido antes de registrar un fallo.');
  if (reclamo.estado === 'Fallado' || reclamo.estado === 'Cerrado') {
    errores.push('El reclamo ya tiene un fallo registrado.');
  }
  return { valido: errores.length === 0, errores };
};

export const getPermisosReclamo = (reclamo: Reclamo): PermisosReclamo => {
  const permisos: PermisosReclamo = {
    puedeEditar: false,
    puedeRegistrarAdmisibilidad: false,
    puedeRegistrarFallo: false,
    puedeRegistrarApelacion: false,
    puedeCerrar: false,
    puedeGenerarInforme: true,
    camposEditables: [],
  };
  
  switch (reclamo.estado) {
    case 'Ingresado':
      permisos.puedeEditar = true;
      permisos.puedeRegistrarAdmisibilidad = reclamo.tipoReclamo === 'TTA';
      permisos.camposEditables = ['fundamentoReclamo', 'peticiones', 'observaciones'];
      break;
    case 'En Admisibilidad':
      permisos.puedeRegistrarAdmisibilidad = true;
      break;
    case 'Admitido':
    case 'En Tramitación':
      permisos.puedeRegistrarFallo = reclamo.tipoReclamo === 'TTA';
      break;
    case 'Pendiente Resolución':
      permisos.puedeEditar = reclamo.tipoReclamo === 'Reposición';
      permisos.camposEditables = ['resolucion', 'fundamentoResolucion'];
      break;
    case 'Fallado':
      permisos.puedeRegistrarApelacion = true;
      permisos.puedeCerrar = true;
      break;
    case 'Resuelto':
    case 'Rechazado':
    case 'Acogido':
    case 'Acogido Parcialmente':
      permisos.puedeCerrar = true;
      break;
  }
  
  return permisos;
};

export const getConteoReclamos = () => {
  const montoTotal = reclamos.reduce((sum, r) => sum + (r.montoReclamado || 0), 0);
  const montoResuelto = reclamos.reduce((sum, r) => sum + (r.montoResuelto || 0), 0);
  
  return {
    total: reclamos.length,
    porEstado: {
      ingresado: reclamos.filter(r => r.estado === 'Ingresado').length,
      enAdmisibilidad: reclamos.filter(r => r.estado === 'En Admisibilidad').length,
      admitido: reclamos.filter(r => r.estado === 'Admitido').length,
      enAnalisis: reclamos.filter(r => r.estado === 'En Análisis').length,
      enTramitacion: reclamos.filter(r => r.estado === 'En Tramitación').length,
      pendienteResolucion: reclamos.filter(r => r.estado === 'Pendiente Resolución').length,
      derivadoTribunal: reclamos.filter(r => r.estado === 'Derivado a Tribunal').length,
      fallado: reclamos.filter(r => r.estado === 'Fallado').length,
      resuelto: reclamos.filter(r => r.estado === 'Resuelto').length,
      rechazado: reclamos.filter(r => r.estado === 'Rechazado').length,
      acogido: reclamos.filter(r => r.estado === 'Acogido').length,
      acogidoParcialmente: reclamos.filter(r => r.estado === 'Acogido Parcialmente').length,
      cerrado: reclamos.filter(r => r.estado === 'Cerrado').length,
    },
    porTipo: {
      reposicion: reclamos.filter(r => r.tipoReclamo === 'Reposición').length,
      tta: reclamos.filter(r => r.tipoReclamo === 'TTA').length,
    },
    porOrigen: {
      denuncia: reclamos.filter(r => r.origenReclamo === 'DENUNCIA').length,
      cargo: reclamos.filter(r => r.origenReclamo === 'CARGO').length,
      giro: reclamos.filter(r => r.origenReclamo === 'GIRO').length,
      otro: reclamos.filter(r => r.origenReclamo === 'OTRO').length,
    },
    enAnalisis: reclamos.filter(r => ['En Análisis', 'En Admisibilidad', 'En Tramitación', 'Pendiente Resolución'].includes(r.estado)).length,
    resueltos: reclamos.filter(r => ['Resuelto', 'Acogido', 'Rechazado', 'Acogido Parcialmente', 'Fallado', 'Cerrado'].includes(r.estado)).length,
    derivadosTTA: reclamos.filter(r => r.tipoReclamo === 'TTA').length,
    pendientes: reclamos.filter(r => !['Cerrado', 'Resuelto', 'Rechazado', 'Acogido', 'Acogido Parcialmente', 'Fallado'].includes(r.estado)).length,
    tiempoPromedioRespuesta: Math.round(
      reclamos.filter(r => r.diasRespuesta > 0).reduce((sum, r) => sum + r.diasRespuesta, 0) / 
      Math.max(reclamos.filter(r => r.diasRespuesta > 0).length, 1)
    ),
    montoTotal,
    montoResuelto,
    montoTotalFormateado: '$' + montoTotal.toLocaleString('es-CL'),
    montoResueltoFormateado: '$' + montoResuelto.toLocaleString('es-CL'),
  };
};

let reclamoIdCounter = 11;

export const crearReclamo = (data: Partial<Reclamo>): Reclamo => {
  reclamoIdCounter++;
  const tipo = data.tipoReclamo || 'Reposición';
  const prefijo = tipo === 'TTA' ? 'TTA' : 'REP';
  
  const nuevoReclamo: Reclamo = {
    id: `r-${String(reclamoIdCounter).padStart(3, '0')}`,
    numeroReclamo: `REC-${prefijo}-2024-${String(48 + reclamoIdCounter).padStart(4, '0')}`,
    tipoReclamo: tipo,
    codigoProcesoReclamo: tipo === 'TTA' ? 'TTA' : 'REP',
    estado: 'Ingresado',
    fechaIngreso: new Date().toLocaleDateString('es-CL'),
    origenReclamo: data.origenReclamo || 'OTRO',
    denunciaAsociada: data.denunciaAsociada || '',
    reclamante: data.reclamante || '',
    rutReclamante: data.rutReclamante || '',
    diasRespuesta: tipo === 'TTA' ? 90 : 15,
    plazo: tipo === 'TTA' ? 90 : 15,
    descripcion: data.descripcion || '',
    fechaCreacion: new Date().toISOString(),
    usuarioCreacion: 'sistema',
    ...data,
  };
  
  reclamos.push(nuevoReclamo);
  return nuevoReclamo;
};

export const actualizarReclamo = (id: string, data: Partial<Reclamo>): Reclamo | null => {
  const index = reclamos.findIndex(r => r.id === id);
  if (index === -1) return null;
  reclamos[index] = { ...reclamos[index], ...data, fechaModificacion: new Date().toISOString() };
  return reclamos[index];
};

export const registrarAdmisibilidad = (
  reclamoId: string, 
  admisible: boolean, 
  motivoInadmisibilidad?: string
): { exito: boolean; reclamo?: Reclamo; error?: string } => {
  const index = reclamos.findIndex(r => r.id === reclamoId);
  if (index === -1) return { exito: false, error: 'Reclamo no encontrado' };
  
  const reclamo = reclamos[index];
  const validacion = puedeRegistrarAdmisibilidad(reclamo);
  if (!validacion.valido) return { exito: false, error: validacion.errores.join(' ') };
  
  const fechaAdmisibilidad = new Date().toLocaleDateString('es-CL');
  
  reclamos[index] = {
    ...reclamo,
    estado: admisible ? 'Admitido' : 'Rechazado',
    fechaAdmisibilidad,
    datosTTA: {
      ...reclamo.datosTTA,
      id: reclamo.datosTTA?.id || `tta-${reclamoId}`,
      reclamoId,
      admisible,
      fechaAdmisibilidad,
      motivoInadmisibilidad: admisible ? undefined : motivoInadmisibilidad,
    },
    fechaModificacion: new Date().toISOString(),
  };
  
  return { exito: true, reclamo: reclamos[index] };
};

export const registrarFallo = (
  reclamoId: string,
  tipoFallo: TipoFalloTTA,
  fundamentoFallo: string,
  montoFallo?: number,
  esApelacion: boolean = false
): { exito: boolean; reclamo?: Reclamo; error?: string } => {
  const index = reclamos.findIndex(r => r.id === reclamoId);
  if (index === -1) return { exito: false, error: 'Reclamo no encontrado' };
  
  const reclamo = reclamos[index];
  if (!esApelacion) {
    const validacion = puedeRegistrarFallo(reclamo);
    if (!validacion.valido) return { exito: false, error: validacion.errores.join(' ') };
  }
  
  const fechaFallo = new Date().toLocaleDateString('es-CL');
  
  if (esApelacion) {
    reclamos[index] = {
      ...reclamo,
      estado: 'Cerrado',
      montoResuelto: montoFallo,
      datosTTA: {
        ...reclamo.datosTTA!,
        falloApelacion: tipoFallo,
        fundamentoFalloApelacion: fundamentoFallo,
        fechaFalloFinal: fechaFallo,
        falloFinal: tipoFallo,
        fundamentoFalloFinal: fundamentoFallo,
        montoFalloFinal: montoFallo,
      },
      fechaResolucion: fechaFallo,
      fechaModificacion: new Date().toISOString(),
    };
  } else {
    reclamos[index] = {
      ...reclamo,
      estado: 'Fallado',
      montoResuelto: montoFallo,
      datosTTA: {
        ...reclamo.datosTTA!,
        fallo1raInstancia: tipoFallo,
        fundamentoFallo1ra: fundamentoFallo,
        fechaSentencia: fechaFallo,
        montoFallo1ra: montoFallo,
      },
      fechaResolucion: fechaFallo,
      fechaModificacion: new Date().toISOString(),
    };
  }
  
  return { exito: true, reclamo: reclamos[index] };
};
