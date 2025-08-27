import withMiddleware from "@/utils/middleware/withMiddleware";
import prisma from "@/utils/prisma";

/**
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
const create = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: true,
      message: "Method not allowed. Only POST requests are accepted.",
      code: "METHOD_NOT_ALLOWED",
    });
  }
  console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
  console.log(req.store);
  console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
  const storeId = req.store.id;
  if (!storeId) {
    return res.status(401).json({
      error: true,
      message: "Authentication required. Missing store identifier.",
      code: "MISSING_STORE_ID",
    });
  }
  try {
    const {
      name,
      description,
      type,
      design: templates,
      display: rules,
      settings,
      status,
    } = req.body;

    // Validate required fields
    if (!name || !type || !templates || !rules) {
      const requiredFields = { name, type, templates, rules };
      const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

      if (missingFields.length > 0) {
        return res.status(400).json({
          error: true,
          message: `Missing required fields: ${missingFields.join(", ")}`,
          missingFields,
          code: "MISSING_FIELDS",
        });
      }
    }

    // Validate store
    const store = await prisma.stores.findUnique({ where: { id: storeId } });
    if (!store) {
      return res.status(404).json({
        error: true,
        message: "Store not found.",
        code: "STORE_NOT_FOUND",
      });
    }
    if (!store.isActive) {
      return res.status(403).json({
        error: true,
        message: "Store is not active.",
        code: "STORE_INACTIVE",
      });
    }

    // Validate status
    const validStatuses = [
      "ACTIVE",
      "INACTIVE",
      "DRAFT",
      "SCHEDULED",
      "EXPIRED",
    ];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        error: true,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        code: "INVALID_STATUS",
      });
    }

    // Check duplicate by storeId + name
    const existing = await prisma.visual_components.findUnique({
      where: {
        storeId_name: { storeId, name },
      },
    });
    if (existing) {
      return res.status(409).json({
        error: true,
        message: "A component with this name already exists for this store.",
        code: "COMPONENT_ALREADY_EXISTS",
        existingId: existing.id,
      });
    }

    // Create component
    const newComponent = await prisma.visual_components.create({
      data: {
        storeId,
        name,
        description: description || null,
        type,
        templates,
        rules,
        settings: settings || null,
        status: status || "INACTIVE",
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

    return res.status(201).json({
      error: false,
      message: "Component created successfully.",
      data: newComponent,
    });
  } catch (error) {
    console.error("---> Error at /api/badges/create:", error);

    if (error.code === "P2002") {
      return res.status(409).json({
        error: true,
        message: "A component with these details already exists.",
        code: "DUPLICATE_COMPONENT",
      });
    }

    return res.status(500).json({
      error: true,
      message: "Unexpected error occurred while creating the component.",
      code: "INTERNAL_SERVER_ERROR",
    });
  } finally {
    await prisma.$disconnect();
  }
};

export default withMiddleware("verifyRequest")(create);
