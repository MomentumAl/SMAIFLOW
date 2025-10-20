import React from 'react';
import { AppView } from '../types';
import { HomeIcon, CalendarIcon, BarChartIcon, StarIcon, UserIcon, SmaiFlowIcon } from './IconComponents';

interface Props {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
}

const navItems: { view: AppView; label: string; icon: React.ReactElement<{ className?: string }>; tourId?: string; }[] = [
  { view: 'Hoy', label: 'Hoy', icon: <HomeIcon />, tourId: 'today-view-nav' },
  { view: 'Semana', label: 'Semana', icon: <CalendarIcon />, tourId: 'week-view-nav' },
  { view: 'Calendario', label: 'Calendario', icon: <CalendarIcon /> },
  { view: 'Estadísticas', label: 'Estadísticas', icon: <BarChartIcon /> },
  { view: 'Logros', label: 'Logros', icon: <StarIcon /> },
  { view: 'Perfil', label: 'Perfil', icon: <UserIcon />, tourId: 'profile-view-nav' },
];

const BottomNavBar: React.FC<Props> = ({ activeView, setActiveView }) => {
  return (
    <>
      {/* Mobile: Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-50/80 backdrop-blur-lg border-t border-slate-300/40 shadow-t-lg z-40 dark:bg-slate-900/80 dark:border-slate-700/40">
        <div className="container mx-auto px-2">
          <div className="flex justify-around">
            {navItems.map(({ view, label, icon, tourId }) => {
              const isActive = activeView === view;
              const classes = isActive 
                  ? 'text-amber-600' 
                  : 'text-slate-600 hover:text-amber-500 dark:text-slate-400 dark:hover:text-amber-400';

              return (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`flex flex-col items-center justify-center text-center w-16 h-16 pt-2 pb-1 transition-colors duration-200 ${classes}`}
                  aria-current={isActive ? 'page' : undefined}
                  data-tour-id={tourId}
                >
                  {React.cloneElement(icon, { className: 'h-6 w-6 mb-1' })}
                  <span className="text-xs font-medium">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Desktop: Side Bar */}
      <nav className="hidden md:flex flex-col items-center fixed top-0 left-0 h-full w-24 bg-slate-50/80 backdrop-blur-lg border-r border-slate-300/40 shadow-lg z-40 py-6 dark:bg-slate-900/80 dark:border-slate-700/40">
        <div className="mb-8">
          <a href="#" aria-label="Página de inicio de SmaiFlow">
            <SmaiFlowIcon className="w-8 h-8" />
          </a>
        </div>
        <div className="flex flex-col items-center gap-4 w-full px-2">
          {navItems.map(({ view, label, icon, tourId }) => {
            const isActive = activeView === view;
            const itemClasses = `flex flex-col items-center justify-center text-center w-20 h-20 rounded-xl transition-colors duration-200 relative ${
              isActive ? 'bg-amber-100 text-amber-700 dark:bg-slate-800 dark:text-amber-400' : 'text-slate-600 hover:bg-slate-200/60 hover:text-amber-600 dark:text-slate-400 dark:hover:bg-slate-700/60 dark:hover:text-amber-400'
            }`;

            return (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={itemClasses}
                aria-current={isActive ? 'page' : undefined}
                title={label}
                data-tour-id={tourId}
              >
                {isActive && <div className="absolute left-0 top-0 h-full w-1 bg-amber-600 dark:bg-amber-500 rounded-r-full"></div>}
                {React.cloneElement(icon, { className: 'h-7 w-7 mb-1' })}
                <span className="text-xs font-semibold">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default BottomNavBar;