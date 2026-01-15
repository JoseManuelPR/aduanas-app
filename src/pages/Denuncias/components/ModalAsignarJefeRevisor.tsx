/**
 * ModalAsignarJefeRevisor - CU-005
 * Modal para asignar un Jefe Revisor a una denuncia
 * 
 * Criterios de aceptación implementados:
 * - Lista de Jefes Revisores disponibles para selección
 * - Validación de disponibilidad con mensaje de alerta
 * - Registro de fecha, usuario y rol
 * - Cambio de estado a "Ingresada / Asignada a Jefe Revisor"
 */

import { useState, useMemo } from 'react';
import { Icon } from 'he-button-custom-library';
import { CustomButton } from '../../../components/Button/Button';
import {
  jefesRevisores,
  getJefesRevisoresDisponiblesPorAduana,
  getJefesRevisoresActivos,
  verificarDisponibilidad,
  getColorDisponibilidad,
  calcularCargaTrabajo,
  getColorCargaTrabajo,
  usuarioActual,
  type Denuncia,
} from '../../../data';

interface ModalAsignarJefeRevisorProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (jefeRevisorId: string, observaciones?: string) => void;
  denuncia: Denuncia;
}

export const ModalAsignarJefeRevisor: React.FC<ModalAsignarJefeRevisorProps> = ({
  isOpen,
  onClose,
  onConfirm,
  denuncia,
}) => {
  const [selectedJefeRevisor, setSelectedJefeRevisor] = useState<string>('');
  const [observaciones, setObservaciones] = useState<string>('');
  const [mostrarTodos, setMostrarTodos] = useState<boolean>(false);
  const [alertaDisponibilidad, setAlertaDisponibilidad] = useState<{
    show: boolean;
    mensaje: string;
    tipo: 'error' | 'warning';
  }>({ show: false, mensaje: '', tipo: 'error' });

  const jefesRevisoresFiltrados = useMemo(() => {
    if (mostrarTodos) {
      return getJefesRevisoresActivos();
    }
    const disponiblesAduana = getJefesRevisoresDisponiblesPorAduana(denuncia.aduana);
    if (disponiblesAduana.length === 0) {
      return jefesRevisores.filter(jr => 
        jr.activo && jr.disponibilidad === 'Disponible'
      );
    }
    return disponiblesAduana;
  }, [denuncia.aduana, mostrarTodos]);

  const handleSelectJefeRevisor = (jefeRevisorId: string) => {
    setSelectedJefeRevisor(jefeRevisorId);
    const verificacion = verificarDisponibilidad(jefeRevisorId);
    if (!verificacion.disponible) {
      setAlertaDisponibilidad({
        show: true,
        mensaje: verificacion.mensaje,
        tipo: 'error',
      });
    } else {
      setAlertaDisponibilidad({ show: false, mensaje: '', tipo: 'error' });
    }
  };

  const puedeConfirmar = useMemo(() => {
    if (!selectedJefeRevisor) return false;
    const verificacion = verificarDisponibilidad(selectedJefeRevisor);
    return verificacion.disponible;
  }, [selectedJefeRevisor]);

  const jefeRevisorSeleccionado = useMemo(() => {
    return jefesRevisores.find(jr => jr.id === selectedJefeRevisor);
  }, [selectedJefeRevisor]);

  const handleConfirm = () => {
    if (puedeConfirmar) {
      onConfirm(selectedJefeRevisor, observaciones);
      setSelectedJefeRevisor('');
      setObservaciones('');
      setAlertaDisponibilidad({ show: false, mensaje: '', tipo: 'error' });
    }
  };

  const handleClose = () => {
    setSelectedJefeRevisor('');
    setObservaciones('');
    setAlertaDisponibilidad({ show: false, mensaje: '', tipo: 'error' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-aduana-azul to-blue-700 rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Icon name="UserCheck" size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Asignar Jefe Revisor</h2>
                <p className="text-sm text-white/80">
                  Denuncia N° {denuncia.numeroDenuncia} • {denuncia.tipoDenuncia}
                </p>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Info de la denuncia */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 block">Aduana</span>
                  <span className="font-medium text-gray-900">{denuncia.aduana}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Tipo</span>
                  <span className={`font-medium ${
                    denuncia.tipoDenuncia === 'Penal' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {denuncia.tipoDenuncia}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Infracción</span>
                  <span className="font-medium text-gray-900">{denuncia.tipoInfraccion}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Plazo</span>
                  <span className={`font-medium ${
                    denuncia.diasVencimiento < 0 ? 'text-red-600' :
                    denuncia.diasVencimiento <= 5 ? 'text-amber-600' : 'text-gray-900'
                  }`}>
                    {denuncia.diasVencimiento} días
                  </span>
                </div>
              </div>
            </div>

            {/* Alerta de disponibilidad */}
            {alertaDisponibilidad.show && (
              <div className={`flex items-start gap-3 p-4 rounded-lg border-l-4 ${
                alertaDisponibilidad.tipo === 'error' 
                  ? 'bg-red-50 border-red-500 text-red-800' 
                  : 'bg-amber-50 border-amber-500 text-amber-800'
              }`}>
                <Icon 
                  name={alertaDisponibilidad.tipo === 'error' ? 'AlertCircle' : 'AlertTriangle'} 
                  size={20} 
                  className={alertaDisponibilidad.tipo === 'error' ? 'text-red-500' : 'text-amber-500'}
                />
                <div className="flex-1">
                  <p className="font-medium">El revisor seleccionado no tiene disponibilidad</p>
                  <p className="text-sm mt-1 opacity-80">{alertaDisponibilidad.mensaje}</p>
                  <p className="text-sm mt-2 font-medium">
                    Por favor, seleccione otro Jefe Revisor disponible.
                  </p>
                </div>
                <button 
                  onClick={() => setAlertaDisponibilidad({ show: false, mensaje: '', tipo: 'error' })}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>
            )}

            {/* Filtros */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Seleccionar Jefe Revisor
                </h3>
                <p className="text-sm text-gray-500">
                  {jefesRevisoresFiltrados.length} revisor(es) {mostrarTodos ? 'activos' : 'disponibles'}
                </p>
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={mostrarTodos}
                  onChange={(e) => setMostrarTodos(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-aduana-azul focus:ring-aduana-azul"
                />
                <span className="text-gray-600">Mostrar todos los revisores</span>
              </label>
            </div>

            {/* Lista de Jefes Revisores */}
            <div className="max-h-[300px] overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
              {jefesRevisoresFiltrados.length === 0 ? (
                <div className="p-8 text-center">
                  <Icon name="Users" size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">No hay revisores disponibles</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Active la opción "Mostrar todos los revisores" para ver más opciones
                  </p>
                </div>
              ) : (
                jefesRevisoresFiltrados.map((jefeRevisor) => {
                  const cargaTrabajo = calcularCargaTrabajo(jefeRevisor);
                  const isSelected = selectedJefeRevisor === jefeRevisor.id;
                  const esDisponible = jefeRevisor.disponibilidad === 'Disponible' && 
                                       jefeRevisor.casosAsignados < jefeRevisor.capacidadMaxima;

                  return (
                    <div
                      key={jefeRevisor.id}
                      onClick={() => handleSelectJefeRevisor(jefeRevisor.id)}
                      className={`
                        p-4 cursor-pointer transition-all duration-200
                        ${isSelected 
                          ? 'bg-aduana-azul-50 border-l-4 border-l-aduana-azul' 
                          : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                        }
                        ${!esDisponible ? 'opacity-60' : ''}
                      `}
                    >
                      <div className="flex items-start justify-between gap-4">
                        {/* Info del revisor */}
                        <div className="flex items-start gap-3 flex-1">
                          {/* Radio button */}
                          <div className={`
                            w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5
                            ${isSelected 
                              ? 'border-aduana-azul bg-aduana-azul' 
                              : 'border-gray-300'
                            }
                          `}>
                            {isSelected && (
                              <Icon name="Check" size={12} className="text-white" />
                            )}
                          </div>

                          {/* Avatar y datos */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">
                                {jefeRevisor.nombreCompleto}
                              </span>
                              <span className={`
                                px-2 py-0.5 rounded-full text-xs font-medium
                                ${getColorDisponibilidad(jefeRevisor.disponibilidad)}
                              `}>
                                {jefeRevisor.disponibilidad}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              <span>{jefeRevisor.cargo}</span>
                              <span className="mx-2">•</span>
                              <span>{jefeRevisor.aduana}</span>
                              <span className="mx-2">•</span>
                              <span>{jefeRevisor.seccion}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <span className="text-xs text-gray-400">
                                {jefeRevisor.email}
                              </span>
                              {jefeRevisor.especialidades && jefeRevisor.especialidades.length > 0 && (
                                <>
                                  <span className="text-gray-300">|</span>
                                  {jefeRevisor.especialidades.slice(0, 2).map((esp, idx) => (
                                    <span 
                                      key={idx}
                                      className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                                    >
                                      {esp}
                                    </span>
                                  ))}
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Carga de trabajo */}
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-700">
                            Carga de trabajo
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${getColorCargaTrabajo(cargaTrabajo)} transition-all`}
                                style={{ width: `${cargaTrabajo}%` }}
                              />
                            </div>
                            <span className={`text-sm font-semibold ${
                              cargaTrabajo >= 90 ? 'text-red-600' :
                              cargaTrabajo >= 70 ? 'text-amber-600' : 'text-gray-600'
                            }`}>
                              {cargaTrabajo}%
                            </span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {jefeRevisor.casosAsignados} de {jefeRevisor.capacidadMaxima} casos
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Campo de observaciones */}
            <div>
              <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-2">
                Observaciones de la asignación (opcional)
              </label>
              <textarea
                id="observaciones"
                rows={3}
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Ingrese observaciones relevantes para la asignación..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aduana-azul focus:border-aduana-azul transition-colors resize-none"
              />
            </div>

            {/* Info de auditoría */}
            {jefeRevisorSeleccionado && puedeConfirmar && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Icon name="Info" size={20} className="text-emerald-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-emerald-800">
                      Resumen de la asignación
                    </p>
                    <ul className="mt-2 space-y-1 text-emerald-700">
                      <li>
                        <span className="text-emerald-600">Jefe Revisor:</span>{' '}
                        {jefeRevisorSeleccionado.nombreCompleto}
                      </li>
                      <li>
                        <span className="text-emerald-600">Fecha:</span>{' '}
                        {new Date().toLocaleDateString('es-CL')}
                      </li>
                      <li>
                        <span className="text-emerald-600">Usuario:</span>{' '}
                        {usuarioActual.name}
                      </li>
                      <li>
                        <span className="text-emerald-600">Rol:</span>{' '}
                        {usuarioActual.role}
                      </li>
                      <li>
                        <span className="text-emerald-600">Nuevo estado:</span>{' '}
                        <span className="font-semibold">Ingresada / Asignada a Jefe Revisor</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-200">
            <CustomButton 
              variant="secondary" 
              onClick={handleClose}
              className="px-6"
            >
              Cancelar
            </CustomButton>
            <CustomButton 
              variant="primary"
              onClick={handleConfirm}
              disabled={!puedeConfirmar}
              className={`px-6 flex items-center gap-2 ${
                !puedeConfirmar ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Icon name="UserCheck" size={16} />
              Asignar e Ingresar Denuncia
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAsignarJefeRevisor;
