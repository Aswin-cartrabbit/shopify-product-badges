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
        return await getSubscription(req, res, storeId);
      case "POST":
        return await createOrUpdateSubscription(req, res, storeId);
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error("---> An error occurred at /api/subscription", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET /api/subscription - Get current subscription
async function getSubscription(req, res, storeId) {
  try {
    const subscription = await prisma.subscriptions.findFirst({
      where: { storeId, status: "active" },
      orderBy: { createdAt: "desc" },
    });

    // Get usage statistics
    const badgeCount = await prisma.badges.count({
      where: { storeId },
    });

    const translationCount = await prisma.badgeTranslations.count({
      where: { 
        badge: {
          storeId,
        },
      },
    });

    // Default free plan if no subscription exists
    const defaultSubscription = {
      id: null,
      storeId,
      planName: "free",
      status: "active",
      billingCycle: null,
      amount: 0,
      currency: "USD",
      maxBadges: 1,
      maxTranslations: false,
      analytics: false,
      customCss: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: null,
    };

    const currentSubscription = subscription || defaultSubscription;

    // Calculate plan limits and usage
    const usage = {
      badges: {
        current: badgeCount,
        limit: currentSubscription.maxBadges,
        percentage: currentSubscription.maxBadges > 0 
          ? Math.round((badgeCount / currentSubscription.maxBadges) * 100)
          : 0,
      },
      translations: {
        current: translationCount,
        allowed: currentSubscription.maxTranslations,
      },
      features: {
        analytics: currentSubscription.analytics,
        customCss: currentSubscription.customCss,
      },
    };

    return res.status(200).json({
      subscription: currentSubscription,
      usage,
      isNearLimit: usage.badges.percentage >= 80,
      hasExceededLimit: badgeCount >= currentSubscription.maxBadges,
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return res.status(500).json({ error: "Failed to fetch subscription" });
  }
}

// POST /api/subscription - Create or update subscription
async function createOrUpdateSubscription(req, res, storeId) {
  try {
    const {
      planName,
      billingCycle,
      amount,
      currency = "USD",
      shopifyChargeId,
    } = req.body;

    if (!planName) {
      return res.status(400).json({ error: "Plan name is required" });
    }

    // Define plan features
    const planFeatures = {
      free: {
        maxBadges: 1,
        maxTranslations: false,
        analytics: false,
        customCss: false,
      },
      starter: {
        maxBadges: 5,
        maxTranslations: false,
        analytics: true,
        customCss: false,
      },
      essential: {
        maxBadges: 20,
        maxTranslations: true,
        analytics: true,
        customCss: true,
      },
      pro: {
        maxBadges: -1, // Unlimited
        maxTranslations: true,
        analytics: true,
        customCss: true,
      },
    };

    const features = planFeatures[planName];
    if (!features) {
      return res.status(400).json({ error: "Invalid plan name" });
    }

    // Deactivate current subscription
    await prisma.subscriptions.updateMany({
      where: { storeId, status: "active" },
      data: { status: "canceled" },
    });

    // Create new subscription
    const subscription = await prisma.subscriptions.create({
      data: {
        storeId,
        planName,
        status: "active",
        billingCycle,
        amount: amount || 0,
        currency,
        shopifyChargeId,
        ...features,
      },
    });

    return res.status(201).json({ 
      subscription,
      message: `Successfully ${shopifyChargeId ? 'upgraded' : 'updated'} to ${planName} plan`
    });
  } catch (error) {
    console.error("Error creating/updating subscription:", error);
    return res.status(500).json({ error: "Failed to update subscription" });
  }
}

export default withMiddleware("verifyRequest")(handler);
