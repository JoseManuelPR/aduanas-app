/**
 * Base de datos mock - Audiencias
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 * 
 * Realizar Audiencia (comparecencia, allanamiento o no comparecencia)
 */

// ============================================
// TIPOS
// ============================================

export type TipoResultadoAudiencia = 'Allanamiento' | 'Desacuerdo' | 'No Comparecencia' | 'Pendiente';
export type EstadoAudiencia = 'Programada' | 'En Curso' | 'Finalizada' | 'Cancelada' | 'Reprogramada';

export interface DocumentoAudiencia {
  id: string;
  nombre: string;
  tipo: string;
  tamanio: string;
  fechaSubida: string;
  descripcion?: string;
}

export interface DeclaracionAudiencia {
  id: string;
  fecha: string;
  hora: string;
  declarante: string;
  tipoDeclarante: 'Infractor' | 'Representante Legal' | 'Testigo' | 'Perito';
  contenido: string;
  registradoPor: string;
}

export interface Audiencia {
  id: string;
  numeroAudiencia: string;
  
  // Relación con denuncia
  denunciaId: string;
  numeroDenuncia: string;
  
  // Datos de la audiencia
  fechaProgramada: string;
  horaProgramada: string;
  fechaRealizacion?: string;
  horaInicio?: string;
  horaFin?: string;
  
  // Lugar
  sala: string;
  direccion: string;
  modalidad: 'Presencial' | 'Virtual' | 'Mixta';
  
  // Participantes
  juezInstructor: string;
  loginJuezInstructor: string;
  fiscalizador?: string;
  loginFiscalizador?: string;
  
  // Infractor
  infractorRut: string;
  infractorNombre: string;
  infractorComparecio: boolean;
  representanteLegal?: string;
  
  // Estado y resultado
  estado: EstadoAudiencia;
  resultado: TipoResultadoAudiencia;
  
  // Allanamiento
  allanamiento: boolean;
  autodenuncio: boolean;
  
  // Montos (si hay allanamiento se aplica multa atenuada)
  multaOriginal: number;
  multaAtenuada?: number;
  porcentajeAtenuacion?: number;
  
  // Declaraciones y antecedentes
  declaraciones: DeclaracionAudiencia[];
  antecedentesEntregados: DocumentoAudiencia[];
  
  // Alegaciones del infractor
  alegaciones?: string;
  
  // Observaciones
  observaciones?: string;
  
  // Acta
  actaGenerada: boolean;
  numeroActa?: string;
  fechaActa?: string;
  
  // Auditoría
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaModificacion?: string;
  usuarioModificacion?: string;
}

// ============================================
// DATOS MOCK
// ============================================

