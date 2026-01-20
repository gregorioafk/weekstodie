'use client';

import { useState } from 'react';
import {
  LifeConfigPanelProps,
  LifeStagesConfigExtended,
  LifeEvent,
  OverlapConfig,
  CustomStage,
} from '@/app/types';
import EventsManager from './EventsManager';
import CustomStagesManager from './CustomStagesManager';

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

type TabType = 'stages' | 'overlap' | 'events' | 'custom';

interface LifeConfigPanelExtendedProps {
  config: LifeStagesConfigExtended;
  onChange: (config: LifeStagesConfigExtended) => void;
  events: LifeEvent[];
  onEventsChange: (events: LifeEvent[]) => void;
  birthDate: Date | null;
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors
                ${
                  active
                    ? 'bg-[#ff5252] text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
    >
      {children}
    </button>
  );
}

function StagesConfigSection({
  config,
  onChange,
}: {
  config: LifeStagesConfigExtended;
  onChange: (config: LifeStagesConfigExtended) => void;
}) {
  const handleChange = (key: keyof typeof config, value: number) => {
    onChange({ ...config, [key]: value });
  };

  return (
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
              value={(config[field.key] as number) ?? field.min}
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
                value={(config[field.key] as number) ?? field.min}
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
  );
}

function OverlapConfigSection({
  config,
  onChange,
}: {
  config: OverlapConfig;
  onChange: (config: OverlapConfig) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
        Permite que diferentes etapas de vida se muestren simultaneamente en el grid.
      </p>

      <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
        <input
          type="checkbox"
          checked={config.allowStudyWorkOverlap}
          onChange={(e) => onChange({ ...config, allowStudyWorkOverlap: e.target.checked })}
          className="w-5 h-5 mt-0.5 rounded accent-[#ff5252]"
        />
        <div>
          <span className="font-medium text-foreground block">
            Permitir estudio + trabajo simultaneo
          </span>
          <p className="text-sm text-zinc-500 mt-1">
            Ejemplo: Estudiar de 18-25 anos mientras trabajas de 20-65. Las semanas con
            sobreposicion se mostraran con celda dividida.
          </p>
        </div>
      </label>

      <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
        <input
          type="checkbox"
          checked={config.allowCustomOverlap}
          onChange={(e) => onChange({ ...config, allowCustomOverlap: e.target.checked })}
          className="w-5 h-5 mt-0.5 rounded accent-[#ff5252]"
        />
        <div>
          <span className="font-medium text-foreground block">
            Etapas custom pueden sobreponerse
          </span>
          <p className="text-sm text-zinc-500 mt-1">
            Las etapas personalizadas (como paternidad) se mostraran sobre las etapas principales.
          </p>
        </div>
      </label>

      {config.allowStudyWorkOverlap && (
        <div className="flex items-center gap-3 p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
          <div className="w-8 h-8 flex items-center justify-center">
            <div className="w-4 h-4 rounded-sm bg-[#a78bfa]" />
          </div>
          <div className="text-sm">
            <span className="font-medium text-purple-700 dark:text-purple-300">
              Nuevo color: Estudio + Trabajo
            </span>
            <p className="text-purple-600 dark:text-purple-400">
              Las semanas con sobreposicion se mostraran en violeta
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Panel simple para compatibilidad con codigo existente
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
        <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
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

// Panel extendido con todas las funcionalidades
export function LifeConfigPanelExtended({
  config,
  onChange,
  events,
  onEventsChange,
  birthDate,
}: LifeConfigPanelExtendedProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('stages');

  const handleOverlapChange = (overlapConfig: OverlapConfig) => {
    onChange({ ...config, overlapConfig });
  };

  const handleCustomStagesChange = (customStages: CustomStage[]) => {
    onChange({ ...config, customStages });
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
        <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isExpanded && (
        <div className="mt-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
          {/* Tabs */}
          <div className="flex gap-2 p-4 border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto">
            <TabButton active={activeTab === 'stages'} onClick={() => setActiveTab('stages')}>
              📊 Etapas
            </TabButton>
            <TabButton active={activeTab === 'overlap'} onClick={() => setActiveTab('overlap')}>
              🔀 Sobreposicion
            </TabButton>
            <TabButton active={activeTab === 'events'} onClick={() => setActiveTab('events')}>
              📌 Eventos ({events.length})
            </TabButton>
            <TabButton active={activeTab === 'custom'} onClick={() => setActiveTab('custom')}>
              ✨ Custom ({config.customStages.length})
            </TabButton>
          </div>

          {/* Tab content */}
          <div className="p-6">
            {activeTab === 'stages' && (
              <StagesConfigSection config={config} onChange={onChange} />
            )}

            {activeTab === 'overlap' && (
              <OverlapConfigSection
                config={config.overlapConfig}
                onChange={handleOverlapChange}
              />
            )}

            {activeTab === 'events' && (
              <EventsManager events={events} onChange={onEventsChange} birthDate={birthDate} />
            )}

            {activeTab === 'custom' && (
              <CustomStagesManager
                stages={config.customStages}
                onChange={handleCustomStagesChange}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
