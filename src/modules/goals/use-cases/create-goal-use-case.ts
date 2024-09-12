import { Goal } from "../entities/Goal";
import type { GoalsRepository } from "../repositories/goals-repository";

interface CreateGoalUseCaseRequest {
  title: string;
  desiredWeeklyFrequency: number;
}

export class CreateGoalUseCase {
  constructor(private goalsRepository: GoalsRepository) {}

  async execute({ title, desiredWeeklyFrequency }: CreateGoalUseCaseRequest) {
    const goal = Goal.create({
      title,
      desiredWeeklyFrequency,
      createdAt: new Date(),
    });

    await this.goalsRepository.save(goal);

    return {
      goal,
    };
  }
}
