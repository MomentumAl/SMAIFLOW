import { FormStep, UserData, Sport, PlanInfo } from './types';

export const RUNNING_DISTANCES: string[] = [
    '100m (Pista)',
    '200m (Pista)',
    '400m (Pista)',
    '800m (Pista)',
    '1500m/Milla (Pista)',
    '5k',
    '10k',
    'Medio Maratón',
    'Maratón',
    'Carrera de Montaña (Trail)',
    'Ultramaratón (50k+)',
    'Ultramaratón (100k+)',
    'Ultramaratón (250k+)',
    'Medio Maratón (Triatlón 70.3)',
    'Maratón (Triatlón Ironman)',
];

export const SWIMMING_DISTANCES: string[] = [
    '50m Libre',
    '100m Libre',
    '200m Libre',
    '400m Libre',
    '800m Libre',
    '1500m Libre',
    '100m Espalda',
    '200m Espalda',
    '100m Pecho',
    '200m Pecho',
    '100m Mariposa',
    '200m Mariposa',
    '200m Combinado Individual',
    '400m Combinado Individual',
    '1.9k (Triatlón 70.3)',
    '3.8k (Triatlón Ironman)',
    '5k Aguas Abiertas',
    '10k Aguas Abiertas',
];

export const CYCLING_DISTANCES: string[] = [
    'Contrarreloj Individual (20-40k)',
    'Criterium (45-90 min)',
    'Carrera en Ruta (80-120k)',
    'Gran Fondo (120k+)',
    'Etapa de Montaña',
    '90k (Triatlón 70.3)',
    '180k (Triatlón Ironman)',
];

export const EXPERIENCE_LEVELS: { id: 'principiante' | 'intermedio' | 'avanzado'; label: string }[] = [
    { id: 'principiante', label: 'Principiante' },
    { id: 'intermedio', label: 'Intermedio' },
    { id: 'avanzado', label: 'Avanzado' },
];

export const FORM_STEPS: FormStep[] = [
    { id: 'profile', title: 'Perfil Básico', emoji: '📝' },
    { id: 'experience', title: 'Experiencia y Objetivos', emoji: '🎯' },
    { id: 'fitness', title: 'Condición y Disponibilidad', emoji: '🗓️' },
];

export const INITIAL_USER_DATA: UserData = {
    name: '',
    email: '',
    age: '',
    sex: '',
    weight: '',
    height: '',
    experience: '',
    goals: {},
    goalTimes: {},
    sportDistribution: {},
    raceDate: '',
    planStartDate: '',
    trainingDays: '',
    allowDoubleDays: false,
    selectedSports: [],
    allowMarketing: false,
};

export const SPORT_NAMES: Record<Sport, string> = {
    running: 'Running',
    natacion: 'Natación',
    ciclismo: 'Ciclismo',
};

export const PLANS: PlanInfo[] = [
    {
        id: 'free',
        name: 'Free',
        price: 0,
        priceSuffix: 'único',
        description: 'Ideal para probar la IA y preparar objetivos a corto plazo en un solo deporte.',
        benefits: [
            'Plan de hasta 29 días',
            '1 solo deporte',
            'Análisis de Flow Score diario',
            'Certificado (pago opcional al finalizar)',
        ],
    },
    {
        id: 'bronze',
        name: 'Bronce',
        price: 6000,
        priceSuffix: 'único',
        description: 'Perfecto para un objetivo específico de hasta un mes, con tu certificado incluido.',
        benefits: [
            'Plan de hasta 30 días',
            '1 solo deporte',
            'Análisis de Flow Score diario',
            'Certificado de finalización GRATIS',
        ],
    },
    {
        id: 'silver',
        name: 'Plata',
        price: 12000,
        priceSuffix: 'único',
        description: 'Para atletas multi-deporte que preparan un objetivo combinado a corto plazo.',
        benefits: [
            'Plan de hasta 30 días',
            'Hasta 2 deportes',
            'Entrenamientos combinados (Bricks)',
            'Certificado de finalización GRATIS',
        ],
    },
    {
        id: 'gold',
        name: 'Oro',
        price: 18000,
        priceSuffix: 'único',
        description: 'La opción definitiva para triatletas y deportistas que no se ponen límites.',
        benefits: [
            'Plan de hasta 30 días',
            'Hasta 3 deportes',
            'Optimización para triatlón',
            'Certificado de finalización GRATIS',
        ],
    },
    {
        id: 'premium',
        name: 'Premium',
        price: 19900,
        priceSuffix: '/ mes',
        description: 'La experiencia completa. Entrena sin límites, con planes a largo plazo y reajustes ilimitados.',
        benefits: [
            'Planes de hasta 1 año',
            'Deportes ilimitados',
            'Reajustes de plan ILIMITADOS',
            'Acceso a nuevas funciones',
            'Soporte prioritario',
            'Todos los certificados GRATIS',
        ],
        highlight: true,
    }
];


