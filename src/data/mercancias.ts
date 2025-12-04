/**
 * Base de datos mock - Mercancías
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import type { 
  Mercancia, 
  SeguimientoMercancia,
  EstadoMercancia, 
  TipoEventoMercancia,
  PermisosMercancia 
} from './types';

// ============================================
// DATOS MOCK - MERCANCÍAS
// ============================================

export const mercancias: Mercancia[] = [
  {
    id: "m-001",
    codigoMercancia: "MER-2024-00001",
    descripcion: "Equipos electrónicos - Televisores LED 55\"",
    descripcionDetallada: "Televisores LED marca Samsung, modelo UN55TU8000, 55 pulgadas, Smart TV, resolución 4K UHD.",
    partida: "8528",
    subpartida: "852872",
    posicionArancelaria: "8528.72.00",
    cantidad: 150,
    unidadMedida: "Unidades",
    numeroBultos: 150,
    pesoBruto: 3750,
    pesoNeto: 3000,
    valorFOB: 45000,
    valorCIF: 48500,
    valorAduanero: 52000,
    moneda: "USD",
    paisOrigen: "China",
    paisProcedencia: "China",
    estado: "En Custodia",
    ubicacion: "Bodega Fiscal Valparaíso - Sector A",
    bodega: "BF-VLP-001",
    seccionBodega: "A-15",
    contenedor: "MSKU1234567",
    manifiesto: "MAN-2024-00456",
    nave: "MSC CAROLINA",
    viaje: "025W",
    codigoAduanaIngreso: "VLP",
    nombreAduanaIngreso: "Valparaíso",
    fechaIngreso: "15-09-2025",
    denunciaId: "d-001",
    denunciaNumero: "993519",
    expedienteDigitalId: "exp-m-001",
    items: [
      {
        id: "im-001-1",
        mercanciaId: "m-001",
        descripcionItem: "TV LED Samsung 55\" UN55TU8000",
        cantidad: 150,
        unidadMedida: "Unidades",
        valorUnitario: 300,
        valorTotal: 45000,
        marca: "Samsung",
        modelo: "UN55TU8000",
        estado: "Bueno",
      }
    ],
    seguimientos: [
      {
        id: "sm-001-1",
        mercanciaId: "m-001",
        tipoEvento: "Ingreso",
        fechaEvento: "15-09-2025",
        ubicacionNueva: "Bodega Fiscal Valparaíso - Sector A",
        funcionarioResponsable: "Juan Pérez",
        observaciones: "Mercancía ingresada por retención en fiscalización de Denuncia 993519",
        fechaRegistro: "15-09-2025 10:30",
        usuarioRegistro: "jperez",
      },
      {
        id: "sm-001-2",
        mercanciaId: "m-001",
        tipoEvento: "Inventario",
        fechaEvento: "16-09-2025",
        funcionarioResponsable: "María González",
        observaciones: "Inventario completo realizado. 150 unidades verificadas en buen estado.",
        documentosAdjuntos: ["ACT-INV-2024-00123"],
        fechaRegistro: "16-09-2025 14:00",
        usuarioRegistro: "mgonzalez",
      },
      {
        id: "sm-001-3",
        mercanciaId: "m-001",
        tipoEvento: "Retención",
        fechaEvento: "18-09-2025",
        autoridad: "Aduana de Valparaíso",
        nroResolucion: "RES-RET-2024-00567",
        fechaResolucion: "18-09-2025",
        funcionarioResponsable: "Carlos Muñoz",
        observaciones: "Retención formal por proceso de denuncia en curso",
        fechaRegistro: "18-09-2025 09:15",
        usuarioRegistro: "cmunoz",
      }
    ],
    fechaCreacion: "15-09-2025",
    usuarioCreacion: "jperez",
    tieneAlertaDisposicion: false,
  },
  {
    id: "m-002",
    codigoMercancia: "MER-2024-00002",
    descripcion: "Ropa deportiva - Zapatillas marca falsificada",
    descripcionDetallada: "Zapatillas deportivas con marca Nike falsificada, diversos modelos y tallas.",
    partida: "6404",
    subpartida: "640411",
    posicionArancelaria: "6404.11.00",
    cantidad: 500,
    unidadMedida: "Pares",
    numeroBultos: 25,
    pesoBruto: 750,
    pesoNeto: 600,
    valorFOB: 5000,
    valorCIF: 5800,
    valorAduanero: 6200,
    moneda: "USD",
    paisOrigen: "China",
    estado: "Comisada",
    ubicacion: "Bodega Fiscal Santiago - Sector B",
    bodega: "BF-SCL-002",
    seccionBodega: "B-08",
    contenedor: "TCNU9876543",
    codigoAduanaIngreso: "SCL",
    nombreAduanaIngreso: "Santiago",
    fechaIngreso: "01-10-2025",
    denunciaId: "d-002",
    denunciaNumero: "993520",
    cargoId: "c-002",
    cargoNumero: "CAR-2024-005679",
    expedienteDigitalId: "exp-m-002",
    disposicionFinal: "Comiso",
    fechaDisposicionFinal: "15-11-2025",
    resolucionDisposicion: "RES-COM-2024-00234",
    seguimientos: [
      {
        id: "sm-002-1",
        mercanciaId: "m-002",
        tipoEvento: "Ingreso",
        fechaEvento: "01-10-2025",
        ubicacionNueva: "Bodega Fiscal Santiago - Sector B",
        funcionarioResponsable: "Ana López",
        fechaRegistro: "01-10-2025 08:30",
        usuarioRegistro: "alopez",
      },
      {
        id: "sm-002-2",
        mercanciaId: "m-002",
        tipoEvento: "Incautación",
        fechaEvento: "05-10-2025",
        autoridad: "Aduana de Santiago",
        nroResolucion: "RES-INC-2024-00456",
        fechaResolucion: "05-10-2025",
        funcionarioResponsable: "Pedro Martínez",
        observaciones: "Incautación por infracción marcaria - Marca Nike falsificada",
        fechaRegistro: "05-10-2025 11:00",
        usuarioRegistro: "pmartinez",
      },
      {
        id: "sm-002-3",
        mercanciaId: "m-002",
        tipoEvento: "Comiso",
        fechaEvento: "15-11-2025",
        autoridad: "Director Regional de Aduanas",
        nroResolucion: "RES-COM-2024-00234",
        fechaResolucion: "15-11-2025",
        funcionarioResponsable: "Roberto Sánchez",
        observaciones: "Comiso definitivo por infracción al artículo 168 de la Ordenanza de Aduanas",
        documentosAdjuntos: ["ACT-COM-2024-00234"],
        fechaRegistro: "15-11-2025 16:00",
        usuarioRegistro: "rsanchez",
      }
    ],
    fechaCreacion: "01-10-2025",
    usuarioCreacion: "alopez",
    tieneAlertaDisposicion: false,
  },
  {
    id: "m-003",
    codigoMercancia: "MER-2024-00003",
    descripcion: "Vehículo motorizado - Camioneta Toyota Hilux",
    descripcionDetallada: "Camioneta Toyota Hilux 2023, color blanco, motor diésel 2.8L, 4x4.",
    partida: "8704",
    subpartida: "870421",
    posicionArancelaria: "8704.21.00",
    cantidad: 1,
    unidadMedida: "Unidad",
    numeroBultos: 1,
    pesoBruto: 2200,
    valorFOB: 35000,
    valorCIF: 38500,
    valorAduanero: 42000,
    moneda: "USD",
    paisOrigen: "Japón",
    estado: "Incautada Judicialmente",
    ubicacion: "Recinto Fiscal Los Andes",
    bodega: "RF-LAN-001",
    codigoAduanaIngreso: "LAN",
    nombreAduanaIngreso: "Los Andes",
    fechaIngreso: "20-08-2025",
    denunciaId: "d-005",
    denunciaNumero: "993523",
    expedienteDigitalId: "exp-m-003",
    seguimientos: [
      {
        id: "sm-003-1",
        mercanciaId: "m-003",
        tipoEvento: "Ingreso",
        fechaEvento: "20-08-2025",
        ubicacionNueva: "Recinto Fiscal Los Andes",
        funcionarioResponsable: "Felipe Torres",
        observaciones: "Vehículo retenido en control fronterizo por documentación irregular",
        fechaRegistro: "20-08-2025 22:15",
        usuarioRegistro: "ftorres",
      },
      {
        id: "sm-003-2",
        mercanciaId: "m-003",
        tipoEvento: "Resolución Judicial",
        fechaEvento: "15-09-2025",
        autoridad: "Juzgado de Garantía de Los Andes",
        nroResolucion: "RIT-2024-00789",
        fechaResolucion: "15-09-2025",
        funcionarioResponsable: "Fiscal adjunto",
        observaciones: "Incautación judicial ordenada por tribunal. Causa RIT 789-2024.",
        fechaRegistro: "15-09-2025 18:00",
        usuarioRegistro: "sistema",
      }
    ],
    fechaCreacion: "20-08-2025",
    usuarioCreacion: "ftorres",
    tieneAlertaDisposicion: true,
    alertaEventosContradictorios: false,
  },
  {
    id: "m-004",
    codigoMercancia: "MER-2024-00004",
    descripcion: "Cigarrillos de contrabando",
    descripcionDetallada: "Cigarrillos marca Marlboro y Kent sin timbre fiscal ni autorización sanitaria.",
    partida: "2402",
    subpartida: "240220",
    posicionArancelaria: "2402.20.00",
    cantidad: 50000,
    unidadMedida: "Cajetillas",
    numeroBultos: 500,
    pesoBruto: 1250,
    pesoNeto: 1000,
    valorFOB: 25000,
    valorCIF: 27500,
    moneda: "USD",
    paisOrigen: "Paraguay",
    estado: "Destruida",
    ubicacion: "N/A - Destruida",
    codigoAduanaIngreso: "ANT",
    nombreAduanaIngreso: "Antofagasta",
    fechaIngreso: "10-07-2025",
    denunciaId: "d-010",
    denunciaNumero: "993510",
    disposicionFinal: "Destrucción",
    fechaDisposicionFinal: "20-10-2025",
    resolucionDisposicion: "RES-DES-2024-00089",
    seguimientos: [
      {
        id: "sm-004-1",
        mercanciaId: "m-004",
        tipoEvento: "Ingreso",
        fechaEvento: "10-07-2025",
        ubicacionNueva: "Bodega Fiscal Antofagasta",
        funcionarioResponsable: "Luis Vargas",
        observaciones: "Mercancía incautada en operativo de control de rutas",
        fechaRegistro: "10-07-2025 06:30",
        usuarioRegistro: "lvargas",
      },
      {
        id: "sm-004-2",
        mercanciaId: "m-004",
        tipoEvento: "Comiso",
        fechaEvento: "25-08-2025",
        autoridad: "Director Regional Aduanas Norte",
        nroResolucion: "RES-COM-2024-00156",
        fechaResolucion: "25-08-2025",
        funcionarioResponsable: "Director Regional",
        observaciones: "Comiso administrativo por contrabando de cigarrillos",
        fechaRegistro: "25-08-2025 12:00",
        usuarioRegistro: "sistema",
      },
      {
        id: "sm-004-3",
        mercanciaId: "m-004",
        tipoEvento: "Destrucción",
        fechaEvento: "20-10-2025",
        autoridad: "Comisión de Destrucción",
        nroResolucion: "RES-DES-2024-00089",
        fechaResolucion: "18-10-2025",
        funcionarioResponsable: "Comisión de Destrucción",
        observaciones: "Destrucción realizada mediante incineración certificada. Participaron representantes de Aduanas, ISP y Carabineros.",
        documentosAdjuntos: ["ACT-DES-2024-00089", "CERT-INC-2024-00045"],
        fechaRegistro: "20-10-2025 15:30",
        usuarioRegistro: "sistema",
      }
    ],
    fechaCreacion: "10-07-2025",
    usuarioCreacion: "lvargas",
    tieneAlertaDisposicion: false,
  },
  {
    id: "m-005",
    codigoMercancia: "MER-2024-00005",
    descripcion: "Maquinaria industrial - Torno CNC",
    descripcionDetallada: "Torno CNC marca Haas, modelo ST-10, con accesorios y software.",
    partida: "8458",
    subpartida: "845811",
    posicionArancelaria: "8458.11.00",
    cantidad: 1,
    unidadMedida: "Unidad",
    numeroBultos: 3,
    pesoBruto: 4500,
    pesoNeto: 4200,
    valorFOB: 85000,
    valorCIF: 92000,
    valorAduanero: 98000,
    moneda: "USD",
    paisOrigen: "Estados Unidos",
    estado: "Entregada",
    ubicacion: "N/A - Entregada al importador",
    contenedor: "CSQU3456789",
    codigoAduanaIngreso: "SCL",
    nombreAduanaIngreso: "Santiago",
    fechaIngreso: "01-06-2025",
    denunciaId: "d-012",
    denunciaNumero: "993512",
    disposicionFinal: "Devolución",
    fechaDisposicionFinal: "15-08-2025",
    resolucionDisposicion: "RES-DEV-2024-00078",
    seguimientos: [
      {
        id: "sm-005-1",
        mercanciaId: "m-005",
        tipoEvento: "Ingreso",
        fechaEvento: "01-06-2025",
        ubicacionNueva: "Bodega Fiscal Santiago - Sector C",
        funcionarioResponsable: "Carmen Díaz",
        observaciones: "Mercancía retenida por discrepancia en valor declarado",
        fechaRegistro: "01-06-2025 09:00",
        usuarioRegistro: "cdiaz",
      },
      {
        id: "sm-005-2",
        mercanciaId: "m-005",
        tipoEvento: "Retención",
        fechaEvento: "05-06-2025",
        autoridad: "Aduana de Santiago",
        nroResolucion: "RES-RET-2024-00345",
        fechaResolucion: "05-06-2025",
        funcionarioResponsable: "Jefe de Fiscalización",
        observaciones: "Retención para verificación de valor aduanero",
        fechaRegistro: "05-06-2025 11:30",
        usuarioRegistro: "jfisc",
      },
      {
        id: "sm-005-3",
        mercanciaId: "m-005",
        tipoEvento: "Devolución",
        fechaEvento: "15-08-2025",
        autoridad: "Director Regional",
        nroResolucion: "RES-DEV-2024-00078",
        fechaResolucion: "12-08-2025",
        funcionarioResponsable: "Director Regional",
        observaciones: "Devolución autorizada previo pago de diferencias de derechos y multa.",
        documentosAdjuntos: ["ACT-ENT-2024-00078", "PAG-DIF-2024-00078"],
        fechaRegistro: "15-08-2025 10:00",
        usuarioRegistro: "sistema",
      }
    ],
    fechaCreacion: "01-06-2025",
    usuarioCreacion: "cdiaz",
    tieneAlertaDisposicion: false,
  },
  {
    id: "m-006",
    codigoMercancia: "MER-2024-00006",
    descripcion: "Productos farmacéuticos sin registro ISP",
    descripcionDetallada: "Medicamentos diversos sin registro sanitario ni autorización de internación.",
    partida: "3004",
    subpartida: "300490",
    posicionArancelaria: "3004.90.00",
    cantidad: 10000,
    unidadMedida: "Unidades",
    numeroBultos: 50,
    pesoBruto: 500,
    pesoNeto: 400,
    valorFOB: 15000,
    valorCIF: 16500,
    moneda: "USD",
    paisOrigen: "India",
    estado: "Pendiente Disposición",
    ubicacion: "Bodega Fiscal Valparaíso - Sector Refrigerado",
    bodega: "BF-VLP-001",
    seccionBodega: "REF-02",
    contenedor: "TCLU8765432",
    codigoAduanaIngreso: "VLP",
    nombreAduanaIngreso: "Valparaíso",
    fechaIngreso: "25-10-2025",
    denunciaId: "d-015",
    denunciaNumero: "993525",
    expedienteDigitalId: "exp-m-006",
    seguimientos: [
      {
        id: "sm-006-1",
        mercanciaId: "m-006",
        tipoEvento: "Ingreso",
        fechaEvento: "25-10-2025",
        ubicacionNueva: "Bodega Fiscal Valparaíso - Sector Refrigerado",
        funcionarioResponsable: "Rosa Muñoz",
        observaciones: "Mercancía retenida por falta de registro ISP. Requiere cadena de frío.",
        fechaRegistro: "25-10-2025 14:00",
        usuarioRegistro: "rmunoz",
      },
      {
        id: "sm-006-2",
        mercanciaId: "m-006",
        tipoEvento: "Inventario",
        fechaEvento: "26-10-2025",
        funcionarioResponsable: "Químico Farmacéutico",
        observaciones: "Inventario detallado con apoyo de profesional farmacéutico. Se identificaron 15 tipos de medicamentos diferentes.",
        documentosAdjuntos: ["ACT-INV-2024-00567"],
        fechaRegistro: "26-10-2025 16:30",
        usuarioRegistro: "qfarm",
      },
      {
        id: "sm-006-3",
        mercanciaId: "m-006",
        tipoEvento: "Observación",
        fechaEvento: "01-11-2025",
        funcionarioResponsable: "Jefe de Bodega",
        observaciones: "Se solicita urgente resolución de destino. Algunos medicamentos tienen fecha de vencimiento próxima (enero 2026).",
        fechaRegistro: "01-11-2025 09:00",
        usuarioRegistro: "jbodega",
      }
    ],
    fechaCreacion: "25-10-2025",
    usuarioCreacion: "rmunoz",
    tieneAlertaDisposicion: true,
    alertaEventosContradictorios: false,
  },
  {
    id: "m-007",
    codigoMercancia: "MER-2024-00007",
    descripcion: "Bebidas alcohólicas - Whisky escocés",
    descripcionDetallada: "Whisky escocés marca Johnnie Walker y Chivas Regal, diversas presentaciones.",
    partida: "2208",
    subpartida: "220830",
    posicionArancelaria: "2208.30.00",
    cantidad: 2000,
    unidadMedida: "Botellas",
    numeroBultos: 100,
    pesoBruto: 2400,
    pesoNeto: 2000,
    valorFOB: 40000,
    valorCIF: 44000,
    moneda: "USD",
    paisOrigen: "Reino Unido",
    estado: "Subastada",
    ubicacion: "N/A - Subastada",
    codigoAduanaIngreso: "IQQ",
    nombreAduanaIngreso: "Iquique",
    fechaIngreso: "15-05-2025",
    denunciaId: "d-018",
    denunciaNumero: "993508",
    disposicionFinal: "Subasta",
    fechaDisposicionFinal: "10-09-2025",
    resolucionDisposicion: "RES-SUB-2024-00034",
    seguimientos: [
      {
        id: "sm-007-1",
        mercanciaId: "m-007",
        tipoEvento: "Ingreso",
        fechaEvento: "15-05-2025",
        ubicacionNueva: "Bodega Fiscal Iquique",
        funcionarioResponsable: "Eduardo Pizarro",
        observaciones: "Mercancía decomisada en operativo conjunto con Carabineros",
        fechaRegistro: "15-05-2025 23:30",
        usuarioRegistro: "epizarro",
      },
      {
        id: "sm-007-2",
        mercanciaId: "m-007",
        tipoEvento: "Comiso",
        fechaEvento: "20-06-2025",
        autoridad: "Director Regional Norte Grande",
        nroResolucion: "RES-COM-2024-00098",
        fechaResolucion: "20-06-2025",
        funcionarioResponsable: "Director Regional",
        observaciones: "Comiso administrativo por contrabando",
        fechaRegistro: "20-06-2025 10:00",
        usuarioRegistro: "sistema",
      },
      {
        id: "sm-007-3",
        mercanciaId: "m-007",
        tipoEvento: "Subasta",
        fechaEvento: "10-09-2025",
        autoridad: "Comisión de Subastas",
        nroResolucion: "RES-SUB-2024-00034",
        fechaResolucion: "05-09-2025",
        funcionarioResponsable: "Comisión de Subastas",
        observaciones: "Subasta pública realizada. Adjudicada a mejor postor por $28.500.000.-",
        documentosAdjuntos: ["ACT-SUB-2024-00034", "BOL-ADJ-2024-00034"],
        fechaRegistro: "10-09-2025 18:00",
        usuarioRegistro: "sistema",
      }
    ],
    fechaCreacion: "15-05-2025",
    usuarioCreacion: "epizarro",
    tieneAlertaDisposicion: false,
  },
  {
    id: "m-008",
    codigoMercancia: "MER-2024-00008",
    descripcion: "Artículos de librería y útiles escolares",
    descripcionDetallada: "Cuadernos, lápices, gomas de borrar y otros útiles escolares.",
    partida: "4820",
    subpartida: "482010",
    posicionArancelaria: "4820.10.00",
    cantidad: 25000,
    unidadMedida: "Unidades",
    numeroBultos: 200,
    pesoBruto: 3500,
    pesoNeto: 3000,
    valorFOB: 8000,
    valorCIF: 9200,
    moneda: "USD",
    paisOrigen: "China",
    estado: "Donada",
    ubicacion: "N/A - Donada",
    codigoAduanaIngreso: "PMC",
    nombreAduanaIngreso: "Puerto Montt",
    fechaIngreso: "01-03-2025",
    denunciaId: "d-020",
    denunciaNumero: "993500",
    disposicionFinal: "Donación",
    fechaDisposicionFinal: "15-06-2025",
    resolucionDisposicion: "RES-DON-2024-00012",
    seguimientos: [
      {
        id: "sm-008-1",
        mercanciaId: "m-008",
        tipoEvento: "Ingreso",
        fechaEvento: "01-03-2025",
        ubicacionNueva: "Bodega Fiscal Puerto Montt",
        funcionarioResponsable: "Marcela Vera",
        observaciones: "Mercancía abandonada por importador",
        fechaRegistro: "01-03-2025 08:00",
        usuarioRegistro: "mvera",
      },
      {
        id: "sm-008-2",
        mercanciaId: "m-008",
        tipoEvento: "Comiso",
        fechaEvento: "15-04-2025",
        autoridad: "Director Regional Sur",
        nroResolucion: "RES-COM-2024-00067",
        fechaResolucion: "15-04-2025",
        funcionarioResponsable: "Director Regional",
        observaciones: "Comiso por abandono según artículo 155 Ordenanza de Aduanas",
        fechaRegistro: "15-04-2025 11:00",
        usuarioRegistro: "sistema",
      },
      {
        id: "sm-008-3",
        mercanciaId: "m-008",
        tipoEvento: "Donación",
        fechaEvento: "15-06-2025",
        autoridad: "Director Nacional de Aduanas",
        nroResolucion: "RES-DON-2024-00012",
        fechaResolucion: "10-06-2025",
        funcionarioResponsable: "Coordinador Social",
        observaciones: "Donación a JUNAEB para distribución en colegios rurales de la Región de Los Lagos.",
        documentosAdjuntos: ["ACT-DON-2024-00012", "CERT-REC-JUNAEB-2024"],
        fechaRegistro: "15-06-2025 14:00",
        usuarioRegistro: "sistema",
      }
    ],
    fechaCreacion: "01-03-2025",
    usuarioCreacion: "mvera",
    tieneAlertaDisposicion: false,
  },
  {
    id: "m-009",
    codigoMercancia: "MER-2024-00009",
    descripcion: "Repuestos automotrices diversos",
    descripcionDetallada: "Filtros, pastillas de freno, correas y otros repuestos automotrices sin certificación.",
    partida: "8708",
    subpartida: "870899",
    posicionArancelaria: "8708.99.00",
    cantidad: 3000,
    unidadMedida: "Unidades",
    numeroBultos: 60,
    pesoBruto: 1800,
    pesoNeto: 1500,
    valorFOB: 12000,
    valorCIF: 13500,
    moneda: "USD",
    paisOrigen: "Taiwan",
    estado: "En Custodia",
    ubicacion: "Bodega Fiscal Santiago - Sector D",
    bodega: "BF-SCL-002",
    seccionBodega: "D-22",
    codigoAduanaIngreso: "SCL",
    nombreAduanaIngreso: "Santiago",
    fechaIngreso: "10-11-2025",
    denunciaId: "d-025",
    denunciaNumero: "993530",
    expedienteDigitalId: "exp-m-009",
    seguimientos: [
      {
        id: "sm-009-1",
        mercanciaId: "m-009",
        tipoEvento: "Ingreso",
        fechaEvento: "10-11-2025",
        ubicacionNueva: "Bodega Fiscal Santiago - Sector D",
        funcionarioResponsable: "Pablo Rojas",
        observaciones: "Mercancía retenida por falta de certificaciones de seguridad",
        fechaRegistro: "10-11-2025 15:00",
        usuarioRegistro: "projas",
      },
      {
        id: "sm-009-2",
        mercanciaId: "m-009",
        tipoEvento: "Inventario",
        fechaEvento: "12-11-2025",
        funcionarioResponsable: "Técnico automotriz",
        observaciones: "Se realizó inventario técnico. Se identificaron 45 tipos diferentes de repuestos.",
        documentosAdjuntos: ["ACT-INV-2024-00678"],
        fechaRegistro: "12-11-2025 17:30",
        usuarioRegistro: "tecauto",
      }
    ],
    fechaCreacion: "10-11-2025",
    usuarioCreacion: "projas",
    tieneAlertaDisposicion: false,
  },
  {
    id: "m-010",
    codigoMercancia: "MER-2024-00010",
    descripcion: "Joyas y relojes de lujo",
    descripcionDetallada: "Relojes Rolex, Omega y joyas de oro no declaradas en equipaje.",
    partida: "7113",
    subpartida: "711319",
    posicionArancelaria: "7113.19.00",
    cantidad: 25,
    unidadMedida: "Unidades",
    numeroBultos: 1,
    pesoBruto: 2,
    pesoNeto: 1.5,
    valorFOB: 150000,
    valorCIF: 155000,
    valorAduanero: 165000,
    moneda: "USD",
    paisOrigen: "Suiza",
    estado: "Entregada por RAP",
    ubicacion: "N/A - Entregada por RAP",
    codigoAduanaIngreso: "SCL",
    nombreAduanaIngreso: "Santiago - Aeropuerto",
    fechaIngreso: "05-09-2025",
    denunciaId: "d-030",
    denunciaNumero: "993535",
    disposicionFinal: "Entrega RAP",
    fechaDisposicionFinal: "20-11-2025",
    resolucionDisposicion: "RES-RAP-2024-00045",
    seguimientos: [
      {
        id: "sm-010-1",
        mercanciaId: "m-010",
        tipoEvento: "Ingreso",
        fechaEvento: "05-09-2025",
        ubicacionNueva: "Caja Fuerte Aeropuerto SCL",
        funcionarioResponsable: "Inspector de Equipajes",
        observaciones: "Mercancía detectada en control de equipaje. Pasajero no declaró artículos de valor.",
        fechaRegistro: "05-09-2025 08:45",
        usuarioRegistro: "ieqpj",
      },
      {
        id: "sm-010-2",
        mercanciaId: "m-010",
        tipoEvento: "Retención",
        fechaEvento: "05-09-2025",
        autoridad: "Aduana Aeropuerto SCL",
        nroResolucion: "RES-RET-2024-00890",
        fechaResolucion: "05-09-2025",
        funcionarioResponsable: "Jefe de Turno",
        observaciones: "Retención por omisión de declaración de equipaje",
        fechaRegistro: "05-09-2025 10:00",
        usuarioRegistro: "jturno",
      },
      {
        id: "sm-010-3",
        mercanciaId: "m-010",
        tipoEvento: "Entrega RAP",
        fechaEvento: "20-11-2025",
        autoridad: "Director Regional Metropolitano",
        nroResolucion: "RES-RAP-2024-00045",
        fechaResolucion: "18-11-2025",
        funcionarioResponsable: "Encargado RAP",
        observaciones: "Entrega bajo Régimen de Admisión Personal previo pago de derechos, impuestos y multa.",
        documentosAdjuntos: ["ACT-ENT-2024-00890", "BOL-PAG-2024-00890"],
        fechaRegistro: "20-11-2025 11:30",
        usuarioRegistro: "erapd",
      }
    ],
    fechaCreacion: "05-09-2025",
    usuarioCreacion: "ieqpj",
    tieneAlertaDisposicion: false,
  },
];

// ============================================
// FUNCIONES HELPER PARA MERCANCÍAS
// ============================================

export const getMercanciaPorId = (id: string) => 
  mercancias.find(m => m.id === id);

export const getMercanciaPorCodigo = (codigo: string) => 
  mercancias.find(m => m.codigoMercancia === codigo);

export const getMercanciasPorEstado = (estado: EstadoMercancia) =>
  mercancias.filter(m => m.estado === estado);

export const getMercanciasPorAduana = (codigoAduana: string) =>
  mercancias.filter(m => m.codigoAduanaIngreso === codigoAduana);

export const getMercanciasPorDenuncia = (denunciaId: string) =>
  mercancias.filter(m => m.denunciaId === denunciaId || m.denunciaNumero === denunciaId);

export const getMercanciasPorCargo = (cargoId: string) =>
  mercancias.filter(m => m.cargoId === cargoId || m.cargoNumero === cargoId);

export const getMercanciasConAlerta = () =>
  mercancias.filter(m => m.tieneAlertaDisposicion || m.alertaEventosContradictorios);

export const getMercanciasPendientesDisposicion = () =>
  mercancias.filter(m => m.estado === 'Pendiente Disposición' || m.estado === 'En Custodia');

export const getPermisosMercancia = (mercancia: Mercancia): PermisosMercancia => {
  const permisos: PermisosMercancia = {
    puedeRegistrarEvento: true,
    puedeDevolver: false,
    puedeComiso: false,
    puedeDestruir: false,
    puedeSubastar: false,
    puedeDonar: false,
    eventosDisponibles: ['Observación', 'Traslado'],
  };
  
  // Estados finales no permiten más eventos
  const estadosFinales: EstadoMercancia[] = ['Entregada', 'Destruida', 'Subastada', 'Donada', 'Entregada por RAP'];
  if (estadosFinales.includes(mercancia.estado)) {
    permisos.puedeRegistrarEvento = false;
    permisos.eventosDisponibles = [];
    return permisos;
  }
  
  // Verificar si ya existe comiso
  const tieneComiso = mercancia.seguimientos?.some(s => s.tipoEvento === 'Comiso');
  
  switch (mercancia.estado) {
    case 'En Custodia':
    case 'Retenida':
      permisos.puedeDevolver = !tieneComiso;
      permisos.puedeComiso = !tieneComiso;
      permisos.eventosDisponibles = ['Inventario', 'Retención', 'Traslado', 'Observación'];
      if (!tieneComiso) {
        permisos.eventosDisponibles.push('Devolución', 'Comiso');
      }
      break;
      
    case 'Comisada':
      permisos.puedeDestruir = true;
      permisos.puedeSubastar = true;
      permisos.puedeDonar = true;
      permisos.eventosDisponibles = ['Destrucción', 'Subasta', 'Donación', 'Traslado', 'Observación'];
      break;
      
    case 'Incautada Judicialmente':
      // Solo se pueden hacer traslados y observaciones hasta que el tribunal resuelva
      permisos.eventosDisponibles = ['Traslado', 'Observación', 'Resolución Judicial'];
      break;
      
    case 'Pendiente Disposición':
      permisos.puedeComiso = true;
      permisos.puedeDevolver = true;
      permisos.eventosDisponibles = ['Comiso', 'Devolución', 'Traslado', 'Observación'];
      break;
  }
  
  return permisos;
};

export const puedeRegistrarEvento = (
  mercancia: Mercancia, 
  tipoEvento: TipoEventoMercancia
): { valido: boolean; errores: string[] } => {
  const errores: string[] = [];
  const permisos = getPermisosMercancia(mercancia);
  
  if (!permisos.puedeRegistrarEvento) {
    errores.push('La mercancía ya tiene disposición final y no permite más eventos.');
    return { valido: false, errores };
  }
  
  if (!permisos.eventosDisponibles.includes(tipoEvento)) {
    errores.push(`El evento "${tipoEvento}" no está disponible para el estado actual "${mercancia.estado}".`);
  }
  
  // Validar Devolución si existe comiso
  if (tipoEvento === 'Devolución') {
    const tieneComiso = mercancia.seguimientos?.some(s => s.tipoEvento === 'Comiso');
    if (tieneComiso) {
      errores.push('No se puede registrar devolución porque existe un comiso previo.');
    }
  }
  
  // Validar Destrucción
  if (tipoEvento === 'Destrucción') {
    if (mercancia.estado === 'Incautada Judicialmente') {
      errores.push('No se puede destruir mercancía incautada judicialmente sin orden del tribunal.');
    }
  }
  
  return { valido: errores.length === 0, errores };
};

export const getConteoMercancias = () => {
  const valorTotal = mercancias.reduce((sum, m) => sum + (m.valorCIF || 0), 0);
  
  return {
    total: mercancias.length,
    porEstado: {
      enCustodia: mercancias.filter(m => m.estado === 'En Custodia').length,
      comisada: mercancias.filter(m => m.estado === 'Comisada').length,
      entregada: mercancias.filter(m => m.estado === 'Entregada').length,
      subastada: mercancias.filter(m => m.estado === 'Subastada').length,
      destruida: mercancias.filter(m => m.estado === 'Destruida').length,
      donada: mercancias.filter(m => m.estado === 'Donada').length,
      incautadaJudicialmente: mercancias.filter(m => m.estado === 'Incautada Judicialmente').length,
      pendienteDisposicion: mercancias.filter(m => m.estado === 'Pendiente Disposición').length,
    },
    conAlerta: getMercanciasConAlerta().length,
    pendientesDisposicion: getMercanciasPendientesDisposicion().length,
    valorTotal,
    valorTotalFormateado: '$' + valorTotal.toLocaleString('es-CL'),
  };
};

let mercanciaIdCounter = 11;
let seguimientoIdCounter = 100;

export const registrarEventoMercancia = (
  mercanciaId: string,
  evento: Omit<SeguimientoMercancia, 'id' | 'mercanciaId' | 'fechaRegistro' | 'usuarioRegistro'>
): { exito: boolean; mercancia?: Mercancia; error?: string } => {
  const index = mercancias.findIndex(m => m.id === mercanciaId);
  if (index === -1) return { exito: false, error: 'Mercancía no encontrada' };
  
  const mercancia = mercancias[index];
  const validacion = puedeRegistrarEvento(mercancia, evento.tipoEvento);
  if (!validacion.valido) {
    return { exito: false, error: validacion.errores.join(' ') };
  }
  
  seguimientoIdCounter++;
  const nuevoSeguimiento: SeguimientoMercancia = {
    id: `sm-${mercanciaId}-${seguimientoIdCounter}`,
    mercanciaId,
    ...evento,
    fechaRegistro: new Date().toLocaleString('es-CL'),
    usuarioRegistro: 'usuario_actual',
  };
  
  // Actualizar estado según el tipo de evento
  let nuevoEstado: EstadoMercancia = mercancia.estado;
  let disposicionFinal: TipoEventoMercancia | undefined = mercancia.disposicionFinal;
  let fechaDisposicionFinal: string | undefined = mercancia.fechaDisposicionFinal;
  let resolucionDisposicion: string | undefined = mercancia.resolucionDisposicion;
  
  switch (evento.tipoEvento) {
    case 'Comiso':
      nuevoEstado = 'Comisada';
      break;
    case 'Devolución':
      nuevoEstado = 'Entregada';
      disposicionFinal = 'Devolución';
      fechaDisposicionFinal = evento.fechaEvento;
      resolucionDisposicion = evento.nroResolucion;
      break;
    case 'Destrucción':
      nuevoEstado = 'Destruida';
      disposicionFinal = 'Destrucción';
      fechaDisposicionFinal = evento.fechaEvento;
      resolucionDisposicion = evento.nroResolucion;
      break;
    case 'Subasta':
      nuevoEstado = 'Subastada';
      disposicionFinal = 'Subasta';
      fechaDisposicionFinal = evento.fechaEvento;
      resolucionDisposicion = evento.nroResolucion;
      break;
    case 'Donación':
      nuevoEstado = 'Donada';
      disposicionFinal = 'Donación';
      fechaDisposicionFinal = evento.fechaEvento;
      resolucionDisposicion = evento.nroResolucion;
      break;
    case 'Entrega RAP':
      nuevoEstado = 'Entregada por RAP';
      disposicionFinal = 'Entrega RAP';
      fechaDisposicionFinal = evento.fechaEvento;
      resolucionDisposicion = evento.nroResolucion;
      break;
    case 'Incautación':
    case 'Resolución Judicial':
      if (evento.tipoEvento === 'Incautación' || evento.autoridad?.toLowerCase().includes('tribunal')) {
        nuevoEstado = 'Incautada Judicialmente';
      }
      break;
    case 'Retención':
      nuevoEstado = 'Retenida';
      break;
  }
  
  // Actualizar ubicación si se proporciona
  const ubicacion = evento.ubicacionNueva || mercancia.ubicacion;
  
  mercancias[index] = {
    ...mercancia,
    estado: nuevoEstado,
    ubicacion,
    disposicionFinal,
    fechaDisposicionFinal,
    resolucionDisposicion,
    seguimientos: [...(mercancia.seguimientos || []), nuevoSeguimiento],
    fechaModificacion: new Date().toISOString(),
    usuarioModificacion: 'usuario_actual',
    tieneAlertaDisposicion: false,
  };
  
  return { exito: true, mercancia: mercancias[index] };
};

export const crearMercancia = (data: Partial<Mercancia>): Mercancia => {
  mercanciaIdCounter++;
  
  const nuevaMercancia: Mercancia = {
    id: `m-${String(mercanciaIdCounter).padStart(3, '0')}`,
    codigoMercancia: `MER-2024-${String(mercanciaIdCounter).padStart(5, '0')}`,
    descripcion: data.descripcion || '',
    partida: data.partida || '',
    cantidad: data.cantidad || 0,
    unidadMedida: data.unidadMedida || 'Unidades',
    estado: 'En Custodia',
    fechaIngreso: new Date().toLocaleDateString('es-CL'),
    fechaCreacion: new Date().toISOString(),
    usuarioCreacion: 'usuario_actual',
    seguimientos: [],
    ...data,
  };
  
  mercancias.push(nuevaMercancia);
  return nuevaMercancia;
};

