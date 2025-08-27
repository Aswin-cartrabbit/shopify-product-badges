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
    const { limit = 50, collection_id, product_type, vendor, search } = req.query;

    if (!storeId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get products from Shopify
    const products = await shopifyApi.getProducts(req, res, {
      limit: parseInt(limit),
      collection_id,
      product_type,
      vendor,
    });

    // Filter by search term if provided
    let filteredProducts = products;
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredProducts = products.filter(product => 
        product.title.toLowerCase().includes(searchTerm) ||
        product.handle.toLowerCase().includes(searchTerm) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Get unique product types and vendors for filtering
    const productTypes = [...new Set(products.map(p => p.product_type).filter(Boolean))];
    const vendors = [...new Set(products.map(p => p.vendor).filter(Boolean))];

    return res.status(200).json({
      products: filteredProducts,
      filters: {
        productTypes,
        vendors,
      },
      total: filteredProducts.length,
    });
  } catch (error) {
    console.error("---> Error fetching products:", error);
    return res.status(500).json({ error: "Failed to fetch products" });
  }
};

export default withMiddleware("verifyRequest")(handler);
