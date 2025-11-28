/**
 * CargoInfractores - Gestión de infractores del cargo
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import React, { useState } from 'react';
import { Icon } from 'he-button-custom-library';
import { CustomButton } from '../../../components/Button/Button';
import { Badge } from '../../../components/UI';
import { type CargoInfractor } from '../../../data';

interface CargoInfractoresProps {
  infractores: CargoInfractor[];
  puedeEditar: boolean;
  onAgregar?: () => void;
  onEditar?: (infractor: CargoInfractor) => void;
  onEliminar?: (id: string) => void;
}

export const CargoInfractores: React.FC<CargoInfractoresProps> = ({
  infractores,
  puedeEditar,
  onAgregar,
  onEditar,
  onEliminar,
}) => {
  const [infractorExpandido, setInfractorExpandido] = useState<string | null>(null);
  
  // Obtener color del badge según tipo
  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Infractor Principal': return 'error';
      case 'Infractor Secundario': return 'warning';
      case 'Responsable Solidario': return 'info';
      case 'Agente de Aduanas': return 'default';
      default: return 'default';
    }
  };
  
  // Calcular total de responsabilidad
  const totalResponsabilidad = infractores.reduce(
    (sum, inf) => sum + (inf.porcentajeResponsabilidad || 0), 
    0
  );
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Infractores</h3>
          <p className="text-sm text-gray-500">
            {infractores.length} infractor{infractores.length !== 1 ? 'es' : ''} registrado{infractores.length !== 1 ? 's' : ''}
          </p>
        </div>
        {puedeEditar && (
          <CustomButton variant="primary" onClick={onAgregar}>
            <Icon name="UserPlus" size={16} />
            Agregar Infractor
          </CustomButton>
        )}
      </div>
      
      {/* Validación de responsabilidad */}
      {infractores.length > 0 && totalResponsabilidad !== 100 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Icon name="AlertTriangle" size={20} className="text-amber-500 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">
                La suma de responsabilidades es {totalResponsabilidad}%
              </p>
              <p className="text-sm text-amber-700">
                El total de porcentajes de responsabilidad debe sumar 100%
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Lista de infractores */}
      {infractores.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Icon name="Users" size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 mb-4">No hay infractores registrados</p>
          <p className="text-sm text-amber-600 bg-amber-50 inline-block px-4 py-2 rounded-lg">
            <Icon name="AlertTriangle" size={16} className="inline mr-1" />
            Debe registrar al menos un infractor
          </p>
          {puedeEditar && (
            <div className="mt-4">
              <CustomButton variant="primary" onClick={onAgregar}>
                <Icon name="UserPlus" size={16} />
                Agregar infractor
              </CustomButton>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {infractores.map((infractor) => (
            <div 
              key={infractor.id}
              className={`border rounded-lg transition-all ${
                infractor.esPrincipal 
                  ? 'border-red-200 bg-red-50/30' 
                  : 'border-gray-200 bg-white'
              }`}
            >
              {/* Header del card */}
              <div 
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => setInfractorExpandido(
                  infractorExpandido === infractor.id ? null : infractor.id
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${
                    infractor.esPrincipal ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    <Icon 
                      name={infractor.esPrincipal ? 'UserX' : 'User'} 
                      size={24} 
                      className={infractor.esPrincipal ? 'text-red-600' : 'text-gray-600'} 
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">{infractor.nombre}</p>
                      {infractor.esPrincipal && (
                        <Badge variant="error">Principal</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">RUT: {infractor.rut}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <Badge variant={getTipoColor(infractor.tipoInfractor) as any}>
                      {infractor.tipoInfractor}
                    </Badge>
                    {infractor.porcentajeResponsabilidad !== undefined && (
                      <p className="text-sm text-gray-500 mt-1">
                        {infractor.porcentajeResponsabilidad}% responsabilidad
                      </p>
                    )}
                  </div>
                  <Icon 
                    name={infractorExpandido === infractor.id ? 'ChevronUp' : 'ChevronDown'} 
                    size={20} 
                    className="text-gray-400"
                  />
                </div>
              </div>
              
              {/* Detalle expandido */}
              {infractorExpandido === infractor.id && (
                <div className="border-t border-gray-200 p-4 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Dirección</p>
                      <p className="font-medium">{infractor.direccion || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{infractor.email || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Teléfono</p>
                      <p className="font-medium">{infractor.telefono || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Monto Asignado</p>
                      <p className="font-medium">
                        {infractor.montoAsignado 
                          ? `$${infractor.montoAsignado.toLocaleString('es-CL')}`
                          : '-'}
                      </p>
                    </div>
                  </div>
                  
                  {puedeEditar && (
                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                      <CustomButton 
                        variant="secondary" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditar?.(infractor);
                        }}
                      >
                        <Icon name="Edit" size={16} />
                        Editar
                      </CustomButton>
                      <CustomButton 
                        variant="secondary" 
                        className="text-red-600 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('¿Está seguro de eliminar este infractor?')) {
                            onEliminar?.(infractor.id);
                          }
                        }}
                      >
                        <Icon name="Trash2" size={16} />
                        Eliminar
                      </CustomButton>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Resumen de responsabilidad */}
      {infractores.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Total responsabilidad asignada:</span>
            <span className={`text-lg font-bold ${
              totalResponsabilidad === 100 ? 'text-emerald-600' : 'text-amber-600'
            }`}>
              {totalResponsabilidad}%
              {totalResponsabilidad === 100 && (
                <Icon name="CheckCircle" size={20} className="inline ml-2" />
              )}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all ${
                totalResponsabilidad === 100 ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(totalResponsabilidad, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CargoInfractores;

