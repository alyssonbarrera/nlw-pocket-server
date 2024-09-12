import { DrizzleGoalsRepository } from "@/infra/database/drizzle/repositories/drizzle-goals-repository";
import { GetWeekPendingGoalsUseCase } from "../use-cases/get-week-pending-goals-use-case";

export function makeGetWeekPendingGoalsUseCase() {
  const goalsRepository = new DrizzleGoalsRepository();
  const useCase = new GetWeekPendingGoalsUseCase(goalsRepository);

  return useCase;
}