export const audiencias: Audiencia[] = [
  {
    id: "aud-001",
    numeroAudiencia: "AUD-2025-000001",
    denunciaId: "d-001",
    numeroDenuncia: "993519",
    fechaProgramada: "25-11-2025",
    horaProgramada: "10:00",
    fechaRealizacion: "25-11-2025",
    horaInicio: "10:05",
    horaFin: "11:30",
    sala: "Sala de Audiencias 1",
    direccion: "Blanco 951, Piso 4, Valparaíso",
    modalidad: "Presencial",
    juezInstructor: "Juan Rodríguez",
    loginJuezInstructor: "jrodriguez",
    fiscalizador: "María González",
    loginFiscalizador: "mgonzalez",
    infractorRut: "76.123.456-7",
    infractorNombre: "Importadora Global S.A.",
    infractorComparecio: true,
    representanteLegal: "Roberto Sánchez Muñoz",
    estado: "Finalizada",
    resultado: "Allanamiento",
    allanamiento: true,
    autodenuncio: false,
    multaOriginal: 5000000,
    multaAtenuada: 3000000,
    porcentajeAtenuacion: 40,
    declaraciones: [
      {
        id: "dec-001",
        fecha: "25-11-2025",
        hora: "10:15",
        declarante: "Roberto Sánchez Muñoz",
        tipoDeclarante: "Representante Legal",
        contenido: "En representación de Importadora Global S.A., reconozco los hechos denunciados y acepto la responsabilidad por las diferencias detectadas en la declaración de importación. Solicito acogernos al beneficio de allanamiento para acceder a la multa atenuada.",
        registradoPor: "jrodriguez",
      },
    ],
    antecedentesEntregados: [
      {
        id: "ant-001",
        nombre: "carta_allanamiento.pdf",
        tipo: "pdf",
        tamanio: "245 KB",
        fechaSubida: "25-11-2025",
        descripcion: "Carta formal de allanamiento firmada por representante legal",
      },
      {
        id: "ant-002",
        nombre: "poder_representacion.pdf",
        tipo: "pdf",
        tamanio: "1.2 MB",
        fechaSubida: "25-11-2025",
        descripcion: "Poder de representación del abogado",
      },
    ],
    alegaciones: "El representante legal reconoce los hechos y solicita el beneficio de allanamiento.",
    observaciones: "Audiencia desarrollada sin incidentes. El infractor compareció representado y aceptó los cargos.",
    actaGenerada: true,
    numeroActa: "ACTA-2025-000001",
    fechaActa: "25-11-2025",
    fechaCreacion: "20-11-2025",
    usuarioCreacion: "jrodriguez",
    fechaModificacion: "25-11-2025",
    usuarioModificacion: "jrodriguez",
  },
  {
    id: "aud-002",
    numeroAudiencia: "AUD-2025-000002",
    denunciaId: "d-003",
    numeroDenuncia: "993521",
    fechaProgramada: "28-11-2025",
    horaProgramada: "15:00",
    sala: "Sala de Audiencias 2",
    direccion: "Av. Angamos 2500, Antofagasta",
    modalidad: "Presencial",
    juezInstructor: "Carlos Pérez",
    loginJuezInstructor: "cperez",
    infractorRut: "80.456.123-5",
    infractorNombre: "Minera del Norte SpA",
    infractorComparecio: false,
    estado: "Programada",
    resultado: "Pendiente",
    allanamiento: false,
    autodenuncio: false,
    multaOriginal: 2500000,
    declaraciones: [],
    antecedentesEntregados: [],
    actaGenerada: false,
    fechaCreacion: "22-11-2025",
    usuarioCreacion: "cperez",
  },
  {
    id: "aud-003",
    numeroAudiencia: "AUD-2025-000003",
    denunciaId: "d-007",
    numeroDenuncia: "993525",
    fechaProgramada: "26-11-2025",
    horaProgramada: "09:30",
    fechaRealizacion: "26-11-2025",
    horaInicio: "09:35",
    horaFin: "10:00",
    sala: "Sala de Audiencias 1",
    direccion: "Av. Libertador Bernardo O'Higgins 1449, Santiago",
    modalidad: "Presencial",
    juezInstructor: "María González",
    loginJuezInstructor: "mgonzalez",
    infractorRut: "78.456.789-0",
    infractorNombre: "Importaciones del Sur Ltda.",
    infractorComparecio: false,
    estado: "Finalizada",
    resultado: "No Comparecencia",
    allanamiento: false,
    autodenuncio: false,
    multaOriginal: 2000000,
    declaraciones: [],
    antecedentesEntregados: [],
    observaciones: "El infractor no compareció a la audiencia programada. Se aplicará multa máxima según normativa vigente.",
    actaGenerada: true,
    numeroActa: "ACTA-2025-000002",
    fechaActa: "26-11-2025",
    fechaCreacion: "20-11-2025",
    usuarioCreacion: "mgonzalez",
    fechaModificacion: "26-11-2025",
    usuarioModificacion: "mgonzalez",
  },
  {
    id: "aud-004",
    numeroAudiencia: "AUD-2025-000004",
    denunciaId: "d-005",
    numeroDenuncia: "993523",
    fechaProgramada: "22-11-2025",
    horaProgramada: "11:00",
    fechaRealizacion: "22-11-2025",
    horaInicio: "11:10",
    horaFin: "12:45",
    sala: "Sala de Audiencias 1",
    direccion: "Ruta 60 CH Km 85, Los Andes",
    modalidad: "Presencial",
    juezInstructor: "Pedro López",
    loginJuezInstructor: "plopez",
    infractorRut: "79.147.258-6",
    infractorNombre: "Transportes Cordillera Ltda.",
    infractorComparecio: true,
    estado: "Finalizada",
    resultado: "Desacuerdo",
    allanamiento: false,
    autodenuncio: false,
    multaOriginal: 1250000,
    declaraciones: [
      {
        id: "dec-002",
        fecha: "22-11-2025",
        hora: "11:20",
        declarante: "Fernando Muñoz Bravo",
        tipoDeclarante: "Representante Legal",
        contenido: "Mi representado no acepta los cargos formulados. Consideramos que el error en el valor declarado se debió a fluctuaciones del tipo de cambio que no pudieron ser previstas al momento de la declaración. Solicitamos se considere esta circunstancia atenuante.",
        registradoPor: "plopez",
      },
    ],
    antecedentesEntregados: [
      {
        id: "ant-003",
        nombre: "historial_tipo_cambio.pdf",
        tipo: "pdf",
        tamanio: "456 KB",
        fechaSubida: "22-11-2025",
        descripcion: "Documentación de fluctuaciones de tipo de cambio",
      },
    ],
    alegaciones: "El infractor no acepta los cargos alegando circunstancias de fuerza mayor relacionadas con el tipo de cambio.",
    observaciones: "Se genera resultado provisional. El infractor tiene derecho a presentar reclamo administrativo.",
    actaGenerada: true,
    numeroActa: "ACTA-2025-000003",
    fechaActa: "22-11-2025",
    fechaCreacion: "18-11-2025",
    usuarioCreacion: "plopez",
    fechaModificacion: "22-11-2025",
    usuarioModificacion: "plopez",
  },
  {
    id: "aud-005",
    numeroAudiencia: "AUD-2025-000005",
    denunciaId: "d-009",
    numeroDenuncia: "993527",
    fechaProgramada: "27-11-2025",
    horaProgramada: "14:00",
    fechaRealizacion: "27-11-2025",
    horaInicio: "14:10",
    horaFin: "15:45",
    sala: "Sala de Audiencias 1",
    direccion: "Blanco 951, Piso 4, Valparaíso",
    modalidad: "Presencial",
    juezInstructor: "Juan Rodríguez",
    loginJuezInstructor: "jrodriguez",
    fiscalizador: "María González",
    loginFiscalizador: "mgonzalez",
    infractorRut: "77.234.567-8",
    infractorNombre: "Comercial del Pacífico Ltda.",
    infractorComparecio: true,
    representanteLegal: "Patricia Morales Silva",
    estado: "Finalizada",
    resultado: "Desacuerdo",
    allanamiento: false,
    autodenuncio: false,
    multaOriginal: 3500000,
    declaraciones: [
      {
        id: "dec-003",
        fecha: "27-11-2025",
        hora: "14:25",
        declarante: "Patricia Morales Silva",
        tipoDeclarante: "Representante Legal",
        contenido: "Mi representado no acepta los cargos formulados. Consideramos que la diferencia en el valor declarado se debe a fluctuaciones del tipo de cambio y a un error de interpretación de la factura comercial. Presentamos documentación que respalda nuestra posición y solicitamos se considere esta circunstancia.",
        registradoPor: "jrodriguez",
      },
    ],
    antecedentesEntregados: [
      {
        id: "ant-004",
        nombre: "historial_tipo_cambio.pdf",
        tipo: "pdf",
        tamanio: "312 KB",
        fechaSubida: "27-11-2025",
        descripcion: "Historial de fluctuaciones del tipo de cambio USD/CLP",
      },
      {
        id: "ant-005",
        nombre: "factura_original.pdf",
        tipo: "pdf",
        tamanio: "856 KB",
        fechaSubida: "27-11-2025",
        descripcion: "Factura comercial original con aclaraciones",
      },
    ],
    alegaciones: "El infractor presenta desacuerdo con los cargos, alegando que la diferencia en el valor se debe a fluctuaciones cambiarias y errores de interpretación documental. Solicita se evalúen los antecedentes presentados.",
    observaciones: "Audiencia desarrollada con normalidad. El representante legal presentó argumentos y documentación de respaldo. Se genera resultado provisional para evaluación posterior.",
    actaGenerada: false,
    fechaCreacion: "25-11-2025",
    usuarioCreacion: "jrodriguez",
    fechaModificacion: "27-11-2025",
    usuarioModificacion: "jrodriguez",
  },
];

