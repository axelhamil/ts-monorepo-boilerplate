import { env } from "@shared/env";
import { fastify } from "@shared/fastify/config";
import { v1Router } from "@shared/fastify/v1.router";

fastify.register(v1Router, { prefix: "/api/v1" });

fastify.listen({ port: Number(env.PORT), host: "localhost" }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
