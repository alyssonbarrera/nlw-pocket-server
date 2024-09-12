import type { Goal } from "../entities/Goal";

export type GoalsRepositoryGetWeekPendingGoalsParams = {
  firstDayOfWeek: Date;
  lastDayOfWeek: Date;
};

export type GoalsRepositoryGetWeekSummaryParams = {
  firstDayOfWeek: Date;
  lastDayOfWeek: Date;
};

export type GoalsRepositoryGoalsPerDay = Array<
  Record<
    string,
    Array<{
      id: string;
      title: string;
      completedAt: Date;
    }>
  >
>;

export type GoalsRepositoryGetWeekSummaryResponse = {
  completed: number;
  total: number;
  goalsPerDay: GoalsRepositoryGoalsPerDay;
};

export abstract class GoalsRepository {
  abstract save(goal: Goal): Promise<Goal>;
  abstract getWeekPendingGoals(
    params: GoalsRepositoryGetWeekPendingGoalsParams
  ): Promise<Goal[]>;
  abstract getWeekSummary(
    params: GoalsRepositoryGetWeekSummaryParams
  ): Promise<GoalsRepositoryGetWeekSummaryResponse>;
}
