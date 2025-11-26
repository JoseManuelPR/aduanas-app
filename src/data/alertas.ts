/**
 * Base de datos mock - Alertas
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import type { Alerta } from './types';

export const alertas: Alerta[] = [
  {
    id: "a-001",
    tipo: "vencido",
    titulo: "Denuncia 993520 VENCIDA",
    descripcion: "Plazo de formulación excedido por 2 días",
    expediente: "993520",
    fechaVencimiento: "18-11-2025",
    diasVencidos: 2,
  },
  {
    id: "a-002",
    tipo: "critico",
    titulo: "Cargo CAR-2024-005680 próximo a vencer",
    descripcion: "Vence mañana - Requiere aprobación inmediata",
    expediente: "CAR-2024-005680",
    fechaVencimiento: "21-11-2025",
    diasRestantes: 1,
  },
  {
    id: "a-003",
    tipo: "advertencia",
    titulo: "Reclamo REC-REP-2024-0045 - 5 días para responder",
    descripcion: "Plazo normativo de respuesta próximo",
    expediente: "REC-REP-2024-0045",
    fechaVencimiento: "25-11-2025",
    diasRestantes: 5,
  },
  {
    id: "a-004",
    tipo: "informativo",
    titulo: "8 notificaciones pendientes de envío",
    descripcion: "Notificaciones electrónicas en cola",
    expediente: "Varios",
    cantidad: 8,
  },
  {
    id: "a-005",
    tipo: "vencido",
    titulo: "Giro F09-2024-001235 VENCIDO",
    descripcion: "Giro vencido hace 5 días sin pago",
    expediente: "F09-2024-001235",
    fechaVencimiento: "25-11-2025",
    diasVencidos: 5,
  },
  {
    id: "a-006",
    tipo: "critico",
    titulo: "Hallazgo PFI-124 requiere acción",
    descripcion: "Plazo de análisis vencido",
    expediente: "PFI-124",
    fechaVencimiento: "20-11-2025",
    diasVencidos: 2,
  },
  {
    id: "a-007",
    tipo: "advertencia",
    titulo: "3 denuncias próximas a vencer",
    descripcion: "Plazo de formulación en menos de 5 días",
    expediente: "Varios",
    diasRestantes: 5,
    cantidad: 3,
  },
];

// ============================================
// FUNCIONES HELPER PARA ALERTAS
// ============================================

export const getAlertasPorTipo = (tipo: Alerta['tipo']) =>
  alertas.filter(a => a.tipo === tipo);

export const getAlertasVencidas = () =>
  alertas.filter(a => a.tipo === 'vencido');

export const getAlertasCriticas = () =>
  alertas.filter(a => a.tipo === 'critico' || a.tipo === 'vencido');

export const getConteoAlertas = () => ({
  total: alertas.length,
  vencidas: alertas.filter(a => a.tipo === 'vencido').length,
  criticas: alertas.filter(a => a.tipo === 'critico').length,
  advertencias: alertas.filter(a => a.tipo === 'advertencia').length,
  informativas: alertas.filter(a => a.tipo === 'informativo').length,
});

