import React from 'react';
import { UserData, Sport, TimeGoal, TimeGoalUnit } from '../types';
import { EXPERIENCE_LEVELS, RUNNING_DISTANCES, SWIMMING_DISTANCES, CYCLING_DISTANCES, SPORT_NAMES } from '../constants';
import { InfoIcon } from './IconComponents';

interface Props {
  data: UserData;
  onDataChange: (data: Partial<UserData>) => void;
  errors: { [key: string]: string };
  sports: Sport[];
  onShowInfo: () => void;
}

const getSportDistances = (sport: Sport): string[] => {
    switch(sport) {
        case 'running': return RUNNING_DISTANCES;
        case 'natacion': return SWIMMING_DISTANCES;
        case 'ciclismo': return CYCLING_DISTANCES;
        default: return [];
    }
};

const timeUnits: TimeGoalUnit[] = ['segundos', 'minutos', 'horas'];

const Step2Experience: React.FC<Props> = ({ data, onDataChange, errors, sports, onShowInfo }) => {

    const handleExperienceChange = (level: 'principiante' | 'intermedio' | 'avanzado' | '') => {
        onDataChange({ experience: level });
    };

    const handleGoalChange = (sport: Sport, value: string) => {
        onDataChange({ goals: { ...data.goals, [sport]: value } });
    };

    const handleGoalTimeChange = (sport: Sport, field: 'value' | 'unit', value: string) => {
        const newGoalTime: TimeGoal = { ...data.goalTimes?.[sport], [field]: value } as TimeGoal;
        onDataChange({ goalTimes: { ...data.goalTimes, [sport]: newGoalTime }});
    };
    
    const handleDistributionChange = (sport: Sport, value: number) => {
        const otherSports = sports.filter(s => s !== sport);
        const remainingValue = 100 - value;
        
        let newDistribution: Partial<Record<Sport, number>> = { [sport]: value };

        if (otherSports.length === 1) {
            newDistribution[otherSports[0]] = remainingValue;
        } else if (otherSports.length > 1) {
            const currentOtherTotal = otherSports.reduce((acc, s) => acc + (data.sportDistribution?.[s] || 0), 0);
            
            if (currentOtherTotal > 0) {
                 otherSports.forEach(s => {
                    const currentProportion = (data.sportDistribution?.[s] || 0) / currentOtherTotal;
                    newDistribution[s] = Math.round(remainingValue * currentProportion);
                });
            } else {
                const equalShare = Math.round(remainingValue / otherSports.length);
                 otherSports.forEach(s => newDistribution[s] = equalShare);
            }
        }
        
        // Ensure total is 100
        const total = Object.values(newDistribution).reduce((acc, val) => typeof val === 'number' ? acc + val : acc, 0);
        if (total !== 100 && otherSports.length > 0) {
            const diff = 100 - total;
            const lastSport = otherSports[otherSports.length - 1];
            newDistribution[lastSport] = (newDistribution[lastSport] || 0) + diff;
        }
        
        onDataChange({ sportDistribution: newDistribution });
    };


    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">🎯 Experiencia y Objetivos</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Cuéntanos sobre tu trayectoria y a dónde quieres llegar.</p>
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                    <span>Tu Nivel de Experiencia General</span>
                     <button 
                        type="button" 
                        onClick={onShowInfo}
                        className="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200"
                        aria-label="Más información sobre los niveles de experiencia"
                    >
                        <InfoIcon className="h-4 w-4" />
                    </button>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {EXPERIENCE_LEVELS.map(level => (
                        <button
                            key={level.id}
                            type="button"
                            onClick={() => handleExperienceChange(level.id)}
                            className={`px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 text-left ${
                                data.experience === level.id 
                                ? 'bg-amber-600 text-white shadow-md dark:bg-amber-500' 
                                : 'bg-amber-50 text-slate-700 border border-amber-200 hover:bg-amber-100 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600'
                            }`}
                        >
                            {level.label}
                        </button>
                    ))}
                </div>
                 {errors.experience && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.experience}</p>}
            </div>

            {sports.map(sport => (
                <div key={sport} className="space-y-4 pt-4 border-t border-amber-200/50 dark:border-slate-700/50">
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">{SPORT_NAMES[sport]}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor={`${sport}-goal`} className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">Evento o Distancia Objetivo</label>
                            <select 
                                id={`${sport}-goal`} 
                                name={`${sport}-goal`} 
                                value={data.goals?.[sport] || ''} 
                                onChange={(e) => handleGoalChange(sport, e.target.value)}
                                className={`block w-full px-3.5 py-2.5 bg-white border rounded-xl shadow-sm focus:outline-none focus:ring-2 sm:text-sm ${data.goals?.[sport] ? 'text-slate-900' : 'text-slate-500'} ${errors[`goal_${sport}`] ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-amber-300 focus:ring-amber-500 focus:border-amber-500'}`}
                                aria-invalid={!!errors[`goal_${sport}`]}
                                aria-describedby={`${sport}-goal-error`}
                            >
                                <option value="">Selecciona tu objetivo...</option>
                                {getSportDistances(sport).map(distance => (
                                    <option key={distance} value={distance}>{distance}</option>
                                ))}
                            </select>
                            {errors[`goal_${sport}`] && <p id={`${sport}-goal-error`} className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`goal_${sport}`]}</p>}
                        </div>
                         <div>
                            <label htmlFor={`${sport}-goalTimeValue`} className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">Meta de Tiempo (Opcional)</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    id={`${sport}-goalTimeValue`} 
                                    name={`${sport}-goalTimeValue`} 
                                    value={data.goalTimes?.[sport]?.value || ''}
                                    onChange={(e) => handleGoalTimeChange(sport, 'value', e.target.value)}
                                    className="block w-full px-4 py-2.5 text-slate-900 bg-white placeholder:text-slate-500 border border-amber-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                    placeholder="Ej: 45"
                                />
                                <select 
                                    id={`${sport}-goalTimeUnit`} 
                                    name={`${sport}-goalTimeUnit`} 
                                    value={data.goalTimes?.[sport]?.unit || 'minutos'}
                                    onChange={(e) => handleGoalTimeChange(sport, 'unit', e.target.value as TimeGoalUnit)}
                                    className="block w-full px-3.5 py-2.5 bg-white text-slate-900 border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-xl shadow-sm"
                                >
                                    {timeUnits.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            
            {sports.length > 1 && (
                <div className="pt-4 border-t border-amber-200/50 dark:border-slate-700/50">
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Distribución del Entrenamiento</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">¿Cómo quieres distribuir tu enfoque entre los deportes? (Total debe ser 100%)</p>
                    <div className="space-y-4">
                        {sports.map(sport => (
                            <div key={`${sport}-dist`}>
                                <label htmlFor={`${sport}-dist-slider`} className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1 flex justify-between">
                                    <span>{SPORT_NAMES[sport]}</span>
                                    <span className="font-bold">{data.sportDistribution?.[sport] || 0}%</span>
                                </label>
                                <input 
                                    type="range"
                                    id={`${sport}-dist-slider`}
                                    min="0"
                                    max="100"
                                    step="5"
                                    value={data.sportDistribution?.[sport] || (100 / sports.length)}
                                    onChange={(e) => handleDistributionChange(sport, parseInt(e.target.value, 10))}
                                    className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600 dark:bg-slate-600 dark:accent-amber-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Step2Experience;