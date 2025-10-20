import React, { useState } from 'react';
import { Sport } from '../types';
import { CheckCircleIcon } from './IconComponents';

interface Props {
  onConfirmSelection: (sports: Sport[]) => void;
}

const SportCard: React.FC<{
  sport: Sport;
  emoji: string;
  title: string;
  description: string;
  isSelected: boolean;
  onSelect: (sport: Sport) => void;
}> = ({ sport, emoji, title, description, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(sport)}
      className={`relative bg-amber-100/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border-2 text-center cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-start ${isSelected ? 'border-amber-500 ring-2 ring-amber-500/50' : 'border-amber-300/40'}`}
      role="checkbox"
      aria-checked={isSelected}
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onSelect(sport)}
      aria-label={`Seleccionar ${title}`}
    >
      {isSelected && (
          <div className="absolute top-3 right-3 text-amber-700 bg-white rounded-full">
              <CheckCircleIcon />
          </div>
      )}
      <span className="text-6xl mb-4 bg-gradient-to-br from-amber-400 to-yellow-600 bg-clip-text text-transparent [text-shadow:0_1px_2px_rgba(0,0,0,0.1)]" aria-hidden="true">{emoji}</span>
      <h3 className="text-2xl font-bold text-amber-900">{title}</h3>
      <p className="text-amber-800 mt-2 text-sm max-w-xs mx-auto">{description}</p>
    </div>
  );
};

const SportSelection: React.FC<Props> = ({ onConfirmSelection }) => {
  const [selectedSports, setSelectedSports] = useState<Sport[]>([]);

  const handleToggleSport = (sport: Sport) => {
    setSelectedSports(prev => 
      prev.includes(sport)
        ? prev.filter(s => s !== sport)
        : [...prev, sport]
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in-up">
      <div className="text-center mb-12 bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-amber-300/30">
        <h2 className="text-5xl sm:text-6xl font-extrabold text-amber-50 tracking-tight shadow-black/75 [text-shadow:0_4px_8px_var(--tw-shadow-color)]">Elige tu Disciplina</h2>
        <p className="mt-4 text-xl text-amber-100 max-w-3xl mx-auto [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">Selecciona uno o más deportes para crear tu plan de entrenamiento perfecto.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <SportCard
          sport="ciclismo"
          emoji="🚴"
          title="Ciclismo"
          description="Prepárate para critériums, grandes fondos o carreras de ruta con planes basados en potencia."
          isSelected={selectedSports.includes('ciclismo')}
          onSelect={handleToggleSport}
        />
        <SportCard
          sport="natacion"
          emoji="🏊‍♂️"
          title="Natación"
          description="Mejora tu técnica y resistencia en la piscina o en aguas abiertas. Planes para todos los estilos."
          isSelected={selectedSports.includes('natacion')}
          onSelect={handleToggleSport}
        />
        <SportCard
          sport="running"
          emoji="🏃‍♀️"
          title="Running"
          description="Planes para 5k, maratón, pista y trail. Domina cualquier terreno, desde el asfalto hasta la montaña."
          isSelected={selectedSports.includes('running')}
          onSelect={handleToggleSport}
        />
      </div>
      <div className="mt-12 text-center">
          <button
            onClick={() => onConfirmSelection(selectedSports)}
            disabled={selectedSports.length === 0}
            className="px-10 py-4 text-lg font-semibold text-white bg-amber-600 rounded-xl hover:bg-amber-700 disabled:bg-amber-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Continuar con {selectedSports.length} deporte(s)
          </button>
      </div>
    </div>
  );
};

export default SportSelection;