import type { GoalCompletion } from "@/modules/goals-completion/entities/GoalCompletion";

export class GoalCompletionPresenter {
  static toHTTP(goal: GoalCompletion) {
    return {
      id: goal.id.toString(),
      goalId: goal.goalId.toString(),
      createdAt: goal.createdAt,
    };
  }
}
