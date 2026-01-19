/**
 * EmitirActaAudiencia.tsx - Emitir Acta de Audiencia y Resultado
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 * 
 * Como administrador de la Unidad de Audiencias, para formalizar la decisión tomada 
 * en la audiencia, quiero emitir el acta oficial con los hechos, argumentos, asistencia 
 * y multa o absolución, dejándola disponible en el expediente digital.
 * 
 * Criterios de aceptación:
 * - Acta debe contener: datos del infractor, detalle de audiencia, comparecencia, 
 *   allanamiento/desacuerdo, multa o absolución.
 * - Debe generar PDF almacenado en expediente.
 * - Estado de denuncia cambia de estado según corresponda (Ej. "Multada, Absuelta, Allanada").
 * 
 * Secuencia:
 * 1 – Abrir/revisar acta preliminar.
 * 2 – Completar/editar datos.
 * 3 – Firmar digitalmente.
 * 4 – Emitir documento.
 */

import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Icon } from "he-button-custom-library";
import CONSTANTS_APP from "../../constants/sidebar-menu";
import CustomLayout from "../../Layout/Layout";
import InputField from "../../organisms/InputField/InputField";
import { CustomButton } from "../../components/Button/Button";
import { Badge, Stepper, useToast, Modal, Timeline } from "../../components/UI";
import { ERoutePaths } from "../../routes/routes";

// Datos centralizados
import {
  getTodasLasNotificaciones,
  usuarioActual,
  getDenunciaPorId,
  getAudienciaPorId,
  getAudienciasPorDenuncia,
  actualizarAudiencia,
  generarNumeroActa,
  type Audiencia,
  type TipoResultadoAudiencia,
} from '../../data';

// Tipos para el acta
export type ResultadoActa = 'Multada' | 'Absuelta' | 'Allanada';
export type EstadoActaEmision = 'revision' | 'edicion' | 'firma' | 'emitida';

export interface DatosActaAudiencia {
  // Identificadores
  numeroActa: string;
  numeroAudiencia: string;
  numeroDenuncia: string;
  
  // Datos del infractor
  infractorRut: string;
  infractorNombre: string;
  infractorDireccion?: string;
  representanteLegal?: string;
  
  // Datos de la audiencia
  fechaAudiencia: string;
  horaInicio: string;
  horaFin: string;
  lugarAudiencia: string;
  modalidad: string;
  juezInstructor: string;
  
  // Comparecencia
  comparecio: boolean;
  personaQueComparecio?: string;
  
  // Resultado
  resultado: TipoResultadoAudiencia;
  resultadoFinal: ResultadoActa;
  allanamiento: boolean;
  
  // Hechos y argumentos
  hechosImputados: string;
  argumentosDefensa?: string;
  fundamentosResolucion: string;
  
  // Multa o absolución
  multaOriginal: number;
  multaFinal: number;
  porcentajeAtenuacion?: number;
  absolucion: boolean;
  motivoAbsolucion?: string;
  
  // Artículo infringido
  articuloInfringido: string;
  normaAplicable: string;
  
  // Observaciones
  observaciones?: string;
  
  // Firma digital
  firmaDigital: boolean;
  fechaFirma?: string;
  certificadoFirma?: string;
  hashDocumento?: string;
  
  // PDF
  pdfGenerado: boolean;
  rutaPdf?: string;
}

// Steps del proceso de emisión
const stepsEmision = [
  { id: 1, label: 'Revisar Acta', description: 'Revisar datos preliminares' },
  { id: 2, label: 'Completar Datos', description: 'Editar y completar campos' },
  { id: 3, label: 'Firmar', description: 'Firma digital del documento' },
  { id: 4, label: 'Emitir', description: 'Generar PDF y emitir acta' },
];

