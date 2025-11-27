import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Icon } from "he-button-custom-library";
import CONSTANTS_APP from "../../constants/sidebar-menu";
import CustomLayout from "../../Layout/Layout";
import InputField from "../../organisms/InputField/InputField";
import { CustomButton } from "../../components/Button/Button";
import { Badge, useToast } from "../../components/UI";
import { ERoutePaths } from "../../routes/routes";

// Datos centralizados
import {
  getTodasLasNotificaciones,
  usuarioActual,
  getHallazgoPorId,
  prepararDatosFormularioDenuncia,
  generarNumeroDenuncia,
  type Hallazgo,
  type DocumentoAdjunto,
} from '../../data';

// Tipo para los datos del formulario
interface FormularioDenunciaData {
  // Origen
  hallazgoOrigen?: string;
  hallazgoId?: string;
  
  // Datos Generales
  aduanaOrigen: string;
  seccion: string;
  fechaIngreso: string;
  tipoInfraccion: string;
  tipoDenuncia: string;
  normaInfringida: string;
  fundamentoLegal: string;
  descripcionHechos: string;
  montoEstimado: string;
  mercanciaInvolucrada: string;
  
  // Denunciado
  rutDenunciado: string;
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
  documentosAdjuntos: DocumentoAdjunto[];
}

const initialFormData: FormularioDenunciaData = {
  aduanaOrigen: '',
  seccion: '',
  fechaIngreso: '',
  tipoInfraccion: '',
  tipoDenuncia: '',
  normaInfringida: '',
  fundamentoLegal: '',
  descripcionHechos: '',
  montoEstimado: '',
  mercanciaInvolucrada: '',
  rutDenunciado: '',
  nombreDenunciado: '',
  direccionDenunciado: '',
  emailDenunciado: '',
  telefonoDenunciado: '',
  representanteLegal: '',
  codigoAgente: '',
  nombreAgente: '',
  documentoAduanero: '',
  tipoDocumento: '',
  documentosAdjuntos: [],
};

