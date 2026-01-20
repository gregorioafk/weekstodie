'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  calculateLifeStats,
  generateGridData,
  generateGridDataExtended,
  DEFAULT_CONFIG,
  DEFAULT_STAGES_CONFIG,
  DEFAULT_STAGES_CONFIG_EXTENDED,
} from '@/app/lib/weekCalculations';
import {
  LifeConfig,
  LifeStagesConfig,
  LifeStagesConfigExtended,
  LifeStats,
  WeekData,
  WeekDataExtended,
  LifeEvent,
} from '@/app/types';

const STORAGE_KEYS = {
  birthDate: 'weekstodie_birthdate',
  config: 'weekstodie_config',
  events: 'weekstodie_events',
  showStages: 'weekstodie_showstages',
};

function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;
    return JSON.parse(stored);
  } catch {
    return defaultValue;
  }
}

function saveToStorage(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage quota exceeded or other error
  }
}

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

// Hook extendido con soporte para eventos, etapas custom y persistencia
export function useLifeWeeksExtended(lifeConfig: LifeConfig = DEFAULT_CONFIG) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [birthDate, setBirthDateState] = useState<Date | null>(null);
  const [stagesConfig, setStagesConfigState] =
    useState<LifeStagesConfigExtended>(DEFAULT_STAGES_CONFIG_EXTENDED);
  const [events, setEventsState] = useState<LifeEvent[]>([]);
  const [showStages, setShowStagesState] = useState(true);
  const [showEvents, setShowEventsState] = useState(true);

  // Cargar datos de localStorage al montar
  useEffect(() => {
    const storedBirthDate = loadFromStorage<string | null>(STORAGE_KEYS.birthDate, null);
    const storedConfig = loadFromStorage<LifeStagesConfigExtended | null>(STORAGE_KEYS.config, null);
    const storedEvents = loadFromStorage<Array<LifeEvent & { date: string }>>( STORAGE_KEYS.events, []);
    const storedShowStages = loadFromStorage<boolean>(STORAGE_KEYS.showStages, true);

    if (storedBirthDate) {
      setBirthDateState(new Date(storedBirthDate));
    }

    if (storedConfig) {
      setStagesConfigState({
        ...DEFAULT_STAGES_CONFIG_EXTENDED,
        ...storedConfig,
      });
    }

    if (storedEvents.length > 0) {
      // Convertir strings de fecha a objetos Date
      setEventsState(
        storedEvents.map((e) => ({
          ...e,
          date: new Date(e.date),
        }))
      );
    }

    setShowStagesState(storedShowStages);
    setIsLoaded(true);
  }, []);

  // Guardar birthDate en localStorage
  const setBirthDate = useCallback((date: Date | null) => {
    setBirthDateState(date);
    saveToStorage(STORAGE_KEYS.birthDate, date?.toISOString() || null);
  }, []);

  // Guardar config en localStorage
  const setStagesConfig = useCallback((config: LifeStagesConfigExtended) => {
    setStagesConfigState(config);
    saveToStorage(STORAGE_KEYS.config, config);
  }, []);

  // Guardar eventos en localStorage
  const setEvents = useCallback((newEvents: LifeEvent[]) => {
    setEventsState(newEvents);
    saveToStorage(STORAGE_KEYS.events, newEvents);
  }, []);

  // Guardar showStages en localStorage
  const toggleShowStages = useCallback(() => {
    setShowStagesState((prev) => {
      const newValue = !prev;
      saveToStorage(STORAGE_KEYS.showStages, newValue);
      return newValue;
    });
  }, []);

  const toggleShowEvents = useCallback(() => {
    setShowEventsState((prev) => !prev);
  }, []);

  const stats: LifeStats | null = useMemo(() => {
    if (!birthDate) return null;
    return calculateLifeStats(birthDate, lifeConfig, stagesConfig);
  }, [birthDate, lifeConfig, stagesConfig]);

  const gridData: WeekDataExtended[][] = useMemo(() => {
    return generateGridDataExtended(birthDate, lifeConfig, stagesConfig, events);
  }, [birthDate, lifeConfig, stagesConfig, events]);

  return {
    isLoaded,
    birthDate,
    setBirthDate,
    stats,
    gridData,
    lifeConfig,
    stagesConfig,
    setStagesConfig,
    events,
    setEvents,
    showStages,
    toggleShowStages,
    showEvents,
    toggleShowEvents,
  };
}
