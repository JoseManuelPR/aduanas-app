/**
 * Datos mock para Documentos Aduaneros
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import { DocumentoAduanero } from './types';

// XML de ejemplo simplificado para una DIN
const xmlEjemploDIN = `<?xml version="1.0" encoding="UTF-8"?>
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
  </Importador>
  <AgenteAduana>
    <Codigo>A-123</Codigo>
    <RazonSocial>Agencia de Aduanas Pacífico Ltda.</RazonSocial>
  </AgenteAduana>
  <Valores>
    <ValorFOB>50000</ValorFOB>
    <ValorCIF>52500</ValorCIF>
    <Moneda>USD</Moneda>
  </Valores>
  <Mercancia>
    <Descripcion>Electrónica de consumo - Smartphones</Descripcion>
    <PesoNeto>500</PesoNeto>
    <PesoBruto>600</PesoBruto>
    <NumeroBultos>50</NumeroBultos>
  </Mercancia>
</DeclaracionIngreso>`;

const xmlEjemploDUS = `<?xml version="1.0" encoding="UTF-8"?>
<DeclaracionSalida>
  <NumeroAceptacion>6020240045678</NumeroAceptacion>
  <FechaAceptacion>2024-10-15</FechaAceptacion>
  <Aduana>
    <Codigo>60</Codigo>
    <Nombre>Valparaíso</Nombre>
  </Aduana>
  <Exportador>
    <RUT>87.654.321-0</RUT>
    <RazonSocial>Exportadora Chile S.A.</RazonSocial>
  </Exportador>
  <Valores>
    <ValorFOB>120000</ValorFOB>
    <Moneda>USD</Moneda>
  </Valores>
  <Mercancia>
    <Descripcion>Frutas frescas - Cerezas</Descripcion>
    <PesoNeto>15000</PesoNeto>
    <PesoBruto>16500</PesoBruto>
  </Mercancia>
</DeclaracionSalida>`;

export const documentosAduaneros: DocumentoAduanero[] = [
  {
    id: 'doc-adu-001',
    tipoDocumento: 'DIN',
    numeroDocumento: 'DIN-6020-24-0012345',
    numeroAceptacion: '6020240012345',
    fechaEmision: '2024-11-01',
    fechaAceptacion: '2024-11-01',
    aduana: 'Valparaíso',
    codigoAduana: '60',
    estado: 'Vigente',
    descripcion: 'Declaración de Ingreso - Importación de electrónica',
    importador: 'Importadora Global SpA',
    rutImportador: '96.123.456-7',
    agenteAduana: 'Agencia de Aduanas Pacífico Ltda.',
    codigoAgente: 'A-123',
    valorFOB: 50000,
    valorCIF: 52500,
    moneda: 'USD',
    descripcionMercancia: 'Electrónica de consumo - Smartphones',
    pesoNeto: 500,
    pesoBruto: 600,
    numeroBultos: 50,
    archivoXML: '/docs/DIN-6020-24-0012345.xml',
    archivoXMLContent: xmlEjemploDIN,
    archivoHTML: '/docs/DIN-6020-24-0012345.html',
    archivoPDF: '/docs/DIN-6020-24-0012345.pdf',
    denunciaId: 'den-001',
    fechaCreacion: '2024-11-01',
    usuarioCreacion: 'sistema',
  },
  {
    id: 'doc-adu-002',
    tipoDocumento: 'DUS',
    numeroDocumento: 'DUS-6020-24-0045678',
    numeroAceptacion: '6020240045678',
    fechaEmision: '2024-10-15',
    fechaAceptacion: '2024-10-15',
    aduana: 'Valparaíso',
    codigoAduana: '60',
    estado: 'Vigente',
    descripcion: 'Declaración Única de Salida - Exportación de frutas',
    exportador: 'Exportadora Chile S.A.',
    rutExportador: '87.654.321-0',
    agenteAduana: 'Agencia de Aduanas Pacífico Ltda.',
    codigoAgente: 'A-123',
    valorFOB: 120000,
    moneda: 'USD',
    descripcionMercancia: 'Frutas frescas - Cerezas',
    pesoNeto: 15000,
    pesoBruto: 16500,
    numeroBultos: 200,
    archivoXML: '/docs/DUS-6020-24-0045678.xml',
    archivoXMLContent: xmlEjemploDUS,
    archivoHTML: '/docs/DUS-6020-24-0045678.html',
    archivoPDF: '/docs/DUS-6020-24-0045678.pdf',
    fechaCreacion: '2024-10-15',
    usuarioCreacion: 'sistema',
  },
  {
    id: 'doc-adu-003',
    tipoDocumento: 'DIN',
    numeroDocumento: 'DIN-6020-24-0023456',
    numeroAceptacion: '6020240023456',
    fechaEmision: '2024-11-10',
    fechaAceptacion: '2024-11-10',
    aduana: 'San Antonio',
    codigoAduana: '61',
    estado: 'Vigente',
    descripcion: 'Declaración de Ingreso - Importación de maquinaria',
    importador: 'Industrias del Norte S.A.',
    rutImportador: '76.987.654-3',
    agenteAduana: 'Agencia Marítima del Sur',
    codigoAgente: 'A-456',
    valorFOB: 250000,
    valorCIF: 275000,
    moneda: 'USD',
    descripcionMercancia: 'Maquinaria industrial - Equipos de fabricación',
    pesoNeto: 8500,
    pesoBruto: 9200,
    numeroBultos: 15,
    archivoXML: '/docs/DIN-6020-24-0023456.xml',
    archivoXMLContent: xmlEjemploDIN,
    archivoHTML: '/docs/DIN-6020-24-0023456.html',
    archivoPDF: '/docs/DIN-6020-24-0023456.pdf',
    cargoId: 'cargo-001',
    fechaCreacion: '2024-11-10',
    usuarioCreacion: 'sistema',
  },
  {
    id: 'doc-adu-004',
    tipoDocumento: 'BL',
    numeroDocumento: 'BL-MAEU-2024-11-001',
    fechaEmision: '2024-11-01',
    aduana: 'Valparaíso',
    codigoAduana: '60',
    estado: 'Vigente',
    descripcion: 'Bill of Lading - Conocimiento de Embarque',
    importador: 'Importadora Global SpA',
    rutImportador: '96.123.456-7',
    descripcionMercancia: 'Electrónica de consumo - Contenedor 40 pies',
    pesoNeto: 500,
    pesoBruto: 600,
    numeroBultos: 50,
    archivoPDF: '/docs/BL-MAEU-2024-11-001.pdf',
    denunciaId: 'den-001',
    fechaCreacion: '2024-11-01',
    usuarioCreacion: 'sistema',
  },
  {
    id: 'doc-adu-005',
    tipoDocumento: 'CI',
    numeroDocumento: 'CI-2024-10-5678',
    fechaEmision: '2024-10-25',
    aduana: 'Valparaíso',
    codigoAduana: '60',
    estado: 'Vigente',
    descripcion: 'Commercial Invoice - Factura Comercial',
    importador: 'Importadora Global SpA',
    rutImportador: '96.123.456-7',
    valorFOB: 50000,
    valorCIF: 52500,
    moneda: 'USD',
    descripcionMercancia: 'Electrónica de consumo - Smartphones',
    archivoPDF: '/docs/CI-2024-10-5678.pdf',
    denunciaId: 'den-001',
    fechaCreacion: '2024-10-25',
    usuarioCreacion: 'sistema',
  },
  {
    id: 'doc-adu-006',
    tipoDocumento: 'DIN',
    numeroDocumento: 'DIN-6020-24-0034567',
    numeroAceptacion: '6020240034567',
    fechaEmision: '2024-11-15',
    fechaAceptacion: '2024-11-15',
    aduana: 'Santiago',
    codigoAduana: '01',
    estado: 'Rectificado',
    descripcion: 'Declaración de Ingreso - Importación de textiles (Rectificada)',
    importador: 'Textiles Chile Ltda.',
    rutImportador: '88.555.444-2',
    valorFOB: 35000,
    valorCIF: 38000,
    moneda: 'USD',
    descripcionMercancia: 'Textiles y vestuario',
    pesoNeto: 2500,
    pesoBruto: 2800,
    numeroBultos: 100,
    archivoXML: '/docs/DIN-6020-24-0034567.xml',
    archivoXMLContent: xmlEjemploDIN,
    archivoPDF: '/docs/DIN-6020-24-0034567.pdf',
    observaciones: 'Documento rectificado por error en valoración',
    fechaCreacion: '2024-11-15',
    usuarioCreacion: 'sistema',
    fechaModificacion: '2024-11-16',
    usuarioModificacion: 'jrodriguez',
  },
];

// Función helper para obtener documentos por entidad
export const getDocumentosAduanerosPorDenuncia = (denunciaId: string): DocumentoAduanero[] => {
  return documentosAduaneros.filter(doc => doc.denunciaId === denunciaId);
};

export const getDocumentosAduanerosPorCargo = (cargoId: string): DocumentoAduanero[] => {
  return documentosAduaneros.filter(doc => doc.cargoId === cargoId);
};

export const getDocumentosAduanerosPorReclamo = (reclamoId: string): DocumentoAduanero[] => {
  return documentosAduaneros.filter(doc => doc.reclamoId === reclamoId);
};

export const getDocumentosAduanerosPorGiro = (giroId: string): DocumentoAduanero[] => {
  return documentosAduaneros.filter(doc => doc.giroId === giroId);
};

export const getDocumentoAduaneroPorId = (id: string): DocumentoAduanero | undefined => {
  return documentosAduaneros.find(doc => doc.id === id);
};
