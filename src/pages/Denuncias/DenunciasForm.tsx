import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Icon } from "he-button-custom-library";
import CONSTANTS_APP from "../../constants/sidebar-menu";
import CustomLayout from "../../Layout/Layout";
import InputField from "../../organisms/InputField/InputField";
import { CustomButton } from "../../components/Button/Button";
import { Badge, useToast } from "../../components/UI";
import type { BadgeVariant } from "../../components/UI";
import { ERoutePaths } from "../../routes/routes";

// Datos centralizados
import {
  getTodasLasNotificaciones,
  usuarioActual,
  getHallazgoPorId,
  prepararDatosFormularioDenuncia,
  generarNumeroDenuncia,
  generarNumeroInterno,
  aduanas,
  secciones,
  articulos,
  tiposInfraccion,
  denunciantes,
  monedas,
  getArticulosPorTipo,
  getDenunciaPorId,
  type Hallazgo,
  type DocumentoAdjunto,
  type DenunciaInvolucrado,
} from '../../data';

// Tipos de identificador disponibles
const tiposIdentificador = [
  { value: 'RUT', label: 'RUT' },
  { value: 'PASAPORTE', label: 'Pasaporte' },
  { value: 'DNI', label: 'DNI' },
  { value: 'RUC', label: 'RUC' },
  { value: 'OTRO', label: 'Otro' },
];

// Tipos de clasificación de documentos
const tiposClasificacionDocumento = [
  { value: 'DIN', label: 'DIN - Declaración de Ingreso' },
  { value: 'DUS', label: 'DUS - Declaración Única de Salida' },
  { value: 'MIC_DTA', label: 'MIC/DTA - Manifiesto Internacional' },
  { value: 'BL', label: 'B/L - Bill of Lading' },
  { value: 'FACTURA', label: 'Factura Comercial' },
  { value: 'OTROS', label: 'Otros' },
];

// Generar número de radicado aleatorio
const generarNumeroRadicado = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `RAD-${year}-${random}`;
};

// Función para convertir fecha DD-MM-YYYY a YYYY-MM-DD (formato HTML date input)
const convertirFechaParaInput = (fecha: string): string => {
  if (!fecha) return '';
  // Si ya está en formato YYYY-MM-DD, retornar tal cual
  if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return fecha;
  // Convertir DD-MM-YYYY a YYYY-MM-DD
  const partes = fecha.split('-');
  if (partes.length === 3) {
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  }
  return fecha;
};

// Función para obtener código de artículo basado en tipo de infracción
const obtenerArticuloPorInfraccion = (tipoInfraccion: string, tipoDenuncia: string): string => {
  const mapeoInfraccion: Record<string, string> = {
    'Contrabando': '168',
    'Declaración Falsa': '174',
    'Fraude Aduanero': '178',
    'Clasificación Incorrecta': '176',
    'Valor Incorrecto': '177',
    'Documentación Incompleta': '175',
    'Falsificación Documental': '169',
    'Evasión Tributaria': tipoDenuncia === 'Penal' ? 'PEN-97' : '178',
  };
  return mapeoInfraccion[tipoInfraccion] || '';
};

// Función para calcular multa estimada basada en monto
const calcularMultaEstimada = (montoEstimado: string, codigoArticulo: string): number => {
  const articulo = articulos.find(a => a.codigo === codigoArticulo);
  if (!articulo || !articulo.multaMinima) return 0;
  
  // Extraer número del monto estimado (ej: "$12.500.000" -> 12500000)
  const montoNumero = parseInt(montoEstimado.replace(/[^0-9]/g, '')) || 0;
  
  // Calcular multa como porcentaje del monto (entre mínimo y máximo del artículo)
  const multaCalculada = Math.round(montoNumero * 0.1); // 10% del monto como ejemplo
  
  // Asegurar que esté dentro del rango del artículo
  if (articulo.multaMinima && multaCalculada < articulo.multaMinima) {
    return articulo.multaMinima;
  }
  if (articulo.multaMaxima && multaCalculada > articulo.multaMaxima) {
    return articulo.multaMaxima;
  }
  
  return multaCalculada || articulo.multaMinima || 0;
};

// Modal de confirmación
import { ModalConfirmacion } from './components/ModalConfirmacion';

// Tipo para los datos del formulario
interface FormularioDenunciaData {
  // Origen
  hallazgoOrigen?: string;
  hallazgoId?: string;
  origenDenuncia: 'Manual' | 'APP_SATELITE_1' | 'APP_SATELITE_2' | 'FISCALIZACION' | '';
  
  // Datos Generales
  aduanaOrigen: string;
  aduanaEmision: string;
  seccion: string;
  fechaIngreso: string;
  fechaOcurrencia: string;
  fechaEmision: string;
  tipoInfraccion: string;
  tipoDenuncia: 'Infraccional' | 'Penal' | '';
  normaInfringida: string;
  fundamentoLegal: string;
  descripcionHechos: string;
  montoEstimado: string;
  mercanciaInvolucrada: string;
  
  // Tipificación Infraccional
  codigoArticulo: string;
  multa: number | '';
  multaAllanamiento: number | '';
  montoDerechos: number | '';
  montoRetencion: number | '';
  montoNoDeclarado: number | '';
  codigoMoneda: string;
  autodenuncio: boolean;
  retencion: boolean;
  mercanciaAfecta: boolean;
  
  // Tipificación Penal
  codigoDenunciante: string;
  numeroOficio: string;
  fechaOficio: string;
  
  // Involucrados
  involucrados: DenunciaInvolucrado[];
  
  // Datos del denunciado principal - ID anidado
  tipoIdDenunciado: string;
  numeroIdDenunciado: string;
  nombreDenunciado: string;
  direccionDenunciado: string;
  emailDenunciado: string;
  telefonoDenunciado: string;
  representanteLegal?: string;
  
  // Agente
  codigoAgente?: string;
  nombreAgente?: string;
  
  // Documentos
  documentoAduanero?: string;
  tipoDocumento?: string;
  clasificacionDocumento: string;
  numeroRadicado?: string;
  documentosAdjuntos: DocumentoAdjunto[];
}

const initialFormData: FormularioDenunciaData = {
  origenDenuncia: 'Manual',
  aduanaOrigen: '',
  aduanaEmision: '',
  seccion: '',
  fechaIngreso: new Date().toLocaleDateString('es-CL').split('/').reverse().join('-'),
  fechaOcurrencia: '',
  fechaEmision: new Date().toLocaleDateString('es-CL').split('/').reverse().join('-'),
  tipoInfraccion: '',
  tipoDenuncia: '',
  normaInfringida: '',
  fundamentoLegal: '',
  descripcionHechos: '',
  montoEstimado: '',
  mercanciaInvolucrada: '',
  codigoArticulo: '',
  multa: '',
  multaAllanamiento: '',
  montoDerechos: '',
  montoRetencion: '',
  montoNoDeclarado: '',
  codigoMoneda: 'CLP',
  autodenuncio: false,
  retencion: false,
  mercanciaAfecta: false,
  codigoDenunciante: '',
  numeroOficio: '',
  fechaOficio: '',
  involucrados: [],
  tipoIdDenunciado: 'RUT',
  numeroIdDenunciado: '',
  nombreDenunciado: '',
  direccionDenunciado: '',
  emailDenunciado: '',
  telefonoDenunciado: '',
  representanteLegal: '',
  codigoAgente: '',
  nombreAgente: '',
  documentoAduanero: '',
  tipoDocumento: '',
  clasificacionDocumento: '',
  numeroRadicado: '',
  documentosAdjuntos: [],
};

