import React from 'react';
import { SmaiFlowIcon } from './IconComponents';

interface Props {
  onShowFeedback: () => void;
  onShowPricing: () => void;
  onShowLegal: (type: 'terms' | 'privacy') => void;
}

const Footer: React.FC<Props> = ({ onShowFeedback, onShowPricing, onShowLegal }) => {
  return (
    <footer className="w-full py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <div className="bg-slate-100/50 backdrop-blur-sm rounded-2xl py-4 px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <SmaiFlowIcon className="w-7 h-7" />
            <p className="text-xs text-slate-600">
              &copy; {new Date().getFullYear()} SmaiFlow.
            </p>
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <button onClick={onShowPricing} className="text-xs text-slate-600 hover:text-amber-700 transition-colors">
              Planes de Precios
            </button>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <button onClick={onShowFeedback} className="text-xs text-slate-600 hover:text-amber-700 transition-colors">
              Feedback
            </button>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <button onClick={() => onShowLegal('terms')} className="text-xs text-slate-600 hover:text-amber-700 transition-colors">
              Términos de Servicio
            </button>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <button onClick={() => onShowLegal('privacy')} className="text-xs text-slate-600 hover:text-amber-700 transition-colors">
              Política de Privacidad
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;