import type { FastifyPluginAsync } from 'fastify';

export const routesPlugin: FastifyPluginAsync = async (app) => {
  app.get('/', (_, reply) => {
    reply.status(200).send('OK');
  });
};
