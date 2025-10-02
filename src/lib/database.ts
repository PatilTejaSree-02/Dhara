// Database connection utility for Vercel PostgreSQL
import { sql } from '@vercel/postgres';

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

// Get database configuration from environment variables
export function getDatabaseConfig(): DatabaseConfig {
  return {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    database: process.env.POSTGRES_DATABASE || 'migrant_health',
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || '',
  };
}

// Test database connection
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const result = await sql`SELECT 1 as test`;
    console.log('Database connection successful:', result);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Execute raw SQL queries
export async function executeQuery(query: string, params: any[] = []) {
  try {
    const result = await sql.query(query, params);
    return result;
  } catch (error) {
    console.error('Query execution failed:', error);
    throw error;
  }
}

// Health check endpoint
export async function healthCheck() {
  try {
    const result = await sql`SELECT NOW() as current_time, version() as postgres_version`;
    return {
      status: 'healthy',
      timestamp: result.rows[0]?.current_time,
      version: result.rows[0]?.postgres_version,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
