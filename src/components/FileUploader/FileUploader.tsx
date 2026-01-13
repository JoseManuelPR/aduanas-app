import React, { useState, useRef } from 'react';
import { Icon } from 'he-button-custom-library';
import { CustomButton } from '../Button/Button';
import { CategoriaArchivoExpediente, TipoArchivoExpediente } from '../../data/types';

interface FileUploaderProps {
  expedienteId: string;
  onUploadComplete?: (files: UploadedFileInfo[]) => void;
  onClose?: () => void;
  maxFileSize?: number; // en MB
  allowedTypes?: string[];
}

export interface UploadedFileInfo {
  file: File;
  categoria: CategoriaArchivoExpediente;
  descripcion?: string;
}

// Categorías del catálogo fijo del sistema (definidas en normativa aduanera)
const categorias: { value: CategoriaArchivoExpediente; label: string; obligatoria: boolean; descripcion: string }[] = [
  { value: 'Documento Aduanero', label: 'Documento Aduanero', obligatoria: true, descripcion: 'DIN, DUS, BL, facturas comerciales' },
  { value: 'Denuncia/Cargo', label: 'Denuncia/Cargo', obligatoria: true, descripcion: 'Documento oficial de denuncia o cargo' },
  { value: 'Notificación', label: 'Notificación', obligatoria: true, descripcion: 'Notificaciones legales' },
  { value: 'Resolución', label: 'Resolución', obligatoria: false, descripcion: 'Resoluciones administrativas' },
  { value: 'Prueba/Evidencia', label: 'Prueba/Evidencia', obligatoria: false, descripcion: 'Material probatorio' },
  { value: 'Fotografía', label: 'Fotografía', obligatoria: false, descripcion: 'Registro fotográfico de mercancías' },
  { value: 'Informe Técnico', label: 'Informe Técnico', obligatoria: false, descripcion: 'Informes de aforo, peritajes' },
  { value: 'Comunicación', label: 'Comunicación', obligatoria: false, descripcion: 'Correos, oficios, memorándums' },
  { value: 'Reclamo/Recurso', label: 'Reclamo/Recurso', obligatoria: false, descripcion: 'Recursos administrativos' },
  { value: 'Sentencia', label: 'Sentencia', obligatoria: false, descripcion: 'Fallos judiciales' },
  { value: 'Comprobante de Pago', label: 'Comprobante de Pago', obligatoria: false, descripcion: 'Vouchers, recibos' },
  { value: 'Otro', label: 'Otro', obligatoria: false, descripcion: 'Documentos no clasificados' },
];

const tiposArchivo: { extension: string; tipo: TipoArchivoExpediente; icon: string }[] = [
  { extension: '.pdf', tipo: 'PDF', icon: 'FileText' },
  { extension: '.xml', tipo: 'XML', icon: 'Code' },
  { extension: '.doc,.docx', tipo: 'DOCX', icon: 'FileText' },
  { extension: '.xls,.xlsx', tipo: 'XLSX', icon: 'FileSpreadsheet' },
  { extension: '.jpg,.jpeg', tipo: 'JPG', icon: 'Image' },
  { extension: '.png', tipo: 'PNG', icon: 'Image' },
  { extension: '.zip', tipo: 'ZIP', icon: 'FolderArchive' },
  { extension: '.rar', tipo: 'RAR', icon: 'FolderArchive' },
];