// ============================================
// FUNCIONES HELPER
// ============================================

export const getAudienciaPorId = (id: string): Audiencia | undefined =>
  audiencias.find(a => a.id === id);

export const getAudienciaPorNumero = (numero: string): Audiencia | undefined =>
  audiencias.find(a => a.numeroAudiencia === numero);

export const getAudienciasPorDenuncia = (denunciaId: string): Audiencia[] =>
  audiencias.filter(a => a.denunciaId === denunciaId);

export const getAudienciasPorNumeroDenuncia = (numeroDenuncia: string): Audiencia[] =>
  audiencias.filter(a => a.numeroDenuncia === numeroDenuncia);

export const getAudienciasPorEstado = (estado: EstadoAudiencia): Audiencia[] =>
  audiencias.filter(a => a.estado === estado);

export const getAudienciasPorResultado = (resultado: TipoResultadoAudiencia): Audiencia[] =>
  audiencias.filter(a => a.resultado === resultado);

export const getAudienciasProgramadas = (): Audiencia[] =>
  audiencias.filter(a => a.estado === 'Programada');

export const getAudienciasHoy = (): Audiencia[] => {
  const hoy = new Date().toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' }).split('/').join('-');
  return audiencias.filter(a => a.fechaProgramada === hoy);
};

export const getAudienciasPorJuez = (loginJuez: string): Audiencia[] =>
  audiencias.filter(a => a.loginJuezInstructor === loginJuez);

