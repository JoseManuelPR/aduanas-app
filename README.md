# Aduana App 2

Aplicación React + TypeScript + Vite para el sistema de denuncias de aduana.

## 🚀 Cómo ejecutar el proyecto

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn

### Instalación y ejecución

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```
   Esto iniciará el servidor de desarrollo en `http://localhost:5173`

### Otros comandos disponibles

- **Construir para producción:**
  ```bash
  npm run build
  ```

- **Vista previa del build:**
  ```bash
  npm run preview
  ```

- **Ejecutar linter:**
  ```bash
  npm run lint
  ```

## 🏗️ Arquitectura y Estructura

### Tecnologías Utilizadas

- **Frontend Framework**: React 18.2.0 con TypeScript
- **Build Tool**: Vite 5.2.0 (desarrollo rápido con HMR)
- **Routing**: React Router DOM 7.9.6
- **Styling**: Tailwind CSS 3.4.18 con PostCSS y Autoprefixer
- **UI Components**: Biblioteca personalizada de componentes (he-button-custom-library)
- **Linting**: ESLint con configuración TypeScript
- **Package Manager**: npm

### Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── UI/             # Componentes base (Badge, Modal, Table, etc.)
│   ├── Button/         # Botón personalizado
│   ├── Chatbot/        # Asistente virtual
│   └── ...             # Otros componentes específicos
├── pages/              # Páginas principales de la aplicación
│   ├── Dashboard/      # Panel principal
│   ├── Denuncias/      # Módulo de denuncias
│   ├── Cargos/         # Módulo de cargos
│   ├── Giros/          # Módulo de giros
│   ├── Reclamos/       # Módulo de reclamos
│   └── ...             # Otros módulos
├── data/               # Datos mockeados y lógica de negocio
├── routes/             # Definición de rutas
├── Layout/             # Layout principal
├── organisms/          # Componentes complejos (Sidebar, Footer)
├── containers/         # Contenedores de lógica (Login)
├── constants/          # Constantes de la aplicación
└── utils/              # Utilidades y helpers
```

### Datos Mockeados

Los datos de prueba se encuentran en `src/data/` y incluyen:

- **Denuncias**: Casos de infracciones aduaneras con estados, fechas y detalles
- **Cargos**: Sanciones económicas asociadas a denuncias
- **Giros**: Órdenes de pago y cobro
- **Reclamos**: Procesos de reclamación contra resoluciones
- **Involucrados**: Personas físicas/jurídicas relacionadas con los casos
- **Hallazgos**: Detecciones de irregularidades (integración con sistema PFI)
- **Mercancías**: Bienes bajo custodia aduanera
- **Documentos Aduaneros**: Declaraciones, facturas y documentos oficiales
- **Catálogos**: Listas de aduanas, artículos, normas, etc.
- **KPIs**: Métricas y estadísticas del dashboard
- **Notificaciones**: Sistema de alertas y mensajes
- **Audiencias**: Procesos judiciales y actas

### Rutas Principales

#### Módulos Principales
- `/dashboard` - Panel de control con KPIs y estadísticas
- `/denuncias` - Gestión de denuncias (listado, creación, detalle)
- `/cargos` - Administración de cargos y sanciones
- `/giros` - Gestión de órdenes de pago
- `/reclamos` - Procesamiento de reclamos administrativos

#### Módulos de Consulta
- `/hallazgos` - Hallazgos del sistema PFI
- `/mercancias` - Consulta de mercancías
- `/documentos-aduaneros` - Visualización de documentos
- `/expediente/:id` - Expediente digital unificado

#### Gestión y Configuración
- `/involucrados` - Administración de personas/entidades
- `/audiencias` - Gestión de audiencias judiciales
- `/reportes` - Reportes y estadísticas
- `/configuracion` - Configuración del sistema

### Características Principales

- **Interfaz Responsiva**: Diseño adaptativo con Tailwind CSS
- **Componentes Reutilizables**: Biblioteca de UI consistente
- **Estado Mockeado**: Datos de prueba completos para desarrollo
- **Navegación Intuitiva**: Sidebar con menú organizado por módulos
- **Sistema de Notificaciones**: Alertas en tiempo real
- **Expedientes Digitales**: Gestión unificada de documentos
- **Integración PFI**: Conexión con sistema de hallazgos externos
