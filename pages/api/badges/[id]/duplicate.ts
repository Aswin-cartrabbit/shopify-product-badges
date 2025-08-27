import withMiddleware from "@/utils/middleware/withMiddleware";
import { PrismaClient } from "@/prisma/client";

const prisma = new PrismaClient();

/**
 * @param {import("next").NextApiRequest} req - The HTTP request object.
 * @param {import("next").NextApiResponse} res - The HTTP response object.
 */
const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { id: badgeId } = req.query;
    const { user_id: storeId } = req;
    const { name } = req.body;

    if (!storeId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!badgeId) {
      return res.status(400).json({ error: "Badge ID is required" });
    }

    // Get the original badge with all related data
    const originalBadge = await prisma.badges.findFirst({
      where: { id: badgeId, storeId },
      include: {
        design: true,
        placement: true,
        targeting: true,
        translations: true,
      },
    });

    if (!originalBadge) {
      return res.status(404).json({ error: "Badge not found" });
    }

    // Check subscription limits
    const subscription = await prisma.subscriptions.findFirst({
      where: { storeId, status: "active" },
    });

    const currentBadgeCount = await prisma.badges.count({
      where: { storeId },
    });

    const maxBadges = subscription?.maxBadges || 1;
    if (currentBadgeCount >= maxBadges) {
      return res.status(403).json({
        error: "Badge limit reached. Please upgrade your plan.",
        limit: maxBadges,
        current: currentBadgeCount,
      });
    }

    // Duplicate badge in a transaction
    const duplicatedBadge = await prisma.$transaction(async (prisma) => {
      // Create the new badge
      const newBadge = await prisma.badges.create({
        data: {
          name: name || `${originalBadge.name} (Copy)`,
          type: originalBadge.type,
          status: "DRAFT", // Always create duplicates as draft
          storeId,
          title: originalBadge.title,
          subheading: originalBadge.subheading,
          iconUrl: originalBadge.iconUrl,
          ctaText: originalBadge.ctaText,
          ctaUrl: originalBadge.ctaUrl,
        },
      });

      // Duplicate design if it exists
      if (originalBadge.design) {
        const { id, badgeId: _, ...designData } = originalBadge.design;
        await prisma.badgeDesigns.create({
          data: {
            badgeId: newBadge.id,
            ...designData,
          },
        });
      }

      // Duplicate placement if it exists
      if (originalBadge.placement) {
        const { id, badgeId: _, ...placementData } = originalBadge.placement;
        await prisma.badgePlacements.create({
          data: {
            badgeId: newBadge.id,
            ...placementData,
          },
        });
      }

      // Duplicate targeting rules if they exist
      if (originalBadge.targeting && originalBadge.targeting.length > 0) {
        const targetingData = originalBadge.targeting.map(({ id, badgeId: _, ...rule }) => ({
          badgeId: newBadge.id,
          ...rule,
        }));

        await prisma.badgeTargeting.createMany({
          data: targetingData,
        });
      }

      // Duplicate translations if they exist
      if (originalBadge.translations && originalBadge.translations.length > 0) {
        const translationsData = originalBadge.translations.map(({ id, badgeId: _, ...translation }) => ({
          badgeId: newBadge.id,
          ...translation,
        }));

        await prisma.badgeTranslations.createMany({
          data: translationsData,
        });
      }

      return newBadge;
    });

    // Fetch the complete duplicated badge data
    const completeBadge = await prisma.badges.findUnique({
      where: { id: duplicatedBadge.id },
      include: {
        design: true,
        placement: true,
        targeting: true,
        translations: true,
      },
    });

    return res.status(201).json({ 
      badge: completeBadge,
      message: "Badge duplicated successfully"
    });
  } catch (error) {
    console.error("---> An error occurred at /api/badges/[id]/duplicate", error);
    return res.status(500).json({ error: "Failed to duplicate badge" });
  }
};

export default withMiddleware("verifyRequest")(handler);
