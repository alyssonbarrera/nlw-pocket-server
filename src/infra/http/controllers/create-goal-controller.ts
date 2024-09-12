import { z } from "zod";
import type { FastifyReply, FastifyRequest } from "fastify";

import { GoalPresenter } from "../presenters/goal-presenter";
import { makeCreateGoalUseCase } from "@/modules/goals/factories/make-create-goal";

export class CreateGoalController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const createGoalSchema = z.object({
      title: z.string(),
      desiredWeeklyFrequency: z.number().int().min(1).max(7),
    });

    const { title, desiredWeeklyFrequency } = createGoalSchema.parse(
      request.body
    );

    const useCase = makeCreateGoalUseCase();
    const { goal } = await useCase.execute({ title, desiredWeeklyFrequency });

    return reply.status(201).send({ goal: GoalPresenter.toHTTP(goal) });
  }
}
