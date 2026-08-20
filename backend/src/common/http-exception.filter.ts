import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

function codigoPorDefecto(status: number): string {
  switch (status) {
    case HttpStatus.BAD_REQUEST:
      return 'VALIDATION_ERROR';
    case HttpStatus.UNAUTHORIZED:
      return 'UNAUTHORIZED';
    case HttpStatus.FORBIDDEN:
      return 'FORBIDDEN';
    case HttpStatus.NOT_FOUND:
      return 'NOT_FOUND';
    case HttpStatus.CONFLICT:
      return 'CONFLICT';
    case HttpStatus.UNPROCESSABLE_ENTITY:
      return 'VALIDATION_ERROR';
    default:
      return 'INTERNAL_ERROR';
  }
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let code: string | undefined;
    let message = 'Error interno del servidor.';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const cuerpo = exception.getResponse();

      if (typeof cuerpo === 'string') {
        message = cuerpo;
      } else if (typeof cuerpo === 'object' && cuerpo !== null) {
        const c = cuerpo as Record<string, unknown>;
        message = Array.isArray(c.message)
          ? c.message.join(', ')
          : ((c.message as string) ?? exception.message);
        code = c.code as string | undefined;
      }
    }

    code = code ?? codigoPorDefecto(statusCode);

    response.status(statusCode).json({
      statusCode,
      code,
      message,
      path: request.url,
    });
  }
}
