import React, { useState, useEffect } from 'react';
import { TrainingPlanData, Workout, UserData, WorkoutStatus, Sport, FlowScore } from '../types';
import { RestIcon, CheckIcon, RunIcon, SwimIcon, CycleIcon, DumbbellIcon, CheckCircleIcon, AdjustIcon } from './IconComponents';
import WorkoutDetailModal from './WorkoutDetailModal';
import { GOLDEN_TIPS } from '../constants';
import LoadingSpinner from './LoadingSpinner';


interface Props {
  plan: TrainingPlanData;
  onUpdateWorkoutStatus: (workoutId: string, status: WorkoutStatus) => void;
  userData: UserData;
  todaysFlowScore: FlowScore | null;
  onAdjustWorkout: (workout: Workout, flowScore: FlowScore) => void;
}

const getWorkoutAccent = (type: string): { emoji: string; colors: string, icon: React.ReactNode } => {
    const lowerType = type.toLowerCase();
    if (lowerType.startsWith('natación')) return { emoji: '🏊‍♂️', colors: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300', icon: <SwimIcon /> };
    if (lowerType.startsWith('running')) return { emoji: '🏃‍♀️', colors: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300', icon: <RunIcon /> };
    if (lowerType.startsWith('ciclismo')) return { emoji: '🚴', colors: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300', icon: <CycleIcon /> };
    if (lowerType.includes('fuerza')) return { emoji: '💪', colors: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300', icon: <DumbbellIcon /> };
    if (lowerType.includes('descanso')) return { emoji: '😴', colors: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300', icon: <RestIcon /> };
    if (lowerType.includes('recuperación')) return { emoji: '🧘', colors: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300', icon: <RunIcon />};
    return { emoji: '🏆', colors: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', icon: <RunIcon /> };
};

const ImpactBar: React.FC<{ label: string, value: number, range: [number, number], emoji: string }> = ({ label, value, range, emoji }) => {
    const [min, max] = range;
    const totalRange = max - min;
    const zeroPointPercent = totalRange > 0 ? (0 - min) / totalRange * 100 : 100;

    let barWidthPercent = 0;
    let barLeftPercent = zeroPointPercent;
    let barColor = 'bg-gray-400';

    if (value > 0 && max > 0) {
        barWidthPercent = (value / max) * (100 - zeroPointPercent);
        barColor = 'bg-green-500';
    } else if (value < 0 && min < 0) {
        barWidthPercent = (Math.abs(value) / Math.abs(min)) * zeroPointPercent;
        barLeftPercent = zeroPointPercent - barWidthPercent;
        barColor = 'bg-red-500';
    }

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm w-8 text-center" aria-hidden="true">{emoji}</span>
            <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-amber-800 dark:text-slate-300">{label}</span>
                    <span className={`text-xs font-bold ${value > 0 ? 'text-green-600 dark:text-green-400' : value < 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}>
                        {value > 0 ? `+${value}` : value}
                    </span>
                </div>
                <div className="relative w-full h-3 bg-amber-200/50 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div 
                        className={`absolute h-full rounded-full ${barColor} transition-all duration-500`} 
                        style={{ left: `${barLeftPercent}%`, width: `${barWidthPercent}%` }}
                    ></div>
                    <div 
                        className="absolute h-full w-0.5 bg-slate-400/50 dark:bg-slate-500/50" 
                        style={{ left: `${zeroPointPercent}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

const FlowScoreDisplay: React.FC<{ flowScore: FlowScore, onAdjust: () => void, isAdjusting: boolean, workoutToAdjust?: Workout }> = ({ flowScore, onAdjust, isAdjusting, workoutToAdjust }) => {
    const { score, colorClass } = flowScore;
    const circumference = 2 * Math.PI * 52; // 2 * pi * radius
    const [offset, setOffset] = useState(circumference);
    const [showBreakdown, setShowBreakdown] = useState(false);

    useEffect(() => {
      // Animate the stroke-dashoffset
      const timer = setTimeout(() => {
        setOffset(circumference - (score / 100) * circumference);
      }, 100);
      return () => clearTimeout(timer);
    }, [score, circumference]);

    const canAdjust = score < 45 && workoutToAdjust && workoutToAdjust.status === 'pending';

    return (
        <div className="bg-white/70 dark:bg-slate-800/60 p-6 rounded-2xl shadow-lg border border-amber-300/60 dark:border-slate-600/60 flex flex-col items-center gap-6">
             <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
                <div className="relative w-36 h-36 flex-shrink-0">
                    <svg className="w-full h-full" viewBox="0 0 120 120">
                        <circle
                            className="text-amber-100 dark:text-slate-700"
                            strokeWidth="10"
                            stroke="currentColor"
                            fill="transparent"
                            r="52"
                            cx="60"
                            cy="60"
                        />
                        <circle
                            className={`${colorClass}`}
                            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                            strokeWidth="10"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="52"
                            cx="60"
                            cy="60"
                            transform="rotate(-90 60 60)"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-4xl font-bold ${colorClass}`}>{score}</span>
                        <span className="text-xs font-semibold text-amber-800 dark:text-slate-400">Flow Score</span>
                    </div>
                </div>
                <div className="text-center sm:text-left">
                    <h3 className={`text-xl font-bold ${colorClass}`}>{flowScore.title}</h3>
                    <p className="text-amber-800 dark:text-slate-300 text-sm mt-1">{flowScore.message}</p>
                </div>
            </div>
            
            {flowScore.breakdown && (
                <div className="w-full">
                    <div className="pt-4 border-t border-amber-200/50 dark:border-slate-700/50">
                        <button 
                            onClick={() => setShowBreakdown(!showBreakdown)}
                            className="w-full flex justify-between items-center text-sm font-semibold text-amber-800 dark:text-slate-300 hover:text-amber-950 dark:hover:text-slate-100"
                            aria-expanded={showBreakdown}
                        >
                            <span>Ver desglose de impacto</span>
                             <svg className={`w-4 h-4 transition-transform duration-300 ${showBreakdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>

                    {showBreakdown && (
                        <div className="w-full mt-4 space-y-4 animate-fade-in">
                            <ImpactBar label="Tu Energía" value={flowScore.breakdown.energy} range={[-10, 10]} emoji="⚡" />
                            <ImpactBar label="Dolor Muscular" value={flowScore.breakdown.soreness} range={[-20, 0]} emoji="💪" />
                            <ImpactBar label="Tu Descanso" value={flowScore.breakdown.sleep} range={[-12, 12]} emoji="😴" />
                            <ImpactBar label="Nivel de Estrés" value={flowScore.breakdown.stress} range={[-28, 0]} emoji="🧠" />
                            <ImpactBar label="Tu Motivación" value={flowScore.breakdown.motivation} range={[-8, 8]} emoji="🎯" />
                        </div>
                    )}
                </div>
            )}

            {canAdjust && (
                 <div className="w-full pt-4 border-t border-amber-200/50 dark:border-slate-700/50">
                    <button
                        onClick={onAdjust}
                        disabled={isAdjusting}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-amber-900 rounded-xl hover:bg-amber-950 transition-colors shadow-md disabled:bg-slate-500 disabled:cursor-wait"
                    >
                        {isAdjusting ? (
                            <>
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Ajustando...</span>
                            </>
                        ) : (
                           <>
                            <AdjustIcon />
                            <span>Ajustar Entrenamiento de Hoy</span>
                           </>
                        )}
                    </button>
                 </div>
            )}
        </div>
    );
};


const WorkoutCard: React.FC<{ workout: Workout; onUpdate: (id: string, status: WorkoutStatus) => void; userData: UserData; isFirst?: boolean; }> = ({ workout, onUpdate, userData, isFirst = false }) => {
    const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
    const accent = getWorkoutAccent(workout.type);

    return (
        <>
            <div className="bg-white/80 dark:bg-slate-800/80 p-6 rounded-2xl shadow-lg border border-amber-300/60 dark:border-slate-600/60 w-full">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-2xl font-bold text-amber-950 dark:text-slate-100">{workout.type}</h3>
                        <p className="text-amber-700 dark:text-slate-400 mt-1">Tu misión para hoy</p>
                    </div>
                    <span className={`text-sm font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full ${accent.colors}`}>{accent.emoji}</span>
                </div>
                <p className="mt-4 text-amber-800 dark:text-slate-300 text-base">{workout.description}</p>
                <div className="mt-6 pt-6 border-t border-amber-200 dark:border-slate-700">
                    {workout.status === 'pending' ? (
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => onUpdate(workout.id, 'completed')} 
                                className="w-full text-center py-3 font-semibold text-green-800 bg-green-200 hover:bg-green-300 rounded-xl transition-colors dark:bg-green-500/20 dark:text-green-300 dark:hover:bg-green-500/30"
                                {...(isFirst && { 'data-tour-id': 'today-complete-workout-btn' })}
                            >
                                ¡Hecho! ✅
                            </button>
                            <button onClick={() => onUpdate(workout.id, 'skipped')} className="w-full text-center py-3 font-semibold text-amber-800 bg-amber-200 hover:bg-amber-300 rounded-xl transition-colors dark:bg-amber-500/20 dark:text-amber-300 dark:hover:bg-amber-500/30">
                                Omitir ❌
                            </button>
                        </div>
                    ) : (
                        <div className={`w-full text-center py-3 font-bold rounded-xl ${workout.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300'}`}>
                           {workout.status === 'completed' ? 'Completado' : 'Omitido'}
                        </div>
                    )}
                    <button onClick={() => setSelectedWorkout(workout)} className="mt-3 w-full text-center font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200 py-2 rounded-lg hover:bg-amber-100/80 dark:hover:bg-slate-700/50 transition-colors">
                        Ver Detalles
                    </button>
                </div>
            </div>
             {selectedWorkout && (
                <WorkoutDetailModal
                    workout={selectedWorkout}
                    userData={userData}
                    onClose={() => setSelectedWorkout(null)}
                />
            )}
        </>
    );
};

const UpcomingWorkout: React.FC<{ workout: Workout, isNext?: boolean }> = ({ workout, isNext = false }) => {
    const { icon } = getWorkoutAccent(workout.type);
    const date = new Date(`${workout.date}T00:00:00`);
    const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '');

    const containerClasses = isNext
        ? "bg-white/70 dark:bg-slate-700/70 p-4 rounded-xl flex items-center gap-4 border-2 border-amber-400 dark:border-amber-500 shadow-md"
        : "bg-white/60 dark:bg-slate-700/60 p-3 rounded-xl flex items-center gap-3";

    return (
        <div className={containerClasses}>
            <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold ${workout.status === 'completed' ? 'bg-green-200 text-green-800 dark:bg-green-500/30 dark:text-green-300' : 'bg-amber-100 text-amber-800 dark:bg-slate-600 dark:text-slate-200'}`}>
                {workout.status === 'completed' ? <CheckIcon/> : dayName.charAt(0).toUpperCase() + dayName.slice(1)}
            </div>
            <div className="flex-grow">
                <p className="font-semibold text-amber-900 dark:text-slate-100 text-sm">{workout.type}</p>
                <p className="text-xs text-amber-700 dark:text-slate-400">{workout.description.substring(0, 40)}...</p>
            </div>
            <div className={`flex-shrink-0 ${workout.status === 'completed' ? 'text-green-600' : 'text-amber-600 dark:text-amber-400'}`}>
                {icon}
            </div>
        </div>
    )
}

const TodayView: React.FC<Props> = ({ plan, onUpdateWorkoutStatus, userData, todaysFlowScore, onAdjustWorkout }) => {
  const [goldenTip, setGoldenTip] = useState<string>('');
  const [isAdjusting, setIsAdjusting] = useState(false);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayString = today.toISOString().split('T')[0];
  
  const allWorkouts = plan.plan.flatMap(week => week.workouts);
  const todaysWorkouts = allWorkouts.filter(workout => workout.date === todayString);
  const todaysNonRestWorkouts = todaysWorkouts.filter(w => !w.type.toLowerCase().includes('descanso'));
  
  const nextWorkout = allWorkouts.find(w => new Date(w.date) > today && !w.type.toLowerCase().includes('descanso'));

  const isRestDay = todaysWorkouts.length === 0 || todaysNonRestWorkouts.length === 0;
  const allTodayCompleted = !isRestDay && todaysNonRestWorkouts.every(w => w.status === 'completed');

  const currentWeek = plan.plan.find(week => week.workouts.some(w => w.date === todayString));
  const upcomingInWeek = currentWeek ? currentWeek.workouts.filter(w => new Date(w.date) > today) : [];

  useEffect(() => {
    const relevantSports = userData.selectedSports;
    const tips = relevantSports.flatMap(sport => GOLDEN_TIPS[sport as Sport] || []);
    const shuffledTips = tips.sort(() => 0.5 - Math.random());
    setGoldenTip(shuffledTips.length > 0 ? shuffledTips[0] : "La consistencia es más importante que la intensidad. ¡Sigue tu plan!");
  }, [userData.selectedSports]);

  const handleAdjust = async () => {
    if (todaysFlowScore && todaysNonRestWorkouts.length > 0) {
        setIsAdjusting(true);
        await onAdjustWorkout(todaysNonRestWorkouts[0], todaysFlowScore);
        setIsAdjusting(false);
    }
  };


  const renderTodayContent = () => {
      if (isRestDay) {
          return (
              <div className="bg-amber-100/80 dark:bg-slate-800/70 p-8 rounded-2xl shadow-lg border border-amber-300/40 text-center">
                  <div className="mx-auto w-12 h-12 flex items-center justify-center bg-indigo-100 dark:bg-indigo-500/30 rounded-full">
                      <RestIcon className="text-indigo-600 dark:text-indigo-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-amber-900 dark:text-slate-100 mt-4">Día de Descanso</h3>
                  <p className="text-amber-800 dark:text-slate-300 mt-2">
                    El descanso es clave para la recuperación y el progreso. ¡Aprovéchalo para recargar energías!
                  </p>
                  {nextWorkout && (
                      <div className="mt-6 pt-6 border-t border-amber-200 dark:border-slate-700">
                          <h4 className="font-bold text-amber-950 dark:text-slate-200">Próxima Misión:</h4>
                          <div className="mt-3 max-w-sm mx-auto">
                            <UpcomingWorkout workout={nextWorkout} isNext={true} />
                          </div>
                      </div>
                  )}
              </div>
          );
      }
      if (allTodayCompleted) {
          return (
              <div className="bg-green-100/80 dark:bg-green-900/40 p-8 rounded-2xl shadow-lg border border-green-300/40 text-center">
                  <div className="mx-auto w-12 h-12 flex items-center justify-center bg-green-200 dark:bg-green-500/30 rounded-full">
                      <CheckCircleIcon className="text-green-600 dark:text-green-300 h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-800 dark:text-green-200 mt-4">¡Entrenamiento Completado! 🎉</h3>
                  <p className="text-green-700 dark:text-green-300 mt-2">
                    ¡Gran trabajo hoy! Has conquistado tu misión. La recuperación empieza ahora.
                  </p>
                  {nextWorkout && (
                      <div className="mt-6 pt-6 border-t border-green-200 dark:border-green-700">
                          <h4 className="font-bold text-green-800 dark:text-green-200">Próxima Misión:</h4>
                          <div className="mt-3 max-w-sm mx-auto">
                            <UpcomingWorkout workout={nextWorkout} isNext={true} />
                          </div>
                      </div>
                  )}
              </div>
          )
      }
      return todaysWorkouts.map((workout, index) => (
          <WorkoutCard key={workout.id} workout={workout} onUpdate={onUpdateWorkoutStatus} userData={userData} isFirst={index === 0} />
      ));
  }


  return (
    <div className="animate-fade-in space-y-8">
        <div>
            <h2 className="text-3xl font-extrabold text-amber-950 dark:text-slate-100">¡Vamos con todo, {userData.name}!</h2>
            <p className="mt-1 text-amber-800 dark:text-slate-400 font-medium">{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-6">
                 {todaysFlowScore ? (
                    <FlowScoreDisplay 
                        flowScore={todaysFlowScore} 
                        onAdjust={handleAdjust} 
                        isAdjusting={isAdjusting}
                        workoutToAdjust={todaysNonRestWorkouts[0]}
                    />
                 ) : (
                    <div className="bg-white/70 dark:bg-slate-800/60 p-6 rounded-2xl shadow-lg border border-amber-300/60 flex items-center justify-center min-h-[192px]">
                        <LoadingSpinner />
                        <p className="ml-4 text-amber-800 dark:text-slate-300">Calculando tu Flow Score...</p>
                    </div>
                 )}
                 <div>
                    <h3 className="text-xl font-bold text-amber-950 dark:text-slate-200 mb-4">Tu Misión de Hoy</h3>
                    <div className="space-y-4">
                        {renderTodayContent()}
                    </div>
                 </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
                {upcomingInWeek.length > 0 && (
                     <div className="bg-amber-100/80 p-5 rounded-2xl shadow-lg border border-amber-300/40 dark:bg-slate-800/70 dark:border-slate-700">
                        <h3 className="text-lg font-bold text-amber-950 dark:text-slate-200 mb-4">Próximos en la Semana</h3>
                        <div className="space-y-3">
                            {upcomingInWeek.slice(0, 4).map(workout => (
                                <UpcomingWorkout key={workout.id} workout={workout} />
                            ))}
                        </div>
                    </div>
                )}
                 <div className="bg-amber-900/90 text-white p-5 rounded-2xl shadow-lg border border-amber-700/40 dark:bg-slate-900 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-amber-200 dark:text-amber-300 mb-2">💡 Consejo de Oro</h3>
                    <p className="text-amber-100 text-sm italic dark:text-amber-200/90">"{goldenTip}"</p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default React.memo(TodayView);