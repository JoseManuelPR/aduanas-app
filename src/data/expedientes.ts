/**
 * Datos mock para Expedientes Digitales
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import {
  ExpedienteDigital,
  ArchivoExpediente,
  DocumentoObligatorioConfig,
  PermisosArchivoExpediente,
} from './types';

// Configuración de documentos obligatorios por tipo de expediente
export const documentosObligatorios: DocumentoObligatorioConfig[] = [
  // DENUNCIA
  {
    tipo: 'DENUNCIA',
    categoria: 'Denuncia/Cargo',
    nombre: 'Denuncia Original',
    descripcion: 'Documento de denuncia firmado',
    obligatorio: true,
  },
  {
    tipo: 'DENUNCIA',
    categoria: 'Documento Aduanero',
    nombre: 'DIN/DUS',
    descripcion: 'Declaración aduanera asociada',
    obligatorio: true,
  },
  {
    tipo: 'DENUNCIA',
    categoria: 'Prueba/Evidencia',
    nombre: 'Informe de Aforo',
    descripcion: 'Informe técnico de aforo físico',
    obligatorio: true,
  },
  {
    tipo: 'DENUNCIA',
    categoria: 'Notificación',
    nombre: 'Notificación al Denunciado',
    descripcion: 'Comprobante de notificación',
    obligatorio: true,
    plazoMaximoDias: 10,
  },
  // CARGO
  {
    tipo: 'CARGO',
    categoria: 'Denuncia/Cargo',
    nombre: 'Documento de Cargo',
    descripcion: 'Cargo emitido y firmado',
    obligatorio: true,
  },
  {
    tipo: 'CARGO',
    categoria: 'Resolución',
    nombre: 'Resolución de Aprobación',
    descripcion: 'Resolución que aprueba el cargo',
    obligatorio: true,
  },
  {
    tipo: 'CARGO',
    categoria: 'Notificación',
    nombre: 'Notificación del Cargo',
    descripcion: 'Comprobante de notificación del cargo',
    obligatorio: true,
    plazoMaximoDias: 5,
  },
  // RECLAMO
  {
    tipo: 'RECLAMO',
    categoria: 'Reclamo/Recurso',
    nombre: 'Escrito de Reclamo',
    descripcion: 'Documento de reclamo presentado',
    obligatorio: true,
  },
  {
    tipo: 'RECLAMO',
    categoria: 'Resolución',
    nombre: 'Resolución de Admisibilidad',
    descripcion: 'Resolución sobre admisibilidad del reclamo',
    obligatorio: true,
    plazoMaximoDias: 15,
  },
  // GIRO
  {
    tipo: 'GIRO',
    categoria: 'Denuncia/Cargo',
    nombre: 'Giro Emitido',
    descripcion: 'Giro de pago emitido',
    obligatorio: true,
  },
  {
    tipo: 'GIRO',
    categoria: 'Notificación',
    nombre: 'Notificación de Giro',
    descripcion: 'Comprobante de notificación del giro',
    obligatorio: true,
    plazoMaximoDias: 3,
  },
];

// XML de ejemplo para archivos del expediente
const xmlEjemploDINExpediente = `<?xml version="1.0" encoding="UTF-8"?>
<DeclaracionIngreso>
  <NumeroAceptacion>6020240012345</NumeroAceptacion>
  <FechaAceptacion>2024-11-01</FechaAceptacion>
  <Aduana>
    <Codigo>60</Codigo>
    <Nombre>Valparaíso</Nombre>
  </Aduana>
  <Importador>
    <RUT>96.123.456-7</RUT>
    <RazonSocial>Importadora Global SpA</RazonSocial>
    <Direccion>Av. Principal 456, Valparaíso</Direccion>
    <Email>contacto@importadoraglobal.cl</Email>
  </Importador>
  <AgenteAduana>
    <Codigo>A-123</Codigo>
    <RazonSocial>Agencia de Aduanas Pacífico Ltda.</RazonSocial>
  </AgenteAduana>
  <Transporte>
    <Via>Marítimo</Via>
    <Nave>MSC OSCAR</Nave>
    <Viaje>V.2024-45</Viaje>
    <Manifiesto>MAN-2024-12345</Manifiesto>
  </Transporte>
  <Valores>
    <ValorFOB>50000</ValorFOB>
    <ValorCIF>52500</ValorCIF>
    <Moneda>USD</Moneda>
    <Flete>2000</Flete>
    <Seguro>500</Seguro>
  </Valores>
  <Mercancia>
    <Descripcion>Electrónica de consumo - Smartphones</Descripcion>
    <Partida>8517.12.00</Partida>
    <PesoNeto>500</PesoNeto>
    <PesoBruto>600</PesoBruto>
    <NumeroBultos>50</NumeroBultos>
    <PaisOrigen>China</PaisOrigen>
  </Mercancia>
  <Derechos>
    <Arancel>6</Arancel>
    <IVA>19</IVA>
    <TotalDerechos>3150</TotalDerechos>
    <TotalImpuestos>10545</TotalImpuestos>
  </Derechos>
</DeclaracionIngreso>`;

// Archivos mock para expedientes
const archivosExpediente001: ArchivoExpediente[] = [
  {
    id: 'archivo-001',
    expedienteId: 'exp-den-001',
    nombre: 'Denuncia_993519_Original.pdf',
    nombreOriginal: 'Denuncia Original.pdf',
    tipo: 'PDF',
    extension: 'pdf',
    tamanio: '245 KB',
    tamanioBytes: 250880,
    fechaSubida: '2024-11-15',
    horaSubida: '09:30',
    usuarioSubida: 'sistema',
    nombreUsuarioSubida: 'Sistema DECARE',
    estado: 'Vigente',
    categoria: 'Denuncia/Cargo',
    origen: 'Sistema',
    descripcion: 'Denuncia original generada automáticamente',
    rutaArchivo: '/expedientes/den-001/Denuncia_993519_Original.pdf',
    urlDescarga: '/api/expedientes/archivos/archivo-001/descargar',
    urlVisualizacion: '/api/expedientes/archivos/archivo-001/visualizar',
    esFirmado: true,
  },
  {
    id: 'archivo-002',
    expedienteId: 'exp-den-001',
    nombre: 'DIN_6020-24-0012345.xml',
    nombreOriginal: 'DIN 6020-24-0012345.xml',
    tipo: 'XML',
    extension: 'xml',
    tamanio: '12 KB',
    tamanioBytes: 12288,
    fechaSubida: '2024-11-15',
    horaSubida: '09:35',
    usuarioSubida: 'sistema',
    nombreUsuarioSubida: 'Sistema DECARE',
    estado: 'Vigente',
    categoria: 'Documento Aduanero',
    origen: 'Importado',
    descripcion: 'Declaración de Ingreso en formato XML',
    rutaArchivo: '/expedientes/den-001/DIN_6020-24-0012345.xml',
    urlDescarga: '/api/expedientes/archivos/archivo-002/descargar',
    urlVisualizacion: '/api/expedientes/archivos/archivo-002/visualizar',
    contenidoXML: xmlEjemploDINExpediente,
    tieneVistaHTML: true,
  },
  {
    id: 'archivo-003',
    expedienteId: 'exp-den-001',
    nombre: 'DIN_6020-24-0012345.pdf',
    nombreOriginal: 'DIN 6020-24-0012345.pdf',
    tipo: 'PDF',
    extension: 'pdf',
    tamanio: '1.2 MB',
    tamanioBytes: 1258291,
    fechaSubida: '2024-11-15',
    horaSubida: '09:35',
    usuarioSubida: 'sistema',
    nombreUsuarioSubida: 'Sistema DECARE',
    estado: 'Vigente',
    categoria: 'Documento Aduanero',
    origen: 'Importado',
    descripcion: 'Declaración de Ingreso en formato PDF',
    rutaArchivo: '/expedientes/den-001/DIN_6020-24-0012345.pdf',
    urlDescarga: '/api/expedientes/archivos/archivo-003/descargar',
    urlVisualizacion: '/api/expedientes/archivos/archivo-003/visualizar',
  },
  {
    id: 'archivo-004',
    expedienteId: 'exp-den-001',
    nombre: 'Fotografias_Mercancia.zip',
    nombreOriginal: 'Fotografías Mercancía.zip',
    tipo: 'ZIP',
    extension: 'zip',
    tamanio: '8.4 MB',
    tamanioBytes: 8796093,
    fechaSubida: '2024-11-15',
    horaSubida: '14:20',
    usuarioSubida: 'jrodriguez',
    nombreUsuarioSubida: 'Juan Rodríguez',
    estado: 'Vigente',
    categoria: 'Fotografía',
    origen: 'Manual',
    descripcion: 'Fotografías del aforo físico de mercancías',
    rutaArchivo: '/expedientes/den-001/Fotografias_Mercancia.zip',
    urlDescarga: '/api/expedientes/archivos/archivo-004/descargar',
  },
  {
    id: 'archivo-005',
    expedienteId: 'exp-den-001',
    nombre: 'Informe_Aforo_15112024.pdf',
    nombreOriginal: 'Informe de Aforo.pdf',
    tipo: 'PDF',
    extension: 'pdf',
    tamanio: '567 KB',
    tamanioBytes: 580608,
    fechaSubida: '2024-11-16',
    horaSubida: '08:45',
    usuarioSubida: 'jrodriguez',
    nombreUsuarioSubida: 'Juan Rodríguez',
    estado: 'Vigente',
    categoria: 'Informe Técnico',
    origen: 'Manual',
    descripcion: 'Informe técnico del aforo físico realizado',
    rutaArchivo: '/expedientes/den-001/Informe_Aforo_15112024.pdf',
    urlDescarga: '/api/expedientes/archivos/archivo-005/descargar',
    urlVisualizacion: '/api/expedientes/archivos/archivo-005/visualizar',
  },
  {
    id: 'archivo-006',
    expedienteId: 'exp-den-001',
    nombre: 'Notificacion_Solicitud_Antecedentes_18112024.pdf',
    nombreOriginal: 'Notificación Solicitud Antecedentes.pdf',
    tipo: 'PDF',
    extension: 'pdf',
    tamanio: '123 KB',
    tamanioBytes: 125952,
    fechaSubida: '2024-11-18',
    horaSubida: '11:20',
    usuarioSubida: 'sistema',
    nombreUsuarioSubida: 'Sistema DECARE',
    estado: 'Vigente',
    categoria: 'Notificación',
    origen: 'Notificación',
    descripcion: 'Notificación electrónica enviada al denunciado',
    rutaArchivo: '/expedientes/den-001/Notificacion_Solicitud_Antecedentes_18112024.pdf',
    urlDescarga: '/api/expedientes/archivos/archivo-006/descargar',
    urlVisualizacion: '/api/expedientes/archivos/archivo-006/visualizar',
    esFirmado: true,
  },
  {
    id: 'archivo-007',
    expedienteId: 'exp-den-001',
    nombre: 'BL_MAEU-2024-11-001.pdf',
    nombreOriginal: 'Bill of Lading.pdf',
    tipo: 'PDF',
    extension: 'pdf',
    tamanio: '890 KB',
    tamanioBytes: 911360,
    fechaSubida: '2024-11-15',
    horaSubida: '10:15',
    usuarioSubida: 'jrodriguez',
    nombreUsuarioSubida: 'Juan Rodríguez',
    estado: 'Vigente',
    categoria: 'Documento Aduanero',
    origen: 'Manual',
    descripcion: 'Conocimiento de embarque',
    rutaArchivo: '/expedientes/den-001/BL_MAEU-2024-11-001.pdf',
    urlDescarga: '/api/expedientes/archivos/archivo-007/descargar',
    urlVisualizacion: '/api/expedientes/archivos/archivo-007/visualizar',
  },
  {
    id: 'archivo-008',
    expedienteId: 'exp-den-001',
    nombre: 'Commercial_Invoice_CI-2024-10-5678.pdf',
    nombreOriginal: 'Commercial Invoice.pdf',
    tipo: 'PDF',
    extension: 'pdf',
    tamanio: '345 KB',
    tamanioBytes: 353280,
    fechaSubida: '2024-11-15',
    horaSubida: '10:18',
    usuarioSubida: 'jrodriguez',
    nombreUsuarioSubida: 'Juan Rodríguez',
    estado: 'Vigente',
    categoria: 'Documento Aduanero',
    origen: 'Manual',
    descripcion: 'Factura comercial de la importación',
    rutaArchivo: '/expedientes/den-001/Commercial_Invoice_CI-2024-10-5678.pdf',
    urlDescarga: '/api/expedientes/archivos/archivo-008/descargar',
    urlVisualizacion: '/api/expedientes/archivos/archivo-008/visualizar',
  },
];

// Timeline mock para expedientes
const timelineExpediente001 = [
  {
    id: 'tl-001',
    title: 'Expediente Creado',
    description: 'Se registró la denuncia y se creó el expediente digital',
    date: '2024-11-15',
    time: '09:30',
    user: 'Sistema',
    status: 'completed' as const,
  },
  {
    id: 'tl-002',
    title: 'Documentos Aduaneros Importados',
    description: 'Se importaron automáticamente los documentos DIN y documentos asociados',
    date: '2024-11-15',
    time: '09:35',
    user: 'Sistema',
    status: 'completed' as const,
  },
  {
    id: 'tl-003',
    title: 'Fotografías Agregadas',
    description: 'Se agregaron fotografías del aforo físico de mercancías',
    date: '2024-11-15',
    time: '14:20',
    user: 'Juan Rodríguez',
    status: 'completed' as const,
  },
  {
    id: 'tl-004',
    title: 'Informe de Aforo',
    description: 'Se subió el informe técnico del aforo físico',
    date: '2024-11-16',
    time: '08:45',
    user: 'Juan Rodríguez',
    status: 'completed' as const,
  },
  {
    id: 'tl-005',
    title: 'Notificación Enviada',
    description: 'Se envió notificación electrónica al denunciado solicitando antecedentes',
    date: '2024-11-18',
    time: '11:20',
    user: 'Sistema',
    status: 'current' as const,
  },
  {
    id: 'tl-006',
    title: 'Pendiente: Formulación de Denuncia',
    description: 'Pendiente de formulación oficial',
    date: '-',
    status: 'pending' as const,
  },
];

// Expedientes digitales mock
export const expedientesDigitales: ExpedienteDigital[] = [
  {
    id: 'exp-den-001',
    tipo: 'DENUNCIA',
    numeroExpediente: '993519',
    entidadId: 'den-001',
    entidadNumero: '993519',
    fechaCreacion: '2024-11-15',
    fechaModificacion: '2024-11-18',
    archivos: archivosExpediente001,
    timeline: timelineExpediente001,
    estado: 'En Revisión',
    completitud: 75,
    documentosFaltantes: ['Notificación al Denunciado'],
    tieneDocumentosFaltantes: true,
    tieneDocumentosVencidos: false,
    usuarioCreacion: 'sistema',
    fechaUltimaModificacion: '2024-11-18',
    usuarioUltimaModificacion: 'sistema',
  },
  {
    id: 'exp-cargo-001',
    tipo: 'CARGO',
    numeroExpediente: 'CAR-2024-001234',
    entidadId: 'cargo-001',
    entidadNumero: 'CAR-2024-001234',
    fechaCreacion: '2024-10-20',
    fechaModificacion: '2024-11-05',
    archivos: [],
    timeline: [],
    estado: 'Emitido',
    completitud: 100,
    documentosFaltantes: [],
    tieneDocumentosFaltantes: false,
    tieneDocumentosVencidos: false,
    usuarioCreacion: 'mgonzalez',
    fechaUltimaModificacion: '2024-11-05',
    usuarioUltimaModificacion: 'mgonzalez',
  },
];

// Funciones helper
export const getExpedientePorEntidad = (
  entidadId: string,
  tipo: 'DENUNCIA' | 'CARGO' | 'RECLAMO' | 'GIRO'
): ExpedienteDigital | undefined => {
  return expedientesDigitales.find(
    (exp) => exp.entidadId === entidadId && exp.tipo === tipo
  );
};

export const getExpedientePorId = (id: string): ExpedienteDigital | undefined => {
  return expedientesDigitales.find((exp) => exp.id === id);
};

export const getDocumentosObligatoriosPorTipo = (
  tipo: 'DENUNCIA' | 'CARGO' | 'RECLAMO' | 'GIRO'
): DocumentoObligatorioConfig[] => {
  return documentosObligatorios.filter((doc) => doc.tipo === tipo);
};

export const calcularCompletitud = (
  expediente: ExpedienteDigital
): { porcentaje: number; faltantes: string[] } => {
  const obligatorios = getDocumentosObligatoriosPorTipo(expediente.tipo);
  const categoriasPresentadas = new Set(
    expediente.archivos
      .filter((a) => a.estado === 'Vigente')
      .map((a) => a.categoria)
  );

  const faltantes = obligatorios
    .filter((doc) => doc.obligatorio && !categoriasPresentadas.has(doc.categoria))
    .map((doc) => doc.nombre);

  const porcentaje = obligatorios.length > 0
    ? Math.round(
        ((obligatorios.length - faltantes.length) / obligatorios.length) * 100
      )
    : 100;

  return { porcentaje, faltantes };
};

// Función para determinar permisos según rol y estado
export const getPermisosArchivo = (
  archivo: ArchivoExpediente,
  rolUsuario: string
): PermisosArchivoExpediente => {
  const esAdministrador = rolUsuario === 'Administrador';
  const esFuncionario = rolUsuario === 'Funcionario Fiscalizador';
  const esJefe = rolUsuario === 'Jefe de Sección';

  // Archivos del sistema no se pueden eliminar
  const esArchivoSistema = archivo.origen === 'Sistema' || archivo.origen === 'Notificación';

  return {
    puedeSubir: esFuncionario || esJefe || esAdministrador,
    puedeDescargar: true,
    puedeVisualizar: true,
    puedeEliminar: !esArchivoSistema && (esJefe || esAdministrador),
    puedeAnular: (esJefe || esAdministrador) && archivo.estado === 'Vigente',
    puedeReemplazar: !esArchivoSistema && (esFuncionario || esJefe || esAdministrador),
    motivoNoEliminar: esArchivoSistema
      ? 'Los documentos generados por el sistema no pueden ser eliminados'
      : undefined,
  };
};
