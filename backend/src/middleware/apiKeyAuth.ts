import type { FastifyInstance } from 'fastify';
import { env } from '../env.js';

/**
 * Require an API key on every route except the public health check.
 * The key may be sent as `x-api-key` or as a Bearer token.
 *
 * In development a default dev key is accepted so the app runs with zero
 * setup. In production `API_KEY` MUST be set to a real secret — requests
 * without a valid key are rejected with 401.
 */
export function registerApiKeyAuth(fastify: FastifyInstance) {
  const expected = env.API_KEY;

  fastify.addHook('onRequest', async (request, reply) => {
    // Public health endpoint — no auth required.
    if (request.routeOptions.url === '/health') return;

    const headerKey = request.headers['x-api-key'];
    const authHeader = request.headers['authorization'];
    const bearer = typeof authHeader === 'string' ? authHeader.replace(/^Bearer\s+/i, '') : undefined;

    const provided = (typeof headerKey === 'string' ? headerKey : bearer) ?? '';

    // Constant-time-ish comparison to avoid trivial timing leaks.
    const a = Buffer.from(provided);
    const b = Buffer.from(expected);
    const valid = a.length === b.length && a.equals(b);

    if (!valid) {
      return reply.code(401).send({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Missing or invalid API key' },
      });
    }
  });
}