export const GOLDEN_TIPS: Record<Sport, string[]> = {
  running: [
    "Mantén una cadencia cercana a 180 pasos por minuto para mejorar tu eficiencia y reducir el impacto.",
    "Para velocistas, la fase de aceleración es crucial. Enfócate en empujes potentes y una inclinación hacia adelante.",
    "En subidas de trail, acorta la zancada y usa los brazos. En bajadas, mantén el torso erguido y la mirada al frente.",
    "El 80% de tus carreras deben ser a un ritmo suave y conversacional para construir una base aeróbica sólida.",
    "No subestimes el poder del calentamiento dinámico: zancadas, balanceos de piernas y movilidad articular preparan tu cuerpo.",
    "La hidratación empieza el día antes de una carrera larga. Bebe pequeños sorbos de agua durante todo el día.",
    "Alterna tus zapatillas de correr para reducir el riesgo de lesiones y prolongar su vida útil.",
    "Después de series intensas, un trote de enfriamiento de 10-15 minutos ayuda a eliminar el lactato y acelera la recuperación.",
    "Practica la 'respiración abdominal' mientras corres para maximizar tu capacidad pulmonar y mantener la calma.",
    "La fuerza del core (abdominales, lumbares, glúteos) es tu pilar como corredor. Dedícale al menos dos sesiones cortas a la semana.",
  ],
  natacion: [
    "Enfócate en la técnica del 'codo alto' (high elbow) bajo el agua para maximizar tu propulsión en cada brazada.",
    "La respiración bilateral (a ambos lados) no solo equilibra tu brazada, sino que también mejora tu orientación en aguas abiertas.",
    "Utiliza tus caderas para rotar. La potencia de tu brazada nace en el core, no solo en los hombros.",
    "Mantén la cabeza alineada con la columna vertebral, mirando hacia el fondo de la piscina para una posición más hidrodinámica.",
    "Usa un pull-buoy para aislar el tren superior y concentrarte en la calidad de tu brazada y la rotación del tronco.",
    "Una patada eficiente no es necesariamente una patada fuerte, sino una que estabiliza el cuerpo sin gastar demasiada energía.",
    "Exhala continuamente bajo el agua. Esto hace que la inhalación sea un reflejo rápido y sin esfuerzo.",
    "Practica los virajes en cada entrenamiento. Un buen viraje puede ahorrarte valiosos segundos en competición.",
    "En aguas abiertas, levanta la vista brevemente cada 6-10 brazadas para mantener el rumbo sin romper tu ritmo.",
    "No olvides la flexibilidad del tobillo. Unos tobillos flexibles actúan como aletas, dándote más propulsión.",
  ],
  ciclismo: [
    "Conocer tu Umbral de Potencia Funcional (FTP) es clave para entrenar en las zonas de intensidad correctas.",
    "La nutrición sobre la bicicleta es fundamental. Practica tu estrategia de alimentación en los entrenamientos largos.",
    "Un 'bike fit' profesional puede aumentar tu comodidad, potencia y prevenir lesiones a largo plazo.",
    "Mantén una cadencia de pedaleo alta (85-95 rpm en llano) para reducir la fatiga muscular y mejorar la eficiencia.",
    "En las subidas, mantente sentado el mayor tiempo posible para conservar energía. Levántate del sillín para cambiar el ritmo o superar rampas duras.",
    "Aprende a limpiar y lubricar tu cadena regularmente. Una transmisión limpia es más eficiente y dura más.",
    "En descensos, posiciona los pedales horizontalmente (a las 3 y 9 en punto) y baja tu centro de gravedad para mayor estabilidad.",
    "Practica rodar en grupo (si es seguro) para aprender a 'drafting' y ahorrar hasta un 30% de energía.",
    "El entrenamiento 'Sweet Spot' (88-94% de tu FTP) es una de las formas más eficientes de mejorar tu resistencia aeróbica.",
    "No te olvides de la comida post-entrenamiento. Consume una mezcla de carbohidratos y proteínas en los 30-60 minutos posteriores a un esfuerzo intenso.",
  ],
};