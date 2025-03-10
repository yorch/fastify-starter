import fp from 'fastify-plugin';

const isRouteExcludedRaw = (excludedRoutes: Array<string | RegExp>, route: string | undefined) =>
  excludedRoutes.some((excludedRoute) =>
    excludedRoute instanceof RegExp ? excludedRoute.test(route ?? '') : excludedRoute === route,
  );

// Logs requests, similar to standard fastify logger, but with more details
export const requestsLoggerPlugin = fp<{ excludedRoutes: Array<string | RegExp> }>(
  async (app, { excludedRoutes }) => {
    const isRouteExcluded = isRouteExcludedRaw.bind(isRouteExcludedRaw, excludedRoutes);

    app.addHook('onRequest', (request, _, done) => {
      if (!isRouteExcluded(request.raw.url)) {
        request.log.info(
          {
            // ReqId is already added by fastify
            req: request,
          },
          'Received request',
        );
      }

      done();
    });

    app.addHook('onResponse', (request, reply, done) => {
      if (!isRouteExcluded(request.raw.url)) {
        request.log.info(
          {
            // ReqId is already added by fastify
            req: request,
            res: { statusCode: reply.raw.statusCode },
            responseTime: reply.elapsedTime,
          },
          'Request completed',
        );
      }

      done();
    });

    app.addHook('onTimeout', (request, reply, done) => {
      request.log.error(
        // ReqId is already added by fastify
        {
          req: request,
          elapsedTime: reply.elapsedTime,
        },
        'Request timed out',
      );

      done();
    });

    app.addHook('onRequestAbort', (request, done) => {
      request.log.warn(
        // ReqId is already added by fastify
        { req: request },
        'Request aborted',
      );

      done();
    });
  },
  {
    name: 'requests-logger-plugin',
  },
);
