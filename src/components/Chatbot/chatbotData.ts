/**
 * Datos mock y catálogos para el Chatbot Asistente
 * Sistema DECARE - Servicio Nacional de Aduanas de Chile
 */

import type { NormativeCatalogEntry, QuickAction } from './types';

// ============================================
// CATÁLOGO NORMATIVO MOCK
// ============================================

export const normativeCatalog: NormativeCatalogEntry[] = [
  {
    id: 'norm-001',
    codigoNorma: 'LGA',
    nombreNorma: 'Ley General de Aduanas',
    articulo: 'Art. 168',
    descripcionBreve: 'Contrabando - Introducción o extracción clandestina de mercancías',
    tipoInfraccion: ['contrabando', 'clandestino', 'oculto', 'no declarado'],
    keywords: ['contrabando', 'mercancía oculta', 'doble fondo', 'clandestino', 'introducción ilegal', 'extracción ilegal', 'sin declarar', 'escondida'],
    sancionTipica: 'Multa de 100% a 300% del valor de las mercancías, más comiso',
    comentarioOperativo: 'Aplica cuando existe intención dolosa de evadir el control aduanero.',
  },
  {
    id: 'norm-002',
    codigoNorma: 'LGA',
    nombreNorma: 'Ley General de Aduanas',
    articulo: 'Art. 174',
    descripcionBreve: 'Declaración inexacta u omisión de mercancías',
    tipoInfraccion: ['declaración falsa', 'omisión', 'diferencia cantidad', 'sin declarar'],
    keywords: ['declaración falsa', 'omisión', 'no declarado', 'diferencia', 'cantidad incorrecta', 'mercancía no declarada', 'declaración inexacta', 'faltante'],
    sancionTipica: 'Multa equivalente al 50% del valor de la mercancía no declarada',
    comentarioOperativo: 'Es la infracción más común. Requiere verificar si hay intención o negligencia.',
  },
  {
    id: 'norm-003',
    codigoNorma: 'LGA',
    nombreNorma: 'Ley General de Aduanas',
    articulo: 'Art. 175',
    descripcionBreve: 'Documentación aduanera incompleta o no válida',
    tipoInfraccion: ['documentación incompleta', 'sin documentos', 'documentos faltantes'],
    keywords: ['sin documentos', 'documentación incompleta', 'falta documento', 'sin BL', 'sin factura', 'documentos inválidos', 'sin certificado'],
    sancionTipica: 'Multa de 0.5 a 5 UTM, retención de mercancía hasta regularización',
    comentarioOperativo: 'Permite regularización mediante presentación posterior de documentos.',
  },
  {
    id: 'norm-004',
    codigoNorma: 'LGA',
    nombreNorma: 'Ley General de Aduanas',
    articulo: 'Art. 176',
    descripcionBreve: 'Clasificación arancelaria incorrecta',
    tipoInfraccion: ['clasificación incorrecta', 'partida errónea', 'arancel incorrecto'],
    keywords: ['clasificación', 'partida arancelaria', 'arancel incorrecto', 'código erróneo', 'clasificación errónea', 'subpartida', 'menor arancel'],
    sancionTipica: 'Multa de 25% al 100% de los derechos eludidos',
    comentarioOperativo: 'Verificar si el error benefició al importador reduciendo el pago de derechos.',
  },
  {
    id: 'norm-005',
    codigoNorma: 'LGA',
    nombreNorma: 'Ley General de Aduanas',
    articulo: 'Art. 177',
    descripcionBreve: 'Declaración de valor aduanero inferior al real (subfacturación)',
    tipoInfraccion: ['valor incorrecto', 'subfacturación', 'valor inferior'],
    keywords: ['subfacturación', 'valor incorrecto', 'valor inferior', 'factura falsa', 'precio menor', 'valor declarado', 'FOB incorrecto', 'CIF menor'],
    sancionTipica: 'Multa de 50% al 200% de los derechos eludidos',
    comentarioOperativo: 'Requiere análisis comparativo con precios de referencia y mercado.',
  },
  {
    id: 'norm-006',
    codigoNorma: 'LGA',
    nombreNorma: 'Ley General de Aduanas',
    articulo: 'Art. 178, inciso b)',
    descripcionBreve: 'Fraude aduanero mediante cualquier acto u omisión dolosa',
    tipoInfraccion: ['fraude', 'evasión', 'engaño', 'dolo'],
    keywords: ['fraude', 'evasión', 'engaño', 'dolo', 'sistemático', 'reiterado', 'perjuicio fiscal', 'maniobra fraudulenta'],
    sancionTipica: 'Multa de 100% a 500% de los derechos eludidos, más sanciones penales',
    comentarioOperativo: 'Requiere demostrar intención dolosa. Puede derivar a causa penal.',
  },
  {
    id: 'norm-007',
    codigoNorma: 'LGA',
    nombreNorma: 'Ley General de Aduanas',
    articulo: 'Art. 169',
    descripcionBreve: 'Falsificación de documentos aduaneros o certificados',
    tipoInfraccion: ['falsificación', 'documento falso', 'certificado falso'],
    keywords: ['falsificación', 'documento falso', 'certificado falso', 'origen falso', 'sello falso', 'firma falsa', 'adulterado'],
    sancionTipica: 'Multa de 50% al 300% del valor, más acciones penales',
    comentarioOperativo: 'Siempre requiere derivación a Fiscalía por componente penal.',
  },
  {
    id: 'norm-008',
    codigoNorma: 'OA',
    nombreNorma: 'Ordenanza de Aduanas',
    articulo: 'Art. 182',
    descripcionBreve: 'Exceso de plazo de almacenaje o permanencia',
    tipoInfraccion: ['plazo vencido', 'almacenaje excedido', 'permanencia'],
    keywords: ['plazo vencido', 'almacenaje', 'permanencia excedida', 'tiempo límite', 'abandono', 'mercancía retenida', 'depósito'],
    sancionTipica: 'Multa progresiva según días de exceso, posible abandono legal',
    comentarioOperativo: 'Verificar si existe justificación para el atraso antes de sancionar.',
  },
  {
    id: 'norm-009',
    codigoNorma: 'CP',
    nombreNorma: 'Código Penal',
    articulo: 'Art. 193',
    descripcionBreve: 'Falsificación de documento público',
    tipoInfraccion: ['falsificación penal', 'documento público falso'],
    keywords: ['falsificación penal', 'documento público', 'certificado falso', 'sello oficial', 'firma falsificada'],
    sancionTipica: 'Pena privativa de libertad de 3 a 5 años',
    comentarioOperativo: 'Competencia del Ministerio Público. Derivar inmediatamente.',
  },
  {
    id: 'norm-010',
    codigoNorma: 'DL825',
    nombreNorma: 'Decreto Ley 825 - IVA',
    articulo: 'Art. 97 N°4',
    descripcionBreve: 'Evasión tributaria mediante declaraciones falsas',
    tipoInfraccion: ['evasión tributaria', 'impuesto evadido', 'IVA'],
    keywords: ['evasión', 'impuesto', 'tributario', 'IVA', 'fiscal', 'fisco', 'recaudación'],
    sancionTipica: 'Multa de 50% al 300% del impuesto eludido, más intereses',
    comentarioOperativo: 'Coordinar con SII si el monto es significativo.',
  },
];

