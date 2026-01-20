import {
  LifeConfig,
  LifeStagesConfig,
  LifeStats,
  WeekData,
  WeekStatus,
  LifeStage,
  TimeStats,
} from '@/app/types';

export const DEFAULT_CONFIG: LifeConfig = {
  totalYears: 80,
  weeksPerYear: 52,
};

export const DEFAULT_STAGES_CONFIG: LifeStagesConfig = {
  childhoodEndAge: 6,
  studyStartAge: 6,
  studyEndAge: 22,
  workStartAge: 22,
  retirementAge: 65,
  hoursWorkPerWeek: 40,
  hoursCommutePerWeek: 10,
  hoursStudyPerWeek: 35,
  hoursSleepPerDay: 8,
};

const HOURS_PER_WEEK = 168; // 24 * 7

export function calculateWeeksLived(birthDate: Date): number {
  const now = new Date();
  const diffTime = now.getTime() - birthDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return Math.floor(diffDays / 7);
}

export function getLifeStage(
  yearIndex: number,
  stagesConfig: LifeStagesConfig,
  lifeConfig: LifeConfig
): LifeStage {
  if (yearIndex < stagesConfig.childhoodEndAge) return 'childhood';
  if (yearIndex >= stagesConfig.studyStartAge && yearIndex < stagesConfig.studyEndAge)
    return 'study';
  if (yearIndex >= stagesConfig.workStartAge && yearIndex < stagesConfig.retirementAge)
    return 'work';
  if (yearIndex >= stagesConfig.retirementAge && yearIndex < lifeConfig.totalYears)
    return 'retirement';
  return 'future';
}

export function calculateTimeStats(
  birthDate: Date,
  lifeConfig: LifeConfig,
  stagesConfig: LifeStagesConfig
): TimeStats {
  const weeksLived = calculateWeeksLived(birthDate);
  const currentAgeYears = weeksLived / lifeConfig.weeksPerYear;

  // Semanas en cada etapa de vida (basado en expectativa de vida)
  const childhoodWeeks = stagesConfig.childhoodEndAge * lifeConfig.weeksPerYear;
  const studyYears = stagesConfig.studyEndAge - stagesConfig.studyStartAge;
  const studyWeeks = studyYears * lifeConfig.weeksPerYear;
  const workYears = stagesConfig.retirementAge - stagesConfig.workStartAge;
  const workWeeks = workYears * lifeConfig.weeksPerYear;
  const retirementYears = lifeConfig.totalYears - stagesConfig.retirementAge;
  const retirementWeeks = retirementYears * lifeConfig.weeksPerYear;

  // Calcular tiempo equivalente en semanas basado en horas por semana
  // Trabajo: (horas trabajo/semana) / (horas totales/semana) * semanas trabajando
  const workFraction = stagesConfig.hoursWorkPerWeek / HOURS_PER_WEEK;
  const weeksWorking = Math.round(workWeeks * workFraction);

  // Trafico: solo durante anos de trabajo
  const commuteFraction = stagesConfig.hoursCommutePerWeek / HOURS_PER_WEEK;
  const weeksInTraffic = Math.round(workWeeks * commuteFraction);

  // Estudio: horas de estudio durante anos de estudio
  const studyFraction = stagesConfig.hoursStudyPerWeek / HOURS_PER_WEEK;
  const weeksStudying = Math.round(studyWeeks * studyFraction);

  // Sueno: toda la vida
  const sleepHoursPerWeek = stagesConfig.hoursSleepPerDay * 7;
  const sleepFraction = sleepHoursPerWeek / HOURS_PER_WEEK;
  const totalWeeks = lifeConfig.totalYears * lifeConfig.weeksPerYear;
  const weeksSleeping = Math.round(totalWeeks * sleepFraction);

  // Tiempo libre = total - trabajo - trafico - estudio - sueno
  const weeksFreeTime = Math.max(
    0,
    totalWeeks - weeksWorking - weeksInTraffic - weeksStudying - weeksSleeping
  );

  return {
    weeksWorking,
    weeksInTraffic,
    weeksStudying,
    weeksSleeping,
    weeksChildhood: childhoodWeeks,
    weeksRetirement: retirementWeeks,
    weeksFreeTime,
  };
}

export function calculateLifeStats(
  birthDate: Date,
  lifeConfig: LifeConfig = DEFAULT_CONFIG,
  stagesConfig: LifeStagesConfig = DEFAULT_STAGES_CONFIG
): LifeStats {
  const totalWeeks = lifeConfig.totalYears * lifeConfig.weeksPerYear;
  const weeksLived = calculateWeeksLived(birthDate);
  const weeksRemaining = Math.max(0, totalWeeks - weeksLived);
  const percentageLived = Math.min(100, (weeksLived / totalWeeks) * 100);

  const now = new Date();
  const ageInMs = now.getTime() - birthDate.getTime();
  const ageDate = new Date(ageInMs);

  const years = Math.abs(ageDate.getUTCFullYear() - 1970);
  const months = ageDate.getUTCMonth();
  const weeks = Math.floor(ageDate.getUTCDate() / 7);

  const timeStats = calculateTimeStats(birthDate, lifeConfig, stagesConfig);

  return {
    weeksLived,
    weeksRemaining,
    totalWeeks,
    percentageLived,
    currentAge: { years, months, weeks },
    timeStats,
  };
}

export function getWeekStatus(weekIndex: number, weeksLived: number): WeekStatus {
  if (weekIndex < weeksLived) return 'lived';
  if (weekIndex === weeksLived) return 'current';
  return 'future';
}

export function generateGridData(
  birthDate: Date | null,
  lifeConfig: LifeConfig = DEFAULT_CONFIG,
  stagesConfig: LifeStagesConfig = DEFAULT_STAGES_CONFIG
): WeekData[][] {
  const weeksLived = birthDate ? calculateWeeksLived(birthDate) : 0;
  const grid: WeekData[][] = [];

  for (let year = 0; year < lifeConfig.totalYears; year++) {
    const row: WeekData[] = [];
    const stage = getLifeStage(year, stagesConfig, lifeConfig);

    for (let week = 0; week < lifeConfig.weeksPerYear; week++) {
      const absoluteWeek = year * lifeConfig.weeksPerYear + week;
      row.push({
        year,
        week,
        absoluteWeek,
        status: birthDate ? getWeekStatus(absoluteWeek, weeksLived) : 'future',
        stage,
      });
    }
    grid.push(row);
  }

  return grid;
}
