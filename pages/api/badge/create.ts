import clientProvider from "@/utils/clientProvider";
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
    const storeOnMetaObject = await updateMetaObject(req, req.body);
    console.log(storeOnMetaObject);
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

async function ensureMetaobjectDefinition(client, type) {
  try {
    const metaObjectType = "visual_components";
    const metaObjectName = "Visual Components";

    // Check if the metaobject definition exists
    const definitionCheck = await client.request(
      `query GetMetaobjectDefinition($type: String!) {
        metaobjectDefinitionByType(type: $type) {
          id
          type
        }
      }`,
      {
        variables: {
          type: metaObjectType, // Remove the $app: prefix here
        },
      }
    );

    // If definition exists, return success
    if (definitionCheck?.data?.metaobjectDefinitionByType) {
      return { success: true };
    }

    // Create the metaobject definition if it doesn't exist
    const createDefinition = await client.request(
      `mutation CreateMetaobjectDefinition($definition: MetaobjectDefinitionCreateInput!) {
        metaobjectDefinitionCreate(definition: $definition) {
          metaobjectDefinition {
            id
            type
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
          definition: {
            type: metaObjectType,
            name: metaObjectName,
            fieldDefinitions: [
              {
                key: "json_data",
                name: "JSON Data",
                type: "json",
                required: false,
              },
            ],
            // Remove access configuration for merchant-owned types
          },
        },
      }
    );

    const errors =
      createDefinition?.data?.metaobjectDefinitionCreate?.userErrors || [];
    if (errors.length > 0) {
      throw new Error(
        `Failed to create metaobject definition: ${errors[0].message}`
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Error ensuring metaobject definition:", error);
    throw error;
  }
}

async function updateMetaObject(req, payload) {
  const { client } = await clientProvider.offline.graphqlClient({
    shop: req.user_shop,
  });
  const metaObjectType = "visual_components";
  const metaObjectName = "Visual Components";

  try {
    // Ensure the metaobject definition exists before proceeding
    await ensureMetaobjectDefinition(client, "visual_components");

    // First, check if the metaobject already exists
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

    let result;

    // Safe access to the response data - note: metaobjects (plural)
    const existingData = existingMetaobject?.data;
    const metaobjects = existingData?.metaobjects?.edges;

    // Find existing metaobject (if any)
    const existingMetaobj =
      metaobjects?.length > 0 ? metaobjects[0].node : null;

    // Validate payload data before proceeding
    if (!payload) {
      return {
        success: false,
        error: "Payload data is required and cannot be null or undefined",
      };
    }

    let finalPayload;

    if (existingMetaobj) {
      // Get existing JSON data and parse it
      const existingJsonField = existingMetaobj.fields.find(
        (field) => field.key === "json_data"
      );
      let existingArray = [];

      if (existingJsonField && existingJsonField.value) {
        try {
          const parsedData = JSON.parse(existingJsonField.value);
          // If existing data is already an array, use it; otherwise, wrap it in an array
          existingArray = Array.isArray(parsedData) ? parsedData : [parsedData];
        } catch (e) {
          console.warn(
            "Failed to parse existing JSON data, starting with empty array"
          );
          existingArray = [];
        }
      }

      // Add new payload to the array
      existingArray.push(payload);
      finalPayload = existingArray;

      // Update existing metaobject
      result = await client.request(
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
                  value: JSON.stringify(finalPayload),
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
    } else {
      // Create new metaobject with payload as first item in array
      finalPayload = [payload];

      result = await client.request(
        `mutation CreateMetaobject($metaobject: MetaobjectCreateInput!) {
          metaobjectCreate(metaobject: $metaobject) {
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
            metaobject: {
              type: metaObjectType,
              handle: "visual-components",
              fields: [
                {
                  key: "json_data",
                  value: JSON.stringify(finalPayload),
                },
              ],
            },
          },
        }
      );

      const createData = result?.data;
      return {
        success: true,
        data: createData?.metaobjectCreate?.metaobject,
        errors: createData?.metaobjectCreate?.userErrors || [],
      };
    }
  } catch (error) {
    console.error("Error updating metaobject:", error);
    return {
      success: false,
      error: error.message || "An unknown error occurred",
    };
  }
}

export default withMiddleware("verifyRequest")(create);
