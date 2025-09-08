// services/billingService.ts
import clientProvider from "@/utils/clientProvider";
import { getPlanByName } from "@/utils/billingConfig";

export class BillingService {
  constructor(private shop: string) {}

  async createSubscription(planName: string) {
    const plan = getPlanByName(planName);
    if (!plan) throw new Error("Plan not found");

    const { client } = await clientProvider.offline.graphqlClient({
      shop: this.shop,
    });

    const returnUrl = `https://admin.shopify.com/store/${this.shop.split(".")[0]}/apps/${process.env.APP_HANDLE}/billing`;

    const response = await client.request(
      /* GraphQL */ `
        mutation CreateSubscription(
          $name: String!
          $lineItems: [AppSubscriptionLineItemInput!]!
          $returnUrl: URL!
          $test: Boolean
        ) {
          appSubscriptionCreate(
            name: $name
            returnUrl: $returnUrl
            lineItems: $lineItems
            test: $test
          ) {
            userErrors {
              field
              message
            }
            confirmationUrl
            appSubscription {
              id
              status
            }
          }
        }
      `,
      {
        variables: {
          name: plan.name,
          returnUrl,
          test: true, // process.env.NODE_ENV !== "production",
          lineItems: [
            {
              plan: {
                appRecurringPricingDetails: {
                  price: {
                    amount: plan.price,
                    currencyCode: plan.currency,
                  },
                  interval: plan.interval,
                },
              },
            },
          ],
        },
      }
    );

    const errors = response.data.appSubscriptionCreate.userErrors;
    if (errors.length > 0)
      throw new Error(errors.map((e) => e.message).join(", "));

    return response.data.appSubscriptionCreate.confirmationUrl;
  }

  async cancelSubscription(subscriptionId: string) {
    const { client } = await clientProvider.offline.graphqlClient({
      shop: this.shop,
    });

    const response = await client.request(
      /* GraphQL */ `
        mutation CancelSubscription($id: ID!) {
          appSubscriptionCancel(id: $id) {
            appSubscription {
              id
              status
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      { variables: { id: subscriptionId } }
    );

    const errors = response.data.appSubscriptionCancel.userErrors;
    if (errors.length > 0)
      throw new Error(errors.map((e) => e.message).join(", "));

    return response.data.appSubscriptionCancel.appSubscription;
  }

  async upgradeSubscription(currentId: string, newPlan: string) {
    await this.cancelSubscription(currentId);
    return this.createSubscription(newPlan);
  }

  async downgradeSubscription(currentId: string, newPlan: string) {
    return this.upgradeSubscription(currentId, newPlan);
  }
}
