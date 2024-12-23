import { EventBus } from './eventBus';

export enum ErrorType {
  SERVO = 'SERVO',
  PATTERN = 'PATTERN',
  EXECUTION = 'EXECUTION',
  VALIDATION = 'VALIDATION',
  HARDWARE = 'HARDWARE',
  UNKNOWN = 'UNKNOWN'
}

export interface AppError extends Error {
  type: ErrorType;
  details?: any;
  timestamp: string;
}

class ErrorHandlerClass {
  private errors: AppError[] = [];

  handleError(error: Error, type: ErrorType = ErrorType.UNKNOWN, details?: any) {
    const appError: AppError = {
      name: error.name,
      message: error.message,
      type,
      details,
      timestamp: new Date().toISOString(),
      stack: error.stack
    };

    this.errors.push(appError);
    this.logError(appError);
    EventBus.emit('error', appError);

    return appError;
  }

  handleServoError(error: Error, details?: any) {
    return this.handleError(error, ErrorType.SERVO, details);
  }

  handlePatternError(error: Error, details?: any) {
    return this.handleError(error, ErrorType.PATTERN, details);
  }

  handleExecutionError(error: Error, details?: any) {
    return this.handleError(error, ErrorType.EXECUTION, details);
  }

  handleValidationError(error: Error, details?: any) {
    return this.handleError(error, ErrorType.VALIDATION, details);
  }

  handleHardwareError(error: Error, details?: any) {
    return this.handleError(error, ErrorType.HARDWARE, details);
  }

  private logError(error: AppError) {
    console.error(`[${error.type}] ${error.timestamp}: ${error.message}`, {
      details: error.details,
      stack: error.stack
    });
  }

  getErrors() {
    return [...this.errors];
  }

  clearErrors() {
    this.errors = [];
  }

  getLastError() {
    return this.errors[this.errors.length - 1];
  }
}

export const ErrorHandler = new ErrorHandlerClass();
