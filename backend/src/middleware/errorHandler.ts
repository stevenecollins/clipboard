import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { statusCode = 500, message } = err;

  // Log error details (you might want to use a proper logger here)
  console.error(`❌ Error ${statusCode}: ${message}`);
  console.error(err.stack);

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const errorResponse = {
    success: false,
    error: {
      message: isDevelopment ? message : 'Internal Server Error',
      ...(isDevelopment && { stack: err.stack }),
      ...(isDevelopment && { details: err }),
    },
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
  };

  res.status(statusCode).json(errorResponse);
};