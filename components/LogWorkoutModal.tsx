import React, { useState } from 'react';
import { Workout, PerceivedEffort } from '../types';

interface Props {
  workout: Workout;
  onClose: () => void;
  onLog: (workoutId: string, effort: PerceivedEffort, notes: string, distance?: number, duration?: number, elevation?: number) => void;
}

const effortOptions: { value: PerceivedEffort; label: string; emoji: string; colors: string }[] = [
    { value: 'facil', label: 'Fácil', emoji: '😌', colors: 'border-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/50 peer-checked:bg-sky-200 peer-checked:border-sky-500 dark:border-slate-600 dark:peer-checked:bg-sky-500/30 dark:peer-checked:border-sky-500' },
    { value: 'perfecto', label: 'Perfecto', emoji: '👌', colors: 'border-green-300 hover:bg-green-100 dark:hover:bg-green-900/50 peer-checked:bg-green-200 peer-checked:border-green-500 dark:border-slate-600 dark:peer-checked:bg-green-500/30 dark:peer-checked:border-green-500' },
    { value: 'dificil', label: 'Difícil', emoji: '🥵', colors: 'border-red-300 hover:bg-red-100 dark:hover:bg-red-900/50 peer-checked:bg-red-200 peer-checked:border-red-500 dark:border-slate-600 dark:peer-checked:bg-red-500/30 dark:peer-checked:border-red-500' }
];

const LogWorkoutModal: React.FC<Props> = ({ workout, onClose, onLog }) => {
    const [effort, setEffort] = useState<PerceivedEffort | null>(null);
    const [notes, setNotes] = useState('');
    const [distance, setDistance] = useState<string>('');
    const [duration, setDuration] = useState<string>('');
    const [elevation, setElevation] = useState<string>('');

    const handleLog = () => {
        if (effort) {
            onLog(
                workout.id, 
                effort, 
                notes,
                distance ? parseFloat(distance) : undefined,
                duration ? parseFloat(duration) : undefined,
                elevation ? parseInt(elevation, 10) : undefined
            );
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg animate-fade-in-up">
                <div className="p-6 sm:p-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-amber-950 dark:text-slate-100">¡Gran Trabajo!</h2>
                        <p className="text-sm text-amber-700 mt-1 dark:text-slate-400">Has completado: <span className="font-semibold">{workout.type}</span></p>
                    </div>
                    
                    <div className="mt-6 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-amber-800 dark:text-slate-300 text-center mb-3">¿Cómo te sentiste?</label>
                            <fieldset className="grid grid-cols-3 gap-3">
                                <legend className="sr-only">Selecciona el esfuerzo percibido</legend>
                                {effortOptions.map(option => (
                                    <div key={option.value}>
                                        <input 
                                            type="radio" 
                                            name="effort-rating" 
                                            id={option.value} 
                                            value={option.value}
                                            checked={effort === option.value}
                                            onChange={() => setEffort(option.value)}
                                            className="sr-only peer"
                                        />
                                        <label 
                                            htmlFor={option.value} 
                                            className={`flex flex-col items-center justify-center p-4 text-center rounded-xl border-2 cursor-pointer transition-all peer-checked:ring-2 peer-checked:ring-offset-1 peer-checked:ring-amber-500 dark:peer-checked:ring-offset-slate-800 ${option.colors}`}
                                        >
                                            <span className="text-3xl">{option.emoji}</span>
                                            <span className="text-sm font-semibold mt-1 text-slate-800 dark:text-slate-200">{option.label}</span>
                                        </label>
                                    </div>
                                ))}
                           </fieldset>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-amber-800 dark:text-slate-300 mb-2">
                                Métricas (opcional)
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label htmlFor="distance" className="block text-xs font-medium text-amber-700 dark:text-slate-400 mb-1">Distancia (km)</label>
                                    <input
                                        type="number"
                                        id="distance"
                                        value={distance}
                                        onChange={(e) => setDistance(e.target.value)}
                                        className="block w-full px-3 py-2 text-sm text-amber-950 bg-white/75 border border-amber-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        placeholder="10.5"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="duration" className="block text-xs font-medium text-amber-700 dark:text-slate-400 mb-1">Duración (min)</label>
                                    <input
                                        type="number"
                                        id="duration"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        className="block w-full px-3 py-2 text-sm text-amber-950 bg-white/75 border border-amber-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        placeholder="60"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="elevation" className="block text-xs font-medium text-amber-700 dark:text-slate-400 mb-1">Elevación (m)</label>
                                    <input
                                        type="number"
                                        id="elevation"
                                        value={elevation}
                                        onChange={(e) => setElevation(e.target.value)}
                                        className="block w-full px-3 py-2 text-sm text-amber-950 bg-white/75 border border-amber-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        placeholder="250"
                                    />
                                </div>
                            </div>
                        </div>
                         <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-amber-800 dark:text-slate-300 mb-1">
                                Añadir notas (opcional)
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                rows={2}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="block w-full px-4 py-2.5 text-amber-950 bg-white/75 border border-amber-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                placeholder="Ej: Me sentí fuerte en las subidas, la rodilla no molestó."
                            />
                        </div>
                    </div>
                </div>

                <div className="px-6 pb-6 mt-4 flex flex-col sm:flex-row-reverse gap-3">
                    <button
                        onClick={handleLog}
                        disabled={!effort}
                        className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2.5 bg-amber-600 text-base font-medium text-white hover:bg-amber-700 sm:text-sm disabled:bg-amber-400 disabled:cursor-not-allowed dark:bg-amber-500 dark:hover:bg-amber-600"
                    >
                        Guardar Entrenamiento
                    </button>
                    <button
                        onClick={onClose}
                        type="button"
                        className="w-full inline-flex justify-center rounded-xl border border-amber-300 shadow-sm px-4 py-2.5 bg-white text-base font-medium text-amber-800 hover:bg-amber-50 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-600"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogWorkoutModal;