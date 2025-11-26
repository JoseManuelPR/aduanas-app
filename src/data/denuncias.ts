/**
 * Base de datos mock - Denuncias
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import type { Denuncia } from './types';

export const denuncias: Denuncia[] = [
  {
    id: "d-001",
    numeroDenuncia: "993519",
    fechaIngreso: "15-11-2025",
    estado: "En Revisión",
    tipoDenuncia: "Infraccional",
    aduana: "Valparaíso",
    rutDeudor: "76.123.456-7",
    nombreDeudor: "Importadora Global S.A.",
    tipoInfraccion: "Declaración Falsa",
    diasVencimiento: 5,
    montoEstimado: "$12.500.000",
    hallazgoOrigen: "PFI-123",
  },
  {
    id: "d-002",
    numeroDenuncia: "993520",
    fechaIngreso: "10-11-2025",
    estado: "Formulada",
    tipoDenuncia: "Penal",
    aduana: "Santiago",
    rutDeudor: "77.987.654-3",
    nombreDeudor: "Comercial Los Andes Ltda.",
    tipoInfraccion: "Contrabando",
    diasVencimiento: -2,
    montoEstimado: "$8.750.000",
    hallazgoOrigen: "PFI-124",
  },
  {
    id: "d-003",
    numeroDenuncia: "993521",
    fechaIngreso: "20-11-2025",
    estado: "Ingresada",
    tipoDenuncia: "Infraccional",
    aduana: "Antofagasta",
    rutDeudor: "80.456.123-5",
    nombreDeudor: "Minera del Norte SpA",
    tipoInfraccion: "Fraude Aduanero",
    diasVencimiento: 15,
    montoEstimado: "$45.200.000",
  },
  {
    id: "d-004",
    numeroDenuncia: "993522",
    fechaIngreso: "05-11-2025",
    estado: "Notificada",
    tipoDenuncia: "Penal",
    aduana: "Iquique",
    rutDeudor: "81.321.654-9",
    nombreDeudor: "Zona Franca del Pacífico",
    tipoInfraccion: "Declaración Falsa",
    diasVencimiento: 0,
    montoEstimado: "$3.450.000",
  },
  {
    id: "d-005",
    numeroDenuncia: "993523",
    fechaIngreso: "28-10-2025",
    estado: "Cerrada",
    tipoDenuncia: "Infraccional",
    aduana: "Los Andes",
    rutDeudor: "79.147.258-6",
    nombreDeudor: "Transportes Cordillera Ltda.",
    tipoInfraccion: "Otros",
    diasVencimiento: 30,
    montoEstimado: "$1.250.000",
  },
  {
    id: "d-006",
    numeroDenuncia: "993524",
    fechaIngreso: "12-11-2025",
    estado: "En Proceso",
    tipoDenuncia: "Penal",
    aduana: "Valparaíso",
    rutDeudor: "76.852.963-1",
    nombreDeudor: "Distribuidora Nacional S.A.",
    tipoInfraccion: "Contrabando",
    diasVencimiento: 8,
    montoEstimado: "$67.500.000",
    hallazgoOrigen: "PFI-128",
  },
  {
    id: "d-007",
    numeroDenuncia: "993525",
    fechaIngreso: "18-11-2025",
    estado: "En Revisión",
    tipoDenuncia: "Infraccional",
    aduana: "Santiago",
    rutDeudor: "78.456.789-0",
    nombreDeudor: "Importaciones del Sur Ltda.",
    tipoInfraccion: "Declaración Falsa",
    diasVencimiento: 3,
    montoEstimado: "$9.800.000",
  },
];

// ============================================
// FUNCIONES HELPER PARA DENUNCIAS
// ============================================

export const getDenunciaPorNumero = (numero: string) => 
  denuncias.find(d => d.numeroDenuncia === numero);

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

export const getConteoDenuncias = () => ({
  total: denuncias.length,
  porEstado: {
    ingresada: denuncias.filter(d => d.estado === 'Ingresada').length,
    enRevision: denuncias.filter(d => d.estado === 'En Revisión').length,
    formulada: denuncias.filter(d => d.estado === 'Formulada').length,
    notificada: denuncias.filter(d => d.estado === 'Notificada').length,
    enProceso: denuncias.filter(d => d.estado === 'En Proceso').length,
    cerrada: denuncias.filter(d => d.estado === 'Cerrada').length,
  },
  porTipo: {
    infraccional: denuncias.filter(d => d.tipoDenuncia === 'Infraccional').length,
    penal: denuncias.filter(d => d.tipoDenuncia === 'Penal').length,
  },
  vencidas: denuncias.filter(d => d.diasVencimiento < 0).length,
  porVencer: denuncias.filter(d => d.diasVencimiento >= 0 && d.diasVencimiento <= 5).length,
  pendientes: denuncias.filter(d => ['Ingresada', 'En Revisión'].includes(d.estado)).length,
  enProceso: denuncias.filter(d => ['Formulada', 'Notificada', 'En Proceso'].includes(d.estado)).length,
  resueltas: denuncias.filter(d => d.estado === 'Cerrada').length,
});

