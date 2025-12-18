/**
 * ReclamoForm - Formulario para crear/editar reclamos
 */

import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from 'he-button-custom-library';
import CONSTANTS_APP from "../../constants/sidebar-menu";
import CustomLayout from "../../Layout/Layout";
import { Badge } from '../../components/UI';
import {
  getReclamoPorId,
  getDenunciaPorId,
  getCargoPorId,
  getGiroPorId,
  crearReclamo,
  actualizarReclamo,
  aduanas,
  getTodasLasNotificaciones,
  usuarioActual,
  type Reclamo,
  type TipoReclamoCompleto,
  type OrigenReclamo,
  formatMonto,
} from '../../data';
import { useToast } from '../../components/UI';
import { ERoutePaths } from '../../routes/routes';

const tiposReclamo: { value: TipoReclamoCompleto; label: string }[] = [
  { value: 'Reposición', label: 'Recurso de Reposición' },
  { value: 'TTA', label: 'Reclamo ante TTA' },
];

// Nota: Giro removido porque un evento reclamado no puede generar un giro
const origenesReclamo: { value: OrigenReclamo; label: string }[] = [
  { value: 'DENUNCIA', label: 'Denuncia' },
  { value: 'CARGO', label: 'Cargo' },
  { value: 'OTRO', label: 'Otro' },
];

const ReclamoForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const { showToast } = useToast();
  
  // Pre-fill params
  const origenParam = searchParams.get('origen') as OrigenReclamo | null;
  const entidadId = searchParams.get('entidadId');
  
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState<Partial<Reclamo>>({
    tipoReclamo: 'Reposición',
    origenReclamo: origenParam || 'DENUNCIA',
    reclamante: '',
    rutReclamante: '',
    direccionReclamante: '',
    emailReclamante: '',
    representanteLegal: '',
    montoReclamado: 0,
    fundamentoReclamo: '',
    peticiones: '',
    descripcion: '',
    observaciones: '',
    codigoAduana: '',
  });
  
  // Cargar datos de la entidad origen si viene pre-llenado
  useEffect(() => {
    if (origenParam && entidadId) {
      let entidadData: { reclamante?: string; rut?: string; monto?: number; numero?: string } = {};
      
      if (origenParam === 'DENUNCIA') {
        const denuncia = getDenunciaPorId(entidadId);
        if (denuncia) {
          const involucrado = denuncia.involucrados?.[0];
          const montoNum = denuncia.montoEstimado ? parseInt(denuncia.montoEstimado.replace(/\./g, '')) || 0 : 0;
          entidadData = {
            reclamante: involucrado?.nombre || '',
            rut: involucrado?.rut || '',
            monto: montoNum,
            numero: denuncia.numeroDenuncia,
          };
          setFormData(prev => ({
            ...prev,
            origenReclamo: 'DENUNCIA',
            entidadOrigenId: denuncia.id,
            numeroEntidadOrigen: denuncia.numeroDenuncia,
            denunciaAsociada: denuncia.numeroDenuncia,
            reclamante: entidadData.reclamante || '',
            rutReclamante: entidadData.rut || '',
            montoReclamado: montoNum,
            codigoAduana: denuncia.aduana,
          }));
        }
      } else if (origenParam === 'CARGO') {
        const cargo = getCargoPorId(entidadId);
        if (cargo) {
          const infractor = cargo.infractores?.[0];
          const montoCargoNum = cargo.montoTotal ? parseInt(cargo.montoTotal.replace(/\./g, '')) || 0 : 0;
          entidadData = {
            reclamante: infractor?.nombre || '',
            rut: infractor?.rut || '',
            monto: montoCargoNum,
            numero: cargo.numeroCargo,
          };
          setFormData(prev => ({
            ...prev,
            origenReclamo: 'CARGO',
            entidadOrigenId: cargo.id,
            numeroEntidadOrigen: cargo.numeroCargo,
            cargoAsociado: cargo.numeroCargo,
            denunciaAsociada: cargo.denunciaNumero || '',
            reclamante: entidadData.reclamante || '',
            rutReclamante: entidadData.rut || '',
            montoReclamado: montoCargoNum,
            codigoAduana: cargo.codigoAduana,
          }));
        }
      } else if (origenParam === 'GIRO') {
        const giro = getGiroPorId(entidadId);
        if (giro) {
          const montoGiroNum = giro.montoTotal ? parseInt(giro.montoTotal.replace(/\./g, '')) || 0 : 0;
          entidadData = {
            reclamante: giro.emitidoA || '',
            rut: giro.rutDeudor || '',
            monto: montoGiroNum,
            numero: giro.numeroGiro,
          };
          setFormData(prev => ({
            ...prev,
            origenReclamo: 'GIRO',
            entidadOrigenId: giro.id,
            numeroEntidadOrigen: giro.numeroGiro,
            giroAsociado: giro.numeroGiro,
            denunciaAsociada: giro.denunciaNumero || '',
            reclamante: giro.emitidoA || '',
            rutReclamante: giro.rutDeudor || '',
            montoReclamado: montoGiroNum,
            codigoAduana: giro.codigoAduana,
          }));
        }
      }
    }
  }, [origenParam, entidadId]);
  
  // Cargar datos si es edición
  useEffect(() => {
    if (isEditing && id) {
      const reclamo = getReclamoPorId(id);
      if (reclamo) {
        setFormData(reclamo);
      }
    }
  }, [isEditing, id]);
  
  const entidadOrigen = useMemo(() => {
    if (!formData.entidadOrigenId) return null;
    switch (formData.origenReclamo) {
      case 'DENUNCIA':
        return getDenunciaPorId(formData.entidadOrigenId);
      case 'CARGO':
        return getCargoPorId(formData.entidadOrigenId);
      case 'GIRO':
        return getGiroPorId(formData.entidadOrigenId);
      default:
        return null;
    }
  }, [formData.origenReclamo, formData.entidadOrigenId]);
  
  const handleChange = (field: keyof Reclamo, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.tipoReclamo) newErrors.tipoReclamo = 'Seleccione el tipo de reclamo';
      if (!formData.origenReclamo) newErrors.origenReclamo = 'Seleccione el origen del reclamo';
    }
    
    if (step === 2) {
      if (!formData.reclamante?.trim()) newErrors.reclamante = 'Ingrese el nombre del reclamante';
      if (!formData.rutReclamante?.trim()) newErrors.rutReclamante = 'Ingrese el RUT del reclamante';
    }
    
    if (step === 3) {
      if (!formData.fundamentoReclamo?.trim()) newErrors.fundamentoReclamo = 'Ingrese el fundamento del reclamo';
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
      if (isEditing && id) {
        actualizarReclamo(id, formData);
        showToast({
          type: 'success',
          title: 'Reclamo Actualizado',
          message: `El reclamo ha sido actualizado exitosamente.`,
          duration: 4000,
        });
      } else {
        crearReclamo(formData);
        showToast({
          type: 'success',
          title: 'Reclamo Creado',
          message: `El reclamo ha sido creado exitosamente.`,
          duration: 4000,
        });
      }
      navigate(ERoutePaths.RECLAMOS);
    } finally {
      setIsSaving(false);
    }
  };
  
  const steps: { number: number; title: string; icon: "FileText" | "User" | "AlignLeft" | "Check" }[] = [
    { number: 1, title: 'Tipo y Origen', icon: 'FileText' },
    { number: 2, title: 'Reclamante', icon: 'User' },
    { number: 3, title: 'Fundamentos', icon: 'AlignLeft' },
    { number: 4, title: 'Revisión', icon: 'Check' },
  ];
  
  const allNotifications = getTodasLasNotificaciones();

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
    <div className="flex-1 flex flex-col bg-gray-50 min-h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(ERoutePaths.RECLAMOS)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon name="ArrowLeft" size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-aduana-azul">
              {isEditing ? 'Editar Reclamo' : 'Nuevo Reclamo'}
            </h1>
            <p className="text-gray-500">
              {isEditing ? `Editando ${formData.numeroReclamo}` : 'Complete los datos del reclamo'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Steps Indicator */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
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
      
      {/* Entidad origen info */}
      {entidadOrigen && (
        <div className="mx-6 mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Icon name="Info" size={24} className="text-blue-500" />
            <div>
              <p className="font-medium text-blue-700">
                Reclamo originado desde {formData.origenReclamo}
              </p>
              <p className="text-sm text-blue-600">
                N° {formData.numeroEntidadOrigen}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Form Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Step 1: Tipo y Origen */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Icon name="FileText" size={24} className="text-aduana-azul" />
                Tipo y Origen del Reclamo
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Reclamo *
                  </label>
                  <select
                    value={formData.tipoReclamo || ''}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChange('tipoReclamo', e.target.value as TipoReclamoCompleto)}
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent ${errors.tipoReclamo ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Seleccione...</option>
                    {tiposReclamo.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  {errors.tipoReclamo && <p className="text-sm text-red-500 mt-1">{errors.tipoReclamo}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Origen del Reclamo *
                  </label>
                  <select
                    value={formData.origenReclamo || ''}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChange('origenReclamo', e.target.value as OrigenReclamo)}
                    disabled={Boolean(entidadOrigen)}
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent disabled:bg-gray-100 ${errors.origenReclamo ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Seleccione...</option>
                    {origenesReclamo.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  {errors.origenReclamo && <p className="text-sm text-red-500 mt-1">{errors.origenReclamo}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aduana
                  </label>
                  <select
                    value={formData.codigoAduana || ''}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChange('codigoAduana', e.target.value)}
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
                    N° Entidad Origen
                  </label>
                  <input
                    type="text"
                    value={formData.numeroEntidadOrigen || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('numeroEntidadOrigen', e.target.value)}
                    disabled={Boolean(entidadOrigen)}
                    placeholder="Ej: 993519"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
              </div>
              
              {/* Info sobre tipo de reclamo */}
              <div className={`p-4 rounded-lg ${formData.tipoReclamo === 'TTA' ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'}`}>
                <div className="flex items-start gap-3">
                  <Icon name="Info" size={20} className={formData.tipoReclamo === 'TTA' ? 'text-red-500' : 'text-amber-500'} />
                  <div>
                    <p className={`font-medium ${formData.tipoReclamo === 'TTA' ? 'text-red-700' : 'text-amber-700'}`}>
                      {formData.tipoReclamo === 'TTA' ? 'Reclamo ante Tribunal Tributario y Aduanero' : 'Recurso de Reposición'}
                    </p>
                    <p className={`text-sm mt-1 ${formData.tipoReclamo === 'TTA' ? 'text-red-600' : 'text-amber-600'}`}>
                      {formData.tipoReclamo === 'TTA' 
                        ? 'El reclamo será derivado al TTA correspondiente. Plazo de respuesta: 90 días.' 
                        : 'Recurso administrativo ante la misma autoridad. Plazo de respuesta: 15 días.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 2: Reclamante */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Icon name="User" size={24} className="text-aduana-azul" />
                Datos del Reclamante
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre/Razón Social *
                  </label>
                  <input
                    type="text"
                    value={formData.reclamante || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('reclamante', e.target.value)}
                    placeholder="Nombre del reclamante"
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent ${errors.reclamante ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.reclamante && <p className="text-sm text-red-500 mt-1">{errors.reclamante}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RUT *
                  </label>
                  <input
                    type="text"
                    value={formData.rutReclamante || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('rutReclamante', e.target.value)}
                    placeholder="12.345.678-9"
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent ${errors.rutReclamante ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.rutReclamante && <p className="text-sm text-red-500 mt-1">{errors.rutReclamante}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Representante Legal
                  </label>
                  <input
                    type="text"
                    value={formData.representanteLegal || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('representanteLegal', e.target.value)}
                    placeholder="Nombre del representante (si aplica)"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={formData.direccionReclamante || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('direccionReclamante', e.target.value)}
                    placeholder="Dirección del reclamante"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.emailReclamante || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('emailReclamante', e.target.value)}
                    placeholder="correo@ejemplo.cl"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={formData.telefonoReclamante || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('telefonoReclamante', e.target.value)}
                    placeholder="+56 9 1234 5678"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto Reclamado
                </label>
                <div className="relative max-w-xs">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="text"
                    value={formData.montoReclamado ? formData.montoReclamado.toLocaleString('es-CL') : ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, '');
                      handleChange('montoReclamado', value ? parseInt(value) : 0);
                    }}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-8 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Step 3: Fundamentos */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Icon name="AlignLeft" size={24} className="text-aduana-azul" />
                Fundamentos y Peticiones
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción Breve *
                </label>
                <input
                  type="text"
                  value={formData.descripcion || ''}
                  onChange={(e) => handleChange('descripcion', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                  placeholder="Descripción breve del reclamo..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fundamento del Reclamo *
                </label>
                <textarea
                  value={formData.fundamentoReclamo || ''}
                  onChange={(e) => handleChange('fundamentoReclamo', e.target.value)}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent resize-none ${errors.fundamentoReclamo ? 'border-red-500' : 'border-gray-300'}`}
                  rows={6}
                  placeholder="Indique los fundamentos de hecho y de derecho que sustentan el reclamo..."
                />
                {errors.fundamentoReclamo && (
                  <p className="text-sm text-red-500 mt-1">{errors.fundamentoReclamo}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peticiones
                </label>
                <textarea
                  value={formData.peticiones || ''}
                  onChange={(e) => handleChange('peticiones', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Indique lo que solicita..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones
                </label>
                <textarea
                  value={formData.observaciones || ''}
                  onChange={(e) => handleChange('observaciones', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Observaciones adicionales (opcional)..."
                />
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
                    <p className="text-sm text-gray-500">Tipo de Reclamo</p>
                    <Badge variant={formData.tipoReclamo === 'TTA' ? 'danger' : 'warning'}>
                      {formData.tipoReclamo}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Origen</p>
                    <p className="font-medium">{formData.origenReclamo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Reclamante</p>
                    <p className="font-medium">{formData.reclamante || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">RUT</p>
                    <p className="font-medium">{formData.rutReclamante || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Monto Reclamado</p>
                    <p className="font-medium text-aduana-azul">
                      {formData.montoReclamado ? formatMonto(formData.montoReclamado) : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Aduana</p>
                    <p className="font-medium">
                      {aduanas.find(a => a.codigo === formData.codigoAduana)?.nombre || '-'}
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Descripción</p>
                  <p className="font-medium">{formData.descripcion || '-'}</p>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Fundamento</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {formData.fundamentoReclamo || '-'}
                  </p>
                </div>
                
                {formData.peticiones && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Peticiones</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {formData.peticiones}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Icon name="CheckCircle" size={24} className="text-emerald-500" />
                  <div>
                    <p className="font-medium text-emerald-700">
                      ¿Está seguro de {isEditing ? 'guardar los cambios' : 'crear el reclamo'}?
                    </p>
                    <p className="text-sm text-emerald-600 mt-1">
                      Revise la información antes de confirmar.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer Actions */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between">
          <button
            onClick={currentStep === 1 ? () => navigate(ERoutePaths.RECLAMOS) : handleBack}
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
              {isEditing ? 'Guardar Cambios' : 'Crear Reclamo'}
            </button>
          )}
        </div>
      </div>
    </div>
    </CustomLayout>
  );
};

export default ReclamoForm;

