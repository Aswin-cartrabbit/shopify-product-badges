import clientProvider from "@/utils/clientProvider";
import withMiddleware from "@/utils/middleware/withMiddleware";

/**
 * Test endpoint to manually check theme embed status
 * This can be used for debugging or testing purposes
 * 
 * @param {import("next").NextApiRequest} req - The HTTP request object.
 * @param {import("next").NextApiResponse} res - The HTTP response object.
 */
const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).send({ error: "Method not allowed" });
  }

  try {
    const { client } = await clientProvider.offline.graphqlClient({
      shop: req.user_shop,
    });

    // Get all themes for debugging
    const themesResponse = await client.request(
      /* GraphQL */ `
        query GetAllThemes {
          themes(first: 50) {
            edges {
              node {
                id
                name
                role
                createdAt
                updatedAt
              }
            }
          }
        }
      `
    );

    const activeTheme = themesResponse.data.themes.edges.find(
      (edge) => edge.node.role === "MAIN"
    );

    if (!activeTheme) {
      return res.status(404).send({ 
        error: "No active theme found",
        allThemes: themesResponse.data.themes.edges.map(edge => ({
          id: edge.node.id,
          name: edge.node.name,
          role: edge.node.role
        }))
      });
    }

    // Get theme files for debugging
    const filesResponse = await client.request(
      /* GraphQL */ `
        query GetThemeFiles($themeId: ID!) {
          theme(id: $themeId) {
            files(first: 100) {
              edges {
                node {
                  filename
                  size
                  contentType
                  createdAt
                  updatedAt
                }
              }
            }
          }
        }
      `,
      {
        variables: {
          themeId: activeTheme.node.id
        }
      }
    );

    // Get the settings_data.json asset
    const assetResponse = await client.request(
      /* GraphQL */ `
        query GetThemeAsset($input: AssetInput!) {
          themeAsset(input: $input) {
            ... on OnlineStoreThemeFileBodyText {
              content
            }
            ... on UserError {
              field
              message
            }
          }
        }
      `,
      {
        variables: {
          input: {
            themeId: activeTheme.node.id,
            key: "config/settings_data.json"
          }
        }
      }
    );

    let settingsData = null;
    let blocks = {};
    let appEmbedBlocks = [];

    if (assetResponse.data.themeAsset && assetResponse.data.themeAsset.content) {
      try {
        settingsData = JSON.parse(assetResponse.data.themeAsset.content);
        blocks = settingsData?.current?.blocks || {};
        
        // Find app embed blocks
        appEmbedBlocks = Object.entries(blocks)
          .filter(([blockId, blockInfo]) => {
            return blockInfo.type && blockInfo.type.includes('/blocks/');
          })
          .map(([blockId, blockInfo]) => ({
            id: blockId,
            type: blockInfo.type,
            disabled: blockInfo.disabled || false,
            settings: blockInfo.settings || {}
          }));
      } catch (parseError) {
        console.error("Error parsing settings_data.json:", parseError);
      }
    }

    return res.status(200).send({
      shop: req.user_shop,
      activeTheme: {
        id: activeTheme.node.id,
        name: activeTheme.node.name,
        role: activeTheme.node.role
      },
      allThemes: themesResponse.data.themes.edges.map(edge => ({
        id: edge.node.id,
        name: edge.node.name,
        role: edge.node.role
      })),
      themeFiles: filesResponse.data.theme?.files?.edges?.map(edge => edge.node.filename) || [],
      hasSettingsData: !!settingsData,
      totalBlocks: Object.keys(blocks).length,
      appEmbedBlocks,
      hasAnyAppEmbed: appEmbedBlocks.length > 0,
      enabledAppEmbeds: appEmbedBlocks.filter(block => !block.disabled).length,
      settingsStructure: settingsData ? {
        hasBlocks: !!settingsData.current?.blocks,
        hasSections: !!settingsData.current?.sections,
        hasPresets: !!settingsData.presets
      } : null
    });

  } catch (error) {
    console.error("Error in test theme embed endpoint:", error);
    return res.status(500).send({ 
      error: "Failed to test theme embed status",
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export default withMiddleware("verifyRequest")(handler);
