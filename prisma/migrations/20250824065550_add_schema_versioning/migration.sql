-- CreateTable
CREATE TABLE "public"."schemaVersions" (
    "id" UUID NOT NULL,
    "version" TEXT NOT NULL,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "checksum" TEXT,
    "migrationFile" TEXT,

    CONSTRAINT "schemaVersions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "schemaVersions_version_key" ON "public"."schemaVersions"("version");

-- CreateIndex
CREATE INDEX "schemaVersions_version_idx" ON "public"."schemaVersions"("version");

-- CreateIndex
CREATE INDEX "schemaVersions_appliedAt_idx" ON "public"."schemaVersions"("appliedAt");
