/**
 * AudienciaForm.tsx - Realizar Audiencia
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 * 
 * Realizar Audiencia (comparecencia, allanamiento o no comparecencia)
 * - Registrar comparecencia o no
 * - Registrar declaraciones y antecedentes entregados
 * - Registrar allanamiento o desacuerdo
 * - Si hay allanamiento, se habilitan cálculos de multa atenuada
 * - Si no hay allanamiento, se genera resultado provisional para reclamo posterior
 */

import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from "he-button-custom-library";
import CONSTANTS_APP from "../../constants/sidebar-menu";
import CustomLayout from "../../Layout/Layout";
import InputField from "../../organisms/InputField/InputField";
import { CustomButton } from "../../components/Button/Button";
import { Badge, Stepper, useToast } from "../../components/UI";
import type { BadgeVariant } from "../../components/UI";
import { FileUploader } from '../../components/FileUploader';
import { ERoutePaths } from "../../routes/routes";

// Datos centralizados
import {
  getTodasLasNotificaciones,
  usuarioActual,
  getDenunciaPorId,
  salasAudiencia,
  crearAudiencia,
  iniciarAudiencia,
  finalizarAudiencia,
  generarActaAudiencia,
  calcularMultaAtenuada,
  getAudienciaPorId,
  getAudienciasPorDenuncia,
  type Audiencia,
  type TipoResultadoAudiencia,
  type DeclaracionAudiencia,
  type DocumentoAudiencia,
} from '../../data';

// Tipos del formulario
interface FormularioAudienciaData {
  // Datos de la audiencia
  fechaProgramada: string;
  horaProgramada: string;
  sala: string;
  direccion: string;
  modalidad: 'Presencial' | 'Virtual' | 'Mixta';
  
  // Asistencia
  infractorComparecio: boolean;
  representanteLegal: string;
  
  // Resultado
  resultado: TipoResultadoAudiencia;
  allanamiento: boolean;
  
  // Alegaciones
  alegaciones: string;
  
  // Observaciones
  observaciones: string;
}

const initialFormData: FormularioAudienciaData = {
  fechaProgramada: new Date().toISOString().split('T')[0],
  horaProgramada: '10:00',
  sala: '',
  direccion: '',
  modalidad: 'Presencial',
  infractorComparecio: true,
  representanteLegal: '',
  resultado: 'Pendiente',
  allanamiento: false,
  alegaciones: '',
  observaciones: '',
};

// Steps del formulario
const steps = [
  { id: 1, label: 'Datos Audiencia', description: 'Programar audiencia' },
  { id: 2, label: 'Asistencia', description: 'Registrar comparecencia' },
  { id: 3, label: 'Antecedentes', description: 'Documentos entregados' },
  { id: 4, label: 'Declaraciones', description: 'Registrar alegaciones' },
  { id: 5, label: 'Resultado', description: 'Allanamiento o desacuerdo' },
  { id: 6, label: 'Acta', description: 'Generar acta preliminar' },
];

