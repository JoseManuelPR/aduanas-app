import { useNavigate } from 'react-router-dom';
import { Icon } from "he-button-custom-library";
import { CustomButton } from "../../../components/Button/Button";
import { Badge, getDiasVencimientoBadgeVariant } from "../../../components/UI";
import type { BadgeVariant } from "../../../components/UI";
import { ERoutePaths } from "../../../routes/routes";
import type { Reclamo, Denuncia, PermisosEstado } from '../../../data/types';

interface DenunciaReclamosProps {
  reclamos: Reclamo[];
  denuncia: Denuncia;
  permisos: PermisosEstado;
  onCrearReclamo?: () => void;
}

export const DenunciaReclamos: React.FC<DenunciaReclamosProps> = ({ 
  reclamos,
  denuncia: _denuncia,
  permisos,
  onCrearReclamo,
}) => {
  void _denuncia; // Mark as intentionally unused
  const navigate = useNavigate();

  const getTipoReclamoBadge = (tipo: Reclamo['tipoReclamo']): { variant: BadgeVariant, icon: string } => {
    switch (tipo) {
      case 'Art. 117':
        return { variant: 'info', icon: 'FileText' };
      case 'Reposición':
        return { variant: 'warning', icon: 'RotateCcw' };
      case 'TTA':
        return { variant: 'error', icon: 'Scale' };
      default:
        return { variant: 'default', icon: 'File' };
    }
  };

  const getEstadoReclamoVariant = (estado: Reclamo['estado']): BadgeVariant => {
    switch (estado) {
      case 'Ingresado':
        return 'info';
      case 'En Análisis':
        return 'warning';
      case 'Pendiente Resolución':
        return 'default';
      case 'Derivado a Tribunal':
        return 'error';
      case 'Resuelto':
        return 'success';
      case 'Rechazado':
        return 'error';
      case 'Acogido':
        return 'success';
      case 'Acogido Parcialmente':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (reclamos.length === 0) {
    return (
      <div className="card p-8 text-center">
        <Icon name="AlertTriangle" size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">Sin reclamos</h3>
        <p className="text-gray-600 mt-2 max-w-md mx-auto">
          No hay reclamos interpuestos contra esta denuncia.
          {permisos.puedeCrearReclamo && ' Puede registrar un reclamo desde el botón de acciones.'}
        </p>
        {permisos.puedeCrearReclamo && onCrearReclamo && (
          <CustomButton 
            variant="primary" 
            className="mt-4 inline-flex items-center gap-2"
            onClick={onCrearReclamo}
          >
            <Icon name="FileWarning" size={16} />
            Registrar Reclamo
          </CustomButton>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <Icon name="AlertTriangle" size={18} />
          Reclamos ({reclamos.length})
        </h4>
        {permisos.puedeCrearReclamo && onCrearReclamo && (
          <CustomButton 
            variant="primary" 
            className="flex items-center gap-2 text-sm"
            onClick={onCrearReclamo}
          >
            <Icon name="FileWarning" size={16} />
            Registrar Reclamo
          </CustomButton>
        )}
      </div>

      {/* Alerta si hay reclamos activos */}
      {reclamos.some(r => ['Ingresado', 'En Análisis', 'Pendiente Resolución', 'Derivado a Tribunal'].includes(r.estado)) && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <Icon name="AlertTriangle" size={20} className="text-amber-600" />
          <div>
            <p className="font-medium text-amber-800">Reclamo en curso</p>
            <p className="text-sm text-amber-600">
              Existe al menos un reclamo pendiente de resolución. 
              Algunas acciones sobre la denuncia pueden estar restringidas.
            </p>
          </div>
        </div>
      )}

      {/* Lista de reclamos */}
      <div className="space-y-3">
        {reclamos.map((reclamo) => {
          const tipoBadge = getTipoReclamoBadge(reclamo.tipoReclamo);
          return (
            <div 
              key={reclamo.id}
              className={`card p-4 hover:shadow-md transition-shadow cursor-pointer ${
                reclamo.tipoReclamo === 'TTA' ? 'border-l-4 border-l-red-500' : ''
              }`}
              onClick={() => navigate(`${ERoutePaths.RECLAMOS}/${reclamo.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    reclamo.tipoReclamo === 'TTA' 
                      ? 'bg-red-100' 
                      : reclamo.tipoReclamo === 'Art. 117'
                      ? 'bg-blue-100'
                      : 'bg-amber-100'
                  }`}>
                    <Icon 
                      name={tipoBadge.icon as any} 
                      size={24} 
                      className={
                        reclamo.tipoReclamo === 'TTA' 
                          ? 'text-red-600' 
                          : reclamo.tipoReclamo === 'Art. 117'
                          ? 'text-blue-600'
                          : 'text-amber-600'
                      }
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">
                        Reclamo N° {reclamo.numeroReclamo}
                      </span>
                      <Badge variant={tipoBadge.variant} size="sm">
                        {reclamo.tipoReclamo}
                      </Badge>
                      <Badge variant={getEstadoReclamoVariant(reclamo.estado)} size="sm" dot>
                        {reclamo.estado}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {reclamo.descripcion}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Icon name="Calendar" size={14} />
                        {reclamo.fechaIngreso}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="User" size={14} />
                        {reclamo.reclamante}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Hash" size={14} />
                        {reclamo.rutReclamante}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={getDiasVencimientoBadgeVariant(reclamo.diasRespuesta)} 
                    size="sm"
                  >
                    {reclamo.diasRespuesta < 0 
                      ? `${Math.abs(reclamo.diasRespuesta)}d vencido`
                      : `${reclamo.diasRespuesta} días`
                    }
                  </Badge>
                </div>
              </div>

              {/* Resolución si existe */}
              {reclamo.resolucion && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Resolución:</p>
                  <p className="text-sm text-gray-700">{reclamo.resolucion}</p>
                  {reclamo.fechaResolucion && (
                    <p className="text-xs text-gray-500 mt-1">
                      Fecha resolución: {reclamo.fechaResolucion}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Resumen por tipo */}
      <div className="card p-4 bg-gray-50">
        <h5 className="text-sm font-medium text-gray-700 mb-3">Resumen por tipo</h5>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-600">
              Art. 117: {reclamos.filter(r => r.tipoReclamo === 'Art. 117').length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-gray-600">
              Reposición: {reclamos.filter(r => r.tipoReclamo === 'Reposición').length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-600">
              TTA: {reclamos.filter(r => r.tipoReclamo === 'TTA').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DenunciaReclamos;

