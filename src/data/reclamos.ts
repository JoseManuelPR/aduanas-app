/**
 * Base de datos mock - Reclamos
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import type { Reclamo } from './types';

export const reclamos: Reclamo[] = [
  {
    id: "r-001",
    numeroReclamo: "REC-117-2024-0089",
    tipoReclamo: "Art. 117",
    fechaIngreso: "18-11-2025",
    estado: "En Análisis",
    denunciaAsociada: "993519",
    reclamante: "Importadora Global S.A.",
    rutReclamante: "76.123.456-7",
    diasRespuesta: 12,
    descripcion: "Reclamo por determinación de derechos",
  },
  {
    id: "r-002",
    numeroReclamo: "REC-REP-2024-0045",
    tipoReclamo: "Reposición",
    fechaIngreso: "10-11-2025",
    estado: "Pendiente Resolución",
    denunciaAsociada: "993520",
    reclamante: "Comercial Los Andes Ltda.",
    rutReclamante: "77.987.654-3",
    diasRespuesta: 5,
    descripcion: "Recurso de reposición contra resolución",
  },
  {
    id: "r-003",
    numeroReclamo: "REC-TTA-2024-0012",
    tipoReclamo: "TTA",
    fechaIngreso: "28-10-2025",
    estado: "Derivado a Tribunal",
    denunciaAsociada: "993500",
    reclamante: "Minera del Norte SpA",
    rutReclamante: "80.456.123-5",
    diasRespuesta: 0,
    descripcion: "Reclamo ante Tribunal Tributario y Aduanero",
  },
  {
    id: "r-004",
    numeroReclamo: "REC-117-2024-0090",
    tipoReclamo: "Art. 117",
    fechaIngreso: "15-11-2025",
    estado: "En Análisis",
    denunciaAsociada: "993522",
    reclamante: "Zona Franca del Pacífico",
    rutReclamante: "81.321.654-9",
    diasRespuesta: 8,
    descripcion: "Reclamo por clasificación arancelaria",
  },
  {
    id: "r-005",
    numeroReclamo: "REC-REP-2024-0046",
    tipoReclamo: "Reposición",
    fechaIngreso: "05-11-2025",
    estado: "Resuelto",
    denunciaAsociada: "993523",
    reclamante: "Transportes Cordillera Ltda.",
    rutReclamante: "79.147.258-6",
    diasRespuesta: 15,
    descripcion: "Recurso contra multa administrativa",
  },
  {
    id: "r-006",
    numeroReclamo: "REC-TTA-2024-0013",
    tipoReclamo: "TTA",
    fechaIngreso: "20-11-2025",
    estado: "Ingresado",
    denunciaAsociada: "993524",
    reclamante: "Distribuidora Nacional S.A.",
    rutReclamante: "76.852.963-1",
    diasRespuesta: 20,
    descripcion: "Impugnación de liquidación",
  },
  {
    id: "r-007",
    numeroReclamo: "REC-117-2024-0091",
    tipoReclamo: "Art. 117",
    fechaIngreso: "22-11-2025",
    estado: "Ingresado",
    denunciaAsociada: "993525",
    reclamante: "Importaciones del Sur Ltda.",
    rutReclamante: "78.456.789-0",
    diasRespuesta: 18,
    descripcion: "Reclamo por valor aduanero",
  },
];

// ============================================
// FUNCIONES HELPER PARA RECLAMOS
// ============================================

export const getReclamoPorNumero = (numero: string) => 
  reclamos.find(r => r.numeroReclamo === numero);

export const getReclamosPorEstado = (estado: Reclamo['estado']) =>
  reclamos.filter(r => r.estado === estado);

export const getReclamosPorTipo = (tipo: Reclamo['tipoReclamo']) =>
  reclamos.filter(r => r.tipoReclamo === tipo);

export const getReclamosPorDenuncia = (denunciaNumero: string) =>
  reclamos.filter(r => r.denunciaAsociada === denunciaNumero);

export const getConteoReclamos = () => ({
  total: reclamos.length,
  porEstado: {
    ingresado: reclamos.filter(r => r.estado === 'Ingresado').length,
    enAnalisis: reclamos.filter(r => r.estado === 'En Análisis').length,
    pendienteResolucion: reclamos.filter(r => r.estado === 'Pendiente Resolución').length,
    derivadoTribunal: reclamos.filter(r => r.estado === 'Derivado a Tribunal').length,
    resuelto: reclamos.filter(r => r.estado === 'Resuelto').length,
  },
  porTipo: {
    art117: reclamos.filter(r => r.tipoReclamo === 'Art. 117').length,
    reposicion: reclamos.filter(r => r.tipoReclamo === 'Reposición').length,
    tta: reclamos.filter(r => r.tipoReclamo === 'TTA').length,
  },
  enAnalisis: reclamos.filter(r => r.estado === 'En Análisis').length,
  resueltos: reclamos.filter(r => r.estado === 'Resuelto').length,
  derivadosTTA: reclamos.filter(r => r.estado === 'Derivado a Tribunal').length,
  tiempoPromedioRespuesta: Math.round(
    reclamos.reduce((sum, r) => sum + r.diasRespuesta, 0) / reclamos.length
  ),
});

