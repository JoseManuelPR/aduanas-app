import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from "he-button-custom-library";
import CONSTANTS_APP from "../../constants/sidebar-menu";
import CustomLayout from "../../Layout/Layout";
import InputField from "../../organisms/InputField/InputField";
import { CustomButton } from "../../components/Button/Button";
import { Tabs } from "../../components/UI";
import { ERoutePaths } from "../../routes/routes";

// Datos centralizados
import {
  getTodasLasNotificaciones,
  usuarioActual,
} from '../../data';

export const DenunciasForm: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  // Obtener notificaciones para el header
  const allNotifications = getTodasLasNotificaciones();

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

  const DatosGenerales = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Aduana de Origen"
          id="aduanaOrigen"
          type="text"
          placeholder="Seleccione aduana"
          required
        />
        <InputField
          label="Sección"
          id="seccion"
          type="text"
          placeholder="Seleccione sección"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Fecha de Ingreso"
          id="fechaIngreso"
          type="date"
          required
          icon={<Icon name="CalendarDays" size={18} color="#6B7280" />}
        />
        <InputField
          label="Tipo de Infracción"
          id="tipoInfraccion"
          type="text"
          placeholder="Seleccione tipo"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Norma Infringida"
          id="normaInfringida"
          type="text"
          placeholder="Ej: Art. 174 Ordenanza de Aduanas"
          required
        />
        <InputField
          label="Fundamento Legal"
          id="fundamentoLegal"
          type="text"
          placeholder="Seleccione fundamento"
          required
        />
      </div>

      <div className="col-span-2">
        <label className="form-label">Descripción de los Hechos</label>
        <textarea
          className="form-input min-h-[120px]"
          placeholder="Describa detalladamente los hechos que motivan la denuncia..."
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Monto Estimado (CLP)"
          id="montoEstimado"
          type="text"
          placeholder="$0"
        />
        <InputField
          label="Mercancía Involucrada"
          id="mercancia"
          type="text"
          placeholder="Descripción de mercancía"
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
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="RUT"
            id="rutDenunciado"
            type="text"
            placeholder="12.345.678-9"
            required
          />
          <InputField
            label="Nombre/Razón Social"
            id="nombreDenunciado"
            type="text"
            placeholder="Nombre completo o razón social"
            required
          />
          <InputField
            label="Dirección"
            id="direccionDenunciado"
            type="text"
            placeholder="Dirección completa"
          />
          <InputField
            label="Correo Electrónico"
            id="emailDenunciado"
            type="email"
            placeholder="correo@empresa.cl"
          />
          <InputField
            label="Teléfono"
            id="telefonoDenunciado"
            type="text"
            placeholder="+56 9 1234 5678"
          />
          <InputField
            label="Representante Legal"
            id="representanteLegal"
            type="text"
            placeholder="Nombre del representante"
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
          />
          <InputField
            label="Nombre del Agente"
            id="nombreAgente"
            type="text"
            placeholder="Nombre del agente de aduanas"
          />
        </div>
      </div>

      <CustomButton variant="secondary" className="flex items-center gap-2">
        <Icon name="UserPlus" size={16} />
        Agregar otro involucrado
      </CustomButton>
    </div>
  );

  const Documentos = () => (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-aduana-azul transition-colors cursor-pointer">
        <Icon name="Upload" size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 mb-2">
          Arrastra archivos aquí o haz clic para seleccionar
        </p>
        <p className="text-sm text-gray-500">
          PDF, DOC, XLS, JPG hasta 10MB cada uno
        </p>
        <CustomButton variant="secondary" className="mt-4">
          Seleccionar Archivos
        </CustomButton>
      </div>

      <div className="card p-5">
        <h4 className="font-semibold text-gray-900 mb-4">Documentos Adjuntados</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Icon name="FileText" size={24} className="text-aduana-azul" />
              <div>
                <p className="font-medium text-gray-900">declaracion_importacion.pdf</p>
                <p className="text-sm text-gray-500">2.4 MB</p>
              </div>
            </div>
            <button className="text-red-500 hover:text-red-700">
              <Icon name="Trash2" size={18} />
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Icon name="Image" size={24} className="text-emerald-600" />
              <div>
                <p className="font-medium text-gray-900">foto_mercancia.jpg</p>
                <p className="text-sm text-gray-500">1.8 MB</p>
              </div>
            </div>
            <button className="text-red-500 hover:text-red-700">
              <Icon name="Trash2" size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="N° Documento Aduanero"
          id="nroDocumentoAduanero"
          type="text"
          placeholder="Ej: 6020-24-0012345"
        />
        <InputField
          label="Tipo de Documento"
          id="tipoDocumento"
          type="text"
          placeholder="Seleccione tipo"
        />
      </div>
    </div>
  );

  const Revision = () => (
    <div className="space-y-6">
      <div className="alert alert-info">
        <Icon name="Info" size={20} />
        <div>
          <p className="font-medium">Revise la información antes de enviar</p>
          <p className="text-sm mt-1">
            Una vez enviada la denuncia, se generará el expediente digital y se iniciará el flujo de trabajo correspondiente.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-5">
          <h4 className="font-semibold text-gray-900 mb-4 border-b pb-2">Datos Generales</h4>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Aduana:</dt>
              <dd className="font-medium">Valparaíso</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Sección:</dt>
              <dd className="font-medium">Fiscalización</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Tipo de Infracción:</dt>
              <dd className="font-medium">Declaración Falsa</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Monto Estimado:</dt>
              <dd className="font-medium text-aduana-rojo">$12.500.000</dd>
            </div>
          </dl>
        </div>

        <div className="card p-5">
          <h4 className="font-semibold text-gray-900 mb-4 border-b pb-2">Denunciado</h4>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">RUT:</dt>
              <dd className="font-medium">76.123.456-7</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Nombre:</dt>
              <dd className="font-medium">Importadora Global S.A.</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Email:</dt>
              <dd className="font-medium">legal@importadora.cl</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="card p-5">
        <h4 className="font-semibold text-gray-900 mb-4 border-b pb-2">Documentos Adjuntos</h4>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
            <Icon name="FileText" size={14} />
            declaracion_importacion.pdf
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
            <Icon name="Image" size={14} />
            foto_mercancia.jpg
          </span>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <input type="checkbox" id="confirmar" className="mt-1" />
        <label htmlFor="confirmar" className="text-sm text-amber-800">
          Confirmo que la información proporcionada es veraz y corresponde a los hechos investigados. 
          Entiendo que esta denuncia generará un expediente digital y notificaciones al denunciado.
        </label>
      </div>
    </div>
  );

  const renderStepContent = () => {
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
            onClick={() => navigate(ERoutePaths.DENUNCIAS)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon name="ArrowLeft" size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nueva Denuncia</h1>
            <p className="text-gray-600">Registro de nueva denuncia aduanera</p>
          </div>
        </div>

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
                  onClick={() => {
                    alert('Denuncia registrada exitosamente');
                    navigate(ERoutePaths.DENUNCIAS);
                  }}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  <Icon name="Send" size={16} />
                  Enviar Denuncia
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

