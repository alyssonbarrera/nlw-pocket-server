import { DrizzleGoalsRepository } from "@/infra/database/drizzle/repositories/drizzle-goals-repository";
import { GetWeekSummaryUseCase } from "../use-cases/get-week-summary-use-case";

export function makeGetWeekSummaryUseCase() {
  const goalsRepository = new DrizzleGoalsRepository();
  const useCase = new GetWeekSummaryUseCase(goalsRepository);

  return useCase;
}
