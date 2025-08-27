# Schema Versioning Guide 📊

This document explains how schema versioning works in the Shopify Badge App and provides best practices for managing database changes safely.

## What is Schema Versioning? 🤔

Schema versioning (also called database migrations) is the practice of tracking and managing changes to your database structure over time. It's like Git for your database schema.

### Benefits:
- ✅ **Version Control**: Track every database change
- ✅ **Team Sync**: Everyone gets the same database structure
- ✅ **Safe Deployments**: Apply changes consistently across environments
- ✅ **Rollback Support**: Revert problematic changes
- ✅ **Production Safety**: Test schema changes before deployment

## Current Schema Version: 2.0.0 📈

**Latest Migration**: `20250824065550_add_schema_versioning`

### Schema Evolution:
1. **v1.0.0** (`20250824065517_initial_badge_app_schema`): Initial complete schema
2. **v2.0.0** (`20250824065550_add_schema_versioning`): Added schema version tracking

## Available Commands 🛠️

### Development Commands:

```bash
# Create a new migration (development only)
npm run migrate:dev

# Create migration with custom name
npx prisma migrate dev --name your_migration_name

# Reset database (DESTRUCTIVE - loses all data)
npm run migrate:reset
```

### Production Commands:

```bash
# Deploy migrations to production
npm run migrate:deploy

# Check migration status
npm run migrate:status

# Resolve migration conflicts
npm run migrate:resolve
```

### Utility Commands:

```bash
# Open Prisma Studio (database GUI)
npm run db:studio

# Run database seeding
npm run db:seed

# Generate Prisma client
npm run prepare
```

## Migration Workflow 🔄

### 1. Development Workflow

```bash
# 1. Make changes to prisma/schema.prisma
# 2. Create and apply migration
npm run migrate:dev

# 3. Test your changes
npm run dev

# 4. Commit migration files to Git
git add prisma/migrations/
git commit -m "Add user preferences table"
```

### 2. Production Deployment

```bash
# 1. Deploy to production server
# 2. Run migrations
npm run migrate:deploy

# 3. Start application
npm start
```

## Migration Best Practices ✅

### DO:
- ✅ **Always backup** production database before deploying
- ✅ **Test migrations** on staging environment first
- ✅ **Use descriptive names** for your migrations
- ✅ **Review generated SQL** before applying
- ✅ **Commit migration files** to version control
- ✅ **Use transactions** for complex changes

### DON'T:
- ❌ **Don't edit** existing migration files
- ❌ **Don't delete** migration files from Git
- ❌ **Don't use** `prisma db push` in production
- ❌ **Don't skip** testing migrations
- ❌ **Don't make** breaking changes without planning

## Common Migration Scenarios 🎯

### Adding a New Table

```prisma
// Add to schema.prisma
model newFeature {
  id        String   @id @default(uuid()) @db.Uuid
  name      String
  createdAt DateTime @default(now())
  storeId   String   @db.Uuid
  
  store stores @relation(fields: [storeId], references: [id])
  
  @@index([storeId])
}
```

```bash
# Create migration
npm run migrate:dev
```

### Adding a Column

```prisma
// Add to existing model
model badges {
  // ... existing fields ...
  newField String? // Optional field for safety
}
```

### Renaming a Column (Safe Approach)

```bash
# Step 1: Add new column
# Step 2: Migrate data (custom script)
# Step 3: Update application code
# Step 4: Remove old column
```

## Schema Version Tracking 📋

We track schema versions using the `schemaVersions` table:

```prisma
model schemaVersions {
  id             String   @id @default(uuid()) @db.Uuid
  version        String   @unique
  appliedAt      DateTime @default(now())
  description    String?
  checksum       String?
  migrationFile  String?
}
```

### Check Current Schema Version

```javascript
import { PrismaClient } from '@/prisma/client';

const prisma = new PrismaClient();

const latestVersion = await prisma.schemaVersions.findFirst({
  orderBy: { appliedAt: 'desc' }
});

console.log('Current schema version:', latestVersion?.version);
```

## Troubleshooting 🔧

### Migration Failed

```bash
# 1. Check migration status
npm run migrate:status

# 2. Resolve conflicts
npm run migrate:resolve

# 3. If needed, reset development database
npm run migrate:reset
```

### Production Migration Issues

```bash
# 1. Check status first
npm run migrate:status

# 2. Review the failed migration
# 3. Fix schema issues
# 4. Mark as resolved if needed
npm run migrate:resolve --applied 20250824065550_migration_name
```

### Schema Drift Detected

```bash
# Reset development database
npm run migrate:reset

# Or create a migration to match current state
npm run migrate:dev
```

## Environment-Specific Notes 📝

### Development
- Use `npm run migrate:dev` for iterative development
- Reset database freely with `npm run migrate:reset`
- Test all changes thoroughly

### Staging
- Use `npm run migrate:deploy` 
- Test complete deployment process
- Verify data integrity

### Production
- **ALWAYS backup** before deploying
- Use `npm run migrate:deploy`
- Monitor application after deployment
- Have rollback plan ready

## File Structure 📁

```
prisma/
├── migrations/
│   ├── 20250824065517_initial_badge_app_schema/
│   │   └── migration.sql
│   ├── 20250824065550_add_schema_versioning/
│   │   └── migration.sql
│   └── migration_lock.toml
├── client/              # Generated Prisma client
└── schema.prisma        # Your schema definition
```

## Integration with CI/CD 🚀

### GitHub Actions Example

```yaml
- name: Run Database Migrations
  run: |
    npm run migrate:deploy
    npm run prepare
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

## Monitoring & Alerts 📊

### Schema Version Health Check

Create an API endpoint to check schema version:

```javascript
// pages/api/health/schema.js
export default async function handler(req, res) {
  const version = await prisma.schemaVersions.findFirst({
    orderBy: { appliedAt: 'desc' }
  });
  
  return res.json({
    schemaVersion: version?.version,
    appliedAt: version?.appliedAt,
    status: 'healthy'
  });
}
```

## Need Help? 🆘

- Check Prisma documentation: https://www.prisma.io/docs/concepts/components/prisma-migrate
- Review migration status: `npm run migrate:status`
- Open database GUI: `npm run db:studio`
- Contact the development team for complex schema changes

---

**Remember**: Schema versioning is about safety and consistency. When in doubt, test your changes thoroughly and always have a backup! 🛡️

