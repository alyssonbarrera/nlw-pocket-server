import { Goal } from "@/modules/goals/entities/Goal";
import type { drizzleGoalsProps } from "../drizzle/schemas";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export class DrizzleGoalsMapper {
  static toDomain(raw: drizzleGoalsProps): Goal {
    return Goal.create(
      {
        title: raw.title,
        desiredWeeklyFrequency: raw.desiredWeeklyFrequency,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toDomainWithGoalsCompletions(
    raw: drizzleGoalsProps & { completionCount: number }
  ): Goal {
    return Goal.create(
      {
        title: raw.title,
        desiredWeeklyFrequency: raw.desiredWeeklyFrequency,
        createdAt: raw.createdAt,
        completionCount: raw.completionCount ?? 0,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toDrizzle(goal: Goal): drizzleGoalsProps {
    return {
      id: goal.id.toString(),
      title: goal.title,
      desiredWeeklyFrequency: goal.desiredWeeklyFrequency,
      createdAt: goal.createdAt,
    };
  }
}
