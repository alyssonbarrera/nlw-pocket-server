import type { FastifyReply, FastifyRequest } from "fastify";

import { makeGetWeekSummaryUseCase } from "@/modules/goals/factories/make-get-week-summary";

export class GetWeekSummaryController {
  async handle(_request: FastifyRequest, reply: FastifyReply) {
    const useCase = makeGetWeekSummaryUseCase();
    const { summary } = await useCase.execute();

    return reply.status(200).send({ summary });
  }
}