export const FileUploader: React.FC<FileUploaderProps> = ({
  expedienteId,
  onUploadComplete,
  onClose,
  maxFileSize = 50,
  allowedTypes = ['.pdf', '.xml', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png', '.zip', '.rar'],
}) => {
  const [selectedFiles, setSelectedFiles] = useState<UploadedFileInfo[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Validar tamaño
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      return { valid: false, error: `El archivo excede el tamaño máximo de ${maxFileSize} MB` };
    }

    // Validar tipo
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const isAllowed = allowedTypes.some(type => {
      const types = type.split(',');
      return types.some(t => t.trim() === fileExtension);
    });

    if (!isAllowed) {
      return { valid: false, error: 'Tipo de archivo no permitido' };
    }

    return { valid: true };
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadedFileInfo[] = [];
    const errors: string[] = [];

    Array.from(files).forEach(file => {
      const validation = validateFile(file);
      if (validation.valid) {
        // Inferir categoría según extensión del archivo
        const extension = file.name.split('.').pop()?.toLowerCase();
        let categoriaInicial: CategoriaArchivoExpediente = 'Otro';
        if (extension === 'xml' || extension === 'pdf') {
          categoriaInicial = 'Documento Aduanero';
        } else if (['jpg', 'jpeg', 'png'].includes(extension || '')) {
          categoriaInicial = 'Fotografía';
        }
        
        newFiles.push({
          file,
          categoria: categoriaInicial,
          descripcion: '',
        });
      } else {
        errors.push(`${file.name}: ${validation.error}`);
      }
    });

    if (errors.length > 0) {
      alert('Algunos archivos no pudieron ser agregados:\n' + errors.join('\n'));
    }

    setSelectedFiles([...selectedFiles, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const updateFileCategory = (index: number, categoria: CategoriaArchivoExpediente) => {
    const updated = [...selectedFiles];
    updated[index].categoria = categoria;
    setSelectedFiles(updated);
  };

  const updateFileDescription = (index: number, descripcion: string) => {
    const updated = [...selectedFiles];
    updated[index].descripcion = descripcion;
    setSelectedFiles(updated);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);

    // Simular upload
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (onUploadComplete) {
      onUploadComplete(selectedFiles);
    }

    setIsUploading(false);
    setSelectedFiles([]);

    if (onClose) {
      onClose();
    }
  };

  const getFileIcon = (fileName: string): string => {
    const extension = '.' + fileName.split('.').pop()?.toLowerCase();
    const tipoInfo = tiposArchivo.find(t => t.extension.includes(extension));
    return tipoInfo?.icon || 'File';
  };

  return (
    <div className="flex flex-col h-full max-h-screen">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Subir Archivos</h2>
            <p className="text-sm text-gray-500 mt-1">
              Expediente: {expedienteId}
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
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Información de impacto en completitud */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Icon name="Info" size={20} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-blue-900 mb-1">Impacto en la completitud del expediente</p>
              <p className="text-sm text-blue-700">
                Los archivos que suba afectarán el porcentaje de completitud <strong>solo si corresponden a categorías obligatorias</strong> como 
                "Documento Aduanero" o "Denuncia/Cargo". Los documentos de respaldo opcionales (fotografías, informes adicionales) 
                no modifican el porcentaje pero quedan registrados en el expediente.
              </p>
            </div>
          </div>
        </div>

        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-aduana-azul bg-blue-50'
              : 'border-gray-300 bg-gray-50 hover:border-aduana-azul'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={allowedTypes.join(',')}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-4">
            <div className={`p-4 rounded-full ${isDragging ? 'bg-aduana-azul text-white' : 'bg-gray-200 text-gray-500'}`}>
              <Icon name="Upload" size={32} />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">
                Arrastra archivos aquí o{' '}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-aduana-azul hover:underline"
                >
                  selecciona archivos
                </button>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Tamaño máximo: <strong>{maxFileSize} MB</strong> por archivo
              </p>
            </div>
          </div>
        </div>

        {/* Información detallada de formatos */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Icon name="FileCheck" size={16} className="text-gray-500" />
            Formatos permitidos
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Icon name="FileText" size={16} className="text-red-500" />
              <span>PDF</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Icon name="Code" size={16} className="text-orange-500" />
              <span>XML</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Icon name="FileText" size={16} className="text-blue-500" />
              <span>DOC, DOCX</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Icon name="FileSpreadsheet" size={16} className="text-green-500" />
              <span>XLS, XLSX</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Icon name="Image" size={16} className="text-purple-500" />
              <span>JPG, PNG</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Icon name="FolderArchive" size={16} className="text-amber-500" />
              <span>ZIP, RAR</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
            <Icon name="AlertCircle" size={12} />
            Archivos ejecutables (.exe, .bat, .sh) no están permitidos por seguridad.
          </p>
        </div>

        {/* Lista de archivos seleccionados */}
        {selectedFiles.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">
              Archivos seleccionados ({selectedFiles.length})
            </h3>
            <div className="space-y-3">
              {selectedFiles.map((fileInfo, index) => (
                <div key={index} className="card p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-aduana-azul-50 rounded-lg">
                      <Icon name={getFileIcon(fileInfo.file.name) as any} size={24} className="text-aduana-azul" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <p className="font-medium text-gray-900">{fileInfo.file.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(fileInfo.file.size)}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Categoría <span className="text-red-500">*</span>
                            <span className="font-normal text-gray-500 text-xs ml-1">(catálogo fijo del sistema)</span>
                          </label>
                          <select
                            value={fileInfo.categoria}
                            onChange={(e) => updateFileCategory(index, e.target.value as CategoriaArchivoExpediente)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aduana-azul focus:border-transparent text-sm"
                          >
                            <optgroup label="📋 Categorías obligatorias (afectan completitud)">
                              {categorias.filter(cat => cat.obligatoria).map(cat => (
                                <option key={cat.value} value={cat.value}>
                                  {cat.label}
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label="📎 Categorías opcionales">
                              {categorias.filter(cat => !cat.obligatoria).map(cat => (
                                <option key={cat.value} value={cat.value}>
                                  {cat.label}
                                </option>
                              ))}
                            </optgroup>
                          </select>
                          {/* Mostrar descripción de la categoría seleccionada */}
                          {(() => {
                            const catInfo = categorias.find(c => c.value === fileInfo.categoria);
                            return catInfo && (
                              <p className={`text-xs mt-1 ${catInfo.obligatoria ? 'text-blue-600' : 'text-gray-500'}`}>
                                {catInfo.obligatoria && <span className="font-medium">✓ Afecta completitud • </span>}
                                {catInfo.descripcion}
                              </p>
                            );
                          })()}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción (opcional)
                          </label>
                          <input
                            type="text"
                            value={fileInfo.descripcion}
                            onChange={(e) => updateFileDescription(index, e.target.value)}
                            placeholder="Descripción del archivo..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aduana-azul focus:border-transparent text-sm"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                    >
                      <Icon name="Trash2" size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-white p-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {selectedFiles.length} {selectedFiles.length === 1 ? 'archivo seleccionado' : 'archivos seleccionados'}
          </p>
          <div className="flex gap-3">
            {onClose && (
              <CustomButton variant="secondary" onClick={onClose}>
                Cancelar
              </CustomButton>
            )}
            <CustomButton
              variant="primary"
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || isUploading}
              className="flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <Icon name="Loader" size={16} className="animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Icon name="Upload" size={16} />
                  Subir {selectedFiles.length} {selectedFiles.length === 1 ? 'archivo' : 'archivos'}
                </>
              )}
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
