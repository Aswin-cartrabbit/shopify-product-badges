import clientProvider from "@/utils/clientProvider";
import withMiddleware from "@/utils/middleware/withMiddleware";
import prisma from "@/utils/prisma";

/**
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
const handler = async (req, res) => {
  try {
    const store = await prisma.stores.findUnique({
      where: { shop: req.user_shop },
    });
    if (!store) {
      return res
        .status(404)
        .json({ status: false, message: "Store not found" });
    }

    // initialize GraphQL client
    const { client } = await clientProvider.offline.graphqlClient({
      shop: req.user_shop,
    });

    // Query Shopify for active subscription
    const response: any = await client.query({
      data: `{
        appInstallation {
          activeSubscriptions {
            id
            name
            test
            status
            trialDays
            createdAt
            currentPeriodEnd
            lineItems {
              plan {
                pricingDetails {
                  ... on AppRecurringPricing {
                    interval
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }`,
    });

    const activeSubscriptions =
      response?.body?.data?.appInstallation?.activeSubscriptions || [];

    // Extract plan details from lineItems
    const planDetails = activeSubscriptions.map((subscription) => ({
      id: subscription.id,
      name: subscription.name,
      test: subscription.test,
      status: subscription.status,
      trialDays: subscription.trialDays,
      createdAt: subscription.createdAt,
      currentPeriodEnd: subscription.currentPeriodEnd,
      planDetails: subscription.lineItems.map((item) => ({
        interval: item.plan.pricingDetails.interval,
        amount: item.plan.pricingDetails.price.amount,
        currencyCode: item.plan.pricingDetails.price.currencyCode,
      })),
    }));

    console.log(JSON.stringify(planDetails, null, 2));

    res.status(200).json({
      status: true,
      activePlan: planDetails,
    });
  } catch (err) {
    console.error("Error fetching active plan:", err);
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
};

export default withMiddleware("verifyRequest")(handler);
