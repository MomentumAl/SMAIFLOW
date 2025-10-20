import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { SmaiFlowIcon } from './IconComponents';

interface Props {
  isLoading: boolean;
  insight: string;
  onClose: () => void;
}

const PostWorkoutInsightModal: React.FC<Props> = ({ isLoading, insight, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
      aria-modal="true" 
      role="dialog"
    >
      <div 
        className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md animate-fade-in-up"
      >
        <div className="p-6 sm:p-8 text-center">
            <div className="mx-auto w-12 h-12 flex items-center justify-center bg-amber-100 dark:bg-slate-700 rounded-full mb-4">
                <SmaiFlowIcon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-amber-950 dark:text-slate-100">Análisis del Coach IA</h3>
            
            <div className="mt-4 min-h-[100px] flex items-center justify-center">
                {isLoading ? (
                    <div className="flex flex-col items-center gap-2 text-amber-800 dark:text-slate-300">
                        <LoadingSpinner />
                        <span className="text-sm font-semibold mt-2">Analizando tu rendimiento...</span>
                    </div>
                ) : (
                    <p className="text-base text-amber-800 dark:text-slate-300 italic">
                        "{insight}"
                    </p>
                )}
            </div>
        </div>
        <div className="px-6 pb-6 mt-2">
             <button
                onClick={onClose}
                type="button"
                className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2.5 bg-amber-600 text-base font-medium text-white hover:bg-amber-700 sm:text-sm dark:bg-amber-500 dark:hover:bg-amber-600 disabled:bg-slate-400"
                disabled={isLoading}
            >
                Entendido
            </button>
        </div>
      </div>
    </div>
  );
};

export default PostWorkoutInsightModal;