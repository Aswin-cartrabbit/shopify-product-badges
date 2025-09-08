// utils/billingConfig.ts
export type BillingPlan = {
  name: string;
  price: number;
  currency: string;
  description?: string;
  interval: "EVERY_30_DAYS" | "ANNUAL";
};

export function getBillingPlans(): BillingPlan[] {
  try {
    console.log(process.env.BILLING_PLANS);
    return [
      {
        name: "Basic",
        price: 10.25,
        currency: "USD",
        interval: "EVERY_30_DAYS",
        description:
          "Perfect for small stores. Includes product labels and badges to highlight offers.",
      },
      {
        name: "Pro",
        price: 25.0,
        currency: "USD",
        interval: "EVERY_30_DAYS",
        description:
          "For growing stores. Includes labels, banners, and trust badges for credibility.",
      },
      {
        name: "Enterprise",
        price: 99.0,
        currency: "USD",
        interval: "EVERY_30_DAYS",
      },
    ];
  } catch (e) {
    throw new Error("Invalid BILLING_PLANS env JSON");
  }
}

export function getPlanByName(name: string): BillingPlan | undefined {
  return getBillingPlans().find((plan) => plan.name === name);
}
