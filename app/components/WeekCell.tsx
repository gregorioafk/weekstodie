'use client';

import { WeekCellProps } from '@/app/types';

const STAGE_COLORS = {
  childhood: {
    lived: 'bg-pink-400',
    future: 'bg-pink-100 dark:bg-pink-950 border border-pink-200 dark:border-pink-900',
  },
  study: {
    lived: 'bg-indigo-400',
    future: 'bg-indigo-100 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-900',
  },
  work: {
    lived: 'bg-orange-400',
    future: 'bg-orange-100 dark:bg-orange-950 border border-orange-200 dark:border-orange-900',
  },
  retirement: {
    lived: 'bg-teal-400',
    future: 'bg-teal-100 dark:bg-teal-950 border border-teal-200 dark:border-teal-900',
  },
  future: {
    lived: 'bg-zinc-400',
    future: 'bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700',
  },
};

const STAGE_NAMES = {
  childhood: 'Ninez',
  study: 'Estudios',
  work: 'Trabajo',
  retirement: 'Jubilacion',
  future: 'Futuro',
};

export default function WeekCell({ data, hasDate, showStages }: WeekCellProps) {
  const getBackgroundClass = (): string => {
    if (!hasDate) {
      return 'bg-zinc-200 dark:bg-zinc-800';
    }

    if (showStages) {
      const stageColors = STAGE_COLORS[data.stage];
      if (data.status === 'lived' || data.status === 'current') {
        return stageColors.lived;
      }
      return stageColors.future;
    }

    // Modo simple (solo rojo/blanco)
    switch (data.status) {
      case 'lived':
        return 'bg-[#ff5252]';
      case 'current':
        return 'bg-[#ff5252] ring-2 ring-[#ff5252] ring-offset-1 dark:ring-offset-zinc-950';
      case 'future':
        return 'bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700';
    }
  };

  const getCurrentRing = (): string => {
    if (data.status === 'current' && hasDate) {
      return 'ring-2 ring-white dark:ring-zinc-200 ring-offset-1 dark:ring-offset-zinc-950';
    }
    return '';
  };

  return (
    <div
      className={`
        w-[6px] h-[6px]
        sm:w-2 sm:h-2
        md:w-[10px] md:h-[10px]
        rounded-[2px]
        transition-colors duration-150
        ${getBackgroundClass()}
        ${getCurrentRing()}
      `}
      title={`Ano ${data.year + 1}, Semana ${data.week + 1} - ${STAGE_NAMES[data.stage]}`}
      role="gridcell"
      aria-label={`Ano ${data.year + 1}, Semana ${data.week + 1}: ${
        data.status === 'lived'
          ? 'vivida'
          : data.status === 'current'
            ? 'actual'
            : 'por vivir'
      } - ${STAGE_NAMES[data.stage]}`}
    />
  );
}
