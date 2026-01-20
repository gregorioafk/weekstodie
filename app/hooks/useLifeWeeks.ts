'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  calculateLifeStats,
  generateGridData,
  DEFAULT_CONFIG,
  DEFAULT_STAGES_CONFIG,
} from '@/app/lib/weekCalculations';
import { LifeConfig, LifeStagesConfig, LifeStats, WeekData } from '@/app/types';

export function useLifeWeeks(
  lifeConfig: LifeConfig = DEFAULT_CONFIG,
  initialStagesConfig: LifeStagesConfig = DEFAULT_STAGES_CONFIG
) {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [stagesConfig, setStagesConfig] = useState<LifeStagesConfig>(initialStagesConfig);
  const [showStages, setShowStages] = useState(true);

  const stats: LifeStats | null = useMemo(() => {
    if (!birthDate) return null;
    return calculateLifeStats(birthDate, lifeConfig, stagesConfig);
  }, [birthDate, lifeConfig, stagesConfig]);

  const gridData: WeekData[][] = useMemo(() => {
    return generateGridData(birthDate, lifeConfig, stagesConfig);
  }, [birthDate, lifeConfig, stagesConfig]);

  const handleDateChange = useCallback((date: Date | null) => {
    setBirthDate(date);
  }, []);

  const handleStagesConfigChange = useCallback((newConfig: LifeStagesConfig) => {
    setStagesConfig(newConfig);
  }, []);

  const toggleShowStages = useCallback(() => {
    setShowStages((prev) => !prev);
  }, []);

  return {
    birthDate,
    setBirthDate: handleDateChange,
    stats,
    gridData,
    lifeConfig,
    stagesConfig,
    setStagesConfig: handleStagesConfigChange,
    showStages,
    toggleShowStages,
  };
}
