-- CreateEnum
CREATE TYPE "public"."TokenType" AS ENUM ('OFFLINE', 'ONLINE');

-- CreateEnum
CREATE TYPE "public"."BadgeType" AS ENUM ('SINGLE_BANNER', 'ICON_BLOCK', 'PAYMENT_ICONS', 'FREE_SHIPPING_BAR');

-- CreateEnum
CREATE TYPE "public"."BadgeStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."PlacementLocation" AS ENUM ('PRODUCT_PAGE', 'COLLECTION_PAGE', 'CART_PAGE', 'CHECKOUT_PAGE', 'HOME_PAGE');

-- CreateEnum
CREATE TYPE "public"."PlacementPosition" AS ENUM ('TOP_LEFT', 'TOP_RIGHT', 'TOP_CENTER', 'BOTTOM_LEFT', 'BOTTOM_RIGHT', 'BOTTOM_CENTER', 'CENTER', 'BEFORE_ADD_TO_CART', 'AFTER_ADD_TO_CART', 'CUSTOM');

-- CreateEnum
CREATE TYPE "public"."TargetingRule" AS ENUM ('ALL_PRODUCTS', 'SPECIFIC_PRODUCTS', 'COLLECTIONS', 'PRODUCT_TAGS', 'PRODUCT_TYPE', 'VENDOR', 'PRICE_RANGE');

