'use client';

import { StatsPanelProps } from '@/app/types';

interface StatCard {
  label: string;
  value: string;
  color: string;
  bgColor: string;
  icon: string;
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  if (!stats) return null;

  const mainStats: StatCard[] = [
    {
      label: 'Semanas vividas',
      value: stats.weeksLived.toLocaleString('es-ES'),
      color: 'text-[#ff5252]',
      bgColor: 'bg-red-50 dark:bg-red-950/30',
      icon: '⏳',
    },
    {
      label: 'Semanas restantes',
      value: stats.weeksRemaining.toLocaleString('es-ES'),
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
      icon: '🌱',
    },
    {
      label: 'Vida transcurrida',
      value: `${stats.percentageLived.toFixed(1)}%`,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-950/30',
      icon: '📊',
    },
    {
      label: 'Edad actual',
      value: `${stats.currentAge.years}a ${stats.currentAge.months}m`,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      icon: '🎂',
    },
  ];

  const timeStats: StatCard[] = [
    {
      label: 'Trabajando',
      value: stats.timeStats.weeksWorking.toLocaleString('es-ES'),
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950/30',
      icon: '💼',
    },
    {
      label: 'En trafico',
      value: stats.timeStats.weeksInTraffic.toLocaleString('es-ES'),
      color: 'text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-950/30',
      icon: '🚗',
    },
    {
      label: 'Estudiando',
      value: stats.timeStats.weeksStudying.toLocaleString('es-ES'),
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
      icon: '📚',
    },
    {
      label: 'Durmiendo',
      value: stats.timeStats.weeksSleeping.toLocaleString('es-ES'),
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30',
      icon: '😴',
    },
    {
      label: 'Ninez',
      value: stats.timeStats.weeksChildhood.toLocaleString('es-ES'),
      color: 'text-pink-500',
      bgColor: 'bg-pink-50 dark:bg-pink-950/30',
      icon: '👶',
    },
    {
      label: 'Jubilacion',
      value: stats.timeStats.weeksRetirement.toLocaleString('es-ES'),
      color: 'text-teal-500',
      bgColor: 'bg-teal-50 dark:bg-teal-950/30',
      icon: '🏖️',
    },
    {
      label: 'Tiempo libre',
      value: stats.timeStats.weeksFreeTime.toLocaleString('es-ES'),
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950/30',
      icon: '🎉',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Estadisticas principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {mainStats.map((card) => (
          <div
            key={card.label}
            className={`flex flex-col items-center p-4 rounded-xl ${card.bgColor}
                       border border-zinc-200 dark:border-zinc-800`}
          >
            <span className="text-2xl mb-1">{card.icon}</span>
            <span className={`text-xl md:text-2xl font-bold ${card.color}`}>
              {card.value}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
              {card.label}
            </span>
          </div>
        ))}
      </div>

      {/* Estadisticas de tiempo */}
      <div>
        <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3 text-center">
          Tiempo equivalente en semanas completas (basado en horas)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {timeStats.map((card) => (
            <div
              key={card.label}
              className={`flex flex-col items-center p-3 rounded-lg ${card.bgColor}
                         border border-zinc-200 dark:border-zinc-800`}
            >
              <span className="text-lg">{card.icon}</span>
              <span className={`text-lg font-bold ${card.color}`}>{card.value}</span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 text-center">
                {card.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
