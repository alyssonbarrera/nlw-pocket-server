import { drizzleDb } from "../index";
import { goalCompletions, goals } from "../schemas";

import type {
  GoalsCompletionRepository,
  GoalsCompletionRepositoryGetGoalCompletionCountsParams,
  GoalsCompletionRepositoryGetGoalCompletionCountsResponse,
} from "@/modules/goals-completion/repositories/goals-completion-repository";
import type { GoalCompletion } from "@/modules/goals-completion/entities/GoalCompletion";
import { DrizzleGoalsCompletionMapper } from "../../mappers/drizzle-goals-completation-mapper";
import { and, count, eq, gte, lte, sql } from "drizzle-orm";

export class DrizzleGoalsCompletionRepository
  implements GoalsCompletionRepository
{
  async save(data: GoalCompletion): Promise<GoalCompletion> {
    const [goalCompletion] = await drizzleDb
      .insert(goalCompletions)
      .values({
        id: data.id.toString(),
        goalId: data.goalId.toString(),
        createdAt: data.createdAt,
      })
      .returning();

    return DrizzleGoalsCompletionMapper.toDomain(goalCompletion);
  }

  async getGoalCompletions({
    goalId,
    firstDayOfWeek,
    lastDayOfWeek,
  }: GoalsCompletionRepositoryGetGoalCompletionCountsParams): Promise<GoalsCompletionRepositoryGetGoalCompletionCountsResponse> {
    const goalCompletionCounts = drizzleDb.$with("goal_completion_counts").as(
      drizzleDb
        .select({
          goalId: goalCompletions.goalId,
          completionCount: count(goalCompletions.id).as("completionCount"),
        })
        .from(goalCompletions)
        .where(
          and(
            gte(goalCompletions.createdAt, firstDayOfWeek),
            lte(goalCompletions.createdAt, lastDayOfWeek),
            eq(goalCompletions.goalId, goalId.toString())
          )
        )
        .groupBy(goalCompletions.goalId)
    );

    const [result] = await drizzleDb
      .with(goalCompletionCounts)
      .select({
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        completionCount: sql`
          COALESCE(${goalCompletionCounts.completionCount}, 0)
        `.mapWith(Number),
      })
      .from(goals)
      .leftJoin(goalCompletionCounts, eq(goalCompletionCounts.goalId, goals.id))
      .where(eq(goals.id, goalId.toString()));

    return result;
  }
}
