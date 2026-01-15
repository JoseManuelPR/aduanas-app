/**
 * Base de datos mock - Jefes Revisores
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 * 
 * CU-005: Asignación del jefe revisor a la denuncia
 */

// ============================================
// TIPOS
// ============================================

export type DisponibilidadJefeRevisor = 'Disponible' | 'Ocupado' | 'Ausente' | 'Vacaciones';

export interface JefeRevisor {
  id: string;
  rut: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombreCompleto: string;
  email: string;
  telefono?: string;
  aduana: string;
  codigoAduana: string;
  seccion: string;
  cargo: string;
  disponibilidad: DisponibilidadJefeRevisor;
  casosAsignados: number;
  capacidadMaxima: number;
  especialidades?: string[];
  fechaUltimaAsignacion?: string;
  activo: boolean;
}

export interface AsignacionJefeRevisor {
  id: string;
  denunciaId: string;
  numeroDenuncia: string;
  jefeRevisorId: string;
  jefeRevisorNombre: string;
  fechaAsignacion: string;
  horaAsignacion: string;
  usuarioAsigna: string;
  rolUsuarioAsigna: string;
  observaciones?: string;
  estadoAnterior: string;
  estadoNuevo: string;
}

// ============================================
// DATOS MOCK - JEFES REVISORES
// ============================================

