import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: FastifyRequest, res: FastifyReply['raw'], next: () => void) {
    console.time('Request-response time');

    console.log(
      '[MIDDLEWARE][LOGGING] ' +
        req.method +
        ' ' +
        `${req.protocol}://${req.hostname}${req.originalUrl}`,
    );
    res.on('finish', () => console.timeEnd('Request-response time'));
    next();
  }
}
