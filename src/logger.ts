import { pino } from 'pino';

import { config } from './config';

const { logLevel, isProduction } = config;

const stdOutTarget = {
  target: 'pino/file',
  level: logLevel,
  options: {},
};

const pinoPrettyTarget = {
  target: 'pino-pretty',
  level: logLevel,
  options: {
    colorize: true,
    ignore: 'pid,hostname,app,nodeJs',
    // TranslateTime: 'yyyy/mm/dd HH:MM:ss Z',
    translateTime: 'HH:MM:ss Z',
  },
};

export const globalLogger = pino({
  transport: {
    targets: [
      // To make sure we always print to console regardless if production or not
      isProduction ? stdOutTarget : pinoPrettyTarget,
    ].filter(Boolean),
  },
  level: logLevel,
});

export const logger = globalLogger.child({
  nodeJs: { pid: process.pid, version: process.version },
});

export const createChildLogger = (module: string) => logger.child({ module });

export type Logger = pino.Logger;

export type BaseLogger = pino.BaseLogger;
