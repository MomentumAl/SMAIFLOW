import { GoogleGenAI, Type } from "@google/genai";
import { UserData, TrainingPlanData, Sport, Workout, ReadjustmentFeedback, FlowScore } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const trainingPlanSchema = {
    type: Type.OBJECT,
    properties: {
        plan: {
            type: Type.ARRAY,
            description: "Array of weekly training plans.",
            items: {
                type: Type.OBJECT,
                properties: {
                    week: {
                        type: Type.NUMBER,
                        description: "The week number of the plan (e.g., 1, 2, 3...)."
                    },
                    focus: {
                        type: Type.STRING,
                        description: "The main focus for the week (e.g., 'Construcción de Base Aeróbica', 'Semana de Pico', 'Tapering')."
                    },
                    workouts: {
                        type: Type.ARRAY,
                        description: "An array of 7 daily workouts for the week, including rest days.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                id: {
                                    type: Type.STRING,
                                    description: "A unique identifier for the workout (e.g., a UUID)."
                                },
                                day: {
                                    type: Type.STRING,
                                    description: "The day of the week ('Lunes', 'Martes', etc.)."
                                },
                                date: {
                                    type: Type.STRING,
                                    description: "The specific calendar date of the workout in YYYY-MM-DD format (e.g., '2024-07-29')."
                                },
                                type: {
                                    type: Type.STRING,
                                    description: "The type of workout, prefixed with the sport. Examples: 'Running: Tirada Larga', 'Ciclismo: Rodillo', 'Natación: Técnica', 'Fuerza: Full Body', 'Descanso'."
                                },
                                description: {
                                    type: Type.STRING,
                                    description: "A concise, actionable description of the workout. Occasionally, can include a brief practical tip related to nutrition or recovery."
                                },
                                status: {
                                    type: Type.STRING,
                                    description: "The status of the workout ('pending', 'completed', 'skipped'). Default to 'pending'."
                                },
                                perceivedEffort: {
                                    type: Type.STRING,
                                    description: "Optional. The athlete's perceived effort for the workout ('facil', 'perfecto', 'dificil'). Only present if status is 'completed'."
                                },
                                notes: {
                                    type: Type.STRING,
                                    description: "Optional. Athlete's notes about the workout. Only present if status is 'completed'."
                                }
                            },
                            required: ["id", "day", "date", "type", "description", "status"]
                        }
                    }
                },
                required: ["week", "focus", "workouts"]
            }
        }
    },
    required: ["plan"]
};


const getSportSpecificPrompt = (sport: Sport): { coachPersona: string, specificity: string } => {
    switch(sport) {
        case 'natacion':
            return {
                coachPersona: `un entrenador de natación de élite`,
                specificity: `- **Natación:** Aplica una filosofía dual. Para principiantes/intermedios, prioriza la eficiencia, hidrodinámica y reducción de la resistencia (filosofía Total Immersion de Terry Laughlin). Para avanzados, integra trabajo de potencia y propulsión (principios de Ernest Maglischo). Incluye un alto volumen de drills técnicos para corregir la brazada y sugiere la respiración bilateral como estándar.`
            };
        case 'ciclismo':
             return {
                coachPersona: `un director deportivo de un equipo Pro Tour`,
                specificity: `- **Ciclismo:** Basado en el marco de Allen y Coggan. Todos los entrenamientos de intensidad DEBEN prescribirse como porcentajes del Umbral de Potencia Funcional (FTP) en Zonas de Potencia (Z1-Z7). Incorpora 'Sweet Spot', Intervalos de Umbral (ej. 2x20 min), y trabajo de VO2max. Menciona la importancia del bike fitting.`
            };
        case 'running':
        default:
             return {
                coachPersona: `un entrenador de running y atletismo de clase mundial, experto en todas las superficies (pista, asfalto y montaña)`,
                specificity: `- **Running (Asfalto/Fondo):** Basado en los principios de Daniels' Running Formula (VDOT) y Hanson's Marathon Method (fatiga acumulada). Prioriza una cadencia cercana a 180ppm. Los entrenamientos incluirán Ritmo Tempo (Umbral), Intervalos (VO2max), y Rodajes Fáciles para construir la base aeróbica (enfoque polarizado 80/20).\n- **Atletismo (Pista):** Para Sprints, énfasis en potencia explosiva y salidas. Para Media Distancia, foco en VO2máx y tolerancia al lactato. Incluye intervalos precisos en pista y pliometría.\n- **Trail/Montaña y Ultramaratón (CRÍTICO para objetivos como 100km):** El volumen es rey, pero de forma inteligente. Incorpora: 1) **Tiradas largas de fin de semana** que aumentan progresivamente hasta un máximo del 60-70% de la distancia de carrera. 2) **Bloques 'Back-to-Back'**: una tirada larga el sábado seguida de una media-larga el domingo para enseñar al cuerpo a correr con fatiga. 3) **Entrenamiento de desnivel** (cuestas). 4) **Simulaciones de carrera** con la nutrición y equipamiento que se usará en el evento. La descripción de los workouts debe incluir recordatorios sobre estrategia de nutrición e hidratación.`
            };
    }
};

