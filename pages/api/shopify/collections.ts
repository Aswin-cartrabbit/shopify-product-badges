import withMiddleware from "@/utils/middleware/withMiddleware";
import { shopifyApi } from "@/utils/shopifyApi";

/**
 * @param {import("next").NextApiRequest} req - The HTTP request object.
 * @param {import("next").NextApiResponse} res - The HTTP response object.
 */
const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { user_id: storeId } = req;
    const { search } = req.query;

    if (!storeId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get collections from Shopify
    const collections = await shopifyApi.getCollections(req, res);

    // Filter by search term if provided
    let filteredCollections = collections;
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredCollections = collections.filter(collection => 
        collection.title.toLowerCase().includes(searchTerm) ||
        collection.handle.toLowerCase().includes(searchTerm)
      );
    }

    return res.status(200).json({
      collections: filteredCollections,
      total: filteredCollections.length,
    });
  } catch (error) {
    console.error("---> Error fetching collections:", error);
    return res.status(500).json({ error: "Failed to fetch collections" });
  }
};

export default withMiddleware("verifyRequest")(handler);