export const DenunciasForm: React.FC = () => {
  const navigate = useNavigate();
  const { hallazgoId, id } = useParams<{ hallazgoId?: string; id?: string }>();
  const location = useLocation();
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  
  // Estado del formulario
  const [formData, setFormData] = useState<FormularioDenunciaData>(initialFormData);
  const [hallazgoOrigen, setHallazgoOrigen] = useState<Hallazgo | null>(null);
  const [isLoadingHallazgo, setIsLoadingHallazgo] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showModalFormalizar, setShowModalFormalizar] = useState(false);
  // Modales para acciones después de crear denuncia
  const [showModalInfraccional, setShowModalInfraccional] = useState(false);
  const [showModalPenal, setShowModalPenal] = useState(false);
  
  // Artículo seleccionado
  const articuloSeleccionado = useMemo(() => {
    if (!formData.codigoArticulo) return null;
    return articulos.find(a => a.codigo === formData.codigoArticulo) || null;
  }, [formData.codigoArticulo]);
  
  // Determinar si estamos creando desde un hallazgo
  const isDesdeHallazgo = useMemo(() => {
    return location.pathname.includes('desde-hallazgo') || 
           location.pathname.includes('gestionar') ||
           !!hallazgoId;
  }, [location.pathname, hallazgoId]);
  
  // Determinar si es edición
  const isEditing = useMemo(() => {
    return location.pathname.includes('/editar') && !!id;
  }, [location.pathname, id]);
  
  // Obtener notificaciones para el header
  const allNotifications = getTodasLasNotificaciones();

  // Cargar datos del hallazgo si viene de uno
  useEffect(() => {
    if (hallazgoId && isDesdeHallazgo) {
      setIsLoadingHallazgo(true);
      
      // Simular carga de datos
      setTimeout(() => {
        const hallazgo = getHallazgoPorId(hallazgoId);
        
        if (hallazgo) {
          setHallazgoOrigen(hallazgo);
          const datosFormulario = prepararDatosFormularioDenuncia(hallazgo);
          
          if (datosFormulario) {
            // Obtener código de artículo basado en tipo de infracción
            const codigoArticuloCalculado = obtenerArticuloPorInfraccion(
              datosFormulario.tipoInfraccion || '',
              hallazgo.tipoHallazgo
            );
            
            // Calcular multa estimada
            const multaCalculada = calcularMultaEstimada(
              hallazgo.montoEstimado,
              codigoArticuloCalculado
            );
            
            // Obtener artículo para multa de allanamiento
            const articuloEncontrado = articulos.find(a => a.codigo === codigoArticuloCalculado);
            const multaAllanamientoCalculada = articuloEncontrado?.permiteAllanamiento && articuloEncontrado?.porcentajeAllanamiento
              ? Math.round(multaCalculada * (1 - articuloEncontrado.porcentajeAllanamiento / 100))
              : 0;
            
            // Extraer monto numérico para derechos
            const montoNumerico = parseInt(hallazgo.montoEstimado.replace(/[^0-9]/g, '')) || 0;
            const montoDerechosCalculado = Math.round(montoNumerico * 0.06); // 6% aproximado de derechos
            
            // Convertir fechas al formato YYYY-MM-DD para inputs de tipo date
            const fechaIngresoConvertida = convertirFechaParaInput(hallazgo.fechaIngreso);
            const fechaOcurrenciaCalculada = convertirFechaParaInput(hallazgo.fechaIngreso); // Usar fecha ingreso como base
            
            setFormData({
              ...initialFormData,
              ...datosFormulario,
              tipoDenuncia: hallazgo.tipoHallazgo,
              // Fechas convertidas al formato correcto
              fechaIngreso: fechaIngresoConvertida,
              fechaOcurrencia: fechaOcurrenciaCalculada,
              fechaEmision: new Date().toISOString().split('T')[0],
              // Tipificación pre-rellenada
              codigoArticulo: codigoArticuloCalculado,
              multa: multaCalculada,
              multaAllanamiento: multaAllanamientoCalculada,
              montoDerechos: montoDerechosCalculado,
              montoRetencion: Math.round(montoNumerico * 0.02), // 2% retención estimada
              montoNoDeclarado: montoNumerico,
              // Para denuncias penales
              codigoDenunciante: hallazgo.tipoHallazgo === 'Penal' ? 'SNA' : '',
              numeroOficio: hallazgo.tipoHallazgo === 'Penal' ? `OF-2025-${hallazgo.numeroHallazgo.replace('PFI-', '')}` : '',
              fechaOficio: hallazgo.tipoHallazgo === 'Penal' ? new Date().toISOString().split('T')[0] : '',
              descripcionHechos: hallazgo.descripcion || datosFormulario.descripcionHechos || '',
              // Involucrados
              involucrados: [{
                id: 'inv-new-1',
                tipoInvolucrado: 'Infractor Principal',
                rut: hallazgo.rutInvolucrado,
                nombre: hallazgo.nombreInvolucrado,
                direccion: datosFormulario.direccionDenunciado,
                email: datosFormulario.emailDenunciado,
                telefono: datosFormulario.telefonoDenunciado,
                representanteLegal: datosFormulario.representanteLegal,
                orden: 1,
                esPrincipal: true,
              }],
            });
          }
        }
        
        setIsLoadingHallazgo(false);
      }, 500);
    }
  }, [hallazgoId, isDesdeHallazgo]);

  // Cargar datos existentes cuando se edita una denuncia
  useEffect(() => {
    if (isEditing && id) {
      const denunciaExistente = getDenunciaPorId(id);
      if (!denunciaExistente) return;

      const fechaIngresoConvertida = convertirFechaParaInput(denunciaExistente.fechaIngreso);
      const fechaOcurrenciaConvertida = convertirFechaParaInput(
        denunciaExistente.fechaOcurrencia || denunciaExistente.fechaIngreso
      );
      const fechaEmisionConvertida = convertirFechaParaInput(
        denunciaExistente.fechaEmision || denunciaExistente.fechaIngreso
      );

      const articuloCodigo =
        denunciaExistente.codigoArticulo ||
        obtenerArticuloPorInfraccion(denunciaExistente.tipoInfraccion, denunciaExistente.tipoDenuncia);
      const articuloDatos = articuloCodigo
        ? articulos.find((a) => a.codigo === articuloCodigo)
        : undefined;

      const involucradoPrincipal = denunciaExistente.involucrados?.[0];

      setFormData({
        ...initialFormData,
        origenDenuncia: 'Manual',
        aduanaOrigen: denunciaExistente.aduana,
        aduanaEmision: denunciaExistente.aduanaEmision || denunciaExistente.aduana,
        seccion: denunciaExistente.seccion || '',
        fechaIngreso: fechaIngresoConvertida,
        fechaOcurrencia: fechaOcurrenciaConvertida,
        fechaEmision: fechaEmisionConvertida,
        tipoInfraccion: denunciaExistente.tipoInfraccion,
        tipoDenuncia: articuloDatos?.tipoArticulo === 'Penal' ? 'Penal' : denunciaExistente.tipoDenuncia,
        normaInfringida:
          articuloDatos?.normaLegal ||
          denunciaExistente.normaInfringida ||
          (articuloCodigo ? `Art. ${articuloCodigo}` : ''),
        fundamentoLegal: articuloDatos?.normaLegal || denunciaExistente.fundamentoLegal || '',
        descripcionHechos: denunciaExistente.descripcionHechos || '',
        montoEstimado: denunciaExistente.montoEstimado,
        mercanciaInvolucrada: denunciaExistente.mercanciaDescripcion || '',
        codigoArticulo: articuloCodigo || '',
        multa: denunciaExistente.multa ?? '',
        multaAllanamiento: denunciaExistente.multaAllanamiento ?? '',
        montoDerechos: denunciaExistente.montoDerechos ?? '',
        montoRetencion: denunciaExistente.montoRetencion ?? '',
        montoNoDeclarado: denunciaExistente.montoNoDeclarado ?? '',
        codigoMoneda: denunciaExistente.codigoMoneda || 'CLP',
        autodenuncio: !!denunciaExistente.autodenuncio,
        retencion: !!denunciaExistente.retencion,
        mercanciaAfecta: !!denunciaExistente.mercanciaAfecta,
        codigoDenunciante: denunciaExistente.codigoDenunciante || '',
        numeroOficio: denunciaExistente.numeroOficio || '',
        fechaOficio: convertirFechaParaInput(denunciaExistente.fechaOficio || ''),
        involucrados: denunciaExistente.involucrados || [],
        tipoIdDenunciado: 'RUT',
        numeroIdDenunciado: denunciaExistente.rutDeudor || involucradoPrincipal?.rut || '',
        nombreDenunciado: denunciaExistente.nombreDeudor || involucradoPrincipal?.nombre || '',
        direccionDenunciado: involucradoPrincipal?.direccion || '',
        emailDenunciado: involucradoPrincipal?.email || '',
        telefonoDenunciado: involucradoPrincipal?.telefono || '',
        representanteLegal: involucradoPrincipal?.representanteLegal || '',
        documentoAduanero: denunciaExistente.documentosAduaneros?.[0]?.numeroDocumento || '',
        tipoDocumento: denunciaExistente.documentosAduaneros?.[0]?.tipoDocumento || '',
      });
    }
  }, [isEditing, id]);

  // Handler para actualizar campos del formulario (memoizado para evitar re-renders)
  const handleInputChange = useCallback((field: keyof FormularioDenunciaData, value: any) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value,
      };
      
      // Si cambia el tipo de infracción, sugerir artículo y clasificación automáticamente
      if (field === 'tipoInfraccion') {
        const codigoSugerido = obtenerArticuloPorInfraccion(value, prev.tipoDenuncia || '');
        if (codigoSugerido) {
          const articulo = articulos.find(a => a.codigo === codigoSugerido);
          newData.codigoArticulo = codigoSugerido;
          newData.tipoDenuncia = articulo?.tipoArticulo === 'Penal' ? 'Penal' : 'Infraccional';
          newData.normaInfringida = articulo?.normaLegal || `Art. ${codigoSugerido} - ${articulo?.nombre || ''}`;
          newData.fundamentoLegal = articulo?.normaLegal || '';
          if (articulo?.multaMinima) {
            newData.multa = articulo.multaMinima;
          }
        }
      }

      // Si cambia el artículo, determinar automáticamente el tipo de denuncia (penal/infraccional) y las normas
      if (field === 'codigoArticulo') {
        const articulo = articulos.find(a => a.codigo === value);
        if (articulo) {
          // Clasificación automática basada en el artículo seleccionado (motor de reglas)
          newData.tipoDenuncia = articulo.tipoArticulo === 'Penal' ? 'Penal' : 'Infraccional';
          newData.codigoArticulo = value;
          if (articulo.multaMinima) {
            newData.multa = articulo.multaMinima;
          }
          // Auto-rellenar norma/fundamento si el artículo la tiene
          newData.normaInfringida = articulo.normaLegal || `Art. ${articulo.codigo} - ${articulo.nombre}`;
          newData.fundamentoLegal = articulo.normaLegal || '';
        }
      }
      
      // Si cambia la clasificación de documento a "Otros", generar número de radicado
      if (field === 'clasificacionDocumento' && value === 'OTROS') {
        newData.numeroRadicado = generarNumeroRadicado();
      }
      
      return newData;
    });
    
    // Limpiar error del campo
    setErrors(prev => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
  }, []);

  // Handlers específicos memoizados para evitar recreación de funciones inline
  // Datos Generales
  const handleMercanciaChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange('mercanciaInvolucrada', e.target.value);
  }, [handleInputChange]);

  const handleMontoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange('montoEstimado', e.target.value);
  }, [handleInputChange]);

  // Tipificación Infraccional - Montos
  const handleMultaChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange('multa', e.target.value ? parseInt(e.target.value) : '');
  }, [handleInputChange]);

  const handleMultaAllanamientoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange('multaAllanamiento', e.target.value ? parseInt(e.target.value) : '');
  }, [handleInputChange]);

  const handleMontoDerechosChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange('montoDerechos', e.target.value ? parseInt(e.target.value) : '');
  }, [handleInputChange]);

  const handleMontoRetencionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange('montoRetencion', e.target.value ? parseInt(e.target.value) : '');
  }, [handleInputChange]);

  const handleMontoNoDeclaradoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange('montoNoDeclarado', e.target.value ? parseInt(e.target.value) : '');
  }, [handleInputChange]);

  // Infractor Principal - ID anidado
  const handleTipoIdDenunciadoChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    handleInputChange('tipoIdDenunciado', e.target.value);
  }, [handleInputChange]);

  const handleNumeroIdDenunciadoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange('numeroIdDenunciado', e.target.value);
  }, [handleInputChange]);

  const handleNombreDenunciadoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange('nombreDenunciado', e.target.value);
  }, [handleInputChange]);

  const handleDireccionDenunciadoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange('direccionDenunciado', e.target.value);
  }, [handleInputChange]);

  const handleEmailDenunciadoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange('emailDenunciado', e.target.value);
  }, [handleInputChange]);

  const handleTelefonoDenunciadoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange('telefonoDenunciado', e.target.value);
  }, [handleInputChange]);

  const handleRepresentanteLegalChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange('representanteLegal', e.target.value);
  }, [handleInputChange]);

  const handleCodigoAgenteChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange('codigoAgente', e.target.value);
  }, [handleInputChange]);

  const handleNombreAgenteChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange('nombreAgente', e.target.value);
  }, [handleInputChange]);

  // Tipificación Penal
  const handleNumeroOficioChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange('numeroOficio', e.target.value);
  }, [handleInputChange]);

  const handleFechaOficioChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange('fechaOficio', e.target.value);
  }, [handleInputChange]);

  // Documentos
  const handleDocumentoAduaneroChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange('documentoAduanero', e.target.value);
  }, [handleInputChange]);

  // Revisión
  const handleDescripcionHechosChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange('descripcionHechos', e.target.value);
  }, [handleInputChange]);

  // Validar paso actual
  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (currentStep) {
      case 1: // Datos Generales
        if (!formData.aduanaOrigen) newErrors.aduanaOrigen = 'Seleccione la aduana';
        if (!formData.fechaOcurrencia) newErrors.fechaOcurrencia = 'Ingrese la fecha de ocurrencia';
        break;
        
      case 2: // Tipificación
        if (!formData.tipoInfraccion) newErrors.tipoInfraccion = 'Seleccione el tipo de infracción';
        if (!formData.descripcionHechos || formData.descripcionHechos.length < 50) {
          newErrors.descripcionHechos = 'La descripción debe tener al menos 50 caracteres';
        }
        if (!formData.tipoDenuncia) {
          newErrors.tipoDenuncia = 'Seleccione un artículo para clasificar la denuncia';
        }
        if (formData.tipoDenuncia === 'Infraccional' && !formData.codigoArticulo) {
          newErrors.codigoArticulo = 'Seleccione un artículo';
        }
        if (formData.tipoDenuncia === 'Penal' && !formData.codigoDenunciante) {
          newErrors.codigoDenunciante = 'Seleccione el denunciante';
        }
        break;
        
      case 3: // Involucrados
        if (formData.involucrados.length === 0 && !formData.numeroIdDenunciado) {
          newErrors.numeroIdDenunciado = 'Debe agregar al menos un involucrado';
        }
        break;
        
      case 4: // Documentos
        // Documentos son opcionales en esta etapa
        break;
        
      case 5: // Revisión
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      showToast({
        type: 'error',
        title: 'Campos requeridos',
        message: 'Complete los campos obligatorios antes de continuar.',
        duration: 3000,
      });
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      {[1, 2, 3, 4, 5].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`
              w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
              ${currentStep === step 
                ? 'bg-aduana-azul text-white' 
                : currentStep > step 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-gray-200 text-gray-500'}
            `}
          >
            {currentStep > step ? (
              <Icon name="Check" size={18} />
            ) : (
              step
            )}
          </div>
          {step < totalSteps && (
            <div
              className={`w-12 h-1 mx-2 rounded ${
                currentStep > step ? 'bg-emerald-500' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const stepLabels = [
    'Datos Generales',
    'Tipificación',
    'Involucrados',
    'Documentos',
    'Revisión'
  ];

  // Banner de hallazgo origen
  const HallazgoBanner = () => {
    if (!hallazgoOrigen) return null;
    
    return (
      <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-100 rounded-lg">
            <Icon name="FileSearch" size={24} className="text-amber-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-amber-900">Denuncia desde Hallazgo</h3>
              <Badge variant="warning">{hallazgoOrigen.numeroHallazgo}</Badge>
              <Badge variant={(hallazgoOrigen.tipoHallazgo === 'Penal' ? 'error' : 'info') as BadgeVariant}>
                {hallazgoOrigen.tipoHallazgo}
              </Badge>
            </div>
            <p className="text-sm text-amber-700 mb-2">
              Los datos han sido pre-rellenados con la información del hallazgo.
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Paso 1: Datos Generales - Memoizado para evitar recreación que causa pérdida de foco
  const DatosGenerales = useMemo(() => (
    <div className="space-y-6">
      {/* Datos de ubicación */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">Aduana *</label>
          <select
            className={`form-input ${errors.aduanaOrigen ? 'border-red-500' : ''}`}
            value={formData.aduanaOrigen}
            onChange={(e) => handleInputChange('aduanaOrigen', e.target.value)}
          >
            <option value="">Seleccione aduana</option>
            {aduanas.map(aduana => (
              <option key={aduana.id} value={aduana.nombre}>{aduana.nombre}</option>
            ))}
          </select>
          {errors.aduanaOrigen && <p className="text-red-500 text-sm mt-1">{errors.aduanaOrigen}</p>}
        </div>
        <div>
          <label className="form-label">Aduana de Emisión</label>
          <select
            className="form-input"
            value={formData.aduanaEmision || formData.aduanaOrigen}
            onChange={(e) => handleInputChange('aduanaEmision', e.target.value)}
          >
            <option value="">Seleccione aduana</option>
            {aduanas.map(aduana => (
              <option key={aduana.id} value={aduana.nombre}>{aduana.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">Sección</label>
          <select
            className="form-input"
            value={formData.seccion}
            onChange={(e) => handleInputChange('seccion', e.target.value)}
          >
            <option value="">Seleccione sección</option>
            {secciones.map(seccion => (
              <option key={seccion.id} value={seccion.nombre}>{seccion.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">Moneda</label>
          <select
            className="form-input"
            value={formData.codigoMoneda}
            onChange={(e) => handleInputChange('codigoMoneda', e.target.value)}
          >
            {monedas.map(moneda => (
              <option key={moneda.id} value={moneda.codigo}>{moneda.nombre} ({moneda.simbolo})</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Fechas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputField
          label="Fecha de Emisión"
          id="fechaEmision"
          type="date"
          value={formData.fechaEmision}
          onChange={(e) => handleInputChange('fechaEmision', e.target.value)}
          icon={<Icon name="CalendarDays" size={18} color="#6B7280" />}
        />
        <InputField
          label="Fecha de Ocurrencia"
          id="fechaOcurrencia"
          type="date"
          value={formData.fechaOcurrencia}
          onChange={(e) => handleInputChange('fechaOcurrencia', e.target.value)}
          icon={<Icon name="CalendarDays" size={18} color="#6B7280" />}
          required
          hasError={!!errors.fechaOcurrencia}
          errorMessage={errors.fechaOcurrencia}
        />
        <InputField
          label="Fecha de Ingreso"
          id="fechaIngreso"
          type="date"
          value={formData.fechaIngreso}
          onChange={() => {}}
          disabled
          icon={<Icon name="CalendarDays" size={18} color="#6B7280" />}
        />
      </div>

      {/* Mercancía */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          key="mercancia-involucrada"
          label="Mercancía Involucrada"
          id="mercancia"
          type="text"
          placeholder="Descripción de mercancía"
          value={formData.mercanciaInvolucrada}
          onChange={handleMercanciaChange}
        />
        <InputField
          key="monto-estimado"
          label="Monto Estimado"
          id="montoEstimado"
          type="text"
          placeholder="$0"
          value={formData.montoEstimado}
          onChange={handleMontoChange}
        />
      </div>

      {/* Flags */}
      <div className="card p-4 bg-gray-50">
        <h4 className="font-medium text-gray-900 mb-3">Indicadores</h4>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.autodenuncio}
              onChange={(e) => handleInputChange('autodenuncio', e.target.checked)}
              className="rounded border-gray-300 text-aduana-azul focus:ring-aduana-azul"
            />
            <span className="text-sm text-gray-700">Autodenuncia</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.retencion}
              onChange={(e) => handleInputChange('retencion', e.target.checked)}
              className="rounded border-gray-300 text-aduana-azul focus:ring-aduana-azul"
            />
            <span className="text-sm text-gray-700">Con retención</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.mercanciaAfecta}
              onChange={(e) => handleInputChange('mercanciaAfecta', e.target.checked)}
              className="rounded border-gray-300 text-aduana-azul focus:ring-aduana-azul"
            />
            <span className="text-sm text-gray-700">Mercancía afecta</span>
          </label>
        </div>
      </div>
    </div>
  ), [
    formData,
    errors,
    handleInputChange,
    handleMercanciaChange,
    handleMontoChange
  ]);

  // Paso 2: Tipificación - Memoizado para evitar recreación que causa pérdida de foco
  const Tipificacion = useMemo(() => (
    <div className="space-y-6">
      {/* Tipo de denuncia */}
      <div className="card p-5 border-l-4 border-l-aduana-azul">
        <h4 className="font-semibold text-gray-900 mb-4">Tipo de Denuncia *</h4>
        <div className="flex flex-col gap-3">
          <div className="flex gap-4">
            <label className={`flex-1 p-4 border-2 rounded-lg cursor-pointer transition-all ${
              formData.tipoDenuncia === 'Infraccional' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="tipoDenuncia"
                value="Infraccional"
                checked={formData.tipoDenuncia === 'Infraccional'}
                onChange={(e) => handleInputChange('tipoDenuncia', e.target.value)}
                disabled
                className="sr-only"
              />
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  formData.tipoDenuncia === 'Infraccional' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}>
                  <Icon name="FileText" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Infraccional</p>
                  <p className="text-sm text-gray-500">Multas y sanciones administrativas</p>
                </div>
              </div>
            </label>
            <label className={`flex-1 p-4 border-2 rounded-lg cursor-pointer transition-all ${
              formData.tipoDenuncia === 'Penal' 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="tipoDenuncia"
                value="Penal"
                checked={formData.tipoDenuncia === 'Penal'}
                onChange={(e) => handleInputChange('tipoDenuncia', e.target.value)}
                disabled
                className="sr-only"
              />
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  formData.tipoDenuncia === 'Penal' ? 'bg-red-500 text-white' : 'bg-gray-200'
                }`}>
                  <Icon name="Scale" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Penal</p>
                  <p className="text-sm text-gray-500">Delitos aduaneros</p>
                </div>
              </div>
            </label>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Badge variant={(formData.tipoDenuncia === 'Penal' ? 'error' : 'info') as BadgeVariant}>
              {formData.tipoDenuncia || 'Pendiente'}
            </Badge>
            <span className="text-xs text-gray-500">
              Se actualiza automáticamente al elegir el artículo en esta sección.
            </span>
          </div>
          {errors.tipoDenuncia && (
            <p className="text-red-500 text-sm">{errors.tipoDenuncia}</p>
          )}
        </div>
      </div>

      {/* Tipo de Infracción */}
      <div>
        <label className="form-label">Tipo de Infracción *</label>
        <select
          className={`form-input ${errors.tipoInfraccion ? 'border-red-500' : ''}`}
          value={formData.tipoInfraccion}
          onChange={(e) => handleInputChange('tipoInfraccion', e.target.value)}
        >
          <option value="">Seleccione tipo</option>
          {tiposInfraccion.map(tipo => (
            <option key={tipo.id} value={tipo.nombre}>{tipo.nombre}</option>
          ))}
        </select>
        {errors.tipoInfraccion && <p className="text-red-500 text-sm mt-1">{errors.tipoInfraccion}</p>}
      </div>

      {/* Descripción de los hechos */}
      <div>
        <label className="form-label">Descripción de los Hechos *</label>
        <textarea
          key="descripcion-hechos-tipificacion"
          className={`form-input min-h-[150px] ${errors.descripcionHechos ? 'border-red-500' : ''}`}
          placeholder="Describa detalladamente los hechos que motivan la denuncia (mínimo 50 caracteres)..."
          value={formData.descripcionHechos}
          onChange={handleDescripcionHechosChange}
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.descripcionHechos.length} caracteres (mínimo 50)
        </p>
        {errors.descripcionHechos && <p className="text-red-500 text-sm mt-1">{errors.descripcionHechos}</p>}
      </div>

      {/* Sección Infraccional */}
      {formData.tipoDenuncia === 'Infraccional' && (
        <div className="card p-5 border-l-4 border-l-blue-500">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="FileText" size={18} />
            Tipificación Infraccional
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">Artículo *</label>
              <select
                className={`form-input ${errors.codigoArticulo ? 'border-red-500' : ''}`}
                value={formData.codigoArticulo}
                onChange={(e) => handleInputChange('codigoArticulo', e.target.value)}
              >
                <option value="">Seleccione artículo</option>
                {getArticulosPorTipo('Infraccional').map(art => (
                  <option key={art.id} value={art.codigo}>
                    {art.nombre}
                  </option>
                ))}
              </select>
              {errors.codigoArticulo && <p className="text-red-500 text-sm mt-1">{errors.codigoArticulo}</p>}
            </div>
            
            {articuloSeleccionado && (
              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">{articuloSeleccionado.nombre}</p>
                  <p className="text-xs text-blue-600 mt-1">{articuloSeleccionado.descripcion}</p>
                  {articuloSeleccionado.multaMinima && (
                    <p className="text-xs text-blue-700 mt-2">
                      Multa: ${articuloSeleccionado.multaMinima?.toLocaleString('es-CL')} - ${articuloSeleccionado.multaMaxima?.toLocaleString('es-CL')}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Norma aplicable</label>
                    <input
                      type="text"
                      className="form-input bg-gray-50"
                      value={formData.normaInfringida}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="form-label">Fundamento</label>
                    <input
                      type="text"
                      className="form-input bg-gray-50"
                      value={formData.fundamentoLegal}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div>
              <label className="form-label">Multa ($)</label>
              <input
                key="multa"
                type="number"
                className="form-input"
                placeholder="0"
                value={formData.multa}
                onChange={handleMultaChange}
              />
              {articuloSeleccionado && articuloSeleccionado.multaMinima && (
                <p className="text-xs text-gray-500 mt-1">
                  Rango: ${articuloSeleccionado.multaMinima?.toLocaleString('es-CL')} - ${articuloSeleccionado.multaMaxima?.toLocaleString('es-CL')}
                </p>
              )}
            </div>
            
            {articuloSeleccionado?.permiteAllanamiento && (
              <div>
                <label className="form-label">Multa por Allanamiento ($)</label>
                <input
                  key="multa-allanamiento"
                  type="number"
                  className="form-input"
                  placeholder="0"
                  value={formData.multaAllanamiento}
                  onChange={handleMultaAllanamientoChange}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {articuloSeleccionado.porcentajeAllanamiento}% de reducción aplicable
                </p>
              </div>
            )}
            
            <div>
              <label className="form-label">Monto Derechos ($)</label>
              <input
                key="monto-derechos"
                type="number"
                className="form-input"
                placeholder="0"
                value={formData.montoDerechos}
                onChange={handleMontoDerechosChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="form-label">Monto Retención ($)</label>
              <input
                key="monto-retencion"
                type="number"
                className="form-input"
                placeholder="0"
                value={formData.montoRetencion}
                onChange={handleMontoRetencionChange}
              />
            </div>
            <div>
              <label className="form-label">Monto No Declarado ($)</label>
              <input
                key="monto-no-declarado"
                type="number"
                className="form-input"
                placeholder="0"
                value={formData.montoNoDeclarado}
                onChange={handleMontoNoDeclaradoChange}
              />
            </div>
          </div>
        </div>
      )}

      {/* Sección Penal */}
      {formData.tipoDenuncia === 'Penal' && (
        <div className="card p-5 border-l-4 border-l-red-500">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="Scale" size={18} />
            Tipificación Penal
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">Artículo Penal</label>
              <select
                className="form-input"
                value={formData.codigoArticulo}
                onChange={(e) => handleInputChange('codigoArticulo', e.target.value)}
              >
                <option value="">Seleccione artículo</option>
                {getArticulosPorTipo('Penal').map(art => (
                  <option key={art.id} value={art.codigo}>
                    {art.nombre}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="form-label">Denunciante *</label>
              <select
                className={`form-input ${errors.codigoDenunciante ? 'border-red-500' : ''}`}
                value={formData.codigoDenunciante}
                onChange={(e) => handleInputChange('codigoDenunciante', e.target.value)}
              >
                <option value="">Seleccione denunciante</option>
                {denunciantes.map(den => (
                  <option key={den.id} value={den.codigo}>{den.nombre}</option>
                ))}
              </select>
              {errors.codigoDenunciante && <p className="text-red-500 text-sm mt-1">{errors.codigoDenunciante}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <InputField
              key="numero-oficio"
              label="N° Oficio"
              id="numeroOficio"
              type="text"
              placeholder="OF-2025-XXXXX"
              value={formData.numeroOficio}
              onChange={handleNumeroOficioChange}
            />
            <InputField
              key="fecha-oficio"
              label="Fecha Oficio"
              id="fechaOficio"
              type="date"
              value={formData.fechaOficio}
              onChange={handleFechaOficioChange}
              icon={<Icon name="CalendarDays" size={18} color="#6B7280" />}
            />
          </div>

          {formData.codigoArticulo && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="form-label">Norma aplicable</label>
                <input
                  type="text"
                  className="form-input bg-gray-50"
                  value={formData.normaInfringida}
                  readOnly
                />
              </div>
              <div>
                <label className="form-label">Fundamento</label>
                <input
                  type="text"
                  className="form-input bg-gray-50"
                  value={formData.fundamentoLegal}
                  readOnly
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  ), [
    formData,
    errors,
    articuloSeleccionado,
    handleInputChange,
    handleDescripcionHechosChange,
    handleMultaChange,
    handleMultaAllanamientoChange,
    handleMontoDerechosChange,
    handleMontoRetencionChange,
    handleMontoNoDeclaradoChange,
    handleNumeroOficioChange,
    handleFechaOficioChange
  ]);

  // Paso 3: Involucrados - Memoizado para evitar recreación que causa pérdida de foco
  const Involucrados = useMemo(() => (
    <div className="space-y-6">
      <div className="card p-5 border-l-4 border-l-aduana-azul">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="User" size={18} />
          Infractor Principal *
          {isDesdeHallazgo && (
            <Badge variant="info" className="ml-2">Pre-rellenado desde hallazgo</Badge>
          )}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ID del Infractor - Campos anidados */}
          <div className="md:col-span-2">
            <label className="form-label">ID del Infractor *</label>
            <div className="flex gap-2">
              <select
                className="form-input w-1/3"
                value={formData.tipoIdDenunciado}
                onChange={handleTipoIdDenunciadoChange}
              >
                {tiposIdentificador.map(tipo => (
                  <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                ))}
              </select>
              <input
                type="text"
                className={`form-input flex-1 ${errors.numeroIdDenunciado ? 'border-red-500' : ''}`}
                placeholder={formData.tipoIdDenunciado === 'RUT' ? '12.345.678-9' : 'Número de ID'}
                value={formData.numeroIdDenunciado}
                onChange={handleNumeroIdDenunciadoChange}
              />
            </div>
          </div>
          <InputField
            key="nombre-denunciado"
            label="Nombre/Razón Social"
            id="nombreDenunciado"
            type="text"
            placeholder="Nombre completo o razón social"
            value={formData.nombreDenunciado}
            onChange={handleNombreDenunciadoChange}
            required
          />
          <InputField
            key="direccion-denunciado"
            label="Dirección"
            id="direccionDenunciado"
            type="text"
            placeholder="Dirección completa"
            value={formData.direccionDenunciado}
            onChange={handleDireccionDenunciadoChange}
          />
          <InputField
            key="email-denunciado"
            label="Correo Electrónico"
            id="emailDenunciado"
            type="email"
            placeholder="correo@empresa.cl"
            value={formData.emailDenunciado}
            onChange={handleEmailDenunciadoChange}
          />
          <InputField
            key="telefono-denunciado"
            label="Teléfono"
            id="telefonoDenunciado"
            type="text"
            placeholder="+56 9 1234 5678"
            value={formData.telefonoDenunciado}
            onChange={handleTelefonoDenunciadoChange}
          />
          <InputField
            key="representante-legal"
            label="Representante Legal"
            id="representanteLegal"
            type="text"
            placeholder="Nombre del representante"
            value={formData.representanteLegal || ''}
            onChange={handleRepresentanteLegalChange}
          />
        </div>
        {errors.numeroIdDenunciado && <p className="text-red-500 text-sm mt-2">{errors.numeroIdDenunciado}</p>}
      </div>

      <div className="card p-5 border-l-4 border-l-emerald-500">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="Shield" size={18} />
          Agente de Aduanas (si aplica)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            key="codigo-agente"
            label="Código de Agente"
            id="codigoAgente"
            type="text"
            placeholder="Código del agente"
            value={formData.codigoAgente || ''}
            onChange={handleCodigoAgenteChange}
          />
          <InputField
            key="nombre-agente"
            label="Nombre del Agente"
            id="nombreAgente"
            type="text"
            placeholder="Nombre del agente de aduanas"
            value={formData.nombreAgente || ''}
            onChange={handleNombreAgenteChange}
          />
        </div>
      </div>

      <CustomButton variant="secondary" className="flex items-center gap-2">
        <Icon name="UserPlus" size={16} />
        Agregar otro involucrado
      </CustomButton>
    </div>
  ), [
    formData,
    errors,
    isDesdeHallazgo,
    handleInputChange,
    handleTipoIdDenunciadoChange,
    handleNumeroIdDenunciadoChange,
    handleNombreDenunciadoChange,
    handleDireccionDenunciadoChange,
    handleEmailDenunciadoChange,
    handleTelefonoDenunciadoChange,
    handleRepresentanteLegalChange,
    handleCodigoAgenteChange,
    handleNombreAgenteChange
  ]);

  // Paso 4: Documentos
  const getIconForDocType = (tipo: DocumentoAdjunto['tipo']) => {
    switch (tipo) {
      case 'pdf':
        return <Icon name="FileText" size={24} className="text-red-500" />;
      case 'xls':
        return <Icon name="FileSpreadsheet" size={24} className="text-emerald-600" />;
      case 'jpg':
      case 'png':
        return <Icon name="Image" size={24} className="text-blue-500" />;
      default:
        return <Icon name="File" size={24} className="text-gray-500" />;
    }
  };

  const Documentos = () => (
    <div className="space-y-6">
      {formData.documentosAdjuntos.length > 0 && (
        <div className="card p-5 border-l-4 border-l-amber-500">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="FolderOpen" size={18} />
            Documentos del Hallazgo
            <Badge variant="warning">Pre-cargados</Badge>
          </h4>
          <div className="space-y-3">
            {formData.documentosAdjuntos.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center gap-3">
                  {getIconForDocType(doc.tipo)}
                  <div>
                    <p className="font-medium text-gray-900">{doc.nombre}</p>
                    <p className="text-sm text-gray-500">{doc.tamanio} • Subido {doc.fechaSubida}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-aduana-azul hover:text-aduana-azul/80">
                    <Icon name="Eye" size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-aduana-azul transition-colors cursor-pointer">
        <Icon name="Upload" size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 mb-2">
          Arrastra archivos adicionales aquí o haz clic para seleccionar
        </p>
        <p className="text-sm text-gray-500">
          PDF, DOC, XLS, JPG hasta 10MB cada uno
        </p>
        <CustomButton variant="secondary" className="mt-4">
          Seleccionar Archivos
        </CustomButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          key="documento-aduanero"
          label="N° Documento Aduanero"
          id="nroDocumentoAduanero"
          type="text"
          placeholder="Ej: 6020-24-0012345"
          value={formData.documentoAduanero || ''}
          onChange={handleDocumentoAduaneroChange}
        />
        <div>
          <label className="form-label">Tipo de Documento</label>
          <select
            className="form-input"
            value={formData.tipoDocumento || ''}
            onChange={(e) => handleInputChange('tipoDocumento', e.target.value)}
          >
            <option value="">Seleccione tipo</option>
            <option value="DIN">DIN - Declaración de Ingreso</option>
            <option value="DUS">DUS - Declaración Única de Salida</option>
            <option value="MIC/DTA">MIC/DTA - Manifiesto Internacional</option>
            <option value="BL">B/L - Bill of Lading</option>
            <option value="FACTURA">Factura Comercial</option>
          </select>
        </div>
      </div>

      {/* Clasificación de documentos */}
      <div className="card p-4 bg-gray-50">
        <h4 className="font-medium text-gray-900 mb-3">Clasificación de Documentos</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Clasificación</label>
            <select
              className="form-input"
              value={formData.clasificacionDocumento || ''}
              onChange={(e) => handleInputChange('clasificacionDocumento', e.target.value)}
            >
              <option value="">Seleccione clasificación</option>
              {tiposClasificacionDocumento.map(tipo => (
                <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
              ))}
            </select>
          </div>
          {formData.clasificacionDocumento === 'OTROS' && (
            <div>
              <label className="form-label">N° de Radicado (Auto-generado)</label>
              <input
                type="text"
                className="form-input bg-gray-100"
                value={formData.numeroRadicado || ''}
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">
                Este número se genera automáticamente al seleccionar "Otros"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Paso 5: Revisión
  const Revision = () => {
    const numeroDenunciaGenerado = useMemo(() => generarNumeroDenuncia(), []);
    const numeroInternoGenerado = useMemo(() => generarNumeroInterno(numeroDenunciaGenerado), [numeroDenunciaGenerado]);
    
    return (
      <div className="space-y-6">
        <div className="alert alert-info">
          <Icon name="Info" size={20} />
          <div>
            <p className="font-medium">Revise la información antes de enviar</p>
            <p className="text-sm mt-1">
              {isDesdeHallazgo 
                ? `Al confirmar, el hallazgo ${formData.hallazgoOrigen} será convertido en la denuncia N° ${numeroDenunciaGenerado}.`
                : 'Una vez enviada la denuncia, se generará el expediente digital.'
              }
            </p>
          </div>
        </div>

        <div className="card p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Icon name="FileCheck" size={24} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-emerald-700">Número de Denuncia a Generar</p>
              <p className="text-2xl font-bold text-emerald-800">{numeroDenunciaGenerado}</p>
              <p className="text-xs text-emerald-600">N° Interno: {numeroInternoGenerado}</p>
            </div>
            <div className="ml-auto flex gap-2">
              <Badge variant={(formData.tipoDenuncia === 'Penal' ? 'error' : 'info') as BadgeVariant}>
                {formData.tipoDenuncia || 'Sin tipo'}
              </Badge>
              {isDesdeHallazgo && (
                <Badge variant="warning">Desde {formData.hallazgoOrigen}</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-5">
            <h4 className="font-semibold text-gray-900 mb-4 border-b pb-2">Datos Generales</h4>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Aduana:</dt>
                <dd className="font-medium">{formData.aduanaOrigen || 'No especificada'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Sección:</dt>
                <dd className="font-medium">{formData.seccion || 'No especificada'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Fecha Ocurrencia:</dt>
                <dd className="font-medium">{formData.fechaOcurrencia || 'No especificada'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Tipo de Infracción:</dt>
                <dd className="font-medium">{formData.tipoInfraccion || 'No especificada'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Artículo:</dt>
                <dd className="font-medium">{articuloSeleccionado?.nombre || formData.codigoArticulo || 'No especificado'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Monto Estimado:</dt>
                <dd className="font-medium text-aduana-rojo">{formData.montoEstimado || '$0'}</dd>
              </div>
              {formData.multa && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Multa:</dt>
                  <dd className="font-medium">${Number(formData.multa).toLocaleString('es-CL')}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="card p-5">
            <h4 className="font-semibold text-gray-900 mb-4 border-b pb-2">Infractor Principal</h4>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Tipo ID:</dt>
                <dd className="font-medium">{formData.tipoIdDenunciado || 'RUT'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">N° ID:</dt>
                <dd className="font-medium">{formData.numeroIdDenunciado || 'No especificado'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Nombre:</dt>
                <dd className="font-medium">{formData.nombreDenunciado || 'No especificado'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Email:</dt>
                <dd className="font-medium text-xs">{formData.emailDenunciado || 'No especificado'}</dd>
              </div>
              {formData.representanteLegal && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Rep. Legal:</dt>
                  <dd className="font-medium text-xs">{formData.representanteLegal}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        <div className="card p-5">
          <h4 className="font-semibold text-gray-900 mb-4 border-b pb-2">Descripción de los Hechos *</h4>
          <p className="text-gray-700 whitespace-pre-wrap">
            {formData.descripcionHechos || 'Sin descripción registrada'}
          </p>
        </div>

        <div className="card p-5">
          <h4 className="font-semibold text-gray-900 mb-4 border-b pb-2">
            Documentos Adjuntos ({formData.documentosAdjuntos.length})
          </h4>
          {formData.documentosAdjuntos.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {formData.documentosAdjuntos.map((doc) => (
                <span key={doc.id} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {getIconForDocType(doc.tipo)}
                  {doc.nombre}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No hay documentos adjuntos.</p>
          )}
        </div>

        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <input type="checkbox" id="confirmar" className="mt-1" />
          <label htmlFor="confirmar" className="text-sm text-amber-800">
            Confirmo que la información proporcionada es veraz y corresponde a los hechos investigados. 
            Entiendo que esta denuncia generará un expediente digital y se iniciará el proceso correspondiente.
          </label>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    if (isLoadingHallazgo) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-aduana-azul border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Cargando datos del hallazgo...</p>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return DatosGenerales;
      case 2:
        return Tipificacion;
      case 3:
        return Involucrados;
      case 4:
        return <Documentos />;
      case 5:
        return <Revision />;
      default:
        return DatosGenerales;
    }
  };

  const handleSubmit = () => {
    if (!validateCurrentStep()) {
      showToast({
        type: 'error',
        title: 'Campos requeridos',
        message: 'Complete los campos obligatorios antes de enviar.',
        duration: 3000,
      });
      return;
    }
    
    setShowModalFormalizar(true);
  };

  const handleConfirmSubmit = () => {
    const numeroDenuncia = generarNumeroDenuncia();
    
    showToast({
      type: 'success',
      title: isDesdeHallazgo 
        ? '¡Hallazgo convertido a denuncia exitosamente!'
        : '¡Denuncia registrada exitosamente!',
      message: `La denuncia N° ${numeroDenuncia} ha sido registrada. El expediente digital ha sido generado.`,
      duration: 5000,
    });
    
    setShowModalFormalizar(false);
    
    // Mostrar modal según tipo de denuncia
    if (formData.tipoDenuncia === 'Infraccional') {
      setShowModalInfraccional(true);
    } else if (formData.tipoDenuncia === 'Penal') {
      setShowModalPenal(true);
    } else {
      setTimeout(() => navigate(ERoutePaths.DENUNCIAS), 1500);
    }
  };

  // Handlers para acciones post-creación
  const handleRegistrarAudiencia = () => {
    setShowModalInfraccional(false);
    showToast({
      type: 'info',
      title: 'Registrar Audiencia',
      message: 'Redirigiendo a registro de audiencia...',
      duration: 2000,
    });
    // TODO: Navegar a formulario de audiencia
    setTimeout(() => navigate(ERoutePaths.DENUNCIAS), 1500);
  };

  const handleGenerarCargo = () => {
    setShowModalInfraccional(false);
    showToast({
      type: 'info',
      title: 'Generar Cargo',
      message: 'Redirigiendo a formulario de cargo...',
      duration: 2000,
    });
    setTimeout(() => navigate(ERoutePaths.CARGOS_NUEVO), 500);
  };

  const handleDerivarMinisterioPublico = () => {
    setShowModalPenal(false);
    showToast({
      type: 'info',
      title: 'Derivar a Ministerio Público',
      message: 'La denuncia ha sido derivada al Ministerio Público.',
      duration: 3000,
    });
    setTimeout(() => navigate(ERoutePaths.DENUNCIAS), 1500);
  };

  return (
    <CustomLayout
      platformName="DECARE"
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
      <div className="min-h-full space-y-4 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => isDesdeHallazgo ? navigate(-1) : navigate(ERoutePaths.DENUNCIAS)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon name="ArrowLeft" size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Editar Denuncia' : isDesdeHallazgo ? 'Gestionar Hallazgo → Denuncia' : 'Nueva Denuncia'}
            </h1>
            <p className="text-gray-600">
              {isDesdeHallazgo 
                ? 'Revisión y formalización de denuncia desde hallazgo'
                : 'Registro de nueva denuncia aduanera'
              }
            </p>
          </div>
        </div>

        {/* Banner de hallazgo origen */}
        {isDesdeHallazgo && <HallazgoBanner />}

        <div className="card p-6">
          {/* Step Indicator */}
          <StepIndicator />
          
          {/* Step Labels */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-6 text-sm">
              {stepLabels.map((label, index) => (
                <span
                  key={index}
                  className={`
                    ${currentStep === index + 1 
                      ? 'text-aduana-azul font-semibold' 
                      : currentStep > index + 1 
                        ? 'text-emerald-600' 
                        : 'text-gray-400'}
                  `}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="min-h-[400px]">
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
              <CustomButton variant="secondary">
                Guardar Borrador
              </CustomButton>
              
              {currentStep < totalSteps ? (
                <CustomButton
                  variant="primary"
                  onClick={handleNextStep}
                  className="flex items-center gap-2"
                >
                  Siguiente
                  <Icon name="ChevronRight" size={16} />
                </CustomButton>
              ) : (
                <CustomButton
                  variant="primary"
                  onClick={handleSubmit}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  <Icon name="Send" size={16} />
                  {isDesdeHallazgo ? 'Confirmar y Crear Denuncia' : 'Enviar Denuncia'}
                </CustomButton>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      <ModalConfirmacion
        isOpen={showModalFormalizar}
        onClose={() => setShowModalFormalizar(false)}
        onConfirm={handleConfirmSubmit}
        titulo="Confirmar Envío de Denuncia"
        mensaje={`¿Está seguro que desea ${isDesdeHallazgo ? 'crear la denuncia desde el hallazgo' : 'enviar esta denuncia'}? Se generará el expediente digital y se iniciará el flujo de trabajo correspondiente.`}
        tipo="info"
        textoConfirmar={isDesdeHallazgo ? 'Crear Denuncia' : 'Enviar Denuncia'}
      >
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Tipo:</span>
            <Badge variant={(formData.tipoDenuncia === 'Penal' ? 'error' : 'info') as BadgeVariant}>
              {formData.tipoDenuncia || 'Sin tipo'}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Aduana:</span>
            <span className="font-medium">{formData.aduanaOrigen}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Infractor:</span>
            <span className="font-medium">{formData.nombreDenunciado}</span>
          </div>
        </div>
      </ModalConfirmacion>

      {/* Modal para Denuncia Infraccional - Opciones post-creación */}
      <ModalConfirmacion
        isOpen={showModalInfraccional}
        onClose={() => {
          setShowModalInfraccional(false);
          navigate(ERoutePaths.DENUNCIAS);
        }}
        onConfirm={handleGenerarCargo}
        titulo="Denuncia Infraccional Registrada"
        mensaje="La denuncia infraccional ha sido registrada exitosamente. ¿Qué acción desea realizar?"
        tipo="info"
        textoConfirmar="Generar Cargo"
        textoCancelar="Registrar Audiencia"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Generar Cargo:</strong> Crear un cargo asociado a esta denuncia para la determinación de la deuda.
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <strong>Registrar Audiencia:</strong> Programar una audiencia con el infractor para resolver la situación.
            </p>
          </div>
          <button
            onClick={handleRegistrarAudiencia}
            className="w-full py-2 px-4 border border-amber-500 text-amber-700 rounded-lg hover:bg-amber-50 flex items-center justify-center gap-2"
          >
            <Icon name="Calendar" size={18} />
            Registrar Audiencia
          </button>
        </div>
      </ModalConfirmacion>

      {/* Modal para Denuncia Penal - Derivar a Ministerio Público */}
      <ModalConfirmacion
        isOpen={showModalPenal}
        onClose={() => {
          setShowModalPenal(false);
          navigate(ERoutePaths.DENUNCIAS);
        }}
        onConfirm={handleDerivarMinisterioPublico}
        titulo="Denuncia Penal Registrada"
        mensaje="La denuncia ha sido clasificada como PENAL. ¿Desea derivarla al Ministerio Público?"
        tipo="warning"
        textoConfirmar="Derivar a Ministerio Público"
        textoCancelar="Cerrar"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon name="AlertTriangle" size={24} className="text-red-500 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Denuncia de Carácter Penal</p>
                <p className="text-sm text-red-700 mt-1">
                  Esta denuncia involucra conductas que podrían constituir delito. 
                  Se recomienda derivar al Ministerio Público para su investigación.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">
              Al derivar, se generará un oficio automático y se notificará al área jurídica.
            </p>
          </div>
        </div>
      </ModalConfirmacion>
    </CustomLayout>
  );
};

export default DenunciasForm;
