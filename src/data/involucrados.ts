/**
 * Base de datos mock - Involucrados
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import type { 
  Involucrado, 
  DireccionInvolucrado,
  TipoPersona,
  TipoIdentificacion,
  TipoDireccion,
  EstadoInvolucrado,
  PermisosInvolucrado,
  HistorialCasoInvolucrado,
} from './types';

// ============================================
// DATOS MOCK - INVOLUCRADOS
// ============================================

export const involucrados: Involucrado[] = [
  {
    id: "inv-001",
    tipoIdentificacion: "RUT",
    numeroIdentificacion: "76.123.456",
    digitoVerificador: "7",
    tipoPersona: "Jurídica",
    razonSocial: "Importadora del Norte S.A.",
    giro: "Importación y comercialización de productos electrónicos",
    nombreCompleto: "Importadora del Norte S.A.",
    email: "contacto@importadoranorte.cl",
    emailSecundario: "gerencia@importadoranorte.cl",
    telefono: "+56 2 2234 5678",
    telefonoSecundario: "+56 9 8765 4321",
    nacionalidad: "Chile",
    direcciones: [
      {
        id: "dir-001-1",
        involucradoId: "inv-001",
        tipoDireccion: "Comercial",
        direccion: "Av. Providencia 1234",
        numero: "1234",
        departamento: "Of. 801",
        region: "Metropolitana",
        comuna: "Providencia",
        codigoPostal: "7500000",
        pais: "Chile",
        esPrincipal: true,
      },
      {
        id: "dir-001-2",
        involucradoId: "inv-001",
        tipoDireccion: "Legal",
        direccion: "Calle Los Leones 567",
        numero: "567",
        region: "Metropolitana",
        comuna: "Las Condes",
        codigoPostal: "7550000",
        pais: "Chile",
        esPrincipal: false,
      }
    ],
    representanteLegalId: "inv-002",
    representanteLegalNombre: "Juan Carlos Pérez González",
    representanteLegalRut: "12.345.678-9",
    estado: "Activo",
    denunciasAsociadas: ["d-001", "d-003"],
    cargosAsociados: ["c-001"],
    girosAsociados: ["g-001"],
    reclamosAsociados: ["rec-001"],
    fechaCreacion: "01-01-2024",
    usuarioCreacion: "admin",
    observaciones: "Cliente frecuente con múltiples operaciones de importación.",
  },
  {
    id: "inv-002",
    tipoIdentificacion: "RUT",
    numeroIdentificacion: "12.345.678",
    digitoVerificador: "9",
    tipoPersona: "Natural",
    nombre: "Juan Carlos",
    apellidoPaterno: "Pérez",
    apellidoMaterno: "González",
    nombreCompleto: "Juan Carlos Pérez González",
    email: "jcperez@email.com",
    telefono: "+56 9 9876 5432",
    nacionalidad: "Chile",
    direcciones: [
      {
        id: "dir-002-1",
        involucradoId: "inv-002",
        tipoDireccion: "Particular",
        direccion: "Calle Los Almendros 456",
        numero: "456",
        region: "Metropolitana",
        comuna: "Ñuñoa",
        codigoPostal: "7770000",
        pais: "Chile",
        esPrincipal: true,
      }
    ],
    estado: "Activo",
    denunciasAsociadas: ["d-001"],
    cargosAsociados: [],
    girosAsociados: [],
    reclamosAsociados: [],
    fechaCreacion: "15-03-2024",
    usuarioCreacion: "jrodriguez",
  },
  {
    id: "inv-003",
    tipoIdentificacion: "RUT",
    numeroIdentificacion: "98.765.432",
    digitoVerificador: "1",
    tipoPersona: "Jurídica",
    razonSocial: "Comercializadora Sur Ltda.",
    giro: "Comercio exterior",
    nombreCompleto: "Comercializadora Sur Ltda.",
    email: "info@comercializadorasur.cl",
    telefono: "+56 2 2345 6789",
    nacionalidad: "Chile",
    direcciones: [
      {
        id: "dir-003-1",
        involucradoId: "inv-003",
        tipoDireccion: "Comercial",
        direccion: "Av. Apoquindo 5678",
        numero: "5678",
        departamento: "Piso 12",
        region: "Metropolitana",
        comuna: "Las Condes",
        pais: "Chile",
        esPrincipal: true,
      }
    ],
    representanteLegalNombre: "María Fernanda López",
    representanteLegalRut: "11.222.333-4",
    estado: "Activo",
    denunciasAsociadas: ["d-002"],
    cargosAsociados: ["c-002"],
    girosAsociados: [],
    reclamosAsociados: [],
    fechaCreacion: "20-02-2024",
    usuarioCreacion: "admin",
  },
  {
    id: "inv-004",
    tipoIdentificacion: "Pasaporte",
    numeroIdentificacion: "AB1234567",
    tipoPersona: "Natural",
    nombre: "Robert",
    apellidoPaterno: "Smith",
    apellidoMaterno: "",
    nombreCompleto: "Robert Smith",
    email: "robert.smith@email.com",
    telefono: "+1 555 123 4567",
    nacionalidad: "Estados Unidos",
    direcciones: [
      {
        id: "dir-004-1",
        involucradoId: "inv-004",
        tipoDireccion: "Particular",
        direccion: "Hotel W Santiago, Isidora Goyenechea 3000",
        region: "Metropolitana",
        comuna: "Las Condes",
        pais: "Chile",
        esPrincipal: true,
      }
    ],
    estado: "Activo",
    denunciasAsociadas: ["d-005"],
    cargosAsociados: [],
    girosAsociados: [],
    reclamosAsociados: [],
    fechaCreacion: "05-09-2024",
    usuarioCreacion: "ieqpj",
    observaciones: "Turista extranjero - caso de omisión en declaración de equipaje",
  },
  {
    id: "inv-005",
    tipoIdentificacion: "RUT",
    numeroIdentificacion: "77.888.999",
    digitoVerificador: "K",
    tipoPersona: "Jurídica",
    razonSocial: "Transportes Marítimos Chile S.A.",
    giro: "Transporte internacional de carga",
    nombreCompleto: "Transportes Marítimos Chile S.A.",
    email: "operaciones@tmchile.cl",
    emailSecundario: "legal@tmchile.cl",
    telefono: "+56 32 234 5678",
    telefonoSecundario: "+56 32 234 5679",
    nacionalidad: "Chile",
    direcciones: [
      {
        id: "dir-005-1",
        involucradoId: "inv-005",
        tipoDireccion: "Comercial",
        direccion: "Puerto de Valparaíso, Terminal 1",
        region: "Valparaíso",
        comuna: "Valparaíso",
        pais: "Chile",
        esPrincipal: true,
      },
      {
        id: "dir-005-2",
        involucradoId: "inv-005",
        tipoDireccion: "Legal",
        direccion: "Calle Prat 890",
        numero: "890",
        departamento: "Of. 502",
        region: "Valparaíso",
        comuna: "Valparaíso",
        pais: "Chile",
        esPrincipal: false,
      }
    ],
    representanteLegalNombre: "Carlos Alberto Muñoz",
    representanteLegalRut: "10.111.222-3",
    estado: "Activo",
    denunciasAsociadas: [],
    cargosAsociados: [],
    girosAsociados: [],
    reclamosAsociados: [],
    fechaCreacion: "10-01-2024",
    usuarioCreacion: "admin",
  },
  {
    id: "inv-006",
    tipoIdentificacion: "RUT",
    numeroIdentificacion: "15.678.901",
    digitoVerificador: "2",
    tipoPersona: "Natural",
    nombre: "María Soledad",
    apellidoPaterno: "Vargas",
    apellidoMaterno: "Rojas",
    nombreCompleto: "María Soledad Vargas Rojas",
    email: "mvargas@email.com",
    telefono: "+56 9 8765 1234",
    nacionalidad: "Chile",
    direcciones: [
      {
        id: "dir-006-1",
        involucradoId: "inv-006",
        tipoDireccion: "Particular",
        direccion: "Pasaje Los Olivos 123",
        numero: "123",
        region: "Antofagasta",
        comuna: "Antofagasta",
        pais: "Chile",
        esPrincipal: true,
      }
    ],
    estado: "Activo",
    denunciasAsociadas: ["d-010"],
    cargosAsociados: [],
    girosAsociados: [],
    reclamosAsociados: [],
    fechaCreacion: "10-07-2024",
    usuarioCreacion: "lvargas",
  },
  {
    id: "inv-007",
    tipoIdentificacion: "RUT",
    numeroIdentificacion: "87.654.321",
    digitoVerificador: "0",
    tipoPersona: "Jurídica",
    razonSocial: "Agencia de Aduanas Pacific Ltda.",
    giro: "Servicios de agenciamiento aduanero",
    nombreCompleto: "Agencia de Aduanas Pacific Ltda.",
    email: "operaciones@pacificaduana.cl",
    telefono: "+56 2 2876 5432",
    nacionalidad: "Chile",
    direcciones: [
      {
        id: "dir-007-1",
        involucradoId: "inv-007",
        tipoDireccion: "Comercial",
        direccion: "Av. Libertador Bernardo O'Higgins 1449",
        numero: "1449",
        departamento: "Piso 8",
        region: "Metropolitana",
        comuna: "Santiago",
        pais: "Chile",
        esPrincipal: true,
      }
    ],
    representanteLegalNombre: "Pedro Ignacio Soto",
    representanteLegalRut: "9.876.543-2",
    estado: "Activo",
    denunciasAsociadas: [],
    cargosAsociados: [],
    girosAsociados: [],
    reclamosAsociados: [],
    fechaCreacion: "01-01-2020",
    usuarioCreacion: "admin",
    observaciones: "Agencia de aduanas registrada. Código: 007",
  },
  {
    id: "inv-008",
    tipoIdentificacion: "RUT",
    numeroIdentificacion: "16.789.012",
    digitoVerificador: "3",
    tipoPersona: "Natural",
    nombre: "Eduardo Andrés",
    apellidoPaterno: "Pizarro",
    apellidoMaterno: "Contreras",
    nombreCompleto: "Eduardo Andrés Pizarro Contreras",
    email: "epizarro@email.com",
    telefono: "+56 9 7654 3210",
    nacionalidad: "Chile",
    direcciones: [
      {
        id: "dir-008-1",
        involucradoId: "inv-008",
        tipoDireccion: "Particular",
        direccion: "Calle Baquedano 567",
        numero: "567",
        region: "Tarapacá",
        comuna: "Iquique",
        pais: "Chile",
        esPrincipal: true,
      }
    ],
    estado: "Inactivo",
    denunciasAsociadas: ["d-018"],
    cargosAsociados: [],
    girosAsociados: [],
    reclamosAsociados: [],
    fechaCreacion: "15-05-2024",
    usuarioCreacion: "epizarro",
    fechaModificacion: "20-11-2024",
    usuarioModificacion: "admin",
    observaciones: "Inactivado por caso cerrado.",
  },
  {
    id: "inv-009",
    tipoIdentificacion: "RUT",
    numeroIdentificacion: "78.901.234",
    digitoVerificador: "5",
    tipoPersona: "Jurídica",
    razonSocial: "Distribuidora Oriental SpA",
    giro: "Distribución de productos importados",
    nombreCompleto: "Distribuidora Oriental SpA",
    email: "ventas@orientalspd.cl",
    telefono: "+56 2 2901 2345",
    nacionalidad: "Chile",
    direcciones: [
      {
        id: "dir-009-1",
        involucradoId: "inv-009",
        tipoDireccion: "Comercial",
        direccion: "Av. La Florida 9876",
        numero: "9876",
        region: "Metropolitana",
        comuna: "La Florida",
        pais: "Chile",
        esPrincipal: true,
      }
    ],
    representanteLegalNombre: "Chen Wei Liu",
    representanteLegalRut: "23.456.789-0",
    estado: "Activo",
    denunciasAsociadas: [],
    cargosAsociados: [],
    girosAsociados: [],
    reclamosAsociados: [],
    fechaCreacion: "01-06-2023",
    usuarioCreacion: "admin",
  },
  {
    id: "inv-010",
    tipoIdentificacion: "RUT",
    numeroIdentificacion: "17.890.123",
    digitoVerificador: "4",
    tipoPersona: "Natural",
    nombre: "Rosa Elena",
    apellidoPaterno: "Muñoz",
    apellidoMaterno: "Sánchez",
    nombreCompleto: "Rosa Elena Muñoz Sánchez",
    email: "rmunoz@email.com",
    telefono: "+56 9 6543 2109",
    nacionalidad: "Chile",
    direcciones: [
      {
        id: "dir-010-1",
        involucradoId: "inv-010",
        tipoDireccion: "Particular",
        direccion: "Calle Errazuriz 234",
        numero: "234",
        region: "Valparaíso",
        comuna: "Valparaíso",
        pais: "Chile",
        esPrincipal: true,
      }
    ],
    estado: "Activo",
    denunciasAsociadas: ["d-015"],
    cargosAsociados: [],
    girosAsociados: [],
    reclamosAsociados: [],
    fechaCreacion: "25-10-2024",
    usuarioCreacion: "rmunoz",
  },
];

// ============================================
// CATÁLOGOS
// ============================================

export const tiposIdentificacion: { value: TipoIdentificacion; label: string }[] = [
  { value: 'RUT', label: 'RUT' },
  { value: 'Pasaporte', label: 'Pasaporte' },
  { value: 'DNI', label: 'DNI' },
  { value: 'RUC', label: 'RUC' },
  { value: 'Otro', label: 'Otro' },
];

export const tiposPersona: { value: TipoPersona; label: string }[] = [
  { value: 'Natural', label: 'Persona Natural' },
  { value: 'Jurídica', label: 'Persona Jurídica' },
];

export const tiposDireccion: { value: TipoDireccion; label: string }[] = [
  { value: 'Particular', label: 'Particular' },
  { value: 'Comercial', label: 'Comercial' },
  { value: 'Legal', label: 'Legal' },
  { value: 'Notificación', label: 'Notificación' },
];

export const regiones: { value: string; label: string }[] = [
  { value: 'Arica y Parinacota', label: 'Arica y Parinacota' },
  { value: 'Tarapacá', label: 'Tarapacá' },
  { value: 'Antofagasta', label: 'Antofagasta' },
  { value: 'Atacama', label: 'Atacama' },
  { value: 'Coquimbo', label: 'Coquimbo' },
  { value: 'Valparaíso', label: 'Valparaíso' },
  { value: 'Metropolitana', label: 'Metropolitana' },
  { value: "O'Higgins", label: "O'Higgins" },
  { value: 'Maule', label: 'Maule' },
  { value: 'Ñuble', label: 'Ñuble' },
  { value: 'Biobío', label: 'Biobío' },
  { value: 'La Araucanía', label: 'La Araucanía' },
  { value: 'Los Ríos', label: 'Los Ríos' },
  { value: 'Los Lagos', label: 'Los Lagos' },
  { value: 'Aysén', label: 'Aysén' },
  { value: 'Magallanes', label: 'Magallanes' },
];

// ============================================
// FUNCIONES HELPER
// ============================================

export const getInvolucradoPorId = (id: string): Involucrado | undefined => 
  involucrados.find(i => i.id === id);

export const getInvolucradoPorRut = (rut: string): Involucrado | undefined => {
  const rutLimpio = rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();
  return involucrados.find(i => {
    const invRut = `${i.numeroIdentificacion}${i.digitoVerificador || ''}`.replace(/\./g, '').replace(/-/g, '').toUpperCase();
    return invRut === rutLimpio || i.numeroIdentificacion === rut;
  });
};

export const getInvolucradosPorTipoPersona = (tipo: TipoPersona): Involucrado[] =>
  involucrados.filter(i => i.tipoPersona === tipo);

export const getInvolucradosPorEstado = (estado: EstadoInvolucrado): Involucrado[] =>
  involucrados.filter(i => i.estado === estado);

export const buscarInvolucrados = (termino: string): Involucrado[] => {
  const terminoLower = termino.toLowerCase();
  return involucrados.filter(i => 
    i.nombreCompleto.toLowerCase().includes(terminoLower) ||
    i.numeroIdentificacion.includes(termino) ||
    i.email?.toLowerCase().includes(terminoLower) ||
    i.razonSocial?.toLowerCase().includes(terminoLower)
  );
};

export const getConteoInvolucrados = () => ({
  total: involucrados.length,
  activos: involucrados.filter(i => i.estado === 'Activo').length,
  inactivos: involucrados.filter(i => i.estado === 'Inactivo').length,
  personasNaturales: involucrados.filter(i => i.tipoPersona === 'Natural').length,
  personasJuridicas: involucrados.filter(i => i.tipoPersona === 'Jurídica').length,
  conProcesos: involucrados.filter(i => 
    (i.denunciasAsociadas?.length || 0) > 0 ||
    (i.cargosAsociados?.length || 0) > 0 ||
    (i.girosAsociados?.length || 0) > 0 ||
    (i.reclamosAsociados?.length || 0) > 0
  ).length,
});

export const getPermisosInvolucrado = (involucrado: Involucrado): PermisosInvolucrado => {
  const tieneProcesos = 
    (involucrado.denunciasAsociadas?.length || 0) > 0 ||
    (involucrado.cargosAsociados?.length || 0) > 0 ||
    (involucrado.girosAsociados?.length || 0) > 0 ||
    (involucrado.reclamosAsociados?.length || 0) > 0;
  
  return {
    puedeEditar: true,
    puedeEliminar: !tieneProcesos,
    puedeInactivar: tieneProcesos,
    motivoNoEliminar: tieneProcesos 
      ? 'No se puede eliminar porque tiene procesos asociados. Puede inactivarlo en su lugar.'
      : undefined,
  };
};

export const getHistorialCasos = (involucrado: Involucrado): HistorialCasoInvolucrado[] => {
  const historial: HistorialCasoInvolucrado[] = [];
  
  // Este es un mock - en producción se consultarían las entidades reales
  if (involucrado.denunciasAsociadas) {
    involucrado.denunciasAsociadas.forEach(id => {
      historial.push({
        tipo: 'DENUNCIA',
        id,
        numero: `DEN-${id.replace('d-', '').padStart(6, '0')}`,
        fecha: '15-01-2024',
        estado: 'En Proceso',
        tipoInvolucrado: 'Infractor Principal',
        monto: '$15.000.000',
      });
    });
  }
  
  if (involucrado.cargosAsociados) {
    involucrado.cargosAsociados.forEach(id => {
      historial.push({
        tipo: 'CARGO',
        id,
        numero: `CAR-${id.replace('c-', '').padStart(6, '0')}`,
        fecha: '20-02-2024',
        estado: 'Emitido',
        tipoInvolucrado: 'Infractor Principal',
        monto: '$8.500.000',
      });
    });
  }
  
  if (involucrado.girosAsociados) {
    involucrado.girosAsociados.forEach(id => {
      historial.push({
        tipo: 'GIRO',
        id,
        numero: `GIR-${id.replace('g-', '').padStart(6, '0')}`,
        fecha: '25-03-2024',
        estado: 'Pendiente',
        tipoInvolucrado: 'Infractor Principal',
        monto: '$3.200.000',
      });
    });
  }
  
  if (involucrado.reclamosAsociados) {
    involucrado.reclamosAsociados.forEach(id => {
      historial.push({
        tipo: 'RECLAMO',
        id,
        numero: `REC-${id.replace('rec-', '').padStart(6, '0')}`,
        fecha: '01-04-2024',
        estado: 'En Análisis',
        tipoInvolucrado: 'Infractor Principal',
      });
    });
  }
  
  return historial.sort((a, b) => {
    // Ordenar por fecha descendente
    const [diaA, mesA, anioA] = a.fecha.split('-').map(Number);
    const [diaB, mesB, anioB] = b.fecha.split('-').map(Number);
    const fechaA = new Date(anioA, mesA - 1, diaA);
    const fechaB = new Date(anioB, mesB - 1, diaB);
    return fechaB.getTime() - fechaA.getTime();
  });
};

export const validarRut = (rut: string): { valido: boolean; error?: string } => {
  if (!rut || rut.trim() === '') {
    return { valido: false, error: 'El RUT es requerido' };
  }
  
  // Eliminar puntos y guión
  const rutLimpio = rut.replace(/\./g, '').replace(/-/g, '');
  
  // Verificar formato
  if (!/^[0-9]+[0-9Kk]$/.test(rutLimpio)) {
    return { valido: false, error: 'Formato de RUT inválido' };
  }
  
  // Extraer número y dígito verificador
  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1).toUpperCase();
  
  // Calcular dígito verificador
  let suma = 0;
  let multiplo = 2;
  
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }
  
  const resto = suma % 11;
  const dvCalculado = 11 - resto === 11 ? '0' : 11 - resto === 10 ? 'K' : String(11 - resto);
  
  if (dv !== dvCalculado) {
    return { valido: false, error: 'Dígito verificador inválido' };
  }
  
  return { valido: true };
};

export const formatRut = (rut: string): string => {
  const rutLimpio = rut.replace(/\./g, '').replace(/-/g, '');
  if (rutLimpio.length < 2) return rut;
  
  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1);
  
  // Formatear con puntos
  const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return `${cuerpoFormateado}-${dv}`;
};

let involucradoIdCounter = 11;
let direccionIdCounter = 100;

export const crearInvolucrado = (data: Partial<Involucrado>): Involucrado => {
  involucradoIdCounter++;
  
  const nuevoInvolucrado: Involucrado = {
    id: `inv-${String(involucradoIdCounter).padStart(3, '0')}`,
    tipoIdentificacion: data.tipoIdentificacion || 'RUT',
    numeroIdentificacion: data.numeroIdentificacion || '',
    digitoVerificador: data.digitoVerificador,
    tipoPersona: data.tipoPersona || 'Natural',
    nombre: data.nombre,
    apellidoPaterno: data.apellidoPaterno,
    apellidoMaterno: data.apellidoMaterno,
    razonSocial: data.razonSocial,
    giro: data.giro,
    nombreCompleto: data.tipoPersona === 'Jurídica' 
      ? data.razonSocial || ''
      : `${data.nombre || ''} ${data.apellidoPaterno || ''} ${data.apellidoMaterno || ''}`.trim(),
    email: data.email,
    emailSecundario: data.emailSecundario,
    telefono: data.telefono,
    telefonoSecundario: data.telefonoSecundario,
    nacionalidad: data.nacionalidad || 'Chile',
    direcciones: data.direcciones || [],
    representanteLegalId: data.representanteLegalId,
    representanteLegalNombre: data.representanteLegalNombre,
    representanteLegalRut: data.representanteLegalRut,
    estado: 'Activo',
    denunciasAsociadas: [],
    cargosAsociados: [],
    girosAsociados: [],
    reclamosAsociados: [],
    fechaCreacion: new Date().toLocaleDateString('es-CL'),
    usuarioCreacion: 'usuario_actual',
    observaciones: data.observaciones,
  };
  
  involucrados.push(nuevoInvolucrado);
  return nuevoInvolucrado;
};

export const actualizarInvolucrado = (id: string, data: Partial<Involucrado>): Involucrado | null => {
  const index = involucrados.findIndex(i => i.id === id);
  if (index === -1) return null;
  
  // Recalcular nombre completo
  const nombreCompleto = data.tipoPersona === 'Jurídica' || involucrados[index].tipoPersona === 'Jurídica'
    ? data.razonSocial || involucrados[index].razonSocial || ''
    : `${data.nombre || involucrados[index].nombre || ''} ${data.apellidoPaterno || involucrados[index].apellidoPaterno || ''} ${data.apellidoMaterno || involucrados[index].apellidoMaterno || ''}`.trim();
  
  involucrados[index] = {
    ...involucrados[index],
    ...data,
    nombreCompleto,
    fechaModificacion: new Date().toLocaleDateString('es-CL'),
    usuarioModificacion: 'usuario_actual',
  };
  
  return involucrados[index];
};

export const agregarDireccion = (involucradoId: string, direccion: Partial<DireccionInvolucrado>): DireccionInvolucrado | null => {
  const involucrado = involucrados.find(i => i.id === involucradoId);
  if (!involucrado) return null;
  
  direccionIdCounter++;
  
  const nuevaDireccion: DireccionInvolucrado = {
    id: `dir-${involucradoId}-${direccionIdCounter}`,
    involucradoId,
    tipoDireccion: direccion.tipoDireccion || 'Particular',
    direccion: direccion.direccion || '',
    numero: direccion.numero,
    departamento: direccion.departamento,
    region: direccion.region || '',
    comuna: direccion.comuna || '',
    codigoPostal: direccion.codigoPostal,
    pais: direccion.pais || 'Chile',
    esPrincipal: direccion.esPrincipal || false,
  };
  
  // Si es principal, desmarcar las otras
  if (nuevaDireccion.esPrincipal) {
    involucrado.direcciones.forEach(d => d.esPrincipal = false);
  }
  
  involucrado.direcciones.push(nuevaDireccion);
  return nuevaDireccion;
};

export const eliminarDireccion = (involucradoId: string, direccionId: string): boolean => {
  const involucrado = involucrados.find(i => i.id === involucradoId);
  if (!involucrado) return false;
  
  const index = involucrado.direcciones.findIndex(d => d.id === direccionId);
  if (index === -1) return false;
  
  involucrado.direcciones.splice(index, 1);
  return true;
};

export const inactivarInvolucrado = (id: string): boolean => {
  const involucrado = involucrados.find(i => i.id === id);
  if (!involucrado) return false;
  
  involucrado.estado = 'Inactivo';
  involucrado.fechaModificacion = new Date().toLocaleDateString('es-CL');
  involucrado.usuarioModificacion = 'usuario_actual';
  return true;
};

export const activarInvolucrado = (id: string): boolean => {
  const involucrado = involucrados.find(i => i.id === id);
  if (!involucrado) return false;
  
  involucrado.estado = 'Activo';
  involucrado.fechaModificacion = new Date().toLocaleDateString('es-CL');
  involucrado.usuarioModificacion = 'usuario_actual';
  return true;
};

