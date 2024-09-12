import type { FastifyReply, FastifyRequest } from "fastify";

import { GoalPresenter } from "../presenters/goal-presenter";
import { makeGetWeekPendingGoalsUseCase } from "@/modules/goals/factories/make-get-week-pending-goals";

export class GetWeekPendingGoalsController {
  async handle(_request: FastifyRequest, reply: FastifyReply) {
    const useCase = makeGetWeekPendingGoalsUseCase();
    const { goals } = await useCase.execute();

    return reply.status(201).send({ goals: goals.map(GoalPresenter.toHTTP) });
  }
}
