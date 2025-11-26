/**
 * Base de datos mock - Cargos
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import type { Cargo } from './types';

export const cargos: Cargo[] = [
  {
    id: "c-001",
    numeroCargo: "CAR-2024-005678",
    fechaIngreso: "18-11-2025",
    estado: "Pendiente Aprobación",
    aduana: "Valparaíso",
    rutDeudor: "76.123.456-7",
    nombreDeudor: "Importadora Global S.A.",
    montoTotal: "$12.500.000",
    diasVencimiento: 8,
    denunciaAsociada: "993519",
  },
  {
    id: "c-002",
    numeroCargo: "CAR-2024-005679",
    fechaIngreso: "12-11-2025",
    estado: "Aprobado",
    aduana: "Santiago",
    rutDeudor: "77.987.654-3",
    nombreDeudor: "Comercial Los Andes Ltda.",
    montoTotal: "$8.750.000",
    diasVencimiento: 3,
    denunciaAsociada: "993520",
  },
  {
    id: "c-003",
    numeroCargo: "CAR-2024-005680",
    fechaIngreso: "08-11-2025",
    estado: "En Revisión",
    aduana: "Antofagasta",
    rutDeudor: "80.456.123-5",
    nombreDeudor: "Minera del Norte SpA",
    montoTotal: "$45.200.000",
    diasVencimiento: -1,
    denunciaAsociada: "993521",
  },
  {
    id: "c-004",
    numeroCargo: "CAR-2024-005681",
    fechaIngreso: "05-11-2025",
    estado: "Notificado",
    aduana: "Iquique",
    rutDeudor: "81.321.654-9",
    nombreDeudor: "Zona Franca del Pacífico",
    montoTotal: "$3.450.000",
    diasVencimiento: 0,
    denunciaAsociada: "993522",
  },
  {
    id: "c-005",
    numeroCargo: "CAR-2024-005682",
    fechaIngreso: "01-11-2025",
    estado: "Rechazado",
    aduana: "Los Andes",
    rutDeudor: "79.147.258-6",
    nombreDeudor: "Transportes Cordillera Ltda.",
    montoTotal: "$1.250.000",
    diasVencimiento: 15,
  },
  {
    id: "c-006",
    numeroCargo: "CAR-2024-005683",
    fechaIngreso: "15-11-2025",
    estado: "Pendiente Aprobación",
    aduana: "Valparaíso",
    rutDeudor: "76.852.963-1",
    nombreDeudor: "Distribuidora Nacional S.A.",
    montoTotal: "$67.500.000",
    diasVencimiento: 5,
    denunciaAsociada: "993524",
  },
  {
    id: "c-007",
    numeroCargo: "CAR-2024-005684",
    fechaIngreso: "20-11-2025",
    estado: "En Revisión",
    aduana: "Santiago",
    rutDeudor: "78.456.789-0",
    nombreDeudor: "Importaciones del Sur Ltda.",
    montoTotal: "$9.800.000",
    diasVencimiento: 10,
    denunciaAsociada: "993525",
  },
];

// ============================================
// FUNCIONES HELPER PARA CARGOS
// ============================================

export const getCargoPorNumero = (numero: string) => 
  cargos.find(c => c.numeroCargo === numero);

export const getCargosPorEstado = (estado: Cargo['estado']) =>
  cargos.filter(c => c.estado === estado);

export const getCargosVencidos = () =>
  cargos.filter(c => c.diasVencimiento < 0);

export const getCargosPorVencer = (dias: number = 5) =>
  cargos.filter(c => c.diasVencimiento >= 0 && c.diasVencimiento <= dias);

export const getCargosPorDenuncia = (denunciaNumero: string) =>
  cargos.filter(c => c.denunciaAsociada === denunciaNumero);

export const getConteoCargos = () => ({
  total: cargos.length,
  porEstado: {
    pendienteAprobacion: cargos.filter(c => c.estado === 'Pendiente Aprobación').length,
    enRevision: cargos.filter(c => c.estado === 'En Revisión').length,
    aprobado: cargos.filter(c => c.estado === 'Aprobado').length,
    rechazado: cargos.filter(c => c.estado === 'Rechazado').length,
    notificado: cargos.filter(c => c.estado === 'Notificado').length,
  },
  vencidos: cargos.filter(c => c.diasVencimiento < 0).length,
  porVencer: cargos.filter(c => c.diasVencimiento >= 0 && c.diasVencimiento <= 5).length,
  pendientes: cargos.filter(c => ['Pendiente Aprobación', 'En Revisión'].includes(c.estado)).length,
  aprobados: cargos.filter(c => c.estado === 'Aprobado').length,
  rechazados: cargos.filter(c => c.estado === 'Rechazado').length,
  montoTotal: cargos.reduce((sum, c) => {
    const monto = parseInt(c.montoTotal.replace(/[$,.]/g, ''));
    return sum + monto;
  }, 0),
});

export const formatMonto = (monto: number): string => {
  return '$' + monto.toLocaleString('es-CL');
};

