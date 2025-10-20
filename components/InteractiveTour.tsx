import React, { useState, useLayoutEffect, useRef } from 'react';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right' | 'center';

interface TourStep {
  selector?: string;
  title: string;
  content: string;
  position?: TooltipPosition;
}

interface Props {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
}

const InteractiveTour: React.FC<Props> = ({ steps, isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightStyle, setHighlightStyle] = useState({});
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  useLayoutEffect(() => {
    if (!isOpen || !step) return;

    // Helper to find the truly visible element among potential duplicates in responsive layouts.
    const getVisibleElement = (selector: string): HTMLElement | null => {
        const elements = document.querySelectorAll(selector);
        for (let i = 0; i < elements.length; i++) {
            const el = elements[i] as HTMLElement;
            // An element is considered visible if it has a size and its offsetParent is not null.
            if (el.offsetParent !== null && (el.offsetWidth > 0 || el.offsetHeight > 0)) {
                return el;
            }
        }
        return null;
    };

    const targetElement = step.selector ? getVisibleElement(step.selector) : null;
    
    // This function will be called to position the tooltip.
    const calculateAndSetPosition = () => {
      // Handle centered steps or steps with no visible target.
      if (step.position === 'center' || !targetElement || !tooltipRef.current) {
        setHighlightStyle({
             boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
             transition: 'all 0.4s ease-in-out'
        });
        setTooltipStyle({
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 1,
        });
        return;
      }
      
      const rect = targetElement.getBoundingClientRect();
      setHighlightStyle({
        width: rect.width + 10,
        height: rect.height + 10,
        top: rect.top - 5,
        left: rect.left - 5,
        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
        borderRadius: '8px',
        transition: 'all 0.4s ease-in-out'
      });
      
      const { width: tooltipW, height: tooltipH } = tooltipRef.current.getBoundingClientRect();
      const viewportW = window.innerWidth;
      const viewportH = window.innerHeight;
      const margin = 15;

      // Define all possible positions
      const positions = {
        top: { top: rect.top - tooltipH - margin, left: rect.left + rect.width / 2 - tooltipW / 2 },
        bottom: { top: rect.bottom + margin, left: rect.left + rect.width / 2 - tooltipW / 2 },
        left: { top: rect.top + rect.height / 2 - tooltipH / 2, left: rect.left - tooltipW - margin },
        right: { top: rect.top + rect.height / 2 - tooltipH / 2, left: rect.right + margin },
      };

      // Check which positions are valid (fit entirely within the viewport)
      const validPositions: Partial<Record<Exclude<TooltipPosition, 'center'>, {top: number, left: number}>> = {};
      Object.keys(positions).forEach(posKey => {
          const pos = posKey as Exclude<TooltipPosition, 'center'>;
          let { top, left } = positions[pos];
          
          // Adjust horizontal position for top/bottom to prevent overflow
          if (pos === 'top' || pos === 'bottom') {
              if (left < margin) left = margin;
              if (left + tooltipW > viewportW - margin) left = viewportW - tooltipW - margin;
          }
           // Adjust vertical position for left/right to prevent overflow
          if (pos === 'left' || pos === 'right') {
              if (top < margin) top = margin;
              if (top + tooltipH > viewportH - margin) top = viewportH - tooltipH - margin;
          }

          if (
              top >= margin &&
              left >= margin &&
              top + tooltipH <= viewportH - margin &&
              left + tooltipW <= viewportW - margin
          ) {
              validPositions[pos] = { top, left };
          }
      });
      
      let finalPosition: {top: number, left: number} | null = null;
      
      // Smartly determine the best position order.
      const isTargetLow = rect.top > viewportH / 2;
      const defaultOrder: Exclude<TooltipPosition, 'center'>[] = isTargetLow ? ['top', 'left', 'right', 'bottom'] : ['bottom', 'top', 'left', 'right'];

      // Build the position order, starting with the preferred position if it's valid, then defaults.
      const positionOrder: Exclude<TooltipPosition, 'center'>[] = [];
      // FIX: The check for 'center' is redundant here because of the early return at the start of the function.
      if (step.position) {
        positionOrder.push(step.position);
      }
      for (const pos of defaultOrder) {
          if (!positionOrder.includes(pos)) {
              positionOrder.push(pos);
          }
      }

      // Find the first valid position from the prioritized list.
      for (const pos of positionOrder) {
          if (validPositions[pos]) {
              finalPosition = validPositions[pos]!;
              break;
          }
      }

      // If no position is perfectly valid (e.g., small screen), use the preferred one and clamp it.
      if (!finalPosition) {
          const preferredPosCoords = positions[positionOrder[0]];
          let { top, left } = preferredPosCoords;
          if (left < margin) left = margin;
          if (left + tooltipW > viewportW - margin) left = viewportW - tooltipW - margin;
          if (top < margin) top = margin;
          if (top + tooltipH > viewportH - margin) top = viewportH - tooltipH - margin;
          finalPosition = { top, left };
      }

      setTooltipStyle({
          opacity: 1,
          top: `${finalPosition.top}px`,
          left: `${finalPosition.left}px`,
          transform: '',
      });
    };

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }

    // Delay calculation to allow for scrolling animation to finish.
    const timeoutId = setTimeout(calculateAndSetPosition, 300);
    window.addEventListener('resize', calculateAndSetPosition);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', calculateAndSetPosition);
    };
  }, [currentStep, isOpen, step]);

  const handleNext = () => {
    if (!isLastStep) {
      setTooltipStyle({ opacity: 0 }); // Hide while transitioning
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setTooltipStyle({ opacity: 0 }); // Hide while transitioning
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    onClose();
  };

  if (!isOpen || !step) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="absolute pointer-events-none"
        style={highlightStyle}
      ></div>
      <div 
        ref={tooltipRef}
        className="absolute z-[51] bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-80 p-5"
        style={{ ...tooltipStyle, transition: 'opacity 0.2s ease-in-out, top 0.4s ease-in-out, left 0.4s ease-in-out' }}
      >
        <h3 className="text-lg font-bold text-amber-900 dark:text-amber-300">{step.title}</h3>
        <p className="mt-2 text-sm text-amber-800 dark:text-slate-300">{step.content}</p>
        
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {currentStep + 1} / {steps.length}
          </div>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <button onClick={handlePrev} className="px-3 py-1.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">
                Anterior
              </button>
            )}
            <button onClick={handleNext} className="px-3 py-1.5 text-sm font-semibold text-white bg-amber-600 rounded-md hover:bg-amber-700">
              {isLastStep ? 'Finalizar' : 'Siguiente'}
            </button>
          </div>
        </div>
        
        <button onClick={handleClose} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
};

export default InteractiveTour;
