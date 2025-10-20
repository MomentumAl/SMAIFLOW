import React from 'react';

interface Props {
  onClose: () => void;
}

const FeedbackModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl animate-fade-in-up h-[90vh] max-h-[800px] flex flex-col border border-amber-200 dark:border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-amber-200 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-start justify-between">
            <h2 className="text-xl font-bold text-amber-900 dark:text-amber-200">Danos tu Feedback</h2>
            <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex-grow overflow-hidden bg-transparent rounded-b-2xl">
          <iframe
            src="https://tally.so/embed/wdBlQq?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
            className="w-full h-full border-0"
            title="Feedback Form"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;