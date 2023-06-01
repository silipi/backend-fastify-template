import { FastifyPluginCallback } from "fastify";
import bcrypt from "bcrypt";
import { LoginUser, LoginUserType, User, UserType } from "./auth.model";

const authRoutes: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.post<{
    Body: UserType;
  }>(
    "/register",
    {
      schema: {
        body: User,
      },
    },
    async (request, reply) => {
      const { username, email, name, password } = request.body;

      const hashedPassword = bcrypt.hashSync(password, 10);

      // find user with same username or email
      const existingUser = await fastify.prisma.user.findFirst({
        where: { OR: [{ username }, { email }] },
      });

      if (existingUser) {
        return reply.status(409).send({
          statusCode: 409,
          error: "USER_ALREADY_EXISTS",
          message: "User already exists",
        });
      }

      const user = await fastify.prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          username,
        },
      });

      reply.status(201).send(user);
    }
  );

  fastify.post<{
    Body: LoginUserType;
  }>(
    "/login",
    {
      schema: {
        body: LoginUser,
      },
    },
    async (request, reply) => {
      const { username, password } = request.body;

      const user = await fastify.prisma.user.findUnique({
        where: {
          username,
        },
      });

      if (!user) {
        return reply.status(404).send({
          statusCode: 404,
          error: "USER_NOT_FOUND",
          message: "User not found",
        });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) {
        return reply.status(401).send({
          statusCode: 401,
          error: "INVALID_PASSWORD",
          message: "Invalid password",
        });
      }

      const token = fastify.jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        {
          expiresIn: "1d",
        }
      );

      return {
        access_token: token,
      };
    }
  );

  done();
};

export default authRoutes;
