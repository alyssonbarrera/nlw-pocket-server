import { DrizzleGoalsRepository } from "@/infra/database/drizzle/repositories/drizzle-goals-repository";
import { CreateGoalUseCase } from "../use-cases/create-goal-use-case";

export function makeCreateGoalUseCase() {
  const goalsRepository = new DrizzleGoalsRepository();
  const useCase = new CreateGoalUseCase(goalsRepository);

  return useCase;
}
