// ============================================
// DATOS: Seguimiento de Mercancía
// ============================================

import type { MovimientoMercancia, TimelineItem } from './types';

// Lista de movimientos activos
export const movimientosActivos: MovimientoMercancia[] = [
  {
    id: '1',
    contenedor: 'MSKU1234567',
    manifiesto: 'MAN-2024-001234',
    origen: 'Shanghai, China',
    destino: 'Valparaíso',
    estado: 'En Tránsito',
    fechaEstimada: '25-11-2025',
    ubicacionActual: 'Puerto de Manzanillo',
    porcentaje: 65,
  },
  {
    id: '2',
    contenedor: 'TCNU8765432',
    manifiesto: 'MAN-2024-001235',
    origen: 'Rotterdam, Países Bajos',
    destino: 'San Antonio',
    estado: 'En Puerto',
    fechaEstimada: '22-11-2025',
    ubicacionActual: 'Terminal TPS',
    porcentaje: 95,
  },
  {
    id: '3',
    contenedor: 'OOLU5432109',
    manifiesto: 'MAN-2024-001236',
    origen: 'Los Andes',
    destino: 'Santiago',
    estado: 'Despacho Terrestre',
    fechaEstimada: '21-11-2025',
    ubicacionActual: 'Ruta 57',
    porcentaje: 80,
  },
  {
    id: '4',
    contenedor: 'CMAU9876543',
    manifiesto: 'MAN-2024-001237',
    origen: 'Busan, Corea del Sur',
    destino: 'Iquique',
    estado: 'En Tránsito',
    fechaEstimada: '28-11-2025',
    ubicacionActual: 'Océano Pacífico',
    porcentaje: 45,
  },
  {
    id: '5',
    contenedor: 'HLXU1234890',
    manifiesto: 'MAN-2024-001238',
    origen: 'Buenos Aires, Argentina',
    destino: 'Valparaíso',
    estado: 'En Puerto',
    fechaEstimada: '20-11-2025',
    ubicacionActual: 'Terminal Pacífico Sur',
    porcentaje: 100,
  },
];

// Timeline de ejemplo para un movimiento
export const timelineMovimientoEjemplo: TimelineItem[] = [
  { 
    id: '1', 
    title: 'Embarque en Origen', 
    date: '01-11-2025', 
    status: 'completed', 
    description: 'Carga embarcada en Shanghai' 
  },
  { 
    id: '2', 
    title: 'En Tránsito Marítimo', 
    date: '05-11-2025', 
    status: 'completed', 
    description: 'Navegando por Océano Pacífico' 
  },
  { 
    id: '3', 
    title: 'Escala en Manzanillo', 
    date: '18-11-2025', 
    status: 'current', 
    description: 'Transbordo programado' 
  },
  { 
    id: '4', 
    title: 'Arribo a Valparaíso', 
    date: '25-11-2025', 
    status: 'pending', 
    description: 'Fecha estimada de arribo' 
  },
  { 
    id: '5', 
    title: 'Desaduanamiento', 
    date: '-', 
    status: 'pending', 
    description: 'Pendiente de documentación' 
  },
];

// Alertas de trazabilidad
export const alertasTrazabilidad = [
  {
    id: '1',
    tipo: 'critico',
    contenedor: 'TCNU9876543',
    titulo: 'Sin actualización hace 48 horas',
    descripcion: 'Última ubicación: Puerto de Callao',
  },
  {
    id: '2',
    tipo: 'advertencia',
    contenedor: 'OOLU1234567',
    titulo: 'Retraso en ETA',
    descripcion: 'Nueva fecha estimada: 28-11-2025',
  },
  {
    id: '3',
    tipo: 'informativo',
    contenedor: 'MSCU7654321',
    titulo: 'Cambio de terminal',
    descripcion: 'Redirigido a Terminal Pacífico Norte',
  },
];

// Estadísticas de seguimiento
export const estadisticasSeguimiento = {
  enTransito: 45,
  enPuerto: 23,
  transporteTerrestre: 12,
  conAlerta: 5,
};

// ============================================
// FUNCIONES HELPER
// ============================================

export const getMovimientoPorId = (id: string): MovimientoMercancia | undefined => {
  return movimientosActivos.find(m => m.id === id);
};

export const getMovimientoPorContenedor = (contenedor: string): MovimientoMercancia | undefined => {
  return movimientosActivos.find(m => m.contenedor === contenedor);
};

export const getMovimientosPorEstado = (estado: string): MovimientoMercancia[] => {
  return movimientosActivos.filter(m => m.estado === estado);
};

export const getMovimientosConAlerta = (): MovimientoMercancia[] => {
  return movimientosActivos.filter(m => m.porcentaje < 50 || m.estado === 'Con Alerta');
};

