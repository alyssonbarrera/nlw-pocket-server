import { env } from "@/infra/env";
import { app } from "./app";

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log("HTTP server is running on port 3000");
  });
