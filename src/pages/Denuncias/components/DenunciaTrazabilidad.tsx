import { useState, useMemo } from 'react';
import { Icon } from "he-button-custom-library";
import { useNavigate } from 'react-router-dom';
import { Badge, CollapsibleSection } from "../../../components/UI";
import type { Denuncia, TimelineItem } from '../../../data/types';

interface DenunciaTrazabilidadProps {
  timeline: TimelineItem[];
  denuncia: Denuncia;
}

// Configuración de etapas del workflow
const WORKFLOW_ETAPAS = [
  { 
    id: 'borrador', 
    label: 'Borrador', 
    shortLabel: 'Borrador',
    description: 'Denuncia en preparación, pendiente de ingreso formal',
    responsable: 'Funcionario Fiscalizador',
    accionPrincipal: 'Ingresar denuncia'
  },
  { 
    id: 'ingresada', 
    label: 'Ingresada', 
    shortLabel: 'Ingresada',
    description: 'Denuncia ingresada al sistema, en proceso de revisión',
    responsable: 'Jefe de Sección',
    accionPrincipal: 'Revisar documentos'
  },
  { 
    id: 'formulada', 
    label: 'Formulada', 
    shortLabel: 'Formulada',
    description: 'Denuncia formulada formalmente con tipificación completa',
    responsable: 'Funcionario Fiscalizador',
    accionPrincipal: 'Generar cargo'
  },
  { 
    id: 'notificada', 
    label: 'Notificada', 
    shortLabel: 'Notificada',
    description: 'Denunciado notificado, en espera de respuesta o plazo',
    responsable: 'Sistema de Notificaciones',
    accionPrincipal: 'Registrar respuesta'
  },
  { 
    id: 'cerrada', 
    label: 'Cerrada', 
    shortLabel: 'Cerrada',
    description: 'Proceso de denuncia finalizado',
    responsable: 'Sistema',
    accionPrincipal: null
  }
];

// Mapeo de estados a índices de etapa
const ESTADO_A_ETAPA: Record<string, number> = {
  'Borrador': 0,
  'Ingresada': 1,
  'En Revisión': 1,
  'Formulada': 2,
  'Notificada': 3,
  'En Proceso': 3,
  'Observada': 1,
  'Allanada': 3,
  'Reclamada': 3,
  'Cerrada': 4,
  'Archivada': 4,
};

// Etiquetas cortas para timeline
const TIMELINE_LABELS: Record<string, { icon: string; label: string }> = {
  'Denuncia Creada': { icon: 'FilePlus', label: '✔ Creado' },
  'Denuncia Ingresada': { icon: 'FileInput', label: '✔ Ingresado' },
  'Denuncia Formulada': { icon: 'FileCheck', label: '✔ Formulado' },
  'Denuncia Notificada': { icon: 'Bell', label: '✔ Notificado' },
  'Denuncia Observada': { icon: 'AlertTriangle', label: '⚠ Observado' },
  'Cargo Generado': { icon: 'Receipt', label: '✔ Cargo generado' },
  'Reclamo Ingresado': { icon: 'FileWarning', label: '⚠ Reclamo' },
  'Denuncia Cerrada': { icon: 'CheckCircle2', label: '✔ Cerrado' },
  'Pendiente de Cierre': { icon: 'Clock', label: '⏳ Pendiente' },
};