export const getConteoAudiencias = () => ({
  total: audiencias.length,
  porEstado: {
    programadas: audiencias.filter(a => a.estado === 'Programada').length,
    enCurso: audiencias.filter(a => a.estado === 'En Curso').length,
    finalizadas: audiencias.filter(a => a.estado === 'Finalizada').length,
    canceladas: audiencias.filter(a => a.estado === 'Cancelada').length,
    reprogramadas: audiencias.filter(a => a.estado === 'Reprogramada').length,
  },
  porResultado: {
    allanamiento: audiencias.filter(a => a.resultado === 'Allanamiento').length,
    desacuerdo: audiencias.filter(a => a.resultado === 'Desacuerdo').length,
    noComparecencia: audiencias.filter(a => a.resultado === 'No Comparecencia').length,
    pendiente: audiencias.filter(a => a.resultado === 'Pendiente').length,
  },
  conAllanamiento: audiencias.filter(a => a.allanamiento).length,
});

// ============================================
// GENERADORES
// ============================================

let contadorAudiencia = 5;

export const generarNumeroAudiencia = (): string => {
  const año = new Date().getFullYear();
  return `AUD-${año}-${String(contadorAudiencia++).padStart(6, '0')}`;
};

export const generarNumeroActa = (): string => {
  const año = new Date().getFullYear();
  const contador = audiencias.filter(a => a.actaGenerada).length + 1;
  return `ACTA-${año}-${String(contador).padStart(6, '0')}`;
};

// ============================================
// CÁLCULO DE MULTA ATENUADA
// ============================================

export interface CalculoMultaAtenuada {
  multaOriginal: number;
  multaAtenuada: number;
  porcentajeAtenuacion: number;
  motivoAtenuacion: string;
}

export const calcularMultaAtenuada = (
  multaOriginal: number,
  allanamiento: boolean
): CalculoMultaAtenuada => {
  let porcentajeAtenuacion = 0;
  let motivoAtenuacion = '';

  if (allanamiento) {
    porcentajeAtenuacion = 40;
    motivoAtenuacion = 'Allanamiento';
  }

  const multaAtenuada = Math.round(multaOriginal * (1 - porcentajeAtenuacion / 100));

  return {
    multaOriginal,
    multaAtenuada,
    porcentajeAtenuacion,
    motivoAtenuacion,
  };
};

// ============================================
// PERMISOS
// ============================================

export interface PermisosAudiencia {
  puedeIniciar: boolean;
  puedeEditar: boolean;
  puedeFinalizar: boolean;
  puedeCancelar: boolean;
  puedeReprogramar: boolean;
  puedeGenerarActa: boolean;
  puedeRegistrarDeclaracion: boolean;
  puedeAgregarAntecedentes: boolean;
}