// ============================================
// QUICK ACTIONS PREDEFINIDAS
// ============================================

export const welcomeQuickActions: QuickAction[] = [
  {
    id: 'qa-trace',
    label: 'Consultar estado de una denuncia',
    action: 'trace_denuncia',
    icon: 'Search',
    variant: 'primary',
  },
  {
    id: 'qa-legal',
    label: 'Sugerencia de artículo por infracción',
    action: 'legal_suggestion',
    icon: 'Scale',
    variant: 'secondary',
  },
  {
    id: 'qa-stats',
    label: 'Cantidad de denuncias este mes',
    action: 'stats_month',
    icon: 'BarChart2',
    variant: 'secondary',
  },
];

export const traceabilityQuickActions: QuickAction[] = [
  {
    id: 'qa-detail',
    label: 'Ver detalle de denuncia',
    action: 'view_detail',
    icon: 'FileText',
    variant: 'primary',
  },
  {
    id: 'qa-bi',
    label: 'Ver en Dashboard BI',
    action: 'navigate_bi',
    icon: 'BarChart2',
    variant: 'secondary',
  },
];

export const legalQuickActions: QuickAction[] = [
  {
    id: 'qa-view-norm',
    label: 'Ver detalle de la norma',
    action: 'view_norm',
    icon: 'Book',
    variant: 'primary',
  },
  {
    id: 'qa-use-article',
    label: 'Usar este artículo en denuncia',
    action: 'use_article',
    icon: 'CheckCircle',
    variant: 'secondary',
  },
];

