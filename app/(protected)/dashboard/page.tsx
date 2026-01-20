'use client';

import { useState, useMemo, useEffect } from 'react';
import DatePicker from '@/app/components/DatePicker';
import WeeksGridCanvas from '@/app/components/WeeksGridCanvas';
import StatsPanel from '@/app/components/StatsPanel';
import LifeConfigPanel from '@/app/components/LifeConfigPanel';
import {
  calculateLifeStats,
  generateGridData,
  DEFAULT_CONFIG,
  DEFAULT_STAGES_CONFIG,
} from '@/app/lib/weekCalculations';
import { LifeStagesConfig } from '@/app/types';

export default function DashboardPage() {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [stagesConfig, setStagesConfig] = useState<LifeStagesConfig>(DEFAULT_STAGES_CONFIG);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos de localStorage al montar
  useEffect(() => {
    const savedBirthDate = localStorage.getItem('weekstodie_birthdate');
    const savedConfig = localStorage.getItem('weekstodie_config');

    if (savedBirthDate) {
      setBirthDate(new Date(savedBirthDate));
    }
    if (savedConfig) {
      setStagesConfig(JSON.parse(savedConfig));
    }
    setIsLoading(false);
  }, []);

  const stats = useMemo(() => {
    if (!birthDate) return null;
    return calculateLifeStats(birthDate, DEFAULT_CONFIG, stagesConfig);
  }, [birthDate, stagesConfig]);

  const gridData = useMemo(() => {
    return generateGridData(birthDate, DEFAULT_CONFIG, stagesConfig);
  }, [birthDate, stagesConfig]);

  const handleDateChange = (date: Date | null) => {
    setBirthDate(date);
    if (date) {
      localStorage.setItem('weekstodie_birthdate', date.toISOString());
    } else {
      localStorage.removeItem('weekstodie_birthdate');
    }
  };

  const handleConfigChange = (config: LifeStagesConfig) => {
    setStagesConfig(config);
    localStorage.setItem('weekstodie_config', JSON.stringify(config));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-[#ff5252]/30 border-t-[#ff5252] rounded-full animate-spin" />
          <span className="text-zinc-500">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📅</span>
            <span className="font-bold text-foreground">WeeksToDie</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Tu Vida en Semanas</h1>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
              Haz click en cualquier semana para ver detalles
            </p>
          </div>

          {/* Date Picker */}
          <section className="flex justify-center">
            <DatePicker value={birthDate} onChange={handleDateChange} maxDate={new Date()} />
          </section>

          {/* Config Panel */}
          <section>
            <LifeConfigPanel config={stagesConfig} onChange={handleConfigChange} />
          </section>

          {/* Stats Panel */}
          {stats && (
            <section>
              <StatsPanel stats={stats} />
            </section>
          )}

          {/* Legend */}
          <section className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-sm bg-pink-400" />
              <span className="text-zinc-600 dark:text-zinc-400">Ninez</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-sm bg-indigo-400" />
              <span className="text-zinc-600 dark:text-zinc-400">Estudios</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-sm bg-orange-400" />
              <span className="text-zinc-600 dark:text-zinc-400">Trabajo</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-sm bg-teal-400" />
              <span className="text-zinc-600 dark:text-zinc-400">Jubilacion</span>
            </div>
          </section>

          {/* Interactive Grid */}
          <section className="overflow-x-auto pb-4">
            <WeeksGridCanvas
              gridData={gridData}
              birthDate={birthDate}
              showStages={true}
              weeksWithTodos={[]}
            />
          </section>

          {/* Footer */}
          <footer className="text-center text-xs text-zinc-400 dark:text-zinc-500">
            Basado en el concepto de &quot;4000 semanas&quot; de Oliver Burkeman
          </footer>
        </div>
      </main>
    </div>
  );
}
