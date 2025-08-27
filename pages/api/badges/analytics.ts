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
        return await getAnalytics(req, res, storeId);
      case "POST":
        return await trackEvent(req, res, storeId);
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error("---> An error occurred at /api/badges/analytics", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET /api/badges/analytics - Get analytics data
async function getAnalytics(req, res, storeId) {
  try {
    const {
      badgeId,
      startDate,
      endDate,
      groupBy = "day", // hour, day, week, month
      deviceType,
      location,
    } = req.query;

    // Build date filter
    const dateFilter: { gte?: Date; lte?: Date } = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate);
    }

    const where = {
      storeId,
      ...(badgeId && { badgeId }),
      ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
      ...(deviceType && { deviceType }),
      ...(location && { location }),
    };

    // Get aggregated analytics
    const analytics = await prisma.badgeAnalytics.groupBy({
      by: groupBy === "hour" ? ["date", "hour"] : ["date"],
      where,
      _sum: {
        views: true,
        clicks: true,
        conversions: true,
        revenue: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    // Get total metrics
    const totals = await prisma.badgeAnalytics.aggregate({
      where,
      _sum: {
        views: true,
        clicks: true,
        conversions: true,
        revenue: true,
      },
    });

    // Get badge-wise breakdown if no specific badge is requested
    let badgeBreakdown = null;
    if (!badgeId) {
      badgeBreakdown = await prisma.badgeAnalytics.groupBy({
        by: ["badgeId"],
        where: {
          storeId,
          ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
        },
        _sum: {
          views: true,
          clicks: true,
          conversions: true,
          revenue: true,
        },
        orderBy: {
          _sum: {
            views: "desc",
          },
        },
      });

      // Get badge names for the breakdown
      if (badgeBreakdown.length > 0) {
        const badgeIds = badgeBreakdown.map(item => item.badgeId);
        const badges = await prisma.badges.findMany({
          where: { id: { in: badgeIds } },
          select: { id: true, name: true },
        });

        badgeBreakdown = badgeBreakdown.map(item => ({
          ...item,
          badgeName: badges.find(b => b.id === item.badgeId)?.name || "Unknown",
        }));
      }
    }

    // Calculate derived metrics
    const processedAnalytics = analytics.map(item => ({
      ...item,
      ctr: item._sum.views > 0 
        ? ((item._sum.clicks || 0) / item._sum.views * 100).toFixed(2)
        : 0,
      conversionRate: item._sum.clicks > 0
        ? ((item._sum.conversions || 0) / item._sum.clicks * 100).toFixed(2)
        : 0,
      revenuePerView: item._sum.views > 0
        ? ((item._sum.revenue || 0) / item._sum.views).toFixed(2)
        : 0,
    }));

    return res.status(200).json({
      analytics: processedAnalytics,
      totals: {
        views: totals._sum.views || 0,
        clicks: totals._sum.clicks || 0,
        conversions: totals._sum.conversions || 0,
        revenue: totals._sum.revenue || 0,
        ctr: totals._sum.views > 0 
          ? ((totals._sum.clicks || 0) / totals._sum.views * 100).toFixed(2)
          : 0,
        conversionRate: totals._sum.clicks > 0
          ? ((totals._sum.conversions || 0) / totals._sum.clicks * 100).toFixed(2)
          : 0,
      },
      badgeBreakdown,
      filters: {
        startDate,
        endDate,
        groupBy,
        deviceType,
        location,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return res.status(500).json({ error: "Failed to fetch analytics" });
  }
}

// POST /api/badges/analytics - Track an event
async function trackEvent(req, res, storeId) {
  try {
    const {
      badgeId,
      eventType, // view, click, conversion
      revenue = 0,
      deviceType,
      location,
      country,
      customData,
    } = req.body;

    if (!badgeId || !eventType) {
      return res.status(400).json({ 
        error: "badgeId and eventType are required" 
      });
    }

    // Verify badge belongs to the store
    const badge = await prisma.badges.findFirst({
      where: { id: badgeId, storeId },
    });

    if (!badge) {
      return res.status(404).json({ error: "Badge not found" });
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const hour = now.getHours();

    // Prepare the analytics data
    const analyticsData = {
      badgeId,
      storeId,
      date: today,
      hour,
      deviceType,
      location,
      country,
      views: eventType === "view" ? 1 : 0,
      clicks: eventType === "click" ? 1 : 0,
      conversions: eventType === "conversion" ? 1 : 0,
      revenue: eventType === "conversion" ? parseFloat(revenue) : 0,
    };

    // Upsert analytics record (increment if exists for this hour)
    const existingRecord = await prisma.badgeAnalytics.findUnique({
      where: {
        badgeId_date_hour: {
          badgeId,
          date: today,
          hour,
        },
      },
    });

    if (existingRecord) {
      // Update existing record
      await prisma.badgeAnalytics.update({
        where: { id: existingRecord.id },
        data: {
          views: { increment: analyticsData.views },
          clicks: { increment: analyticsData.clicks },
          conversions: { increment: analyticsData.conversions },
          revenue: { increment: analyticsData.revenue },
          ...(deviceType && { deviceType }),
          ...(location && { location }),
          ...(country && { country }),
        },
      });
    } else {
      // Create new record
      await prisma.badgeAnalytics.create({
        data: analyticsData,
      });
    }

    return res.status(200).json({ 
      message: "Event tracked successfully",
      eventType,
      badgeId,
    });
  } catch (error) {
    console.error("Error tracking event:", error);
    return res.status(500).json({ error: "Failed to track event" });
  }
}

export default withMiddleware("verifyRequest")(handler);
