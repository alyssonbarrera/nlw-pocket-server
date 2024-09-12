import type { Goal } from "@/modules/goals/entities/Goal";

export class GoalPresenter {
  static toHTTP(goal: Goal) {
    return {
      id: goal.id.toString(),
      title: goal.title,
      desiredWeeklyFrequency: goal.desiredWeeklyFrequency,
      completionCount: goal.completionCount,
      createdAt: goal.createdAt,
    };
  }
}