export const EmitirActaAudiencia: React.FC = () => {
  const navigate = useNavigate();
  const { audienciaId } = useParams<{ audienciaId: string }>();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  
  // Estados
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showFirmaModal, setShowFirmaModal] = useState(false);
  const [firmaEnProceso, setFirmaEnProceso] = useState(false);
  const [actaEmitida, setActaEmitida] = useState(false);
  
  // Notificaciones
  const allNotifications = useMemo(() => getTodasLasNotificaciones(), []);
  
  // Cargar audiencia
  const audiencia = useMemo(() => {
    if (audienciaId) {
      return getAudienciaPorId(audienciaId);
    }
    // Si viene de una denuncia, obtener la audiencia más reciente
    const denunciaId = searchParams.get('denunciaId');
    if (denunciaId) {
      const audiencias = getAudienciasPorDenuncia(denunciaId);
      return audiencias.find(a => a.estado === 'Finalizada' && !a.actaGenerada) || audiencias[0];
    }
    return null;
  }, [audienciaId, searchParams]);
  
  // Cargar denuncia
  const denuncia = useMemo(() => {
    if (audiencia?.denunciaId) {
      return getDenunciaPorId(audiencia.denunciaId);
    }
    return null;
  }, [audiencia]);
  
  // Estado del formulario del acta
  const [datosActa, setDatosActa] = useState<DatosActaAudiencia>({
    numeroActa: '',
    numeroAudiencia: '',
    numeroDenuncia: '',
    infractorRut: '',
    infractorNombre: '',
    infractorDireccion: '',
    representanteLegal: '',
    fechaAudiencia: '',
    horaInicio: '',
    horaFin: '',
    lugarAudiencia: '',
    modalidad: '',
    juezInstructor: '',
    comparecio: false,
    personaQueComparecio: '',
    resultado: 'Pendiente',
    resultadoFinal: 'Multada',
    allanamiento: false,
    hechosImputados: '',
    argumentosDefensa: '',
    fundamentosResolucion: '',
    multaOriginal: 0,
    multaFinal: 0,
    porcentajeAtenuacion: 0,
    absolucion: false,
    motivoAbsolucion: '',
    articuloInfringido: '',
    normaAplicable: '',
    observaciones: '',
    firmaDigital: false,
    fechaFirma: '',
    certificadoFirma: '',
    hashDocumento: '',
    pdfGenerado: false,
    rutaPdf: '',
  });
  
  // Inicializar datos del acta desde la audiencia y denuncia
  useEffect(() => {
    if (audiencia && denuncia) {
      setDatosActa(prev => ({
        ...prev,
        numeroActa: generarNumeroActa(),
        numeroAudiencia: audiencia.numeroAudiencia,
        numeroDenuncia: audiencia.numeroDenuncia,
        infractorRut: audiencia.infractorRut,
        infractorNombre: audiencia.infractorNombre,
        infractorDireccion: denuncia.involucrados?.[0]?.direccion || '',
        representanteLegal: audiencia.representanteLegal || '',
        fechaAudiencia: audiencia.fechaRealizacion || audiencia.fechaProgramada,
        horaInicio: audiencia.horaInicio || audiencia.horaProgramada,
        horaFin: audiencia.horaFin || '',
        lugarAudiencia: `${audiencia.sala}, ${audiencia.direccion}`,
        modalidad: audiencia.modalidad,
        juezInstructor: audiencia.juezInstructor,
        comparecio: audiencia.infractorComparecio,
        personaQueComparecio: audiencia.representanteLegal || audiencia.infractorNombre,
        resultado: audiencia.resultado,
        resultadoFinal: determinarResultadoFinal(audiencia),
        allanamiento: audiencia.allanamiento,
        hechosImputados: denuncia.descripcionHechos || '',
        argumentosDefensa: audiencia.alegaciones || '',
        fundamentosResolucion: generarFundamentosResolucion(audiencia, denuncia),
        multaOriginal: audiencia.multaOriginal,
        multaFinal: audiencia.allanamiento ? (audiencia.multaAtenuada || audiencia.multaOriginal) : audiencia.multaOriginal,
        porcentajeAtenuacion: audiencia.porcentajeAtenuacion || 0,
        absolucion: false,
        articuloInfringido: `Art. ${denuncia.codigoArticulo}`,
        normaAplicable: denuncia.normaInfringida || 'Ordenanza de Aduanas',
        observaciones: audiencia.observaciones || '',
      }));
    }
  }, [audiencia, denuncia]);
  
  // Determinar resultado final basado en la audiencia
  const determinarResultadoFinal = (aud: Audiencia): ResultadoActa => {
    if (aud.allanamiento) return 'Allanada';
    if (aud.resultado === 'No Comparecencia') return 'Multada';
    if (aud.resultado === 'Desacuerdo') return 'Multada';
    return 'Multada';
  };
  
  // Generar fundamentos de la resolución
  const generarFundamentosResolucion = (aud: Audiencia, den: any): string => {
    let fundamentos = `De conformidad con lo establecido en ${den.normaInfringida || 'la Ordenanza de Aduanas'}, `;
    
    if (aud.allanamiento) {
      fundamentos += `y habiéndose producido el allanamiento del infractor en la audiencia celebrada el ${aud.fechaRealizacion || aud.fechaProgramada}, `;
      fundamentos += `se resuelve aplicar la multa atenuada correspondiente al ${aud.porcentajeAtenuacion || 40}% de reducción sobre la multa original.`;
    } else if (aud.resultado === 'No Comparecencia') {
      fundamentos += `y no habiendo comparecido el infractor a la audiencia programada, `;
      fundamentos += `se resuelve aplicar la multa máxima establecida en la normativa vigente.`;
    } else {
      fundamentos += `y habiendo presentado el infractor sus alegaciones y defensas, `;
      fundamentos += `las cuales fueron evaluadas y ponderadas, se resuelve mantener la multa originalmente determinada.`;
    }
    
    return fundamentos;
  };
  
  // Handler para cambios en el formulario
  const handleInputChange = (field: keyof DatosActaAudiencia, value: any) => {
    setDatosActa(prev => {
      const newData = { ...prev, [field]: value };
      
      // Si se marca absolución, la multa final es 0
      if (field === 'absolucion' && value === true) {
        newData.multaFinal = 0;
        newData.resultadoFinal = 'Absuelta';
      }
      
      // Si se desmarca absolución, restaurar multa
      if (field === 'absolucion' && value === false && audiencia) {
        newData.multaFinal = audiencia.allanamiento 
          ? (audiencia.multaAtenuada || audiencia.multaOriginal) 
          : audiencia.multaOriginal;
        newData.resultadoFinal = determinarResultadoFinal(audiencia);
      }
      
      return newData;
    });
    
    // Limpiar error
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  // Validación por paso
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1: // Revisar
        // Solo verificar que existan los datos básicos
        if (!datosActa.numeroAudiencia) newErrors.numeroAudiencia = 'No hay audiencia asociada';
        if (!datosActa.numeroDenuncia) newErrors.numeroDenuncia = 'No hay denuncia asociada';
        break;
        
      case 2: // Completar datos
        if (!datosActa.hechosImputados || datosActa.hechosImputados.length < 50) {
          newErrors.hechosImputados = 'Los hechos imputados deben tener al menos 50 caracteres';
        }
        if (!datosActa.fundamentosResolucion || datosActa.fundamentosResolucion.length < 50) {
          newErrors.fundamentosResolucion = 'Los fundamentos deben tener al menos 50 caracteres';
        }
        if (datosActa.absolucion && !datosActa.motivoAbsolucion) {
          newErrors.motivoAbsolucion = 'Debe indicar el motivo de la absolución';
        }
        break;
        
      case 3: // Firmar
        if (!datosActa.firmaDigital) {
          newErrors.firmaDigital = 'Debe firmar digitalmente el documento';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Navegar al siguiente paso
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };
  
  // Navegar al paso anterior
  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  // Simular proceso de firma digital
  const handleFirmaDigital = async () => {
    setFirmaEnProceso(true);
    
    // Simular proceso de firma (3 segundos)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const fechaFirma = new Date().toISOString();
    const hashDocumento = `SHA256-${Date.now()}-${Math.random().toString(36).substr(2, 16).toUpperCase()}`;
    
    setDatosActa(prev => ({
      ...prev,
      firmaDigital: true,
      fechaFirma: fechaFirma,
      certificadoFirma: `CN=${usuarioActual.name}, O=Servicio Nacional de Aduanas, C=CL`,
      hashDocumento: hashDocumento,
    }));
    
    setFirmaEnProceso(false);
    setShowFirmaModal(false);
    
    showToast({
      type: 'success',
      title: 'Documento Firmado',
      message: 'El acta ha sido firmada digitalmente con éxito.',
      duration: 3000,
    });
    
    // Avanzar automáticamente al siguiente paso
    setCurrentStep(4);
  };
  
  // Emitir acta y generar PDF
  const handleEmitirActa = async () => {
    if (!validateStep(3)) return;
    
    setIsLoading(true);
    
    try {
      // Simular generación de PDF (2 segundos)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Actualizar datos del acta
      const rutaPdf = `/expedientes/audiencias/${datosActa.numeroActa.replace(/\//g, '-')}.pdf`;
      
      setDatosActa(prev => ({
        ...prev,
        pdfGenerado: true,
        rutaPdf: rutaPdf,
      }));
      
      // Actualizar la audiencia en la base de datos mock
      if (audiencia) {
        actualizarAudiencia(audiencia.id, {
          actaGenerada: true,
          numeroActa: datosActa.numeroActa,
          fechaActa: new Date().toLocaleDateString('es-CL', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
          }).split('/').join('-'),
          usuarioModificacion: usuarioActual.login,
        });
      }
      
      setActaEmitida(true);
      setShowConfirmModal(false);
      
      showToast({
        type: 'success',
        title: 'Acta Emitida',
        message: `El Acta de Audiencia N° ${datosActa.numeroActa} ha sido emitida y almacenada en el expediente digital.`,
        duration: 5000,
      });
      
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error al emitir',
        message: 'Ocurrió un error al generar el PDF. Por favor, intente nuevamente.',
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Renderizar contenido según el paso actual
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderPasoRevision();
      case 2:
        return renderPasoEdicion();
      case 3:
        return renderPasoFirma();
      case 4:
        return renderPasoEmision();
      default:
        return null;
    }
  };
  
  // ============================================
  // PASO 1: REVISAR ACTA PRELIMINAR
  // ============================================
  const renderPasoRevision = () => (
    <div className="space-y-6">
      {/* Información del paso */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="FileSearch" size={20} className="text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900">Paso 1: Revisar Acta Preliminar</p>
            <p className="text-sm text-blue-700 mt-1">
              Revise los datos del acta generada automáticamente a partir de la audiencia realizada.
              Verifique que toda la información sea correcta antes de continuar.
            </p>
          </div>
        </div>
      </div>
      
      {/* Vista previa del Acta */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="FileText" size={24} className="text-white" />
              <div>
                <h2 className="text-white font-bold text-lg">ACTA DE AUDIENCIA Y RESULTADO</h2>
                <p className="text-gray-300 text-sm">N° {datosActa.numeroActa}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-300 text-xs">Servicio Nacional de Aduanas</p>
              <p className="text-white font-semibold">República de Chile</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Encabezado */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">N° Audiencia</p>
              <p className="font-semibold">{datosActa.numeroAudiencia}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">N° Denuncia</p>
              <p className="font-semibold">{datosActa.numeroDenuncia}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Fecha</p>
              <p className="font-semibold">{datosActa.fechaAudiencia}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Resultado</p>
              <Badge 
                variant={
                  datosActa.resultadoFinal === 'Allanada' ? 'success' :
                  datosActa.resultadoFinal === 'Absuelta' ? 'info' : 'warning'
                }
              >
                {datosActa.resultadoFinal}
              </Badge>
            </div>
          </div>
          
          {/* Datos del Infractor */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Icon name="User" size={16} />
                Datos del Infractor
              </h3>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nombre/Razón Social</p>
                <p className="font-medium">{datosActa.infractorNombre}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">RUT</p>
                <p className="font-medium">{datosActa.infractorRut}</p>
              </div>
              {datosActa.infractorDireccion && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Dirección</p>
                  <p className="font-medium">{datosActa.infractorDireccion}</p>
                </div>
              )}
              {datosActa.representanteLegal && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Representante Legal</p>
                  <p className="font-medium">{datosActa.representanteLegal}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Detalle de la Audiencia */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Icon name="Calendar" size={16} />
                Detalle de Audiencia
              </h3>
            </div>
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Fecha</p>
                <p className="font-medium">{datosActa.fechaAudiencia}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Hora Inicio</p>
                <p className="font-medium">{datosActa.horaInicio}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Hora Fin</p>
                <p className="font-medium">{datosActa.horaFin || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Modalidad</p>
                <p className="font-medium">{datosActa.modalidad}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Lugar</p>
                <p className="font-medium">{datosActa.lugarAudiencia}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Juez Instructor</p>
                <p className="font-medium">{datosActa.juezInstructor}</p>
              </div>
            </div>
          </div>
          
          {/* Comparecencia */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Icon name="Users" size={16} />
                Comparecencia
              </h3>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-4">
                <Badge variant={datosActa.comparecio ? 'success' : 'error'}>
                  {datosActa.comparecio ? 'Compareció' : 'No Compareció'}
                </Badge>
                {datosActa.comparecio && datosActa.personaQueComparecio && (
                  <span className="text-gray-600">
                    Persona: <strong>{datosActa.personaQueComparecio}</strong>
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Allanamiento/Desacuerdo */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Icon name="Scale" size={16} />
                Determinación
              </h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Resultado Audiencia</p>
                  <Badge 
                    variant={
                      datosActa.resultado === 'Allanamiento' ? 'success' :
                      datosActa.resultado === 'No Comparecencia' ? 'error' : 'warning'
                    }
                  >
                    {datosActa.resultado}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Allanamiento</p>
                  <p className="font-medium">{datosActa.allanamiento ? 'Sí' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Artículo Infringido</p>
                  <p className="font-medium">{datosActa.articuloInfringido}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Norma Aplicable</p>
                  <p className="font-medium">{datosActa.normaAplicable}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Multa o Absolución */}
          <div className={`border rounded-lg overflow-hidden ${
            datosActa.absolucion 
              ? 'border-green-300 bg-green-50' 
              : 'border-amber-300 bg-amber-50'
          }`}>
            <div className={`px-4 py-2 border-b ${
              datosActa.absolucion 
                ? 'bg-green-100 border-green-300' 
                : 'bg-amber-100 border-amber-300'
            }`}>
              <h3 className="font-semibold flex items-center gap-2">
                <Icon name={datosActa.absolucion ? 'CheckCircle' : 'AlertCircle'} size={16} />
                {datosActa.absolucion ? 'Absolución' : 'Multa Aplicada'}
              </h3>
            </div>
            <div className="p-4">
              {datosActa.absolucion ? (
                <div>
                  <p className="text-green-800 font-medium text-lg">
                    El infractor ha sido absuelto de los cargos formulados.
                  </p>
                  {datosActa.motivoAbsolucion && (
                    <p className="text-green-700 mt-2">
                      Motivo: {datosActa.motivoAbsolucion}
                    </p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-sm text-gray-500">Multa Original</p>
                    <p className="text-xl font-bold text-gray-900">
                      ${datosActa.multaOriginal.toLocaleString('es-CL')}
                    </p>
                  </div>
                  {datosActa.allanamiento && datosActa.porcentajeAtenuacion && (
                    <div className="text-center p-3 bg-white rounded-lg">
                      <p className="text-sm text-gray-500">Reducción</p>
                      <p className="text-xl font-bold text-green-600">
                        -{datosActa.porcentajeAtenuacion}%
                      </p>
                    </div>
                  )}
                  <div className="text-center p-3 bg-white rounded-lg border-2 border-amber-400">
                    <p className="text-sm text-gray-500">Multa Final</p>
                    <p className="text-2xl font-bold text-amber-700">
                      ${datosActa.multaFinal.toLocaleString('es-CL')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Validación */}
      {errors.numeroAudiencia || errors.numeroDenuncia ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 font-medium">No es posible continuar</p>
          <p className="text-red-600 text-sm mt-1">
            {errors.numeroAudiencia || errors.numeroDenuncia}
          </p>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Icon name="CheckCircle" size={20} className="text-emerald-600" />
            <p className="text-emerald-700 font-medium">
              Los datos preliminares están completos. Puede continuar al siguiente paso.
            </p>
          </div>
        </div>
      )}
    </div>
  );
  
  // ============================================
  // PASO 2: COMPLETAR/EDITAR DATOS
  // ============================================
  const renderPasoEdicion = () => (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Edit3" size={20} className="text-amber-600 mt-0.5" />
          <div>
            <p className="font-medium text-amber-900">Paso 2: Completar/Editar Datos</p>
            <p className="text-sm text-amber-700 mt-1">
              Complete o modifique los campos del acta según corresponda. Los campos marcados 
              con asterisco (*) son obligatorios.
            </p>
          </div>
        </div>
      </div>
      
      {/* Hechos Imputados */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="FileText" size={18} />
          Hechos Imputados <span className="text-red-500">*</span>
        </h3>
        <textarea
          value={datosActa.hechosImputados}
          onChange={(e) => handleInputChange('hechosImputados', e.target.value)}
          rows={5}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-aduana-azul focus:border-transparent ${
            errors.hechosImputados ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Describa detalladamente los hechos que se imputan al infractor..."
        />
        {errors.hechosImputados && (
          <p className="text-red-500 text-sm mt-1">{errors.hechosImputados}</p>
        )}
        <p className="text-gray-500 text-xs mt-1">
          {datosActa.hechosImputados.length} caracteres (mínimo 50)
        </p>
      </div>
      
      {/* Argumentos de la Defensa */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="MessageSquare" size={18} />
          Argumentos de la Defensa
        </h3>
        <textarea
          value={datosActa.argumentosDefensa}
          onChange={(e) => handleInputChange('argumentosDefensa', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
          placeholder="Registre los argumentos presentados por el infractor o su representante..."
        />
      </div>
      
      {/* Fundamentos de la Resolución */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="BookOpen" size={18} />
          Fundamentos de la Resolución <span className="text-red-500">*</span>
        </h3>
        <textarea
          value={datosActa.fundamentosResolucion}
          onChange={(e) => handleInputChange('fundamentosResolucion', e.target.value)}
          rows={5}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-aduana-azul focus:border-transparent ${
            errors.fundamentosResolucion ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Indique los fundamentos legales y de hecho que sustentan la resolución..."
        />
        {errors.fundamentosResolucion && (
          <p className="text-red-500 text-sm mt-1">{errors.fundamentosResolucion}</p>
        )}
        <p className="text-gray-500 text-xs mt-1">
          {datosActa.fundamentosResolucion.length} caracteres (mínimo 50)
        </p>
      </div>
      
      {/* Absolución */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="Scale" size={18} />
          Determinación Final
        </h3>
        
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={datosActa.absolucion}
              onChange={(e) => handleInputChange('absolucion', e.target.checked)}
              className="w-5 h-5 text-emerald-600 rounded"
            />
            <span className="font-medium">Declarar Absolución</span>
            <span className="text-sm text-gray-500">
              (El infractor será absuelto de los cargos y no se aplicará multa)
            </span>
          </label>
          
          {datosActa.absolucion && (
            <div className="ml-8 mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo de la Absolución <span className="text-red-500">*</span>
              </label>
              <textarea
                value={datosActa.motivoAbsolucion}
                onChange={(e) => handleInputChange('motivoAbsolucion', e.target.value)}
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-aduana-azul focus:border-transparent ${
                  errors.motivoAbsolucion ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Explique los motivos por los cuales se absuelve al infractor..."
              />
              {errors.motivoAbsolucion && (
                <p className="text-red-500 text-sm mt-1">{errors.motivoAbsolucion}</p>
              )}
            </div>
          )}
        </div>
        
        {/* Resumen de la decisión */}
        <div className={`mt-6 p-4 rounded-lg ${
          datosActa.absolucion ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Resultado Final:</p>
              <Badge 
                variant={
                  datosActa.resultadoFinal === 'Allanada' ? 'success' :
                  datosActa.resultadoFinal === 'Absuelta' ? 'info' : 'warning'
                }
                className="mt-1"
              >
                {datosActa.resultadoFinal}
              </Badge>
            </div>
            <div className="text-right">
              <p className="font-medium">Multa a Aplicar:</p>
              <p className={`text-2xl font-bold ${
                datosActa.absolucion ? 'text-emerald-600' : 'text-amber-700'
              }`}>
                {datosActa.absolucion ? '$0' : `$${datosActa.multaFinal.toLocaleString('es-CL')}`}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Observaciones */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="FileEdit" size={18} />
          Observaciones Adicionales
        </h3>
        <textarea
          value={datosActa.observaciones}
          onChange={(e) => handleInputChange('observaciones', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
          placeholder="Agregue observaciones adicionales si corresponde..."
        />
      </div>
    </div>
  );
  
  // ============================================
  // PASO 3: FIRMA DIGITAL
  // ============================================
  const renderPasoFirma = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="PenTool" size={20} className="text-purple-600 mt-0.5" />
          <div>
            <p className="font-medium text-purple-900">Paso 3: Firma Digital</p>
            <p className="text-sm text-purple-700 mt-1">
              El acta debe ser firmada digitalmente antes de ser emitida. La firma garantiza
              la autenticidad e integridad del documento.
            </p>
          </div>
        </div>
      </div>
      
      {/* Estado de la firma */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Estado de la Firma Digital</h3>
        </div>
        
        <div className="p-6">
          {datosActa.firmaDigital ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="p-3 bg-emerald-100 rounded-full">
                  <Icon name="CheckCircle" size={32} className="text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-900 text-lg">Documento Firmado</p>
                  <p className="text-emerald-700">
                    El acta ha sido firmada digitalmente y está lista para ser emitida.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Certificado</p>
                  <p className="font-mono text-sm">{datosActa.certificadoFirma}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha y Hora</p>
                  <p className="font-medium">
                    {datosActa.fechaFirma ? new Date(datosActa.fechaFirma).toLocaleString('es-CL') : '-'}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Hash del Documento</p>
                  <p className="font-mono text-sm break-all">{datosActa.hashDocumento}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Icon name="PenTool" size={48} className="text-gray-400" />
              </div>
              <p className="text-gray-600 mb-2">El documento aún no ha sido firmado</p>
              <p className="text-sm text-gray-500 mb-6">
                Haga clic en el botón para iniciar el proceso de firma digital
              </p>
              
              <CustomButton
                variant="primary"
                onClick={() => setShowFirmaModal(true)}
                className="flex items-center gap-2 mx-auto px-8 py-3 text-lg bg-purple-600 hover:bg-purple-700"
              >
                <Icon name="PenTool" size={20} />
                Firmar Digitalmente
              </CustomButton>
            </div>
          )}
        </div>
      </div>
      
      {/* Información de seguridad */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
          <Icon name="Shield" size={16} />
          Información de Seguridad
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• La firma digital garantiza la autenticidad del documento</li>
          <li>• El hash SHA-256 permite verificar la integridad del contenido</li>
          <li>• La firma queda vinculada al certificado del funcionario firmante</li>
          <li>• El documento firmado no puede ser modificado sin invalidar la firma</li>
        </ul>
      </div>
      
      {errors.firmaDigital && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 flex items-center gap-2">
            <Icon name="AlertCircle" size={16} />
            {errors.firmaDigital}
          </p>
        </div>
      )}
    </div>
  );
  
  // ============================================
  // PASO 4: EMITIR ACTA
  // ============================================
  const renderPasoEmision = () => (
    <div className="space-y-6">
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="FileCheck" size={20} className="text-emerald-600 mt-0.5" />
          <div>
            <p className="font-medium text-emerald-900">Paso 4: Emitir Acta de Audiencia</p>
            <p className="text-sm text-emerald-700 mt-1">
              Revise el resumen final y emita el acta oficial. Se generará un PDF que quedará
              almacenado en el expediente digital de la denuncia.
            </p>
          </div>
        </div>
      </div>
      
      {actaEmitida ? (
        /* Acta emitida exitosamente */
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-emerald-500 px-6 py-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white flex items-center justify-center">
              <Icon name="CheckCircle" size={48} className="text-emerald-500" />
            </div>
            <h2 className="text-white text-2xl font-bold">¡Acta Emitida Exitosamente!</h2>
            <p className="text-emerald-100 mt-2">
              El Acta de Audiencia N° {datosActa.numeroActa} ha sido generada y almacenada.
            </p>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Resumen de la emisión */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Icon name="FileText" size={24} className="mx-auto text-gray-600 mb-2" />
                <p className="text-sm text-gray-500">N° Acta</p>
                <p className="font-bold">{datosActa.numeroActa}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Icon name="Calendar" size={24} className="mx-auto text-gray-600 mb-2" />
                <p className="text-sm text-gray-500">Fecha Emisión</p>
                <p className="font-bold">{new Date().toLocaleDateString('es-CL')}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Icon name="Scale" size={24} className="mx-auto text-gray-600 mb-2" />
                <p className="text-sm text-gray-500">Resultado</p>
                <Badge 
                  variant={
                    datosActa.resultadoFinal === 'Allanada' ? 'success' :
                    datosActa.resultadoFinal === 'Absuelta' ? 'info' : 'warning'
                  }
                >
                  {datosActa.resultadoFinal}
                </Badge>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Icon name="DollarSign" size={24} className="mx-auto text-gray-600 mb-2" />
                <p className="text-sm text-gray-500">Multa Final</p>
                <p className="font-bold text-amber-700">
                  ${datosActa.multaFinal.toLocaleString('es-CL')}
                </p>
              </div>
            </div>
            
            {/* PDF generado */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Icon name="FileText" size={24} className="text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium">Acta_Audiencia_{datosActa.numeroActa.replace(/\//g, '-')}.pdf</p>
                    <p className="text-sm text-gray-500">Almacenado en expediente digital</p>
                  </div>
                </div>
                <CustomButton variant="secondary" className="flex items-center gap-2">
                  <Icon name="Download" size={16} />
                  Descargar PDF
                </CustomButton>
              </div>
            </div>
            
            {/* Próximos pasos */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="font-medium text-amber-900 mb-3">Próximos Pasos</h4>
              <ul className="text-sm text-amber-800 space-y-2">
                {datosActa.resultadoFinal === 'Allanada' && (
                  <>
                    <li className="flex items-start gap-2">
                      <Icon name="CheckCircle" size={16} className="mt-0.5 text-amber-600" />
                      Se ha actualizado el estado de la denuncia a "Allanada"
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Receipt" size={16} className="mt-0.5 text-amber-600" />
                      Proceder a emitir el cargo con la multa atenuada de ${datosActa.multaFinal.toLocaleString('es-CL')}
                    </li>
                  </>
                )}
                {datosActa.resultadoFinal === 'Multada' && (
                  <>
                    <li className="flex items-start gap-2">
                      <Icon name="CheckCircle" size={16} className="mt-0.5 text-amber-600" />
                      Se ha actualizado el estado de la denuncia a "Multada"
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Receipt" size={16} className="mt-0.5 text-amber-600" />
                      Proceder a emitir el cargo por ${datosActa.multaFinal.toLocaleString('es-CL')}
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="AlertTriangle" size={16} className="mt-0.5 text-amber-600" />
                      El infractor tiene derecho a presentar reclamo infraccional
                    </li>
                  </>
                )}
                {datosActa.resultadoFinal === 'Absuelta' && (
                  <>
                    <li className="flex items-start gap-2">
                      <Icon name="CheckCircle" size={16} className="mt-0.5 text-emerald-600" />
                      Se ha actualizado el estado de la denuncia a "Absuelta"
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="FileX" size={16} className="mt-0.5 text-emerald-600" />
                      No se generará cargo ni giro
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Archive" size={16} className="mt-0.5 text-emerald-600" />
                      El expediente puede ser archivado
                    </li>
                  </>
                )}
              </ul>
            </div>
            
            {/* Botones de acción */}
            <div className="flex justify-center gap-4 pt-4">
              <CustomButton
                variant="secondary"
                onClick={() => navigate(ERoutePaths.DENUNCIAS_DETALLE.replace(':id', denuncia?.id || ''))}
                className="flex items-center gap-2"
              >
                <Icon name="ArrowLeft" size={16} />
                Volver a Denuncia
              </CustomButton>
              {datosActa.resultadoFinal !== 'Absuelta' && (
                <CustomButton
                  variant="primary"
                  onClick={() => navigate(`${ERoutePaths.CARGOS_NUEVO}?denunciaId=${denuncia?.id}`)}
                  className="flex items-center gap-2"
                >
                  <Icon name="FilePlus" size={16} />
                  Generar Cargo
                </CustomButton>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Resumen antes de emitir */
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-800 px-6 py-4">
            <h3 className="text-white font-bold flex items-center gap-2">
              <Icon name="FileText" size={20} />
              Resumen del Acta de Audiencia
            </h3>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">N° Acta</p>
                <p className="font-bold text-lg">{datosActa.numeroActa}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Resultado</p>
                <Badge 
                  variant={
                    datosActa.resultadoFinal === 'Allanada' ? 'success' :
                    datosActa.resultadoFinal === 'Absuelta' ? 'info' : 'warning'
                  }
                  className="text-lg px-4 py-1"
                >
                  {datosActa.resultadoFinal}
                </Badge>
              </div>
            </div>
            
            <hr className="border-gray-200" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Infractor</p>
                <p className="font-medium">{datosActa.infractorNombre}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">RUT</p>
                <p className="font-medium">{datosActa.infractorRut}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">N° Denuncia</p>
                <p className="font-medium">{datosActa.numeroDenuncia}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha Audiencia</p>
                <p className="font-medium">{datosActa.fechaAudiencia}</p>
              </div>
            </div>
            
            <hr className="border-gray-200" />
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Multa Original</p>
                <p className="text-xl font-bold">${datosActa.multaOriginal.toLocaleString('es-CL')}</p>
              </div>
              {datosActa.allanamiento && (
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <p className="text-sm text-gray-500">Atenuación</p>
                  <p className="text-xl font-bold text-emerald-600">-{datosActa.porcentajeAtenuacion}%</p>
                </div>
              )}
              <div className={`p-4 rounded-lg ${datosActa.absolucion ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                <p className="text-sm text-gray-500">Multa Final</p>
                <p className={`text-2xl font-bold ${datosActa.absolucion ? 'text-emerald-700' : 'text-amber-700'}`}>
                  ${datosActa.multaFinal.toLocaleString('es-CL')}
                </p>
              </div>
            </div>
            
            <hr className="border-gray-200" />
            
            {/* Estado de la firma */}
            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
              <Icon name="CheckCircle" size={20} className="text-emerald-600" />
              <span className="text-emerald-700">Documento firmado digitalmente</span>
              <span className="text-xs text-emerald-600 ml-auto">
                {datosActa.fechaFirma ? new Date(datosActa.fechaFirma).toLocaleString('es-CL') : ''}
              </span>
            </div>
            
            {/* Botón emitir */}
            <div className="flex justify-center pt-4">
              <CustomButton
                variant="primary"
                onClick={() => setShowConfirmModal(true)}
                className="flex items-center gap-2 px-8 py-3 text-lg bg-emerald-600 hover:bg-emerald-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Generando PDF...
                  </>
                ) : (
                  <>
                    <Icon name="Send" size={20} />
                    Emitir Acta de Audiencia
                  </>
                )}
              </CustomButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
  // Si no hay audiencia, mostrar error
  if (!audiencia) {
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Audiencia no encontrada</h2>
            <p className="text-gray-600 mb-4">
              No se encontró la audiencia especificada o no tiene una audiencia finalizada para emitir acta.
            </p>
            <CustomButton variant="primary" onClick={() => navigate(-1)}>
              Volver
            </CustomButton>
          </div>
        </div>
      </CustomLayout>
    );
  }
  
  // Si la audiencia no está finalizada
  if (audiencia.estado !== 'Finalizada') {
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
            <Icon name="Clock" size={64} className="mx-auto text-amber-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Audiencia no finalizada</h2>
            <p className="text-gray-600 mb-4">
              La audiencia debe estar en estado "Finalizada" para poder emitir el acta oficial.
              Estado actual: <strong>{audiencia.estado}</strong>
            </p>
            <CustomButton variant="primary" onClick={() => navigate(-1)}>
              Volver
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
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              Emitir Acta de Audiencia y Resultado
            </h1>
            <p className="text-gray-600">
              Audiencia N° {audiencia.numeroAudiencia} - Denuncia N° {audiencia.numeroDenuncia}
            </p>
          </div>
          <Badge variant="info" className="ml-auto">
            {datosActa.resultadoFinal}
          </Badge>
        </div>
        
        {/* Contenido principal */}
        <div className="card p-6">
          {/* Stepper */}
          <Stepper
            steps={stepsEmision}
            activeStep={currentStep}
            onStepChange={(stepId) => {
              // Solo permitir navegar hacia atrás o si el paso actual está validado
              if (Number(stepId) < currentStep || validateStep(currentStep)) {
                setCurrentStep(Number(stepId));
              }
            }}
            showDescription={false}
            className="mb-8"
          />
          
          {/* Contenido del paso */}
          <div className="min-h-[500px]">
            {renderStepContent()}
          </div>
          
          {/* Botones de navegación */}
          {!actaEmitida && (
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <CustomButton
                variant="secondary"
                onClick={handlePrevStep}
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
                
                {currentStep < 4 && currentStep !== 3 && (
                  <CustomButton
                    variant="primary"
                    onClick={handleNextStep}
                    className="flex items-center gap-2"
                  >
                    Siguiente
                    <Icon name="ChevronRight" size={16} />
                  </CustomButton>
                )}
                
                {currentStep === 3 && !datosActa.firmaDigital && (
                  <CustomButton
                    variant="primary"
                    onClick={() => setShowFirmaModal(true)}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                  >
                    <Icon name="PenTool" size={16} />
                    Firmar Digitalmente
                  </CustomButton>
                )}
                
                {currentStep === 3 && datosActa.firmaDigital && (
                  <CustomButton
                    variant="primary"
                    onClick={handleNextStep}
                    className="flex items-center gap-2"
                  >
                    Continuar a Emisión
                    <Icon name="ChevronRight" size={16} />
                  </CustomButton>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal de Firma Digital */}
      <Modal
        isOpen={showFirmaModal}
        onClose={() => !firmaEnProceso && setShowFirmaModal(false)}
        title="Firma Digital"
        size="md"
      >
        <div className="p-6 text-center">
          {firmaEnProceso ? (
            <div className="py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"></div>
              <p className="text-lg font-medium text-gray-900">Procesando firma digital...</p>
              <p className="text-gray-600 mt-2">Por favor, espere mientras se firma el documento.</p>
            </div>
          ) : (
            <>
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                <Icon name="PenTool" size={40} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Confirma la firma digital del acta?
              </h3>
              <p className="text-gray-600 mb-6">
                Al firmar digitalmente, usted certifica que ha revisado el contenido del acta
                y que los datos son correctos. Esta acción no puede deshacerse.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-gray-500 mb-1">Firmante:</p>
                <p className="font-medium">{usuarioActual.name}</p>
                <p className="text-sm text-gray-500">{usuarioActual.role}</p>
              </div>
              
              <div className="flex justify-center gap-3">
                <CustomButton
                  variant="secondary"
                  onClick={() => setShowFirmaModal(false)}
                >
                  Cancelar
                </CustomButton>
                <CustomButton
                  variant="primary"
                  onClick={handleFirmaDigital}
                  className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
                >
                  <Icon name="Check" size={16} />
                  Confirmar Firma
                </CustomButton>
              </div>
            </>
          )}
        </div>
      </Modal>
      
      {/* Modal de Confirmación de Emisión */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => !isLoading && setShowConfirmModal(false)}
        title="Confirmar Emisión de Acta"
        size="md"
      >
        <div className="p-6 text-center">
          {isLoading ? (
            <div className="py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin"></div>
              <p className="text-lg font-medium text-gray-900">Generando PDF y emitiendo acta...</p>
              <p className="text-gray-600 mt-2">Por favor, espere mientras se procesa el documento.</p>
            </div>
          ) : (
            <>
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                <Icon name="Send" size={40} className="text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Confirma la emisión del acta?
              </h3>
              <p className="text-gray-600 mb-6">
                Se generará el PDF del Acta de Audiencia N° {datosActa.numeroActa} y se almacenará
                en el expediente digital. El estado de la denuncia cambiará a "{datosActa.resultadoFinal}".
              </p>
              
              <div className="bg-amber-50 rounded-lg p-4 mb-6 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-amber-700">Resultado:</span>
                  <Badge 
                    variant={
                      datosActa.resultadoFinal === 'Allanada' ? 'success' :
                      datosActa.resultadoFinal === 'Absuelta' ? 'info' : 'warning'
                    }
                  >
                    {datosActa.resultadoFinal}
                  </Badge>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-amber-700">Multa Final:</span>
                  <span className="font-bold text-amber-900">
                    ${datosActa.multaFinal.toLocaleString('es-CL')}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-center gap-3">
                <CustomButton
                  variant="secondary"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancelar
                </CustomButton>
                <CustomButton
                  variant="primary"
                  onClick={handleEmitirActa}
                  className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
                >
                  <Icon name="Check" size={16} />
                  Confirmar Emisión
                </CustomButton>
              </div>
            </>
          )}
        </div>
      </Modal>
    </CustomLayout>
  );
};

export default EmitirActaAudiencia;
