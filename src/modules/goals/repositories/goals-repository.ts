import type { Goal } from "../entities/Goal";

export type GoalsRepositoryGetWeekPendingGoalsParams = {
  firstDayOfWeek: Date;
  lastDayOfWeek: Date;
};

export type GoalsRepositoryGetWeekSummaryParams = {
  firstDayOfWeek: Date;
  lastDayOfWeek: Date;
};

export type GoalsRepositoryGetWeekSummaryResponse = Array<{
  completed: number;
  total: number;
  goalsPerDay: unknown;
}>;

export abstract class GoalsRepository {
  abstract save(goal: Goal): Promise<Goal>;
  abstract getWeekPendingGoals(
    params: GoalsRepositoryGetWeekPendingGoalsParams
  ): Promise<Goal[]>;
  abstract getWeekSummary(
    params: GoalsRepositoryGetWeekSummaryParams
  ): Promise<GoalsRepositoryGetWeekSummaryResponse>;
}