export const AudienciaForm: React.FC = () => {
  const navigate = useNavigate();
  const { denunciaId, id } = useParams<{ denunciaId?: string; id?: string }>();
  const { showToast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  
  // Estado del formulario
  const [formData, setFormData] = useState<FormularioAudienciaData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Audiencia y denuncia
  const [audiencia, setAudiencia] = useState<Audiencia | null>(null);
  const [audienciaIniciada, setAudienciaIniciada] = useState(false);
  
  // Declaraciones y antecedentes
  const [declaraciones, setDeclaraciones] = useState<DeclaracionAudiencia[]>([]);
  const [antecedentes, setAntecedentes] = useState<DocumentoAudiencia[]>([]);
  const [nuevaDeclaracion, setNuevaDeclaracion] = useState({
    declarante: '',
    tipoDeclarante: 'Infractor' as DeclaracionAudiencia['tipoDeclarante'],
    contenido: '',
  });
  
  // Notificaciones
  const allNotifications = useMemo(() => getTodasLasNotificaciones(), []);
  
  // Cargar denuncia
  const denuncia = useMemo(() => {
    if (denunciaId) {
      return getDenunciaPorId(denunciaId);
    }
    return null;
  }, [denunciaId]);
  
  // Verificar si hay audiencia existente para esta denuncia
  useEffect(() => {
    if (id) {
      const audienciaExistente = getAudienciaPorId(id);
      if (audienciaExistente) {
        setAudiencia(audienciaExistente);
        setFormData({
          fechaProgramada: audienciaExistente.fechaProgramada,
          horaProgramada: audienciaExistente.horaProgramada,
          sala: audienciaExistente.sala,
          direccion: audienciaExistente.direccion,
          modalidad: audienciaExistente.modalidad,
          infractorComparecio: audienciaExistente.infractorComparecio,
          representanteLegal: audienciaExistente.representanteLegal || '',
          resultado: audienciaExistente.resultado,
          allanamiento: audienciaExistente.allanamiento,
          alegaciones: audienciaExistente.alegaciones || '',
          observaciones: audienciaExistente.observaciones || '',
        });
        setDeclaraciones(audienciaExistente.declaraciones);
        setAntecedentes(audienciaExistente.antecedentesEntregados);
        if (audienciaExistente.estado === 'En Curso' || audienciaExistente.estado === 'Finalizada') {
          setAudienciaIniciada(true);
        }
      }
    }
  }, [id]);
  
  // Cálculo de multa atenuada
  const calculoMulta = useMemo(() => {
    if (!denuncia) return null;
    const multaOriginal = denuncia.multa || denuncia.multaMaxima || 0;
    return calcularMultaAtenuada(multaOriginal, formData.allanamiento);
  }, [denuncia, formData.allanamiento]);
  
  // Handler para cambios en el formulario
  const handleInputChange = (field: keyof FormularioAudienciaData, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Si cambia la sala, actualizar la dirección
      if (field === 'sala') {
        const salaSeleccionada = salasAudiencia.find(s => s.nombre === value);
        if (salaSeleccionada) {
          newData.direccion = salaSeleccionada.direccion;
        }
      }
      
      // Si no comparece, automáticamente es "No Comparecencia"
      if (field === 'infractorComparecio' && !value) {
        newData.resultado = 'No Comparecencia';
        newData.allanamiento = false;
      }
      
      // Si hay allanamiento, el resultado es "Allanamiento"
      if (field === 'allanamiento' && value) {
        newData.resultado = 'Allanamiento';
      }
      
      // Si no hay allanamiento y comparece, es "Desacuerdo"
      if (field === 'allanamiento' && !value && newData.infractorComparecio) {
        newData.resultado = 'Desacuerdo';
      }
      
      return newData;
    });
    
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  // Validación por paso
  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (currentStep) {
      case 1: // Datos Audiencia
        if (!formData.fechaProgramada) newErrors.fechaProgramada = 'Fecha requerida';
        if (!formData.horaProgramada) newErrors.horaProgramada = 'Hora requerida';
        if (!formData.sala) newErrors.sala = 'Debe seleccionar una sala';
        break;
      case 2: // Asistencia
        if (formData.infractorComparecio && !formData.representanteLegal) {
          newErrors.representanteLegal = 'Indique quién compareció';
        }
        break;
      case 4: // Declaraciones
        // Opcional
        break;
      case 5: // Resultado
        if (formData.resultado === 'Pendiente') {
          newErrors.resultado = 'Debe determinar el resultado de la audiencia';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Navegar al siguiente paso
  const handleNextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };
  
  // Iniciar audiencia
  const handleIniciarAudiencia = () => {
    if (!denuncia) return;
    
    // Crear la audiencia si no existe
    if (!audiencia) {
      const nuevaAudiencia = crearAudiencia({
        denunciaId: denuncia.id,
        numeroDenuncia: denuncia.numeroDenuncia,
        fechaProgramada: formData.fechaProgramada.split('-').reverse().join('-'),
        horaProgramada: formData.horaProgramada,
        sala: formData.sala,
        direccion: formData.direccion,
        modalidad: formData.modalidad,
        juezInstructor: usuarioActual.name,
        loginJuezInstructor: usuarioActual.login,
        infractorRut: denuncia.rutDeudor,
        infractorNombre: denuncia.nombreDeudor,
        multaOriginal: denuncia.multa || denuncia.multaMaxima || 0,
        usuarioCreacion: usuarioActual.login,
      });
      
      setAudiencia(nuevaAudiencia);
      
      // Iniciar la audiencia
      const audienciaActualizada = iniciarAudiencia(nuevaAudiencia.id, usuarioActual.login);
      if (audienciaActualizada) {
        setAudiencia(audienciaActualizada);
        setAudienciaIniciada(true);
        
        showToast({
          type: 'success',
          title: 'Audiencia Iniciada',
          message: `La audiencia ${nuevaAudiencia.numeroAudiencia} ha comenzado.`,
          duration: 3000,
        });
      }
    } else if (audiencia.estado === 'Programada') {
      const audienciaActualizada = iniciarAudiencia(audiencia.id, usuarioActual.login);
      if (audienciaActualizada) {
        setAudiencia(audienciaActualizada);
        setAudienciaIniciada(true);
        
        showToast({
          type: 'success',
          title: 'Audiencia Iniciada',
          message: `La audiencia ${audiencia.numeroAudiencia} ha comenzado.`,
          duration: 3000,
        });
      }
    }
    
    setCurrentStep(2);
  };
  
  // Agregar declaración
  const handleAgregarDeclaracion = () => {
    if (!nuevaDeclaracion.declarante || !nuevaDeclaracion.contenido) {
      showToast({
        type: 'error',
        title: 'Campos requeridos',
        message: 'Complete el nombre del declarante y el contenido.',
        duration: 3000,
      });
      return;
    }
    
    const declaracion: DeclaracionAudiencia = {
      id: `dec-${Date.now()}`,
      fecha: new Date().toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' }).split('/').join('-'),
      hora: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
      declarante: nuevaDeclaracion.declarante,
      tipoDeclarante: nuevaDeclaracion.tipoDeclarante,
      contenido: nuevaDeclaracion.contenido,
      registradoPor: usuarioActual.login,
    };
    
    setDeclaraciones(prev => [...prev, declaracion]);
    setNuevaDeclaracion({ declarante: '', tipoDeclarante: 'Infractor', contenido: '' });
    
    showToast({
      type: 'success',
      title: 'Declaración registrada',
      message: 'La declaración ha sido agregada al acta.',
      duration: 2000,
    });
  };
  
  // Manejar archivos subidos
  const handleFilesUploaded = (files: File[]) => {
    const nuevosAntecedentes: DocumentoAudiencia[] = files.map(file => ({
      id: `ant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      nombre: file.name,
      tipo: file.name.split('.').pop() || 'pdf',
      tamanio: `${(file.size / 1024).toFixed(1)} KB`,
      fechaSubida: new Date().toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' }).split('/').join('-'),
    }));
    
    setAntecedentes(prev => [...prev, ...nuevosAntecedentes]);
    
    showToast({
      type: 'success',
      title: 'Antecedentes agregados',
      message: `${files.length} documento(s) agregado(s) al expediente.`,
      duration: 2000,
    });
  };
  
  // Finalizar audiencia
  const handleFinalizarAudiencia = () => {
    if (!audiencia) return;
    
    if (!validateCurrentStep()) return;
    
    const audienciaFinalizada = finalizarAudiencia(
      audiencia.id,
      formData.resultado,
      formData.infractorComparecio,
      formData.allanamiento,
      formData.alegaciones,
      formData.observaciones,
      usuarioActual.login
    );
    
    if (audienciaFinalizada) {
      setAudiencia(audienciaFinalizada);
      
      showToast({
        type: 'success',
        title: 'Audiencia Finalizada',
        message: `La audiencia ha sido finalizada con resultado: ${formData.resultado}`,
        duration: 4000,
      });
      
      setCurrentStep(6);
    }
  };
  
  // Generar acta
  const handleGenerarActa = () => {
    if (!audiencia) return;
    
    const audienciaConActa = generarActaAudiencia(audiencia.id, usuarioActual.login);
    
    if (audienciaConActa) {
      setAudiencia(audienciaConActa);
      
      showToast({
        type: 'success',
        title: 'Acta Generada',
        message: `El acta ${audienciaConActa.numeroActa} ha sido generada exitosamente.`,
        duration: 4000,
      });
      
      // Navegar al detalle de la denuncia
      setTimeout(() => {
        navigate(ERoutePaths.DENUNCIAS_DETALLE.replace(':id', denunciaId || ''));
      }, 2000);
    }
  };
  
  // Renderizar contenido del paso actual
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Paso 1: Programar/Iniciar Audiencia</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Configure la fecha, hora y lugar de la audiencia. Una vez iniciada, podrá registrar
                    la asistencia del infractor y proceder con el registro del acta.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Datos de la Denuncia */}
            {denuncia && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Icon name="FileText" size={18} />
                  Denuncia Asociada
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">N° Denuncia:</span>
                    <p className="font-medium">{denuncia.numeroDenuncia}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Tipo:</span>
                    <p>
                      <Badge variant={denuncia.tipoDenuncia === 'Penal' ? 'error' : 'info'}>
                        {denuncia.tipoDenuncia}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Infractor:</span>
                    <p className="font-medium">{denuncia.nombreDeudor}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">RUT:</span>
                    <p className="font-medium">{denuncia.rutDeudor}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Aduana:</span>
                    <p className="font-medium">{denuncia.aduana}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Artículo:</span>
                    <p className="font-medium">Art. {denuncia.codigoArticulo}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Multa Original:</span>
                    <p className="font-medium text-red-600">
                      ${(denuncia.multa || denuncia.multaMaxima || 0).toLocaleString('es-CL')}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Estado:</span>
                    <p>
                      <Badge variant="warning">{denuncia.estado}</Badge>
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Datos de la Audiencia */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Fecha de Audiencia"
                type="date"
                value={formData.fechaProgramada}
                onChange={(e) => handleInputChange('fechaProgramada', e.target.value)}
                error={errors.fechaProgramada}
                required
              />
              
              <InputField
                label="Hora de Audiencia"
                type="time"
                value={formData.horaProgramada}
                onChange={(e) => handleInputChange('horaProgramada', e.target.value)}
                error={errors.horaProgramada}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Modalidad <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.modalidad}
                  onChange={(e) => handleInputChange('modalidad', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                >
                  <option value="Presencial">Presencial</option>
                  <option value="Virtual">Virtual</option>
                  <option value="Mixta">Mixta</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sala de Audiencias <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.sala}
                  onChange={(e) => handleInputChange('sala', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-aduana-azul focus:border-transparent ${
                    errors.sala ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccione una sala...</option>
                  {salasAudiencia.map((sala) => (
                    <option key={sala.codigo} value={sala.nombre}>
                      {sala.nombre}
                    </option>
                  ))}
                </select>
                {errors.sala && <p className="text-red-500 text-sm mt-1">{errors.sala}</p>}
              </div>
            </div>
            
            <InputField
              label="Dirección"
              type="text"
              value={formData.direccion}
              onChange={(e) => handleInputChange('direccion', e.target.value)}
              placeholder="Se completa automáticamente al seleccionar sala"
              disabled
            />
            
            {/* Botón Iniciar Audiencia */}
            {!audienciaIniciada && (
              <div className="flex justify-center mt-8">
                <CustomButton
                  variant="primary"
                  onClick={handleIniciarAudiencia}
                  className="flex items-center gap-2 px-8 py-3 text-lg bg-emerald-600 hover:bg-emerald-700"
                  disabled={!formData.sala}
                >
                  <Icon name="Play" size={20} />
                  Iniciar Audiencia
                </CustomButton>
              </div>
            )}
            
            {audienciaIniciada && audiencia && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mt-4">
                <div className="flex items-center gap-3">
                  <Icon name="CheckCircle" size={24} className="text-emerald-600" />
                  <div>
                    <p className="font-medium text-emerald-900">Audiencia en Curso</p>
                    <p className="text-sm text-emerald-700">
                      N° {audiencia.numeroAudiencia} - Iniciada a las {audiencia.horaInicio}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Icon name="Users" size={20} className="text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-900">Paso 2: Registrar Asistencia</p>
                  <p className="text-sm text-amber-700 mt-1">
                    Registre si el infractor o su representante legal comparecieron a la audiencia.
                    La no comparecencia habilita la aplicación de multa máxima.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Comparecencia */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">¿El infractor compareció a la audiencia?</h3>
              
              <div className="flex gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="comparecencia"
                    checked={formData.infractorComparecio}
                    onChange={() => handleInputChange('infractorComparecio', true)}
                    className="w-5 h-5 text-aduana-azul"
                  />
                  <div className="flex items-center gap-2">
                    <Icon name="UserCheck" size={20} className="text-emerald-600" />
                    <span className="font-medium">Sí compareció</span>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="comparecencia"
                    checked={!formData.infractorComparecio}
                    onChange={() => handleInputChange('infractorComparecio', false)}
                    className="w-5 h-5 text-aduana-azul"
                  />
                  <div className="flex items-center gap-2">
                    <Icon name="UserX" size={20} className="text-red-600" />
                    <span className="font-medium">No compareció</span>
                  </div>
                </label>
              </div>
            </div>
            
            {/* Si comparece */}
            {formData.infractorComparecio && (
              <div className="space-y-4">
                <InputField
                  label="Nombre de quien compareció"
                  type="text"
                  value={formData.representanteLegal}
                  onChange={(e) => handleInputChange('representanteLegal', e.target.value)}
                  placeholder="Ej: Juan Pérez (Representante Legal)"
                  error={errors.representanteLegal}
                  required
                />
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Nota:</strong> Si compareció un representante legal, debe presentar poder de representación
                    que se adjuntará en el paso de Antecedentes.
                  </p>
                </div>
              </div>
            )}
            
            {/* Si NO comparece */}
            {!formData.infractorComparecio && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <Icon name="AlertTriangle" size={24} className="text-red-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900">No Comparecencia Registrada</p>
                    <p className="text-sm text-red-700 mt-2">
                      Al no comparecer el infractor a la audiencia, se aplicará la <strong>multa máxima</strong> según
                      lo establecido en la normativa vigente. El resultado de la audiencia será registrado como
                      "No Comparecencia".
                    </p>
                    {denuncia && (
                      <div className="mt-4 p-3 bg-white rounded-lg border border-red-200">
                        <p className="text-sm text-gray-600">Multa máxima aplicable:</p>
                        <p className="text-2xl font-bold text-red-600">
                          ${(denuncia.multaMaxima || denuncia.multa || 0).toLocaleString('es-CL')} CLP
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Icon name="FileText" size={20} className="text-purple-600 mt-0.5" />
                <div>
                  <p className="font-medium text-purple-900">Paso 3: Registrar Antecedentes</p>
                  <p className="text-sm text-purple-700 mt-1">
                    Adjunte los documentos y antecedentes entregados por el infractor durante la audiencia.
                    Estos quedarán registrados en el expediente digital.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Subir archivos */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="Upload" size={18} />
                Subir Antecedentes
              </h3>
              
              <FileUploader
                onFilesSelected={handleFilesUploaded}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                multiple
                maxSize={10}
              />
            </div>
            
            {/* Lista de antecedentes */}
            {antecedentes.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Icon name="Folder" size={18} />
                  Antecedentes Registrados ({antecedentes.length})
                </h3>
                
                <div className="space-y-3">
                  {antecedentes.map((ant) => (
                    <div key={ant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon name="File" size={20} className="text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{ant.nombre}</p>
                          <p className="text-sm text-gray-500">
                            {ant.tamanio} • Subido: {ant.fechaSubida}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setAntecedentes(prev => prev.filter(a => a.id !== ant.id))}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Icon name="Trash2" size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {antecedentes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Icon name="FileText" size={48} className="mx-auto mb-3 opacity-50" />
                <p>No se han registrado antecedentes aún</p>
                <p className="text-sm">Los antecedentes son opcionales pero recomendados</p>
              </div>
            )}
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Icon name="MessageSquare" size={20} className="text-cyan-600 mt-0.5" />
                <div>
                  <p className="font-medium text-cyan-900">Paso 4: Registrar Declaraciones</p>
                  <p className="text-sm text-cyan-700 mt-1">
                    Registre las declaraciones y alegaciones del infractor o su representante.
                    Estas quedarán plasmadas en el acta de la audiencia.
                  </p>
                </div>
              </div>
            </div>
            
            {formData.infractorComparecio ? (
              <>
                {/* Formulario nueva declaración */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Icon name="Plus" size={18} />
                    Agregar Declaración
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label="Nombre del Declarante"
                        type="text"
                        value={nuevaDeclaracion.declarante}
                        onChange={(e) => setNuevaDeclaracion(prev => ({ ...prev, declarante: e.target.value }))}
                        placeholder="Nombre completo"
                      />
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo de Declarante
                        </label>
                        <select
                          value={nuevaDeclaracion.tipoDeclarante}
                          onChange={(e) => setNuevaDeclaracion(prev => ({ 
                            ...prev, 
                            tipoDeclarante: e.target.value as DeclaracionAudiencia['tipoDeclarante'] 
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                        >
                          <option value="Infractor">Infractor</option>
                          <option value="Representante Legal">Representante Legal</option>
                          <option value="Testigo">Testigo</option>
                          <option value="Perito">Perito</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contenido de la Declaración
                      </label>
                      <textarea
                        value={nuevaDeclaracion.contenido}
                        onChange={(e) => setNuevaDeclaracion(prev => ({ ...prev, contenido: e.target.value }))}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                        placeholder="Transcriba la declaración del compareciente..."
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <CustomButton
                        variant="primary"
                        onClick={handleAgregarDeclaracion}
                        className="flex items-center gap-2"
                      >
                        <Icon name="Plus" size={16} />
                        Agregar Declaración
                      </CustomButton>
                    </div>
                  </div>
                </div>
                
                {/* Lista de declaraciones */}
                {declaraciones.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Icon name="List" size={18} />
                      Declaraciones Registradas ({declaraciones.length})
                    </h3>
                    
                    <div className="space-y-4">
                      {declaraciones.map((dec, index) => (
                        <div key={dec.id} className="p-4 bg-gray-50 rounded-lg border-l-4 border-aduana-azul">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold text-gray-900">{dec.declarante}</p>
                              <p className="text-sm text-gray-500">
                                {dec.tipoDeclarante} • {dec.fecha} {dec.hora}
                              </p>
                            </div>
                            <Badge variant="info">#{index + 1}</Badge>
                          </div>
                          <p className="text-gray-700 whitespace-pre-wrap">{dec.contenido}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Alegaciones generales */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Icon name="Edit3" size={18} />
                    Resumen de Alegaciones
                  </h3>
                  
                  <textarea
                    value={formData.alegaciones}
                    onChange={(e) => handleInputChange('alegaciones', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                    placeholder="Resumen de las alegaciones presentadas por el infractor..."
                  />
                </div>
              </>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <Icon name="UserX" size={48} className="mx-auto mb-3 text-gray-400" />
                <p className="font-medium text-gray-700">No se registran declaraciones</p>
                <p className="text-sm text-gray-500 mt-1">
                  El infractor no compareció a la audiencia, por lo que no es posible registrar declaraciones.
                </p>
              </div>
            )}
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Icon name="Scale" size={20} className="text-orange-600 mt-0.5" />
                <div>
                  <p className="font-medium text-orange-900">Paso 5: Determinar Resultado</p>
                  <p className="text-sm text-orange-700 mt-1">
                    Determine si el infractor acepta los cargos (allanamiento) o los rechaza (desacuerdo).
                    El allanamiento habilita el cálculo de multa atenuada.
                  </p>
                </div>
              </div>
            </div>
            
            {formData.infractorComparecio ? (
              <>
                {/* Allanamiento */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">¿El infractor acepta los cargos?</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label 
                      className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.allanamiento 
                          ? 'border-emerald-500 bg-emerald-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="allanamiento"
                        checked={formData.allanamiento}
                        onChange={() => handleInputChange('allanamiento', true)}
                        className="w-5 h-5 text-emerald-600"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <Icon name="CheckCircle" size={20} className="text-emerald-600" />
                          <span className="font-semibold text-gray-900">Allanamiento</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          El infractor acepta los cargos formulados
                        </p>
                      </div>
                    </label>
                    
                    <label 
                      className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        !formData.allanamiento 
                          ? 'border-amber-500 bg-amber-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="allanamiento"
                        checked={!formData.allanamiento}
                        onChange={() => handleInputChange('allanamiento', false)}
                        className="w-5 h-5 text-amber-600"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <Icon name="XCircle" size={20} className="text-amber-600" />
                          <span className="font-semibold text-gray-900">Desacuerdo</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          El infractor no acepta los cargos formulados
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
                
                {/* Cálculo de multa */}
                {calculoMulta && (
                  <div className={`rounded-lg p-6 ${
                    formData.allanamiento ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50 border border-gray-200'
                  }`}>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Icon name="Calculator" size={18} />
                      Cálculo de Multa
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-white rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Multa Original</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ${calculoMulta.multaOriginal.toLocaleString('es-CL')}
                        </p>
                      </div>
                      
                      {formData.allanamiento && (
                        <>
                          <div className="text-center p-4 bg-white rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">Reducción</p>
                            <p className="text-2xl font-bold text-emerald-600">
                              -{calculoMulta.porcentajeAtenuacion}%
                            </p>
                            <p className="text-xs text-gray-500">{calculoMulta.motivoAtenuacion}</p>
                          </div>
                          
                          <div className="text-center p-4 bg-emerald-100 rounded-lg">
                            <p className="text-sm text-emerald-700 mb-1">Multa Atenuada</p>
                            <p className="text-2xl font-bold text-emerald-700">
                              ${calculoMulta.multaAtenuada.toLocaleString('es-CL')}
                            </p>
                          </div>
                        </>
                      )}
                      
                      {!formData.allanamiento && (
                        <div className="col-span-2 text-center p-4 bg-amber-100 rounded-lg">
                          <p className="text-sm text-amber-700 mb-1">Sin reducción</p>
                          <p className="text-lg text-amber-800">
                            Al no haber allanamiento, se genera resultado provisional.
                            El infractor puede presentar reclamo administrativo.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* No Comparecencia */
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-100 rounded-full">
                    <Icon name="UserX" size={32} className="text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-900 text-lg">No Comparecencia</h3>
                    <p className="text-red-700 mt-2">
                      El infractor no compareció a la audiencia programada. De acuerdo con la normativa vigente,
                      se aplicará la <strong>multa máxima</strong> sin posibilidad de atenuación.
                    </p>
                    
                    {denuncia && (
                      <div className="mt-4 p-4 bg-white rounded-lg border border-red-200">
                        <p className="text-sm text-gray-600">Multa a aplicar:</p>
                        <p className="text-3xl font-bold text-red-600">
                          ${(denuncia.multaMaxima || denuncia.multa || 0).toLocaleString('es-CL')} CLP
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Observaciones */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="FileText" size={18} />
                Observaciones del Juez Instructor
              </h3>
              
              <textarea
                value={formData.observaciones}
                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                placeholder="Ingrese observaciones adicionales sobre el desarrollo de la audiencia..."
              />
            </div>
            
            {/* Resultado final */}
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Resultado de la Audiencia:</span>
                <Badge 
                  variant={
                    formData.resultado === 'Allanamiento' ? 'success' :
                    formData.resultado === 'No Comparecencia' ? 'error' :
                    formData.resultado === 'Desacuerdo' ? 'warning' : 'info'
                  }
                  className="text-lg px-4 py-2"
                >
                  {formData.resultado}
                </Badge>
              </div>
            </div>
            
            {/* Botón Finalizar */}
            <div className="flex justify-center mt-8">
              <CustomButton
                variant="primary"
                onClick={handleFinalizarAudiencia}
                className="flex items-center gap-2 px-8 py-3 text-lg bg-orange-600 hover:bg-orange-700"
              >
                <Icon name="CheckSquare" size={20} />
                Finalizar Audiencia
              </CustomButton>
            </div>
          </div>
        );
        
      case 6:
        return (
          <div className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Icon name="FileCheck" size={20} className="text-emerald-600 mt-0.5" />
                <div>
                  <p className="font-medium text-emerald-900">Paso 6: Generar Acta Preliminar</p>
                  <p className="text-sm text-emerald-700 mt-1">
                    Revise el resumen de la audiencia y genere el acta preliminar que quedará
                    registrada en el expediente digital de la denuncia.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Resumen de la audiencia */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Icon name="FileText" size={18} />
                  Resumen de la Audiencia
                </h3>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Datos generales */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">N° Audiencia</p>
                    <p className="font-semibold">{audiencia?.numeroAudiencia || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">N° Denuncia</p>
                    <p className="font-semibold">{denuncia?.numeroDenuncia || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fecha</p>
                    <p className="font-semibold">{audiencia?.fechaRealizacion || formData.fechaProgramada}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Hora</p>
                    <p className="font-semibold">{audiencia?.horaInicio} - {audiencia?.horaFin || 'En curso'}</p>
                  </div>
                </div>
                
                <hr className="border-gray-200" />
                
                {/* Infractor */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Infractor</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Nombre/Razón Social</p>
                      <p className="font-semibold">{denuncia?.nombreDeudor}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">RUT</p>
                      <p className="font-semibold">{denuncia?.rutDeudor}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Comparecencia</p>
                      <Badge variant={formData.infractorComparecio ? 'success' : 'error'}>
                        {formData.infractorComparecio ? 'Compareció' : 'No Compareció'}
                      </Badge>
                    </div>
                    {formData.representanteLegal && (
                      <div>
                        <p className="text-sm text-gray-500">Representante</p>
                        <p className="font-semibold">{formData.representanteLegal}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <hr className="border-gray-200" />
                
                {/* Resultado */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Resultado</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Determinación</p>
                      <Badge 
                        variant={
                          formData.resultado === 'Allanamiento' ? 'success' :
                          formData.resultado === 'No Comparecencia' ? 'error' : 'warning'
                        }
                        className="mt-1"
                      >
                        {formData.resultado}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Allanamiento</p>
                      <p className="font-semibold">{formData.allanamiento ? 'Sí' : 'No'}</p>
                    </div>
                    <div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Multa Aplicable</p>
                      <p className="font-bold text-lg">
                        ${(formData.allanamiento && calculoMulta 
                          ? calculoMulta.multaAtenuada 
                          : (denuncia?.multaMaxima || denuncia?.multa || 0)
                        ).toLocaleString('es-CL')}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Declaraciones */}
                {declaraciones.length > 0 && (
                  <>
                    <hr className="border-gray-200" />
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Declaraciones Registradas ({declaraciones.length})
                      </h4>
                      <div className="space-y-2">
                        {declaraciones.map((dec, i) => (
                          <div key={dec.id} className="p-3 bg-gray-50 rounded-lg text-sm">
                            <p className="font-medium">{dec.declarante} ({dec.tipoDeclarante})</p>
                            <p className="text-gray-600 mt-1">{dec.contenido.substring(0, 150)}...</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                
                {/* Antecedentes */}
                {antecedentes.length > 0 && (
                  <>
                    <hr className="border-gray-200" />
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Antecedentes Entregados ({antecedentes.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {antecedentes.map((ant) => (
                          <span key={ant.id} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                            <Icon name="File" size={14} />
                            {ant.nombre}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                
                {/* Alegaciones */}
                {formData.alegaciones && (
                  <>
                    <hr className="border-gray-200" />
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Alegaciones</h4>
                      <p className="text-gray-700 whitespace-pre-wrap">{formData.alegaciones}</p>
                    </div>
                  </>
                )}
                
                {/* Observaciones */}
                {formData.observaciones && (
                  <>
                    <hr className="border-gray-200" />
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Observaciones</h4>
                      <p className="text-gray-700 whitespace-pre-wrap">{formData.observaciones}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Información del acta */}
            {audiencia?.actaGenerada ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-100 rounded-full">
                    <Icon name="CheckCircle" size={32} className="text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-900 text-lg">Acta Generada Exitosamente</h3>
                    <p className="text-emerald-700">
                      N° Acta: <strong>{audiencia.numeroActa}</strong>
                    </p>
                    <p className="text-sm text-emerald-600 mt-1">
                      Fecha: {audiencia.fechaActa}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <CustomButton
                  variant="primary"
                  onClick={handleGenerarActa}
                  className="flex items-center gap-2 px-8 py-3 text-lg bg-emerald-600 hover:bg-emerald-700"
                >
                  <Icon name="FileCheck" size={20} />
                  Generar Acta Preliminar
                </CustomButton>
              </div>
            )}
            
            {/* Próximos pasos */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Próximos Pasos</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                {formData.resultado === 'Allanamiento' && (
                  <>
                    <li>• El acta será incorporada al expediente digital</li>
                    <li>• Se emitirá el cargo con la multa atenuada</li>
                    <li>• El infractor deberá pagar dentro del plazo establecido</li>
                  </>
                )}
                {formData.resultado === 'Desacuerdo' && (
                  <>
                    <li>• Se genera resultado provisional</li>
                    <li>• El infractor tiene derecho a presentar reclamo administrativo</li>
                    <li>• El plazo para reclamar es de 15 días hábiles</li>
                  </>
                )}
                {formData.resultado === 'No Comparecencia' && (
                  <>
                    <li>• Se aplicará multa máxima sin atenuación</li>
                    <li>• Se procederá a emitir el cargo correspondiente</li>
                    <li>• El infractor podrá presentar descargos por escrito</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Si no hay denuncia, mostrar error
  if (!denuncia && !isLoading) {
    return (
      <CustomLayout
        platformName="Sistema de Tramitación de Denuncias"
        sidebarItems={CONSTANTS_APP.ITEMS_SIDEBAR_MENU}
        options={[]}
        onLogout={() => navigate(ERoutePaths.LOGIN)}
        notifications={allNotifications}
        user={{
          initials: usuarioActual.initials,
          name: usuarioActual.name,
          email: usuarioActual.email,
          role: usuarioActual.role,
        }}
      >
        <div className="min-h-full flex items-center justify-center">
          <div className="text-center">
            <Icon name="AlertCircle" size={64} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Denuncia no encontrada</h2>
            <p className="text-gray-600 mb-4">No se encontró la denuncia especificada.</p>
            <CustomButton variant="primary" onClick={() => navigate(ERoutePaths.DENUNCIAS)}>
              Volver a Denuncias
            </CustomButton>
          </div>
        </div>
      </CustomLayout>
    );
  }
  
  return (
    <CustomLayout
      platformName="Sistema de Tramitación de Denuncias"
      sidebarItems={CONSTANTS_APP.ITEMS_SIDEBAR_MENU}
      options={[]}
      onLogout={() => navigate(ERoutePaths.LOGIN)}
      notifications={allNotifications}
      user={{
        initials: usuarioActual.initials,
        name: usuarioActual.name,
        email: usuarioActual.email,
        role: usuarioActual.role,
      }}
    >
      <div className="min-h-full space-y-4 animate-fade-in pb-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon name="ArrowLeft" size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Registrar Audiencia
            </h1>
            <p className="text-gray-600">
              Realizar Audiencia - Denuncia N° {denuncia?.numeroDenuncia}
            </p>
          </div>
          {audiencia && (
            <Badge variant="info" className="ml-auto">
              {audiencia.numeroAudiencia}
            </Badge>
          )}
        </div>
        
        <div className="card p-6">
          <Stepper
            steps={steps}
            activeStep={currentStep}
            onStepChange={(stepId) => {
              // Solo permitir navegar si la audiencia ya inició
              if (audienciaIniciada || stepId === 1) {
                setCurrentStep(Number(stepId));
              }
            }}
            showDescription={false}
            className="mb-8"
          />
          
          {/* Content */}
          <div className="min-h-[500px]">
            {renderStepContent()}
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <CustomButton
              variant="secondary"
              onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <Icon name="ChevronLeft" size={16} />
              Anterior
            </CustomButton>
            
            <div className="flex gap-3">
              <CustomButton 
                variant="secondary"
                onClick={() => navigate(-1)}
              >
                Cancelar
              </CustomButton>
              
              {currentStep < totalSteps && currentStep !== 5 && audienciaIniciada && (
                <CustomButton
                  variant="primary"
                  onClick={handleNextStep}
                  className="flex items-center gap-2"
                >
                  Siguiente
                  <Icon name="ChevronRight" size={16} />
                </CustomButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </CustomLayout>
  );
};

export default AudienciaForm;
