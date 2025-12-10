import { type TipoIdentificacion } from '../data';

export const TIPOS_IDENTIFICACION_DTTA = [
  { value: 'RUT' as const, label: 'RUT' },
  { value: 'Pasaporte' as const, label: 'Pasaporte' },
  { value: 'Otro' as const, label: 'Otro' },
] satisfies { value: TipoIdentificacion; label: string }[];

export type TipoIdentificacionDTTA = (typeof TIPOS_IDENTIFICACION_DTTA)[number]['value'];

export const getPlaceholderPorTipoId = (tipo?: string) => {
  switch (tipo) {
    case 'RUT':
      return '12.345.678-9';
    case 'Pasaporte':
      return 'Número de pasaporte';
    case 'Otro':
      return 'Número de identificación';
    default:
      return 'Selecciona el tipo de ID';
  }
};
