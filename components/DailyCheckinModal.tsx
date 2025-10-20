import React, { useState } from 'react';
import { DailyCheckInData } from '../types';

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  minLabel: string;
  maxLabel: string;
  emoji: string;
  valueLabel: string;
}

const sliderConfig: Record<keyof DailyCheckInData, {
  label: string;
  emoji: string;
  minLabel: string;
  maxLabel: string;
  valueLabels: string[];
}> = {
  energy: {
    label: "Nivel de Energía",
    emoji: "⚡",
    minLabel: "Sin fuerzas",
    maxLabel: "A tope",
    valueLabels: ["Muy Bajo", "Bajo", "Normal", "Alto", "Excelente"],
  },
  soreness: {
    label: "Dolor Muscular",
    emoji: "💪",
    minLabel: "Sin dolor",
    maxLabel: "Muy adolorido",
    valueLabels: ["Ninguno", "Leve", "Moderado", "Alto", "Extremo"],
  },
  sleep: {
    label: "Calidad de Sueño",
    emoji: "😴",
    minLabel: "No descansé",
    maxLabel: "Reparador",
    valueLabels: ["Muy Mala", "Mala", "Regular", "Buena", "Excelente"],
  },
  stress: {
    label: "Nivel de Estrés",
    emoji: "🧠",
    minLabel: "Relajado",
    maxLabel: "Abrumado",
    valueLabels: ["Ninguno", "Bajo", "Moderado", "Alto", "Muy Alto"],
  },
  motivation: {
    label: "Motivación",
    emoji: "🎯",
    minLabel: "Sin ganas",
    maxLabel: "Imparable",
    valueLabels: ["Muy Baja", "Baja", "Normal", "Alta", "Máxima"],
  },
};

const CheckinSlider: React.FC<SliderProps> = ({ label, value, onChange, minLabel, maxLabel, emoji, valueLabel }) => {
    const percentage = ((value - 1) / 4) * 100;
    return (
        <div>
             <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-semibold text-amber-900 dark:text-slate-100">{emoji} {label}</label>
                <span className="text-sm font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-slate-700 px-2 py-0.5 rounded-md">{valueLabel}</span>
            </div>
            <div className="relative pt-5 px-3">
                <div className="absolute top-0" style={{ left: `calc(${percentage}% + ${(50 - percentage) * 0.12}px)` }}>
                    <div className="w-6 h-6 bg-amber-600 border-2 border-white dark:border-slate-800 rounded-full flex items-center justify-center text-white text-xs font-bold shadow transform -translate-x-1/2">
                        {value}
                    </div>
                </div>
                <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600 dark:bg-slate-600 dark:accent-amber-500"
                />
            </div>
            <div className="flex justify-between text-xs text-amber-700 dark:text-slate-400 mt-2 px-1">
                <span>{minLabel}</span>
                <span>{maxLabel}</span>
            </div>
        </div>
    );
}

const DailyCheckinModal: React.FC<{
  onClose: () => void;
  onSubmit: (data: DailyCheckInData) => void;
}> = ({ onClose, onSubmit }) => {
  const [checkinData, setCheckinData] = useState<DailyCheckInData>({
    energy: 3,
    soreness: 1,
    sleep: 3,
    stress: 1,
    motivation: 3,
  });

  const handleDataChange = (field: keyof DailyCheckInData, value: number) => {
    setCheckinData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(checkinData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div 
        className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg animate-fade-in-up"
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6 sm:p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-amber-950 dark:text-slate-100">Check-in Matutino</h2>
              <p className="text-sm text-amber-700 mt-1 dark:text-slate-400">¿Cómo te sientes hoy? Tu feedback nos ayuda a guiarte mejor.</p>
            </div>
            
            <div className="mt-8 space-y-6">
                {(Object.keys(checkinData) as Array<keyof DailyCheckInData>).map(key => {
                    const config = sliderConfig[key];
                    return (
                         <CheckinSlider 
                            key={key}
                            label={config.label}
                            emoji={config.emoji}
                            value={checkinData[key]}
                            onChange={(v) => handleDataChange(key, v)}
                            minLabel={config.minLabel}
                            maxLabel={config.maxLabel}
                            valueLabel={config.valueLabels[checkinData[key] - 1]}
                        />
                    )
                })}
            </div>
          </div>
          <div className="px-6 pb-6 mt-4">
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-3 bg-amber-600 text-base font-medium text-white hover:bg-amber-700 sm:text-sm"
            >
              Calcular mi Flow Score
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DailyCheckinModal;