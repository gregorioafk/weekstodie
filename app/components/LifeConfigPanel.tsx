'use client';

import { useState } from 'react';
import { LifeConfigPanelProps } from '@/app/types';

interface ConfigField {
  key: keyof LifeConfigPanelProps['config'];
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  icon: string;
}

const configFields: ConfigField[] = [
  {
    key: 'childhoodEndAge',
    label: 'Fin de la ninez',
    min: 0,
    max: 12,
    step: 1,
    unit: 'anos',
    icon: '👶',
  },
  {
    key: 'studyStartAge',
    label: 'Inicio de estudios',
    min: 4,
    max: 10,
    step: 1,
    unit: 'anos',
    icon: '📚',
  },
  {
    key: 'studyEndAge',
    label: 'Fin de estudios',
    min: 16,
    max: 30,
    step: 1,
    unit: 'anos',
    icon: '🎓',
  },
  {
    key: 'workStartAge',
    label: 'Inicio de trabajo',
    min: 16,
    max: 30,
    step: 1,
    unit: 'anos',
    icon: '💼',
  },
  {
    key: 'retirementAge',
    label: 'Edad de jubilacion',
    min: 55,
    max: 75,
    step: 1,
    unit: 'anos',
    icon: '🏖️',
  },
  {
    key: 'hoursWorkPerWeek',
    label: 'Horas de trabajo',
    min: 0,
    max: 80,
    step: 1,
    unit: 'hrs/semana',
    icon: '⏰',
  },
  {
    key: 'hoursCommutePerWeek',
    label: 'Horas en trafico',
    min: 0,
    max: 30,
    step: 1,
    unit: 'hrs/semana',
    icon: '🚗',
  },
  {
    key: 'hoursStudyPerWeek',
    label: 'Horas de estudio',
    min: 0,
    max: 60,
    step: 1,
    unit: 'hrs/semana',
    icon: '📖',
  },
  {
    key: 'hoursSleepPerDay',
    label: 'Horas de sueno',
    min: 4,
    max: 12,
    step: 0.5,
    unit: 'hrs/dia',
    icon: '😴',
  },
];

export default function LifeConfigPanel({ config, onChange }: LifeConfigPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (key: keyof typeof config, value: number) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-center gap-2 w-full py-3 px-4
                   bg-zinc-100 dark:bg-zinc-800 rounded-xl
                   hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors
                   text-foreground font-medium"
      >
        <span>⚙️</span>
        <span>Configurar etapas de vida</span>
        <span
          className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        >
          ▼
        </span>
      </button>

      {isExpanded && (
        <div className="mt-4 p-6 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {configFields.map((field) => (
              <div key={field.key} className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <span>{field.icon}</span>
                  <span>{field.label}</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    value={config[field.key] ?? field.min}
                    onChange={(e) => handleChange(field.key, parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-zinc-300 dark:bg-zinc-700 rounded-lg appearance-none
                               cursor-pointer accent-[#ff5252]"
                  />
                  <div className="flex items-center gap-1 min-w-[80px]">
                    <input
                      type="number"
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      value={config[field.key] ?? field.min}
                      onChange={(e) => handleChange(field.key, parseFloat(e.target.value))}
                      className="w-14 px-2 py-1 text-center text-sm rounded-md
                                 border border-zinc-300 dark:border-zinc-600
                                 bg-white dark:bg-zinc-800 text-foreground
                                 focus:outline-none focus:ring-1 focus:ring-[#ff5252]"
                    />
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {field.unit.split('/')[0]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
