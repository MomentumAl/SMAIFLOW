import React from 'react';
import { RunIcon, SwimIcon, CycleIcon } from './IconComponents';

interface Props {
  onClose: () => void;
}

const BoldableText: React.FC<{ text: string, className?: string }> = ({ text, className = "font-semibold text-amber-900 dark:text-amber-200" }) => {
    const parts = text.split('**');
    return (
        <>
            {parts.map((part, index) =>
                index % 2 === 1 ? (
                    <strong key={index} className={className}>{part}</strong>
                ) : (
                    part
                )
            )}
        </>
    );
};

const CriteriaItem: React.FC<{ text: string }> = ({ text }) => (
    <div className="flex items-start gap-3">
        <div className="flex-shrink-0 pt-1">
            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
        </div>
        <p className="text-sm text-amber-800 dark:text-slate-300">
            <BoldableText text={text} />
        </p>
    </div>
);

const SportExampleItem: React.FC<{ sport: 'running' | 'swimming' | 'cycling', text: string }> = ({ sport, text }) => {
    const icons = {
        running: <RunIcon className="w-4 h-4 text-sky-600 dark:text-sky-400" />,
        swimming: <SwimIcon className="w-4 h-4 text-teal-600 dark:text-teal-400" />,
        cycling: <CycleIcon className="w-4 h-4 text-orange-600 dark:text-orange-400" />,
    };

    const boldClassNames = {
        running: "font-semibold text-sky-800 dark:text-sky-300",
        swimming: "font-semibold text-teal-800 dark:text-teal-300",
        cycling: "font-semibold text-orange-800 dark:text-orange-300",
    };

    return (
        <div className="flex items-start gap-3">
            <div className="flex-shrink-0 pt-1">{icons[sport]}</div>
            <p className="text-sm text-amber-800 dark:text-slate-300">
                <BoldableText text={text} className={boldClassNames[sport]} />
            </p>
        </div>
    );
}


const ExperienceInfoModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl animate-fade-in-up max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-amber-200 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-start justify-between">
            <h2 className="text-xl font-bold text-amber-950 dark:text-slate-100">Guía de Niveles de Experiencia</h2>
            <button onClick={onClose} className="p-1.5 text-amber-400 hover:text-amber-600 rounded-full hover:bg-amber-100 transition-colors dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
            <div className="bg-amber-50/70 dark:bg-slate-700/50 p-5 rounded-xl border border-amber-200/80 dark:border-slate-600/60">
                <h3 className="font-bold text-lg text-amber-900 dark:text-amber-300">Principiante 🐣</h3>
                <p className="text-sm text-amber-800 dark:text-slate-300 mt-1 mb-4">Tu enfoque principal es construir una base sólida, aprender la técnica y completar las distancias con confianza.</p>
                <div className="space-y-3">
                    <CriteriaItem text="Eres nuevo/a en el deporte o has entrenado de forma irregular por **menos de 6 meses**." />
                    <CriteriaItem text="Entrenas **1-3 veces** por semana sin una estructura fija." />
                    <SportExampleItem sport="running" text="**Ejemplo Running:** Tu objetivo es correr tus primeros 5k o mejorar tu capacidad para correr sin parar." />
                    <SportExampleItem sport="swimming" text="**Ejemplo Natación:** Aún estás perfeccionando la respiración y puedes nadar 200-400m seguidos con esfuerzo." />
                    <SportExampleItem sport="cycling" text="**Ejemplo Ciclismo:** Tus salidas suelen ser de menos de 1 hora y a un ritmo suave." />
                </div>
            </div>
             <div className="bg-amber-50/70 dark:bg-slate-700/50 p-5 rounded-xl border border-amber-200/80 dark:border-slate-600/60">
                <h3 className="font-bold text-lg text-amber-900 dark:text-amber-300">Intermedio 🚀</h3>
                 <p className="text-sm text-amber-800 dark:text-slate-300 mt-1 mb-4">Ya tienes una base, entrenas con regularidad y ahora buscas mejorar tus marcas personales y enfrentar distancias más largas.</p>
                 <div className="space-y-3">
                    <CriteriaItem text="Has estado entrenando de forma consistente por **más de 6 meses**." />
                    <CriteriaItem text="Entrenas **3-5 veces** por semana, posiblemente ya incluyendo distintos tipos de sesiones (largas, rápidas, etc.)." />
                    <SportExampleItem sport="running" text="**Ejemplo Running:** Corres 10k cómodamente y has completado (o te preparas para) un medio maratón." />
                    <SportExampleItem sport="swimming" text="**Ejemplo Natación:** Puedes nadar 1500m o más sin parar y empiezas a trabajar en series de velocidad." />
                    <SportExampleItem sport="cycling" text="**Ejemplo Ciclismo:** Realizas salidas de 2-3 horas y estás familiarizado/a con el entrenamiento de intervalos." />
                 </div>
            </div>
             <div className="bg-amber-50/70 dark:bg-slate-700/50 p-5 rounded-xl border border-amber-200/80 dark:border-slate-600/60">
                <h3 className="font-bold text-lg text-amber-900 dark:text-amber-300">Avanzado 🏆</h3>
                 <p className="text-sm text-amber-800 dark:text-slate-300 mt-1 mb-4">El deporte es una parte central de tu vida. Compites regularmente y tu entrenamiento está muy estructurado para maximizar tu rendimiento.</p>
                <div className="space-y-3">
                    <CriteriaItem text="Llevas **varios años** entrenando de forma estructurada y compitiendo." />
                    <CriteriaItem text="Entrenas **5-7 días** a la semana, a menudo con dobles sesiones." />
                    <CriteriaItem text="Tu entrenamiento se basa en métricas específicas (ritmo, potencia, frecuencia cardíaca)." />
                    <SportExampleItem sport="running" text="**Ejemplo Running:** Compites en maratones o ultramaratones buscando tiempos específicos, o eres un corredor de pista/distancias cortas muy competitivo." />
                    <SportExampleItem sport="swimming" text="**Ejemplo Natación:** Entrenas con un club o equipo, y tus volúmenes semanales son altos." />
                    <SportExampleItem sport="cycling" text="**Ejemplo Ciclismo:** Tienes experiencia en carreras, conoces tus zonas de potencia (FTP) y las usas para entrenar." />
                </div>
            </div>
        </div>
        
        <div className="p-4 bg-amber-50/60 dark:bg-slate-900/50 border-t border-amber-200 dark:border-slate-700 rounded-b-2xl flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-white bg-amber-600 rounded-xl hover:bg-amber-700 transition-colors shadow-sm dark:bg-amber-500 dark:hover:bg-amber-600"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceInfoModal;