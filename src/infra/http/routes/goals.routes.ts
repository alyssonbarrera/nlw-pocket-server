import type { FastifyInstance } from "fastify";
import { CreateGoalController } from "../controllers/create-goal-controller";
import { GetWeekPendingGoalsController } from "../controllers/get-week-pending-goals-controller";
import { CreateGoalCompletionController } from "../controllers/create-goal-completion-controller";
import { GetWeekSummaryController } from "../controllers/get-week-summary-controller";

const createGoalController = new CreateGoalController();
const getWeekPendingGoalsController = new GetWeekPendingGoalsController();
const createGoalCompletionController = new CreateGoalCompletionController();
const getWeekSummaryController = new GetWeekSummaryController();

export async function goalsRoutes(app: FastifyInstance) {
  app.post("/goals", createGoalController.handle);
  app.get("/pending-goals", getWeekPendingGoalsController.handle);
  app.post("/goal-completion", createGoalCompletionController.handle);
  app.get("/summary", getWeekSummaryController.handle);
}
