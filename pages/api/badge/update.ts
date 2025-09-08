import clientProvider from "@/utils/clientProvider";
import withMiddleware from "@/utils/middleware/withMiddleware";
import prisma from "@/utils/prisma";

/**
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
const update = async (req, res) => {
  if (req.method !== "PUT" && req.method !== "PATCH") {
    return res.status(405).json({
      error: true,
      message: "Method not allowed. Only PUT and PATCH requests are accepted.",
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
    const {
      name,
      description,
      type,
      design,
      display,
      settings,
      status,
    } = req.body;

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

    // Map the payload structure to database fields
    const templates = design; // design data goes to templates field
    const rules = display;    // display data goes to rules field

    // Debug logging to verify data structure
    console.log("=== UPDATE BACKEND DEBUG ===");
    console.log("Component ID:", id);
    console.log("Received design data:", JSON.stringify(design, null, 2));
    console.log("Mapped to templates field:", JSON.stringify(templates, null, 2));
    console.log("===========================");

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
        message: "Component not found or you don't have permission to update it.",
        code: "COMPONENT_NOT_FOUND",
      });
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

    // Validate status if provided
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

    // Check for duplicate name (excluding current component)
    if (name && name !== existingComponent.name) {
      const duplicateCheck = await prisma.visual_components.findFirst({
        where: {
          storeId,
          name,
          id: {
            not: id,
          },
        },
      });

      if (duplicateCheck) {
        return res.status(409).json({
          error: true,
          message: "A component with this name already exists for this store.",
          code: "COMPONENT_NAME_EXISTS",
          existingId: duplicateCheck.id,
        });
      }
    }

    // Prepare update data - only update fields that are provided
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) updateData.type = type;
    if (templates !== undefined) updateData.templates = templates;
    if (rules !== undefined) updateData.rules = rules;
    if (settings !== undefined) updateData.settings = settings;
    if (status !== undefined) updateData.status = status;

    // Update component in database
    const updatedComponent = await prisma.visual_components.update({
      where: {
        id: id,
      },
      data: updateData,
      include: {
        store: {
          select: {
            shop: true,
            isActive: true,
          },
        },
      },
    });

    // Update metaobject with the updated component data
    const metaObjectResult = await updateMetaObject(req, updatedComponent, existingComponent);
    console.log("Metaobject update result:", metaObjectResult);

    return res.status(200).json({
      error: false,
      message: "Component updated successfully.",
      data: updatedComponent,
    });
  } catch (error) {
    console.error("---> Error at /api/badge/update:", error);

    if (error.code === "P2002") {
      return res.status(409).json({
        error: true,
        message: "A component with these details already exists.",
        code: "DUPLICATE_COMPONENT",
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        error: true,
        message: "Component not found.",
        code: "COMPONENT_NOT_FOUND",
      });
    }

    return res.status(500).json({
      error: true,
      message: "Unexpected error occurred while updating the component.",
      code: "INTERNAL_SERVER_ERROR",
    });
  } finally {
    await prisma.$disconnect();
  }
};

async function updateMetaObject(req, updatedComponent, originalComponent) {
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

    // Find and update the component in the array
    const updatedArray = existingArray.map(item => {
      // Check if this is the component we're updating
      if (item.id === originalComponent.id || 
          item.name === originalComponent.name ||
          (item.data && item.data.id === originalComponent.id)) {
        
        // Create the updated payload based on the new component data
        const updatedPayload = {
          name: updatedComponent.name,
          description: updatedComponent.description,
          type: updatedComponent.type,
          design: updatedComponent.templates,
          display: updatedComponent.rules,
          settings: updatedComponent.settings,
          status: updatedComponent.status,
          id: updatedComponent.id,
          createdAt: updatedComponent.createdAt,
          updatedAt: updatedComponent.updatedAt,
        };

        console.log("Updating component in metaobject:", updatedPayload);
        return updatedPayload;
      }
      return item;
    });

    console.log(`Updated component in metaobject. Array length: ${updatedArray.length}`);

    // Update the metaobject with the updated array
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
    const errors = updateData?.metaobjectUpdate?.userErrors || [];
    
    if (errors.length > 0) {
      console.error("Metaobject update errors:", errors);
      return {
        success: false,
        errors: errors,
      };
    }

    return {
      success: true,
      data: updateData?.metaobjectUpdate?.metaobject,
      errors: [],
    };
  } catch (error) {
    console.error("Error updating metaobject:", error);
    return {
      success: false,
      error: error.message || "An unknown error occurred",
    };
  }
}

export default withMiddleware("verifyRequest")(update);