export const jefesRevisores: JefeRevisor[] = [
  {
    id: 'jr-001',
    rut: '12.345.678-9',
    nombre: 'Carlos',
    apellidoPaterno: 'Mendoza',
    apellidoMaterno: 'Vargas',
    nombreCompleto: 'Carlos Mendoza Vargas',
    email: 'cmendoza@aduana.cl',
    telefono: '+56 32 2456701',
    aduana: 'Valparaíso',
    codigoAduana: '032',
    seccion: 'Fiscalización',
    cargo: 'Jefe Revisor Infraccional',
    disponibilidad: 'Disponible',
    casosAsignados: 8,
    capacidadMaxima: 15,
    especialidades: ['Infraccional', 'Clasificación Arancelaria'],
    fechaUltimaAsignacion: '10-01-2026',
    activo: true,
  },
  {
    id: 'jr-002',
    rut: '13.456.789-0',
    nombre: 'Patricia',
    apellidoPaterno: 'Soto',
    apellidoMaterno: 'Ramírez',
    nombreCompleto: 'Patricia Soto Ramírez',
    email: 'psoto@aduana.cl',
    telefono: '+56 32 2456702',
    aduana: 'Valparaíso',
    codigoAduana: '032',
    seccion: 'Fiscalización Operativa',
    cargo: 'Jefe Revisor Penal',
    disponibilidad: 'Disponible',
    casosAsignados: 5,
    capacidadMaxima: 10,
    especialidades: ['Penal', 'Contrabando', 'Fraude'],
    fechaUltimaAsignacion: '08-01-2026',
    activo: true,
  },
  {
    id: 'jr-003',
    rut: '14.567.890-1',
    nombre: 'Roberto',
    apellidoPaterno: 'Fernández',
    apellidoMaterno: 'Castro',
    nombreCompleto: 'Roberto Fernández Castro',
    email: 'rfernandez@aduana.cl',
    telefono: '+56 2 29456703',
    aduana: 'Santiago',
    codigoAduana: '013',
    seccion: 'Fiscalización Zona Primaria',
    cargo: 'Jefe Revisor Senior',
    disponibilidad: 'Ocupado',
    casosAsignados: 15,
    capacidadMaxima: 15,
    especialidades: ['Infraccional', 'Penal', 'Valoración'],
    fechaUltimaAsignacion: '14-01-2026',
    activo: true,
  },
  {
    id: 'jr-004',
    rut: '15.678.901-2',
    nombre: 'María',
    apellidoPaterno: 'González',
    apellidoMaterno: 'Pérez',
    nombreCompleto: 'María González Pérez',
    email: 'mgonzalez@aduana.cl',
    telefono: '+56 2 29456704',
    aduana: 'Santiago',
    codigoAduana: '013',
    seccion: 'Fiscalización Post-Despacho',
    cargo: 'Jefe Revisor',
    disponibilidad: 'Disponible',
    casosAsignados: 7,
    capacidadMaxima: 12,
    especialidades: ['Infraccional', 'Valor Incorrecto'],
    fechaUltimaAsignacion: '12-01-2026',
    activo: true,
  },
  {
    id: 'jr-005',
    rut: '16.789.012-3',
    nombre: 'Andrés',
    apellidoPaterno: 'Muñoz',
    apellidoMaterno: 'Silva',
    nombreCompleto: 'Andrés Muñoz Silva',
    email: 'amunoz@aduana.cl',
    telefono: '+56 55 2456705',
    aduana: 'Antofagasta',
    codigoAduana: '055',
    seccion: 'Fiscalización',
    cargo: 'Jefe Revisor Regional',
    disponibilidad: 'Vacaciones',
    casosAsignados: 0,
    capacidadMaxima: 10,
    especialidades: ['Infraccional', 'Clasificación'],
    fechaUltimaAsignacion: '20-12-2025',
    activo: true,
  },
  {
    id: 'jr-006',
    rut: '17.890.123-4',
    nombre: 'Claudia',
    apellidoPaterno: 'Rojas',
    apellidoMaterno: 'Díaz',
    nombreCompleto: 'Claudia Rojas Díaz',
    email: 'crojas@aduana.cl',
    telefono: '+56 57 2456706',
    aduana: 'Iquique',
    codigoAduana: '057',
    seccion: 'Fiscalización Documental',
    cargo: 'Jefe Revisor',
    disponibilidad: 'Disponible',
    casosAsignados: 9,
    capacidadMaxima: 12,
    especialidades: ['Infraccional', 'Falsificación Documental'],
    fechaUltimaAsignacion: '11-01-2026',
    activo: true,
  },
  {
    id: 'jr-007',
    rut: '18.901.234-5',
    nombre: 'Fernando',
    apellidoPaterno: 'Vera',
    apellidoMaterno: 'López',
    nombreCompleto: 'Fernando Vera López',
    email: 'fvera@aduana.cl',
    telefono: '+56 34 2456707',
    aduana: 'Los Andes',
    codigoAduana: '034',
    seccion: 'Fiscalización Terrestre',
    cargo: 'Jefe Revisor',
    disponibilidad: 'Ausente',
    casosAsignados: 6,
    capacidadMaxima: 10,
    especialidades: ['Infraccional', 'Tránsito'],
    fechaUltimaAsignacion: '05-01-2026',
    activo: true,
  },
  {
    id: 'jr-008',
    rut: '19.012.345-6',
    nombre: 'Lorena',
    apellidoPaterno: 'Araya',
    apellidoMaterno: 'Contreras',
    nombreCompleto: 'Lorena Araya Contreras',
    email: 'laraya@aduana.cl',
    telefono: '+56 32 2456708',
    aduana: 'Valparaíso',
    codigoAduana: '032',
    seccion: 'Fiscalización Post-Despacho',
    cargo: 'Jefe Revisor',
    disponibilidad: 'Disponible',
    casosAsignados: 3,
    capacidadMaxima: 10,
    especialidades: ['Infraccional', 'Valor Aduanero'],
    fechaUltimaAsignacion: '13-01-2026',
    activo: true,
  },
];

// ============================================
// HISTORIAL DE ASIGNACIONES (para auditoría)
// ============================================

