import withMiddleware from "@/utils/middleware/withMiddleware";
import { shopifyApi } from "@/utils/shopifyApi";
import { PrismaClient } from "@/prisma/client";

const prisma = new PrismaClient();

/**
 * @param {import("next").NextApiRequest} req - The HTTP request object.
 * @param {import("next").NextApiResponse} res - The HTTP response object.
 */
const handler = async (req, res) => {
  try {
    const { method } = req;
    const { user_id: storeId, user_shop: shop } = req;

    if (!storeId || !shop) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    switch (method) {
      case "GET":
        return await getIntegrationStatus(req, res, storeId);
      case "POST":
        return await enableIntegration(req, res, storeId);
      case "DELETE":
        return await disableIntegration(req, res, storeId);
      default:
        res.setHeader("Allow", ["GET", "POST", "DELETE"]);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error("---> An error occurred at /api/shopify/integration", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET /api/shopify/integration - Get integration status
async function getIntegrationStatus(req, res, storeId) {
  try {
    // Get shop info
    const shopInfo = await shopifyApi.getShopInfo(req, res);
    
    // Get current theme
    const currentTheme = await shopifyApi.getCurrentTheme(req, res);
    
    // Check if script tag exists
    const session = res.locals?.shopify?.session;
    const shopifyModule = await import("@/utils/shopify");
    const restClient = new shopifyModule.default.clients.Rest({ 
      session: session 
    });

    const existingScripts = await restClient.get({
      path: 'script_tags',
    });

    const badgeScript = existingScripts.body.script_tags.find(
      (script) => script.src.includes('badge-renderer')
    );

    // Get active badges count
    const activeBadgesCount = await prisma.badges.count({
      where: { 
        storeId,
        status: "ACTIVE" 
      },
    });

    return res.status(200).json({
      shopInfo,
      theme: currentTheme,
      integration: {
        enabled: !!badgeScript,
        scriptTagId: badgeScript?.id,
        scriptUrl: badgeScript?.src,
        lastUpdated: badgeScript?.updated_at,
      },
      badges: {
        active: activeBadgesCount,
      },
    });
  } catch (error) {
    console.error("Error getting integration status:", error);
    return res.status(500).json({ error: "Failed to get integration status" });
  }
}

// POST /api/shopify/integration - Enable integration
async function enableIntegration(req, res, storeId) {
  try {
    const { user_shop: shop } = req;
    
    // Create or update script tag
    const scriptUrl = `${process.env.SHOPIFY_APP_URL}/api/badge-renderer.js?shop=${shop}`;
    const scriptTag = await shopifyApi.createScriptTag(req, res, scriptUrl);
    
    // Update store status
    await prisma.stores.update({
      where: { id: storeId },
      data: { isActive: true },
    });

    return res.status(200).json({
      message: "Integration enabled successfully",
      scriptTag,
      scriptUrl,
    });
  } catch (error) {
    console.error("Error enabling integration:", error);
    return res.status(500).json({ error: "Failed to enable integration" });
  }
}

// DELETE /api/shopify/integration - Disable integration
async function disableIntegration(req, res, storeId) {
  try {
    // Remove script tag
    const removed = await shopifyApi.removeScriptTag(req, res);
    
    // Update store status
    await prisma.stores.update({
      where: { id: storeId },
      data: { isActive: false },
    });

    return res.status(200).json({
      message: "Integration disabled successfully",
      removed,
    });
  } catch (error) {
    console.error("Error disabling integration:", error);
    return res.status(500).json({ error: "Failed to disable integration" });
  }
}

export default withMiddleware("verifyRequest")(handler);
