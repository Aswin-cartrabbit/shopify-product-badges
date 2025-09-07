import clientProvider from "@/utils/clientProvider";
import withMiddleware from "@/utils/middleware/withMiddleware";
import prisma from "@/utils/prisma";

/**
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
const deleteComponent = async (req, res) => {
  if (req.method !== "DELETE") {
    return res.status(405).json({
      error: true,
      message: "Method not allowed. Only DELETE requests are accepted.",
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

    // Check if component exists and belongs to the store
    const existingComponent = await prisma.visual_components.findFirst({
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

    if (!existingComponent) {
      return res.status(404).json({
        error: true,
        message: "Component not found or you don't have permission to delete it.",
        code: "COMPONENT_NOT_FOUND",
      });
    }

    // Delete from database
    const deletedComponent = await prisma.visual_components.delete({
      where: {
        id: id,
      },
    });

    console.log("Component deleted from database:", deletedComponent);

    // Update metaobject to remove the deleted component
    try {
      const metaObjectResult = await removeFromMetaObject(req, deletedComponent);
      console.log("Metaobject updated:", metaObjectResult);
    } catch (metaError) {
      console.error("Error updating metaobject:", metaError);
      // Don't fail the entire operation if metaobject update fails
      // The component is already deleted from database
    }

    return res.status(200).json({
      error: false,
      message: "Component deleted successfully.",
      data: {
        deletedComponent: {
          id: deletedComponent.id,
          name: deletedComponent.name,
          type: deletedComponent.type,
        },
      },
    });
  } catch (error) {
    console.error("---> Error at /api/badge/delete:", error);

    // Handle specific Prisma errors
    if (error.code === "P2025") {
      return res.status(404).json({
        error: true,
        message: "Component not found.",
        code: "COMPONENT_NOT_FOUND",
      });
    }

    if (error.code === "P2003") {
      return res.status(409).json({
        error: true,
        message: "Cannot delete component due to existing references.",
        code: "COMPONENT_HAS_REFERENCES",
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

    // Generic server error
    return res.status(500).json({
      error: true,
      message: "An unexpected error occurred while deleting the component.",
      code: "INTERNAL_SERVER_ERROR",
    });
  } finally {
    await prisma.$disconnect();
  }
};

async function removeFromMetaObject(req, deletedComponent) {
  const { client } = await clientProvider.offline.graphqlClient({
    shop: req.user_shop,
  });
  const metaObjectType = "visual_components";

  try {
    // Get existing metaobjects
    const existingMetaobject = await client.request(
      `query GetMetaobjects($type: String!, $first: Int!) {
        metaobjects(type: $type, first: $first) {
          edges {
            node {
              id
              handle
              fields {
                key
                value
              }
            }
          }
        }
      }`,
      {
        variables: {
          type: metaObjectType,
          first: 10,
        },
      }
    );

    const existingData = existingMetaobject?.data;
    const metaobjects = existingData?.metaobjects?.edges;
    const existingMetaobj = metaobjects?.length > 0 ? metaobjects[0].node : null;

    if (!existingMetaobj) {
      console.log("No metaobject found to update");
      return { success: true, message: "No metaobject found" };
    }

    // Get existing JSON data and parse it
    const existingJsonField = existingMetaobj.fields.find(
      (field) => field.key === "json_data"
    );
    
    if (!existingJsonField || !existingJsonField.value) {
      console.log("No JSON data found in metaobject");
      return { success: true, message: "No JSON data found" };
    }

    let existingArray = [];
    try {
      const parsedData = JSON.parse(existingJsonField.value);
      existingArray = Array.isArray(parsedData) ? parsedData : [parsedData];
    } catch (e) {
      console.warn("Failed to parse existing JSON data");
      return { success: true, message: "Failed to parse existing data" };
    }

    // Remove the deleted component from the array
    const updatedArray = existingArray.filter(item => {
      // Filter out the deleted component by matching various identifiers
      return item.id !== deletedComponent.id && 
             item.name !== deletedComponent.name &&
             !(item.data && item.data.id === deletedComponent.id);
    });

    console.log(`Removed component from metaobject. Before: ${existingArray.length}, After: ${updatedArray.length}`);

    // Update the metaobject with the filtered array
    const result = await client.request(
      `mutation UpdateMetaobject($id: ID!, $metaobject: MetaobjectUpdateInput!) {
        metaobjectUpdate(id: $id, metaobject: $metaobject) {
          metaobject {
            id
            handle
            fields {
              key
              value
            }
          }
          userErrors {
            field
            message
            code
          }
        }
      }`,
      {
        variables: {
          id: existingMetaobj.id,
          metaobject: {
            fields: [
              {
                key: "json_data",
                value: JSON.stringify(updatedArray),
              },
            ],
          },
        },
      }
    );

    const updateData = result?.data;
    return {
      success: true,
      data: updateData?.metaobjectUpdate?.metaobject,
      errors: updateData?.metaobjectUpdate?.userErrors || [],
    };
  } catch (error) {
    console.error("Error updating metaobject:", error);
    return {
      success: false,
      error: error.message || "An unknown error occurred",
    };
  }
}

export default withMiddleware("verifyRequest")(deleteComponent);
