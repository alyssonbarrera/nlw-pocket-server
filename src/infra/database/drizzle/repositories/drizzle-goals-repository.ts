import { and, count, eq, gte, lte, sql } from "drizzle-orm";

import { drizzleDb } from "../index";
import { goalCompletions, goals } from "../schemas";

import type {
  GoalsRepository,
  GoalsRepositoryGetWeekPendingGoalsParams,
  GoalsRepositoryGetWeekSummaryParams,
  GoalsRepositoryGetWeekSummaryResponse,
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

  async getWeekSummary({
    firstDayOfWeek,
    lastDayOfWeek,
  }: GoalsRepositoryGetWeekSummaryParams): Promise<GoalsRepositoryGetWeekSummaryResponse> {
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

    const goalsCompletedInWeek = drizzleDb.$with("goals_completed_in_week").as(
      drizzleDb
        .select({
          id: goalCompletions.id,
          title: goals.title,
          completedAt: goalCompletions.createdAt,
          completedAtDate: sql`DATE(${goalCompletions.createdAt})`.as(
            "completedAtDate"
          ),
        })
        .from(goalCompletions)
        .innerJoin(goals, eq(goals.id, goalCompletions.goalId))
        .where(
          and(
            gte(goalCompletions.createdAt, firstDayOfWeek),
            lte(goalCompletions.createdAt, lastDayOfWeek)
          )
        )
    );

    const goalsCompletedByWeekDay = drizzleDb
      .$with("goals_completed_by_week_day")
      .as(
        drizzleDb
          .select({
            completedAtDate: goalsCompletedInWeek.completedAtDate,
            completions: sql`
              JSON_AGG(
                JSON_BUILD_OBJECT(
                  'id', ${goalsCompletedInWeek.id},
                  'title', ${goalsCompletedInWeek.title},
                  'completedAt', ${goalsCompletedInWeek.completedAt}
                )
              )
            `.as("completions"),
          })
          .from(goalsCompletedInWeek)
          .groupBy(goalsCompletedInWeek.completedAtDate)
      );

    const result = await drizzleDb
      .with(goalsCreatedUpToWeek, goalsCompletedInWeek, goalsCompletedByWeekDay)
      .select({
        completed: sql`(SELECT COUNT(*) FROM ${goalsCompletedInWeek})`.mapWith(
          Number
        ),
        total:
          sql`(SELECT SUM(${goalsCreatedUpToWeek.desiredWeeklyFrequency}) FROM ${goalsCreatedUpToWeek})`.mapWith(
            Number
          ),
        goalsPerDay: sql`
          JSON_OBJECT_AGG(
            ${goalsCompletedByWeekDay.completedAtDate},
            ${goalsCompletedByWeekDay.completions}
          )
        `,
      })
      .from(goalsCompletedByWeekDay);

    return result;
  }
}
