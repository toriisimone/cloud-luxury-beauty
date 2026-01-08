/**
 * Automatic Prisma migrations on startup
 * Runs `prisma migrate deploy` programmatically to ensure database schema is up to date
 */
import { exec } from 'child_process';
import { promisify } from 'util';
import { logger } from '../config/logger';
import path from 'path';

const execAsync = promisify(exec);

export async function autoMigrate(): Promise<void> {
  try {
    logger.info('Running automatic database migrations...');
    console.log('DEBUG: Starting automatic migrations...');

    // Get the backend directory path (where prisma schema lives)
    const backendDir = path.resolve(__dirname, '../..');
    const prismaSchemaPath = path.join(backendDir, 'prisma', 'schema.prisma');

    logger.info(`Running: npx prisma migrate deploy`);
    console.log(`DEBUG: Executing: cd ${backendDir} && npx prisma migrate deploy`);

    // Run prisma migrate deploy
    // This command will:
    // - Apply all pending migrations
    // - Create tables if they don't exist
    // - Do nothing if migrations are already applied
    const { stdout, stderr } = await execAsync('npx prisma migrate deploy', {
      cwd: backendDir,
      env: {
        ...process.env,
        // Ensure DATABASE_URL is available
        DATABASE_URL: process.env.DATABASE_URL || '',
      },
    });

    if (stdout) {
      logger.info('Migration output:', stdout);
      console.log('DEBUG: Migration stdout:', stdout);
    }

    if (stderr && !stderr.includes('No pending migrations')) {
      // stderr might contain warnings, but we'll log it
      logger.warn('Migration stderr:', stderr);
      console.log('DEBUG: Migration stderr:', stderr);
    }

    logger.info('Database migrations completed successfully');
    console.log('DEBUG: Migrations applied successfully');
  } catch (error: any) {
    // Check if error is just "no pending migrations" - that's fine
    if (error.message?.includes('No pending migrations') || 
        error.stderr?.includes('No pending migrations')) {
      logger.info('No pending migrations - database schema is up to date');
      console.log('DEBUG: No pending migrations - schema already up to date');
      return;
    }

    // For other errors, log but don't crash
    logger.error('Automatic migration failed:', error);
    console.error('DEBUG: Migration error:', error.message);
    console.error('DEBUG: Migration error code:', error.code);
    
    // If migrations fail, we should still try to continue
    // The server might still work if tables already exist
    logger.warn('Server will continue, but database schema may be incomplete');
    throw error; // Re-throw so caller can decide what to do
  }
}
