import cors from "@fastify/cors";
import { HttpCode, HttpException, type HttpResponse } from "@packages/libs";
import { env } from "@shared/env";
import Fastify from "fastify";

const loggerConfig = {
  development: {
    transport: {
      options: {
        ignore: "pid,hostname",
        translateTime: "HH:MM:ss Z",
      },
      target: "pino-pretty",
    },
  },
  production: env.NODE_ENV === "production",
  test: env.NODE_ENV === "test",
};

export const fastify = Fastify({
  ajv: {
    customOptions: {
      keywords: ["example"],
      strict: "log",
    },
  },
  logger: loggerConfig[env.NODE_ENV as keyof typeof loggerConfig],
  disableRequestLogging: true,
});

fastify.register(cors, {
  origin: (origin, cb): void => {
    const allowedOrigins = env.CORS_ORIGIN.split(",").map((o) => o.trim());
    if (!origin || allowedOrigins.includes(origin)) {
      cb(null, true);
      return;
    }
    cb(new Error("Not allowed by CORS"), false);
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Authorization", "Content-Type"],
});

fastify.addHook("preSerialization", (_request, reply, payload, done) => {
  if (payload && typeof payload === "object" && "statusCode" in payload) {
    return done(null, payload);
  }

  const httpResponsePayload: HttpResponse = {
    statusCode: reply.statusCode,
    message: "success",
    timestamp: new Date(),
    data: payload,
  };

  done(null, httpResponsePayload);
});

fastify.addHook("onResponse", (request, reply, done) => {
  request.log.info(
    `${request.method} ${request.url} ${reply.statusCode} ${reply.elapsedTime}ms`,
    "Request completed",
  );
  done();
});

fastify.setErrorHandler((error, request, reply) => {
  request.log.error(
    {
      err: error,
      route: `${request.method} ${request.url}`,
      requestId: request.id,
      requestBody: request.body,
      requestParams: request.params,
      requestQuery: request.query,
    },
    "Request error occurred",
  );

  if (error instanceof HttpException) {
    const errorResponse: HttpResponse = {
      statusCode: error.httpCode,
      message: "error",
      timestamp: new Date(),
      data: null,
      error: {
        name: error.constructor.name || "HttpException",
        code: error.code || `ERR_${error.httpCode}`,
        details: {
          message: error.message,
        },
      },
    };

    return reply.status(error.httpCode).send(errorResponse);
  }

  const isOperationalError = error instanceof Error && !!error.name;
  const internalErrorResponse: HttpResponse = {
    statusCode: HttpCode.INTERNAL_SERVER_ERROR,
    message: "error",
    timestamp: new Date(),
    data: null,
    error: {
      name: isOperationalError ? error.name : "InternalServerError",
      code: "ERR_INTERNAL",
      details:
        env.NODE_ENV === "production"
          ? "Internal Server Error"
          : error.message || "Internal Server Error",
      stack: env.NODE_ENV === "development" ? error.stack : undefined,
    },
  };

  return reply
    .status(HttpCode.INTERNAL_SERVER_ERROR)
    .send(internalErrorResponse);
});
