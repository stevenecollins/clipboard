import { Router, Request, Response } from 'express';
import { prisma } from '@/config/database';
import { ApiResponse } from '@/types/api';

const router = Router();

interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  version: string;
  services: {
    database: 'connected' | 'disconnected';
  };
}

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    const dbStatus = 'connected';

    const healthData: HealthCheckResponse = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: dbStatus,
      },
    };

    const response: ApiResponse<HealthCheckResponse> = {
      success: true,
      data: healthData,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Health check failed:', error);
    
    const healthData: HealthCheckResponse = {
      status: 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: 'disconnected',
      },
    };

    const response: ApiResponse<HealthCheckResponse> = {
      success: false,
      data: healthData,
      error: {
        message: 'Health check failed',
      },
    };

    res.status(503).json(response);
  }
});

export { router as healthRouter };