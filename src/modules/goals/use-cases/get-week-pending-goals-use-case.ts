import dayjs from "dayjs";

import type { GoalsRepository } from "../repositories/goals-repository";

export class GetWeekPendingGoalsUseCase {
  constructor(private goalsRepository: GoalsRepository) {}

  async execute() {
    const firstDayOfWeek = dayjs().startOf("week").toDate();
    const lastDayOfWeek = dayjs().endOf("week").toDate();

    const goals = await this.goalsRepository.getWeekPendingGoals({
      firstDayOfWeek,
      lastDayOfWeek,
    });

    return {
      goals,
    };
  }
}
