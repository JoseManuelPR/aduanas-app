/**
 * Base de datos mock - Catálogos
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import type { Aduana, Usuario } from './types';

// ============================================
// ADUANAS
// ============================================

export const aduanas: Aduana[] = [
  { id: "aduana-001", codigo: "VLP", nombre: "Valparaíso", region: "Valparaíso" },
  { id: "aduana-002", codigo: "SCL", nombre: "Santiago", region: "Metropolitana" },
  { id: "aduana-003", codigo: "ANT", nombre: "Antofagasta", region: "Antofagasta" },
  { id: "aduana-004", codigo: "IQQ", nombre: "Iquique", region: "Tarapacá" },
  { id: "aduana-005", codigo: "LAN", nombre: "Los Andes", region: "Valparaíso" },
  { id: "aduana-006", codigo: "ARI", nombre: "Arica", region: "Arica y Parinacota" },
  { id: "aduana-007", codigo: "CCP", nombre: "Concepción", region: "Biobío" },
  { id: "aduana-008", codigo: "PMC", nombre: "Puerto Montt", region: "Los Lagos" },
  { id: "aduana-009", codigo: "PUQ", nombre: "Punta Arenas", region: "Magallanes" },
  { id: "aduana-010", codigo: "TAL", nombre: "Talcahuano", region: "Biobío" },
];

// ============================================
// USUARIOS
// ============================================

export const usuarios: Usuario[] = [
  {
    id: "usr-001",
    rut: "12.345.678-9",
    nombre: "Juan Rodríguez",
    email: "jrodriguez@aduana.cl",
    rol: "Funcionario Fiscalizador",
    aduana: "Valparaíso",
    activo: true,
  },
  {
    id: "usr-002",
    rut: "11.222.333-4",
    nombre: "María González",
    email: "mgonzalez@aduana.cl",
    rol: "Funcionario Fiscalizador",
    aduana: "Santiago",
    activo: true,
  },
  {
    id: "usr-003",
    rut: "10.111.222-3",
    nombre: "Carlos Pérez",
    email: "cperez@aduana.cl",
    rol: "Jefe de Sección",
    aduana: "Antofagasta",
    activo: true,
  },
  {
    id: "usr-004",
    rut: "9.888.777-6",
    nombre: "Ana Martínez",
    email: "amartinez@aduana.cl",
    rol: "Funcionario Fiscalizador",
    aduana: "Iquique",
    activo: true,
  },
  {
    id: "usr-005",
    rut: "8.777.666-5",
    nombre: "Pedro López",
    email: "plopez@aduana.cl",
    rol: "Jefe de Sección",
    aduana: "Los Andes",
    activo: true,
  },
  {
    id: "usr-006",
    rut: "15.666.555-4",
    nombre: "Laura Sánchez",
    email: "lsanchez@aduana.cl",
    rol: "Administrador",
    aduana: "Santiago",
    activo: true,
  },
  {
    id: "usr-007",
    rut: "14.555.444-3",
    nombre: "Roberto Díaz",
    email: "rdiaz@aduana.cl",
    rol: "Auditor",
    aduana: "Valparaíso",
    activo: true,
  },
];

// ============================================
// TIPOS DE INFRACCIÓN
// ============================================

export const tiposInfraccion = [
  { id: "ti-001", codigo: "CONT", nombre: "Contrabando" },
  { id: "ti-002", codigo: "FRAD", nombre: "Fraude Aduanero" },
  { id: "ti-003", codigo: "DECF", nombre: "Declaración Falsa" },
  { id: "ti-004", codigo: "SUBF", nombre: "Subfacturación" },
  { id: "ti-005", codigo: "CLAS", nombre: "Clasificación Incorrecta" },
  { id: "ti-006", codigo: "ORIG", nombre: "Falsificación de Origen" },
  { id: "ti-007", codigo: "OTRO", nombre: "Otros" },
];

// ============================================
// FUNCIONES HELPER
// ============================================

export const getAduanaPorCodigo = (codigo: string) =>
  aduanas.find(a => a.codigo === codigo);

export const getAduanaPorNombre = (nombre: string) =>
  aduanas.find(a => a.nombre === nombre);

export const getUsuarioPorRut = (rut: string) =>
  usuarios.find(u => u.rut === rut);

export const getUsuariosPorAduana = (aduana: string) =>
  usuarios.filter(u => u.aduana === aduana);

export const getUsuariosPorRol = (rol: Usuario['rol']) =>
  usuarios.filter(u => u.rol === rol);

export const getNombresAduanas = () =>
  aduanas.map(a => a.nombre);

export const getNombresTiposInfraccion = () =>
  tiposInfraccion.map(t => t.nombre);

