'use client';

import { WeeksGridProps } from '@/app/types';
import WeekCell from './WeekCell';

export default function WeeksGrid({ gridData, birthDate, showStages }: WeeksGridProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Column headers - semanas */}
      <div className="hidden lg:flex mb-1 ml-8">
        {Array.from({ length: 52 }, (_, i) => (
          <div key={i} className="w-[10px] text-[8px] text-zinc-400 text-center">
            {(i + 1) % 4 === 0 ? i + 1 : ''}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="flex flex-col gap-[2px]">
        {gridData.map((row, yearIndex) => (
          <div key={yearIndex} className="flex items-center gap-[2px]">
            {/* Row label (ano) */}
            <span className="w-6 text-[10px] text-zinc-400 text-right pr-1 shrink-0">
              {yearIndex % 5 === 0 ? yearIndex : ''}
            </span>

            {/* Week cells */}
            {row.map((weekData) => (
              <WeekCell
                key={weekData.absoluteWeek}
                data={weekData}
                hasDate={!!birthDate}
                showStages={showStages}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Ano 80 label */}
      <div className="flex items-center mt-1">
        <span className="w-6 text-[10px] text-zinc-400 text-right pr-1">80</span>
      </div>
    </div>
  );
}
