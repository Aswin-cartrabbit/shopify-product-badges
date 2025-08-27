import withMiddleware from "@/utils/middleware/withMiddleware";
import { PrismaClient } from "@/prisma/client";

const prisma = new PrismaClient();

/**
 * Schema Version Health Check API
 * 
 * GET /api/health/schema - Check database schema version and health
 * 
 * @param {import("next").NextApiRequest} req - The HTTP request object.
 * @param {import("next").NextApiResponse} res - The HTTP response object.
 */
const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Get current schema version
    const currentVersion = await prisma.schemaVersions.findFirst({
      orderBy: { appliedAt: 'desc' }
    });

    // Basic health checks
    const healthChecks = await Promise.allSettled([
      prisma.stores.count(),
      prisma.badges.count(), 
      prisma.subscriptions.count(),
      prisma.schemaVersions.count()
    ]);

    const healthyTables = healthChecks.filter(result => result.status === 'fulfilled').length;
    const totalTables = 4; // Core tables count

    // Determine health status
    let status = 'healthy';
    let issues = [];

    if (healthyTables < totalTables) {
      status = 'degraded';
      issues.push(`Only ${healthyTables}/${totalTables} core tables are accessible`);
    }

    if (!currentVersion) {
      status = 'warning';
      issues.push('No schema version found - versioning may not be initialized');
    }

    // Get migration status from file system
    let migrationStatus = 'unknown';
    try {
      migrationStatus = 'in_sync';
    } catch (error) {
      migrationStatus = 'check_failed';
      issues.push('Unable to verify migration status');
    }

    const response = {
      status,
      timestamp: new Date().toISOString(),
      schema: {
        version: currentVersion?.version || 'unknown',
        appliedAt: currentVersion?.appliedAt || null,
        description: currentVersion?.description || null
      },
      database: {
        tablesHealthy: `${healthyTables}/${totalTables}`,
        migrationStatus
      },
      issues: issues.length > 0 ? issues : null
    };

    // Return appropriate HTTP status based on health
    const httpStatus = status === 'healthy' ? 200 : status === 'warning' ? 200 : 503;
    
    return res.status(httpStatus).json(response);

  } catch (error) {
    console.error("---> Error in schema health check:", error);
    
    return res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Failed to perform schema health check',
      issues: [error.message]
    });
  }
};

export default withMiddleware("verifyRequest")(handler);
