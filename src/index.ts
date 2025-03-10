import { createFastifyApp } from './create-fastify-app.js';
import { logger } from './logger.js';

const app = await createFastifyApp({ logger });

try {
  await app.startServer();
} catch (error) {
  logger.error(error, 'There was an error initializing Fastify Server');
  throw error;
}
