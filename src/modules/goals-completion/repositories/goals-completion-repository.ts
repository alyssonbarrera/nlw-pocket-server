import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { GoalCompletion } from "../entities/GoalCompletion";

export type GoalsCompletionRepositoryGetGoalCompletionCountsParams = {
  goalId: UniqueEntityID;
  firstDayOfWeek: Date;
  lastDayOfWeek: Date;
};

export type GoalsCompletionRepositoryGetGoalCompletionCountsResponse = {
  desiredWeeklyFrequency: number;
  completionCount: number;
};

export abstract class GoalsCompletionRepository {
  abstract save(goal: GoalCompletion): Promise<GoalCompletion>;
  abstract getGoalCompletions(
    params: GoalsCompletionRepositoryGetGoalCompletionCountsParams
  ): Promise<GoalsCompletionRepositoryGetGoalCompletionCountsResponse>;
}
