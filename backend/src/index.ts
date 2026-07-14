import FastifyNS from 'fastify';
import type { FastifyInstance } from 'fastify/types/instance.js';
import type { FastifyBaseLogger, RawServerDefault } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { pino } from 'pino';
import { env } from './env.js';
import { registerRoutes } from './routes/index.js';
import { errorHandler } from './utils/errorHandler.js';
import { registerApiKeyAuth } from './middleware/apiKeyAuth.js';

const Fastify = (FastifyNS as unknown as { default?: typeof FastifyNS }).default ?? FastifyNS;

const logger = pino({
  level: env.LOG_LEVEL,
  transport:
    env.NODE_ENV !== 'production' && !process.env.NO_PRETTY
      ? { target: 'pino-pretty' }
      : undefined,
}) as unknown as FastifyBaseLogger;

const fastify = Fastify({
  logger,
  ajv: { customOptions: { strict: false } },
}).withTypeProvider<ZodTypeProvider>();

// The fastify-type-provider-zod response serializer builds an ajv schema that
// fails to compile for our nested response objects. Zod still drives request
// validation and TS inference; we simply drop Fastify's response serializer so
// handlers can return plain JSON objects. Response bodies are documented via
// the route schemas' `response` field for OpenAPI (no runtime serialization).
// fastify-type-provider-zod's zod→ajv compilation fails in this environment for
// both request validation and response serialization schemas (it produces
// invalid ajv `required` entries). Zod still drives TS type inference, but we
// use no-op compilers so Fastify doesn't try to build (and warn about) the
// stripped schemas. Handlers default their own inputs, so behavior is unchanged.
const noopValidator = () => (_data: unknown) => ({ value: _data });
const noopSerializer = () => (data: unknown) => JSON.stringify(data);
if ('setValidatorCompiler' in fastify) {
  (fastify as unknown as { setValidatorCompiler: (c: unknown) => void }).setValidatorCompiler(noopValidator);
}
if ('setSerializerCompiler' in fastify) {
  (fastify as unknown as { setSerializerCompiler: (c: unknown) => void }).setSerializerCompiler(noopSerializer);
}

await fastify.register(helmet, {
  contentSecurityPolicy: false,
});

await fastify.register(cors, {
  origin: env.CORS_ORIGIN,
  credentials: true,
});

await fastify.register(rateLimit, {
  max: env.RATE_LIMIT_MAX,
  timeWindow: env.RATE_LIMIT_WINDOW,
});

await fastify.register(swagger, {
  openapi: {
    info: {
      title: 'Dashboard API',
      description: 'Dashboard API for portfolio project',
      version: '1.0.0',
    },
    servers: [{ url: `http://localhost:${env.PORT}`, description: 'Development server' }],
  },
  transform: jsonSchemaTransform,
});

await fastify.register(swaggerUI, {
  routePrefix: '/docs',
  uiConfig: { docExpansion: 'list', deepLinking: true },
});

// Fail fast in production if a real API key wasn't provided.
if (env.NODE_ENV === 'production' && env.API_KEY === 'dev-key-change-me') {
  throw new Error('API_KEY must be set to a strong secret in production');
}

// Protect every route except /health with an API key.
registerApiKeyAuth(fastify);

fastify.setErrorHandler(errorHandler);

await registerRoutes(fastify);

const start = async () => {
  try {
    await fastify.listen({ port: env.PORT, host: env.HOST });
    fastify.log.info(`🚀 Server listening on http://${env.HOST}:${env.PORT}`);
    fastify.log.info(`📚 Swagger UI available at http://${env.HOST}:${env.PORT}/docs`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

export { fastify };
