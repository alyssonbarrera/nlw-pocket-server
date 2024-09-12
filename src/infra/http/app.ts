import dayjs from "dayjs";
import fastify from "fastify";
import { ZodError } from "zod";
import dayjslocale from "dayjs/locale/pt-br";
import { AppError } from "@/core/errors/app-error";
import { goalsRoutes } from "./routes/goals.routes";
import fastifyCors from "@fastify/cors";

dayjs.locale(dayjslocale);

export const app = fastify();

app.register(fastifyCors, {
  origin: "*",
});

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

  console.error(error);
  return reply.status(500).send({ message: "Internal server error" });
});
