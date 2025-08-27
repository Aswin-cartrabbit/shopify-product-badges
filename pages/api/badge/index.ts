import withMiddleware from "@/utils/middleware/withMiddleware";
import prisma from "@/utils/prisma";

/**
 * Get all visual components for a specific store
 * @param {import("next").NextApiRequest} req - The HTTP request object.
 * @param {import("next").NextApiResponse} res - The HTTP response object.
 */
const index = async (req, res) => {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({
      error: true,
      message: "Method not allowed. Only GET requests are supported.",
      code: "METHOD_NOT_ALLOWED",
    });
  }

  const storeId = req.store.id;

  // Validate store ID presence
  if (!storeId) {
    return res.status(401).json({
      error: true,
      message: "Authentication required. Missing store identifier.",
      code: "MISSING_STORE_ID",
    });
  }

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(storeId)) {
    return res.status(400).json({
      error: true,
      message: "Invalid store identifier format. Must be a valid UUID.",
      code: "INVALID_STORE_ID_FORMAT",
    });
  }

  try {
    // Check if store exists
    const storeExists = await prisma.stores.findUnique({
      where: { id: storeId },
      select: { id: true },
    });

    if (!storeExists) {
      return res.status(404).json({
        error: true,
        message: "Store not found. The specified store does not exist.",
        code: "STORE_NOT_FOUND",
      });
    }

    // Extract query parameters for filtering and pagination
    const {
      type,
      status,
      isPublished,
      page = "1",
      limit = "20",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Validate pagination parameters
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({
        error: true,
        message: "Invalid page number. Must be a positive integer.",
        code: "INVALID_PAGE_PARAMETER",
      });
    }

    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        error: true,
        message: "Invalid limit. Must be between 1 and 100.",
        code: "INVALID_LIMIT_PARAMETER",
      });
    }

    const whereClause: any = {
      storeId,
      deletedAt: null,
    };

    if (type) {
      whereClause.type = type;
    }

    if (status) {
      whereClause.status = status;
    }

    if (isPublished !== undefined) {
      whereClause.isPublished = isPublished === "true";
    }

    // Validate sort parameters
    const allowedSortFields = [
      "createdAt",
      "updatedAt",
      "name",
      "type",
      "status",
      "version",
    ];
    const allowedSortOrders = ["asc", "desc"];

    if (!allowedSortFields.includes(sortBy)) {
      return res.status(400).json({
        error: true,
        message: `Invalid sort field. Allowed fields: ${allowedSortFields.join(", ")}`,
        code: "INVALID_SORT_FIELD",
      });
    }

    if (!allowedSortOrders.includes(sortOrder.toLowerCase())) {
      return res.status(400).json({
        error: true,
        message: "Invalid sort order. Must be 'asc' or 'desc'.",
        code: "INVALID_SORT_ORDER",
      });
    }

    // Get total count for pagination
    const totalCount = await prisma.visual_components.count({
      where: whereClause,
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPreviousPage = pageNum > 1;

    // Fetch components with pagination and sorting
    const components = await prisma.visual_components.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        templates: true,
        rules: true,
        settings: true,
        status: true,
        impressions: true,
        clicks: true,
        isPublished: true,
        publishedAt: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        [sortBy]: sortOrder.toLowerCase(),
      },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    });

    // Return successful response with data and pagination info
    return res.status(200).json({
      error: false,
      message: "Visual components retrieved successfully.",
      data: {
        components,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCount,
          limit: limitNum,
          hasNextPage,
          hasPreviousPage,
        },
        filters: {
          type: type || null,
          status: status || null,
          isPublished: isPublished ? isPublished === "true" : null,
        },
        sorting: {
          sortBy,
          sortOrder: sortOrder.toLowerCase(),
        },
      },
    });
  } catch (error) {
    console.error("---> An error occurred at /api/visual-components:", error);

    // Handle specific Prisma errors
    if (error.code === "P2002") {
      return res.status(409).json({
        error: true,
        message: "A conflict occurred while retrieving components.",
        code: "DATABASE_CONFLICT",
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        error: true,
        message: "No components found matching the specified criteria.",
        code: "COMPONENTS_NOT_FOUND",
      });
    }

    // Handle database connection errors
    if (error.message?.includes("connect")) {
      return res.status(503).json({
        error: true,
        message: "Database service unavailable. Please try again later.",
        code: "DATABASE_CONNECTION_ERROR",
      });
    }

    // Handle timeout errors
    if (error.message?.includes("timeout")) {
      return res.status(504).json({
        error: true,
        message: "Request timeout. The operation took too long to complete.",
        code: "REQUEST_TIMEOUT",
      });
    }

    // Generic server error
    return res.status(500).json({
      error: true,
      message: "An unexpected error occurred while retrieving components.",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
};

export default withMiddleware("verifyRequest")(index);
