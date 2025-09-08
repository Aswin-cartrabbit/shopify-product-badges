// pages/api/billing/verify.ts
import clientProvider from "@/utils/clientProvider";
import withMiddleware from "@/utils/middleware/withMiddleware";
import prisma from "@/utils/prisma";

const handler = async (req, res) => {
  try {
    const { chargeId } = req.body;
    if (!chargeId) {
      return res.status(400).json({ status: false, message: "Missing params" });
    }

    // Find the store
    const store = await prisma.stores.findUnique({
      where: { shop: req.user_shop },
    });
    if (!store) {
      return res
        .status(404)
        .json({ status: false, message: "Store not found" });
    }

    const { client } = await clientProvider.offline.graphqlClient({
      shop: req.user_shop,
    });

    // Get subscription info
    const response = await client.request(/* GraphQL */ `
      {
        appInstallation {
          activeSubscriptions {
            id
            name
            status
            test
            lineItems {
              plan {
                pricingDetails {
                  ... on AppRecurringPricing {
                    __typename
                    price {
                      amount
                      currencyCode
                    }
                    interval
                  }
                }
              }
            }
          }
        }
      }
    `);
    // @ts-ignore
    const active = response?.appInstallation?.activeSubscriptions?.[0] || null;

    if (active) {
      await prisma.billing_transactions.upsert({
        where: { chargeId },
        update: {
          planName: active.name,
          status: active.status,
          price: active.lineItems?.[0]?.plan?.pricingDetails?.price?.amount,
          currency:
            active.lineItems?.[0]?.plan?.pricingDetails?.price?.currencyCode,
          interval: active.lineItems?.[0]?.plan?.pricingDetails?.interval,
          isTest: active.test,
          cancelledAt: active.status !== "ACTIVE" ? new Date() : null,
        },
        create: {
          storeId: store.id,
          chargeId,
          planName: active.name,
          status: active.status,
          price: active.lineItems?.[0]?.plan?.pricingDetails?.price?.amount,
          currency:
            active.lineItems?.[0]?.plan?.pricingDetails?.price?.currencyCode,
          interval: active.lineItems?.[0]?.plan?.pricingDetails?.interval,
          isTest: active.test,
          cancelledAt: active.status !== "ACTIVE" ? new Date() : null,
        },
      });
    }

    res.status(200).json({ status: true, activePlan: active });
  } catch (err) {
    console.error("Verify billing failed", err);
    res.status(500).json({ status: false, message: "Internal error" });
  }
};

export default withMiddleware("verifyRequest")(handler);
