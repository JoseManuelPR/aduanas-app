/**
 * ModalRegistrarEvento - Modal para registrar evento de seguimiento de mercancía
 */

import React, { useState, ChangeEvent } from 'react';
import { Icon } from 'he-button-custom-library';
import { 
  type Mercancia, 
  type TipoEventoMercancia,
  getPermisosMercancia,
  puedeRegistrarEvento,
} from '../../../data';

interface ModalRegistrarEventoProps {
  mercancia: Mercancia;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (evento: {
    tipoEvento: TipoEventoMercancia;
    fechaEvento: string;
    autoridad?: string;
    nroResolucion?: string;
    fechaResolucion?: string;
    ubicacionNueva?: string;
    observaciones?: string;
    funcionarioResponsable: string;
  }) => void;
}

export const ModalRegistrarEvento: React.FC<ModalRegistrarEventoProps> = ({
  mercancia,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const permisos = getPermisosMercancia(mercancia);
  
  const [tipoEvento, setTipoEvento] = useState<TipoEventoMercancia | ''>('');
  const [fechaEvento, setFechaEvento] = useState('');
  const [autoridad, setAutoridad] = useState('');
  const [nroResolucion, setNroResolucion] = useState('');
  const [fechaResolucion, setFechaResolucion] = useState('');
  const [ubicacionNueva, setUbicacionNueva] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [funcionario, setFuncionario] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  
  if (!isOpen) return null;
  
  const handleSubmit = () => {
    const newErrors: string[] = [];
    
    if (!tipoEvento) {
      newErrors.push('Debe seleccionar el tipo de evento.');
    }
    
    if (!fechaEvento) {
      newErrors.push('Debe indicar la fecha del evento.');
    } else {
      // Validar que la fecha no sea futura
      const fechaEventoDate = new Date(fechaEvento);
      const hoy = new Date();
      hoy.setHours(23, 59, 59, 999);
      if (fechaEventoDate > hoy) {
        newErrors.push('La fecha del evento no puede ser futura.');
      }
    }
    
    if (!funcionario.trim()) {
      newErrors.push('Debe indicar el funcionario responsable.');
    }
    
    // Validar según tipo de evento
    if (tipoEvento) {
      const validacion = puedeRegistrarEvento(mercancia, tipoEvento);
      if (!validacion.valido) {
        newErrors.push(...validacion.errores);
      }
    }
    
    // Algunos eventos requieren resolución
    const eventosConResolucion: TipoEventoMercancia[] = [
      'Comiso', 'Devolución', 'Destrucción', 'Subasta', 'Donación', 'Entrega RAP'
    ];
    if (tipoEvento && eventosConResolucion.includes(tipoEvento) && !nroResolucion) {
      newErrors.push('Este tipo de evento requiere número de resolución.');
    }
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Formatear fecha al formato DD-MM-YYYY
    const [year, month, day] = fechaEvento.split('-');
    const fechaFormateada = `${day}-${month}-${year}`;
    
    let fechaResFormateada: string | undefined;
    if (fechaResolucion) {
      const [yR, mR, dR] = fechaResolucion.split('-');
      fechaResFormateada = `${dR}-${mR}-${yR}`;
    }
    
    onConfirm({
      tipoEvento: tipoEvento as TipoEventoMercancia,
      fechaEvento: fechaFormateada,
      autoridad: autoridad || undefined,
      nroResolucion: nroResolucion || undefined,
      fechaResolucion: fechaResFormateada,
      ubicacionNueva: ubicacionNueva || undefined,
      observaciones: observaciones || undefined,
      funcionarioResponsable: funcionario,
    });
    
    handleClose();
  };
  
  const handleClose = () => {
    setTipoEvento('');
    setFechaEvento('');
    setAutoridad('');
    setNroResolucion('');
    setFechaResolucion('');
    setUbicacionNueva('');
    setObservaciones('');
    setFuncionario('');
    setErrors([]);
    onClose();
  };

  const getEventoIcon = (tipo: TipoEventoMercancia): string => {
    const iconMap: Record<TipoEventoMercancia, string> = {
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

  // Eventos que requieren datos adicionales
  const requiereResolucion = tipoEvento && ['Comiso', 'Devolución', 'Destrucción', 'Subasta', 'Donación', 'Entrega RAP', 'Resolución Judicial'].includes(tipoEvento);
  const requiereUbicacion = tipoEvento && ['Ingreso', 'Traslado'].includes(tipoEvento);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-aduana-azul px-6 py-4 flex items-center justify-between flex-shrink-0">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Icon name="Plus" size={24} />
            Registrar Evento de Seguimiento
          </h2>
          <button onClick={handleClose} className="text-white/80 hover:text-white">
            <Icon name="X" size={24} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Info de la mercancía */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Mercancía</p>
                <p className="font-semibold text-aduana-azul">{mercancia.codigoMercancia || mercancia.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Estado Actual</p>
                <p className="font-semibold">{mercancia.estado}</p>
              </div>
            </div>
          </div>
          
          {/* Errores */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Icon name="AlertCircle" size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <ul className="text-sm text-red-700 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {/* Tipo de Evento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Evento *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {permisos.eventosDisponibles.map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => setTipoEvento(tipo)}
                  className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 text-sm ${
                    tipoEvento === tipo 
                      ? 'border-aduana-azul bg-aduana-azul-50 text-aduana-azul' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon 
                    name={getEventoIcon(tipo) as "Plus" | "Lock" | "AlertTriangle" | "Ban" | "RotateCcw" | "Trash2" | "Scale" | "Gift" | "Truck" | "ClipboardList" | "RefreshCw" | "MessageSquare" | "Circle"} 
                    size={18} 
                  />
                  {tipo}
                </button>
              ))}
            </div>
            {permisos.eventosDisponibles.length === 0 && (
              <p className="text-sm text-red-500 mt-2">
                No hay eventos disponibles para el estado actual de la mercancía.
              </p>
            )}
          </div>
          
          {/* Fecha del Evento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha del Evento *
              </label>
              <input
                type="date"
                value={fechaEvento}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFechaEvento(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Funcionario Responsable *
              </label>
              <input
                type="text"
                value={funcionario}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFuncionario(e.target.value)}
                placeholder="Nombre del funcionario"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Autoridad (siempre visible) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Autoridad
            </label>
            <input
              type="text"
              value={autoridad}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setAutoridad(e.target.value)}
              placeholder="Ej: Director Regional de Aduanas"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
            />
          </div>
          
          {/* Resolución (condicional) */}
          {requiereResolucion && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  N° Resolución *
                </label>
                <input
                  type="text"
                  value={nroResolucion}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNroResolucion(e.target.value)}
                  placeholder="RES-XXX-2024-XXXXX"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Resolución
                </label>
                <input
                  type="date"
                  value={fechaResolucion}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFechaResolucion(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                />
              </div>
            </div>
          )}
          
          {/* Ubicación (condicional) */}
          {requiereUbicacion && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nueva Ubicación
              </label>
              <input
                type="text"
                value={ubicacionNueva}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setUbicacionNueva(e.target.value)}
                placeholder="Ej: Bodega Fiscal Valparaíso - Sector A"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
              />
            </div>
          )}
          
          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones
            </label>
            <textarea
              value={observaciones}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setObservaciones(e.target.value)}
              placeholder="Descripción del evento, detalles adicionales..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent resize-none"
              rows={4}
            />
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 flex-shrink-0 border-t">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!tipoEvento || permisos.eventosDisponibles.length === 0}
            className="px-6 py-2 bg-aduana-azul text-white rounded-lg hover:bg-aduana-azul-dark disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
          >
            <Icon name="Check" size={18} />
            Registrar Evento
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalRegistrarEvento;

