import clientProvider from "@/utils/clientProvider";
import withMiddleware from "@/utils/middleware/withMiddleware";

/**
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

    // Get the active theme
    const themeResponse = await client.request(
      /* GraphQL */ `
        query GetActiveTheme {
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

    const activeTheme = themeResponse.data.themes.edges.find(
      (edge) => edge.node.role === "MAIN"
    );

    if (!activeTheme) {
      return res.status(404).send({ error: "No active theme found" });
    }

    const themeId = activeTheme.node.id.split('/').pop();

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

    if (!assetResponse.data.themeAsset || !assetResponse.data.themeAsset.content) {
      return res.status(404).send({ error: "Could not retrieve theme settings" });
    }

    const settings = JSON.parse(assetResponse.data.themeAsset.content);
    
    // Check if app embeds are enabled
    const blocks = settings?.current?.blocks || {};
    
    // Look for app embed blocks that match our app
    // The app embed block type typically follows the pattern: "apps/your-app-handle/blocks/embed"
    const appEmbedBlocks = Object.entries(blocks).filter(([blockId, blockInfo]) => {
      const block = blockInfo as any;
      return block.type && block.type.includes('/blocks/') && !block.disabled;
    });

    // Check if any app embed block is related to our app
    // You may need to adjust this logic based on your specific app's embed block naming
    const hasAppEmbedEnabled = appEmbedBlocks.length > 0;
    
    // For more specific checking, you could look for your app's specific handle:
    // const hasOurAppEmbed = appEmbedBlocks.some(([blockId, blockInfo]) => 
    //   blockInfo.type.includes('your-app-handle')
    // );

    return res.status(200).send({
      hasAppEmbedEnabled,
      activeTheme: {
        id: activeTheme.node.id,
        name: activeTheme.node.name,
      },
      appEmbedBlocks: appEmbedBlocks.length,
      allBlocks: Object.keys(blocks).length,
    });

  } catch (error) {
    console.error("Error checking theme embed status:", error);
    
    // More helpful error handling
    if (error.message?.includes('Authentication')) {
      return res.status(401).send({ 
        error: "Authentication failed",
        details: "Unable to authenticate with Shopify API" 
      });
    }
    
    if (error.message?.includes('GraphQL')) {
      return res.status(400).send({ 
        error: "GraphQL query failed",
        details: error.message 
      });
    }
    
    return res.status(500).send({ 
      error: "Failed to check theme embed status",
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

export default withMiddleware("verifyRequest")(handler);
