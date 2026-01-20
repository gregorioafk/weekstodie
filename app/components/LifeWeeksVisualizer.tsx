'use client';

import { useLifeWeeks } from '@/app/hooks/useLifeWeeks';
import DatePicker from './DatePicker';
import WeeksGridSimple from './WeeksGridSimple';
import StatsPanel from './StatsPanel';
import LifeConfigPanel from './LifeConfigPanel';

export default function LifeWeeksVisualizer() {
  const {
    birthDate,
    setBirthDate,
    stats,
    gridData,
    lifeConfig,
    stagesConfig,
    setStagesConfig,
    showStages,
    toggleShowStages,
  } = useLifeWeeks();

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Tu Vida en Semanas
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
          Cada cuadrado representa una semana. Visualiza las{' '}
          {(lifeConfig.totalYears * lifeConfig.weeksPerYear).toLocaleString('es-ES')} semanas
          de una vida de {lifeConfig.totalYears} anos.
        </p>
      </header>

      {/* Date Picker */}
      <section className="flex justify-center">
        <DatePicker value={birthDate} onChange={setBirthDate} maxDate={new Date()} />
      </section>

      {/* Config Panel */}
      <section>
        <LifeConfigPanel config={stagesConfig} onChange={setStagesConfig} />
      </section>

      {/* Stats Panel */}
      {stats && (
        <section>
          <StatsPanel stats={stats} />
        </section>
      )}

      {/* View Toggle */}
      <section className="flex justify-center">
        <button
          onClick={toggleShowStages}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                     ${
                       showStages
                         ? 'bg-[#ff5252] text-white'
                         : 'bg-zinc-200 dark:bg-zinc-700 text-foreground'
                     }`}
        >
          <span>{showStages ? '🎨' : '⬛'}</span>
          <span>{showStages ? 'Vista por etapas' : 'Vista simple'}</span>
        </button>
      </section>

      {/* Legend */}
      {showStages ? (
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
      ) : (
        <section className="flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-sm bg-[#ff5252]" />
            <span className="text-zinc-600 dark:text-zinc-400">Semanas vividas</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-sm bg-white border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-900" />
            <span className="text-zinc-600 dark:text-zinc-400">Por vivir</span>
          </div>
        </section>
      )}

      {/* Weeks Grid */}
      <section className="overflow-x-auto pb-4">
        <WeeksGridSimple gridData={gridData} birthDate={birthDate} showStages={showStages} />
      </section>

      {/* Info */}
      <footer className="text-center text-xs text-zinc-400 dark:text-zinc-500">
        Basado en el concepto de &quot;4000 semanas&quot; de Oliver Burkeman
      </footer>
    </div>
  );
}
