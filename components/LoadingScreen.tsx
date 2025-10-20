import React, { useState, useEffect } from 'react';
import { Sport } from '../types';
import { GOLDEN_TIPS } from '../constants';
import LoadingSpinner from './LoadingSpinner';

interface Props {
  selectedSports: Sport[];
  planDurationInWeeks: number | null;
}

const LoadingScreen: React.FC<Props> = ({ selectedSports, planDurationInWeeks }) => {
  const [relevantTips, setRelevantTips] = useState<string[]>([]);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  
  // More accurate estimation: 15s base + 20s/week, with a 25% increase for multi-sport plans.
  const estimatedTime = React.useMemo(() => {
    if (!planDurationInWeeks) return 120; // Default time for unknown duration
    
    const baseTime = 15; // Base for API call overhead
    const timePerWeek = 20; // More realistic time per week of plan duration
    const sportMultiplier = selectedSports.length > 1 ? 1.25 : 1; // 25% longer for multi-sport complexity

    const calculatedTime = (baseTime + (planDurationInWeeks * timePerWeek)) * sportMultiplier;
    
    return Math.round(calculatedTime);
  }, [planDurationInWeeks, selectedSports]);

  useEffect(() => {
    setTimeLeft(estimatedTime);

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          clearInterval(timer);
          setProgress(99); // Stop at 99% to manage expectation
          return 0;
        }
        
        const elapsed = estimatedTime - newTime;
        const currentProgress = Math.min(99, Math.floor((elapsed / estimatedTime) * 100));
        setProgress(currentProgress);

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [estimatedTime]);

  useEffect(() => {
    const tips = selectedSports.flatMap(sport => GOLDEN_TIPS[sport] || []);
    const shuffledTips = tips.sort(() => 0.5 - Math.random());
    setRelevantTips(shuffledTips.length > 0 ? shuffledTips : ["Consejo: La consistencia es más importante que la intensidad. ¡Sigue tu plan!"]);
  }, [selectedSports]);

  useEffect(() => {
    if (relevantTips.length <= 1) return;
    const tipsTimer = setInterval(() => {
      setCurrentTipIndex(prevIndex => (prevIndex + 1) % relevantTips.length);
    }, 7000); // Change tip every 7 seconds
    return () => clearInterval(tipsTimer);
  }, [relevantTips]);

  const getLoadingMessage = () => {
    if (!planDurationInWeeks) {
      return "Nuestra IA está diseñando tu plan de entrenamiento personalizado.";
    }
    return `Estamos generando tu plan de ${planDurationInWeeks} semanas. Los planes más largos requieren un análisis más profundo.`;
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center py-12 sm:py-20 bg-amber-100/80 backdrop-blur-md rounded-2xl shadow-lg flex flex-col items-center justify-center min-h-[450px] border border-amber-300/40">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
        <LoadingSpinner />
        <div className="text-left">
          <p className="text-5xl font-extrabold text-amber-950 tracking-tight">{progress}%</p>
          <p className="text-sm font-semibold text-amber-700 mt-1">Tiempo restante: {formatTime(timeLeft)}</p>
        </div>
      </div>
      <h2 className="text-2xl font-bold mt-8 text-amber-900">Analizando tu perfil...</h2>
      <p className="text-amber-800 mt-2 max-w-md mx-auto">
        {getLoadingMessage()}
      </p>
      
      <div className="mt-8 h-24 w-full max-w-xl px-4 flex items-center justify-center">
        {relevantTips.length > 0 && (
          <div key={currentTipIndex} className="animate-fade-in-up">
            <p className="text-lg font-semibold text-amber-900">💡 Consejo de Oro</p>
            <p className="text-amber-800 mt-1 italic">"{relevantTips[currentTipIndex]}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;