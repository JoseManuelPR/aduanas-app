/**
 * InvolucradoForm - Formulario para crear/editar involucrados
 */

import React, { useState, useEffect, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from 'he-button-custom-library';
import CONSTANTS_APP from "../../constants/sidebar-menu";
import CustomLayout from "../../Layout/Layout";
import { Badge } from '../../components/UI';
import { ERoutePaths } from '../../routes/routes';

import {
  getInvolucradoPorId,
  crearInvolucrado,
  actualizarInvolucrado,
  agregarDireccion,
  validarRut,
  tiposIdentificacion,
  tiposPersona,
  tiposDireccion,
  regiones,
  getTodasLasNotificaciones,
  usuarioActual,
  type Involucrado,
  type DireccionInvolucrado,
  type TipoDireccion,
} from '../../data';

const InvolucradoForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const allNotifications = getTodasLasNotificaciones();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showDireccionForm, setShowDireccionForm] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState<Partial<Involucrado>>({
    tipoIdentificacion: 'RUT',
    numeroIdentificacion: '',
    digitoVerificador: '',
    tipoPersona: 'Natural',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    razonSocial: '',
    giro: '',
    email: '',
    emailSecundario: '',
    telefono: '',
    telefonoSecundario: '',
    nacionalidad: 'Chile',
    representanteLegalNombre: '',
    representanteLegalRut: '',
    observaciones: '',
    direcciones: [],
  });
  
  // Direccion form
  const [direccionForm, setDireccionForm] = useState<Partial<DireccionInvolucrado>>({
    tipoDireccion: 'Particular',
    direccion: '',
    numero: '',
    departamento: '',
    region: '',
    comuna: '',
    codigoPostal: '',
    pais: 'Chile',
    esPrincipal: false,
  });
  
  // Cargar datos si es edición
  useEffect(() => {
    if (isEditing && id) {
      const involucrado = getInvolucradoPorId(id);
      if (involucrado) {
        setFormData(involucrado);
      }
    }
  }, [isEditing, id]);
  
  const handleChange = (field: keyof Involucrado, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const handleDireccionChange = (field: keyof DireccionInvolucrado, value: string | boolean) => {
    setDireccionForm(prev => ({ ...prev, [field]: value }));
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validar identificación
    if (!formData.numeroIdentificacion?.trim()) {
      newErrors.numeroIdentificacion = 'Ingrese el número de identificación';
    } else if (formData.tipoIdentificacion === 'RUT') {
      const rutCompleto = `${formData.numeroIdentificacion}${formData.digitoVerificador || ''}`;
      const validacion = validarRut(rutCompleto);
      if (!validacion.valido) {
        newErrors.numeroIdentificacion = validacion.error || 'RUT inválido';
      }
    }
    
    // Validar según tipo de persona
    if (formData.tipoPersona === 'Natural') {
      if (!formData.nombre?.trim()) newErrors.nombre = 'Ingrese el nombre';
      if (!formData.apellidoPaterno?.trim()) newErrors.apellidoPaterno = 'Ingrese el apellido paterno';
    } else {
      if (!formData.razonSocial?.trim()) newErrors.razonSocial = 'Ingrese la razón social';
    }
    
    // Validar email si se proporciona
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validate()) return;
    
    setIsSaving(true);
    try {
      if (isEditing && id) {
        actualizarInvolucrado(id, formData);
      } else {
        const nuevo = crearInvolucrado(formData);
        // Agregar direcciones
        if (formData.direcciones && formData.direcciones.length > 0) {
          formData.direcciones.forEach(dir => {
            agregarDireccion(nuevo.id, dir);
          });
        }
      }
      navigate(ERoutePaths.INVOLUCRADOS);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleAgregarDireccion = () => {
    if (!direccionForm.direccion?.trim() || !direccionForm.region || !direccionForm.comuna) {
      return;
    }
    
    const nuevaDireccion: DireccionInvolucrado = {
      id: `temp-${Date.now()}`,
      involucradoId: formData.id || 'temp',
      tipoDireccion: direccionForm.tipoDireccion as TipoDireccion,
      direccion: direccionForm.direccion || '',
      numero: direccionForm.numero,
      departamento: direccionForm.departamento,
      region: direccionForm.region || '',
      comuna: direccionForm.comuna || '',
      codigoPostal: direccionForm.codigoPostal,
      pais: direccionForm.pais || 'Chile',
      esPrincipal: direccionForm.esPrincipal || false,
    };
    
    // Si es principal, desmarcar las otras
    if (nuevaDireccion.esPrincipal) {
      formData.direcciones?.forEach(d => d.esPrincipal = false);
    }
    
    setFormData(prev => ({
      ...prev,
      direcciones: [...(prev.direcciones || []), nuevaDireccion],
    }));
    
    // Reset form
    setDireccionForm({
      tipoDireccion: 'Particular',
      direccion: '',
      numero: '',
      departamento: '',
      region: '',
      comuna: '',
      codigoPostal: '',
      pais: 'Chile',
      esPrincipal: false,
    });
    setShowDireccionForm(false);
  };
  
  const handleEliminarDireccion = (dirId: string) => {
    setFormData(prev => ({
      ...prev,
      direcciones: prev.direcciones?.filter(d => d.id !== dirId) || [],
    }));
  };

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
      <div className="min-h-full space-y-6 animate-fade-in">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 -mx-6 -mt-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(ERoutePaths.INVOLUCRADOS)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Icon name="ArrowLeft" size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-aduana-azul">
                {isEditing ? 'Editar Involucrado' : 'Nuevo Involucrado'}
              </h1>
              <p className="text-gray-500">
                {isEditing ? 'Modifique los datos del involucrado' : 'Complete los datos del involucrado'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Tipo de Persona */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Icon name="Users" size={20} className="text-aduana-azul" />
              Tipo de Persona
            </h2>
            <div className="flex gap-4">
              {tiposPersona.map(tipo => (
                <button
                  key={tipo.value}
                  onClick={() => handleChange('tipoPersona', tipo.value)}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                    formData.tipoPersona === tipo.value 
                      ? 'border-aduana-azul bg-aduana-azul-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon 
                    name={tipo.value === 'Natural' ? 'User' : 'Building'} 
                    size={24} 
                    className={formData.tipoPersona === tipo.value ? 'text-aduana-azul' : 'text-gray-400'} 
                  />
                  <div className="text-left">
                    <p className={`font-medium ${formData.tipoPersona === tipo.value ? 'text-aduana-azul' : 'text-gray-700'}`}>
                      {tipo.label}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Identificación */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Icon name="CreditCard" size={20} className="text-aduana-azul" />
              Identificación
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo Identificación *
                </label>
                <select
                  value={formData.tipoIdentificacion || 'RUT'}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChange('tipoIdentificacion', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                >
                  {tiposIdentificacion.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  N° Identificación *
                </label>
                <input
                  type="text"
                  value={formData.numeroIdentificacion || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('numeroIdentificacion', e.target.value)}
                  placeholder={formData.tipoIdentificacion === 'RUT' ? '12.345.678' : 'Número'}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent ${errors.numeroIdentificacion ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.numeroIdentificacion && <p className="text-sm text-red-500 mt-1">{errors.numeroIdentificacion}</p>}
              </div>
              {formData.tipoIdentificacion === 'RUT' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DV
                  </label>
                  <input
                    type="text"
                    value={formData.digitoVerificador || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('digitoVerificador', e.target.value.toUpperCase())}
                    placeholder="9"
                    maxLength={1}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Datos según tipo de persona */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Icon name={formData.tipoPersona === 'Jurídica' ? 'Building' : 'User'} size={20} className="text-aduana-azul" />
              {formData.tipoPersona === 'Jurídica' ? 'Datos de la Empresa' : 'Datos Personales'}
            </h2>
            
            {formData.tipoPersona === 'Natural' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                  <input
                    type="text"
                    value={formData.nombre || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('nombre', e.target.value)}
                    placeholder="Juan"
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.nombre && <p className="text-sm text-red-500 mt-1">{errors.nombre}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Apellido Paterno *</label>
                  <input
                    type="text"
                    value={formData.apellidoPaterno || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('apellidoPaterno', e.target.value)}
                    placeholder="Pérez"
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent ${errors.apellidoPaterno ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.apellidoPaterno && <p className="text-sm text-red-500 mt-1">{errors.apellidoPaterno}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Apellido Materno</label>
                  <input
                    type="text"
                    value={formData.apellidoMaterno || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('apellidoMaterno', e.target.value)}
                    placeholder="González"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nacionalidad</label>
                  <input
                    type="text"
                    value={formData.nacionalidad || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('nacionalidad', e.target.value)}
                    placeholder="Chile"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Razón Social *</label>
                  <input
                    type="text"
                    value={formData.razonSocial || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('razonSocial', e.target.value)}
                    placeholder="Empresa S.A."
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent ${errors.razonSocial ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.razonSocial && <p className="text-sm text-red-500 mt-1">{errors.razonSocial}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giro</label>
                  <input
                    type="text"
                    value={formData.giro || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('giro', e.target.value)}
                    placeholder="Comercio exterior"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nacionalidad</label>
                  <input
                    type="text"
                    value={formData.nacionalidad || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('nacionalidad', e.target.value)}
                    placeholder="Chile"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Representante Legal</label>
                  <input
                    type="text"
                    value={formData.representanteLegalNombre || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('representanteLegalNombre', e.target.value)}
                    placeholder="Nombre del representante"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">RUT Representante</label>
                  <input
                    type="text"
                    value={formData.representanteLegalRut || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('representanteLegalRut', e.target.value)}
                    placeholder="12.345.678-9"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Datos de Contacto */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Icon name="Mail" size={20} className="text-aduana-azul" />
              Datos de Contacto
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('email', e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Correo Secundario</label>
                <input
                  type="email"
                  value={formData.emailSecundario || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('emailSecundario', e.target.value)}
                  placeholder="otro@ejemplo.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={formData.telefono || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('telefono', e.target.value)}
                  placeholder="+56 9 1234 5678"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono Secundario</label>
                <input
                  type="tel"
                  value={formData.telefonoSecundario || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('telefonoSecundario', e.target.value)}
                  placeholder="+56 2 2234 5678"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                />
              </div>
            </div>
          </div>
          
          {/* Direcciones */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Icon name="MapPin" size={20} className="text-aduana-azul" />
                Direcciones
              </h2>
              <button
                type="button"
                onClick={() => setShowDireccionForm(!showDireccionForm)}
                className="text-aduana-azul hover:text-aduana-azul-dark flex items-center gap-1 text-sm"
              >
                <Icon name={showDireccionForm ? 'Minus' : 'Plus'} size={16} />
                {showDireccionForm ? 'Cancelar' : 'Agregar Dirección'}
              </button>
            </div>
            
            {/* Form para agregar dirección */}
            {showDireccionForm && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo Dirección</label>
                    <select
                      value={direccionForm.tipoDireccion || 'Particular'}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => handleDireccionChange('tipoDireccion', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                    >
                      {tiposDireccion.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dirección *</label>
                    <input
                      type="text"
                      value={direccionForm.direccion || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleDireccionChange('direccion', e.target.value)}
                      placeholder="Av. Ejemplo 123"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Región *</label>
                    <select
                      value={direccionForm.region || ''}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => handleDireccionChange('region', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                    >
                      <option value="">Seleccione...</option>
                      {regiones.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Comuna *</label>
                    <input
                      type="text"
                      value={direccionForm.comuna || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleDireccionChange('comuna', e.target.value)}
                      placeholder="Providencia"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-aduana-azul focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-end gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={direccionForm.esPrincipal || false}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleDireccionChange('esPrincipal', e.target.checked)}
                        className="w-4 h-4 text-aduana-azul focus:ring-aduana-azul border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Dirección Principal</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAgregarDireccion}
                      className="px-4 py-2 bg-aduana-azul text-white rounded-lg hover:bg-aduana-azul-dark text-sm"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Lista de direcciones */}
            {formData.direcciones && formData.direcciones.length > 0 ? (
              <div className="space-y-3">
                {formData.direcciones.map((dir, index) => (
                  <div 
                    key={dir.id || index} 
                    className={`flex items-center justify-between p-4 rounded-lg border ${dir.esPrincipal ? 'border-aduana-azul bg-aduana-azul-50' : 'border-gray-200'}`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={dir.esPrincipal ? 'info' : 'default'}>{dir.tipoDireccion}</Badge>
                        {dir.esPrincipal && <span className="text-xs text-aduana-azul">Principal</span>}
                      </div>
                      <p className="font-medium">{dir.direccion}</p>
                      <p className="text-sm text-gray-500">{dir.comuna}, {dir.region}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleEliminarDireccion(dir.id)}
                      className="p-2 text-gray-400 hover:text-red-500"
                    >
                      <Icon name="Trash2" size={18} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No hay direcciones registradas.</p>
            )}
          </div>
          
          {/* Observaciones */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Icon name="MessageSquare" size={20} className="text-aduana-azul" />
              Observaciones
            </h2>
            <textarea
              value={formData.observaciones || ''}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleChange('observaciones', e.target.value)}
              placeholder="Notas internas sobre el involucrado..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-aduana-azul focus:border-transparent resize-none"
              rows={3}
            />
          </div>
          
          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pb-6">
            <button
              onClick={() => navigate(ERoutePaths.INVOLUCRADOS)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-6 py-2 bg-aduana-azul text-white rounded-lg hover:bg-aduana-azul-dark disabled:opacity-50 flex items-center gap-2"
            >
              <Icon name={isSaving ? 'Loader' : 'Check'} size={18} className={isSaving ? 'animate-spin' : ''} />
              {isEditing ? 'Guardar Cambios' : 'Crear Involucrado'}
            </button>
          </div>
        </div>
      </div>
    </CustomLayout>
  );
};

export default InvolucradoForm;

