import type { drizzleGoalCompletionsProps } from "../drizzle/schemas";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { GoalCompletion } from "@/modules/goals-completion/entities/GoalCompletion";

export class DrizzleGoalsCompletionMapper {
  static toDomain(raw: drizzleGoalCompletionsProps): GoalCompletion {
    return GoalCompletion.create(
      {
        id: new UniqueEntityID(raw.id),
        goalId: new UniqueEntityID(raw.goalId),
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id)
    );
  }
}
