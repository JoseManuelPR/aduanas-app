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
    descripcion: "Diferencias en declaración de mercancías",
    montoEstimado: "$12.500.000",
    diasVencimiento: 5,
    funcionarioAsignado: "Juan Rodríguez",
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
    descripcion: "Sospecha de contrabando de mercancías",
    montoEstimado: "$45.000.000",
    diasVencimiento: -2,
    funcionarioAsignado: "María González",
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
    descripcion: "Clasificación arancelaria incorrecta",
    montoEstimado: "$8.750.000",
    diasVencimiento: 15,
    funcionarioAsignado: "Carlos Pérez",
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
    descripcion: "Falsificación de documentos de origen",
    montoEstimado: "$67.300.000",
    diasVencimiento: 0,
    funcionarioAsignado: "Ana Martínez",
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
    descripcion: "Error en valor declarado",
    montoEstimado: "$3.450.000",
    diasVencimiento: 30,
    funcionarioAsignado: "Pedro López",
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
    descripcion: "Posible subfacturación sistemática",
    montoEstimado: "$89.500.000",
    diasVencimiento: 8,
    funcionarioAsignado: "Juan Rodríguez",
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
    descripcion: "Mercancía sin documentación",
    montoEstimado: "$15.200.000",
    diasVencimiento: 12,
    funcionarioAsignado: "María González",
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
    descripcion: "Evasión de derechos aduaneros",
    montoEstimado: "$125.000.000",
    diasVencimiento: 3,
    funcionarioAsignado: "Carlos Pérez",
  },
];

// ============================================
// FUNCIONES HELPER PARA HALLAZGOS
// ============================================

export const getHallazgoPorNumero = (numero: string) => 
  hallazgos.find(h => h.numeroHallazgo === numero);

export const getHallazgosPorEstado = (estado: Hallazgo['estado']) =>
  hallazgos.filter(h => h.estado === estado);

export const getHallazgosPorTipo = (tipo: Hallazgo['tipoHallazgo']) =>
  hallazgos.filter(h => h.tipoHallazgo === tipo);

export const getHallazgosVencidos = () =>
  hallazgos.filter(h => h.diasVencimiento < 0);

export const getHallazgosPorVencer = (dias: number = 5) =>
  hallazgos.filter(h => h.diasVencimiento >= 0 && h.diasVencimiento <= dias);

export const getConteoHallazgos = () => ({
  total: hallazgos.length,
  porEstado: {
    ingresado: hallazgos.filter(h => h.estado === 'Ingresado').length,
    enAnalisis: hallazgos.filter(h => h.estado === 'En Análisis').length,
    notificarDenuncia: hallazgos.filter(h => h.estado === 'Notificar Denuncia').length,
    derivado: hallazgos.filter(h => h.estado === 'Derivado').length,
    cerrado: hallazgos.filter(h => h.estado === 'Cerrado').length,
  },
  porTipo: {
    infraccional: hallazgos.filter(h => h.tipoHallazgo === 'Infraccional').length,
    penal: hallazgos.filter(h => h.tipoHallazgo === 'Penal').length,
  },
  vencidos: hallazgos.filter(h => h.diasVencimiento < 0).length,
  porVencer: hallazgos.filter(h => h.diasVencimiento >= 0 && h.diasVencimiento <= 5).length,
});

