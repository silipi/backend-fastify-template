import fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastifyCors from "@fastify/cors";
import "dotenv/config";

import authenticatePlugin from "./src/plugins/authenticate";
import prismaPlugin from "./src/plugins/prisma";

import authRoutes from "./src/routes/auth/auth.route";
import meRoutes from "./src/routes/me/me.route";

const server = fastify({
  logger: true,
});

server.withTypeProvider<TypeBoxTypeProvider>();
server.register(fastifyCors, {
  origin: "http://localhost:5173",
});

server.register(authenticatePlugin);
server.register(prismaPlugin);

server.register(authRoutes, { prefix: "/auth" });
server.register(meRoutes, { prefix: "/me" });

const PORT = Number(process.env.PORT) || 7171;

server.listen({ port: PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
