/**
 * Base de datos mock - Notificaciones
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import type { 
  NotificacionHallazgo, 
  NotificacionDenuncia, 
  NotificacionReclamo, 
  NotificacionCargo 
} from './types';

// ============================================
// NOTIFICACIONES DE HALLAZGOS
// ============================================

export const notificacionesHallazgos: NotificacionHallazgo[] = [
  {
    id: "nh-001",
    numeroNotificacion: "PFI-12345",
    descripcion: "Nuevo hallazgo para notificar reclamación",
    numeroHallazgo: "PFI-123",
    fechaGeneracion: "23-12-2025",
    tipoHallazgo: "Infraccional",
    leido: false,
    estado: "Nuevo",
  },
  {
    id: "nh-002",
    numeroNotificacion: "PFI-12346",
    descripcion: "Hallazgo pendiente de revisión",
    numeroHallazgo: "PFI-124",
    fechaGeneracion: "22-12-2025",
    tipoHallazgo: "Penal",
    leido: false,
    estado: "Pendiente",
  },
  {
    id: "nh-003",
    numeroNotificacion: "PFI-12347",
    descripcion: "Hallazgo requiere acción inmediata",
    numeroHallazgo: "PFI-125",
    fechaGeneracion: "21-12-2025",
    tipoHallazgo: "Infraccional",
    leido: true,
    estado: "En gestión",
  },
  {
    id: "nh-004",
    numeroNotificacion: "PFI-12348",
    descripcion: "Hallazgo con plazo vencido",
    numeroHallazgo: "PFI-126",
    fechaGeneracion: "20-12-2025",
    tipoHallazgo: "Penal",
    leido: false,
    estado: "Vencido",
  },
  {
    id: "nh-005",
    numeroNotificacion: "PFI-12349",
    descripcion: "Nuevo hallazgo para gestión",
    numeroHallazgo: "PFI-127",
    fechaGeneracion: "19-12-2025",
    tipoHallazgo: "Infraccional",
    leido: true,
    estado: "Actualizado",
  },
  {
    id: "nh-006",
    numeroNotificacion: "PFI-12350",
    descripcion: "Hallazgo derivado a fiscalización",
    numeroHallazgo: "PFI-128",
    fechaGeneracion: "18-12-2025",
    tipoHallazgo: "Penal",
    leido: false,
    estado: "En gestión",
  },
  {
    id: "nh-007",
    numeroNotificacion: "PFI-12351",
    descripcion: "Hallazgo pendiente de notificación legal",
    numeroHallazgo: "PFI-129",
    fechaGeneracion: "17-12-2025",
    tipoHallazgo: "Infraccional",
    leido: false,
    estado: "Pendiente",
  },
  {
    id: "nh-008",
    numeroNotificacion: "PFI-12352",
    descripcion: "Hallazgo con documentación incompleta",
    numeroHallazgo: "PFI-130",
    fechaGeneracion: "16-12-2025",
    tipoHallazgo: "Penal",
    leido: true,
    estado: "Actualizado",
  },
];

// ============================================
// NOTIFICACIONES DE DENUNCIAS
// ============================================

export const notificacionesDenuncias: NotificacionDenuncia[] = [
  {
    id: "nd-001",
    numeroNotificacion: "88232",
    descripcion: "Gestión de registro de nueva denuncia",
    numeroDenuncia: "98315",
    tipoDenuncia: "Penal",
    fechaGeneracion: "23-12-2025",
    leido: false,
    estado: "Nuevo",
  },
  {
    id: "nd-002",
    numeroNotificacion: "88233",
    descripcion: "Denuncia requiere formulación",
    numeroDenuncia: "98316",
    tipoDenuncia: "Infraccional",
    fechaGeneracion: "22-12-2025",
    leido: false,
    estado: "Pendiente",
  },
  {
    id: "nd-003",
    numeroNotificacion: "88234",
    descripcion: "Denuncia pendiente de notificación",
    numeroDenuncia: "98317",
    tipoDenuncia: "Penal",
    fechaGeneracion: "21-12-2025",
    leido: true,
    estado: "En gestión",
  },
  {
    id: "nd-004",
    numeroNotificacion: "88235",
    descripcion: "Nueva denuncia ingresada",
    numeroDenuncia: "98318",
    tipoDenuncia: "Infraccional",
    fechaGeneracion: "20-12-2025",
    leido: false,
    estado: "Nuevo",
  },
  {
    id: "nd-005",
    numeroNotificacion: "88236",
    descripcion: "Denuncia con plazo próximo a vencer",
    numeroDenuncia: "98319",
    tipoDenuncia: "Penal",
    fechaGeneracion: "19-12-2025",
    leido: false,
    estado: "Pendiente",
  },
  {
    id: "nd-006",
    numeroNotificacion: "88237",
    descripcion: "Denuncia derivada desde hallazgo PFI-123",
    numeroDenuncia: "98320",
    tipoDenuncia: "Infraccional",
    fechaGeneracion: "18-12-2025",
    leido: true,
    estado: "En gestión",
  },
];

// ============================================
// NOTIFICACIONES DE RECLAMOS
// ============================================

export const notificacionesReclamos: NotificacionReclamo[] = [
  {
    id: "nr-001",
    numeroNotificacion: "22131",
    descripcion: "Reclamo sin gestión o plazos vencidos",
    numeroReclamo: "98315",
    tipoReclamo: "TTA",
    fechaGeneracion: "23-12-2025",
    leido: false,
    estado: "Vencido",
  },
  {
    id: "nr-002",
    numeroNotificacion: "22132",
    descripcion: "Reclamo requiere respuesta",
    numeroReclamo: "98316",
    tipoReclamo: "Reposición Administrativa",
    fechaGeneracion: "22-12-2025",
    leido: false,
    estado: "Pendiente",
  },
  {
    id: "nr-003",
    numeroNotificacion: "22133",
    descripcion: "Nuevo reclamo ingresado",
    numeroReclamo: "98317",
    tipoReclamo: "TTA",
    fechaGeneracion: "21-12-2025",
    leido: true,
    estado: "Nuevo",
  },
  {
    id: "nr-004",
    numeroNotificacion: "22134",
    descripcion: "Reclamo pendiente de análisis",
    numeroReclamo: "98318",
    tipoReclamo: "Reposición Administrativa",
    fechaGeneracion: "20-12-2025",
    leido: false,
    estado: "Pendiente",
  },
  {
    id: "nr-005",
    numeroNotificacion: "22135",
    descripcion: "Reclamo derivado a tribunal",
    numeroReclamo: "98319",
    tipoReclamo: "TTA",
    fechaGeneracion: "19-12-2025",
    leido: true,
    estado: "En gestión",
  },
];

// ============================================
// NOTIFICACIONES DE CARGOS
// ============================================

export const notificacionesCargos: NotificacionCargo[] = [
  {
    id: "nc-001",
    numeroNotificacion: "66212",
    descripcion: "Registro de nuevo cargo pendiente de acción",
    numeroCargo: "98315",
    fechaGeneracion: "23-12-2025",
    leido: false,
    estado: "Nuevo",
  },
  {
    id: "nc-002",
    numeroNotificacion: "66213",
    descripcion: "Cargo requiere aprobación",
    numeroCargo: "98316",
    fechaGeneracion: "22-12-2025",
    leido: false,
    estado: "Pendiente",
  },
  {
    id: "nc-003",
    numeroNotificacion: "66214",
    descripcion: "Cargo pendiente de revisión",
    numeroCargo: "98317",
    fechaGeneracion: "21-12-2025",
    leido: true,
    estado: "En gestión",
  },
  {
    id: "nc-004",
    numeroNotificacion: "66215",
    descripcion: "Nuevo cargo ingresado",
    numeroCargo: "98318",
    fechaGeneracion: "20-12-2025",
    leido: false,
    estado: "Nuevo",
  },
  {
    id: "nc-005",
    numeroNotificacion: "66216",
    descripcion: "Cargo con giro asociado pendiente",
    numeroCargo: "98319",
    fechaGeneracion: "19-12-2025",
    leido: false,
    estado: "Pendiente",
  },
  {
    id: "nc-006",
    numeroNotificacion: "66217",
    descripcion: "Cargo aprobado - generar giro",
    numeroCargo: "98320",
    fechaGeneracion: "18-12-2025",
    leido: true,
    estado: "Actualizado",
  },
];

// ============================================
// FUNCIONES HELPER PARA NOTIFICACIONES
// ============================================

export const getNotificacionesNoLeidas = () => {
  const hallazgosNoLeidos = notificacionesHallazgos.filter(n => !n.leido);
  const denunciasNoLeidas = notificacionesDenuncias.filter(n => !n.leido);
  const reclamosNoLeidos = notificacionesReclamos.filter(n => !n.leido);
  const cargosNoLeidos = notificacionesCargos.filter(n => !n.leido);

  return {
    hallazgos: hallazgosNoLeidos,
    denuncias: denunciasNoLeidas,
    reclamos: reclamosNoLeidos,
    cargos: cargosNoLeidos,
    total: hallazgosNoLeidos.length + denunciasNoLeidas.length + reclamosNoLeidos.length + cargosNoLeidos.length,
  };
};

export const getConteoNotificaciones = () => ({
  hallazgos: {
    total: notificacionesHallazgos.length,
    noLeidas: notificacionesHallazgos.filter(n => !n.leido).length,
  },
  denuncias: {
    total: notificacionesDenuncias.length,
    noLeidas: notificacionesDenuncias.filter(n => !n.leido).length,
  },
  reclamos: {
    total: notificacionesReclamos.length,
    noLeidas: notificacionesReclamos.filter(n => !n.leido).length,
  },
  cargos: {
    total: notificacionesCargos.length,
    noLeidas: notificacionesCargos.filter(n => !n.leido).length,
  },
  totalGeneral: 
    notificacionesHallazgos.length + 
    notificacionesDenuncias.length + 
    notificacionesReclamos.length + 
    notificacionesCargos.length,
  totalNoLeidas: 
    notificacionesHallazgos.filter(n => !n.leido).length + 
    notificacionesDenuncias.filter(n => !n.leido).length + 
    notificacionesReclamos.filter(n => !n.leido).length + 
    notificacionesCargos.filter(n => !n.leido).length,
});

// Obtener todas las notificaciones para el dropdown del header
export const getTodasLasNotificaciones = () => {
  const todas = [
    ...notificacionesHallazgos.map(n => ({
      id: n.id,
      numeroNotificacion: n.numeroNotificacion,
      descripcion: n.descripcion,
      fecha: n.fechaGeneracion,
      tipo: 'hallazgo' as const,
      leido: n.leido,
      numeroReferencia: n.numeroHallazgo,
    })),
    ...notificacionesDenuncias.map(n => ({
      id: n.id,
      numeroNotificacion: n.numeroNotificacion,
      descripcion: n.descripcion,
      fecha: n.fechaGeneracion,
      tipo: 'denuncia' as const,
      leido: n.leido,
      numeroReferencia: n.numeroDenuncia,
    })),
    ...notificacionesReclamos.map(n => ({
      id: n.id,
      numeroNotificacion: n.numeroNotificacion,
      descripcion: n.descripcion,
      fecha: n.fechaGeneracion,
      tipo: 'reclamo' as const,
      leido: n.leido,
      numeroReferencia: n.numeroReclamo,
    })),
    ...notificacionesCargos.map(n => ({
      id: n.id,
      numeroNotificacion: n.numeroNotificacion,
      descripcion: n.descripcion,
      fecha: n.fechaGeneracion,
      tipo: 'cargo' as const,
      leido: n.leido,
      numeroReferencia: n.numeroCargo,
    })),
  ];

  // Ordenar por fecha (más recientes primero)
  return todas.sort((a, b) => {
    const parseDate = (dateStr: string): Date => {
      const [day, month, year] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    };
    return parseDate(b.fecha).getTime() - parseDate(a.fecha).getTime();
  });
};

