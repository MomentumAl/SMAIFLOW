import React from 'react';
import { SmaiFlowLogoWide } from './IconComponents';

const Header: React.FC = () => {
  return (
    <header className="bg-amber-100/80 backdrop-blur-lg shadow-sm border-b border-amber-300/40 sticky top-0 z-40 dark:bg-slate-900/80 dark:border-slate-700/60">
      <div className="container mx-auto px-4 py-3 flex items-center">
        <SmaiFlowLogoWide className="h-8 w-auto" />
        <span className="text-sm font-medium text-amber-800 ml-3 hidden sm:inline dark:text-slate-400">Predict Your Greatness</span>
      </div>
    </header>
  );
};

export default Header;