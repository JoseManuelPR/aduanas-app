/**
 * Base de datos mock - Giros
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import type { 
  Giro, 
  GiroCuenta, 
  GiroPago, 
  EstadoGiro, 
  TipoGiro, 
  OrigenGiro
} from './types';

// ============================================
// DATOS MOCK - GIROS COMPLETOS
// ============================================

export const giros: Giro[] = [
  {
    id: "g-001",
    numeroGiro: "F09-2024-001234",
    tipoGiro: "F09",
    estado: "Emitido",
    origenGiro: "CARGO",
    entidadOrigenId: "c-001",
    numeroEntidadOrigen: "CAR-2024-005678",
    fechaEmision: "20-11-2025",
    fechaVencimiento: "20-12-2025",
    plazo: 30,
    diaHabil: true,
    emitidoA: "Importadora Global S.A.",
    rutDeudor: "76.123.456-7",
    direccionDeudor: "Av. Principal 1234, Valparaíso",
    emailDeudor: "contacto@importadoraglobal.cl",
    aduana: "Valparaíso",
    codigoAduana: "VLP",
    montoTotal: "$12.500.000",
    montoTotalNumero: 12500000,
    montoPagado: 0,
    saldoPendiente: 12500000,
    cuentas: [
      { id: 'gc-001', codigoCuenta: '101', nombreCuenta: 'Derechos Aduaneros', monto: 5500000, moneda: 'CLP', orden: 1 },
      { id: 'gc-002', codigoCuenta: '102', nombreCuenta: 'IVA Aduana', monto: 3000000, moneda: 'CLP', orden: 2 },
      { id: 'gc-003', codigoCuenta: '201', nombreCuenta: 'Multa Art. 173', monto: 3500000, moneda: 'CLP', orden: 3 },
      { id: 'gc-004', codigoCuenta: '301', nombreCuenta: 'Intereses Moratorios', monto: 500000, moneda: 'CLP', orden: 4 },
    ],
    pagos: [],
    cargoAsociado: "c-001",
    cargoNumero: "CAR-2024-005678",
    diasVencimiento: 30,
    loginFuncionario: "jperez",
    fechaCreacion: "20-11-2025",
    usuarioCreacion: "jperez",
  },
  {
    id: "g-002",
    numeroGiro: "F16-2024-000567",
    tipoGiro: "F16",
    estado: "Pagado",
    origenGiro: "CARGO",
    entidadOrigenId: "c-002",
    numeroEntidadOrigen: "CAR-2024-005679",
    fechaEmision: "15-11-2025",
    fechaVencimiento: "15-12-2025",
    fechaPago: "28-11-2025",
    plazo: 30,
    emitidoA: "Comercial Los Andes Ltda.",
    rutDeudor: "77.987.654-3",
    aduana: "Santiago",
    codigoAduana: "SCL",
    montoTotal: "$8.750.000",
    montoTotalNumero: 8750000,
    montoPagado: 8750000,
    saldoPendiente: 0,
    cuentas: [
      { id: 'gc-005', codigoCuenta: '101', nombreCuenta: 'Derechos Aduaneros', monto: 6500000, moneda: 'CLP', orden: 1 },
      { id: 'gc-006', codigoCuenta: '202', nombreCuenta: 'Multa Art. 174', monto: 2000000, moneda: 'CLP', orden: 2 },
      { id: 'gc-007', codigoCuenta: '301', nombreCuenta: 'Intereses Moratorios', monto: 250000, moneda: 'CLP', orden: 3 },
    ],
    pagos: [
      {
        id: 'gp-001',
        fecha: '28-11-2025',
        monto: 8750000,
        formaPago: 'Transferencia',
        numeroComprobante: 'TRF-2024-00567',
        banco: 'Banco Estado',
        observaciones: 'Pago total en una cuota',
        usuarioRegistro: 'mlopez',
        fechaRegistro: '28-11-2025',
      }
    ],
    cargoAsociado: "c-002",
    cargoNumero: "CAR-2024-005679",
    numeroComprobante: "TRF-2024-00567",
    diasVencimiento: 0,
    loginFuncionario: "mlopez",
    fechaCreacion: "15-11-2025",
    usuarioCreacion: "mlopez",
  },
  {
    id: "g-003",
    numeroGiro: "F09-2024-001235",
    tipoGiro: "F09",
    estado: "Vencido",
    origenGiro: "CARGO",
    entidadOrigenId: "c-004",
    numeroEntidadOrigen: "CAR-2024-005681",
    fechaEmision: "10-11-2025",
    fechaVencimiento: "25-11-2025",
    plazo: 15,
    emitidoA: "Zona Franca del Pacífico",
    rutDeudor: "81.321.654-9",
    direccionDeudor: "Zona Franca Iquique, Módulo 45",
    aduana: "Iquique",
    codigoAduana: "IQQ",
    montoTotal: "$3.450.000",
    montoTotalNumero: 3450000,
    montoPagado: 0,
    saldoPendiente: 3450000,
    cuentas: [
      { id: 'gc-008', codigoCuenta: '101', nombreCuenta: 'Derechos Aduaneros', monto: 2500000, moneda: 'CLP', orden: 1 },
      { id: 'gc-009', codigoCuenta: '202', nombreCuenta: 'Multa Art. 174', monto: 800000, moneda: 'CLP', orden: 2 },
      { id: 'gc-010', codigoCuenta: '301', nombreCuenta: 'Intereses Moratorios', monto: 150000, moneda: 'CLP', orden: 3 },
    ],
    pagos: [],
    cargoAsociado: "c-004",
    cargoNumero: "CAR-2024-005681",
    diasVencimiento: -5,
    loginFuncionario: "crodriguez",
    fechaCreacion: "10-11-2025",
    usuarioCreacion: "crodriguez",
    observaciones: "Giro vencido, pendiente gestión de cobro",
  },
  {
    id: "g-004",
    numeroGiro: "F17-2024-000089",
    tipoGiro: "F17",
    estado: "Parcialmente Pagado",
    origenGiro: "CARGO",
    entidadOrigenId: "c-003",
    numeroEntidadOrigen: "CAR-2024-005680",
    fechaEmision: "18-11-2025",
    fechaVencimiento: "18-12-2025",
    plazo: 30,
    emitidoA: "Minera del Norte SpA",
    rutDeudor: "80.456.123-5",
    direccionDeudor: "Av. Minería 5678, Antofagasta",
    emailDeudor: "legal@mineradelnorte.cl",
    aduana: "Antofagasta",
    codigoAduana: "ANT",
    montoTotal: "$45.200.000",
    montoTotalNumero: 45200000,
    montoPagado: 20000000,
    saldoPendiente: 25200000,
    cuentas: [
      { id: 'gc-011', codigoCuenta: '101', nombreCuenta: 'Derechos Aduaneros', monto: 25000000, moneda: 'CLP', orden: 1 },
      { id: 'gc-012', codigoCuenta: '102', nombreCuenta: 'IVA Aduana', monto: 10000000, moneda: 'CLP', orden: 2 },
      { id: 'gc-013', codigoCuenta: '201', nombreCuenta: 'Multa Art. 173', monto: 8500000, moneda: 'CLP', orden: 3 },
      { id: 'gc-014', codigoCuenta: '301', nombreCuenta: 'Intereses Moratorios', monto: 1700000, moneda: 'CLP', orden: 4 },
    ],
    pagos: [
      {
        id: 'gp-002',
        fecha: '22-11-2025',
        monto: 10000000,
        formaPago: 'Transferencia',
        numeroComprobante: 'TRF-2024-00890',
        banco: 'Banco de Chile',
        observaciones: 'Primer abono',
        usuarioRegistro: 'agomez',
        fechaRegistro: '22-11-2025',
      },
      {
        id: 'gp-003',
        fecha: '25-11-2025',
        monto: 10000000,
        formaPago: 'Depósito',
        numeroComprobante: 'DEP-2024-00891',
        banco: 'Banco Estado',
        observaciones: 'Segundo abono',
        usuarioRegistro: 'agomez',
        fechaRegistro: '25-11-2025',
      }
    ],
    cargoAsociado: "c-003",
    cargoNumero: "CAR-2024-005680",
    mercanciaId: "m-002",
    diasVencimiento: 18,
    loginFuncionario: "agomez",
    fechaCreacion: "18-11-2025",
    usuarioCreacion: "agomez",
  },
  {
    id: "g-005",
    numeroGiro: "F09-2024-001236",
    tipoGiro: "F09",
    estado: "Pagado",
    origenGiro: "DENUNCIA",
    entidadOrigenId: "d-008",
    numeroEntidadOrigen: "993526",
    fechaEmision: "05-11-2025",
    fechaVencimiento: "05-12-2025",
    fechaPago: "20-11-2025",
    plazo: 30,
    emitidoA: "Exportaciones Mineras SpA",
    rutDeudor: "80.159.753-2",
    direccionDeudor: "Av. Balmaceda 1234, Antofagasta",
    aduana: "Antofagasta",
    codigoAduana: "ANT",
    montoTotal: "$15.800.000",
    montoTotalNumero: 15800000,
    montoPagado: 15800000,
    saldoPendiente: 0,
    cuentas: [
      { id: 'gc-015', codigoCuenta: '101', nombreCuenta: 'Derechos Aduaneros', monto: 12000000, moneda: 'CLP', orden: 1 },
      { id: 'gc-016', codigoCuenta: '201', nombreCuenta: 'Multa Art. 173', monto: 3500000, moneda: 'CLP', orden: 2 },
      { id: 'gc-017', codigoCuenta: '301', nombreCuenta: 'Intereses Moratorios', monto: 300000, moneda: 'CLP', orden: 3 },
    ],
    pagos: [
      {
        id: 'gp-004',
        fecha: '20-11-2025',
        monto: 15800000,
        formaPago: 'Vale Vista',
        numeroComprobante: 'VV-2024-00123',
        banco: 'Banco Santander',
        observaciones: 'Pago total',
        usuarioRegistro: 'pmartin',
        fechaRegistro: '20-11-2025',
      }
    ],
    denunciaAsociada: "d-008",
    denunciaNumero: "993526",
    numeroComprobante: "VV-2024-00123",
    diasVencimiento: 0,
    loginFuncionario: "pmartin",
    fechaCreacion: "05-11-2025",
    usuarioCreacion: "pmartin",
  },
  {
    id: "g-006",
    numeroGiro: "F16-2024-000568",
    tipoGiro: "F16",
    estado: "Emitido",
    origenGiro: "CARGO",
    entidadOrigenId: "c-006",
    numeroEntidadOrigen: "CAR-2024-005683",
    fechaEmision: "12-11-2025",
    fechaVencimiento: "12-12-2025",
    plazo: 30,
    emitidoA: "Distribuidora Nacional S.A.",
    rutDeudor: "76.852.963-1",
    direccionDeudor: "Av. Comercio 4567, Valparaíso",
    emailDeudor: "gerencia@distribuidoranacional.cl",
    aduana: "Valparaíso",
    codigoAduana: "VLP",
    montoTotal: "$67.500.000",
    montoTotalNumero: 67500000,
    montoPagado: 0,
    saldoPendiente: 67500000,
    cuentas: [
      { id: 'gc-018', codigoCuenta: '101', nombreCuenta: 'Derechos Aduaneros', monto: 35000000, moneda: 'CLP', orden: 1 },
      { id: 'gc-019', codigoCuenta: '102', nombreCuenta: 'IVA Aduana', monto: 15000000, moneda: 'CLP', orden: 2 },
      { id: 'gc-020', codigoCuenta: '201', nombreCuenta: 'Multa Art. 173', monto: 15000000, moneda: 'CLP', orden: 3 },
      { id: 'gc-021', codigoCuenta: '301', nombreCuenta: 'Intereses Moratorios', monto: 2500000, moneda: 'CLP', orden: 4 },
    ],
    pagos: [],
    cargoAsociado: "c-006",
    cargoNumero: "CAR-2024-005683",
    mercanciaId: "m-003",
    diasVencimiento: 12,
    loginFuncionario: "jperez",
    fechaCreacion: "12-11-2025",
    usuarioCreacion: "jperez",
  },
  {
    id: "g-007",
    numeroGiro: "F09-2024-001237",
    tipoGiro: "F09",
    estado: "Vencido",
    origenGiro: "MANUAL",
    fechaEmision: "01-11-2025",
    fechaVencimiento: "20-11-2025",
    plazo: 19,
    emitidoA: "Comercial Norte Ltda.",
    rutDeudor: "78.963.741-5",
    aduana: "Arica",
    codigoAduana: "ARI",
    montoTotal: "$5.200.000",
    montoTotalNumero: 5200000,
    montoPagado: 0,
    saldoPendiente: 5200000,
    cuentas: [
      { id: 'gc-022', codigoCuenta: '101', nombreCuenta: 'Derechos Aduaneros', monto: 4000000, moneda: 'CLP', orden: 1 },
      { id: 'gc-023', codigoCuenta: '201', nombreCuenta: 'Multa Art. 173', monto: 1000000, moneda: 'CLP', orden: 2 },
      { id: 'gc-024', codigoCuenta: '301', nombreCuenta: 'Intereses Moratorios', monto: 200000, moneda: 'CLP', orden: 3 },
    ],
    pagos: [],
    diasVencimiento: -10,
    loginFuncionario: "crodriguez",
    fechaCreacion: "01-11-2025",
    usuarioCreacion: "crodriguez",
    observaciones: "Giro vencido hace 10 días",
  },
  {
    id: "g-008",
    numeroGiro: "F17-2024-000090",
    tipoGiro: "F17",
    estado: "Emitido",
    origenGiro: "CARGO",
    entidadOrigenId: "c-007",
    numeroEntidadOrigen: "CAR-2024-005684",
    fechaEmision: "22-11-2025",
    fechaVencimiento: "22-12-2025",
    plazo: 30,
    emitidoA: "Importaciones del Sur Ltda.",
    rutDeudor: "78.456.789-0",
    aduana: "Santiago",
    codigoAduana: "SCL",
    montoTotal: "$9.800.000",
    montoTotalNumero: 9800000,
    montoPagado: 0,
    saldoPendiente: 9800000,
    cuentas: [
      { id: 'gc-025', codigoCuenta: '101', nombreCuenta: 'Derechos Aduaneros', monto: 7000000, moneda: 'CLP', orden: 1 },
      { id: 'gc-026', codigoCuenta: '202', nombreCuenta: 'Multa Art. 174', monto: 2500000, moneda: 'CLP', orden: 2 },
      { id: 'gc-027', codigoCuenta: '301', nombreCuenta: 'Intereses Moratorios', monto: 300000, moneda: 'CLP', orden: 3 },
    ],
    pagos: [],
    cargoAsociado: "c-007",
    cargoNumero: "CAR-2024-005684",
    diasVencimiento: 22,
    loginFuncionario: "mlopez",
    fechaCreacion: "22-11-2025",
    usuarioCreacion: "mlopez",
  },
  {
    id: "g-009",
    numeroGiro: "F09-2024-001238",
    tipoGiro: "F09",
    estado: "Pagado",
    origenGiro: "CARGO",
    entidadOrigenId: "c-005",
    numeroEntidadOrigen: "CAR-2024-005682",
    fechaEmision: "08-11-2025",
    fechaVencimiento: "08-12-2025",
    fechaPago: "25-11-2025",
    plazo: 30,
    emitidoA: "Transportes Cordillera Ltda.",
    rutDeudor: "79.147.258-6",
    aduana: "Los Andes",
    codigoAduana: "LAN",
    montoTotal: "$1.250.000",
    montoTotalNumero: 1250000,
    montoPagado: 1250000,
    saldoPendiente: 0,
    cuentas: [
      { id: 'gc-028', codigoCuenta: '101', nombreCuenta: 'Derechos Aduaneros', monto: 1000000, moneda: 'CLP', orden: 1 },
      { id: 'gc-029', codigoCuenta: '301', nombreCuenta: 'Intereses Moratorios', monto: 250000, moneda: 'CLP', orden: 2 },
    ],
    pagos: [
      {
        id: 'gp-005',
        fecha: '25-11-2025',
        monto: 1250000,
        formaPago: 'Transferencia',
        numeroComprobante: 'TRF-2024-01238',
        banco: 'Banco Estado',
        observaciones: 'Pago total en una cuota',
        usuarioRegistro: 'pmartin',
        fechaRegistro: '25-11-2025',
      }
    ],
    cargoAsociado: "c-005",
    cargoNumero: "CAR-2024-005682",
    denunciaAsociada: "d-005",
    denunciaNumero: "993523",
    numeroComprobante: "TRF-2024-01238",
    diasVencimiento: 0,
    loginFuncionario: "pmartin",
    fechaCreacion: "08-11-2025",
    usuarioCreacion: "pmartin",
  },
  {
    id: "g-010",
    numeroGiro: "F16-2024-000569",
    tipoGiro: "F16",
    estado: "Anulado",
    origenGiro: "CARGO",
    entidadOrigenId: "c-005",
    numeroEntidadOrigen: "CAR-2024-005682",
    fechaEmision: "25-10-2025",
    fechaVencimiento: "15-11-2025",
    plazo: 21,
    emitidoA: "Transportes Cordillera Ltda.",
    rutDeudor: "79.147.258-6",
    aduana: "Los Andes",
    codigoAduana: "LAN",
    montoTotal: "$1.250.000",
    montoTotalNumero: 1250000,
    montoPagado: 0,
    saldoPendiente: 0,
    cuentas: [
      { id: 'gc-031', codigoCuenta: '101', nombreCuenta: 'Derechos Aduaneros', monto: 1000000, moneda: 'CLP', orden: 1 },
      { id: 'gc-032', codigoCuenta: '301', nombreCuenta: 'Intereses Moratorios', monto: 250000, moneda: 'CLP', orden: 2 },
    ],
    pagos: [],
    cargoAsociado: "c-005",
    cargoNumero: "CAR-2024-005682",
    diasVencimiento: 0,
    loginFuncionario: "pmartin",
    fechaCreacion: "25-10-2025",
    usuarioCreacion: "pmartin",
    motivoAnulacion: "Error en cálculo de montos, se emitirá nuevo giro corregido",
    fechaModificacion: "28-10-2025",
    usuarioModificacion: "jperez",
  },
];

// ============================================
// FUNCIONES HELPER PARA GIROS
// ============================================

export const getGiroPorId = (id: string) => 
  giros.find(g => g.id === id);

export const getGiroPorNumero = (numero: string) => 
  giros.find(g => g.numeroGiro === numero);

export const getGirosPorEstado = (estado: EstadoGiro) =>
  giros.filter(g => g.estado === estado);

export const getGirosPorTipo = (tipo: TipoGiro) =>
  giros.filter(g => g.tipoGiro === tipo);

export const getGirosPorOrigen = (origen: OrigenGiro) =>
  giros.filter(g => g.origenGiro === origen);

export const getGirosVencidos = () =>
  giros.filter(g => g.estado === 'Vencido');

export const getGirosPorVencer = (dias: number = 5) =>
  giros.filter(g => g.diasVencimiento !== undefined && g.diasVencimiento >= 0 && g.diasVencimiento <= dias);

export const getGirosPorCargo = (cargoId: string) =>
  giros.filter(g => g.cargoAsociado === cargoId || g.entidadOrigenId === cargoId);

export const getGirosPorCargoNumero = (cargoNumero: string) =>
  giros.filter(g => g.cargoNumero === cargoNumero || g.numeroEntidadOrigen === cargoNumero);

export const getGirosPorDenuncia = (denunciaId: string) =>
  giros.filter(g => g.denunciaAsociada === denunciaId || g.entidadOrigenId === denunciaId);

export const getGirosPorDeudor = (rutDeudor: string) =>
  giros.filter(g => g.rutDeudor === rutDeudor);

export const getGirosPorAduana = (codigoAduana: string) =>
  giros.filter(g => g.codigoAduana === codigoAduana || g.aduana === codigoAduana);

// Calcular total de cuentas de un giro
export const calcularTotalGiro = (cuentas: GiroCuenta[]): number => {
  return cuentas.reduce((sum, cuenta) => sum + cuenta.monto, 0);
};

// Calcular saldo pendiente
export const calcularSaldoPendiente = (giro: Giro): number => {
  const total = giro.montoTotalNumero || parseInt(giro.montoTotal.replace(/[$,.]/g, ''));
  const pagado = giro.montoPagado || 0;
  return total - pagado;
};

// Validar si se puede registrar pago
export const puedeRegistrarPago = (giro: Giro): { valido: boolean; errores: string[] } => {
  const errores: string[] = [];
  
  if (giro.estado !== 'Emitido' && giro.estado !== 'Vencido' && giro.estado !== 'Parcialmente Pagado') {
    errores.push('Solo se puede registrar pago en giros Emitidos, Vencidos o Parcialmente Pagados.');
  }
  
  if (giro.saldoPendiente === 0) {
    errores.push('El giro ya está completamente pagado.');
  }
  
  return {
    valido: errores.length === 0,
    errores
  };
};

// Validar pago
export const validarPago = (giro: Giro, montoPago: number, fechaPago: string): { valido: boolean; errores: string[] } => {
  const errores: string[] = [];
  const saldo = calcularSaldoPendiente(giro);
  
  if (montoPago <= 0) {
    errores.push('El monto del pago debe ser mayor a 0.');
  }
  
  if (montoPago > saldo) {
    errores.push(`El monto del pago ($${montoPago.toLocaleString('es-CL')}) excede el saldo pendiente ($${saldo.toLocaleString('es-CL')}).`);
  }
  
  // Validar fecha no futura (simplificado)
  const hoy = new Date();
  const fecha = new Date(fechaPago);
  if (fecha > hoy) {
    errores.push('La fecha de pago no puede ser futura.');
  }
  
  return {
    valido: errores.length === 0,
    errores
  };
};

// Validar si se puede anular
export const puedeAnularGiro = (giro: Giro): { valido: boolean; errores: string[] } => {
  const errores: string[] = [];
  
  if (giro.estado === 'Pagado') {
    errores.push('No se puede anular un giro pagado.');
  }
  
  if (giro.estado === 'Anulado') {
    errores.push('El giro ya está anulado.');
  }
  
  if (giro.montoPagado && giro.montoPagado > 0) {
    errores.push('No se puede anular un giro con pagos registrados.');
  }
  
  return {
    valido: errores.length === 0,
    errores
  };
};

// Obtener permisos según estado del giro
export const getPermisosGiro = (estado: EstadoGiro) => {
  const permisos = {
    puedeEditar: false,
    puedeAnular: false,
    puedeRegistrarPago: false,
    puedeVerDetalle: true,
  };
  
  switch (estado) {
    case 'Emitido':
      permisos.puedeAnular = true;
      permisos.puedeRegistrarPago = true;
      break;
    case 'Parcialmente Pagado':
      permisos.puedeRegistrarPago = true;
      break;
    case 'Vencido':
      permisos.puedeRegistrarPago = true;
      break;
    case 'Pagado':
    case 'Anulado':
      // Sin acciones
      break;
  }
  
  return permisos;
};

export const getConteoGiros = () => {
  const montoRecaudado = giros
    .filter(g => g.estado === 'Pagado' || g.estado === 'Parcialmente Pagado')
    .reduce((sum, g) => sum + (g.montoPagado || 0), 0);

  const montoPendiente = giros
    .filter(g => g.estado !== 'Pagado' && g.estado !== 'Anulado')
    .reduce((sum, g) => sum + (g.saldoPendiente || 0), 0);

  return {
    total: giros.length,
    porEstado: {
      emitido: giros.filter(g => g.estado === 'Emitido').length,
      pagado: giros.filter(g => g.estado === 'Pagado').length,
      parcialmentePagado: giros.filter(g => g.estado === 'Parcialmente Pagado').length,
      vencido: giros.filter(g => g.estado === 'Vencido').length,
      anulado: giros.filter(g => g.estado === 'Anulado').length,
    },
    porTipo: {
      f09: giros.filter(g => g.tipoGiro === 'F09').length,
      f16: giros.filter(g => g.tipoGiro === 'F16').length,
      f17: giros.filter(g => g.tipoGiro === 'F17').length,
    },
    porOrigen: {
      cargo: giros.filter(g => g.origenGiro === 'CARGO').length,
      denuncia: giros.filter(g => g.origenGiro === 'DENUNCIA').length,
      manual: giros.filter(g => g.origenGiro === 'MANUAL').length,
    },
    emitidos: giros.filter(g => g.estado === 'Emitido').length,
    pagados: giros.filter(g => g.estado === 'Pagado').length,
    vencidos: giros.filter(g => g.estado === 'Vencido').length,
    pendientes: giros.filter(g => ['Emitido', 'Parcialmente Pagado'].includes(g.estado)).length,
    montoRecaudado,
    montoPendiente,
    montoRecaudadoFormateado: '$' + montoRecaudado.toLocaleString('es-CL'),
    montoPendienteFormateado: '$' + montoPendiente.toLocaleString('es-CL'),
  };
};

export const formatMonto = (monto: number): string => {
  return '$' + monto.toLocaleString('es-CL');
};

// Funciones para crear, actualizar y registrar pagos (mock)
let giroIdCounter = 11;

export const crearGiro = (data: Partial<Giro>): Giro => {
  giroIdCounter++;
  const tipoGiro = data.tipoGiro || 'F09';
  const nuevoGiro: Giro = {
    id: `g-${String(giroIdCounter).padStart(3, '0')}`,
    numeroGiro: `${tipoGiro}-2024-${String(1238 + giroIdCounter).padStart(6, '0')}`,
    tipoGiro,
    estado: 'Emitido',
    origenGiro: data.origenGiro || 'MANUAL',
    fechaEmision: new Date().toLocaleDateString('es-CL'),
    fechaVencimiento: '',
    emitidoA: '',
    tipoIdDeudor: 'RUT',
    rutDeudor: '',
    montoTotal: '$0',
    montoTotalNumero: 0,
    montoPagado: 0,
    saldoPendiente: 0,
    cuentas: [],
    pagos: [],
    diasVencimiento: 30,
    fechaCreacion: new Date().toISOString(),
    usuarioCreacion: 'sistema',
    ...data,
  };
  giros.push(nuevoGiro);
  return nuevoGiro;
};

export const actualizarGiro = (id: string, data: Partial<Giro>): Giro | null => {
  const index = giros.findIndex(g => g.id === id);
  if (index === -1) return null;
  
  giros[index] = {
    ...giros[index],
    ...data,
    fechaModificacion: new Date().toISOString(),
  };
  
  return giros[index];
};

export const registrarPagoGiro = (
  giroId: string, 
  pago: Omit<GiroPago, 'id'>
): { exito: boolean; giro?: Giro; error?: string } => {
  const index = giros.findIndex(g => g.id === giroId);
  if (index === -1) return { exito: false, error: 'Giro no encontrado' };
  
  const giro = giros[index];
  const validacion = puedeRegistrarPago(giro);
  
  if (!validacion.valido) {
    return { exito: false, error: validacion.errores.join(' ') };
  }
  
  const nuevoPago: GiroPago = {
    ...pago,
    id: `gp-${Date.now()}`,
  };
  
  const nuevoPagos = [...(giro.pagos || []), nuevoPago];
  const nuevoMontoPagado = (giro.montoPagado || 0) + pago.monto;
  const montoTotal = giro.montoTotalNumero || parseInt(giro.montoTotal.replace(/[$,.]/g, ''));
  const nuevoSaldo = montoTotal - nuevoMontoPagado;
  
  let nuevoEstado: EstadoGiro = giro.estado;
  if (nuevoSaldo <= 0) {
    nuevoEstado = 'Pagado';
  } else if (nuevoMontoPagado > 0) {
    nuevoEstado = 'Parcialmente Pagado';
  }
  
  giros[index] = {
    ...giro,
    pagos: nuevoPagos,
    montoPagado: nuevoMontoPagado,
    saldoPendiente: nuevoSaldo,
    estado: nuevoEstado,
    fechaPago: nuevoEstado === 'Pagado' ? pago.fecha : giro.fechaPago,
    numeroComprobante: pago.numeroComprobante || giro.numeroComprobante,
    fechaModificacion: new Date().toISOString(),
  };
  
  return { exito: true, giro: giros[index] };
};

export const anularGiro = (giroId: string, motivo: string): { exito: boolean; giro?: Giro; error?: string } => {
  const index = giros.findIndex(g => g.id === giroId);
  if (index === -1) return { exito: false, error: 'Giro no encontrado' };
  
  const giro = giros[index];
  const validacion = puedeAnularGiro(giro);
  
  if (!validacion.valido) {
    return { exito: false, error: validacion.errores.join(' ') };
  }
  
  giros[index] = {
    ...giro,
    estado: 'Anulado',
    motivoAnulacion: motivo,
    saldoPendiente: 0,
    fechaModificacion: new Date().toISOString(),
  };
  
  return { exito: true, giro: giros[index] };
};
