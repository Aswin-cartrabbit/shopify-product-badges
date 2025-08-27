// Shopify API utility functions for theme and product management
import shopify from "./shopify";
import clientProvider from "./clientProvider";

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  product_type: string;
  vendor: string;
  tags: string[];
  collections?: string[];
}

export interface ThemeAsset {
  key: string;
  value?: string;
  attachment?: string;
  content_type: string;
}

export const shopifyApi = {
  // Get products for targeting
  async getProducts(req: any, res: any, params?: {
    limit?: number;
    collection_id?: string;
    product_type?: string;
    vendor?: string;
  }) {
    try {
      const { client } = await clientProvider.online.graphqlClient({ req, res });
      
      let query = `
        query getProducts($first: Int!) {
          products(first: $first) {
            edges {
              node {
                id
                title
                handle
                productType
                vendor
                tags
              }
            }
          }
        }
      `;

      const variables = {
        first: params?.limit || 50,
      };

      const response = await client.request(query, variables as any);
      return response.data.products.edges.map((edge: any) => ({
        id: edge.node.id,
        title: edge.node.title,
        handle: edge.node.handle,
        product_type: edge.node.productType,
        vendor: edge.node.vendor,
        tags: edge.node.tags,
      }));
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  // Get collections for targeting
  async getCollections(req: any, res: any) {
    try {
      const { client } = await clientProvider.online.graphqlClient({ req, res });
      
      const query = `
        query getCollections($first: Int!) {
          collections(first: $first) {
            edges {
              node {
                id
                title
                handle
              }
            }
          }
        }
      `;

      const response = await client.request(query, { first: 100 } as any);
      return response.data.collections.edges.map((edge: any) => ({
        id: edge.node.id,
        title: edge.node.title,
        handle: edge.node.handle,
      }));
    } catch (error) {
      console.error("Error fetching collections:", error);
      throw error;
    }
  },

  // Get current theme
  async getCurrentTheme(req: any, res: any) {
    try {
      const { client } = await clientProvider.online.graphqlClient({ req, res });
      
      const query = `
        query {
          shop {
            id
          }
        }
      `;

      // Use REST API for themes as GraphQL doesn't support themes well
      const session = res.locals?.shopify?.session;
      if (!session) {
        throw new Error("No session found");
      }

      const restClient = new shopify.clients.Rest({ 
        session: session 
      });

      const themes = await restClient.get({
        path: 'themes',
      });

      const currentTheme = themes.body.themes.find((theme: any) => theme.role === 'main');
      return currentTheme;
    } catch (error) {
      console.error("Error fetching current theme:", error);
      throw error;
    }
  },

  // Create or update script tag for badge rendering
  async createScriptTag(req: any, res: any, scriptUrl: string) {
    try {
      const session = res.locals?.shopify?.session;
      if (!session) {
        throw new Error("No session found");
      }

      const restClient = new shopify.clients.Rest({ 
        session: session 
      });

      // Check if script tag already exists
      const existingScripts = await restClient.get({
        path: 'script_tags',
      });

      const existingScript = existingScripts.body.script_tags.find(
        (script: any) => script.src.includes('badge-renderer')
      );

      if (existingScript) {
        // Update existing script tag
        await restClient.put({
          path: `script_tags/${existingScript.id}`,
          data: {
            script_tag: {
              src: scriptUrl,
              event: 'onload',
            },
          },
        });
        return existingScript;
      } else {
        // Create new script tag
        const newScript = await restClient.post({
          path: 'script_tags',
          data: {
            script_tag: {
              src: scriptUrl,
              event: 'onload',
            },
          },
        });
        return newScript.body.script_tag;
      }
    } catch (error) {
      console.error("Error creating/updating script tag:", error);
      throw error;
    }
  },

  // Remove script tag
  async removeScriptTag(req: any, res: any) {
    try {
      const session = res.locals?.shopify?.session;
      if (!session) {
        throw new Error("No session found");
      }

      const restClient = new shopify.clients.Rest({ 
        session: session 
      });

      const existingScripts = await restClient.get({
        path: 'script_tags',
      });

      const badgeScript = existingScripts.body.script_tags.find(
        (script: any) => script.src.includes('badge-renderer')
      );

      if (badgeScript) {
        await restClient.delete({
          path: `script_tags/${badgeScript.id}`,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error removing script tag:", error);
      throw error;
    }
  },

  // Create metafield for product badge data
  async createProductMetafield(req: any, res: any, productId: string, badgeData: any) {
    try {
      const { client } = await clientProvider.online.graphqlClient({ req, res });
      
      const mutation = `
        mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
          metafieldsSet(metafields: $metafields) {
            metafields {
              id
              namespace
              key
              value
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const variables = {
        metafields: [{
          ownerId: productId,
          namespace: "hackathon_badges",
          key: "badge_data",
          value: JSON.stringify(badgeData),
          type: "json",
        }],
      };

      const response = await client.request(mutation, variables as any);
      if (response.data.metafieldsSet.userErrors.length > 0) {
        throw new Error(response.data.metafieldsSet.userErrors[0].message);
      }

      return response.data.metafieldsSet.metafields[0];
    } catch (error) {
      console.error("Error creating product metafield:", error);
      throw error;
    }
  },

  // Get shop information
  async getShopInfo(req: any, res: any) {
    try {
      const { client } = await clientProvider.online.graphqlClient({ req, res });
      
      const query = `
        query {
          shop {
            id
            name
            myshopifyDomain
            primaryDomain {
              url
              host
            }
            plan {
              displayName
            }
          }
        }
      `;

      const response = await client.request(query);
      return response.data.shop;
    } catch (error) {
      console.error("Error fetching shop info:", error);
      throw error;
    }
  },

  // Create app embed for badges
  async createAppEmbed(req: any, res: any) {
    try {
      const session = res.locals?.shopify?.session;
      if (!session) {
        throw new Error("No session found");
      }

      // This would typically involve creating theme app extensions
      // For now, we'll use script tags as a simpler implementation
      const scriptUrl = `${process.env.SHOPIFY_APP_URL}/api/badge-renderer.js`;
      return await this.createScriptTag(req, res, scriptUrl);
    } catch (error) {
      console.error("Error creating app embed:", error);
      throw error;
    }
  },
};
