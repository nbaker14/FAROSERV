// FAROSERV site content — Spanish
// Product palette tuned per vertical, but all share the Pulse brand.

const BRAND = {
  ink: '#0B0D12',
  paper: '#F6F3EC',
  panel: '#12151C',
  panelWarm: '#1A1E27',
  line: 'rgba(246, 243, 236, 0.1)',
  lineStrong: 'rgba(246, 243, 236, 0.22)',
  amber: '#F2C475',
  amberDeep: '#E5A13A',
  indigo: '#1E3A8A',
  text: '#EFEAE0',
  textDim: 'rgba(239, 234, 224, 0.62)',
  textFaint: 'rgba(239, 234, 224, 0.38)',
};

const PRODUCTS = [
  {
    id: 'statusec',
    name: 'STATUS EC',
    tagline: 'Compliance laboral · Ecuador',
    url: 'www.statusec.com',
    category: 'Plataforma pública',
    badge: 'Live',
    description: 'Plataforma de monitoreo de riesgo laboral. Escaneo mensual automatizado de empleados en 12 fuentes oficiales del Estado, detección de cambios, alertas y cumplimiento LOPDP integrado.',
    industry: 'RRHH · Compliance',
    color: '#3BB0B8',
    screenshot: 'site/statusec-screenshot.png',
  },
  {
    id: 'camaron',
    name: 'CAMARON.PRO',
    tagline: 'Inteligencia para camaroneras',
    url: 'www.camaron.pro',
    category: 'Plataforma pública',
    badge: 'Live',
    description: 'Software para productores de camarón: manejo de costos, proyección de crecimiento y cosecha, e inteligencia artificial que aprende del comportamiento de cada piscina para maximizar la utilidad.',
    industry: 'Acuacultura',
    color: '#E5A13A',
    screenshot: 'site/camaron-screenshot.png',
  },
  {
    id: 'eljuri-lines',
    name: 'LÍNEAS',
    tagline: 'Almacenes Juan Eljuri',
    url: 'Solución privada',
    category: 'A medida',
    badge: 'Privado',
    description: 'Trazabilidad de mantenimiento de líneas de cerveza. Registra cada limpieza, calcula el próximo ciclo y alerta a los técnicos en campo.',
    industry: 'Dispensadores de cerveza',
    color: '#C8924A',
    mockup: 'LineasDashboard',
  },
  {
    id: 'salud',
    name: 'SALUD OCUPACIONAL',
    tagline: 'Solución privada',
    url: 'Cliente corporativo',
    category: 'A medida',
    badge: 'Privado',
    description: 'Control de salud ocupacional de empleados: exámenes, vencimientos, historial médico y cumplimiento normativo.',
    industry: 'RRHH / Salud',
    color: '#8BA67C',
    mockup: 'SaludDashboard',
  },
];

const PROCESS = [
  {
    step: '01',
    title: 'Escuchamos',
    body: 'Entendemos el problema real y el contexto operativo antes de escribir una línea de código. Sin briefs infinitos.',
  },
  {
    step: '02',
    title: 'Construimos juntos',
    body: 'Trabajamos al lado del equipo del cliente. Iteramos en ciclos cortos y visibles, ajustando a medida que el producto se adopta.',
  },
  {
    step: '03',
    title: 'Operamos mensualmente',
    body: 'Un plan mensual cubre desarrollo, diseño, infraestructura y soporte. Escalable según la etapa del producto.',
  },
  {
    step: '04',
    title: 'Evolucionamos',
    body: 'El software vive. Seguimos mejorándolo con el uso real, sin volver a cotizar cada cambio.',
  },
];

Object.assign(window, { BRAND, PRODUCTS, PROCESS });
