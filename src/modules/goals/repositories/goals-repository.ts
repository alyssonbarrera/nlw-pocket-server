import type { Goal } from "../entities/Goal";

export type GoalsRepositoryGetWeekPendingGoalsParams = {
  firstDayOfWeek: Date;
  lastDayOfWeek: Date;
};

export abstract class GoalsRepository {
  abstract save(goal: Goal): Promise<Goal>;
  abstract getWeekPendingGoals(
    params: GoalsRepositoryGetWeekPendingGoalsParams
  ): Promise<Goal[]>;
}
