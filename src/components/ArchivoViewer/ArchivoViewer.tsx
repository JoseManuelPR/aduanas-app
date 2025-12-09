import React, { useState } from 'react';
import { Icon } from 'he-button-custom-library';
import { ArchivoExpediente } from '../../data/types';
import { CustomButton } from '../Button/Button';
import { Badge } from '../UI';

interface ArchivoViewerProps {
  archivo: ArchivoExpediente;
  onClose?: () => void;
  contenidoXML?: string;
}

type VistaActiva = 'preview' | 'xml' | 'info';

// Contenidos mockeados de PDFs
const mockPDFContent: Record<string, JSX.Element> = {
  'Denuncia': (
    <div className="space-y-6">
      <div className="text-center border-b pb-4">
        <img src="/logo-aduana.png" alt="Logo" className="h-16 mx-auto mb-2 opacity-50" />
        <h2 className="text-xl font-bold text-gray-800">SERVICIO NACIONAL DE ADUANAS</h2>
        <p className="text-sm text-gray-600">República de Chile</p>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-bold text-gray-900">DENUNCIA INFRACCIONAL</h3>
        <p className="text-sm text-gray-600">Formulario Oficial - Sistema DECARE</p>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="border p-3 rounded">
          <p className="text-gray-500 text-xs">Número de Denuncia</p>
          <p className="font-semibold">993519</p>
        </div>
        <div className="border p-3 rounded">
          <p className="text-gray-500 text-xs">Fecha de Emisión</p>
          <p className="font-semibold">15/11/2024</p>
        </div>
        <div className="border p-3 rounded">
          <p className="text-gray-500 text-xs">Aduana</p>
          <p className="font-semibold">Valparaíso</p>
        </div>
        <div className="border p-3 rounded">
          <p className="text-gray-500 text-xs">Estado</p>
          <p className="font-semibold text-amber-600">En Revisión</p>
        </div>
      </div>
      <div className="border-t pt-4">
        <h4 className="font-semibold text-gray-800 mb-2">DATOS DEL DENUNCIADO</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-gray-500">RUT:</span> 96.123.456-7</div>
          <div><span className="text-gray-500">Razón Social:</span> Importadora Global SpA</div>
        </div>
      </div>
      <div className="border-t pt-4">
        <h4 className="font-semibold text-gray-800 mb-2">TIPIFICACIÓN</h4>
        <p className="text-sm">Artículo 176 - Subvaloración de mercancías</p>
        <p className="text-sm text-gray-600 mt-1">Diferencia en declaración de valores FOB</p>
      </div>
      <div className="border-t pt-4">
        <h4 className="font-semibold text-gray-800 mb-2">MONTO ESTIMADO</h4>
        <p className="text-2xl font-bold text-red-600">$15.500.000</p>
      </div>
      <div className="border-t pt-4 text-center text-xs text-gray-400">
        <p>Documento generado electrónicamente - Sistema DECARE</p>
        <p>Folio: DEN-2024-993519-001</p>
      </div>
    </div>
  ),
  'DIN': (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg text-center">
        <h2 className="text-xl font-bold text-blue-900">DECLARACIÓN DE INGRESO</h2>
        <p className="text-sm text-blue-700">Servicio Nacional de Aduanas de Chile</p>
      </div>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="border p-3 rounded bg-gray-50">
          <p className="text-gray-500 text-xs">N° Aceptación</p>
          <p className="font-bold text-lg">6020240012345</p>
        </div>
        <div className="border p-3 rounded bg-gray-50">
          <p className="text-gray-500 text-xs">Fecha Aceptación</p>
          <p className="font-semibold">01/11/2024</p>
        </div>
        <div className="border p-3 rounded bg-gray-50">
          <p className="text-gray-500 text-xs">Aduana</p>
          <p className="font-semibold">60 - Valparaíso</p>
        </div>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 font-semibold text-sm">IMPORTADOR</div>
        <div className="p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">RUT:</span>
            <span className="font-medium">96.123.456-7</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Razón Social:</span>
            <span className="font-medium">Importadora Global SpA</span>
          </div>
        </div>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 font-semibold text-sm">AGENTE DE ADUANAS</div>
        <div className="p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Código:</span>
            <span className="font-medium">A-123</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Razón Social:</span>
            <span className="font-medium">Agencia de Aduanas Pacífico Ltda.</span>
          </div>
        </div>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 font-semibold text-sm">VALORES</div>
        <div className="p-4 grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <p className="text-gray-500 text-xs">Valor FOB</p>
            <p className="font-bold text-lg text-green-700">USD 50,000</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-xs">Valor CIF</p>
            <p className="font-bold text-lg text-green-700">USD 52,500</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-xs">Moneda</p>
            <p className="font-bold text-lg">USD</p>
          </div>
        </div>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 font-semibold text-sm">MERCANCÍA</div>
        <div className="p-4 space-y-3 text-sm">
          <div>
            <p className="text-gray-500 text-xs">Descripción</p>
            <p className="font-medium">Electrónica de consumo - Smartphones</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-gray-500 text-xs">Peso Neto</p>
              <p className="font-medium">500 kg</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Peso Bruto</p>
              <p className="font-medium">600 kg</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Bultos</p>
              <p className="font-medium">50</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  'BL': (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold">BILL OF LADING</h2>
        <p className="text-blue-200">Conocimiento de Embarque</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="border p-4 rounded-lg">
          <p className="text-xs text-gray-500 uppercase">B/L Number</p>
          <p className="font-bold text-lg">MAEU-2024-11-001</p>
        </div>
        <div className="border p-4 rounded-lg">
          <p className="text-xs text-gray-500 uppercase">Date of Issue</p>
          <p className="font-bold text-lg">01/11/2024</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="border p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2 text-sm uppercase">Shipper</h4>
          <p className="text-sm">Tech Electronics Inc.</p>
          <p className="text-sm text-gray-500">Shenzhen, China</p>
        </div>
        <div className="border p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2 text-sm uppercase">Consignee</h4>
          <p className="text-sm">Importadora Global SpA</p>
          <p className="text-sm text-gray-500">Valparaíso, Chile</p>
        </div>
      </div>
      <div className="border p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2 text-sm uppercase">Vessel / Voyage</h4>
        <p className="text-lg font-medium">MSC OSCAR / V.2024-45</p>
        <p className="text-sm text-gray-500">Port of Loading: Shanghai, China</p>
        <p className="text-sm text-gray-500">Port of Discharge: Valparaíso, Chile</p>
      </div>
      <div className="border p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2 text-sm uppercase">Container / Goods</h4>
        <div className="bg-gray-50 p-3 rounded">
          <p className="font-mono text-lg">MSKU1234567</p>
          <p className="text-sm text-gray-600">40' High Cube - Electronic Devices</p>
          <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
            <div><span className="text-gray-500">Packages:</span> 50</div>
            <div><span className="text-gray-500">Gross Weight:</span> 600 kg</div>
            <div><span className="text-gray-500">Measurement:</span> 25 CBM</div>
          </div>
        </div>
      </div>
    </div>
  ),
  'Informe': (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gray-900">INFORME DE AFORO FÍSICO</h2>
        <p className="text-sm text-gray-500">Servicio Nacional de Aduanas - Departamento de Fiscalización</p>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="border p-3 rounded">
          <p className="text-gray-500 text-xs">N° Informe</p>
          <p className="font-semibold">AFO-2024-15112024</p>
        </div>
        <div className="border p-3 rounded">
          <p className="text-gray-500 text-xs">Fecha de Aforo</p>
          <p className="font-semibold">15/11/2024</p>
        </div>
      </div>
      <div className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded-r-lg">
        <h4 className="font-semibold text-amber-800">RESULTADO DEL AFORO</h4>
        <p className="text-amber-700 mt-1">Se detectaron discrepancias en la valoración declarada</p>
      </div>
      <div className="space-y-4">
        <h4 className="font-semibold">HALLAZGOS</h4>
        <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
          <p><strong>1.</strong> Mercancía corresponde a descripción declarada</p>
          <p><strong>2.</strong> Cantidad verificada: 50 bultos (coincide)</p>
          <p><strong>3.</strong> Valor declarado: USD 50,000</p>
          <p><strong>4.</strong> Valor estimado según referencia: USD 65,500</p>
          <p className="text-red-600 font-medium"><strong>5.</strong> Diferencia detectada: USD 15,500 (31%)</p>
        </div>
      </div>
      <div className="border-t pt-4">
        <h4 className="font-semibold mb-2">CONCLUSIÓN</h4>
        <p className="text-sm text-gray-700">
          Se recomienda proceder con denuncia por subvaloración de mercancías según lo 
          establecido en el Artículo 176 de la Ordenanza de Aduanas.
        </p>
      </div>
      <div className="border-t pt-4 text-sm">
        <div className="flex justify-between">
          <div>
            <p className="text-gray-500">Fiscalizador:</p>
            <p className="font-medium">Juan Rodríguez Torres</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500">Firma Digital</p>
            <p className="font-mono text-xs text-gray-400">✓ Validado</p>
          </div>
        </div>
      </div>
    </div>
  ),
  'Notificacion': (
    <div className="space-y-6">
      <div className="text-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-900">NOTIFICACIÓN ELECTRÓNICA</h2>
        <p className="text-sm text-gray-500">Sistema de Notificaciones DECARE</p>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-blue-800">
          <Icon name="Mail" size={20} />
          <span className="font-semibold">Notificación enviada exitosamente</span>
        </div>
        <p className="text-sm text-blue-600 mt-1">Fecha: 18/11/2024 - 11:20 hrs</p>
      </div>
      <div className="space-y-4 text-sm">
        <div className="border p-4 rounded-lg">
          <p className="text-gray-500 text-xs uppercase">Destinatario</p>
          <p className="font-medium">Importadora Global SpA</p>
          <p className="text-gray-600">RUT: 96.123.456-7</p>
        </div>
        <div className="border p-4 rounded-lg">
          <p className="text-gray-500 text-xs uppercase">Asunto</p>
          <p className="font-medium">Solicitud de Antecedentes - Denuncia N° 993519</p>
        </div>
        <div className="border p-4 rounded-lg">
          <p className="text-gray-500 text-xs uppercase mb-2">Contenido</p>
          <div className="bg-gray-50 p-3 rounded text-gray-700">
            <p>Estimado contribuyente:</p>
            <p className="mt-2">
              Se le notifica que debe presentar los antecedentes requeridos en relación 
              a la denuncia N° 993519 en un plazo de 10 días hábiles contados desde la 
              recepción de esta notificación.
            </p>
            <p className="mt-2">
              Los documentos deben ser presentados a través del sistema DECARE o en la 
              Aduana de Valparaíso.
            </p>
          </div>
        </div>
      </div>
      <div className="border-t pt-4 text-center text-xs text-gray-400">
        <p>Notificación electrónica con validez legal</p>
        <p>Código verificación: NOT-2024-993519-18112024</p>
      </div>
    </div>
  ),
  'CI': (
    <div className="space-y-6">
      <div className="flex justify-between items-start border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">COMMERCIAL INVOICE</h2>
          <p className="text-gray-500">Factura Comercial</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg">N° CI-2024-10-5678</p>
          <p className="text-sm text-gray-500">Date: 25/10/2024</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 text-sm">
        <div className="border p-4 rounded-lg">
          <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Seller / Exporter</p>
          <p className="font-medium">Tech Electronics Inc.</p>
          <p className="text-gray-600">123 Technology Road</p>
          <p className="text-gray-600">Shenzhen, Guangdong</p>
          <p className="text-gray-600">China 518000</p>
        </div>
        <div className="border p-4 rounded-lg">
          <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Buyer / Importer</p>
          <p className="font-medium">Importadora Global SpA</p>
          <p className="text-gray-600">Av. Principal 456</p>
          <p className="text-gray-600">Valparaíso</p>
          <p className="text-gray-600">Chile</p>
        </div>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-center">Qty</th>
              <th className="px-4 py-2 text-right">Unit Price</th>
              <th className="px-4 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-4 py-3">Smartphones Model X Pro</td>
              <td className="px-4 py-3 text-center">500</td>
              <td className="px-4 py-3 text-right">USD 80.00</td>
              <td className="px-4 py-3 text-right">USD 40,000.00</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-3">Smartphone Cases</td>
              <td className="px-4 py-3 text-center">500</td>
              <td className="px-4 py-3 text-right">USD 10.00</td>
              <td className="px-4 py-3 text-right">USD 5,000.00</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-3">Chargers & Accessories</td>
              <td className="px-4 py-3 text-center">500</td>
              <td className="px-4 py-3 text-right">USD 10.00</td>
              <td className="px-4 py-3 text-right">USD 5,000.00</td>
            </tr>
          </tbody>
          <tfoot className="bg-gray-50 font-semibold">
            <tr className="border-t">
              <td colSpan={3} className="px-4 py-3 text-right">Total FOB:</td>
              <td className="px-4 py-3 text-right text-green-700">USD 50,000.00</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="text-sm text-gray-600">
        <p><strong>Terms:</strong> FOB Shanghai</p>
        <p><strong>Payment:</strong> T/T 30 days</p>
        <p><strong>Country of Origin:</strong> China</p>
      </div>
    </div>
  ),
};

// Función para obtener el contenido mockeado basado en el nombre del archivo
const getMockPDFContent = (archivo: ArchivoExpediente): JSX.Element => {
  const nombre = archivo.nombre.toLowerCase();
  
  if (nombre.includes('denuncia')) return mockPDFContent['Denuncia'];
  if (nombre.includes('din')) return mockPDFContent['DIN'];
  if (nombre.includes('bl') || nombre.includes('lading')) return mockPDFContent['BL'];
  if (nombre.includes('informe') || nombre.includes('aforo')) return mockPDFContent['Informe'];
  if (nombre.includes('notificacion')) return mockPDFContent['Notificacion'];
  if (nombre.includes('commercial') || nombre.includes('invoice') || nombre.includes('ci-')) return mockPDFContent['CI'];
  
  // Contenido genérico para otros PDFs
  return (
    <div className="space-y-6">
      <div className="text-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-900">Documento PDF</h2>
        <p className="text-sm text-gray-500">{archivo.nombre}</p>
      </div>
      <div className="bg-gray-100 p-8 rounded-lg text-center">
        <Icon name="FileText" size={64} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">Vista previa del documento</p>
        <p className="text-sm text-gray-500 mt-2">
          Categoría: {archivo.categoria}
        </p>
        <p className="text-sm text-gray-500">
          Tamaño: {archivo.tamanio}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="border p-3 rounded">
          <p className="text-gray-500 text-xs">Fecha de subida</p>
          <p className="font-medium">{archivo.fechaSubida}</p>
        </div>
        <div className="border p-3 rounded">
          <p className="text-gray-500 text-xs">Subido por</p>
          <p className="font-medium">{archivo.nombreUsuarioSubida || archivo.usuarioSubida}</p>
        </div>
      </div>
      {archivo.descripcion && (
        <div className="border-t pt-4">
          <p className="text-gray-500 text-xs uppercase mb-1">Descripción</p>
          <p className="text-sm">{archivo.descripcion}</p>
        </div>
      )}
    </div>
  );
};

export const ArchivoViewer: React.FC<ArchivoViewerProps> = ({
  archivo,
  onClose,
  contenidoXML,
}) => {
  const [vistaActiva, setVistaActiva] = useState<VistaActiva>(
    archivo.tipo === 'XML' ? 'xml' : 'preview'
  );

  const tieneXML = archivo.tipo === 'XML' || contenidoXML;

  const getEstadoBadgeVariant = (estado: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
      Vigente: 'success',
      Reemplazado: 'warning',
      Anulado: 'danger',
      'En Revisión': 'info',
    };
    return variants[estado] || 'info';
  };

  const copiarXML = () => {
    const xml = contenidoXML || archivo.contenidoXML;
    if (xml) {
      navigator.clipboard.writeText(xml);
    }
  };

  const descargarArchivo = () => {
    // En producción, esto abriría la URL de descarga real
    console.log('Descargando:', archivo.urlDescarga);
    alert(`Descarga simulada: ${archivo.nombre}`);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white p-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-aduana-azul/10 rounded-lg">
                <Icon 
                  name={archivo.tipo === 'PDF' ? 'FileText' : archivo.tipo === 'XML' ? 'Code' : 'File'} 
                  size={24} 
                  className="text-aduana-azul" 
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{archivo.nombre}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={getEstadoBadgeVariant(archivo.estado)} size="sm">
                    {archivo.estado}
                  </Badge>
                  <span className="text-sm text-gray-500">{archivo.tipo} • {archivo.tamanio}</span>
                </div>
              </div>
            </div>
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
            onClick={() => setVistaActiva('preview')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              vistaActiva === 'preview'
                ? 'border-aduana-azul text-aduana-azul'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon name="Eye" size={16} className="inline mr-2" />
            Vista Previa
          </button>
          {tieneXML && (
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
        </div>

        {/* Acciones */}
        <div className="flex gap-2 mt-4">
          <CustomButton
            variant="primary"
            className="flex items-center gap-2 text-sm"
            onClick={descargarArchivo}
          >
            <Icon name="Download" size={16} />
            Descargar
          </CustomButton>
          {tieneXML && (
            <CustomButton
              variant="secondary"
              className="flex items-center gap-2 text-sm"
              onClick={copiarXML}
            >
              <Icon name="Copy" size={16} />
              Copiar XML
            </CustomButton>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-gray-50 p-6">
        {vistaActiva === 'preview' && (
          <div className="max-w-3xl mx-auto">
            {archivo.tipo === 'PDF' ? (
              <div className="card p-8 bg-white shadow-lg">
                {getMockPDFContent(archivo)}
              </div>
            ) : archivo.tipo === 'XML' ? (
              <div className="card p-5">
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <Icon name="Code" size={48} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600 mb-2">Archivo XML</p>
                  <p className="text-sm text-gray-500">
                    Cambia a la pestaña "Ver XML" para visualizar el contenido
                  </p>
                </div>
              </div>
            ) : archivo.tipo === 'ZIP' ? (
              <div className="card p-8 text-center">
                <Icon name="Archive" size={64} className="mx-auto text-gray-400 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Archivo Comprimido</h3>
                <p className="text-gray-600 mb-4">{archivo.nombre}</p>
                <p className="text-sm text-gray-500">
                  Los archivos ZIP no tienen vista previa disponible.
                  Descargue el archivo para ver su contenido.
                </p>
              </div>
            ) : (
              <div className="card p-8 text-center">
                <Icon name="File" size={64} className="mx-auto text-gray-400 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">{archivo.nombre}</h3>
                <p className="text-gray-600">
                  Vista previa no disponible para este tipo de archivo
                </p>
              </div>
            )}
          </div>
        )}

        {vistaActiva === 'xml' && tieneXML && (
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
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-sm max-h-[600px]">
              <code>{contenidoXML || archivo.contenidoXML || 'No hay contenido XML disponible'}</code>
            </pre>
          </div>
        )}

        {vistaActiva === 'info' && (
          <div className="space-y-6 max-w-4xl">
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="FileText" size={18} />
                Información del Archivo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nombre del Archivo</p>
                  <p className="font-medium">{archivo.nombre}</p>
                </div>
                {archivo.nombreOriginal && (
                  <div>
                    <p className="text-sm text-gray-500">Nombre Original</p>
                    <p className="font-medium">{archivo.nombreOriginal}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Tipo</p>
                  <p className="font-medium">{archivo.tipo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tamaño</p>
                  <p className="font-medium">{archivo.tamanio}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Categoría</p>
                  <Badge variant="info" size="sm">{archivo.categoria}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Origen</p>
                  <p className="font-medium">{archivo.origen}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estado</p>
                  <Badge variant={getEstadoBadgeVariant(archivo.estado)} size="sm">
                    {archivo.estado}
                  </Badge>
                </div>
                {archivo.esFirmado && (
                  <div>
                    <p className="text-sm text-gray-500">Firma Digital</p>
                    <div className="flex items-center gap-1 text-green-600">
                      <Icon name="CheckCircle" size={16} />
                      <span className="font-medium">Firmado</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="Clock" size={18} />
                Historial
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Fecha de Subida</p>
                  <p className="font-medium">{archivo.fechaSubida} {archivo.horaSubida && `- ${archivo.horaSubida}`}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Subido por</p>
                  <p className="font-medium">{archivo.nombreUsuarioSubida || archivo.usuarioSubida}</p>
                </div>
              </div>
            </div>

            {archivo.descripcion && (
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Icon name="AlignLeft" size={18} />
                  Descripción
                </h3>
                <p className="text-gray-700">{archivo.descripcion}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivoViewer;