export const getPermisosAudiencia = (estado: EstadoAudiencia): PermisosAudiencia => {
  switch (estado) {
    case 'Programada':
      return {
        puedeIniciar: true,
        puedeEditar: true,
        puedeFinalizar: false,
        puedeCancelar: true,
        puedeReprogramar: true,
        puedeGenerarActa: false,
        puedeRegistrarDeclaracion: false,
        puedeAgregarAntecedentes: true,
      };
    case 'En Curso':
      return {
        puedeIniciar: false,
        puedeEditar: true,
        puedeFinalizar: true,
        puedeCancelar: false,
        puedeReprogramar: false,
        puedeGenerarActa: false,
        puedeRegistrarDeclaracion: true,
        puedeAgregarAntecedentes: true,
      };
    case 'Finalizada':
      return {
        puedeIniciar: false,
        puedeEditar: false,
        puedeFinalizar: false,
        puedeCancelar: false,
        puedeReprogramar: false,
        puedeGenerarActa: true,
        puedeRegistrarDeclaracion: false,
        puedeAgregarAntecedentes: false,
      };
    case 'Cancelada':
    case 'Reprogramada':
    default:
      return {
        puedeIniciar: false,
        puedeEditar: false,
        puedeFinalizar: false,
        puedeCancelar: false,
        puedeReprogramar: false,
        puedeGenerarActa: false,
        puedeRegistrarDeclaracion: false,
        puedeAgregarAntecedentes: false,
      };
  }
};

// ============================================
// CREAR/ACTUALIZAR AUDIENCIA
// ============================================

export const crearAudiencia = (datos: Partial<Audiencia>): Audiencia => {
  const nuevaAudiencia: Audiencia = {
    id: `aud-${Date.now()}`,
    numeroAudiencia: generarNumeroAudiencia(),
    denunciaId: datos.denunciaId || '',
    numeroDenuncia: datos.numeroDenuncia || '',
    fechaProgramada: datos.fechaProgramada || '',
    horaProgramada: datos.horaProgramada || '',
    sala: datos.sala || '',
    direccion: datos.direccion || '',
    modalidad: datos.modalidad || 'Presencial',
    juezInstructor: datos.juezInstructor || '',
    loginJuezInstructor: datos.loginJuezInstructor || '',
    fiscalizador: datos.fiscalizador,
    loginFiscalizador: datos.loginFiscalizador,
    infractorRut: datos.infractorRut || '',
    infractorNombre: datos.infractorNombre || '',
    infractorComparecio: false,
    representanteLegal: datos.representanteLegal,
    estado: 'Programada',
    resultado: 'Pendiente',
    allanamiento: false,
    autodenuncio: false,
    multaOriginal: datos.multaOriginal || 0,
    declaraciones: [],
    antecedentesEntregados: [],
    actaGenerada: false,
    fechaCreacion: new Date().toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' }).split('/').join('-'),
    usuarioCreacion: datos.usuarioCreacion || '',
  };

  audiencias.push(nuevaAudiencia);
  return nuevaAudiencia;
};

export const actualizarAudiencia = (id: string, datos: Partial<Audiencia>): Audiencia | null => {
  const index = audiencias.findIndex(a => a.id === id);
  if (index === -1) return null;

  audiencias[index] = {
    ...audiencias[index],
    ...datos,
    fechaModificacion: new Date().toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' }).split('/').join('-'),
  };

  return audiencias[index];
};

export const iniciarAudiencia = (id: string, loginUsuario: string): Audiencia | null => {
  const ahora = new Date();
  return actualizarAudiencia(id, {
    estado: 'En Curso',
    fechaRealizacion: ahora.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' }).split('/').join('-'),
    horaInicio: ahora.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
    usuarioModificacion: loginUsuario,
  });
};

