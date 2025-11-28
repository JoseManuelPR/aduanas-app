/**
 * CargoTimeline - Historial de eventos del cargo
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import React from 'react';
import { Icon } from 'he-button-custom-library';
import { Badge } from '../../../components/UI';
import { type Cargo, type TimelineItem } from '../../../data';

interface CargoTimelineProps {
  cargo: Cargo;
}

export const CargoTimeline: React.FC<CargoTimelineProps> = ({
  cargo,
}) => {
  // Generar timeline completo con datos del cargo
  const timelineCompleto: TimelineItem[] = [
    {
      id: 'create',
      title: 'Cargo Creado',
      date: cargo.fechaCreacion || cargo.fechaIngreso,
      status: 'completed',
      description: `Cargo ${cargo.numeroCargo} creado en el sistema`,
      user: cargo.usuarioCreacion,
    },
    ...(cargo.origen === 'DENUNCIA' && cargo.denunciaNumero ? [{
      id: 'denuncia',
      title: 'Vinculado a Denuncia',
      date: cargo.fechaIngreso,
      status: 'completed' as const,
      description: `Asociado a denuncia N° ${cargo.denunciaNumero}`,
    }] : []),
    ...(cargo.cuentas && cargo.cuentas.length > 0 ? [{
      id: 'cuentas',
      title: 'Cuentas Registradas',
      date: cargo.fechaIngreso,
      status: 'completed' as const,
      description: `${cargo.cuentas.length} cuenta(s) de cargo registrada(s)`,
    }] : []),
    ...(cargo.estado === 'Observado' ? [{
      id: 'observado',
      title: 'Cargo Observado',
      date: cargo.fechaModificacion || '',
      status: 'current' as const,
      description: cargo.observaciones || 'Observaciones pendientes de resolver',
    }] : []),
    ...(cargo.fechaEmision ? [{
      id: 'emision',
      title: 'Cargo Emitido',
      date: cargo.fechaEmision,
      status: 'completed' as const,
      description: 'Cargo emitido para aprobación',
      user: cargo.loginFuncionario,
    }] : []),
    ...(cargo.estado === 'Pendiente Aprobación' || cargo.estado === 'En Revisión' ? [{
      id: 'revision',
      title: cargo.estado === 'Pendiente Aprobación' ? 'Pendiente Aprobación' : 'En Revisión',
      date: cargo.fechaModificacion || cargo.fechaEmision || '',
      status: 'current' as const,
      description: 'Cargo en espera de revisión y aprobación',
    }] : []),
    ...(cargo.estado === 'Aprobado' || cargo.estado === 'Emitido' || cargo.estado === 'Notificado' || cargo.estado === 'Cerrado' ? [{
      id: 'aprobado',
      title: 'Cargo Aprobado',
      date: cargo.fechaModificacion || '',
      status: 'completed' as const,
      description: 'Cargo aprobado por jefatura',
    }] : []),
    ...(cargo.fechaNotificacion ? [{
      id: 'notificacion',
      title: 'Cargo Notificado',
      date: cargo.fechaNotificacion,
      status: 'completed' as const,
      description: `Notificación enviada a ${cargo.nombreDeudor}`,
    }] : []),
    ...(cargo.girosGenerados && cargo.girosGenerados.length > 0 ? [{
      id: 'giros',
      title: 'Giros Generados',
      date: cargo.fechaModificacion || '',
      status: 'completed' as const,
      description: `${cargo.girosGenerados.length} giro(s) generado(s)`,
    }] : []),
    ...(cargo.estado === 'Cerrado' ? [{
      id: 'cerrado',
      title: 'Cargo Cerrado',
      date: cargo.fechaModificacion || '',
      status: 'completed' as const,
      description: 'Proceso de cargo finalizado',
    }] : []),
    ...(cargo.estado === 'Anulado' ? [{
      id: 'anulado',
      title: 'Cargo Anulado',
      date: cargo.fechaModificacion || '',
      status: 'completed' as const,
      description: 'Cargo anulado',
    }] : []),
    ...(cargo.estado === 'Rechazado' ? [{
      id: 'rechazado',
      title: 'Cargo Rechazado',
      date: cargo.fechaModificacion || '',
      status: 'completed' as const,
      description: 'Cargo rechazado en revisión',
    }] : []),
  ];
  
  // Estados esperados que aún no ocurren
  const estadosEsperados = [];
  if (!cargo.fechaEmision && cargo.estado === 'Borrador') {
    estadosEsperados.push({
      id: 'pending-emision',
      title: 'Pendiente Emisión',
      date: '',
      status: 'pending' as const,
      description: 'El cargo debe ser emitido',
    });
  }
  if (!cargo.fechaNotificacion && ['Emitido', 'Aprobado'].includes(cargo.estado)) {
    estadosEsperados.push({
      id: 'pending-notificacion',
      title: 'Pendiente Notificación',
      date: '',
      status: 'pending' as const,
      description: 'El cargo debe ser notificado al deudor',
    });
  }
  if (cargo.estado !== 'Cerrado' && cargo.estado !== 'Anulado' && cargo.estado !== 'Rechazado') {
    estadosEsperados.push({
      id: 'pending-cierre',
      title: 'Pendiente Cierre',
      date: '',
      status: 'pending' as const,
      description: 'Proceso pendiente de finalizar',
    });
  }
  
  const timelineFinal = [...timelineCompleto, ...estadosEsperados];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Historial del Cargo</h3>
          <p className="text-sm text-gray-500">
            Trazabilidad de eventos y cambios de estado
          </p>
        </div>
        <Badge variant={
          cargo.estado === 'Cerrado' ? 'success' :
          cargo.estado === 'Anulado' || cargo.estado === 'Rechazado' ? 'error' :
          'warning'
        }>
          {cargo.estado}
        </Badge>
      </div>
      
      {/* Timeline visual */}
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        <div className="space-y-6">
          {timelineFinal.map((item, index) => (
            <div key={item.id} className="relative flex gap-4">
              {/* Indicador */}
              <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                item.status === 'completed' 
                  ? 'bg-emerald-100 border-emerald-500' 
                  : item.status === 'current'
                    ? 'bg-blue-100 border-blue-500 animate-pulse'
                    : 'bg-gray-100 border-gray-300'
              }`}>
                <Icon 
                  name={
                    item.status === 'completed' ? 'Check' :
                    item.status === 'current' ? 'Clock' :
                    'Circle'
                  } 
                  size={16} 
                  className={
                    item.status === 'completed' ? 'text-emerald-600' :
                    item.status === 'current' ? 'text-blue-600' :
                    'text-gray-400'
                  }
                />
              </div>
              
              {/* Contenido */}
              <div className={`flex-1 pb-6 ${index === timelineFinal.length - 1 ? 'pb-0' : ''}`}>
                <div className={`rounded-lg p-4 ${
                  item.status === 'completed' 
                    ? 'bg-emerald-50 border border-emerald-200' 
                    : item.status === 'current'
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-gray-50 border border-gray-200'
                }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`font-semibold ${
                        item.status === 'completed' ? 'text-emerald-800' :
                        item.status === 'current' ? 'text-blue-800' :
                        'text-gray-600'
                      }`}>
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.description}
                      </p>
                    </div>
                    {item.date && (
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                        {item.date}
                      </span>
                    )}
                  </div>
                  {item.user && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                      <Icon name="User" size={12} />
                      <span>{item.user}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Información de auditoría */}
      <div className="bg-gray-50 rounded-lg p-4 mt-6">
        <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
          <Icon name="Info" size={16} />
          Información de Auditoría
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Creado por</p>
            <p className="font-medium">{cargo.usuarioCreacion || '-'}</p>
          </div>
          <div>
            <p className="text-gray-500">Fecha Creación</p>
            <p className="font-medium">{cargo.fechaCreacion || cargo.fechaIngreso}</p>
          </div>
          <div>
            <p className="text-gray-500">Última Modificación</p>
            <p className="font-medium">{cargo.fechaModificacion || '-'}</p>
          </div>
          <div>
            <p className="text-gray-500">Modificado por</p>
            <p className="font-medium">{cargo.usuarioModificacion || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CargoTimeline;

