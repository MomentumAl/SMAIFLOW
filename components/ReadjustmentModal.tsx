import React, { useState } from 'react';
import { ReadjustmentFeedback } from '../types';

interface Props {
  onClose: () => void;
  onConfirm: (feedback: ReadjustmentFeedback) => void;
}

const READJUSTMENT_REASONS = [
    'La semana fue muy difícil',
    'La semana fue muy fácil',
    'Estoy lesionado/a',
    'Me salté varios entrenamientos',
    'Mis objetivos han cambiado',
    'Otro motivo',
];

const ReadjustmentModal: React.FC<Props> = ({ onClose, onConfirm }) => {
    const [selectedReason, setSelectedReason] = useState<string>('');
    const [details, setDetails] = useState('');

    const handleConfirm = () => {
        if (selectedReason) {
            onConfirm({ reason: selectedReason, details });
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg animate-fade-in-up">
                <div className="p-6 sm:p-8">
                    <div className="flex items-start justify-between">
                        <div className="text-center w-full">
                            <h2 className="text-2xl font-bold text-amber-950 dark:text-slate-100">Reajustar tu Plan</h2>
                            <p className="text-sm text-amber-700 mt-1 dark:text-slate-400">Ayuda a la IA a entender qué necesitas cambiar.</p>
                        </div>
                        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 text-amber-400 hover:text-amber-600 rounded-full hover:bg-amber-100 transition-colors dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    
                    <div className="mt-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-amber-800 dark:text-slate-300 mb-2">¿Cuál es el motivo principal?</label>
                            <div className="flex flex-wrap gap-2">
                                {READJUSTMENT_REASONS.map(reason => (
                                    <button 
                                        key={reason}
                                        onClick={() => setSelectedReason(reason)}
                                        className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${selectedReason === reason ? 'bg-amber-600 text-white border-amber-600 dark:bg-amber-500 dark:border-amber-500' : 'bg-white text-amber-800 border-amber-300 hover:bg-amber-50 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600'}`}
                                    >
                                        {reason}
                                    </button>
                                ))}
                            </div>
                        </div>
                         <div>
                            <label htmlFor="details" className="block text-sm font-medium text-amber-800 dark:text-slate-300 mb-1">
                                Detalles adicionales (opcional)
                            </label>
                            <textarea
                                id="details"
                                name="details"
                                rows={3}
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                className="block w-full px-4 py-2.5 text-amber-950 bg-white/75 border border-amber-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                placeholder="Ej: Me duele la rodilla derecha al correr, necesito enfocarme más en ciclismo esta semana."
                            />
                        </div>
                    </div>
                </div>

                <div className="px-6 pb-6 mt-4 flex flex-col sm:flex-row-reverse gap-3">
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedReason}
                        className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2.5 bg-amber-600 text-base font-medium text-white hover:bg-amber-700 sm:text-sm disabled:bg-amber-400 disabled:cursor-not-allowed dark:bg-amber-500 dark:hover:bg-amber-600"
                    >
                        Confirmar y Continuar
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

export default ReadjustmentModal;