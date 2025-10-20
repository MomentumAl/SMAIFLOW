import React from 'react';
import { InfoIcon } from './IconComponents';

interface Props {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmationModal: React.FC<Props> = ({ title, message, confirmText, cancelText, onConfirm, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8 text-center">
            <div className="mx-auto w-12 h-12 flex items-center justify-center bg-amber-100 dark:bg-slate-700 rounded-full">
                <InfoIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-amber-950 dark:text-slate-100">{title}</h3>
            <p className="mt-2 text-sm text-amber-800 dark:text-slate-300">
                {message}
            </p>
        </div>
        <div className="px-6 pb-6 flex flex-col sm:flex-row-reverse gap-3">
             <button
                onClick={onConfirm}
                type="button"
                className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2.5 bg-amber-600 text-base font-medium text-white hover:bg-amber-700 sm:text-sm dark:bg-amber-500 dark:hover:bg-amber-600"
            >
                {confirmText}
            </button>
            <button
                onClick={onClose}
                type="button"
                className="w-full inline-flex justify-center rounded-xl border border-amber-300 shadow-sm px-4 py-2.5 bg-white text-base font-medium text-amber-800 hover:bg-amber-50 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-600"
            >
                {cancelText}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;