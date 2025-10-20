import React, { useState } from 'react';
import { UserData, Sport } from '../types';
import DatePicker from './DatePicker';
import { CalendarIcon } from './IconComponents';

interface Props {
  data: UserData;
  onDataChange: (data: Partial<UserData>) => void;
  errors: { [key: string]: string };
  sports: Sport[];
}

const Step3Fitness: React.FC<Props> = ({ data, onDataChange, errors, sports }) => {
  const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
  const [isRaceDatePickerOpen, setIsRaceDatePickerOpen] = useState(false);

  const handleDaysChange = (days: number) => {
    onDataChange({ trainingDays: days });
  };

  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const sportNames = sports.map(sport => ({
      running: 'Running',
      natacion: 'Natación',
      ciclismo: 'Ciclismo'
  }[sport])).join(', ');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">🗓️ Condición y Disponibilidad <span className="text-amber-700 dark:text-amber-300 font-semibold">({sportNames})</span></h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Información final para ajustar tu plan a la perfección.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          <label htmlFor="planStartDate" className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">Fecha de Inicio del Plan</label>
          <button
            type="button"
            id="planStartDate"
            onClick={() => setIsStartDatePickerOpen(!isStartDatePickerOpen)}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-left bg-white border border-amber-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm ${data.planStartDate ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500'}`}
          >
            <span>
              {data.planStartDate ? formatDateForDisplay(data.planStartDate) : 'dd/mm/aaaa'}
            </span>
            <CalendarIcon className="h-5 w-5 text-amber-600" />
          </button>
          {isStartDatePickerOpen && (
            <DatePicker 
              selectedDate={data.planStartDate || getTodayString()}
              onSelectDate={(date) => {
                onDataChange({ planStartDate: date });
                setIsStartDatePickerOpen(false);
              }}
              onClose={() => setIsStartDatePickerOpen(false)}
              minDate={getTodayString()}
            />
          )}
        </div>
        
        <div className="relative">
          <label htmlFor="raceDate" className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">Fecha de Competición Objetivo</label>
           <button
            type="button"
            id="raceDate"
            onClick={() => setIsRaceDatePickerOpen(!isRaceDatePickerOpen)}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-left bg-white border rounded-xl shadow-sm focus:outline-none focus:ring-2 sm:text-sm ${errors.raceDate ? 'border-red-500 focus:ring-red-500' : 'border-amber-300 focus:ring-amber-500'} ${data.raceDate ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500'}`}
            aria-invalid={!!errors.raceDate}
            aria-describedby="raceDate-error"
          >
            <span>
              {data.raceDate ? formatDateForDisplay(data.raceDate) : 'dd/mm/aaaa'}
            </span>
            <CalendarIcon className="h-5 w-5 text-amber-600" />
          </button>
           {isRaceDatePickerOpen && (
            <DatePicker 
              selectedDate={data.raceDate || data.planStartDate || getTodayString()}
              onSelectDate={(date) => {
                onDataChange({ raceDate: date });
                setIsRaceDatePickerOpen(false);
              }}
              onClose={() => setIsRaceDatePickerOpen(false)}
              minDate={data.planStartDate || getTodayString()}
            />
          )}
           {errors.raceDate && <p id="raceDate-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.raceDate}</p>}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">¿Cuántos días por semana puedes entrenar?</label>
        <div className="mt-2 grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[2, 3, 4, 5, 6, 7].map(day => (
            <button
              key={day}
              type="button"
              onClick={() => handleDaysChange(day)}
              className={`px-3 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                data.trainingDays === day 
                ? 'bg-amber-600 text-white shadow-md dark:bg-amber-500' 
                : 'bg-amber-50 text-slate-700 border border-amber-200 hover:bg-amber-100 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
        {errors.trainingDays && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.trainingDays}</p>}
      </div>

      <div>
        <label className="relative inline-flex items-start cursor-pointer">
          <input
            type="checkbox"
            name="allowDoubleDays"
            checked={data.allowDoubleDays}
            onChange={(e) => onDataChange({ allowDoubleDays: e.target.checked })}
            className="sr-only peer"
          />
           <div className="w-11 h-6 bg-amber-200 rounded-full peer dark:bg-slate-600 peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-amber-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
          <div className="ml-4">
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Incluir entrenamientos a doble jornada (opcional)
            </span>
             <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              La IA podrá programar dos sesiones en un mismo día en fases clave de tu entrenamiento.
            </p>
          </div>
        </label>
      </div>

    </div>
  );
};

export default Step3Fitness;