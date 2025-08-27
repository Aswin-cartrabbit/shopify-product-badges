/**
 * Schema Versioning Utilities
 * 
 * This file provides utility functions for managing schema versions
 * and tracking database changes safely.
 */

import { PrismaClient } from '../prisma/client/index.js';

const prisma = new PrismaClient();

/**
 * Get the current schema version from the database
 */
export async function getCurrentSchemaVersion() {
  try {
    const latestVersion = await prisma.schemaVersions.findFirst({
      orderBy: { appliedAt: 'desc' }
    });
    
    return latestVersion;
  } catch (error) {
    console.error('Error fetching schema version:', error);
    return null;
  }
}

/**
 * Record a new schema version after a migration
 */
export async function recordSchemaVersion(version, description, migrationFile) {
  try {
    const newVersion = await prisma.schemaVersions.create({
      data: {
        version,
        description,
        migrationFile,
        checksum: generateChecksum(version + description)
      }
    });
    
    console.log(`✅ Schema version ${version} recorded successfully`);
    return newVersion;
  } catch (error) {
    console.error('Error recording schema version:', error);
    throw error;
  }
}

/**
 * Get all schema versions history
 */
export async function getSchemaHistory() {
  try {
    const versions = await prisma.schemaVersions.findMany({
      orderBy: { appliedAt: 'desc' }
    });
    
    return versions;
  } catch (error) {
    console.error('Error fetching schema history:', error);
    return [];
  }
}

/**
 * Check if database is in sync with expected version
 */
export async function checkSchemaSync(expectedVersion) {
  try {
    const currentVersion = await getCurrentSchemaVersion();
    
    if (!currentVersion) {
      return {
        isSync: false,
        message: 'No schema version found in database'
      };
    }
    
    if (currentVersion.version !== expectedVersion) {
      return {
        isSync: false,
        message: `Schema mismatch. Expected: ${expectedVersion}, Current: ${currentVersion.version}`
      };
    }
    
    return {
      isSync: true,
      message: `Schema is in sync (${currentVersion.version})`
    };
  } catch (error) {
    return {
      isSync: false,
      message: `Error checking schema sync: ${error.message}`
    };
  }
}

/**
 * Generate a simple checksum for version tracking
 */
function generateChecksum(data) {
  import('crypto').then(crypto => {
    return crypto.createHash('md5').update(data).digest('hex');
  });
  // For now, return a simple hash-like string
  return data.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0).toString(16);
}

/**
 * Initialize schema versioning for existing database
 */
export async function initializeSchemaVersioning() {
  try {
    // Check if schemaVersions table exists and has data
    const existingVersions = await prisma.schemaVersions.count();
    
    if (existingVersions === 0) {
      // Record initial versions
      await recordSchemaVersion(
        '1.0.0',
        'Initial badge app schema with all core tables',
        '20250824065517_initial_badge_app_schema'
      );
      
      await recordSchemaVersion(
        '2.0.0',
        'Added schema versioning tracking table',
        '20250824065550_add_schema_versioning'
      );
      
      console.log('✅ Schema versioning initialized successfully');
    } else {
      console.log('✅ Schema versioning already initialized');
    }
  } catch (error) {
    console.error('Error initializing schema versioning:', error);
    throw error;
  }
}

/**
 * Validate database health and schema consistency
 */
export async function validateDatabaseHealth() {
  const health = {
    schemaVersion: null,
    tableCount: 0,
    migrationStatus: 'unknown',
    errors: []
  };
  
  try {
    // Get current schema version
    health.schemaVersion = await getCurrentSchemaVersion();
    
    // Count tables (basic health check)
    const tableChecks = await Promise.allSettled([
      prisma.stores.count(),
      prisma.badges.count(),
      prisma.subscriptions.count(),
      prisma.schemaVersions.count()
    ]);
    
    health.tableCount = tableChecks.filter(result => result.status === 'fulfilled').length;
    
    // Check for errors
    const errors = tableChecks
      .filter(result => result.status === 'rejected')
      .map(result => result.reason.message);
    
    health.errors = errors;
    health.migrationStatus = errors.length === 0 ? 'healthy' : 'issues_detected';
    
  } catch (error) {
    health.errors.push(error.message);
    health.migrationStatus = 'error';
  }
  
  return health;
}

/**
 * CLI command handler for schema version utilities
 */
async function handleCLI() {
  const command = process.argv[2];
  
  switch (command) {
    case 'current':
      const current = await getCurrentSchemaVersion();
      console.log('Current schema version:', current ? current.version : 'None');
      break;
      
    case 'history':
      const history = await getSchemaHistory();
      console.log('Schema version history:');
      history.forEach(v => {
        console.log(`  ${v.version} - ${v.appliedAt.toISOString()} - ${v.description || 'No description'}`);
      });
      break;
      
    case 'health':
      const health = await validateDatabaseHealth();
      console.log('Database health check:');
      console.log(`  Schema Version: ${health.schemaVersion?.version || 'None'}`);
      console.log(`  Table Count: ${health.tableCount}/4 core tables`);
      console.log(`  Status: ${health.migrationStatus}`);
      if (health.errors.length > 0) {
        console.log(`  Errors: ${health.errors.join(', ')}`);
      }
      break;
      
    case 'init':
      await initializeSchemaVersioning();
      break;
      
    default:
      console.log(`
Schema Versioning Utilities

Usage: node utils/schemaVersioning.js <command>

Commands:
  current  - Show current schema version
  history  - Show all schema versions
  health   - Check database health
  init     - Initialize schema versioning
      `);
  }
  
  await prisma.$disconnect();
}

// Run CLI if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  handleCLI().catch(console.error);
}
