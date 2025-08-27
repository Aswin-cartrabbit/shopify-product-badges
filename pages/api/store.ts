import withMiddleware from "@/utils/middleware/withMiddleware";
import prisma from "@/utils/prisma";

/**
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
const store = async (req, res) => {
  console.log("==========================================");
  console.log("Shop from middleware:", req.user_shop);

  if (req.method !== "GET") {
    return res.status(405).json({ error: true, message: "Method Not Allowed" });
  }

  try {
    const store = await prisma.stores.findUnique({
      where: {
        shop: req.user_shop,
      },
    });

    if (!store) {
      return res.status(404).json({ error: true, message: "Store not found" });
    }

    return res.status(200).json({
      status: true,
      message: "Success!",
      store,
    });
  } catch (e) {
    console.error("---> An error occurred at /api/store", e);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

export default withMiddleware("verifyRequest")(store);
