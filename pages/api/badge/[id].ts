import withMiddleware from "@/utils/middleware/withMiddleware";
import prisma from "@/utils/prisma";

/**
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
const getComponentById = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: true,
      message: "Method not allowed. Only GET requests are accepted.",
      code: "METHOD_NOT_ALLOWED",
    });
  }

  const storeId = req.store.id;
  if (!storeId) {
    return res.status(401).json({
      error: true,
      message: "Authentication required. Missing store identifier.",
      code: "MISSING_STORE_ID",
    });
  }

  try {
    const { id } = req.query;

    // Validate component ID
    if (!id) {
      return res.status(400).json({
        error: true,
        message: "Component ID is required.",
        code: "MISSING_COMPONENT_ID",
      });
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        error: true,
        message: "Invalid component ID format. Must be a valid UUID.",
        code: "INVALID_COMPONENT_ID_FORMAT",
      });
    }

    // Fetch component from database
    const component = await prisma.visual_components.findFirst({
      where: {
        id: id,
        storeId: storeId,
      },
      include: {
        store: {
          select: {
            shop: true,
            isActive: true,
          },
        },
      },
    });

    if (!component) {
      return res.status(404).json({
        error: true,
        message: "Component not found or you don't have permission to access it.",
        code: "COMPONENT_NOT_FOUND",
      });
    }

    // Check if store is active
    if (!component.store.isActive) {
      return res.status(403).json({
        error: true,
        message: "Store is not active.",
        code: "STORE_INACTIVE",
      });
    }

    console.log("=== GET COMPONENT DEBUG ===");
    console.log("Component ID:", component.id);
    console.log("Component templates:", JSON.stringify(component.templates, null, 2));
    console.log("Component rules:", JSON.stringify(component.rules, null, 2));
    console.log("Component settings:", JSON.stringify(component.settings, null, 2));
    console.log("==========================");

    return res.status(200).json({
      error: false,
      message: "Component retrieved successfully.",
      data: component,
    });
  } catch (error) {
    console.error("---> Error at /api/badge/[id]:", error);

    // Handle database connection errors
    if (error.message?.includes("connect")) {
      return res.status(503).json({
        error: true,
        message: "Database service unavailable. Please try again later.",
        code: "DATABASE_CONNECTION_ERROR",
      });
    }

    // Generic server error
    return res.status(500).json({
      error: true,
      message: "An unexpected error occurred while retrieving the component.",
      code: "INTERNAL_SERVER_ERROR",
    });
  } finally {
    await prisma.$disconnect();
  }
};

export default withMiddleware("verifyRequest")(getComponentById);