export const DenunciasForm: React.FC = () => {
  const navigate = useNavigate();
  const { hallazgoId } = useParams<{ hallazgoId: string }>();
  const location = useLocation();
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  // Estado del formulario
  const [formData, setFormData] = useState<FormularioDenunciaData>(initialFormData);
  const [hallazgoOrigen, setHallazgoOrigen] = useState<Hallazgo | null>(null);
  const [isLoadingHallazgo, setIsLoadingHallazgo] = useState(false);
  
  // Determinar si estamos creando desde un hallazgo
  const isDesdeHallazgo = useMemo(() => {
    return location.pathname.includes('desde-hallazgo') || 
           location.pathname.includes('gestionar') ||
           !!hallazgoId;
  }, [location.pathname, hallazgoId]);
  
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
            setFormData({
              ...initialFormData,
              ...datosFormulario,
            });
          }
        }
        
        setIsLoadingHallazgo(false);
      }, 500);
    }
  }, [hallazgoId, isDesdeHallazgo]);

  // Handler para actualizar campos del formulario
  const handleInputChange = (field: keyof FormularioDenunciaData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      {[1, 2, 3, 4].map((step) => (
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
              className={`w-16 h-1 mx-2 rounded ${
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
    'Involucrados',
    'Documentos',
    'Revisión y Envío'
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
              <Badge variant={hallazgoOrigen.tipoHallazgo === 'Penal' ? 'error' : 'info'}>
                {hallazgoOrigen.tipoHallazgo}
              </Badge>
            </div>
            <p className="text-sm text-amber-700 mb-2">
              Los datos han sido pre-rellenados con la información del hallazgo. 
              Revise y complete la información necesaria para formalizar la denuncia.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="text-amber-800">
                <strong>Aduana:</strong> {hallazgoOrigen.aduana}
              </span>
              <span className="text-amber-800">
                <strong>Monto:</strong> {hallazgoOrigen.montoEstimado}
              </span>
              <span className="text-amber-800">
                <strong>Funcionario:</strong> {hallazgoOrigen.funcionarioAsignado}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DatosGenerales = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Aduana de Origen"
          id="aduanaOrigen"
          type="text"
          placeholder="Seleccione aduana"
          value={formData.aduanaOrigen}
          onChange={(e) => handleInputChange('aduanaOrigen', e.target.value)}
          required
        />
        <InputField
          label="Sección"
          id="seccion"
          type="text"
          placeholder="Seleccione sección"
          value={formData.seccion}
          onChange={(e) => handleInputChange('seccion', e.target.value)}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Fecha de Ingreso"
          id="fechaIngreso"
          type="text"
          placeholder="dd-mm-aaaa"
          value={formData.fechaIngreso}
          onChange={(e) => handleInputChange('fechaIngreso', e.target.value)}
          required
          icon={<Icon name="CalendarDays" size={18} color="#6B7280" />}
        />
        <InputField
          label="Tipo de Infracción"
          id="tipoInfraccion"
          type="text"
          placeholder="Seleccione tipo"
          value={formData.tipoInfraccion}
          onChange={(e) => handleInputChange('tipoInfraccion', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Norma Infringida"
          id="normaInfringida"
          type="text"
          placeholder="Ej: Art. 174 Ordenanza de Aduanas"
          value={formData.normaInfringida}
          onChange={(e) => handleInputChange('normaInfringida', e.target.value)}
          required
        />
        <InputField
          label="Fundamento Legal"
          id="fundamentoLegal"
          type="text"
          placeholder="Seleccione fundamento"
          value={formData.fundamentoLegal}
          onChange={(e) => handleInputChange('fundamentoLegal', e.target.value)}
          required
        />
      </div>

      <div className="col-span-2">
        <label className="form-label">Descripción de los Hechos</label>
        <textarea
          className="form-input min-h-[120px]"
          placeholder="Describa detalladamente los hechos que motivan la denuncia..."
          value={formData.descripcionHechos}
          onChange={(e) => handleInputChange('descripcionHechos', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Monto Estimado (CLP)"
          id="montoEstimado"
          type="text"
          placeholder="$0"
          value={formData.montoEstimado}
          onChange={(e) => handleInputChange('montoEstimado', e.target.value)}
        />
        <InputField
          label="Mercancía Involucrada"
          id="mercancia"
          type="text"
          placeholder="Descripción de mercancía"
          value={formData.mercanciaInvolucrada}
          onChange={(e) => handleInputChange('mercanciaInvolucrada', e.target.value)}
        />
      </div>
    </div>
  );

  const Involucrados = () => (
    <div className="space-y-6">
      <div className="card p-5 border-l-4 border-l-aduana-azul">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="User" size={18} />
          Denunciado Principal
          {isDesdeHallazgo && (
            <Badge variant="info" className="ml-2">Pre-rellenado desde hallazgo</Badge>
          )}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="RUT"
            id="rutDenunciado"
            type="text"
            placeholder="12.345.678-9"
            value={formData.rutDenunciado}
            onChange={(e) => handleInputChange('rutDenunciado', e.target.value)}
            required
          />
          <InputField
            label="Nombre/Razón Social"
            id="nombreDenunciado"
            type="text"
            placeholder="Nombre completo o razón social"
            value={formData.nombreDenunciado}
            onChange={(e) => handleInputChange('nombreDenunciado', e.target.value)}
            required
          />
          <InputField
            label="Dirección"
            id="direccionDenunciado"
            type="text"
            placeholder="Dirección completa"
            value={formData.direccionDenunciado}
            onChange={(e) => handleInputChange('direccionDenunciado', e.target.value)}
          />
          <InputField
            label="Correo Electrónico"
            id="emailDenunciado"
            type="email"
            placeholder="correo@empresa.cl"
            value={formData.emailDenunciado}
            onChange={(e) => handleInputChange('emailDenunciado', e.target.value)}
          />
          <InputField
            label="Teléfono"
            id="telefonoDenunciado"
            type="text"
            placeholder="+56 9 1234 5678"
            value={formData.telefonoDenunciado}
            onChange={(e) => handleInputChange('telefonoDenunciado', e.target.value)}
          />
          <InputField
            label="Representante Legal"
            id="representanteLegal"
            type="text"
            placeholder="Nombre del representante"
            value={formData.representanteLegal || ''}
            onChange={(e) => handleInputChange('representanteLegal', e.target.value)}
          />
        </div>
      </div>

      <div className="card p-5 border-l-4 border-l-emerald-500">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="Shield" size={18} />
          Agente de Aduanas (si aplica)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Código de Agente"
            id="codigoAgente"
            type="text"
            placeholder="Código del agente"
            value={formData.codigoAgente || ''}
            onChange={(e) => handleInputChange('codigoAgente', e.target.value)}
          />
          <InputField
            label="Nombre del Agente"
            id="nombreAgente"
            type="text"
            placeholder="Nombre del agente de aduanas"
            value={formData.nombreAgente || ''}
            onChange={(e) => handleInputChange('nombreAgente', e.target.value)}
          />
        </div>
      </div>

      <CustomButton variant="secondary" className="flex items-center gap-2">
        <Icon name="UserPlus" size={16} />
        Agregar otro involucrado
      </CustomButton>
    </div>
  );

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
      {/* Documentos pre-cargados del hallazgo */}
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
                  <button className="text-red-500 hover:text-red-700">
                    <Icon name="Trash2" size={18} />
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
          label="N° Documento Aduanero"
          id="nroDocumentoAduanero"
          type="text"
          placeholder="Ej: 6020-24-0012345"
          value={formData.documentoAduanero || ''}
          onChange={(e) => handleInputChange('documentoAduanero', e.target.value)}
        />
        <InputField
          label="Tipo de Documento"
          id="tipoDocumento"
          type="text"
          placeholder="Seleccione tipo"
          value={formData.tipoDocumento || ''}
          onChange={(e) => handleInputChange('tipoDocumento', e.target.value)}
        />
      </div>
    </div>
  );

  const Revision = () => {
    const numeroDenunciaGenerado = useMemo(() => generarNumeroDenuncia(), []);
    
    return (
      <div className="space-y-6">
        {/* Banner informativo */}
        <div className="alert alert-info">
          <Icon name="Info" size={20} />
          <div>
            <p className="font-medium">Revise la información antes de enviar</p>
            <p className="text-sm mt-1">
              {isDesdeHallazgo 
                ? `Al confirmar, el hallazgo ${formData.hallazgoOrigen} será convertido en la denuncia N° ${numeroDenunciaGenerado} y se iniciará el flujo correspondiente.`
                : 'Una vez enviada la denuncia, se generará el expediente digital y se iniciará el flujo de trabajo correspondiente.'
              }
            </p>
          </div>
        </div>

        {/* Número de denuncia a generar */}
        <div className="card p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Icon name="FileCheck" size={24} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-emerald-700">Número de Denuncia a Generar</p>
              <p className="text-2xl font-bold text-emerald-800">{numeroDenunciaGenerado}</p>
            </div>
            {isDesdeHallazgo && (
              <div className="ml-auto">
                <Badge variant="warning">
                  Desde {formData.hallazgoOrigen}
                </Badge>
              </div>
            )}
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
                <dt className="text-gray-500">Tipo de Infracción:</dt>
                <dd className="font-medium">{formData.tipoInfraccion || 'No especificada'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Norma Infringida:</dt>
                <dd className="font-medium text-xs">{formData.normaInfringida || 'No especificada'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Monto Estimado:</dt>
                <dd className="font-medium text-aduana-rojo">{formData.montoEstimado || '$0'}</dd>
              </div>
            </dl>
          </div>

          <div className="card p-5">
            <h4 className="font-semibold text-gray-900 mb-4 border-b pb-2">Denunciado</h4>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">RUT:</dt>
                <dd className="font-medium">{formData.rutDenunciado || 'No especificado'}</dd>
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

        {/* Descripción de hechos */}
        <div className="card p-5">
          <h4 className="font-semibold text-gray-900 mb-4 border-b pb-2">Descripción de los Hechos</h4>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {formData.descripcionHechos || 'No se ha proporcionado descripción.'}
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
            {isDesdeHallazgo 
              ? `Confirmo que la información es veraz y autorizo la conversión del hallazgo ${formData.hallazgoOrigen} en denuncia formal. El hallazgo será marcado como "Convertido a Denuncia" y se generará el expediente digital correspondiente.`
              : 'Confirmo que la información proporcionada es veraz y corresponde a los hechos investigados. Entiendo que esta denuncia generará un expediente digital y notificaciones al denunciado.'
            }
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
        return <DatosGenerales />;
      case 2:
        return <Involucrados />;
      case 3:
        return <Documentos />;
      case 4:
        return <Revision />;
      default:
        return <DatosGenerales />;
    }
  };

  const handleSubmit = () => {
    const numeroDenuncia = generarNumeroDenuncia();
    
    showToast({
      type: 'success',
      title: isDesdeHallazgo 
        ? '¡Hallazgo convertido a denuncia exitosamente!'
        : '¡Denuncia registrada exitosamente!',
      message: isDesdeHallazgo
        ? `El hallazgo ${formData.hallazgoOrigen} ha sido convertido en la denuncia N° ${numeroDenuncia}. El expediente digital ha sido generado.`
        : `La denuncia N° ${numeroDenuncia} ha sido registrada. El expediente digital ha sido generado y se ha iniciado el flujo de trabajo correspondiente.`,
      duration: 5000,
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
            onClick={() => navigate(isDesdeHallazgo ? -1 : ERoutePaths.DENUNCIAS)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon name="ArrowLeft" size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isDesdeHallazgo ? 'Gestionar Hallazgo → Denuncia' : 'Nueva Denuncia'}
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
            <div className="flex items-center gap-8 text-sm">
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
                  onClick={() => setCurrentStep(currentStep + 1)}
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
    </CustomLayout>
  );
};

export default DenunciasForm;