export const historialAsignaciones: AsignacionJefeRevisor[] = [
  {
    id: 'asig-001',
    denunciaId: 'd-001',
    numeroDenuncia: '993519',
    jefeRevisorId: 'jr-001',
    jefeRevisorNombre: 'Carlos Mendoza Vargas',
    fechaAsignacion: '15-11-2025',
    horaAsignacion: '10:30',
    usuarioAsigna: 'jrodriguez',
    rolUsuarioAsigna: 'Funcionario Fiscalizador',
    estadoAnterior: 'Borrador',
    estadoNuevo: 'Ingresada',
    observaciones: 'Asignación inicial por tipo de infracción',
  },
];

// ============================================
// FUNCIONES HELPER
// ============================================

/**
 * Obtiene todos los jefes revisores activos
 */
export const getJefesRevisoresActivos = (): JefeRevisor[] =>
  jefesRevisores.filter(jr => jr.activo);

/**
 * Obtiene jefes revisores por aduana
 */
export const getJefesRevisoresPorAduana = (aduana: string): JefeRevisor[] =>
  jefesRevisores.filter(jr => jr.activo && jr.aduana === aduana);

/**
 * Obtiene jefes revisores disponibles
 */
export const getJefesRevisoresDisponibles = (): JefeRevisor[] =>
  jefesRevisores.filter(jr => 
    jr.activo && 
    jr.disponibilidad === 'Disponible' && 
    jr.casosAsignados < jr.capacidadMaxima
  );

/**
 * Obtiene jefes revisores disponibles por aduana
 */
export const getJefesRevisoresDisponiblesPorAduana = (aduana: string): JefeRevisor[] =>
  jefesRevisores.filter(jr => 
    jr.activo && 
    jr.aduana === aduana &&
    jr.disponibilidad === 'Disponible' && 
    jr.casosAsignados < jr.capacidadMaxima
  );

/**
 * Obtiene un jefe revisor por ID
 */
export const getJefeRevisorPorId = (id: string): JefeRevisor | undefined =>
  jefesRevisores.find(jr => jr.id === id);

/**
 * Verifica si un jefe revisor tiene disponibilidad
 */
export const verificarDisponibilidad = (jefeRevisorId: string): { 
  disponible: boolean; 
  mensaje: string;
  razon?: 'ocupado' | 'ausente' | 'vacaciones' | 'capacidad';
} => {
  const jefeRevisor = getJefeRevisorPorId(jefeRevisorId);
  
  if (!jefeRevisor) {
    return { 
      disponible: false, 
      mensaje: 'Jefe Revisor no encontrado',
    };
  }

  if (!jefeRevisor.activo) {
    return { 
      disponible: false, 
      mensaje: 'El Jefe Revisor no se encuentra activo en el sistema',
    };
  }

  if (jefeRevisor.disponibilidad === 'Ocupado') {
    return { 
      disponible: false, 
      mensaje: 'El revisor seleccionado no tiene disponibilidad. Su carga de trabajo actual está al máximo.',
      razon: 'ocupado',
    };
  }

  if (jefeRevisor.disponibilidad === 'Ausente') {
    return { 
      disponible: false, 
      mensaje: 'El revisor seleccionado no tiene disponibilidad. Se encuentra temporalmente ausente.',
      razon: 'ausente',
    };
  }

  if (jefeRevisor.disponibilidad === 'Vacaciones') {
    return { 
      disponible: false, 
      mensaje: 'El revisor seleccionado no tiene disponibilidad. Se encuentra en período de vacaciones.',
      razon: 'vacaciones',
    };
  }

  if (jefeRevisor.casosAsignados >= jefeRevisor.capacidadMaxima) {
    return { 
      disponible: false, 
      mensaje: 'El revisor seleccionado no tiene disponibilidad. Ha alcanzado su capacidad máxima de casos.',
      razon: 'capacidad',
    };
  }

  return { 
    disponible: true, 
    mensaje: 'Jefe Revisor disponible para asignación',
  };
};

/**
 * Obtiene el color según la disponibilidad
 */
