import { Type } from "@google/genai";

export enum AppState {
    WELCOME,
    SPORT_SELECTION,
    FORM,
    LOADING,
    RESULT,
    ERROR
}

export type PlanType = 'free' | 'bronze' | 'silver' | 'gold' | 'premium';

export type AppView = 'Hoy' | 'Semana' | 'Calendario' | 'Estadísticas' | 'Logros' | 'Perfil';

export type Sport = 'natacion' | 'running' | 'ciclismo';

export type TimeGoalUnit = 'segundos' | 'minutos' | 'horas' | '';

export interface TimeGoal {
    value: string;
    unit: TimeGoalUnit;
}

export interface UserData {
    name: string;
    email: string;
    age: number | '';
    sex: 'masculino' | 'femenino' | 'otro' | '';
    weight: number | '';
    height: number | '';
    experience: 'principiante' | 'intermedio' | 'avanzado' | '';
    goals: Partial<Record<Sport, string>>;
    goalTimes: Partial<Record<Sport, TimeGoal>>;
    sportDistribution: Partial<Record<Sport, number>>;
    raceDate: string;
    planStartDate: string;
    trainingDays: number | '';
    allowDoubleDays: boolean;
    selectedSports: Sport[];
    planType?: PlanType;
    allowMarketing?: boolean;
}

export type WorkoutStatus = 'pending' | 'completed' | 'skipped';

export type PerceivedEffort = 'facil' | 'perfecto' | 'dificil';

export interface Workout {
    id: string;
    day: string;
    date: string;
    type: string;
    description: string;
    status: WorkoutStatus;
    perceivedEffort?: PerceivedEffort;
    notes?: string;
    distance?: number; // en km
    duration?: number; // en minutos
    elevation?: number; // en metros
}

export interface WeeklyPlan {
    week: number;
    focus: string;
    workouts: Workout[];
}

export interface TrainingPlanData {
    plan: WeeklyPlan[];
}

export interface FormStep {
  id: string;
  title: string;
  emoji?: string;
}

export interface ReadjustmentFeedback {
    reason: string;
    details: string;
}

export interface FlowScoreBreakdown {
    energy: number;
    soreness: number;
    sleep: number;
    stress: number;
    motivation: number;
}

export interface FlowScore {
    score: number;
    title: string;
    message: string;
    breakdown: FlowScoreBreakdown;
    colorClass: string;
}

export interface DailyCheckInData {
    energy: number;
    soreness: number;
    sleep: number;
    stress: number;
    motivation: number;
}

export interface FlowScoreHistoryEntry {
    date: string;
    score: number;
}

export interface PlanAnalysis {
  completionRate: number;
  averageFlowScore: number;
  isFinished: boolean;
  qualifiesForCertificate: boolean;
  
  // Stats
  completedCount: number;
  skippedCount: number;
  totalDurationMinutes: number;
  totalDistanceKm: number;
  totalElevationMeters: number;

  // For Certificate
  planDurationDays: number;
  totalHours: number;
  goalDistances: string;
  averagePaceMinPerKm: number | null;
}

export interface PlanInfo {
    id: PlanType;
    name: string;
    price: number;
    priceSuffix: string;
    description: string;
    benefits: string[];
    highlight?: boolean;
}