'use client';

import { useState, useRef, useEffect } from 'react';
import { DatePickerProps } from '@/app/types';

const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const DAYS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

function generateYearOptions(minYear: number, maxYear: number): number[] {
  const years: number[] = [];
  for (let y = maxYear; y >= minYear; y--) {
    years.push(y);
  }
  return years;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export default function DatePicker({ value, onChange, maxDate, minDate }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(value?.getFullYear() || new Date().getFullYear() - 25);
  const [viewMonth, setViewMonth] = useState(value?.getMonth() || 0);
  const containerRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const maxDateValue = maxDate || today;
  const minDateValue = minDate || new Date(1900, 0, 1);

  const minYear = minDateValue.getFullYear();
  const maxYear = maxDateValue.getFullYear();
  const years = generateYearOptions(minYear, maxYear);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(viewYear, viewMonth, day);
    if (selectedDate <= maxDateValue && selectedDate >= minDateValue) {
      onChange(selectedDate);
      setIsOpen(false);
    }
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      if (viewYear > minYear) {
        setViewYear(viewYear - 1);
        setViewMonth(11);
      }
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      if (viewYear < maxYear) {
        setViewYear(viewYear + 1);
        setViewMonth(0);
      }
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const days: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  const isDateDisabled = (day: number): boolean => {
    const date = new Date(viewYear, viewMonth, day);
    return date > maxDateValue || date < minDateValue;
  };

  const isSelectedDate = (day: number): boolean => {
    if (!value) return false;
    return (
      value.getDate() === day &&
      value.getMonth() === viewMonth &&
      value.getFullYear() === viewYear
    );
  };

  const formatDisplayDate = (date: Date | null): string => {
    if (!date) return 'Selecciona tu fecha de nacimiento';
    return `${date.getDate()} de ${MONTHS[date.getMonth()]} de ${date.getFullYear()}`;
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3
                   bg-white dark:bg-zinc-800 rounded-xl
                   border-2 border-zinc-200 dark:border-zinc-700
                   hover:border-[#ff5252] dark:hover:border-[#ff5252]
                   focus:outline-none focus:border-[#ff5252] focus:ring-2 focus:ring-[#ff5252]/20
                   transition-all cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎂</span>
          <span
            className={`text-left ${value ? 'text-foreground font-medium' : 'text-zinc-400'}`}
          >
            {formatDisplayDate(value)}
          </span>
        </div>
        <span
          className={`transform transition-transform text-zinc-400 ${isOpen ? 'rotate-180' : ''}`}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute z-50 mt-2 w-full p-4
                     bg-white dark:bg-zinc-800 rounded-xl shadow-2xl
                     border border-zinc-200 dark:border-zinc-700"
        >
          {/* Header con navegacion */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
            >
              ◀
            </button>

            <div className="flex items-center gap-2">
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(parseInt(e.target.value))}
                className="px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-700
                           text-foreground font-medium cursor-pointer
                           border-none focus:outline-none focus:ring-2 focus:ring-[#ff5252]"
              >
                {MONTHS.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>

              <select
                value={viewYear}
                onChange={(e) => setViewYear(parseInt(e.target.value))}
                className="px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-700
                           text-foreground font-medium cursor-pointer
                           border-none focus:outline-none focus:ring-2 focus:ring-[#ff5252]"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
            >
              ▶
            </button>
          </div>

          {/* Dias de la semana */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-zinc-500 dark:text-zinc-400 py-1"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendario */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <div key={index} className="aspect-square">
                {day !== null && (
                  <button
                    onClick={() => handleDateSelect(day)}
                    disabled={isDateDisabled(day)}
                    className={`w-full h-full flex items-center justify-center rounded-lg
                               text-sm font-medium transition-all
                               ${
                                 isSelectedDate(day)
                                   ? 'bg-[#ff5252] text-white'
                                   : isDateDisabled(day)
                                     ? 'text-zinc-300 dark:text-zinc-600 cursor-not-allowed'
                                     : 'hover:bg-zinc-100 dark:hover:bg-zinc-700 text-foreground'
                               }`}
                  >
                    {day}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Acciones rapidas */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <button
              onClick={() => {
                onChange(null);
                setIsOpen(false);
              }}
              className="flex-1 py-2 px-3 text-sm rounded-lg
                         bg-zinc-100 dark:bg-zinc-700 text-foreground
                         hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
            >
              Limpiar
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 py-2 px-3 text-sm rounded-lg
                         bg-[#ff5252] text-white
                         hover:bg-[#ff3333] transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
