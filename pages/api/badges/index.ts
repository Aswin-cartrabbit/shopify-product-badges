import withMiddleware from "@/utils/middleware/withMiddleware";
import { PrismaClient } from "@/prisma/client";

const prisma = new PrismaClient();

/**
 * @param {import("next").NextApiRequest} req - The HTTP request object.
 * @param {import("next").NextApiResponse} res - The HTTP response object.
 */
const handler = async (req, res) => {
  try {
    const { method } = req;
    const { user_id: storeId } = req;

    if (!storeId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    switch (method) {
      case "GET":
        return await getBadges(req, res, storeId);
      case "POST":
        return await createBadge(req, res, storeId);
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error("---> An error occurred at /api/badges", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET /api/badges - List all badges for a store
async function getBadges(req, res, storeId) {
  try {
    const { status, type, limit = 50, offset = 0 } = req.query;

    const where = {
      storeId,
      ...(status && { status }),
      ...(type && { type }),
    };

    const badges = await prisma.badges.findMany({
      where,
      include: {
        design: true,
        placement: true,
        targeting: true,
        analytics: {
          select: {
            views: true,
            clicks: true,
            conversions: true,
            revenue: true,
          },
          orderBy: { date: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
      take: parseInt(limit),
      skip: parseInt(offset),
    });

    // Calculate aggregated analytics for each badge
    const badgesWithAnalytics = await Promise.all(
      badges.map(async (badge) => {
        const analytics = await prisma.badgeAnalytics.aggregate({
          where: { badgeId: badge.id },
          _sum: {
            views: true,
            clicks: true,
            conversions: true,
            revenue: true,
          },
        });

        return {
          ...badge,
          totalAnalytics: {
            views: analytics._sum.views || 0,
            clicks: analytics._sum.clicks || 0,
            conversions: analytics._sum.conversions || 0,
            revenue: analytics._sum.revenue || 0,
            ctr: analytics._sum.views > 0 
              ? ((analytics._sum.clicks || 0) / analytics._sum.views * 100).toFixed(2)
              : 0,
            conversionRate: analytics._sum.clicks > 0
              ? ((analytics._sum.conversions || 0) / analytics._sum.clicks * 100).toFixed(2)
              : 0,
          },
        };
      })
    );

    const total = await prisma.badges.count({ where });

    return res.status(200).json({
      badges: badgesWithAnalytics,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: total > parseInt(offset) + parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching badges:", error);
    return res.status(500).json({ error: "Failed to fetch badges" });
  }
}

// POST /api/badges - Create a new badge
async function createBadge(req, res, storeId) {
  try {
    const {
      name,
      type,
      title,
      subheading,
      iconUrl,
      ctaText,
      ctaUrl,
      design,
      placement,
      targeting,
    } = req.body;

    // Validate required fields
    if (!name || !type) {
      return res.status(400).json({ 
        error: "Name and type are required" 
      });
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

    // Create badge with related data in a transaction
    const badge = await prisma.$transaction(async (prisma) => {
      // Create the main badge
      const newBadge = await prisma.badges.create({
        data: {
          name,
          type,
          storeId,
          title,
          subheading,
          iconUrl,
          ctaText,
          ctaUrl,
        },
      });

      // Create design if provided
      if (design) {
        await prisma.badgeDesigns.create({
          data: {
            badgeId: newBadge.id,
            ...design,
          },
        });
      }

      // Create placement if provided
      if (placement) {
        await prisma.badgePlacements.create({
          data: {
            badgeId: newBadge.id,
            ...placement,
          },
        });
      }

      // Create targeting rules if provided
      if (targeting && Array.isArray(targeting)) {
        await prisma.badgeTargeting.createMany({
          data: targeting.map((rule) => ({
            badgeId: newBadge.id,
            ...rule,
          })),
        });
      }

      return newBadge;
    });

    // Fetch the complete badge data
    const completeBadge = await prisma.badges.findUnique({
      where: { id: badge.id },
      include: {
        design: true,
        placement: true,
        targeting: true,
      },
    });

    return res.status(201).json({ badge: completeBadge });
  } catch (error) {
    console.error("Error creating badge:", error);
    return res.status(500).json({ error: "Failed to create badge" });
  }
}

export default withMiddleware("verifyRequest")(handler);
