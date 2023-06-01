import { FastifyPluginCallback } from "fastify";

const meRoutes: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.addHook("preHandler", fastify.authenticate);

  fastify.get("/", async (request, reply) => {
    const user = await fastify.prisma.user.findUnique({
      where: {
        id: (request.user as any).id,
      },
    });

    if (!user) {
      return reply.status(404).send({
        statusCode: 404,
        error: "USER_NOT_FOUND",
        message: "User not found",
      });
    }

    reply.send(user);
  });

  done();
};

export default meRoutes;