export const statisticsQuickActions: QuickAction[] = [
  {
    id: 'qa-bi-detail',
    label: 'Ver detalle en Dashboard BI',
    action: 'navigate_bi',
    icon: 'BarChart2',
    variant: 'primary',
  },
  {
    id: 'qa-open-only',
    label: 'Ver solo denuncias abiertas',
    action: 'filter_open',
    icon: 'Filter',
    variant: 'secondary',
  },
  {
    id: 'qa-change-dates',
    label: 'Cambiar rango de fechas',
    action: 'change_dates',
    icon: 'Calendar',
    variant: 'ghost',
  },
];

export const dateRangeQuickActions: QuickAction[] = [
  {
    id: 'qa-this-month',
    label: 'Este mes',
    action: 'range_this_month',
    variant: 'secondary',
  },
  {
    id: 'qa-this-year',
    label: 'Este año',
    action: 'range_this_year',
    variant: 'secondary',
  },
  {
    id: 'qa-custom',
    label: 'Personalizado',
    action: 'range_custom',
    variant: 'ghost',
  },
];

export const notFoundQuickActions: QuickAction[] = [
  {
    id: 'qa-month-list',
    label: 'Ver denuncias de este mes en BI',
    action: 'navigate_bi_month',
    icon: 'BarChart2',
    variant: 'primary',
  },
  {
    id: 'qa-menu',
    label: 'Volver al menú principal',
    action: 'main_menu',
    icon: 'Home',
    variant: 'secondary',
  },
];

// ============================================
// MENSAJES PREDEFINIDOS
// ============================================

export const chatbotMessages = {
  welcome: `¡Hola! Soy el **Asistente de Denuncias** del Sistema DECARE. 

Puedo ayudarte a:
• 📋 Ver el estado y trazabilidad de una denuncia
• ⚖️ Sugerir artículos/infracciones según tu descripción
• 📊 Contar denuncias en un rango de fechas

_Recuerda: esta es una simulación con datos mockeados._`,

  contextDenuncia: (numero: string) => 
    `Veo que estás revisando la denuncia **${numero}**. ¿Te gustaría conocer su estado actualizado o ver la trazabilidad completa?`,
  
  contextBI: 
    'Estás en el módulo de BI. Puedo explicarte el resumen de denuncias de este mes o ayudarte a filtrar por tipo de infracción.',

  notFound: (id: string) =>
    `No encontré la denuncia **${id}** en el sistema (demo). 

¿Quieres revisar el rango de denuncias registradas este mes?`,

  noData: (id: string) =>
    `La denuncia **${id}** está registrada, pero aún no tiene hallazgos ni reclamos asociados.`,

  legalRecognition: (description: string) =>
    `Según la descripción de la infracción que indicaste: _"${description.substring(0, 100)}${description.length > 100 ? '...' : ''}"_`,

  help: `Puedo ayudarte con:

**📋 Trazabilidad**
Pregunta por el estado de una denuncia, hallazgo, giro o reclamo.
_Ejemplo: "Estado de la denuncia 993519"_

**⚖️ Sugerencia Normativa**
Describe una infracción y te sugeriré el artículo aplicable.
_Ejemplo: "Mercancía sin declarar en la carga"_

**📊 Estadísticas**
Consulta cantidades por período.
_Ejemplo: "¿Cuántas denuncias hay este mes?"_`,

  unknown: 
    'No estoy seguro de cómo ayudarte con eso. ¿Podrías reformular tu pregunta? Puedo ayudarte con trazabilidad de denuncias, sugerencias de artículos o estadísticas.',

  typing: 'Procesando...',
};

// ============================================
// KEYWORDS PARA DETECCIÓN DE INTENTS
// ============================================

export const intentKeywords = {
  traceability_denuncia: [
    'denuncia', 'estado denuncia', 'consultar denuncia', 'ver denuncia',
    'trazabilidad denuncia', 'información denuncia', 'detalle denuncia',
  ],
  traceability_hallazgo: [
    'hallazgo', 'pfi', 'estado hallazgo', 'consultar hallazgo',
  ],
  traceability_giro: [
    'giro', 'f09', 'f16', 'f17', 'estado giro', 'consultar giro',
  ],
  traceability_reclamo: [
    'reclamo', 'rec-', 'estado reclamo', 'consultar reclamo',
  ],
  traceability_mercancia: [
    'mercancía', 'mercancia', 'partidas', 'arancelaria', 'productos asociados',
  ],
  critical_actions: [
    'acciones críticas', 'acciones pendientes', 'tareas pendientes',
    'qué debo hacer', 'pendientes', 'urgente',
  ],
  legal_suggestion: [
    'qué artículo', 'qué norma', 'base legal', 'sugiere', 'infracción',
    'qué aplica', 'sanción', 'debería aplicar', 'mercancía sin declarar',
    'documentación falsa', 'falsificación', 'contrabando', 'subfacturación',
    'clasificación incorrecta', 'valor incorrecto', 'omisión',
  ],
  statistics_count: [
    'cuántas denuncias', 'cantidad de denuncias', 'número de denuncias',
    'total denuncias', 'denuncias registradas', 'denuncias hay',
    'cuantas denuncias',
  ],
  statistics_period: [
    'este mes', 'este año', 'hoy', 'ayer', 'esta semana',
    'entre', 'desde', 'hasta', 'período', 'rango',
  ],
  help: [
    'ayuda', 'help', 'qué puedes hacer', 'cómo funciona', 'opciones',
  ],
  greeting: [
    'hola', 'buenos días', 'buenas tardes', 'buenas noches', 'hi', 'hello',
  ],
};