export const DenunciaTrazabilidad: React.FC<DenunciaTrazabilidadProps> = ({ 
  timeline,
  denuncia,
}) => {
  const navigate = useNavigate();
  const [hoveredEtapa, setHoveredEtapa] = useState<number | null>(null);

  // Calcular índice de etapa actual
  const etapaActualIndex = useMemo(() => {
    return ESTADO_A_ETAPA[denuncia.estado] ?? 0;
  }, [denuncia.estado]);

  // Obtener siguiente etapa
  const siguienteEtapa = useMemo(() => {
    if (etapaActualIndex < WORKFLOW_ETAPAS.length - 1) {
      return WORKFLOW_ETAPAS[etapaActualIndex + 1];
    }
    return null;
  }, [etapaActualIndex]);

  // Ordenar timeline: más reciente primero
  const timelineOrdenado = useMemo(() => {
    return [...timeline].reverse();
  }, [timeline]);

  // Obtener acción contextual basada en etapa
  const getAccionContextual = (): { label: string; icon: string; variant: string } => {
    switch (denuncia.estado) {
      case 'Borrador':
        return { label: 'Ingresar Denuncia', icon: 'FileInput', variant: 'primary' };
      case 'Ingresada':
      case 'En Revisión':
        return { label: 'Revisar Documentos', icon: 'FileSearch', variant: 'primary' };
      case 'Formulada':
        return { label: 'Generar Cargo', icon: 'FilePlus', variant: 'success' };
      case 'Notificada':
      case 'En Proceso':
        return { label: 'Registrar Respuesta', icon: 'MessageSquare', variant: 'primary' };
      case 'Observada':
        return { label: 'Corregir Observaciones', icon: 'Edit', variant: 'warning' };
      case 'Cerrada':
      case 'Archivada':
        return { label: 'Ver Resumen Final', icon: 'FileText', variant: 'neutral' };
      default:
        return { label: 'Actualizar Flujo', icon: 'RefreshCw', variant: 'primary' };
    }
  };

  const accionContextual = getAccionContextual();

  // Determinar si hay tareas pendientes
  const tareasPendientes = useMemo(() => {
    const tareas: { tipo: 'warning' | 'info' | 'error'; texto: string }[] = [];
    if (denuncia.observada) {
      tareas.push({ tipo: 'warning', texto: 'Corregir observaciones reportadas' });
    }
    if (denuncia.estado === 'Notificada' || denuncia.estado === 'En Proceso') {
      tareas.push({ tipo: 'info', texto: 'Verificar respuesta del notificado' });
    }
    if (denuncia.diasVencimiento <= 5 && denuncia.diasVencimiento > 0) {
      tareas.push({ tipo: 'warning', texto: `Atender antes del vencimiento (${denuncia.diasVencimiento} días)` });
    }
    if (denuncia.diasVencimiento <= 0) {
      tareas.push({ tipo: 'error', texto: 'Caso vencido - Requiere acción inmediata' });
    }
    return tareas;
  }, [denuncia]);

  // Determinar prioridad según tareas pendientes
  const getPrioridad = () => {
    if (tareasPendientes.some(t => t.tipo === 'error')) return 'critical';
    if (tareasPendientes.some(t => t.tipo === 'warning')) return 'medium';
    return undefined;
  };

  return (
    <div className="space-y-4">
      {/* ═══════════════════════════════════════════════════════════════════
          SECCIÓN 1: ACCIONES PENDIENTES (Solo si hay - Arriba de todo)
      ═══════════════════════════════════════════════════════════════════ */}
      {tareasPendientes.length > 0 && (
        <CollapsibleSection
          title="Acciones Pendientes"
          iconName="AlertCircle"
          defaultExpanded={true}
          priority={getPrioridad()}
          badge={
            <Badge 
              variant={tareasPendientes.some(t => t.tipo === 'error') ? 'error' : 'warning'} 
              size="sm"
            >
              {tareasPendientes.length}
            </Badge>
          }
        >
          <div className="space-y-2">
            {tareasPendientes.map((tarea, idx) => (
              <div 
                key={idx} 
                className={`
                  flex items-center gap-3 p-3 rounded-lg
                  ${tarea.tipo === 'error' ? 'bg-red-50' 
                    : tarea.tipo === 'warning' ? 'bg-amber-50' 
                    : 'bg-blue-50'
                  }
                `}
              >
                <Icon 
                  name={tarea.tipo === 'error' ? 'AlertCircle' : tarea.tipo === 'warning' ? 'AlertTriangle' : 'Info'} 
                  size={16} 
                  className={
                    tarea.tipo === 'error' ? 'text-red-500' 
                    : tarea.tipo === 'warning' ? 'text-amber-500' 
                    : 'text-blue-500'
                  }
                />
                <span className="text-sm text-gray-700">{tarea.texto}</span>
              </div>
            ))}
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 mt-2">
              <Icon name="ArrowRight" size={14} />
              Ver tareas pendientes
            </button>
          </div>
        </CollapsibleSection>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SECCIÓN 2: INFORMACIÓN DEL EXPEDIENTE
      ═══════════════════════════════════════════════════════════════════ */}
      <CollapsibleSection
        title="Información del Expediente"
        iconName="Folder"
        defaultExpanded={true}
        badge={
          <span className="text-sm font-semibold text-gray-700">
            N° {denuncia.numeroDenuncia}
          </span>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="info-grid-item">
            <span className="info-grid-label">N° Expediente</span>
            <span className="info-grid-value font-mono">{denuncia.numeroDenuncia}</span>
          </div>
          <div className="info-grid-item">
            <span className="info-grid-label">Fecha Creación</span>
            <span className="info-grid-value">{denuncia.fechaCreacion || denuncia.fechaIngreso}</span>
          </div>
          <div className="info-grid-item">
            <span className="info-grid-label">Última Modificación</span>
            <span className="info-grid-value">{denuncia.fechaModificacion || denuncia.fechaIngreso}</span>
          </div>
          {denuncia.instanciaJbpm && (
            <div className="info-grid-item">
              <span className="info-grid-label">Instancia Workflow</span>
              <span className="info-grid-value font-mono text-sm">{denuncia.instanciaJbpm}</span>
            </div>
          )}
          <div className="info-grid-item">
            <span className="info-grid-label">Usuario Creación</span>
            <span className="info-grid-value flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-500">
                {(denuncia.usuarioCreacion || 'S')[0].toUpperCase()}
              </div>
              {denuncia.usuarioCreacion || 'Sistema'}
            </span>
          </div>
          <div className="info-grid-item">
            <span className="info-grid-label">Usuario Modificación</span>
            <span className="info-grid-value flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-500">
                {(denuncia.usuarioModificacion || '-')[0].toUpperCase()}
              </div>
              {denuncia.usuarioModificacion || '-'}
            </span>
          </div>
        </div>
      </CollapsibleSection>

      {/* ═══════════════════════════════════════════════════════════════════
          SECCIÓN 3: HISTORIAL DE LA DENUNCIA (Timeline mejorado)
      ═══════════════════════════════════════════════════════════════════ */}
      <CollapsibleSection
        title="Historial de la Denuncia"
        iconName="Clock"
        defaultExpanded={true}
      >
        <div className="relative">
          {timelineOrdenado.map((item, index) => {
            const config = TIMELINE_LABELS[item.title] || { 
              icon: 'Circle', 
              label: item.title
            };
            const isLast = index === timelineOrdenado.length - 1;
            
            // Configuración de colores según status
            const statusConfig: Record<string, { dotClass: string; lineClass: string; textClass: string }> = {
              completed: {
                dotClass: 'bg-emerald-500',
                lineClass: 'bg-emerald-200',
                textClass: 'text-emerald-700',
              },
              current: {
                dotClass: 'bg-blue-500',
                lineClass: 'bg-blue-200',
                textClass: 'text-blue-700',
              },
              pending: {
                dotClass: 'bg-gray-300',
                lineClass: 'bg-gray-200',
                textClass: 'text-gray-500',
              },
            };
            
            const colors = statusConfig[item.status] || statusConfig.pending;
            
            return (
              <div key={item.id} className="relative pl-8 pb-6 last:pb-0">
                {/* Línea vertical */}
                {!isLast && (
                  <div
                    className={`absolute left-[11px] top-6 w-0.5 h-full ${colors.lineClass}`}
                  />
                )}

                {/* Punto/Icono */}
                <div
                  className={`
                    absolute left-0 top-1 w-6 h-6 rounded-full ${colors.dotClass}
                    flex items-center justify-center ring-4 ring-white
                  `}
                >
                  {item.status === 'completed' && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {item.status === 'current' && (
                    <svg className="w-3 h-3 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                      <circle cx="10" cy="10" r="4" />
                    </svg>
                  )}
                </div>

                {/* Contenido */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className={`font-semibold ${colors.textClass}`}>
                      {config.label}
                    </h4>
                    {item.status === 'current' && (
                      <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                        Actual
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                    {item.date && item.date !== '-' && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
                        </svg>
                        {item.date}
                      </span>
                    )}
                    {item.time && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                        </svg>
                        {item.time}
                      </span>
                    )}
                    {item.user && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                        </svg>
                        {item.user}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CollapsibleSection>

      {/* ═══════════════════════════════════════════════════════════════════
          SECCIÓN 4: ESTADO DEL FLUJO DE TRABAJO
      ═══════════════════════════════════════════════════════════════════ */}
      <CollapsibleSection
        title="Estado del Flujo de Trabajo"
        iconName="GitBranch"
        defaultExpanded={true}
      >
        <div className="space-y-6">
          {/* Info estado actual */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Icon name="CheckCircle" size={24} className="text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Etapa Actual: {denuncia.etapaFormulacion || denuncia.estado}</p>
                <p className="text-sm text-gray-600">Estado: {denuncia.estado}</p>
              </div>
            </div>
            {siguienteEtapa && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg text-sm">
                <Icon name="ArrowRight" size={14} className="text-blue-500" />
                <span className="text-blue-600">Siguiente: <span className="font-medium">{siguienteEtapa.label}</span></span>
              </div>
            )}
          </div>

          {/* Stepper de etapas */}
          <div className="relative px-4">
            {/* Línea de progreso de fondo */}
            <div className="absolute top-5 left-8 right-8 h-0.5 bg-gray-200 rounded-full" />
            
            {/* Línea de progreso activa */}
            <div 
              className="absolute top-5 left-8 h-0.5 bg-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `calc(${(etapaActualIndex / (WORKFLOW_ETAPAS.length - 1)) * 100}% - 4rem)` }}
            />

            {/* Etapas */}
            <div className="relative flex justify-between">
              {WORKFLOW_ETAPAS.map((etapa, index) => {
                const isCompleted = index < etapaActualIndex;
                const isCurrent = index === etapaActualIndex;
                const isHovered = hoveredEtapa === index;
                
                return (
                  <div 
                    key={etapa.id} 
                    className="flex flex-col items-center relative group"
                    onMouseEnter={() => setHoveredEtapa(index)}
                    onMouseLeave={() => setHoveredEtapa(null)}
                  >
                    {/* Círculo de estado */}
                    <div 
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center relative z-10
                        transition-all duration-300 cursor-pointer border-2
                        ${isCompleted 
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-600' 
                          : isCurrent 
                          ? 'bg-blue-50 border-blue-400 text-blue-600 ring-4 ring-blue-50' 
                          : 'bg-gray-50 border-gray-200 text-gray-400'
                        }
                        ${isHovered && !isCurrent ? 'scale-105' : ''}
                      `}
                    >
                      {isCompleted ? (
                        <Icon name="Check" size={18} />
                      ) : isCurrent ? (
                        <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>

                    {/* Etiqueta */}
                    <div className="mt-2 text-center">
                      <span className={`
                        text-xs font-medium block transition-colors
                        ${isCompleted ? 'text-emerald-600' : isCurrent ? 'text-blue-600' : 'text-gray-400'}
                      `}>
                        {etapa.shortLabel}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] text-blue-500 font-medium">
                          Actual
                        </span>
                      )}
                    </div>

                    {/* Tooltip con descripción */}
                    {isHovered && (
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
                        <div className="bg-gray-800 text-white text-xs rounded-lg px-3 py-2 shadow-lg min-w-[180px] max-w-[220px]">
                          <div className="font-medium mb-1">{etapa.label}</div>
                          <p className="text-gray-300 text-[11px] leading-relaxed mb-1.5">
                            {etapa.description}
                          </p>
                          <div className="flex items-center gap-1 text-gray-400 text-[10px]">
                            <Icon name="User" size={10} />
                            {etapa.responsable}
                          </div>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                            <div className="border-6 border-transparent border-t-gray-800" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="mt-4">
            <div className="h-1.5 bg-gray-200 rounded-full">
              <div 
                className="h-1.5 bg-emerald-500 rounded-full transition-all"
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

          {/* Info del responsable y acción */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Icon name="User" size={16} className="text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Responsable actual</p>
                <p className="text-sm font-medium text-gray-700">{WORKFLOW_ETAPAS[etapaActualIndex]?.responsable}</p>
              </div>
            </div>

            {/* Acción principal contextual */}
            <button 
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${accionContextual.variant === 'success' 
                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                  : accionContextual.variant === 'warning'
                  ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                  : accionContextual.variant === 'neutral'
                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }
              `}
            >
              <Icon name={accionContextual.icon as any} size={16} />
              {accionContextual.label}
            </button>
          </div>
        </div>
      </CollapsibleSection>

      {/* ═══════════════════════════════════════════════════════════════════
          SECCIÓN 5: ACCIONES DISPONIBLES
      ═══════════════════════════════════════════════════════════════════ */}
      <CollapsibleSection
        title="Acciones Disponibles"
        iconName="Zap"
        defaultExpanded={true}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Icon name="FileText" size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Ver XML</p>
              <p className="text-xs text-gray-500">Documento estructurado</p>
            </div>
          </button>
          
          <button 
            onClick={() => navigate(`/expediente/${denuncia.id}`)}
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Icon name="FolderOpen" size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Ver Expediente</p>
              <p className="text-xs text-gray-500">Expediente digital</p>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Icon name="Printer" size={18} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Imprimir</p>
              <p className="text-xs text-gray-500">Generar PDF</p>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Icon name="History" size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Auditoría</p>
              <p className="text-xs text-gray-500">Log de cambios</p>
            </div>
          </button>
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default DenunciaTrazabilidad;
