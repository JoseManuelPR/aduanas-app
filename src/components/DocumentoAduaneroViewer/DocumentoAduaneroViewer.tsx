import React, { useState } from 'react';
import { Icon } from 'he-button-custom-library';
import { DocumentoAduanero } from '../../data/types';
import { CustomButton } from '../Button/Button';
import { Badge } from '../UI';

interface DocumentoAduaneroViewerProps {
  documento: DocumentoAduanero;
  onClose?: () => void;
}

type VistaActiva = 'xml' | 'html' | 'info';

export const DocumentoAduaneroViewer: React.FC<DocumentoAduaneroViewerProps> = ({
  documento,
  onClose,
}) => {
  const [vistaActiva, setVistaActiva] = useState<VistaActiva>('info');

  const descargarXML = () => {
    if (documento.archivoXMLContent) {
      const blob = new Blob([documento.archivoXMLContent], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${documento.numeroDocumento}.xml`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const descargarPDF = () => {
    if (documento.archivoPDF) {
      window.open(documento.archivoPDF, '_blank');
    }
  };

  const copiarXML = () => {
    if (documento.archivoXMLContent) {
      navigator.clipboard.writeText(documento.archivoXMLContent);
    }
  };

  const getEstadoBadgeVariant = (estado: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
      Vigente: 'success',
      Anulado: 'danger',
      Rectificado: 'warning',
      Cancelado: 'danger',
    };
    return variants[estado] || 'info';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white p-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900">
                {documento.tipoDocumento} {documento.numeroDocumento}
              </h2>
              <Badge variant={getEstadoBadgeVariant(documento.estado)} size="md">
                {documento.estado}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {documento.descripcion || 'Documento aduanero'}
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Icon name="X" size={20} />
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setVistaActiva('info')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              vistaActiva === 'info'
                ? 'border-aduana-azul text-aduana-azul'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon name="Info" size={16} className="inline mr-2" />
            Información
          </button>
          {documento.archivoXMLContent && (
            <button
              onClick={() => setVistaActiva('xml')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                vistaActiva === 'xml'
                  ? 'border-aduana-azul text-aduana-azul'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon name="Code" size={16} className="inline mr-2" />
              Ver XML
            </button>
          )}
          {documento.archivoHTML && (
            <button
              onClick={() => setVistaActiva('html')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                vistaActiva === 'html'
                  ? 'border-aduana-azul text-aduana-azul'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon name="FileText" size={16} className="inline mr-2" />
              Ver Formato
            </button>
          )}
        </div>

        {/* Acciones */}
        <div className="flex gap-2 mt-4">
          {documento.archivoXMLContent && (
            <>
              <CustomButton
                variant="secondary"
                className="flex items-center gap-2 text-sm"
                onClick={descargarXML}
              >
                <Icon name="Download" size={16} />
                Descargar XML
              </CustomButton>
              <CustomButton
                variant="secondary"
                className="flex items-center gap-2 text-sm"
                onClick={copiarXML}
              >
                <Icon name="Copy" size={16} />
                Copiar XML
              </CustomButton>
            </>
          )}
          {documento.archivoPDF && (
            <CustomButton
              variant="secondary"
              className="flex items-center gap-2 text-sm"
              onClick={descargarPDF}
            >
              <Icon name="FileText" size={16} />
              Ver PDF
            </CustomButton>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-gray-50 p-6">
        {vistaActiva === 'info' && (
          <div className="space-y-6 max-w-4xl">
            {/* Información General */}
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="FileText" size={18} />
                Información General
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Tipo de Documento</p>
                  <p className="font-medium">{documento.tipoDocumento}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Número de Documento</p>
                  <p className="font-medium">{documento.numeroDocumento}</p>
                </div>
                {documento.numeroAceptacion && (
                  <div>
                    <p className="text-sm text-gray-500">Número de Aceptación</p>
                    <p className="font-medium">{documento.numeroAceptacion}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Fecha de Emisión</p>
                  <p className="font-medium">{documento.fechaEmision}</p>
                </div>
                {documento.fechaAceptacion && (
                  <div>
                    <p className="text-sm text-gray-500">Fecha de Aceptación</p>
                    <p className="font-medium">{documento.fechaAceptacion}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Aduana</p>
                  <p className="font-medium">{documento.aduana}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estado</p>
                  <Badge variant={getEstadoBadgeVariant(documento.estado)}>
                    {documento.estado}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Datos del Importador/Exportador */}
            {(documento.importador || documento.exportador) && (
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Icon name="Building" size={18} />
                  {documento.importador ? 'Importador' : 'Exportador'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">RUT</p>
                    <p className="font-medium">
                      {documento.rutImportador || documento.rutExportador}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Razón Social</p>
                    <p className="font-medium">
                      {documento.importador || documento.exportador}
                    </p>
                  </div>
                  {documento.agenteAduana && (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Agente de Aduanas</p>
                        <p className="font-medium">{documento.agenteAduana}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Código Agente</p>
                        <p className="font-medium">{documento.codigoAgente}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Valores y Montos */}
            {(documento.valorFOB || documento.valorCIF) && (
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Icon name="DollarSign" size={18} />
                  Valores
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {documento.valorFOB && (
                    <div>
                      <p className="text-sm text-gray-500">Valor FOB</p>
                      <p className="font-medium text-lg">
                        {documento.moneda} {documento.valorFOB.toLocaleString()}
                      </p>
                    </div>
                  )}
                  {documento.valorCIF && (
                    <div>
                      <p className="text-sm text-gray-500">Valor CIF</p>
                      <p className="font-medium text-lg">
                        {documento.moneda} {documento.valorCIF.toLocaleString()}
                      </p>
                    </div>
                  )}
                  {documento.moneda && (
                    <div>
                      <p className="text-sm text-gray-500">Moneda</p>
                      <p className="font-medium">{documento.moneda}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mercancía */}
            {documento.descripcionMercancia && (
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Icon name="Package" size={18} />
                  Mercancía
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Descripción</p>
                    <p className="font-medium">{documento.descripcionMercancia}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {documento.pesoNeto && (
                      <div>
                        <p className="text-sm text-gray-500">Peso Neto</p>
                        <p className="font-medium">{documento.pesoNeto} kg</p>
                      </div>
                    )}
                    {documento.pesoBruto && (
                      <div>
                        <p className="text-sm text-gray-500">Peso Bruto</p>
                        <p className="font-medium">{documento.pesoBruto} kg</p>
                      </div>
                    )}
                    {documento.numeroBultos && (
                      <div>
                        <p className="text-sm text-gray-500">Número de Bultos</p>
                        <p className="font-medium">{documento.numeroBultos}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Observaciones */}
            {documento.observaciones && (
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Icon name="MessageSquare" size={18} />
                  Observaciones
                </h3>
                <p className="text-gray-700">{documento.observaciones}</p>
              </div>
            )}
          </div>
        )}

        {vistaActiva === 'xml' && documento.archivoXMLContent && (
          <div className="card p-5 max-w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Contenido XML</h3>
              <CustomButton
                variant="secondary"
                className="flex items-center gap-2 text-sm"
                onClick={copiarXML}
              >
                <Icon name="Copy" size={16} />
                Copiar
              </CustomButton>
            </div>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-sm">
              <code>{documento.archivoXMLContent}</code>
            </pre>
          </div>
        )}

        {vistaActiva === 'html' && documento.archivoHTML && (
          <div className="card p-5">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="prose max-w-none">
                <p className="text-gray-600 italic">
                  Vista HTML del documento (simulada)
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  En producción, aquí se mostraría el documento transformado mediante XSL.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentoAduaneroViewer;
