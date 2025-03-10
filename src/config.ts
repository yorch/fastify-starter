import 'dotenv/config';

import getenv from 'getenv';

// Because `getenv` is a CommonJS module, we have to use the `default` export
const environmentVariables = getenv.multi({
  nodeEnv: ['NODE_ENV', 'development', 'string'],
  logLevel: ['LOG_LEVEL', 'info', 'string'],
  port: ['PORT', 3000, 'int'],

  // Endpoints
  rawHealthEndpoint: ['HEALTH_ENDPOINT', '/health', 'string'],
  rawStatusEndpoint: ['STATUS_ENDPOINT', '/status', 'string'],

  // Defines the server timeout in milliseconds
  // Fastify default: 0 (no limit)
  connectionTimeoutMs: ['CONNECTION_TIMEOUT_MS', 60_000, 'int'],

  // Defines the maximum number of milliseconds for receiving the entire request from the client
  // Fastify default: 0 (no limit)
  requestTimeoutMs: ['REQUEST_TIMEOUT_MS', 60_000, 'int'],

  // Defines the maximum number of milliseconds for the server to keep the connection open
  // Fastify default: 72000 (72 seconds)
  keepAliveTimeoutMs: ['KEEP_ALIVE_TIMEOUT_MS', 72_000, 'int'],
});

const healthEndpoint = environmentVariables.rawHealthEndpoint.startsWith('/')
  ? environmentVariables.rawHealthEndpoint
  : `/${environmentVariables.rawHealthEndpoint}`;

const statusEndpoint = environmentVariables.rawStatusEndpoint.startsWith('/')
  ? environmentVariables.rawStatusEndpoint
  : `/${environmentVariables.rawStatusEndpoint}`;

export const config = {
  ...environmentVariables,
  isProduction: environmentVariables.nodeEnv === 'production',

  // Endpoints
  healthEndpoint,
  statusEndpoint,

  serviceMonitoringEndpoints: [healthEndpoint, statusEndpoint],
};
