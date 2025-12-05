import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'he-button-custom-library';
import { CustomButton } from '../Button/Button';
import { ERoutePaths } from '../../routes/routes';
import { Badge } from '../UI';

interface ExpedienteActionsProps {
  entidadId: string;
  entidadTipo: 'denuncia' | 'cargo' | 'reclamo' | 'giro';
  numeroDocumentosAduaneros?: number;
  numeroArchivos?: number;
  completitud?: number;
  documentosFaltantes?: boolean;
}

export const ExpedienteActions: React.FC<ExpedienteActionsProps> = ({
  entidadId,
  entidadTipo,
  numeroDocumentosAduaneros = 0,
  numeroArchivos = 0,
  completitud,
  documentosFaltantes = false,
}) => {
  const navigate = useNavigate();

  const getExpedienteRoute = () => {
    const routes = {
      denuncia: ERoutePaths.EXPEDIENTE_DENUNCIA,
      cargo: ERoutePaths.EXPEDIENTE_CARGO,
      reclamo: ERoutePaths.EXPEDIENTE_RECLAMO,
      giro: ERoutePaths.EXPEDIENTE_GIRO,
    };
    return routes[entidadTipo].replace(':id', entidadId);
  };

  return (
    <div className="card p-5">
      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Icon name="Folder" size={18} />
        Expediente Digital
      </h4>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Documentos Aduaneros</p>
          <p className="text-xl font-bold text-gray-900">{numeroDocumentosAduaneros}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Archivos Subidos</p>
          <p className="text-xl font-bold text-gray-900">{numeroArchivos}</p>
        </div>
        {completitud !== undefined && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Completitud</p>
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold text-gray-900">{completitud}%</p>
              {documentosFaltantes && (
                <Badge variant="warning" size="sm">
                  Faltan docs
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Alerta de documentos faltantes */}
      {documentosFaltantes && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
          <Icon name="AlertTriangle" size={16} className="text-amber-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">
              Documentos Obligatorios Faltantes
            </p>
            <p className="text-xs text-amber-700 mt-1">
              Hay documentos obligatorios que aún no han sido agregados al expediente
            </p>
          </div>
        </div>
      )}

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row gap-3">
        <CustomButton
          variant="primary"
          className="flex items-center justify-center gap-2 text-sm flex-1"
          onClick={() => navigate(getExpedienteRoute())}
        >
          <Icon name="FolderOpen" size={16} />
          Ver Expediente Completo
        </CustomButton>

        {numeroDocumentosAduaneros > 0 && (
          <CustomButton
            variant="secondary"
            className="flex items-center justify-center gap-2 text-sm flex-1"
            onClick={() => {
              navigate(getExpedienteRoute());
              // Scroll to documentos aduaneros tab
              setTimeout(() => {
                const tab = document.querySelector('[data-tab-id="documentos-aduaneros"]');
                if (tab) {
                  (tab as HTMLElement).click();
                }
              }, 100);
            }}
          >
            <Icon name="FileText" size={16} />
            Ver Documentos Aduaneros ({numeroDocumentosAduaneros})
          </CustomButton>
        )}
      </div>
    </div>
  );
};

export default ExpedienteActions;
