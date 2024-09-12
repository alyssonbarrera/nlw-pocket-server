import { and, count, eq, gte, lte, sql } from "drizzle-orm";

import { drizzleDb } from "../index";
import { goalCompletions, goals } from "../schemas";

import type {
  GoalsRepository,
  GoalsRepositoryGetWeekPendingGoalsParams,
} from "@/modules/goals/repositories/goals-repository";
import type { Goal } from "@/modules/goals/entities/Goal";
import { DrizzleGoalsMapper } from "../../mappers/drizzle-goals-mapper";

export class DrizzleGoalsRepository implements GoalsRepository {
  async save(data: Goal): Promise<Goal> {
    const [goal] = await drizzleDb
      .insert(goals)
      .values({
        title: data.title,
        id: data.id.toString(),
        createdAt: data.createdAt,
        desiredWeeklyFrequency: data.desiredWeeklyFrequency,
      })
      .returning();

    return DrizzleGoalsMapper.toDomain(goal);
  }

  async getWeekPendingGoals({
    firstDayOfWeek,
    lastDayOfWeek,
  }: GoalsRepositoryGetWeekPendingGoalsParams): Promise<Goal[]> {
    const goalsCreatedUpToWeek = drizzleDb.$with("goals_created_up_to_week").as(
      drizzleDb
        .select({
          id: goals.id,
          title: goals.title,
          desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
          createdAt: goals.createdAt,
        })
        .from(goals)
        .where(lte(goals.createdAt, lastDayOfWeek))
    );

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
            lte(goalCompletions.createdAt, lastDayOfWeek)
          )
        )
        .groupBy(goalCompletions.goalId)
    );

    const pendingGoals = await drizzleDb
      .with(goalsCreatedUpToWeek, goalCompletionCounts)
      .select({
        id: goalsCreatedUpToWeek.id,
        title: goalsCreatedUpToWeek.title,
        desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
        completionCount: sql`
          COALESCE(${goalCompletionCounts.completionCount}, 0)
        `.mapWith(Number),
        createdAt: goalsCreatedUpToWeek.createdAt,
      })
      .from(goalsCreatedUpToWeek)
      .leftJoin(
        goalCompletionCounts,
        eq(goalCompletionCounts.goalId, goalsCreatedUpToWeek.id)
      );

    return pendingGoals.map(DrizzleGoalsMapper.toDomainWithGoalsCompletions);
  }
}
