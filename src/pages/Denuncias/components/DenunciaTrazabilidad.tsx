import { Icon } from "he-button-custom-library";
import { Timeline } from "../../../components/UI";
import type { Denuncia, TimelineItem } from '../../../data/types';

interface DenunciaTrazabilidadProps {
  timeline: TimelineItem[];
  denuncia: Denuncia;
}

export const DenunciaTrazabilidad: React.FC<DenunciaTrazabilidadProps> = ({ 
  timeline,
  denuncia,
}) => {
  return (
    <div className="space-y-6">
      {/* Info del expediente */}
      <div className="card p-5">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
          <Icon name="GitBranch" size={18} />
          Información del Expediente
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">N° Expediente</p>
            <p className="font-medium">{denuncia.numeroDenuncia}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Fecha Creación</p>
            <p className="font-medium">{denuncia.fechaCreacion || denuncia.fechaIngreso}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Última Modificación</p>
            <p className="font-medium">{denuncia.fechaModificacion || denuncia.fechaIngreso}</p>
          </div>
          {denuncia.instanciaJbpm && (
            <div>
              <p className="text-sm text-gray-500">Instancia Workflow</p>
              <p className="font-mono text-xs bg-gray-100 px-2 py-1 rounded inline-block">
                {denuncia.instanciaJbpm}
              </p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500">Usuario Creación</p>
            <p className="font-medium">{denuncia.usuarioCreacion || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Usuario Modificación</p>
            <p className="font-medium">{denuncia.usuarioModificacion || '-'}</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="card p-6">
        <h4 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Icon name="Clock" size={18} />
          Historial de la Denuncia
        </h4>
        <Timeline items={timeline} />
      </div>

      {/* Workflow Status */}
      <div className="card p-5">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
          <Icon name="Workflow" size={18} />
          Estado del Flujo de Trabajo
        </h4>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-aduana-azul rounded-full flex items-center justify-center">
              <Icon name="CheckCircle" size={24} className="text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Etapa Actual: {denuncia.etapaFormulacion || 'No definida'}</p>
              <p className="text-sm text-gray-600">Estado: {denuncia.estado}</p>
            </div>
          </div>
          <button className="flex items-center gap-2 text-aduana-azul hover:underline text-sm">
            <Icon name="RefreshCw" size={16} />
            Actualizar estado
          </button>
        </div>

        {/* Barra de progreso del flujo */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            {['Borrador', 'Ingresada', 'Formulada', 'Notificada', 'Cerrada'].map((etapa, index) => {
              const etapasOrden = ['Borrador', 'Ingresada', 'En Revisión', 'Formulada', 'Notificada', 'En Proceso', 'Cerrada'];
              const etapaActualIndex = etapasOrden.indexOf(denuncia.estado);
              const etapaIndex = etapasOrden.indexOf(etapa === 'Cerrada' ? 'Cerrada' : etapa);
              const isCompleted = etapaActualIndex >= etapaIndex;
              const isCurrent = denuncia.estado === etapa || 
                (etapa === 'Ingresada' && denuncia.estado === 'En Revisión') ||
                (etapa === 'Notificada' && denuncia.estado === 'En Proceso');
              
              return (
                <div key={etapa} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    isCompleted 
                      ? 'bg-emerald-500 text-white' 
                      : isCurrent 
                      ? 'bg-aduana-azul text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {isCompleted ? (
                      <Icon name="Check" size={16} />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className={`text-xs mt-1 ${
                    isCompleted || isCurrent ? 'text-gray-900 font-medium' : 'text-gray-400'
                  }`}>
                    {etapa}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="h-1 bg-gray-200 rounded-full mt-2">
            <div 
              className="h-1 bg-emerald-500 rounded-full transition-all"
              style={{ 
                width: (() => {
                  const estados = ['Borrador', 'Ingresada', 'En Revisión', 'Formulada', 'Notificada', 'En Proceso', 'Cerrada'];
                  const index = estados.indexOf(denuncia.estado);
                  return `${Math.min(100, ((index + 1) / estados.length) * 100)}%`;
                })()
              }}
            />
          </div>
        </div>
      </div>

      {/* Acciones relacionadas */}
      <div className="card p-5">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
          <Icon name="Activity" size={18} />
          Acciones Disponibles
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Icon name="FileText" size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Ver XML</p>
              <p className="text-xs text-gray-500">Documento XML estructurado</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Icon name="FolderOpen" size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Ver Expediente</p>
              <p className="text-xs text-gray-500">Expediente digital completo</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Icon name="Printer" size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Imprimir Denuncia</p>
              <p className="text-xs text-gray-500">Generar PDF para impresión</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Icon name="History" size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Ver Auditoría</p>
              <p className="text-xs text-gray-500">Log de cambios completo</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DenunciaTrazabilidad;

