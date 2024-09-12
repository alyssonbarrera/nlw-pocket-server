import { CreateGoalCompletionUseCase } from "../use-cases/create-goal-completion-use-case";
import { DrizzleGoalsCompletionRepository } from "@/infra/database/drizzle/repositories/drizzle-goals-completion-repository";

export function makeCreateGoalCompletionUseCase() {
  const goalsCompletionRepository = new DrizzleGoalsCompletionRepository();
  const useCase = new CreateGoalCompletionUseCase(goalsCompletionRepository);

  return useCase;
}
