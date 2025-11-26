/**
 * Base de datos mock - KPIs y Estadísticas
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import type { KPIDashboard } from './types';
import { getConteoDenuncias } from './denuncias';
import { getConteoCargos, formatMonto } from './cargos';
import { getConteoGiros } from './giros';
import { getConteoReclamos } from './reclamos';
import { getConteoNotificaciones } from './notificaciones';

// ============================================
// KPIs DEL DASHBOARD
// ============================================

export const getKPIDashboard = (): KPIDashboard => {
  const denuncias = getConteoDenuncias();
  const cargos = getConteoCargos();
  const giros = getConteoGiros();
  const reclamosData = getConteoReclamos();
  const notificaciones = getConteoNotificaciones();

  return {
    denuncias: {
      total: denuncias.total,
      pendientes: denuncias.pendientes,
      enProceso: denuncias.enProceso,
      resueltas: denuncias.resueltas,
      porVencer: denuncias.porVencer,
      vencidas: denuncias.vencidas,
    },
    cargos: {
      total: cargos.total,
      pendientes: cargos.pendientes,
      aprobados: cargos.aprobados,
      rechazados: cargos.rechazados,
      montoTotal: formatMonto(cargos.montoTotal),
    },
    giros: {
      total: giros.total,
      emitidos: giros.emitidos,
      pagados: giros.pagados,
      vencidos: giros.vencidos,
      montoRecaudado: giros.montoRecaudadoFormateado,
    },
    reclamos: {
      total: reclamosData.total,
      enAnalisis: reclamosData.enAnalisis,
      resueltos: reclamosData.resueltos,
      derivadosTTA: reclamosData.derivadosTTA,
      tiempoPromedioRespuesta: reclamosData.tiempoPromedioRespuesta,
    },
    notificaciones: {
      enviadas: notificaciones.totalGeneral - notificaciones.totalNoLeidas,
      leidas: notificaciones.totalGeneral - notificaciones.totalNoLeidas,
      pendientes: notificaciones.totalNoLeidas,
      conError: 0, // Este valor podría venir de otro lugar
      tasaExito: Math.round(((notificaciones.totalGeneral - notificaciones.totalNoLeidas) / notificaciones.totalGeneral) * 100 * 10) / 10,
    },
  };
};

// ============================================
// ESTADÍSTICAS ADICIONALES
// ============================================

export const getEstadisticasGenerales = () => {
  const denuncias = getConteoDenuncias();
  const cargos = getConteoCargos();
  const giros = getConteoGiros();
  const reclamos = getConteoReclamos();

  return {
    totalExpedientes: denuncias.total + cargos.total + giros.total + reclamos.total,
    expedientesPendientes: denuncias.pendientes + cargos.pendientes,
    expedientesVencidos: denuncias.vencidas + cargos.vencidos + giros.vencidos,
    tasaResolucion: Math.round(
      ((denuncias.resueltas + reclamos.resueltos) / (denuncias.total + reclamos.total)) * 100
    ),
    montoTotalGestionado: formatMonto(cargos.montoTotal),
    montoRecaudado: giros.montoRecaudadoFormateado,
  };
};