export const finalizarAudiencia = (
  id: string,
  resultado: TipoResultadoAudiencia,
  comparecio: boolean,
  allanamiento: boolean,
  alegaciones: string,
  observaciones: string,
  loginUsuario: string
): Audiencia | null => {
  const audiencia = getAudienciaPorId(id);
  if (!audiencia) return null;

  const ahora = new Date();
  let multaAtenuada: number | undefined;
  let porcentajeAtenuacion: number | undefined;

  if (allanamiento) {
    const calculo = calcularMultaAtenuada(audiencia.multaOriginal, allanamiento);
    multaAtenuada = calculo.multaAtenuada;
    porcentajeAtenuacion = calculo.porcentajeAtenuacion;
  }

  return actualizarAudiencia(id, {
    estado: 'Finalizada',
    resultado,
    infractorComparecio: comparecio,
    allanamiento,
    multaAtenuada,
    porcentajeAtenuacion,
    alegaciones,
    observaciones,
    horaFin: ahora.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
    usuarioModificacion: loginUsuario,
  });
};

export const generarActaAudiencia = (id: string, loginUsuario: string): Audiencia | null => {
  return actualizarAudiencia(id, {
    actaGenerada: true,
    numeroActa: generarNumeroActa(),
    fechaActa: new Date().toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' }).split('/').join('-'),
    usuarioModificacion: loginUsuario,
  });
};

export const agregarDeclaracion = (
  audienciaId: string,
  declaracion: Omit<DeclaracionAudiencia, 'id'>
): Audiencia | null => {
  const audiencia = getAudienciaPorId(audienciaId);
  if (!audiencia) return null;

  const nuevaDeclaracion: DeclaracionAudiencia = {
    ...declaracion,
    id: `dec-${Date.now()}`,
  };

  return actualizarAudiencia(audienciaId, {
    declaraciones: [...audiencia.declaraciones, nuevaDeclaracion],
  });
};

export const agregarAntecedente = (
  audienciaId: string,
  antecedente: Omit<DocumentoAudiencia, 'id'>
): Audiencia | null => {
  const audiencia = getAudienciaPorId(audienciaId);
  if (!audiencia) return null;

  const nuevoAntecedente: DocumentoAudiencia = {
    ...antecedente,
    id: `ant-${Date.now()}`,
  };

  return actualizarAudiencia(audienciaId, {
    antecedentesEntregados: [...audiencia.antecedentesEntregados, nuevoAntecedente],
  });
};

// ============================================
// SALAS DE AUDIENCIA
// ============================================

export const salasAudiencia = [
  { codigo: 'SALA-VLP-1', nombre: 'Sala de Audiencias 1 - Valparaíso', direccion: 'Blanco 951, Piso 4, Valparaíso' },
  { codigo: 'SALA-VLP-2', nombre: 'Sala de Audiencias 2 - Valparaíso', direccion: 'Blanco 951, Piso 5, Valparaíso' },
  { codigo: 'SALA-SCL-1', nombre: 'Sala de Audiencias 1 - Santiago', direccion: 'Av. Libertador Bernardo O\'Higgins 1449, Santiago' },
  { codigo: 'SALA-SCL-2', nombre: 'Sala de Audiencias 2 - Santiago', direccion: 'Monjitas 425, Piso 3, Santiago' },
  { codigo: 'SALA-ANT-1', nombre: 'Sala de Audiencias 1 - Antofagasta', direccion: 'Av. Angamos 2500, Antofagasta' },
  { codigo: 'SALA-IQQ-1', nombre: 'Sala de Audiencias 1 - Iquique', direccion: 'Serrano 145, Iquique' },
  { codigo: 'SALA-AND-1', nombre: 'Sala de Audiencias 1 - Los Andes', direccion: 'Ruta 60 CH Km 85, Los Andes' },
  { codigo: 'VIRTUAL', nombre: 'Audiencia Virtual (Teams/Zoom)', direccion: 'Enlace virtual a enviar' },
];

export const getSalaPorCodigo = (codigo: string) =>
  salasAudiencia.find(s => s.codigo === codigo);

export const getSalasPorAduana = (aduana: string) => {
  const codigoAduana = aduana.substring(0, 3).toUpperCase();
  return salasAudiencia.filter(s => s.codigo.includes(codigoAduana) || s.codigo === 'VIRTUAL');
};

// ============================================
// EMITIR ACTA DE AUDIENCIA Y RESULTADO
// ============================================

export type ResultadoActaAudiencia = 'Multada' | 'Absuelta' | 'Allanada';

export interface ActaAudienciaEmitida {
  id: string;
  numeroActa: string;
  audienciaId: string;
  numeroAudiencia: string;
  denunciaId: string;
  numeroDenuncia: string;
  