// ============================================
// PATRONES DE NÚMEROS DE ENTIDADES
// ============================================

export const entityPatterns = {
  denuncia: /(?:denuncia\s*(?:n[úu]mero|nro|#|:)?\s*)(\d{5,7})/i,
  denunciaSimple: /\b(\d{6})\b/,
  hallazgo: /(?:hallazgo|pfi)[\s-]*(\d{2,4})/i,
  giro: /(f(?:09|16|17)-?\d{4}-?\d{6})/i,
  reclamo: /(rec-(?:rep|tta)-?\d{4}-?\d{4})/i,
};

// ============================================
// DATOS MOCK ADICIONALES PARA TRAZABILIDAD
// ============================================

export const mockTraceabilityExtras = {
  '993519': {
    hallazgos: [
      { numero: 'PFI-123', estado: 'Cerrado', descripcion: 'Hallazgo origen de la denuncia' },
    ],
    mercancias: [
      { partida: '8471.30.00', descripcion: 'Notebooks - 150 unidades' },
      { partida: '8471.41.00', descripcion: 'Tablets - 80 unidades' },
      { partida: '8517.12.00', descripcion: 'Teléfonos celulares - 50 unidades' },
    ],
    criticalActions: [
      { id: 'ca-1', description: 'Emitir informe técnico antes del 30/11/2025', deadline: '30-11-2025', priority: 'alta' as const },
      { id: 'ca-2', description: 'Coordinar inspección física complementaria', deadline: '05-12-2025', priority: 'media' as const },
    ],
    aiRecommendation: 'Te recomiendo priorizar el cierre del hallazgo PFI-123 antes del 30/11/2025 para evitar retrasos en el proceso sancionador.',
  },
  '993520': {
    hallazgos: [
      { numero: 'PFI-124', estado: 'Convertido a Denuncia', descripcion: 'Detección de contenedor con doble fondo' },
    ],
    mercancias: [
      { partida: '6204.62.00', descripcion: 'Pantalones de algodón - 2,500 unidades' },
      { partida: '6205.20.00', descripcion: 'Camisas de algodón - 1,800 unidades' },
    ],
    criticalActions: [
      { id: 'ca-3', description: 'Derivar a Fiscalía por componente penal', deadline: '28-11-2025', priority: 'alta' as const },
    ],
    aiRecommendation: 'Esta denuncia tiene carácter penal. Se recomienda coordinación urgente con el Ministerio Público.',
  },
  '993524': {
    hallazgos: [],
    cargos: [{ numero: 'CAR-2024-005682', estado: 'Emitido' }],
    giros: [{ numero: 'F09-2024-001235', estado: 'Vencido' }],
    reclamos: [{ numero: 'REC-TTA-2024-0013', estado: 'Ingresado' }],
    mercancias: [
      { partida: '8418.10.00', descripcion: 'Refrigeradores - 200 unidades' },
      { partida: '8450.11.00', descripcion: 'Lavadoras - 150 unidades' },
    ],
    criticalActions: [
      { id: 'ca-4', description: 'Responder reclamo TTA antes de audiencia', deadline: '15-12-2025', priority: 'alta' as const },
      { id: 'ca-5', description: 'Gestionar cobro de giro vencido', deadline: '01-12-2025', priority: 'alta' as const },
    ],
    aiRecommendation: 'El giro F09-2024-001235 está vencido. Se recomienda iniciar proceso de cobro y evaluar la respuesta al reclamo TTA pendiente.',
  },
};

// ============================================
// HELPER: GENERAR ID ÚNICO
// ============================================

export const generateMessageId = (): string => {
  return `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

