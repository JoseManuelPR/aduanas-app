/**
 * Base de datos mock - Cargos
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import type { 
  Cargo, 
  CargoCuenta, 
  CuentaCatalogo,
  NormaCatalogo,
  FundamentoCatalogo 
} from './types';

// ============================================
// CATÁLOGOS PARA CARGOS
// ============================================

export const cuentasCatalogo: CuentaCatalogo[] = [
  { id: 'cta-001', codigo: '101', nombre: 'Derechos Aduaneros', descripcion: 'Derechos de importación no pagados', tipoCuenta: 'Derechos', activo: true },
  { id: 'cta-002', codigo: '102', nombre: 'IVA Aduana', descripcion: 'Impuesto al valor agregado en aduana', tipoCuenta: 'Derechos', activo: true },
  { id: 'cta-003', codigo: '201', nombre: 'Multa Art. 173', descripcion: 'Multa por infracción al artículo 173', tipoCuenta: 'Multa', activo: true },
  { id: 'cta-004', codigo: '202', nombre: 'Multa Art. 174', descripcion: 'Multa por infracción al artículo 174', tipoCuenta: 'Multa', activo: true },
  { id: 'cta-005', codigo: '203', nombre: 'Multa Art. 176', descripcion: 'Multa por infracción al artículo 176', tipoCuenta: 'Multa', activo: true },
  { id: 'cta-006', codigo: '301', nombre: 'Intereses Moratorios', descripcion: 'Intereses por mora en el pago', tipoCuenta: 'Intereses', activo: true },
  { id: 'cta-007', codigo: '302', nombre: 'Intereses Penales', descripcion: 'Intereses penales aplicables', tipoCuenta: 'Intereses', activo: true },
  { id: 'cta-008', codigo: '401', nombre: 'Reajuste IPC', descripcion: 'Reajuste según IPC', tipoCuenta: 'Reajuste', activo: true },
  { id: 'cta-009', codigo: '501', nombre: 'Gastos Almacenaje', descripcion: 'Gastos de almacenamiento de mercancía', tipoCuenta: 'Otro', activo: true },
  { id: 'cta-010', codigo: '502', nombre: 'Otros Gastos', descripcion: 'Otros gastos asociados', tipoCuenta: 'Otro', activo: true },
];

export const normasCatalogo: NormaCatalogo[] = [
  { id: 'nor-001', codigo: 'OA-1', nombre: 'Ordenanza de Aduanas', descripcion: 'DFL 30/2004', tipoNorma: 'Legal', vigente: true },
  { id: 'nor-002', codigo: 'RC-1', nombre: 'Reglamento de la Ordenanza', descripcion: 'DS 1/2006', tipoNorma: 'Reglamentario', vigente: true },
  { id: 'nor-003', codigo: 'RES-1', nombre: 'Resolución 1/2020', descripcion: 'Normas de procedimiento', tipoNorma: 'Resolución', vigente: true },
  { id: 'nor-004', codigo: 'CIR-1', nombre: 'Circular 10/2023', descripcion: 'Instrucciones operativas', tipoNorma: 'Circular', vigente: true },
];

export const fundamentosCatalogo: FundamentoCatalogo[] = [
  { id: 'fun-001', codigo: 'F-173-1', nombre: 'Infracción al Art. 173 N°1', descripcion: 'Declaración maliciosa o falsa', normaRelacionada: 'OA-1', vigente: true },
  { id: 'fun-002', codigo: 'F-173-2', nombre: 'Infracción al Art. 173 N°2', descripcion: 'Subvaloración de mercancías', normaRelacionada: 'OA-1', vigente: true },
  { id: 'fun-003', codigo: 'F-174-1', nombre: 'Infracción al Art. 174 N°1', descripcion: 'Incumplimiento de plazos', normaRelacionada: 'OA-1', vigente: true },
  { id: 'fun-004', codigo: 'F-176-1', nombre: 'Infracción al Art. 176', descripcion: 'Contrabando', normaRelacionada: 'OA-1', vigente: true },
  { id: 'fun-005', codigo: 'F-178-1', nombre: 'Infracción al Art. 178', descripcion: 'Defraudación', normaRelacionada: 'OA-1', vigente: true },
];

// ============================================
// DATOS MOCK - CARGOS COMPLETOS
// ============================================

export const cargos: Cargo[] = [
  {
    id: "c-001",
    numeroCargo: "CAR-2024-005678",
    numeroInterno: "INT-2024-001234",
    fechaIngreso: "18-11-2025",
    fechaOcurrencia: "10-11-2025",
    fechaEmision: "18-11-2025",
    estado: "Pendiente Aprobación",
    origen: "DENUNCIA",
    aduana: "Valparaíso",
    codigoAduana: "VLP",
    codigoSeccion: "S-FIS",
    rutDeudor: "76.123.456-7",
    nombreDeudor: "Importadora Global S.A.",
    norma: "OA-1",
    fundamento: "F-173-1",
    descripcionHechos: "Se detectó subvaloración de mercancías en la declaración de importación N° 12345678, correspondiente a equipos electrónicos procedentes de China. El valor declarado fue de USD 15.000, siendo el valor real de USD 45.000 según cotizaciones obtenidas.",
    montoTotal: "$12.500.000",
    montoDerechos: 8500000,
    montoMulta: 3500000,
    montoIntereses: 500000,
    cuentas: [
      { id: 'cc-001', codigoCuenta: '101', nombreCuenta: 'Derechos Aduaneros', monto: 5500000, moneda: 'CLP', orden: 1 },
      { id: 'cc-002', codigoCuenta: '102', nombreCuenta: 'IVA Aduana', monto: 3000000, moneda: 'CLP', orden: 2 },
      { id: 'cc-003', codigoCuenta: '201', nombreCuenta: 'Multa Art. 173', monto: 3500000, moneda: 'CLP', orden: 3 },
      { id: 'cc-004', codigoCuenta: '301', nombreCuenta: 'Intereses Moratorios', monto: 500000, moneda: 'CLP', orden: 4 },
    ],
    infractores: [
      { 
        id: 'ci-001', 
        idInvolucrado: 'inv-001', 
        rut: '76.123.456-7', 
        nombre: 'Importadora Global S.A.', 
        tipoInfractor: 'Infractor Principal',
        direccion: 'Av. Principal 1234, Valparaíso',
        email: 'contacto@importadoraglobal.cl',
        telefono: '+56 32 2123456',
        porcentajeResponsabilidad: 100,
        esPrincipal: true
      }
    ],
    documentosAduaneros: [
      { id: 'cda-001', tipoDocumento: 'DIN', numeroDocumento: '2024-12345678', fecha: '05-11-2025', aduana: 'Valparaíso', descripcion: 'Declaración de Importación', montoRelacionado: 15000 }
    ],
    diasVencimiento: 8,
    fechaVencimiento: "26-11-2025",
    denunciaAsociada: "d-001",
    denunciaNumero: "993519",
    mercanciaId: "m-001",
    girosGenerados: ["g-001"],
    expedienteDigitalId: "exp-c-001",
    loginFuncionario: "jperez",
    fechaCreacion: "18-11-2025",
    usuarioCreacion: "jperez",
  },
  {
    id: "c-002",
    numeroCargo: "CAR-2024-005679",
    numeroInterno: "INT-2024-001235",
    fechaIngreso: "12-11-2025",
    fechaOcurrencia: "01-11-2025",
    fechaEmision: "12-11-2025",
    estado: "Emitido",
    origen: "DENUNCIA",
    aduana: "Santiago",
    codigoAduana: "SCL",
    codigoSeccion: "S-VAL",
    rutDeudor: "77.987.654-3",
    nombreDeudor: "Comercial Los Andes Ltda.",
    norma: "OA-1",
    fundamento: "F-174-1",
    descripcionHechos: "Incumplimiento de plazo para la presentación de documentación complementaria requerida mediante Requerimiento N° 567/2025.",
    montoTotal: "$8.750.000",
    montoDerechos: 6500000,
    montoMulta: 2000000,
    montoIntereses: 250000,
    cuentas: [
      { id: 'cc-005', codigoCuenta: '101', nombreCuenta: 'Derechos Aduaneros', monto: 4000000, moneda: 'CLP', orden: 1 },
      { id: 'cc-006', codigoCuenta: '102', nombreCuenta: 'IVA Aduana', monto: 2500000, moneda: 'CLP', orden: 2 },
      { id: 'cc-007', codigoCuenta: '203', nombreCuenta: 'Multa Art. 176', monto: 2000000, moneda: 'CLP', orden: 3 },
      { id: 'cc-008', codigoCuenta: '301', nombreCuenta: 'Intereses Moratorios', monto: 250000, moneda: 'CLP', orden: 4 },
    ],
    infractores: [
      { 
        id: 'ci-002', 
        idInvolucrado: 'inv-002', 
        rut: '77.987.654-3', 
        nombre: 'Comercial Los Andes Ltda.', 
        tipoInfractor: 'Infractor Principal',
        esPrincipal: true,
        porcentajeResponsabilidad: 100
      }
    ],
    diasVencimiento: 3,
    fechaVencimiento: "15-11-2025",
    denunciaAsociada: "d-002",
    denunciaNumero: "993520",
    girosGenerados: ["g-002"],
    loginFuncionario: "mlopez",
    fechaCreacion: "12-11-2025",
    usuarioCreacion: "mlopez",
  },
  {
    id: "c-003",
    numeroCargo: "CAR-2024-005680",
    numeroInterno: "INT-2024-001236",
    fechaIngreso: "08-11-2025",
    fechaOcurrencia: "25-10-2025",
    fechaEmision: "08-11-2025",
    estado: "En Revisión",
    origen: "TRAMITE_ADUANERO",
    aduana: "Antofagasta",
    codigoAduana: "ANT",
    codigoSeccion: "S-FIS",
    rutDeudor: "80.456.123-5",
    nombreDeudor: "Minera del Norte SpA",
    norma: "OA-1",
    fundamento: "F-173-2",
    descripcionHechos: "En fiscalización posterior se determinó diferencia en clasificación arancelaria de equipos mineros, correspondiendo una posición con mayor arancel.",
    montoTotal: "$45.200.000",
    montoDerechos: 35000000,
    montoMulta: 8500000,
    montoIntereses: 1700000,
    cuentas: [
      { id: 'cc-009', codigoCuenta: '101', nombreCuenta: 'Derechos Aduaneros', monto: 25000000, moneda: 'CLP', orden: 1 },
      { id: 'cc-010', codigoCuenta: '102', nombreCuenta: 'IVA Aduana', monto: 10000000, moneda: 'CLP', orden: 2 },
      { id: 'cc-011', codigoCuenta: '201', nombreCuenta: 'Multa Art. 173', monto: 8500000, moneda: 'CLP', orden: 3 },
      { id: 'cc-012', codigoCuenta: '301', nombreCuenta: 'Intereses Moratorios', monto: 1700000, moneda: 'CLP', orden: 4 },
    ],
    infractores: [
      { 
        id: 'ci-003', 
        idInvolucrado: 'inv-003', 
        rut: '80.456.123-5', 
        nombre: 'Minera del Norte SpA', 
        tipoInfractor: 'Infractor Principal',
        direccion: 'Av. Minería 5678, Antofagasta',
        email: 'legal@mineradelnorte.cl',
        esPrincipal: true,
        porcentajeResponsabilidad: 80
      },
      { 
        id: 'ci-004', 
        idInvolucrado: 'inv-004', 
        rut: '12.345.678-9', 
        nombre: 'Juan Pérez González (Agente)', 
        tipoInfractor: 'Agente de Aduanas',
        esPrincipal: false,
        porcentajeResponsabilidad: 20
      }
    ],
    documentosAduaneros: [
      { id: 'cda-002', tipoDocumento: 'DIN', numeroDocumento: '2024-87654321', fecha: '15-10-2025', aduana: 'Antofagasta', descripcion: 'Declaración de Importación' },
      { id: 'cda-003', tipoDocumento: 'BL', numeroDocumento: 'MSKU-2024-1234', fecha: '01-10-2025', aduana: 'Antofagasta', descripcion: 'Bill of Lading' }
    ],
    diasVencimiento: -1,
    fechaVencimiento: "07-11-2025",
    denunciaAsociada: "d-003",
    denunciaNumero: "993521",
    mercanciaId: "m-002",
    girosGenerados: ["g-004"],
    observaciones: "Pendiente revisión por Jefatura de Sección",
    loginFuncionario: "agomez",
    fechaCreacion: "08-11-2025",
    usuarioCreacion: "agomez",
  },
  {
    id: "c-004",
    numeroCargo: "CAR-2024-005681",
    numeroInterno: "INT-2024-001237",
    fechaIngreso: "05-11-2025",
    fechaOcurrencia: "20-10-2025",
    fechaEmision: "05-11-2025",
    fechaNotificacion: "10-11-2025",
    estado: "Notificado",
    origen: "DENUNCIA",
    aduana: "Iquique",
    codigoAduana: "IQQ",
    codigoSeccion: "S-ZF",
    rutDeudor: "81.321.654-9",
    nombreDeudor: "Zona Franca del Pacífico",
    norma: "OA-1",
    fundamento: "F-178-1",
    descripcionHechos: "Salida de mercancías desde Zona Franca sin la documentación correspondiente.",
    montoTotal: "$3.450.000",
    montoDerechos: 2500000,
    montoMulta: 800000,
    montoIntereses: 150000,
    cuentas: [
      { id: 'cc-013', codigoCuenta: '101', nombreCuenta: 'Derechos Aduaneros', monto: 2500000, moneda: 'CLP', orden: 1 },
      { id: 'cc-014', codigoCuenta: '202', nombreCuenta: 'Multa Art. 174', monto: 800000, moneda: 'CLP', orden: 2 },
      { id: 'cc-015', codigoCuenta: '301', nombreCuenta: 'Intereses Moratorios', monto: 150000, moneda: 'CLP', orden: 3 },
    ],
    infractores: [
      { 
        id: 'ci-005', 
        idInvolucrado: 'inv-005', 
        rut: '81.321.654-9', 
        nombre: 'Zona Franca del Pacífico', 
        tipoInfractor: 'Infractor Principal',
        esPrincipal: true,
        porcentajeResponsabilidad: 100
      }
    ],
    diasVencimiento: 0,
    fechaVencimiento: "20-11-2025",
    denunciaAsociada: "d-004",
    denunciaNumero: "993522",
    girosGenerados: ["g-003"],
    loginFuncionario: "crodriguez",
    fechaCreacion: "05-11-2025",
    usuarioCreacion: "crodriguez",
  },
  {
    id: "c-005",
    numeroCargo: "CAR-2024-005682",
    numeroInterno: "INT-2024-001238",
    fechaIngreso: "01-11-2025",
    fechaOcurrencia: "15-10-2025",
    estado: "Borrador",
    origen: "TRAMITE_ADUANERO",
    aduana: "Los Andes",
    codigoAduana: "LAN",
    codigoSeccion: "S-FIS",
    rutDeudor: "79.147.258-6",
    nombreDeudor: "Transportes Cordillera Ltda.",
    descripcionHechos: "Irregularidades detectadas en tránsito aduanero.",
    montoTotal: "$1.250.000",
    cuentas: [
      { id: 'cc-016', codigoCuenta: '101', nombreCuenta: 'Derechos Aduaneros', monto: 1000000, moneda: 'CLP', orden: 1 },
      { id: 'cc-017', codigoCuenta: '301', nombreCuenta: 'Intereses Moratorios', monto: 250000, moneda: 'CLP', orden: 2 },
    ],
    infractores: [
      { 
        id: 'ci-006', 
        idInvolucrado: 'inv-006', 
        rut: '79.147.258-6', 
        nombre: 'Transportes Cordillera Ltda.', 
        tipoInfractor: 'Transportista',
        esPrincipal: true,
        porcentajeResponsabilidad: 100
      }
    ],
    diasVencimiento: 15,
    fechaVencimiento: "16-11-2025",
    observaciones: "Cargo en borrador, pendiente completar tipificación",
    denunciaAsociada: "d-005",
    denunciaNumero: "993523",
    girosGenerados: ["g-009", "g-010"],
    loginFuncionario: "pmartin",
    fechaCreacion: "01-11-2025",
    usuarioCreacion: "pmartin",
  },
  {
    id: "c-006",
    numeroCargo: "CAR-2024-005683",
    fechaIngreso: "15-11-2025",
    fechaOcurrencia: "05-11-2025",
    fechaEmision: "15-11-2025",
    estado: "Pendiente Aprobación",
    origen: "DENUNCIA",
    aduana: "Valparaíso",
    codigoAduana: "VLP",
    codigoSeccion: "S-VAL",
    rutDeudor: "76.852.963-1",
    nombreDeudor: "Distribuidora Nacional S.A.",
    norma: "OA-1",
    fundamento: "F-173-1",
    descripcionHechos: "Se detectó diferencia de valor en importación de textiles. Valor declarado USD 50.000, valor real según fiscalización USD 150.000.",
    montoTotal: "$67.500.000",
    montoDerechos: 50000000,
    montoMulta: 15000000,
    montoIntereses: 2500000,
    cuentas: [
      { id: 'cc-018', codigoCuenta: '101', nombreCuenta: 'Derechos Aduaneros', monto: 35000000, moneda: 'CLP', orden: 1 },
      { id: 'cc-019', codigoCuenta: '102', nombreCuenta: 'IVA Aduana', monto: 15000000, moneda: 'CLP', orden: 2 },
      { id: 'cc-020', codigoCuenta: '201', nombreCuenta: 'Multa Art. 173', monto: 15000000, moneda: 'CLP', orden: 3 },
      { id: 'cc-021', codigoCuenta: '301', nombreCuenta: 'Intereses Moratorios', monto: 2500000, moneda: 'CLP', orden: 4 },
    ],
    infractores: [
      { 
        id: 'ci-007', 
        idInvolucrado: 'inv-007', 
        rut: '76.852.963-1', 
        nombre: 'Distribuidora Nacional S.A.', 
        tipoInfractor: 'Infractor Principal',
        direccion: 'Av. Comercio 4567, Valparaíso',
        email: 'gerencia@distribuidoranacional.cl',
        esPrincipal: true,
        porcentajeResponsabilidad: 100
      }
    ],
    diasVencimiento: 5,
    fechaVencimiento: "20-11-2025",
    denunciaAsociada: "d-006",
    denunciaNumero: "993524",
    mercanciaId: "m-003",
    girosGenerados: ["g-006"],
    loginFuncionario: "jperez",
    fechaCreacion: "15-11-2025",
    usuarioCreacion: "jperez",
  },
  {
    id: "c-007",
    numeroCargo: "CAR-2024-005684",
    numeroInterno: "INT-2024-001240",
    fechaIngreso: "20-11-2025",
    fechaOcurrencia: "10-11-2025",
    estado: "Observado",
    origen: "DENUNCIA",
    aduana: "Santiago",
    codigoAduana: "SCL",
    codigoSeccion: "S-FIS",
    rutDeudor: "78.456.789-0",
    nombreDeudor: "Importaciones del Sur Ltda.",
    norma: "OA-1",
    fundamento: "F-174-1",
    descripcionHechos: "Incumplimiento en plazos de destinación aduanera.",
    montoTotal: "$9.800.000",
    montoDerechos: 7000000,
    montoMulta: 2500000,
    montoIntereses: 300000,
    cuentas: [
      { id: 'cc-022', codigoCuenta: '101', nombreCuenta: 'Derechos Aduaneros', monto: 7000000, moneda: 'CLP', orden: 1 },
      { id: 'cc-023', codigoCuenta: '202', nombreCuenta: 'Multa Art. 174', monto: 2500000, moneda: 'CLP', orden: 2 },
      { id: 'cc-024', codigoCuenta: '301', nombreCuenta: 'Intereses Moratorios', monto: 300000, moneda: 'CLP', orden: 3 },
    ],
    infractores: [
      { 
        id: 'ci-008', 
        idInvolucrado: 'inv-008', 
        rut: '78.456.789-0', 
        nombre: 'Importaciones del Sur Ltda.', 
        tipoInfractor: 'Importador',
        esPrincipal: true,
        porcentajeResponsabilidad: 100
      }
    ],
    diasVencimiento: 10,
    fechaVencimiento: "30-11-2025",
    denunciaAsociada: "d-007",
    denunciaNumero: "993525",
    observaciones: "Observado por Jefatura: falta documentación de respaldo",
    girosGenerados: ["g-008"],
    loginFuncionario: "mlopez",
    fechaCreacion: "20-11-2025",
    usuarioCreacion: "mlopez",
  },
  {
    id: "c-008",
    numeroCargo: "CAR-2024-005685",
    numeroInterno: "INT-2024-001241",
    fechaIngreso: "22-11-2025",
    fechaOcurrencia: "12-11-2025",
    fechaEmision: "22-11-2025",
    estado: "Cerrado",
    origen: "DENUNCIA",
    aduana: "Antofagasta",
    codigoAduana: "ANT",
    codigoSeccion: "S-FIS",
    rutDeudor: "80.159.753-2",
    nombreDeudor: "Exportaciones Mineras SpA",
    norma: "OA-1",
    fundamento: "F-173-1",
    descripcionHechos: "Exportación de concentrado de cobre sin declarar metales preciosos detectada en fiscalización posterior.",
    montoTotal: "$5.200.000",
    montoDerechos: 4000000,
    montoMulta: 1000000,
    montoIntereses: 200000,
    cuentas: [
      { id: 'cc-025', codigoCuenta: '101', nombreCuenta: 'Derechos Aduaneros', monto: 4000000, moneda: 'CLP', orden: 1 },
      { id: 'cc-026', codigoCuenta: '201', nombreCuenta: 'Multa Art. 173', monto: 1000000, moneda: 'CLP', orden: 2 },
      { id: 'cc-027', codigoCuenta: '301', nombreCuenta: 'Intereses Moratorios', monto: 200000, moneda: 'CLP', orden: 3 },
    ],
    infractores: [
      { 
        id: 'ci-009', 
        idInvolucrado: 'inv-009', 
        rut: '82.159.357-2', 
        nombre: 'Comercializadora Norte Grande SpA', 
        tipoInfractor: 'Infractor Principal',
        esPrincipal: true,
        porcentajeResponsabilidad: 100
      }
    ],
    diasVencimiento: 0,
    fechaVencimiento: "22-11-2025",
    denunciaAsociada: "d-008",
    denunciaNumero: "993526",
    girosGenerados: ["g-005"],
    loginFuncionario: "agomez",
    fechaCreacion: "22-11-2025",
    usuarioCreacion: "agomez",
  },
];

// ============================================
// FUNCIONES HELPER PARA CARGOS
// ============================================

export const getCargoPorId = (id: string) => 
  cargos.find(c => c.id === id);

export const getCargoPorNumero = (numero: string) => 
  cargos.find(c => c.numeroCargo === numero);

export const getCargosPorEstado = (estado: Cargo['estado']) =>
  cargos.filter(c => c.estado === estado);

export const getCargosPorOrigen = (origen: Cargo['origen']) =>
  cargos.filter(c => c.origen === origen);

export const getCargosVencidos = () =>
  cargos.filter(c => c.diasVencimiento < 0);

export const getCargosPorVencer = (dias: number = 5) =>
  cargos.filter(c => c.diasVencimiento >= 0 && c.diasVencimiento <= dias);

export const getCargosPorDenuncia = (denunciaId: string) =>
  cargos.filter(c => c.denunciaAsociada === denunciaId);

export const getCargosPorDenunciaNumero = (denunciaNumero: string) =>
  cargos.filter(c => c.denunciaNumero === denunciaNumero);

export const getCargosPorAduana = (codigoAduana: string) =>
  cargos.filter(c => c.codigoAduana === codigoAduana || c.aduana === codigoAduana);

export const getCargosConGiros = () =>
  cargos.filter(c => c.girosGenerados && c.girosGenerados.length > 0);

// Calcular total de cuentas de un cargo
export const calcularTotalCargo = (cuentas: CargoCuenta[]): number => {
  return cuentas.reduce((sum, cuenta) => sum + cuenta.monto, 0);
};

// Validar si cargo puede ser emitido
export const puedeEmitirCargo = (cargo: Cargo): { valido: boolean; errores: string[] } => {
  const errores: string[] = [];
  
  if (!cargo.cuentas || cargo.cuentas.length === 0) {
    errores.push('No se puede emitir cargo sin cuentas de cargo.');
  }
  
  if (!cargo.descripcionHechos) {
    errores.push('Debe completar la descripción de hechos.');
  }
  
  if (!cargo.norma) {
    errores.push('Debe seleccionar una norma.');
  }
  
  if (!cargo.fundamento) {
    errores.push('Debe seleccionar un fundamento.');
  }
  
  const total = cargo.cuentas ? calcularTotalCargo(cargo.cuentas) : 0;
  if (total <= 0) {
    errores.push('El total debe ser mayor a 0.');
  }
  
  if (!cargo.infractores || cargo.infractores.length === 0) {
    errores.push('Debe registrar al menos un infractor.');
  }
  
  return {
    valido: errores.length === 0,
    errores
  };
};

// Obtener permisos según estado del cargo
export const getPermisosCargo = (estado: Cargo['estado']) => {
  const permisos = {
    puedeEditar: false,
    puedeEmitir: false,
    puedeAprobar: false,
    puedeRechazar: false,
    puedeAnular: false,
    puedeGenerarGiro: false,
    puedeNotificar: false,
    puedeCerrar: false,
  };
  
  switch (estado) {
    case 'Borrador':
      permisos.puedeEditar = true;
      permisos.puedeEmitir = true;
      break;
    case 'Observado':
      permisos.puedeEditar = true;
      permisos.puedeEmitir = true;
      break;
    case 'Pendiente Aprobación':
      permisos.puedeAprobar = true;
      permisos.puedeRechazar = true;
      break;
    case 'En Revisión':
      permisos.puedeAprobar = true;
      permisos.puedeRechazar = true;
      break;
    case 'Aprobado':
    case 'Emitido':
      permisos.puedeNotificar = true;
      permisos.puedeGenerarGiro = true;
      permisos.puedeAnular = true;
      break;
    case 'Notificado':
      permisos.puedeGenerarGiro = true;
      permisos.puedeCerrar = true;
      break;
    case 'Cerrado':
    case 'Anulado':
    case 'Rechazado':
      // Sin permisos
      break;
  }
  
  return permisos;
};

export const getConteoCargos = () => ({
  total: cargos.length,
  porEstado: {
    borrador: cargos.filter(c => c.estado === 'Borrador').length,
    observado: cargos.filter(c => c.estado === 'Observado').length,
    pendienteAprobacion: cargos.filter(c => c.estado === 'Pendiente Aprobación').length,
    enRevision: cargos.filter(c => c.estado === 'En Revisión').length,
    emitido: cargos.filter(c => c.estado === 'Emitido').length,
    aprobado: cargos.filter(c => c.estado === 'Aprobado').length,
    rechazado: cargos.filter(c => c.estado === 'Rechazado').length,
    notificado: cargos.filter(c => c.estado === 'Notificado').length,
    cerrado: cargos.filter(c => c.estado === 'Cerrado').length,
    anulado: cargos.filter(c => c.estado === 'Anulado').length,
  },
  vencidos: cargos.filter(c => c.diasVencimiento < 0).length,
  porVencer: cargos.filter(c => c.diasVencimiento >= 0 && c.diasVencimiento <= 5).length,
  pendientes: cargos.filter(c => ['Borrador', 'Observado', 'Pendiente Aprobación', 'En Revisión'].includes(c.estado)).length,
  aprobados: cargos.filter(c => c.estado === 'Aprobado' || c.estado === 'Emitido').length,
  rechazados: cargos.filter(c => c.estado === 'Rechazado').length,
  montoTotal: cargos.reduce((sum, c) => {
    const monto = parseInt(c.montoTotal.replace(/[$,.]/g, ''));
    return sum + monto;
  }, 0),
});

export const formatMonto = (monto: number): string => {
  return '$' + monto.toLocaleString('es-CL');
};

// Funciones para crear y actualizar cargos (mock)
let cargoIdCounter = 9;

export const crearCargo = (data: Partial<Cargo>): Cargo => {
  cargoIdCounter++;
  const nuevoCargo: Cargo = {
    id: `c-${String(cargoIdCounter).padStart(3, '0')}`,
    numeroCargo: `CAR-2024-${String(5685 + cargoIdCounter).padStart(6, '0')}`,
    fechaIngreso: new Date().toLocaleDateString('es-CL'),
    estado: 'Borrador',
    origen: 'TRAMITE_ADUANERO',
    aduana: '',
    rutDeudor: '',
    nombreDeudor: '',
    montoTotal: '$0',
    diasVencimiento: 30,
    fechaCreacion: new Date().toISOString(),
    usuarioCreacion: 'sistema',
    cuentas: [],
    infractores: [],
    ...data,
  };
  cargos.push(nuevoCargo);
  return nuevoCargo;
};

export const actualizarCargo = (id: string, data: Partial<Cargo>): Cargo | null => {
  const index = cargos.findIndex(c => c.id === id);
  if (index === -1) return null;
  
  cargos[index] = {
    ...cargos[index],
    ...data,
    fechaModificacion: new Date().toISOString(),
  };
  
  return cargos[index];
};

// Helpers para catálogos
export const getCuentaPorCodigo = (codigo: string) =>
  cuentasCatalogo.find(c => c.codigo === codigo);

export const getNormaPorCodigo = (codigo: string) =>
  normasCatalogo.find(n => n.codigo === codigo);

export const getFundamentoPorCodigo = (codigo: string) =>
  fundamentosCatalogo.find(f => f.codigo === codigo);
