import type { FastifyPluginAsync } from 'fastify';

export const statusRoutesPlugin: FastifyPluginAsync<{
  healthEndpoint: string;
  statusEndpoint: string;
}> = async (app, { healthEndpoint, statusEndpoint }) => {
  app.get(statusEndpoint, (_, reply) => {
    reply.status(200).send('OK');
  });

  app.get(healthEndpoint, (_, reply) => {
    reply.status(200).send('OK');
  });
};
