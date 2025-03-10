import { randomUUID } from 'node:crypto';

import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import sensible from '@fastify/sensible';
import { fastify, type FastifyBaseLogger } from 'fastify';

import { config } from './config.js';
import { requestsLoggerPlugin } from './plugins/requests-logger-plugin.js';
import { statusRoutesPlugin } from './plugins/status-routes-plugin.js';
import { routesPlugin } from './routes-plugin.js';

export const createFastifyApp = async ({ logger }: { logger: FastifyBaseLogger }) => {
  const {
    connectionTimeoutMs,
    healthEndpoint,
    isProduction,
    keepAliveTimeoutMs,
    port,
    requestTimeoutMs,
    serviceMonitoringEndpoints,
    statusEndpoint,
  } = config;

  const app = fastify({
    connectionTimeout: connectionTimeoutMs,
    disableRequestLogging: true,
    genReqId: () => randomUUID(),
    keepAliveTimeout: keepAliveTimeoutMs,
    loggerInstance: logger,
    requestTimeout: requestTimeoutMs,
  });

  // Replaces the default logger with the one provided and disabled with the `disableRequestLogging` option
  app.register(requestsLoggerPlugin, { excludedRoutes: serviceMonitoringEndpoints });

  app.register(cors, { origin: true });

  app.register(helmet);

  app.register(sensible);

  app.register(statusRoutesPlugin, { healthEndpoint, statusEndpoint });

  app.register(routesPlugin);

  app.ready((error) => {
    if (error) {
      app.log.error(error, 'There was an error initializing Fastify Server');
      throw error;
    }

    app.log.info('Fastify Server ready!');
  });

  return {
    app,
    async startServer() {
      try {
        await app.listen({ host: isProduction ? '0.0.0.0' : '127.0.0.1', port });
        app.log.info(app.printRoutes({ commonPrefix: false }));
      } catch (error) {
        app.log.error(error);
        process.exit(1);
      }
    },
  };
};
