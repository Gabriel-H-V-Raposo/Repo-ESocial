import { FastifyInstance } from "fastify";
import { ZodError } from "zod";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    reply.status(400).send({
      message: "Validation error",
      errors: error.flatten().fieldErrors,
    });
    return;
  }

  if ("statusCode" in error) {
    const { statusCode, message, details } = error as any;
    reply.status(statusCode).send({ message, details });
    return;
  }

  console.error(error);

  //TODO: enviar o erro para alguma ferramenta de observabilidade

  reply.status(500).send({ message: "Internal server error" });
};
