import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    let message: string | string[];

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
    ) {
      const responseMessage = (exceptionResponse as { message: unknown })
        .message;

      message =
        typeof responseMessage === 'string' || Array.isArray(responseMessage)
          ? responseMessage
          : 'Internal server error';
    } else {
      message = 'Internal server error';
    }

    response.status(status).json({
      statusCode: status,
      message,
      error:
        status >= 500
          ? 'Internal Server Error'
          : exception instanceof HttpException
            ? exception.name.replace('Exception', '')
            : 'Internal Server Error',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