-- CreateTable
CREATE TABLE "public"."stores" (
    "id" UUID NOT NULL,
    "shop" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."session" (
    "id" TEXT NOT NULL,
    "type" "public"."TokenType" NOT NULL,
    "content" TEXT,
    "shop" TEXT,
    "storeId" UUID NOT NULL,
    "scopes" TEXT,
    "expires" TIMESTAMP(3),

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."badges" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."BadgeType" NOT NULL,
    "status" "public"."BadgeStatus" NOT NULL DEFAULT 'DRAFT',
    "storeId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT,
    "subheading" TEXT,
    "iconUrl" TEXT,
    "ctaText" TEXT,
    "ctaUrl" TEXT,

    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."badgeDesigns" (
    "id" UUID NOT NULL,
    "badgeId" UUID NOT NULL,
    "template" TEXT DEFAULT 'custom',
    "backgroundType" TEXT DEFAULT 'single',
    "backgroundColor" TEXT DEFAULT '#000000',
    "gradientColor1" TEXT,
    "gradientColor2" TEXT,
    "gradientAngle" INTEGER DEFAULT 0,
    "cornerRadius" INTEGER DEFAULT 8,
    "borderSize" INTEGER DEFAULT 0,
    "borderColor" TEXT DEFAULT '#c5c8d1',
    "paddingTop" INTEGER DEFAULT 16,
    "paddingBottom" INTEGER DEFAULT 16,
    "paddingLeft" INTEGER DEFAULT 16,
    "paddingRight" INTEGER DEFAULT 16,
    "marginTop" INTEGER DEFAULT 20,
    "marginBottom" INTEGER DEFAULT 20,
    "marginLeft" INTEGER DEFAULT 0,
    "marginRight" INTEGER DEFAULT 0,
    "iconSize" INTEGER DEFAULT 32,
    "iconColor" TEXT DEFAULT '#ffffff',
    "useOriginalIcon" BOOLEAN NOT NULL DEFAULT false,
    "iconBackground" TEXT,
    "iconRadius" INTEGER DEFAULT 0,
    "iconsPerRowDesktop" INTEGER DEFAULT 4,
    "iconsPerRowMobile" INTEGER DEFAULT 2,
    "fontFamily" TEXT DEFAULT 'own_theme',
    "titleFontSize" INTEGER DEFAULT 16,
    "titleColor" TEXT DEFAULT '#000000',
    "titleWeight" TEXT DEFAULT 'semibold',
    "subtitleFontSize" INTEGER DEFAULT 14,
    "subtitleColor" TEXT DEFAULT '#666666',
    "subtitleWeight" TEXT DEFAULT 'normal',
    "animation" TEXT DEFAULT 'none',
    "shadow" TEXT,
    "opacity" DOUBLE PRECISION DEFAULT 1.0,

    CONSTRAINT "badgeDesigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."badgePlacements" (
    "id" UUID NOT NULL,
    "badgeId" UUID NOT NULL,
    "location" "public"."PlacementLocation" NOT NULL DEFAULT 'PRODUCT_PAGE',
    "position" "public"."PlacementPosition" NOT NULL DEFAULT 'TOP_RIGHT',
    "customSelector" TEXT,
    "customCss" TEXT,
    "zIndex" INTEGER DEFAULT 1000,
    "showOnDesktop" BOOLEAN NOT NULL DEFAULT true,
    "showOnMobile" BOOLEAN NOT NULL DEFAULT true,
    "showOnTablet" BOOLEAN NOT NULL DEFAULT true,
    "displayDelay" INTEGER DEFAULT 0,
    "autoHide" BOOLEAN NOT NULL DEFAULT false,
    "autoHideDelay" INTEGER DEFAULT 5,

    CONSTRAINT "badgePlacements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."badgeTargeting" (
    "id" UUID NOT NULL,
    "badgeId" UUID NOT NULL,
    "ruleType" "public"."TargetingRule" NOT NULL,
    "ruleValue" TEXT NOT NULL,
    "isInclusive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "badgeTargeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."badgeAnalytics" (
    "id" UUID NOT NULL,
    "badgeId" UUID NOT NULL,
    "storeId" UUID NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "revenue" DOUBLE PRECISION DEFAULT 0,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hour" INTEGER,
    "location" "public"."PlacementLocation",
    "deviceType" TEXT,
    "country" TEXT,

    CONSTRAINT "badgeAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."badgeTranslations" (
    "id" UUID NOT NULL,
    "badgeId" UUID NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT,
    "subheading" TEXT,
    "ctaText" TEXT,

    CONSTRAINT "badgeTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subscriptions" (
    "id" UUID NOT NULL,
    "storeId" UUID NOT NULL,
    "planName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "billingCycle" TEXT,
    "amount" DOUBLE PRECISION DEFAULT 0,
    "currency" TEXT DEFAULT 'USD',
    "shopifyChargeId" TEXT,
    "maxBadges" INTEGER DEFAULT 1,
    "maxTranslations" BOOLEAN NOT NULL DEFAULT false,
    "analytics" BOOLEAN NOT NULL DEFAULT false,
    "customCss" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stores_id_key" ON "public"."stores"("id");

-- CreateIndex
CREATE UNIQUE INDEX "stores_shop_key" ON "public"."stores"("shop");

-- CreateIndex
CREATE INDEX "stores_id_idx" ON "public"."stores"("id");

-- CreateIndex
CREATE INDEX "stores_isActive_idx" ON "public"."stores"("isActive");

-- CreateIndex
CREATE INDEX "session_shop_idx" ON "public"."session"("shop");

-- CreateIndex
CREATE INDEX "session_storeId_idx" ON "public"."session"("storeId");

-- CreateIndex
CREATE INDEX "session_type_idx" ON "public"."session"("type");

-- CreateIndex
CREATE INDEX "badges_storeId_idx" ON "public"."badges"("storeId");

-- CreateIndex
CREATE INDEX "badges_status_idx" ON "public"."badges"("status");

-- CreateIndex
CREATE INDEX "badges_type_idx" ON "public"."badges"("type");

-- CreateIndex
CREATE UNIQUE INDEX "badgeDesigns_badgeId_key" ON "public"."badgeDesigns"("badgeId");

-- CreateIndex
CREATE INDEX "badgeDesigns_badgeId_idx" ON "public"."badgeDesigns"("badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "badgePlacements_badgeId_key" ON "public"."badgePlacements"("badgeId");

-- CreateIndex
CREATE INDEX "badgePlacements_badgeId_idx" ON "public"."badgePlacements"("badgeId");

-- CreateIndex
CREATE INDEX "badgePlacements_location_idx" ON "public"."badgePlacements"("location");

-- CreateIndex
CREATE INDEX "badgeTargeting_badgeId_idx" ON "public"."badgeTargeting"("badgeId");

-- CreateIndex
CREATE INDEX "badgeTargeting_ruleType_idx" ON "public"."badgeTargeting"("ruleType");

-- CreateIndex
CREATE INDEX "badgeAnalytics_badgeId_idx" ON "public"."badgeAnalytics"("badgeId");

-- CreateIndex
CREATE INDEX "badgeAnalytics_storeId_idx" ON "public"."badgeAnalytics"("storeId");

-- CreateIndex
CREATE INDEX "badgeAnalytics_date_idx" ON "public"."badgeAnalytics"("date");

-- CreateIndex
CREATE UNIQUE INDEX "badgeAnalytics_badgeId_date_hour_key" ON "public"."badgeAnalytics"("badgeId", "date", "hour");

-- CreateIndex
CREATE INDEX "badgeTranslations_badgeId_idx" ON "public"."badgeTranslations"("badgeId");

-- CreateIndex
CREATE INDEX "badgeTranslations_language_idx" ON "public"."badgeTranslations"("language");

-- CreateIndex
CREATE UNIQUE INDEX "badgeTranslations_badgeId_language_key" ON "public"."badgeTranslations"("badgeId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_shopifyChargeId_key" ON "public"."subscriptions"("shopifyChargeId");

-- CreateIndex
CREATE INDEX "subscriptions_storeId_idx" ON "public"."subscriptions"("storeId");

-- CreateIndex
CREATE INDEX "subscriptions_status_idx" ON "public"."subscriptions"("status");

-- AddForeignKey
ALTER TABLE "public"."session" ADD CONSTRAINT "session_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."badges" ADD CONSTRAINT "badges_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."badgeDesigns" ADD CONSTRAINT "badgeDesigns_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "public"."badges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."badgePlacements" ADD CONSTRAINT "badgePlacements_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "public"."badges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."badgeTargeting" ADD CONSTRAINT "badgeTargeting_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "public"."badges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."badgeAnalytics" ADD CONSTRAINT "badgeAnalytics_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "public"."badges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."badgeAnalytics" ADD CONSTRAINT "badgeAnalytics_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."badgeTranslations" ADD CONSTRAINT "badgeTranslations_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "public"."badges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subscriptions" ADD CONSTRAINT "subscriptions_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
