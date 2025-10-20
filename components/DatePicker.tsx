import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from './IconComponents';

interface Props {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
  onClose: () => void;
  minDate?: string; // YYYY-MM-DD
}

const DatePicker: React.FC<Props> = ({ selectedDate, onSelectDate, onClose, minDate }) => {
  const getInitialDate = () => {
    const date = selectedDate ? new Date(selectedDate + 'T00:00:00') : new Date();
    date.setDate(1);
    return date;
  };
  const [displayDate, setDisplayDate] = useState(getInitialDate);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handlePrevMonth = () => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth() + 1;
    const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onSelectDate(dateString);
  };
  
  const generateGrid = () => {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Lunes=0
    const daysInMonth = lastDayOfMonth.getDate();
    
    const minDateTime = minDate ? new Date(minDate + 'T00:00:00').getTime() : 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();

    const selectedDateTime = selectedDate ? new Date(selectedDate + 'T00:00:00').getTime() : 0;

    const grid = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek; i > 0; i--) {
        grid.push({ day: prevMonthLastDay - i + 1, isCurrentMonth: false, isDisabled: true, isSelected: false, isToday: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month, day);
        const currentTime = currentDate.getTime();
        const isDisabled = minDateTime ? currentTime < minDateTime : false;
        const isSelected = currentTime === selectedDateTime;
        const isToday = currentTime === todayTime;
        grid.push({ day, isCurrentMonth: true, isDisabled, isSelected, isToday });
    }
    
    const remainingCells = 42 - grid.length;
    for (let i = 1; i <= remainingCells; i++) {
        grid.push({ day: i, isCurrentMonth: false, isDisabled: true, isSelected: false, isToday: false });
    }

    return grid;
  };

  const grid = generateGrid();
  const weekDays = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

  return (
    <div ref={pickerRef} className="absolute top-full mt-2 z-20 w-80 bg-white dark:bg-slate-900 border border-amber-300 dark:border-slate-600 rounded-xl shadow-lg p-4 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
            <button type="button" onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-amber-100 dark:hover:bg-slate-700 transition-colors">
                <ArrowLeftIcon className="h-5 w-5 text-amber-700 dark:text-slate-300" />
            </button>
            <h3 className="font-semibold text-amber-900 dark:text-slate-100">
                {displayDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase())}
            </h3>
            <button type="button" onClick={handleNextMonth} className="p-2 rounded-full hover:bg-amber-100 dark:hover:bg-slate-700 transition-colors">
                <ArrowRightIcon className="h-5 w-5 text-amber-700 dark:text-slate-300" />
            </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-amber-700 dark:text-slate-400 mb-2">
            {weekDays.map(day => <div key={day} className="py-1">{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
            {grid.map((cell, index) => {
                let classes = 'w-10 h-10 flex items-center justify-center rounded-full text-sm transition-colors ';
                if (!cell.isCurrentMonth) {
                    classes += 'text-slate-300 dark:text-slate-600';
                } else if (cell.isDisabled) {
                    classes += 'text-slate-400 dark:text-slate-500 cursor-not-allowed line-through';
                } else {
                    classes += 'cursor-pointer ';
                    if (cell.isSelected) {
                        classes += 'bg-amber-600 text-white font-bold';
                    } else if (cell.isToday) {
                        classes += 'bg-amber-100 text-amber-800 dark:bg-slate-700 dark:text-amber-300 font-semibold';
                    } else {
                        classes += 'hover:bg-amber-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200';
                    }
                }
                return (
                    <div
                        key={index}
                        onClick={() => !cell.isDisabled && cell.isCurrentMonth && handleDateClick(cell.day)}
                        className={classes}
                    >
                        {cell.day}
                    </div>
                )
            })}
        </div>
    </div>
  );
};

export default DatePicker;