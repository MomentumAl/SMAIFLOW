import React from 'react';
import { Workout, UserData } from '../types';

interface Props {
  workout: Workout;
  userData: UserData;
  onClose: () => void;
}

const WorkoutDetailModal: React.FC<Props> = ({ workout, onClose }) => {
  
  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
      aria-modal="true" 
      role="dialog"
      onClick={onClose}
    >
      <div 
        className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl animate-fade-in-up max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="p-6 sm:p-8 border-b border-amber-200 dark:border-slate-700">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-amber-950 dark:text-slate-100">{workout.type}</h2>
              <p className="text-sm text-amber-700 dark:text-slate-400 mt-1">{workout.day}, {new Date(workout.date + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</p>
            </div>
            <button onClick={onClose} className="p-1.5 text-amber-400 hover:text-amber-600 rounded-full hover:bg-amber-100 transition-colors dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        
        <div className="p-6 sm:p-8 overflow-y-auto">
          <div className="prose prose-sm prose-amber max-w-none text-amber-800 dark:text-slate-300">
              <h3 className="text-amber-950 dark:text-slate-100 !font-bold">Detalles del Entrenamiento</h3>
              <p className="whitespace-pre-wrap font-sans mt-2">
                {workout.description}
              </p>
          </div>
        </div>
        <div className="p-4 bg-amber-50/60 dark:bg-slate-900/50 border-t border-amber-200 dark:border-slate-700 rounded-b-2xl flex justify-end">
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

export default WorkoutDetailModal;