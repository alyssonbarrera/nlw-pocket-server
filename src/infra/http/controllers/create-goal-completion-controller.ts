import { z } from "zod";
import type { FastifyReply, FastifyRequest } from "fastify";

import { makeCreateGoalCompletionUseCase } from "@/modules/goals-completion/factories/make-create-goal-completion";
import { GoalCompletionPresenter } from "../presenters/goal-completion-presenter";

export class CreateGoalCompletionController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const createGoalCompletionSchema = z.object({
      goalId: z.string(),
    });

    const { goalId } = createGoalCompletionSchema.parse(request.body);

    const useCase = makeCreateGoalCompletionUseCase();
    const { goalCompletion } = await useCase.execute(goalId);

    return reply
      .status(201)
      .send({ goalCompletion: GoalCompletionPresenter.toHTTP(goalCompletion) });
  }
}
