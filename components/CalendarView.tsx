import React, { useState, useEffect } from 'react';
import { UserData, TrainingPlanData, Workout } from '../types';
import { ArrowLeftIcon, ArrowRightIcon } from './IconComponents';
import WorkoutDetailModal from './WorkoutDetailModal';

interface Props {
  plan: TrainingPlanData | null;
  userData: UserData;
}

const CalendarView: React.FC<Props> = ({ plan, userData }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [workoutsByDate, setWorkoutsByDate] = useState<Map<string, Workout[]>>(new Map());

  useEffect(() => {
      if (!plan) return;
      const map = new Map<string, Workout[]>();
      plan.plan.forEach(week => {
          week.workouts.forEach(workout => {
              if (!workout.type.toLowerCase().includes('descanso')) {
                const dateStr = workout.date; // YYYY-MM-DD
                if (!map.has(dateStr)) {
                    map.set(dateStr, []);
                }
                map.get(dateStr)!.push(workout);
              }
          });
      });
      setWorkoutsByDate(map);
  }, [plan]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const generateCalendarGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // 0 = Lunes, 6 = Domingo
    const daysInMonth = lastDayOfMonth.getDate();
    const grid = [];

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek; i > 0; i--) {
        grid.push({ day: prevMonthLastDay - i + 1, isCurrentMonth: false, workouts: [] });
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const workouts = workoutsByDate.get(dateStr) || [];
        grid.push({ day, isCurrentMonth: true, date: new Date(year, month, day), workouts });
    }
    
    const remainingCells = 42 - grid.length;
    for (let i = 1; i <= remainingCells; i++) {
        grid.push({ day: i, isCurrentMonth: false, workouts: [] });
    }
    return grid;
  };

  const calendarGrid = generateCalendarGrid();
  const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  if (!plan) {
      return (
        <div className="text-center p-8">
            <p className="text-amber-800 dark:text-slate-300">No hay un plan activo para mostrar en el calendario.</p>
        </div>
      );
  }

  return (
    <div className="bg-amber-100/80 dark:bg-slate-800/80 p-6 sm:p-8 rounded-2xl shadow-lg border border-amber-300/40 dark:border-slate-700/60 animate-fade-in-up">
        <div className="border-b border-amber-200 dark:border-slate-700 pb-5">
            <h2 className="text-2xl font-bold text-amber-950 dark:text-slate-100">Calendario de Entrenamiento</h2>
            <p className="mt-1 text-sm text-amber-800 dark:text-slate-400">Tu plan completo, mes a mes.</p>
        </div>

        <div className="bg-white/70 dark:bg-slate-700/60 p-4 rounded-xl border border-amber-200/80 dark:border-slate-600/60 mt-6">
            <div className="flex items-center justify-between mb-4 px-2">
                <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-amber-100 dark:hover:bg-slate-600 transition-colors" aria-label="Mes anterior">
                    <ArrowLeftIcon />
                </button>
                <h3 className="font-semibold text-lg text-amber-900 dark:text-slate-200 text-center">
                    {currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase())}
                </h3>
                <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-amber-100 dark:hover:bg-slate-600 transition-colors" aria-label="Mes siguiente">
                    <ArrowRightIcon />
                </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-amber-700 dark:text-slate-400 mb-2">
                {weekDays.map(day => <div key={day} className="py-2">{day.substring(0,3)}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {calendarGrid.map((cell, index) => {
                    const isToday = cell.isCurrentMonth && cell.date && cell.date.toDateString() === new Date().toDateString();
                    const hasWorkouts = cell.isCurrentMonth && cell.workouts.length > 0;

                    return (
                        <div key={index} className={`relative aspect-square p-1 border border-transparent ${cell.isCurrentMonth ? 'bg-amber-50/30 dark:bg-slate-800/20' : ''}`}>
                            <div className={`text-xs sm:text-sm ${!cell.isCurrentMonth ? 'text-slate-400 dark:text-slate-600' : 'text-slate-800 dark:text-slate-200'} ${isToday ? 'font-bold text-amber-600 dark:text-amber-400' : ''}`}>
                                {cell.day}
                            </div>
                            {hasWorkouts && (
                                <div className="mt-1 space-y-1">
                                    {cell.workouts.map(workout => {
                                         const workoutStatus = workout.status;
                                         const statusColor = {
                                             completed: 'bg-green-500',
                                             skipped: 'bg-orange-500',
                                             pending: 'bg-blue-500',
                                         }[workoutStatus!] || '';
                                        return (
                                            <button 
                                                key={workout.id}
                                                onClick={() => setSelectedWorkout(workout)}
                                                className={`w-full text-left p-1 rounded-md text-white text-[10px] leading-tight truncate transition-colors ${statusColor} hover:opacity-80`}
                                            >
                                                {workout.type}
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>

        {selectedWorkout && (
            <WorkoutDetailModal
                workout={selectedWorkout}
                userData={userData}
                onClose={() => setSelectedWorkout(null)}
            />
        )}
    </div>
  );
};

export default CalendarView;
