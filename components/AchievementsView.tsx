import React from 'react';
import { TrainingPlanData, Sport, Workout } from '../types';
import { BarChartIcon, StarIcon, InfoIcon } from './IconComponents';

interface Props {
  plan: TrainingPlanData;
}

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: React.ReactElement;
    isUnlocked: (workouts: Workout[], plan: TrainingPlanData) => boolean;
}

const achievements: Achievement[] = [
    {
        id: 'first_workout',
        title: '¡Primer Paso!',
        description: 'Has completado tu primer entrenamiento. ¡El viaje ha comenzado!',
        icon: <StarIcon />,
        isUnlocked: (workouts) => workouts.some(w => w.status === 'completed')
    },
    {
        id: 'perfect_week',
        title: 'Semana Perfecta',
        description: 'Completaste todos los entrenamientos programados en una semana.',
        icon: <StarIcon />,
        isUnlocked: (workouts, plan) => {
            if (!plan) return false;
            return plan.plan.some(week => {
                const relevant = week.workouts.filter(w => !w.type.toLowerCase().includes('descanso'));
                return relevant.length > 0 && relevant.every(w => w.status === 'completed');
            })
        }
    },
    {
        id: 'consistent_athlete',
        title: 'Atleta Consistente',
        description: 'Completaste 7 entrenamientos. ¡La constancia es la clave!',
        icon: <StarIcon />,
        isUnlocked: (workouts) => workouts.filter(w => w.status === 'completed').length >= 7
    },
    {
        id: 'dedicated_athlete',
        title: 'Dedicación Pura',
        description: 'Llevas 20 entrenamientos completados. ¡Imparable!',
        icon: <StarIcon />,
        isUnlocked: (workouts) => workouts.filter(w => w.status === 'completed').length >= 20
    },
    {
        id: 'runners_high',
        title: 'Fiebre del Corredor',
        description: 'Has completado 5 entrenamientos de running.',
        icon: <StarIcon />,
        isUnlocked: (workouts) => workouts.filter(w => w.type.toLowerCase().startsWith('running') && w.status === 'completed').length >= 5
    },
    {
        id: 'making_a_splash',
        title: 'Como Pez en el Agua',
        description: 'Has completado 5 entrenamientos de natación.',
        icon: <StarIcon />,
        isUnlocked: (workouts) => workouts.filter(w => w.type.toLowerCase().startsWith('natacion') && w.status === 'completed').length >= 5
    },
     {
        id: 'on_a_roll',
        title: 'Sobre Ruedas',
        description: 'Has completado 5 entrenamientos de ciclismo.',
        icon: <StarIcon />,
        isUnlocked: (workouts) => workouts.filter(w => w.type.toLowerCase().startsWith('ciclismo') && w.status === 'completed').length >= 5
    },
];

const AchievementCard: React.FC<{ achievement: Achievement, unlocked: boolean }> = ({ achievement, unlocked }) => (
    <div className={`p-4 rounded-xl border flex items-start gap-4 transition-all duration-300 ${unlocked ? 'bg-amber-50/80 border-amber-300 dark:bg-slate-700/60 dark:border-slate-600' : 'bg-slate-100/80 border-slate-200 opacity-70 dark:bg-slate-800/70 dark:border-slate-700'}`}>
        <div className={`p-3 rounded-full ${unlocked ? 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-slate-600' : 'text-slate-500 bg-slate-200 dark:text-slate-400 dark:bg-slate-700'}`}>
            {achievement.icon}
        </div>
        <div>
            <h4 className={`font-bold ${unlocked ? 'text-amber-950 dark:text-slate-100': 'text-slate-700 dark:text-slate-400'}`}>{achievement.title}</h4>
            <p className={`text-sm mt-0.5 ${unlocked ? 'text-amber-800 dark:text-slate-300' : 'text-slate-600 dark:text-slate-500'}`}>{achievement.description}</p>
        </div>
    </div>
);


const AchievementsView: React.FC<Props> = ({ plan }) => {
    const allWorkouts = plan.plan.flatMap(week => week.workouts);
    const relevantWorkouts = allWorkouts.filter(w => !w.type.toLowerCase().includes('descanso'));
    const completedWorkouts = relevantWorkouts.filter(w => w.status === 'completed');
    
    return (
        <div className="bg-amber-100/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-lg border border-amber-300/40 animate-fade-in-up dark:bg-slate-800/80 dark:border-slate-700/60">
            <div className="border-b border-amber-200 dark:border-slate-700 pb-5 mb-6">
                <h2 className="text-2xl font-bold text-amber-950 dark:text-slate-100">Tus Logros</h2>
                <p className="mt-1 text-sm text-amber-800 dark:text-slate-400">Celebra tus hitos y mantente motivado.</p>
            </div>
            {completedWorkouts.length === 0 && (
                 <div className="mb-6 bg-blue-50 dark:bg-blue-900/40 p-4 rounded-lg border border-blue-200 dark:border-blue-500/30 flex items-start gap-3">
                     <div className="text-blue-600 dark:text-blue-400 pt-1 flex-shrink-0"><InfoIcon /></div>
                     <div>
                         <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">¡Tu sala de trofeos te espera!</p>
                         <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                            Completa entrenamientos para empezar a desbloquear estos logros y llenar tu vitrina de éxitos.
                         </p>
                     </div>
                 </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map(ach => (
                    <AchievementCard 
                        key={ach.id}
                        achievement={ach}
                        unlocked={ach.isUnlocked(relevantWorkouts, plan)}
                    />
                ))}
            </div>
        </div>
    );
};

export default React.memo(AchievementsView);