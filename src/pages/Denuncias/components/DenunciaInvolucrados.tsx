import { useState } from 'react';
import { Icon } from "he-button-custom-library";
import { CustomButton } from "../../../components/Button/Button";
import { Badge } from "../../../components/UI";
import type { BadgeVariant } from "../../../components/UI";
import type { DenunciaInvolucrado, PermisosEstado } from '../../../data/types';

interface DenunciaInvolucradosProps {
  involucrados: DenunciaInvolucrado[];
  permisos: PermisosEstado;
  onAgregar?: () => void;
  onEditar?: (involucrado: DenunciaInvolucrado) => void;
  onEliminar?: (id: string) => void;
}

export const DenunciaInvolucrados: React.FC<DenunciaInvolucradosProps> = ({ 
  involucrados,
  permisos,
  onAgregar,
  onEditar,
  onEliminar,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getBadgeVariant = (tipo: string): BadgeVariant => {
    switch (tipo) {
      case 'Infractor Principal':
        return 'error';
      case 'Infractor Secundario':
        return 'warning';
      case 'Responsable Solidario':
        return 'info';
      case 'Agente de Aduanas':
        return 'default';
      default:
        return 'default';
    }
  };

  if (involucrados.length === 0) {
    return (
      <div className="card p-8 text-center">
        <Icon name="Users" size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">Sin involucrados</h3>
        <p className="text-gray-600 mt-2">No hay involucrados registrados en esta denuncia.</p>
        {permisos.puedeEditar && onAgregar && (
          <CustomButton 
            variant="primary" 
            className="mt-4 inline-flex items-center gap-2"
            onClick={onAgregar}
          >
            <Icon name="UserPlus" size={16} />
            Agregar Involucrado
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
          <Icon name="Users" size={18} />
          Involucrados ({involucrados.length})
        </h4>
        {permisos.puedeEditar && onAgregar && (
          <CustomButton 
            variant="primary" 
            className="flex items-center gap-2 text-sm"
            onClick={onAgregar}
          >
            <Icon name="UserPlus" size={16} />
            Agregar Involucrado
          </CustomButton>
        )}
      </div>

      {/* Lista de involucrados */}
      <div className="space-y-3">
        {involucrados.map((involucrado) => (
          <div 
            key={involucrado.id}
            className={`card overflow-hidden ${involucrado.esPrincipal ? 'border-l-4 border-l-red-500' : ''}`}
          >
            {/* Header del involucrado */}
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
              onClick={() => setExpandedId(expandedId === involucrado.id ? null : involucrado.id)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  involucrado.esPrincipal ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  <Icon name="User" size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{involucrado.nombre}</span>
                    <Badge variant={getBadgeVariant(involucrado.tipoInvolucrado)} size="sm">
                      {involucrado.tipoInvolucrado}
                    </Badge>
                    {involucrado.esPrincipal && (
                      <Badge variant="error" size="sm">Principal</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{involucrado.rut}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">#{involucrado.orden}</span>
                <Icon 
                  name={expandedId === involucrado.id ? "ChevronUp" : "ChevronDown"} 
                  size={20} 
                  className="text-gray-400"
                />
              </div>
            </div>

            {/* Detalles expandibles */}
            {expandedId === involucrado.id && (
              <div className="px-4 pb-4 border-t border-gray-200 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div>
                    <p className="text-sm text-gray-500">RUT</p>
                    <p className="font-medium">{involucrado.rut}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tipo</p>
                    <p className="font-medium">{involucrado.tipoInvolucrado}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Dirección</p>
                    <p className="font-medium text-sm">{involucrado.direccion || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Teléfono</p>
                    <p className="font-medium">{involucrado.telefono || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-sm">
                      {involucrado.email ? (
                        <a href={`mailto:${involucrado.email}`} className="text-aduana-azul hover:underline">
                          {involucrado.email}
                        </a>
                      ) : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Representante Legal</p>
                    <p className="font-medium">{involucrado.representanteLegal || '-'}</p>
                  </div>
                </div>

                {/* Acciones */}
                {permisos.puedeEditar && (
                  <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200">
                    {onEditar && (
                      <CustomButton 
                        variant="secondary" 
                        className="flex items-center gap-1 text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditar(involucrado);
                        }}
                      >
                        <Icon name="Edit" size={14} />
                        Editar
                      </CustomButton>
                    )}
                    {onEliminar && !involucrado.esPrincipal && (
                      <CustomButton 
                        variant="secondary" 
                        className="flex items-center gap-1 text-sm text-red-600 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEliminar(involucrado.id);
                        }}
                      >
                        <Icon name="Trash2" size={14} />
                        Eliminar
                      </CustomButton>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Resumen */}
      <div className="card p-4 bg-gray-50">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-600">
              Infractores Principales: {involucrados.filter(i => i.esPrincipal).length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-gray-600">
              Infractores Secundarios: {involucrados.filter(i => i.tipoInvolucrado === 'Infractor Secundario').length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span className="text-gray-600">
              Otros: {involucrados.filter(i => !i.esPrincipal && i.tipoInvolucrado !== 'Infractor Secundario').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DenunciaInvolucrados;

