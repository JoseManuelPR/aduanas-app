/**
 * MercanciaSeguimiento - Timeline de eventos de la mercancía
 */

import React from 'react';
import { Icon } from 'he-button-custom-library';
import { Badge } from '../../../components/UI';
import { type Mercancia, type TipoEventoMercancia } from '../../../data';

interface MercanciaSeguimientoProps {
  mercancia: Mercancia;
  onRegistrarEvento?: () => void;
}

export const MercanciaSeguimiento: React.FC<MercanciaSeguimientoProps> = ({ 
  mercancia,
  onRegistrarEvento 
}) => {
  const seguimientos = mercancia.seguimientos || [];

  const getIconForEvento = (tipo: TipoEventoMercancia): "Plus" | "Lock" | "AlertTriangle" | "Ban" | "RotateCcw" | "Trash2" | "Gavel" | "Gift" | "Truck" | "ClipboardList" | "Scale" | "RefreshCw" | "MessageSquare" | "Circle" => {
    const iconMap: Record<TipoEventoMercancia, "Plus" | "Lock" | "AlertTriangle" | "Ban" | "RotateCcw" | "Trash2" | "Gavel" | "Gift" | "Truck" | "ClipboardList" | "Scale" | "RefreshCw" | "MessageSquare" | "Circle"> = {
      'Ingreso': 'Plus',
      'Retención': 'Lock',
      'Incautación': 'AlertTriangle',
      'Comiso': 'Ban',
      'Devolución': 'RotateCcw',
      'Destrucción': 'Trash2',
      'Subasta': 'Gavel',
      'Donación': 'Gift',
      'Entrega RAP': 'Truck',
      'Traslado': 'Truck',
      'Inventario': 'ClipboardList',
      'Resolución Judicial': 'Scale',
      'Cambio Estado': 'RefreshCw',
      'Observación': 'MessageSquare',
    };
    return iconMap[tipo] || 'Circle';
  };

  const getColorForEvento = (tipo: TipoEventoMercancia) => {
    const colorMap: Record<TipoEventoMercancia, string> = {
      'Ingreso': 'bg-blue-100 text-blue-600 border-blue-200',
      'Retención': 'bg-amber-100 text-amber-600 border-amber-200',
      'Incautación': 'bg-red-100 text-red-600 border-red-200',
      'Comiso': 'bg-red-100 text-red-600 border-red-200',
      'Devolución': 'bg-emerald-100 text-emerald-600 border-emerald-200',
      'Destrucción': 'bg-gray-100 text-gray-600 border-gray-200',
      'Subasta': 'bg-purple-100 text-purple-600 border-purple-200',
      'Donación': 'bg-teal-100 text-teal-600 border-teal-200',
      'Entrega RAP': 'bg-emerald-100 text-emerald-600 border-emerald-200',
      'Traslado': 'bg-indigo-100 text-indigo-600 border-indigo-200',
      'Inventario': 'bg-sky-100 text-sky-600 border-sky-200',
      'Resolución Judicial': 'bg-orange-100 text-orange-600 border-orange-200',
      'Cambio Estado': 'bg-gray-100 text-gray-600 border-gray-200',
      'Observación': 'bg-gray-100 text-gray-500 border-gray-200',
    };
    return colorMap[tipo] || 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const getBadgeVariant = (tipo: TipoEventoMercancia): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
    const variantMap: Record<TipoEventoMercancia, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
      'Ingreso': 'info',
      'Retención': 'warning',
      'Incautación': 'danger',
      'Comiso': 'danger',
      'Devolución': 'success',
      'Destrucción': 'default',
      'Subasta': 'info',
      'Donación': 'success',
      'Entrega RAP': 'success',
      'Traslado': 'info',
      'Inventario': 'info',
      'Resolución Judicial': 'warning',
      'Cambio Estado': 'default',
      'Observación': 'default',
    };
    return variantMap[tipo] || 'default';
  };

  // Ordenar seguimientos por fecha (más reciente primero)
  const seguimientosOrdenados = [...seguimientos].sort((a, b) => {
    const fechaA = parseFecha(a.fechaEvento);
    const fechaB = parseFecha(b.fechaEvento);
    return fechaB.getTime() - fechaA.getTime();
  });

  const parseFecha = (fecha: string): Date => {
    const [dia, mes, anio] = fecha.split('-').map(Number);
    return new Date(anio, mes - 1, dia);
  };

  return (
    <div className="space-y-6">
      {/* Header con botón de acción */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Icon name="Clock" size={20} className="text-aduana-azul" />
          Historial de Eventos
        </h3>
        {onRegistrarEvento && (
          <button
            onClick={onRegistrarEvento}
            className="px-4 py-2 bg-aduana-azul text-white rounded-lg hover:bg-aduana-azul-dark flex items-center gap-2 text-sm"
          >
            <Icon name="Plus" size={16} />
            Registrar Evento
          </button>
        )}
      </div>

      {seguimientos.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <Icon name="Clock" size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No hay eventos registrados para esta mercancía.</p>
        </div>
      ) : (
        <div className="relative">
          {/* Línea vertical */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
          
          <div className="space-y-6">
            {seguimientosOrdenados.map((evento, index) => (
              <div key={evento.id} className="relative flex gap-4">
                {/* Ícono */}
                <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 ${getColorForEvento(evento.tipoEvento)}`}>
                  <Icon name={getIconForEvento(evento.tipoEvento)} size={20} />
                </div>
                
                {/* Contenido */}
                <div className={`flex-1 bg-white rounded-lg border border-gray-200 p-4 shadow-sm ${index === 0 ? 'ring-2 ring-aduana-azul/20' : ''}`}>
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={getBadgeVariant(evento.tipoEvento)}>
                        {evento.tipoEvento}
                      </Badge>
                      {index === 0 && (
                        <span className="text-xs bg-aduana-azul text-white px-2 py-0.5 rounded">
                          Último
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      {evento.fechaEvento}
                    </span>
                  </div>
                  
                  {/* Detalles del evento */}
                  <div className="space-y-2">
                    {evento.autoridad && (
                      <p className="text-sm">
                        <span className="text-gray-500">Autoridad: </span>
                        <span className="font-medium">{evento.autoridad}</span>
                      </p>
                    )}
                    
                    {evento.nroResolucion && (
                      <p className="text-sm">
                        <span className="text-gray-500">N° Resolución: </span>
                        <span className="font-mono font-medium text-aduana-azul">{evento.nroResolucion}</span>
                        {evento.fechaResolucion && (
                          <span className="text-gray-400 ml-2">({evento.fechaResolucion})</span>
                        )}
                      </p>
                    )}
                    
                    {(evento.ubicacionAnterior || evento.ubicacionNueva) && (
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="MapPin" size={14} className="text-gray-400" />
                        {evento.ubicacionAnterior && (
                          <>
                            <span className="text-gray-500">{evento.ubicacionAnterior}</span>
                            <Icon name="ArrowRight" size={14} className="text-gray-400" />
                          </>
                        )}
                        {evento.ubicacionNueva && (
                          <span className="font-medium">{evento.ubicacionNueva}</span>
                        )}
                      </div>
                    )}
                    
                    {evento.observaciones && (
                      <p className="text-sm text-gray-600 bg-gray-50 rounded p-2 mt-2">
                        {evento.observaciones}
                      </p>
                    )}
                    
                    {evento.documentosAdjuntos && evento.documentosAdjuntos.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {evento.documentosAdjuntos.map((doc, idx) => (
                          <span 
                            key={idx}
                            className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded cursor-pointer hover:bg-gray-200"
                          >
                            <Icon name="FileText" size={12} />
                            {doc}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Icon name="User" size={12} />
                      {evento.funcionarioResponsable}
                    </span>
                    <span>
                      Registrado: {evento.fechaRegistro}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Información de auditoría */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
          <Icon name="Info" size={16} />
          Información de Auditoría
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="bg-gray-50 rounded p-3">
            <p className="text-gray-500">Fecha Creación</p>
            <p className="font-medium">{mercancia.fechaCreacion}</p>
          </div>
          <div className="bg-gray-50 rounded p-3">
            <p className="text-gray-500">Usuario Creación</p>
            <p className="font-medium">{mercancia.usuarioCreacion}</p>
          </div>
          <div className="bg-gray-50 rounded p-3">
            <p className="text-gray-500">Última Modificación</p>
            <p className="font-medium">{mercancia.fechaModificacion || '-'}</p>
          </div>
          <div className="bg-gray-50 rounded p-3">
            <p className="text-gray-500">Usuario Modificación</p>
            <p className="font-medium">{mercancia.usuarioModificacion || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MercanciaSeguimiento;