  // Datos del infractor
  infractorRut: string;
  infractorNombre: string;
  
  // Resultado
  resultadoAudiencia: TipoResultadoAudiencia;
  resultadoFinal: ResultadoActaAudiencia;
  
  // Montos
  multaOriginal: number;
  multaFinal: number;
  porcentajeAtenuacion?: number;
  absolucion: boolean;
  motivoAbsolucion?: string;
  
  // Contenido del acta
  hechosImputados: string;
  argumentosDefensa?: string;
  fundamentosResolucion: string;
  
  // Firma digital
  firmaDigital: boolean;
  fechaFirma: string;
  certificadoFirma: string;
  hashDocumento: string;
  
  // PDF
  pdfGenerado: boolean;
  rutaPdf: string;
  
  // Auditoría
  fechaEmision: string;
  usuarioEmision: string;
}

// Almacén de actas emitidas (mock)
export const actasAudienciaEmitidas: ActaAudienciaEmitida[] = [];

// Emitir acta de audiencia
export const emitirActaAudiencia = (
  audienciaId: string,
  datosActa: Omit<ActaAudienciaEmitida, 'id' | 'fechaEmision' | 'usuarioEmision'>,
  loginUsuario: string
): ActaAudienciaEmitida | null => {
  const audiencia = getAudienciaPorId(audienciaId);
  if (!audiencia || audiencia.estado !== 'Finalizada') return null;

  const actaEmitida: ActaAudienciaEmitida = {
    ...datosActa,
    id: `acta-${Date.now()}`,
    fechaEmision: new Date().toLocaleDateString('es-CL', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    }).split('/').join('-'),
    usuarioEmision: loginUsuario,
  };

  actasAudienciaEmitidas.push(actaEmitida);

  // Actualizar la audiencia
  actualizarAudiencia(audienciaId, {
    actaGenerada: true,
    numeroActa: datosActa.numeroActa,
    fechaActa: actaEmitida.fechaEmision,
    usuarioModificacion: loginUsuario,
  });

  return actaEmitida;
};

// Obtener acta por audiencia
export const getActaPorAudiencia = (audienciaId: string): ActaAudienciaEmitida | undefined =>
  actasAudienciaEmitidas.find(a => a.audienciaId === audienciaId);

// Obtener actas por denuncia
export const getActasPorDenuncia = (denunciaId: string): ActaAudienciaEmitida[] =>
  actasAudienciaEmitidas.filter(a => a.denunciaId === denunciaId);

// Verificar si una audiencia puede emitir acta
export const puedeEmitirActa = (audienciaId: string): { puede: boolean; motivo?: string } => {
  const audiencia = getAudienciaPorId(audienciaId);
  
  if (!audiencia) {
    return { puede: false, motivo: 'Audiencia no encontrada' };
  }
  
  if (audiencia.estado !== 'Finalizada') {
    return { puede: false, motivo: 'La audiencia debe estar finalizada para emitir el acta' };
  }
  
  if (audiencia.actaGenerada) {
    return { puede: false, motivo: 'Ya se ha emitido un acta para esta audiencia' };
  }
  
  if (audiencia.resultado === 'Pendiente') {
    return { puede: false, motivo: 'La audiencia debe tener un resultado definido' };
  }
  
  return { puede: true };
};

// Obtener audiencias pendientes de emitir acta
export const getAudienciasPendientesActa = (): Audiencia[] =>
  audiencias.filter(a => 
    a.estado === 'Finalizada' && 
    !a.actaGenerada && 
    a.resultado !== 'Pendiente'
  );

// Conteo de actas emitidas
export const getConteoActasEmitidas = () => ({
  total: actasAudienciaEmitidas.length,
  porResultado: {
    multadas: actasAudienciaEmitidas.filter(a => a.resultadoFinal === 'Multada').length,
    absueltas: actasAudienciaEmitidas.filter(a => a.resultadoFinal === 'Absuelta').length,
    allanadas: actasAudienciaEmitidas.filter(a => a.resultadoFinal === 'Allanada').length,
  },
  montoTotalMultas: actasAudienciaEmitidas.reduce((sum, a) => sum + a.multaFinal, 0),
});
