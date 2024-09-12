import fastify from "fastify";
import { ZodError } from "zod";
import { goalsRoutes } from "./routes/goals.routes";
import { AppError } from "@/core/errors/app-error";

export const app = fastify();

app.register(goalsRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error", issues: error.format() });
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({ message: error.message });
  }
});