export const generateTrainingPlan = async (userData: UserData, currentPlan: TrainingPlanData | null, readjustmentFeedback?: ReadjustmentFeedback): Promise<TrainingPlanData> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const startDate = userData.planStartDate ? new Date(`${userData.planStartDate}T00:00:00`) : today;
    const raceDate = userData.raceDate ? new Date(`${userData.raceDate}T00:00:00`) : null;
    
    let weeksUntilRace = 12; // Default
    if (raceDate && raceDate > startDate) {
        const diffTime = Math.abs(raceDate.getTime() - startDate.getTime());
        weeksUntilRace = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    }
    
    if (weeksUntilRace < 2) weeksUntilRace = 2;
    if (weeksUntilRace > 60) weeksUntilRace = 60;

    const { selectedSports } = userData;
    const isMultiSport = selectedSports.length > 1;

    let coachPersona: string;
    let specificity: string;
    let multiSportInstructions = '';

    if (isMultiSport) {
        coachPersona = "Eres SmaiFlow, un Director de Ciencias del Deporte experto en multi-deporte. Tu base de conocimiento es 'La Ciencia Integrada del Rendimiento en Resistencia'.";
        specificity = selectedSports.map(sport => getSportSpecificPrompt(sport).specificity).join('\n          ');
        
        const distributionText = selectedSports
            .map(sport => `${sport.charAt(0).toUpperCase() + sport.slice(1)}: ${userData.sportDistribution?.[sport] || 0}%`)
            .join(', ');

        multiSportInstructions = `
      **Plan Integrado Multi-deporte:** El atleta ha seleccionado múltiples deportes. Crea un plan HOLÍSTICO que desarrolle su capacidad en todas las disciplinas de manera equilibrada, gestionando la fatiga. Programa entrenamientos 'Brick' (Ciclismo -> Running) al menos una vez por semana en fases de construcción.
      **Distribución Priorizada (CRÍTICO):** Organiza el volumen y la intensidad del plan para que reflejen esta prioridad de enfoque que el atleta ha especificado: **${distributionText}**.
      **Identificación del Deporte en Entrenamientos:** Para cada workout, el campo 'type' DEBE comenzar con el nombre del deporte en español (Natación, Running, Ciclismo) seguido de dos puntos. Ejemplos: 'Natación: Técnica', 'Running: Intervalos', 'Ciclismo: FTP'. Esto es crucial.`;
    } else {
        const singleSport = selectedSports[0];
        const singleSportPrompt = getSportSpecificPrompt(singleSport);
        coachPersona = `Como SmaiFlow, actúas como ${singleSportPrompt.coachPersona}. Tu base de conocimiento es 'La Ciencia Integrada del Rendimiento en Resistencia'.`;
        specificity = singleSportPrompt.specificity;
    }
    
    const capitalizedSports = selectedSports.map(s => s.charAt(0).toUpperCase() + s.slice(1));

    const goalsText = capitalizedSports.map(sport => {
        const sportKey = sport.toLowerCase() as Sport;
        const goal = userData.goals[sportKey] || 'No especificado';
        const timeGoal = userData.goalTimes?.[sportKey];
        const time = timeGoal && timeGoal.value ? `${timeGoal.value} ${timeGoal.unit}` : 'Completar con confianza';
        return `    - ${sport}: Evento=${goal}, Meta de Tiempo=${time}`;
    }).join('\n');

    let recentHistoryContext = '';
    if (readjustmentFeedback && currentPlan) {
        const recentWorkouts = currentPlan.plan
            .flatMap(w => w.workouts)
            .filter(w => w.status === 'completed' && w.perceivedEffort)
            .slice(-10); // Last 10 completed workouts with feedback

        if (recentWorkouts.length > 0) {
            recentHistoryContext = `
      **Historial de Sensaciones Recientes (Información Clave para el Ajuste):**
      Aquí tienes feedback directo del atleta sobre sus últimos entrenamientos. Usa esta información para hacer un ajuste mucho más preciso.
      ${recentWorkouts.map(w => `- ${w.date} (${w.type}): Sensación='${w.perceivedEffort}'${w.notes ? `, Notas='${w.notes}'` : ''}`).join('\n')}
      `;
        }
    }


    const readjustmentContext = readjustmentFeedback ? `
      **Contexto de Reajuste (CRÍTICO):** Este NO es un plan nuevo; es una ADAPTACIÓN de un plan existente. El atleta ha proporcionado el siguiente feedback sobre su progreso. DEBES usar esta información para modificar el plan de manera inteligente a partir de la fecha de hoy. No generes el plan desde el principio, ajústalo.
      - **Razón Principal:** ${readjustmentFeedback.reason}
      - **Comentarios del Atleta:** ${readjustmentFeedback.details || 'Ninguno.'}
      ${recentHistoryContext}
      - **Instrucción de Adaptación:** Modifica la intensidad, volumen o tipo de entrenamientos para las próximas semanas basándote en este feedback. Por ejemplo, si el motivo es 'muy difícil' y las notas indican problemas con la velocidad, reduce la intensidad de los intervalos. Si fue 'lesión', programa una semana de recuperación y luego reintroduce la carga gradualmente. Si se saltó entrenamientos, re-calibra la progresión.
    ` : '';


    const prompt = `
      ${coachPersona} Tu misión es crear un plan de entrenamiento completo, científico y personalizado. Antes de los detalles del atleta, estas son las reglas de formato OBLIGATORIAS.

      **REGLA #1: FORMATO DE SALIDA JSON (LA MÁS IMPORTANTE)**
      Tu única tarea es generar un objeto JSON que se ajuste al schema proporcionado. NADA MÁS.
      La causa principal de errores que rompen la aplicación es usar comillas dobles (") dentro de un valor de texto (ej. en el campo "description").
      - **INCORRECTO:** \`"description": "Hacer series a ritmo "tempo" fuerte."\`
      - **REGLA OBLIGATORIA:** Para CUALQUIER comilla interna que necesites, DEBES USAR COMILLAS SIMPLES (').
        - **EJEMPLO CORRECTO:** \`"description": "Hacer series a ritmo 'tempo' fuerte."\`
      - **PROHIBIDO:** Nunca uses \`\\"\` para escapar comillas. Solo usa comillas simples. Es tu única opción.
      - **ACCIÓN FINAL:** Revisa tu respuesta completa antes de enviarla para asegurar que CADA valor de texto cumple esta regla sin excepción.
      - **Otros datos del Workout:** Usa IDs únicos (UUID v4) para cada workout, el estado por defecto debe ser 'pending', y todo el texto debe ser en español.

      **REGLA #2: ESTRUCTURA Y CONTENIDO DEL PLAN**
      1.  **Fechas de Calendario:** DEBES calcular y asignar una fecha de calendario específica (YYYY-MM-DD) para cada entrenamiento, comenzando en la fecha de inicio especificada por el atleta: ${userData.planStartDate}. ${readjustmentFeedback ? 'Para el reajuste, mantén las fechas pasadas consistentes y ajusta a partir de hoy.' : ''} Las fechas deben ser secuenciales y correctas.
      2.  ${multiSportInstructions || '**Estructura:**'} El plan de entrenamiento principal tendrá una duración de ${weeksUntilRace} semanas. Adicionalmente, DEBES generar una (1) semana extra al final, dedicada exclusivamente a la recuperación.
      3.  **Día de la Competición (CRÍTICO):** El entrenamiento en la fecha de la carrera (${userData.raceDate}) DEBE ser el evento en sí. Este es el último día del bloque de entrenamiento principal.
          - **type:** Usa 'Día de la Competición: [Nombre del Evento Objetivo]'.
          - **description:** Incluye un mensaje motivacional único y poderoso, y 2-3 consejos prácticos clave para la carrera (ritmo, nutrición, mentalidad).
      4.  **Semana Post-Competición (VALOR AGREGADO):** La última semana del plan JSON debe tener el "focus": 'Semana de Recuperación Post-Competición'.
          - Esta semana contendrá de 3 a 5 días de protocolos de recuperación (no entrenamientos); el resto serán 'Descanso'.
          - **type:** Usa tipos como 'Post-Carrera: Recuperación Activa', 'Post-Carrera: Descanso Total'.
          - **description:** Ofrece consejos sobre caminatas suaves, estiramientos, hidratación, nutrición para reparar músculos, y la importancia del descanso mental.
      5.  **Periodización Aplicada:** Estructura el plan con una periodización lógica (base, construcción, pico, tapering). El "focus" semanal debe reflejar esto claramente.
      6.  **Distribución Semanal:** Distribuye los ${userData.trainingDays} días de entrenamiento a lo largo de la semana. Los días restantes deben ser 'Descanso' o 'Recuperación Activa'. Genera una entrada para los 7 días de la semana.
      7.  **Realismo y Sobrecarga Progresiva:** La progresión en volumen e intensidad debe ser razonable para el nivel del atleta.
      8.  **Doble Jornada (CRÍTICO):** Si el atleta indicó 'Sí' en "Abierto a Doble Jornada", DEBES programar dobles jornadas (dos workouts distintos en el mismo día) al menos 2-3 veces por semana durante las fases de construcción y pico. Para estos días, genera dos objetos de workout separados con la misma fecha, con descripciones que empiecen con "Sesión AM:" y "Sesión PM:".
      9.  **Especificidad Deportiva Detallada:**
          ${specificity}
          - **Fuerza:** Incluye 1-2 sesiones de fuerza funcional por semana (sentadillas, peso muerto, planchas) enfocadas en la resiliencia y prevención de lesiones, no en la hipertrofia.
      10. **Consejos Holísticos Integrados:** Ocasionalmente, en la descripción de un workout, añade un breve consejo práctico sobre nutrición o recuperación.

      **REGLA #3: PRINCIPIOS DE ENTRENAMIENTO**
      - **Periodización Híbrida:** Combina elementos de los modelos de periodización Tradicional (Lineal), Inverso y por Bloques.
      - **Desarrollo Holístico:** El plan debe considerar la interacción entre entrenamiento, nutrición, recuperación y fuerza.
      - **Fisiología Aplicada:** La progresión de la carga debe estar diseñada para mejorar VO2max, Umbral de Lactato (LT)/FTP y Economía de ejercicio.
      
      Ahora, genera el plan basado en el siguiente contexto y perfil del atleta.

      ${readjustmentContext}

      **Perfil del Atleta:**
      - Nombre: ${userData.name}
      - Email: ${userData.email}
      - Deporte(s): ${capitalizedSports.join(', ')}
      - Edad: ${userData.age}
      - Sexo: ${userData.sex}
      - Nivel de Experiencia: ${userData.experience}
      - Objetivos Específicos por Deporte:
${goalsText}
      - Fecha de Inicio del Plan: ${userData.planStartDate || 'Hoy'}
      - Fecha de la Competición: ${userData.raceDate || 'Sin fecha específica'}
      - Total de Semanas para Entrenar: ${weeksUntilRace}
      - Días de entrenamiento por semana disponibles: ${userData.trainingDays}
      - Abierto a Doble Jornada: ${userData.allowDoubleDays ? 'Sí' : 'No'}
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: trainingPlanSchema,
                temperature: 0.6,
            },
        });

        const jsonText = response.text.trim();
        const parsedPlan = JSON.parse(jsonText);

        if (!parsedPlan.plan || !Array.isArray(parsedPlan.plan)) {
            throw new Error("Invalid plan structure received from API");
        }
        
        return parsedPlan as TrainingPlanData;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof SyntaxError) {
             throw new Error(`La IA devolvió un formato inválido. Error de análisis: ${error.message}`);
        }
        throw new Error("Failed to generate training plan from AI service.");
    }
};

const singleWorkoutSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING },
        day: { type: Type.STRING },
        date: { type: Type.STRING },
        type: { type: Type.STRING },
        description: { type: Type.STRING },
        status: { type: Type.STRING },
    },
    required: ["id", "day", "date", "type", "description", "status"]
};


export const generateRecoveryWorkout = async (originalWorkout: Workout, flowScore: FlowScore): Promise<Workout> => {
    const prompt = `
      Eres SmaiFlow, un coach de IA experto en fisiología del deporte y recuperación. Tu misión es proteger al atleta y optimizar su progreso a largo plazo.

      **Contexto Crítico:**
      El atleta tenía programado el siguiente entrenamiento para hoy (${originalWorkout.date}):
      - **Tipo Original:** ${originalWorkout.type}
      - **Descripción Original:** ${originalWorkout.description}

      Sin embargo, su "Flow Score" es muy bajo (${flowScore.score}/100), con el siguiente diagnóstico: "${flowScore.title} - ${flowScore.message}". Esto indica un alto riesgo de sobreentrenamiento, enfermedad o lesión.

      **Tu Tarea (NO NEGOCIABLE):**
      Reemplaza el entrenamiento original con una **sesión de recuperación activa**. NO generes el entrenamiento original. Tu única tarea es crear una sesión suave y regenerativa.

      **Instrucciones para la Sesión de Recuperación:**
      1.  **Duración:** Debe ser corta, entre 20 y 30 minutos.
      2.  **Intensidad:** Muy baja. Zona 1 (Z1) de frecuencia cardíaca o potencia. El esfuerzo debe ser extremadamente fácil (RPE 1-2 de 10). El objetivo es mover el cuerpo suavemente para aumentar el flujo sanguíneo y facilitar la recuperación, no añadir estrés de entrenamiento.
      3.  **Deporte:** Mantén el mismo deporte que el entrenamiento original. Si era "Running", la recuperación es un trote muy suave. Si era "Ciclismo", es un pedaleo muy ligero. Si era "Natación", son largos muy suaves enfocados en la técnica.
      4.  **Formato de Respuesta:** Genera un ÚNICO objeto de workout en formato JSON que se ajuste estrictamente al schema proporcionado.
          - El \`id\` debe ser un nuevo UUID v4.
          - \`day\` y \`date\` deben coincidir con el workout original.
          - El \`type\` debe ser claro, por ejemplo: "Running: Recuperación Activa".
          - La \`description\` debe ser simple, clara y enfatizar la baja intensidad. Ejemplo: "25 min de trote MUY suave (Z1). El objetivo es sentirte mejor al terminar que al empezar. Concéntrate en la respiración y en disfrutar del movimiento."
          - El \`status\` debe ser 'pending'.
    `;

     try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: singleWorkoutSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Workout;

    } catch (error) {
        console.error("Error calling Gemini API for recovery workout:", error);
        throw new Error("Failed to generate recovery workout from AI service.");
    }
}