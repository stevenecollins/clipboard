import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  
  // Log request
  console.log(`📥 ${req.method} ${req.path} - ${req.ip}`);
  
  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(...args: any[]): Response {
    const duration = Date.now() - startTime;
    console.log(`📤 ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    return originalEnd.apply(this, args);
  };
  
  next();
};