export const getColorDisponibilidad = (disponibilidad: DisponibilidadJefeRevisor): string => {
  switch (disponibilidad) {
    case 'Disponible':
      return 'bg-emerald-100 text-emerald-700';
    case 'Ocupado':
      return 'bg-red-100 text-red-700';
    case 'Ausente':
      return 'bg-amber-100 text-amber-700';
    case 'Vacaciones':
      return 'bg-blue-100 text-blue-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

/**
 * Calcula el porcentaje de carga de trabajo
 */
export const calcularCargaTrabajo = (jefeRevisor: JefeRevisor): number => {
  if (jefeRevisor.capacidadMaxima === 0) return 100;
  return Math.round((jefeRevisor.casosAsignados / jefeRevisor.capacidadMaxima) * 100);
};

/**
 * Obtiene el color según el porcentaje de carga
 */
export const getColorCargaTrabajo = (porcentaje: number): string => {
  if (porcentaje >= 90) return 'bg-red-500';
  if (porcentaje >= 70) return 'bg-amber-500';
  if (porcentaje >= 50) return 'bg-yellow-500';
  return 'bg-emerald-500';
};

/**
 * Registra una nueva asignación (mock)
 */
export const registrarAsignacion = (
  denunciaId: string,
  numeroDenuncia: string,
  jefeRevisorId: string,
  usuarioAsigna: string,
  rolUsuarioAsigna: string,
  observaciones?: string
): AsignacionJefeRevisor | null => {
  const jefeRevisor = getJefeRevisorPorId(jefeRevisorId);
  
  if (!jefeRevisor) return null;

  const verificacion = verificarDisponibilidad(jefeRevisorId);
  if (!verificacion.disponible) return null;

  const ahora = new Date();
  const fecha = ahora.toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).replace(/\//g, '-');
  const hora = ahora.toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const nuevaAsignacion: AsignacionJefeRevisor = {
    id: `asig-${Date.now()}`,
    denunciaId,
    numeroDenuncia,
    jefeRevisorId,
    jefeRevisorNombre: jefeRevisor.nombreCompleto,
    fechaAsignacion: fecha,
    horaAsignacion: hora,
    usuarioAsigna,
    rolUsuarioAsigna,
    estadoAnterior: 'Borrador',
    estadoNuevo: 'Ingresada',
    observaciones,
  };

  historialAsignaciones.push(nuevaAsignacion);
  
  // Actualizar casos asignados del jefe revisor (en memoria)
  jefeRevisor.casosAsignados++;
  jefeRevisor.fechaUltimaAsignacion = fecha;

  return nuevaAsignacion;
};

/**
 * Obtiene el historial de asignaciones de una denuncia
 */
export const getHistorialAsignacionesPorDenuncia = (denunciaId: string): AsignacionJefeRevisor[] =>
  historialAsignaciones.filter(a => a.denunciaId === denunciaId);

/**
 * Obtiene estadísticas de jefes revisores
 */
export const getEstadisticasJefesRevisores = () => {
  const activos = jefesRevisores.filter(jr => jr.activo);
  const disponibles = activos.filter(jr => jr.disponibilidad === 'Disponible');
  const ocupados = activos.filter(jr => jr.disponibilidad === 'Ocupado');
  const ausentes = activos.filter(jr => jr.disponibilidad === 'Ausente');
  const enVacaciones = activos.filter(jr => jr.disponibilidad === 'Vacaciones');

  const totalCasosAsignados = activos.reduce((sum, jr) => sum + jr.casosAsignados, 0);
  const totalCapacidad = activos.reduce((sum, jr) => sum + jr.capacidadMaxima, 0);

  return {
    totalActivos: activos.length,
    disponibles: disponibles.length,
    ocupados: ocupados.length,
    ausentes: ausentes.length,
    enVacaciones: enVacaciones.length,
    totalCasosAsignados,
    totalCapacidad,
    porcentajeOcupacion: totalCapacidad > 0 
      ? Math.round((totalCasosAsignados / totalCapacidad) * 100) 
      : 0,
  };
};
