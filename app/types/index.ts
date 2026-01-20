// Configuracion base de la aplicacion
export interface LifeConfig {
  totalYears: number;
  weeksPerYear: number;
}

// Configuracion de etapas de vida
export interface LifeStagesConfig {
  childhoodEndAge: number; // Edad fin de ninez (ej: 6)
  studyStartAge: number; // Edad inicio estudios (ej: 6)
  studyEndAge: number; // Edad fin estudios (ej: 22)
  workStartAge: number; // Edad inicio trabajo (ej: 22)
  retirementAge: number; // Edad jubilacion (ej: 65)
  hoursWorkPerWeek: number; // Horas trabajo por semana (ej: 40)
  hoursCommutePerWeek: number; // Horas trafico por semana (ej: 10)
  hoursStudyPerWeek: number; // Horas estudio por semana (ej: 35)
  hoursSleepPerDay: number; // Horas sueno por dia (ej: 8)
}

// Estado de una semana individual
export type WeekStatus = 'lived' | 'future' | 'current';

// Etapa de vida
export type LifeStage = 'childhood' | 'study' | 'work' | 'retirement' | 'future';

// Datos de una semana en la cuadricula
export interface WeekData {
  year: number;
  week: number;
  absoluteWeek: number;
  status: WeekStatus;
  stage: LifeStage;
}

// Estadisticas de tiempo en actividades
export interface TimeStats {
  weeksWorking: number;
  weeksInTraffic: number;
  weeksStudying: number;
  weeksSleeping: number;
  weeksChildhood: number;
  weeksRetirement: number;
  weeksFreeTime: number;
}

// Estadisticas de vida calculadas
export interface LifeStats {
  weeksLived: number;
  weeksRemaining: number;
  totalWeeks: number;
  percentageLived: number;
  currentAge: {
    years: number;
    months: number;
    weeks: number;
  };
  timeStats: TimeStats;
}

// Props del componente de cuadricula
export interface WeeksGridProps {
  gridData: WeekData[][];
  birthDate: Date | null;
  showStages: boolean;
}

// Props del panel de estadisticas
export interface StatsPanelProps {
  stats: LifeStats | null;
}

// Props del selector de fecha
export interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  maxDate?: Date;
  minDate?: Date;
}

// Props de la celda de semana
export interface WeekCellProps {
  data: WeekData;
  hasDate: boolean;
  showStages: boolean;
}

// Props del panel de configuracion
export interface LifeConfigPanelProps {
  config: LifeStagesConfig;
  onChange: (config: LifeStagesConfig) => void;
}

// ========================================
// SOBREPOSICIÓN DE ETAPAS
// ========================================

export interface OverlapConfig {
  allowStudyWorkOverlap: boolean;
  allowCustomOverlap: boolean;
}

// Etapa de vida extendida (puede tener múltiples)
export type ExtendedLifeStage = LifeStage | 'study_work' | string;

// ========================================
// EVENTOS DE VIDA
// ========================================

export type EventCategory =
  | 'migration'
  | 'family'
  | 'career'
  | 'education'
  | 'health'
  | 'milestone'
  | 'custom';

export interface LifeEvent {
  id: string;
  name: string;
  date: Date;
  category: EventCategory;
  emoji: string;
  color?: string;
  description?: string;
  absoluteWeek?: number;
}

export interface EventPreset {
  category: EventCategory;
  emoji: string;
  defaultColor: string;
  label: string;
}

// ========================================
// ETAPAS CUSTOM
// ========================================

export interface CustomStage {
  id: string;
  name: string;
  color: string;
  colorFuture: string;
  startAge?: number;
  endAge?: number;
  startDate?: Date;
  endDate?: Date;
  canOverlap: boolean;
  icon: string;
}

// ========================================
// DATOS EXTENDIDOS
// ========================================

export interface WeekDataExtended extends Omit<WeekData, 'stage'> {
  stages: ExtendedLifeStage[];
  primaryStage: ExtendedLifeStage;
  hasOverlap: boolean;
  events: LifeEvent[];
}

export interface LifeStagesConfigExtended extends LifeStagesConfig {
  overlapConfig: OverlapConfig;
  customStages: CustomStage[];
}

// ========================================
// PROPS EXTENDIDOS
// ========================================

export interface WeeksGridExtendedProps {
  gridData: WeekDataExtended[][];
  birthDate: Date | null;
  showStages: boolean;
  showEvents: boolean;
  events: LifeEvent[];
  customStages: CustomStage[];
  onWeekClick?: (week: WeekDataExtended) => void;
}

export interface LifeConfigPanelExtendedProps {
  config: LifeStagesConfigExtended;
  onChange: (config: LifeStagesConfigExtended) => void;
  events: LifeEvent[];
  onEventsChange: (events: LifeEvent[]) => void;
  birthDate: Date | null;
}
