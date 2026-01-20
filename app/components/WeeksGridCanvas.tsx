'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { WeekData } from '@/app/types';

interface WeeksGridCanvasProps {
  gridData: WeekData[][];
  birthDate: Date | null;
  showStages: boolean;
  weeksWithTodos: number[];
}

const CELL_SIZE = 10;
const GAP = 2;
const ROWS = 80;
const COLS = 52;

const STAGE_COLORS = {
  childhood: { lived: '#f472b6', future: '#fce7f3' },
  study: { lived: '#818cf8', future: '#e0e7ff' },
  work: { lived: '#fb923c', future: '#ffedd5' },
  retirement: { lived: '#2dd4bf', future: '#ccfbf1' },
  future: { lived: '#a1a1aa', future: '#f4f4f5' },
};

const STAGE_COLORS_DARK = {
  childhood: { lived: '#f472b6', future: '#500724' },
  study: { lived: '#818cf8', future: '#1e1b4b' },
  work: { lived: '#fb923c', future: '#431407' },
  retirement: { lived: '#2dd4bf', future: '#042f2e' },
  future: { lived: '#a1a1aa', future: '#27272a' },
};

export default function WeeksGridCanvas({
  gridData,
  birthDate,
  showStages,
  weeksWithTodos,
}: WeeksGridCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedWeek, setSelectedWeek] = useState<WeekData | null>(null);
  const [isDark, setIsDark] = useState(false);
  const weeksSet = useRef(new Set(weeksWithTodos));

  // Update weeksSet when weeksWithTodos changes
  useEffect(() => {
    weeksSet.current = new Set(weeksWithTodos);
  }, [weeksWithTodos]);

  // Detect dark mode
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = isDark ? STAGE_COLORS_DARK : STAGE_COLORS;
    const bgColor = isDark ? '#18181b' : '#ffffff';

    // Clear canvas
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw cells
    for (let year = 0; year < gridData.length; year++) {
      const row = gridData[year];
      for (let week = 0; week < row.length; week++) {
        const data = row[week];
        const x = week * (CELL_SIZE + GAP);
        const y = year * (CELL_SIZE + GAP);

        // Get color
        let color: string;
        if (!birthDate) {
          color = isDark ? '#3f3f46' : '#e4e4e7';
        } else if (showStages) {
          const stageColors = colors[data.stage];
          color = data.status === 'lived' || data.status === 'current'
            ? stageColors.lived
            : stageColors.future;
        } else {
          color = data.status === 'lived' || data.status === 'current'
            ? '#ff5252'
            : isDark ? '#27272a' : '#f4f4f5';
        }

        // Draw cell
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(x, y, CELL_SIZE, CELL_SIZE, 2);
        ctx.fill();

        // Draw current week indicator
        if (data.status === 'current' && birthDate) {
          ctx.strokeStyle = isDark ? '#e4e4e7' : '#ffffff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(x - 1, y - 1, CELL_SIZE + 2, CELL_SIZE + 2, 3);
          ctx.stroke();
        }

        // Draw todo indicator
        if (weeksSet.current.has(data.absoluteWeek)) {
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(x + CELL_SIZE, y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }, [gridData, birthDate, showStages, isDark]);

  // Draw on mount and when dependencies change
  useEffect(() => {
    draw();
  }, [draw, weeksWithTodos]);

  // Handle click
  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const week = Math.floor(x / (CELL_SIZE + GAP));
    const year = Math.floor(y / (CELL_SIZE + GAP));

    if (year >= 0 && year < ROWS && week >= 0 && week < COLS) {
      const weekData = gridData[year]?.[week];
      if (weekData) {
        setSelectedWeek(weekData);
      }
    }
  }, [gridData]);

  const width = COLS * (CELL_SIZE + GAP) - GAP;
  const height = ROWS * (CELL_SIZE + GAP) - GAP;

  return (
    <>
      <div className="flex flex-col items-center">
        {/* Column headers */}
        <div className="hidden lg:flex mb-1" style={{ width, paddingLeft: 0 }}>
          {Array.from({ length: 52 }, (_, i) => (
            <div
              key={i}
              className="text-[8px] text-zinc-400 text-center"
              style={{ width: CELL_SIZE + GAP }}
            >
              {(i + 1) % 4 === 0 ? i + 1 : ''}
            </div>
          ))}
        </div>

        <div className="flex">
          {/* Row labels */}
          <div className="flex flex-col mr-1" style={{ height }}>
            {Array.from({ length: 80 }, (_, i) => (
              <div
                key={i}
                className="text-[10px] text-zinc-400 text-right pr-1"
                style={{ height: CELL_SIZE + GAP, lineHeight: `${CELL_SIZE + GAP}px` }}
              >
                {i % 5 === 0 ? i : ''}
              </div>
            ))}
          </div>

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            onClick={handleClick}
            className="cursor-pointer"
            style={{
              width: Math.min(width, typeof window !== 'undefined' ? window.innerWidth - 80 : width),
              height: 'auto',
              aspectRatio: `${width} / ${height}`
            }}
          />
        </div>

        <div className="flex items-center mt-1">
          <span className="text-[10px] text-zinc-400 pr-1">80</span>
        </div>
      </div>

      {/* Week Info Modal */}
      {selectedWeek && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedWeek(null)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">
                Semana {selectedWeek.week + 1}, Ano {selectedWeek.year + 1}
              </h2>
              <button
                onClick={() => setSelectedWeek(null)}
                className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <p>Semana absoluta: #{selectedWeek.absoluteWeek + 1}</p>
              <p>Etapa: {selectedWeek.stage === 'childhood' ? 'Ninez' :
                        selectedWeek.stage === 'study' ? 'Estudios' :
                        selectedWeek.stage === 'work' ? 'Trabajo' :
                        selectedWeek.stage === 'retirement' ? 'Jubilacion' : 'Futuro'}</p>
              <p>Estado: {selectedWeek.status === 'lived' ? 'Vivida' :
                         selectedWeek.status === 'current' ? 'Actual' : 'Futura'}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
