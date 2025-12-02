/**
 * ReclamoTimeline - Historial/Timeline del reclamo
 */

import React from 'react';
import { Icon } from 'he-button-custom-library';
import { type Reclamo } from '../../../data';

interface TimelineEvent {
  id: string;
  fecha: string;
  titulo: string;
  descripcion: string;
  tipo: 'creacion' | 'admisibilidad' | 'tramitacion' | 'audiencia' | 'fallo' | 'apelacion' | 'resolucion' | 'sistema';
  usuario?: string;
}

interface ReclamoTimelineProps {
  reclamo: Reclamo;
}

export const ReclamoTimeline: React.FC<ReclamoTimelineProps> = ({ reclamo }) => {
  // Construir eventos del timeline basados en los datos del reclamo
  const construirEventos = (): TimelineEvent[] => {
    const eventos: TimelineEvent[] = [];
    
    // Evento de creación
    eventos.push({
      id: '1',
      fecha: reclamo.fechaIngreso,
      titulo: 'Reclamo Ingresado',
      descripcion: `Se ingresó el reclamo ${reclamo.numeroReclamo} tipo ${reclamo.tipoReclamo}`,
      tipo: 'creacion',
      usuario: reclamo.usuarioCreacion,
    });
    
    // Fecha de presentación
    if (reclamo.fechaPresentacion && reclamo.fechaPresentacion !== reclamo.fechaIngreso) {
      eventos.push({
        id: '2',
        fecha: reclamo.fechaPresentacion,
        titulo: 'Reclamo Presentado',
        descripcion: 'El reclamo fue presentado formalmente',
        tipo: 'creacion',
      });
    }
    
    // Eventos TTA
    if (reclamo.datosTTA) {
      const tta = reclamo.datosTTA;
      
      if (tta.fechaPresentacionTTA) {
        eventos.push({
          id: '3',
          fecha: tta.fechaPresentacionTTA,
          titulo: 'Presentación ante TTA',
          descripcion: `Reclamo presentado ante ${tta.tribunalCompetente || 'Tribunal Tributario y Aduanero'}`,
          tipo: 'tramitacion',
        });
      }
      
      if (tta.fechaAdmisibilidad) {
        eventos.push({
          id: '4',
          fecha: tta.fechaAdmisibilidad,
          titulo: tta.admisible ? 'Reclamo Admitido' : 'Reclamo Declarado Inadmisible',
          descripcion: tta.admisible 
            ? 'El tribunal admitió el reclamo a tramitación' 
            : tta.motivoInadmisibilidad || 'El tribunal declaró inadmisible el reclamo',
          tipo: 'admisibilidad',
        });
      }
      
      if (tta.fechaContestacion) {
        eventos.push({
          id: '5',
          fecha: tta.fechaContestacion,
          titulo: 'Contestación de la Demanda',
          descripcion: 'Aduanas presentó su contestación',
          tipo: 'tramitacion',
        });
      }
      
      if (tta.fechaAudiencia) {
        eventos.push({
          id: '6',
          fecha: tta.fechaAudiencia,
          titulo: 'Audiencia Realizada',
          descripcion: 'Se llevó a cabo la audiencia ante el tribunal',
          tipo: 'audiencia',
        });
      }
      
      if (tta.fechaSentencia && tta.fallo1raInstancia) {
        eventos.push({
          id: '7',
          fecha: tta.fechaSentencia,
          titulo: `Sentencia Primera Instancia: ${tta.fallo1raInstancia}`,
          descripcion: tta.fundamentoFallo1ra || 'El tribunal emitió su fallo de primera instancia',
          tipo: 'fallo',
        });
      }
      
      if (tta.fechaApelacion && tta.tieneApelacion) {
        eventos.push({
          id: '8',
          fecha: tta.fechaApelacion,
          titulo: `Apelación Interpuesta por ${tta.quienApela || 'parte'}`,
          descripcion: 'Se interpuso recurso de apelación contra la sentencia',
          tipo: 'apelacion',
        });
      }
      
      if (tta.fechaFalloFinal && tta.falloFinal) {
        eventos.push({
          id: '9',
          fecha: tta.fechaFalloFinal,
          titulo: `Fallo Final: ${tta.falloFinal}`,
          descripcion: tta.fundamentoFalloFinal || 'Se dictó el fallo definitivo del caso',
          tipo: 'fallo',
        });
      }
    }
    
    // Resolución (para Reposición)
    if (reclamo.fechaResolucion && reclamo.tipoReclamo === 'Reposición') {
      eventos.push({
        id: '10',
        fecha: reclamo.fechaResolucion,
        titulo: `Resolución: ${reclamo.tipoResolucion || 'Emitida'}`,
        descripcion: reclamo.resolucion || 'Se emitió resolución del recurso de reposición',
        tipo: 'resolucion',
      });
    }
    
    // Ordenar por fecha
    return eventos.sort((a, b) => {
      const fechaA = parseFecha(a.fecha);
      const fechaB = parseFecha(b.fecha);
      return fechaA.getTime() - fechaB.getTime();
    });
  };
  
  const parseFecha = (fecha: string): Date => {
    const [dia, mes, anio] = fecha.split('-').map(Number);
    return new Date(anio, mes - 1, dia);
  };
  
  const getIconForTipo = (tipo: TimelineEvent['tipo']): "Plus" | "CheckCircle" | "FileText" | "Users" | "Scale" | "CornerUpRight" | "Settings" | "Circle" => {
    const iconMap: Record<string, "Plus" | "CheckCircle" | "FileText" | "Users" | "Scale" | "CornerUpRight" | "Settings" | "Circle"> = {
      creacion: 'Plus',
      admisibilidad: 'CheckCircle',
      tramitacion: 'FileText',
      audiencia: 'Users',
      fallo: 'Scale',
      apelacion: 'CornerUpRight',
      resolucion: 'CheckCircle',
      sistema: 'Settings',
    };
    return iconMap[tipo] || 'Circle';
  };
  
  const getColorForTipo = (tipo: TimelineEvent['tipo']) => {
    const colorMap: Record<string, string> = {
      creacion: 'bg-blue-100 text-blue-600 border-blue-200',
      admisibilidad: 'bg-emerald-100 text-emerald-600 border-emerald-200',
      tramitacion: 'bg-gray-100 text-gray-600 border-gray-200',
      audiencia: 'bg-purple-100 text-purple-600 border-purple-200',
      fallo: 'bg-amber-100 text-amber-600 border-amber-200',
      apelacion: 'bg-orange-100 text-orange-600 border-orange-200',
      resolucion: 'bg-teal-100 text-teal-600 border-teal-200',
      sistema: 'bg-gray-100 text-gray-500 border-gray-200',
    };
    return colorMap[tipo] || 'bg-gray-100 text-gray-600 border-gray-200';
  };
  
  const eventos = construirEventos();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Icon name="Clock" size={20} className="text-aduana-azul" />
        Historial del Reclamo
      </h3>
      
      {eventos.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <Icon name="Clock" size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No hay eventos registrados en el historial.</p>
        </div>
      ) : (
        <div className="relative">
          {/* Línea vertical */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
          
          <div className="space-y-6">
            {eventos.map((evento, index) => (
              <div key={evento.id} className="relative flex gap-4">
                {/* Ícono */}
                <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 ${getColorForTipo(evento.tipo)}`}>
                  <Icon name={getIconForTipo(evento.tipo)} size={20} />
                </div>
                
                {/* Contenido */}
                <div className={`flex-1 bg-white rounded-lg border border-gray-200 p-4 shadow-sm ${index === eventos.length - 1 ? 'ring-2 ring-aduana-azul/20' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900">{evento.titulo}</h4>
                    <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                      {evento.fecha}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{evento.descripcion}</p>
                  {evento.usuario && (
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <Icon name="User" size={12} />
                      {evento.usuario}
                    </p>
                  )}
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
            <p className="font-medium">{reclamo.fechaCreacion || reclamo.fechaIngreso}</p>
          </div>
          <div className="bg-gray-50 rounded p-3">
            <p className="text-gray-500">Usuario Creación</p>
            <p className="font-medium">{reclamo.usuarioCreacion || '-'}</p>
          </div>
          <div className="bg-gray-50 rounded p-3">
            <p className="text-gray-500">Última Modificación</p>
            <p className="font-medium">{reclamo.fechaModificacion || '-'}</p>
          </div>
          <div className="bg-gray-50 rounded p-3">
            <p className="text-gray-500">Usuario Modificación</p>
            <p className="font-medium">{reclamo.usuarioModificacion || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReclamoTimeline;

