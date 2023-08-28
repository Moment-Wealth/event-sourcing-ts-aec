import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";

import { CommandHandlerValidationError } from "@monorepo/core/src/app/errors/app.errors";
import { AggregateValidationError } from "@monorepo/core/src/domain/errors/domain.errors";
import {
  ConcurrencyError,
  WrongIdentifierError,
} from "@monorepo/core/src/infra/errors/infra.errors";

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  private readonly logger: Logger;
  constructor() {
    this.logger = new Logger();
  }
  catch(exception: Error, host: ArgumentsHost): any {
    let priorityMessage;
    let priorityStatus;
    if (exception.name == CommandHandlerValidationError.name) {
      priorityStatus = 422;
      priorityMessage = exception.message;
    }
    if (
      exception.name == AggregateValidationError.name ||
      exception.name == WrongIdentifierError.name
    ) {
      priorityStatus = 400;
      priorityMessage = exception.message;
    }
    if (exception.name == ConcurrencyError.name) {
      priorityStatus = 409;
      priorityMessage = exception.message;
    } else {
    }
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const statusCode =
      priorityStatus ||
      (exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR);
    const message =
      priorityMessage ||
      (exception instanceof HttpException
        ? exception.message
        : "Internal server error");

    // If there are validation errors, the exception.message will contain an array of ValidationError objects
    const validationErrors = exception.message["message"];
    if (Array.isArray(validationErrors)) {
      const errorResponse = validationErrors.map((error) => {
        // For each failed field validation, this will list the property, the failed constraints, and their error messages
        return {
          field: error.property,
          errors: Object.values(error.constraints),
        };
      });
      return response.status(400).json({ errors: errorResponse });
    } else if (exception instanceof BadRequestException) {
      const exceptionResponse = exception.getResponse();
      response.status(exception.getStatus()).json(exception.getResponse());
    } else {
      if (statusCode == 500) {
        throw exception;
      }
      const devErrorResponse: any = {
        statusCode,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        errorName: exception?.name,
        message: message,
      };

      this.logger.log(
        `request method: ${request.method} request url${request.url}`,
        JSON.stringify(devErrorResponse)
      );
      response.status(statusCode).json(devErrorResponse);
    }
  }
}
