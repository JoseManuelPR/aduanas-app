/**
 * Base de datos mock - Giros
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import type { Giro } from './types';

export const giros: Giro[] = [
  {
    id: "g-001",
    numeroGiro: "F09-2024-001234",
    tipoGiro: "F09",
    fechaEmision: "20-11-2025",
    fechaVencimiento: "20-12-2025",
    estado: "Emitido",
    montoTotal: "$12.500.000",
    emitidoA: "Importadora Global S.A.",
    rutDeudor: "76.123.456-7",
    cargoAsociado: "CAR-2024-005678",
  },
  {
    id: "g-002",
    numeroGiro: "F16-2024-000567",
    tipoGiro: "F16",
    fechaEmision: "15-11-2025",
    fechaVencimiento: "15-12-2025",
    estado: "Pagado",
    montoTotal: "$8.750.000",
    emitidoA: "Comercial Los Andes Ltda.",
    rutDeudor: "77.987.654-3",
    cargoAsociado: "CAR-2024-005679",
  },
  {
    id: "g-003",
    numeroGiro: "F09-2024-001235",
    tipoGiro: "F09",
    fechaEmision: "10-11-2025",
    fechaVencimiento: "25-11-2025",
    estado: "Vencido",
    montoTotal: "$3.450.000",
    emitidoA: "Zona Franca del Pacífico",
    rutDeudor: "81.321.654-9",
    cargoAsociado: "CAR-2024-005681",
  },
  {
    id: "g-004",
    numeroGiro: "F17-2024-000089",
    tipoGiro: "F17",
    fechaEmision: "18-11-2025",
    fechaVencimiento: "18-12-2025",
    estado: "Emitido",
    montoTotal: "$45.200.000",
    emitidoA: "Minera del Norte SpA",
    rutDeudor: "80.456.123-5",
    cargoAsociado: "CAR-2024-005680",
  },
  {
    id: "g-005",
    numeroGiro: "F09-2024-001236",
    tipoGiro: "F09",
    fechaEmision: "05-11-2025",
    fechaVencimiento: "05-12-2025",
    estado: "Pagado",
    montoTotal: "$15.800.000",
    emitidoA: "Exportadora del Sur S.A.",
    rutDeudor: "79.852.147-3",
  },
  {
    id: "g-006",
    numeroGiro: "F16-2024-000568",
    tipoGiro: "F16",
    fechaEmision: "12-11-2025",
    fechaVencimiento: "12-12-2025",
    estado: "Emitido",
    montoTotal: "$67.500.000",
    emitidoA: "Distribuidora Nacional S.A.",
    rutDeudor: "76.852.963-1",
    cargoAsociado: "CAR-2024-005683",
  },
  {
    id: "g-007",
    numeroGiro: "F09-2024-001237",
    tipoGiro: "F09",
    fechaEmision: "01-11-2025",
    fechaVencimiento: "20-11-2025",
    estado: "Vencido",
    montoTotal: "$5.200.000",
    emitidoA: "Comercial Norte Ltda.",
    rutDeudor: "78.963.741-5",
  },
  {
    id: "g-008",
    numeroGiro: "F17-2024-000090",
    tipoGiro: "F17",
    fechaEmision: "22-11-2025",
    fechaVencimiento: "22-12-2025",
    estado: "Emitido",
    montoTotal: "$9.800.000",
    emitidoA: "Importaciones del Sur Ltda.",
    rutDeudor: "78.456.789-0",
    cargoAsociado: "CAR-2024-005684",
  },
  {
    id: "g-009",
    numeroGiro: "F09-2024-001238",
    tipoGiro: "F09",
    fechaEmision: "08-11-2025",
    fechaVencimiento: "08-12-2025",
    estado: "Pagado",
    montoTotal: "$22.300.000",
    emitidoA: "Industrial Pacífico S.A.",
    rutDeudor: "77.159.357-8",
  },
  {
    id: "g-010",
    numeroGiro: "F16-2024-000569",
    tipoGiro: "F16",
    fechaEmision: "25-10-2025",
    fechaVencimiento: "15-11-2025",
    estado: "Anulado",
    montoTotal: "$4.100.000",
    emitidoA: "Servicios Logísticos Ltda.",
    rutDeudor: "79.357.159-2",
  },
];

// ============================================
// FUNCIONES HELPER PARA GIROS
// ============================================

export const getGiroPorNumero = (numero: string) => 
  giros.find(g => g.numeroGiro === numero);

export const getGirosPorEstado = (estado: Giro['estado']) =>
  giros.filter(g => g.estado === estado);

export const getGirosPorTipo = (tipo: Giro['tipoGiro']) =>
  giros.filter(g => g.tipoGiro === tipo);

export const getGirosVencidos = () =>
  giros.filter(g => g.estado === 'Vencido');

export const getGirosPorCargo = (cargoNumero: string) =>
  giros.filter(g => g.cargoAsociado === cargoNumero);

export const getConteoGiros = () => {
  const montoRecaudado = giros
    .filter(g => g.estado === 'Pagado')
    .reduce((sum, g) => {
      const monto = parseInt(g.montoTotal.replace(/[$,.]/g, ''));
      return sum + monto;
    }, 0);

  return {
    total: giros.length,
    porEstado: {
      emitido: giros.filter(g => g.estado === 'Emitido').length,
      pagado: giros.filter(g => g.estado === 'Pagado').length,
      vencido: giros.filter(g => g.estado === 'Vencido').length,
      anulado: giros.filter(g => g.estado === 'Anulado').length,
    },
    porTipo: {
      f09: giros.filter(g => g.tipoGiro === 'F09').length,
      f16: giros.filter(g => g.tipoGiro === 'F16').length,
      f17: giros.filter(g => g.tipoGiro === 'F17').length,
    },
    emitidos: giros.filter(g => g.estado === 'Emitido').length,
    pagados: giros.filter(g => g.estado === 'Pagado').length,
    vencidos: giros.filter(g => g.estado === 'Vencido').length,
    montoRecaudado,
    montoRecaudadoFormateado: '$' + montoRecaudado.toLocaleString('es-CL'),
  };
};

