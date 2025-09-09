import { NextRequest } from 'next/server';
import { formatSuccessResponse, formatErrorResponse } from '@/lib/errorHandler';
import { client } from '@/sanity/lib/client';

interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  services: {
    database: 'connected' | 'disconnected' | 'error';
    sanity: 'connected' | 'disconnected' | 'error';
  };
  uptime: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
}

const startTime = Date.now();

export async function GET(request: NextRequest) {
  try {
    const healthCheck: HealthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: 'connected', // TODO: Add actual database check
        sanity: 'disconnected'
      },
      uptime: Date.now() - startTime,
      memory: {
        used: 0,
        total: 0,
        percentage: 0
      }
    };

    // Check Sanity connection
    try {
      await client.fetch('*[_type == "user"][0]');
      healthCheck.services.sanity = 'connected';
    } catch (error) {
      console.error('Sanity health check failed:', error);
      healthCheck.services.sanity = 'error';
      healthCheck.status = 'unhealthy';
    }

    // Check memory usage
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memUsage = process.memoryUsage();
      healthCheck.memory = {
        used: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
        total: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
        percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100)
      };
    }

    // Determine overall status
    const allServicesHealthy = Object.values(healthCheck.services).every(
      status => status === 'connected'
    );
    
    if (!allServicesHealthy) {
      healthCheck.status = 'unhealthy';
    }

    const statusCode = healthCheck.status === 'healthy' ? 200 : 503;
    
    return formatSuccessResponse(
      healthCheck,
      `ระบบ${healthCheck.status === 'healthy' ? 'ทำงานปกติ' : 'มีปัญหา'}`,
      statusCode
    );
  } catch (error) {
    console.error('Health check error:', error);
    return formatErrorResponse(error);
  }
}

// Detailed health check endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { detailed = false } = body;

    if (!detailed) {
      // Return simple health check
      return formatSuccessResponse({ status: 'healthy' });
    }

    // Perform detailed checks
    const checks = {
      sanity: false,
      auth: false,
      environment: false
    };

    // Check Sanity
    try {
      const result = await client.fetch('*[_type == "user"] | order(_createdAt desc) [0]');
      checks.sanity = true;
    } catch (error) {
      console.error('Detailed Sanity check failed:', error);
    }

    // Check environment variables
    checks.environment = !!(process.env.SANITY_PROJECT_ID && process.env.SANITY_DATASET);

    // Check auth configuration
    checks.auth = !!(process.env.NEXTAUTH_SECRET && process.env.GOOGLE_CLIENT_ID);

    const allChecksPass = Object.values(checks).every(Boolean);

    return formatSuccessResponse({
      status: allChecksPass ? 'healthy' : 'unhealthy',
      checks,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return formatErrorResponse(error);
  }
}