import dayjs from "dayjs";

import type { GoalsRepository } from "../repositories/goals-repository";

export class GetWeekSummaryUseCase {
  constructor(private goalsRepository: GoalsRepository) {}

  async execute() {
    const firstDayOfWeek = dayjs().startOf("week").toDate();
    const lastDayOfWeek = dayjs().endOf("week").toDate();

    const summary = await this.goalsRepository.getWeekSummary({
      firstDayOfWeek,
      lastDayOfWeek,
    });

    return {
      summary,
    };
  }
}
