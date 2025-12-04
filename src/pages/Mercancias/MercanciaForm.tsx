/**
 * MercanciaForm - Formulario para crear/editar mercancías
 */

import React, { useState, useEffect, ChangeEvent } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from 'he-button-custom-library';
import CONSTANTS_APP from "../../constants/sidebar-menu";
import CustomLayout from "../../Layout/Layout";
import { Badge } from '../../components/UI';
import {
  getMercanciaPorId,
  crearMercancia,
  aduanas,
  getTodasLasNotificaciones,
  usuarioActual,
  type Mercancia,
  type EstadoMercancia,
} from '../../data';
import { ERoutePaths } from '../../routes/routes';

const estadosIniciales: EstadoMercancia[] = ['En Custodia', 'Retenida', 'Pendiente Disposición'];

const MercanciaForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  // Pre-fill params
  const denunciaId = searchParams.get('denunciaId');
  const denunciaNumero = searchParams.get('denunciaNumero');
  
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const allNotifications = getTodasLasNotificaciones();
  
  // Form data
  const [formData, setFormData] = useState<Partial<Mercancia>>({
    descripcion: '',
    partida: '',
    cantidad: 0,
    unidadMedida: 'Unidades',
    estado: 'En Custodia',
    codigoAduanaIngreso: '',
    denunciaId: denunciaId || '',
    denunciaNumero: denunciaNumero || '',
  });
  
  // Cargar datos si es edición
  useEffect(() => {
    if (isEditing && id) {
      const mercancia = getMercanciaPorId(id);
      if (mercancia) {
        setFormData(mercancia);
      }
    }
  }, [isEditing, id]);
  
  const handleChange = (field: keyof Mercancia, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.descripcion?.trim()) newErrors.descripcion = 'Ingrese la descripción';
      if (!formData.partida?.trim()) newErrors.partida = 'Ingrese la partida arancelaria';
    }
    
    if (step === 2) {
      if (!formData.cantidad || formData.cantidad <= 0) newErrors.cantidad = 'Ingrese una cantidad válida';
      if (!formData.unidadMedida?.trim()) newErrors.unidadMedida = 'Seleccione la unidad de medida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };
  
  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsSaving(true);
    try {
      const nuevaMercancia = crearMercancia(formData);
      navigate(ERoutePaths.MERCANCIAS_DETALLE.replace(':id', nuevaMercancia.id));
    } finally {
      setIsSaving(false);
    }
  };
  
  const steps: { number: number; title: string; icon: "Package" | "Scale" | "DollarSign" | "Check" }[] = [
    { number: 1, title: 'Descripción', icon: 'Package' },
    { number: 2, title: 'Cantidades', icon: 'Scale' },
    { number: 3, title: 'Valores', icon: 'DollarSign' },
    { number: 4, title: 'Revisión', icon: 'Check' },
  ];

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
        <div className="bg-white border-b border-gray-200 px-6 py-4 -mx-6 -mt-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(ERoutePaths.MERCANCIAS)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Icon name="ArrowLeft" size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-aduana-azul">
                {isEditing ? 'Editar Mercancía' : 'Nueva Mercancía'}
              </h1>
              <p className="text-gray-500">
                {isEditing ? `Editando ${formData.codigoMercancia}` : 'Registre los datos de la mercancía'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Steps Indicator */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 -mx-6">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div 
                  className={`flex items-center gap-2 cursor-pointer ${
                    currentStep === step.number 
                      ? 'text-aduana-azul' 
                      : currentStep > step.number 
                        ? 'text-emerald-600' 
                        : 'text-gray-400'
                  }`}
                  onClick={() => currentStep > step.number && setCurrentStep(step.number)}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    currentStep === step.number 
                      ? 'border-aduana-azul bg-aduana-azul text-white' 
                      : currentStep > step.number 
                        ? 'border-emerald-600 bg-emerald-600 text-white' 
                        : 'border-gray-300'
                  }`}>
                    {currentStep > step.number ? (
                      <Icon name="Check" size={20} />
                    ) : (
                      <Icon name={step.icon} size={20} />
                    )}
                  </div>
                  <span className="font-medium hidden md:inline">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 md:w-24 h-0.5 mx-2 ${
                    currentStep > step.number ? 'bg-emerald-600' : 'bg-gray-300'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {/* Form Content */}
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Step 1: Descripción */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Icon name="Package" size={24} className="text-aduana-azul" />
                Descripción de la Mercancía
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    value={formData.descripcion || ''}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleChange('descripcion', e.target.value)}
                    placeholder="Descripción detallada de la mercancía..."
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent resize-none ${errors.descripcion ? 'border-red-500' : 'border-gray-300'}`}
                    rows={3}
                  />
                  {errors.descripcion && <p className="text-sm text-red-500 mt-1">{errors.descripcion}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Partida Arancelaria *
                    </label>
                    <input
                      type="text"
                      value={formData.partida || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('partida', e.target.value)}
                      placeholder="Ej: 8528"
                      className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent ${errors.partida ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.partida && <p className="text-sm text-red-500 mt-1">{errors.partida}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subpartida
                    </label>
                    <input
                      type="text"
                      value={formData.subpartida || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('subpartida', e.target.value)}
                      placeholder="Ej: 852872"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      País Origen
                    </label>
                    <input
                      type="text"
                      value={formData.paisOrigen || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('paisOrigen', e.target.value)}
                      placeholder="Ej: China"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aduana de Ingreso
                    </label>
                    <select
                      value={formData.codigoAduanaIngreso || ''}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChange('codigoAduanaIngreso', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                    >
                      <option value="">Seleccione...</option>
                      {aduanas.map(a => (
                        <option key={a.codigo} value={a.codigo}>{a.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado Inicial
                    </label>
                    <select
                      value={formData.estado || 'En Custodia'}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChange('estado', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                    >
                      {estadosIniciales.map(estado => (
                        <option key={estado} value={estado}>{estado}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 2: Cantidades */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Icon name="Scale" size={24} className="text-aduana-azul" />
                Cantidades y Medidas
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad *
                  </label>
                  <input
                    type="number"
                    value={formData.cantidad || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('cantidad', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent ${errors.cantidad ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.cantidad && <p className="text-sm text-red-500 mt-1">{errors.cantidad}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unidad de Medida *
                  </label>
                  <select
                    value={formData.unidadMedida || 'Unidades'}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChange('unidadMedida', e.target.value)}
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent ${errors.unidadMedida ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="Unidades">Unidades</option>
                    <option value="Pares">Pares</option>
                    <option value="Cajas">Cajas</option>
                    <option value="Kilos">Kilos</option>
                    <option value="Litros">Litros</option>
                    <option value="Metros">Metros</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    N° Bultos
                  </label>
                  <input
                    type="number"
                    value={formData.numeroBultos || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('numeroBultos', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso Bruto (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.pesoBruto || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('pesoBruto', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Step 3: Valores */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Icon name="DollarSign" size={24} className="text-aduana-azul" />
                Valores
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor FOB (USD)
                  </label>
                  <input
                    type="number"
                    value={formData.valorFOB || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('valorFOB', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor CIF (USD)
                  </label>
                  <input
                    type="number"
                    value={formData.valorCIF || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('valorCIF', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Moneda
                  </label>
                  <select
                    value={formData.moneda || 'USD'}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChange('moneda', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                  >
                    <option value="USD">USD - Dólar Estadounidense</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="CLP">CLP - Peso Chileno</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación Inicial
                  </label>
                  <input
                    type="text"
                    value={formData.ubicacion || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('ubicacion', e.target.value)}
                    placeholder="Ej: Bodega Fiscal Valparaíso"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Step 4: Revisión */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Icon name="Check" size={24} className="text-emerald-600" />
                Revisión Final
              </h2>
              
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Descripción</p>
                    <p className="font-medium">{formData.descripcion || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Estado</p>
                    <Badge variant="warning">{formData.estado}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Partida</p>
                    <p className="font-medium">{formData.partida || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">País Origen</p>
                    <p className="font-medium">{formData.paisOrigen || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cantidad</p>
                    <p className="font-medium">{formData.cantidad?.toLocaleString('es-CL')} {formData.unidadMedida}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Valor CIF</p>
                    <p className="font-medium text-aduana-azul">
                      {formData.valorCIF ? `$${formData.valorCIF.toLocaleString('es-CL')} ${formData.moneda}` : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Aduana</p>
                    <p className="font-medium">
                      {aduanas.find(a => a.codigo === formData.codigoAduanaIngreso)?.nombre || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ubicación</p>
                    <p className="font-medium">{formData.ubicacion || '-'}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Icon name="CheckCircle" size={24} className="text-emerald-500" />
                  <div>
                    <p className="font-medium text-emerald-700">
                      ¿Está seguro de crear la mercancía?
                    </p>
                    <p className="text-sm text-emerald-600 mt-1">
                      Se registrará automáticamente un evento de Ingreso.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer Actions */}
        <div className="max-w-4xl mx-auto flex justify-between py-4">
          <button
            onClick={currentStep === 1 ? () => navigate(ERoutePaths.MERCANCIAS) : handleBack}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Icon name="ArrowLeft" size={18} />
            {currentStep === 1 ? 'Cancelar' : 'Anterior'}
          </button>
          
          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-aduana-azul text-white rounded-lg hover:bg-aduana-azul-dark flex items-center gap-2"
            >
              Siguiente
              <Icon name="ArrowRight" size={18} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Icon name={isSaving ? 'Loader' : 'Check'} size={18} className={isSaving ? 'animate-spin' : ''} />
              Crear Mercancía
            </button>
          )}
        </div>
      </div>
    </CustomLayout>
  );
};

export default MercanciaForm;

