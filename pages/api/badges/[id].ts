import withMiddleware from "@/utils/middleware/withMiddleware";
import { PrismaClient } from "@/prisma/client";

const prisma = new PrismaClient();

/**
 * @param {import("next").NextApiRequest} req - The HTTP request object.
 * @param {import("next").NextApiResponse} res - The HTTP response object.
 */
const handler = async (req, res) => {
  try {
    const { method, query } = req;
    const { id: badgeId } = query;
    const { user_id: storeId } = req;

    if (!storeId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!badgeId) {
      return res.status(400).json({ error: "Badge ID is required" });
    }

    // Verify badge belongs to the store
    const badge = await prisma.badges.findFirst({
      where: { id: badgeId, storeId },
    });

    if (!badge) {
      return res.status(404).json({ error: "Badge not found" });
    }

    switch (method) {
      case "GET":
        return await getBadge(req, res, badgeId);
      case "PUT":
      case "PATCH":
        return await updateBadge(req, res, badgeId, storeId);
      case "DELETE":
        return await deleteBadge(req, res, badgeId);
      default:
        res.setHeader("Allow", ["GET", "PUT", "PATCH", "DELETE"]);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error("---> An error occurred at /api/badges/[id]", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET /api/badges/[id] - Get a specific badge
async function getBadge(req, res, badgeId) {
  try {
    const badge = await prisma.badges.findUnique({
      where: { id: badgeId },
      include: {
        design: true,
        placement: true,
        targeting: true,
        translations: true,
        analytics: {
          orderBy: { date: "desc" },
          take: 30, // Last 30 days
        },
      },
    });

    if (!badge) {
      return res.status(404).json({ error: "Badge not found" });
    }

    // Calculate analytics summary
    const analyticsSummary = await prisma.badgeAnalytics.aggregate({
      where: { badgeId },
      _sum: {
        views: true,
        clicks: true,
        conversions: true,
        revenue: true,
      },
    });

    const badgeWithAnalytics = {
      ...badge,
      analyticsSummary: {
        totalViews: analyticsSummary._sum.views || 0,
        totalClicks: analyticsSummary._sum.clicks || 0,
        totalConversions: analyticsSummary._sum.conversions || 0,
        totalRevenue: analyticsSummary._sum.revenue || 0,
        ctr: analyticsSummary._sum.views > 0 
          ? ((analyticsSummary._sum.clicks || 0) / analyticsSummary._sum.views * 100).toFixed(2)
          : 0,
        conversionRate: analyticsSummary._sum.clicks > 0
          ? ((analyticsSummary._sum.conversions || 0) / analyticsSummary._sum.clicks * 100).toFixed(2)
          : 0,
      },
    };

    return res.status(200).json({ badge: badgeWithAnalytics });
  } catch (error) {
    console.error("Error fetching badge:", error);
    return res.status(500).json({ error: "Failed to fetch badge" });
  }
}

// PUT/PATCH /api/badges/[id] - Update a badge
async function updateBadge(req, res, badgeId, storeId) {
  try {
    const {
      name,
      type,
      status,
      title,
      subheading,
      iconUrl,
      ctaText,
      ctaUrl,
      design,
      placement,
      targeting,
      translations,
    } = req.body;

    // Update badge and related data in a transaction
    const updatedBadge = await prisma.$transaction(async (prisma) => {
      // Update the main badge
      const badge = await prisma.badges.update({
        where: { id: badgeId },
        data: {
          ...(name && { name }),
          ...(type && { type }),
          ...(status && { status }),
          ...(title !== undefined && { title }),
          ...(subheading !== undefined && { subheading }),
          ...(iconUrl !== undefined && { iconUrl }),
          ...(ctaText !== undefined && { ctaText }),
          ...(ctaUrl !== undefined && { ctaUrl }),
          updatedAt: new Date(),
        },
      });

      // Update design if provided
      if (design) {
        await prisma.badgeDesigns.upsert({
          where: { badgeId },
          update: design,
          create: {
            badgeId,
            ...design,
          },
        });
      }

      // Update placement if provided
      if (placement) {
        await prisma.badgePlacements.upsert({
          where: { badgeId },
          update: placement,
          create: {
            badgeId,
            ...placement,
          },
        });
      }

      // Update targeting rules if provided
      if (targeting && Array.isArray(targeting)) {
        // Delete existing targeting rules
        await prisma.badgeTargeting.deleteMany({
          where: { badgeId },
        });

        // Create new targeting rules
        if (targeting.length > 0) {
          await prisma.badgeTargeting.createMany({
            data: targeting.map((rule) => ({
              badgeId,
              ...rule,
            })),
          });
        }
      }

      // Update translations if provided
      if (translations && Array.isArray(translations)) {
        for (const translation of translations) {
          await prisma.badgeTranslations.upsert({
            where: {
              badgeId_language: {
                badgeId,
                language: translation.language,
              },
            },
            update: {
              title: translation.title,
              subheading: translation.subheading,
              ctaText: translation.ctaText,
            },
            create: {
              badgeId,
              language: translation.language,
              title: translation.title,
              subheading: translation.subheading,
              ctaText: translation.ctaText,
            },
          });
        }
      }

      return badge;
    });

    // Fetch the complete updated badge data
    const completeBadge = await prisma.badges.findUnique({
      where: { id: badgeId },
      include: {
        design: true,
        placement: true,
        targeting: true,
        translations: true,
      },
    });

    return res.status(200).json({ badge: completeBadge });
  } catch (error) {
    console.error("Error updating badge:", error);
    return res.status(500).json({ error: "Failed to update badge" });
  }
}

// DELETE /api/badges/[id] - Delete a badge
async function deleteBadge(req, res, badgeId) {
  try {
    // Delete badge and all related data (cascade delete)
    await prisma.badges.delete({
      where: { id: badgeId },
    });

    return res.status(200).json({ 
      message: "Badge deleted successfully",
      badgeId 
    });
  } catch (error) {
    console.error("Error deleting badge:", error);
    return res.status(500).json({ error: "Failed to delete badge" });
  }
}

export default withMiddleware("verifyRequest")(handler);
