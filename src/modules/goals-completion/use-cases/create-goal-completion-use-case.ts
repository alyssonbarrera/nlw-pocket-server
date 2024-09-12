import dayjs from "dayjs";

import { AppError } from "@/core/errors/app-error";
import { GoalCompletion } from "../entities/GoalCompletion";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { GoalsCompletionRepository } from "../repositories/goals-completion-repository";

interface CreateGoalCompletionUseCaseRequest {
  id: string;
}

export class CreateGoalCompletionUseCase {
  constructor(private goalsCompletionRepository: GoalsCompletionRepository) {}

  async execute(goalId: CreateGoalCompletionUseCaseRequest["id"]) {
    const firstDayOfWeek = dayjs().startOf("week").toDate();
    const lastDayOfWeek = dayjs().endOf("week").toDate();

    const { completionCount, desiredWeeklyFrequency } =
      await this.goalsCompletionRepository.getGoalCompletions({
        goalId: new UniqueEntityID(goalId),
        firstDayOfWeek,
        lastDayOfWeek,
      });

    if (completionCount >= desiredWeeklyFrequency) {
      throw new AppError("Goal already completed for this week");
    }

    const goalCompletion = GoalCompletion.create({
      goalId: new UniqueEntityID(goalId),
    });

    await this.goalsCompletionRepository.save(goalCompletion);

    return {
      goalCompletion,
    };
  }
}
