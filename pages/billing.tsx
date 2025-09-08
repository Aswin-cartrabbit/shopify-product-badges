import type React from "react";
import { useEffect, useState } from "react";
import {
  Card,
  Page,
  Layout,
  Button,
  Text,
  InlineStack,
  BlockStack,
  Badge,
  Divider,
  Icon,
  Modal,
  ButtonGroup,
} from "@shopify/polaris";
import {
  CheckIcon,
  StarFilledIcon,
  CreditCardIcon,
  TransferInIcon,
  AlertTriangleIcon,
} from "@shopify/polaris-icons";
import { useRouter } from "next/router";

type Plan = {
  name: string;
  price: number;
  currency: string;
  interval: string;
  description: string;
  features: string[];
  popular?: boolean;
  icon: any;
  savings?: string;
};

type ActivePlan = {
  id: string;
  name: string;
  test: boolean;
  status: string;
  trialDays: number;
  createdAt: string;
  currentPeriodEnd: string;
  planDetails: {
    interval: string;
    amount: string;
    currencyCode: string;
  }[];
};

const plans: Plan[] = [
  {
    name: "Basic",
    price: 10.25,
    currency: "USD",
    interval: "EVERY_30_DAYS",
    description:
      "Perfect for small stores just getting started with product promotion.",
    icon: CreditCardIcon,
    features: [
      "Product labels and badges",
      "Basic offer highlights",
      "5 label designs",
      "Email support",
      "Mobile responsive",
    ],
  },
  {
    name: "Pro",
    price: 25.0,
    currency: "USD",
    interval: "EVERY_30_DAYS",
    description:
      "Ideal for growing stores that need advanced promotional tools.",
    popular: true,
    icon: TransferInIcon,
    savings: "Most Popular",
    features: [
      "Everything in Basic",
      "Custom banners & badges",
      "Trust badges for credibility",
      "15 premium designs",
      "Priority email support",
      "A/B testing tools",
      "Analytics dashboard",
    ],
  },
  {
    name: "Enterprise",
    price: 99.0,
    currency: "USD",
    interval: "EVERY_30_DAYS",
    description:
      "Complete solution for large brands with advanced customization needs.",
    icon: TransferInIcon,
    savings: "Best Value",
    features: [
      "Everything in Pro",
      "Unlimited custom designs",
      "Advanced trust badges",
      "White-label options",
      "Dedicated account manager",
      "Phone & chat support",
      "Custom integrations",
      "Advanced analytics",
      "Priority feature requests",
    ],
  },
];

const BillingPlans: React.FC = () => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [activePlan, setActivePlan] = useState<ActivePlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const router = useRouter();
  const { charge_id } = router.query;

  useEffect(() => {
    if (charge_id) {
      const verifyBilling = async () => {
        try {
          await fetch(`/api/billing/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chargeId: charge_id }),
          });
        } catch (err) {
          console.error("Billing verification failed:", err);
        }
      };
      verifyBilling();
    }
  }, [charge_id]);

  useEffect(() => {
    const fetchActivePlan = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/billing/active`);
        const data = await res.json();

        console.log("Active plan data:", data);

        if (data?.status && data?.activePlan && data.activePlan.length > 0) {
          // Get the first active subscription
          setActivePlan(data.activePlan[0]);
        } else {
          setActivePlan(null);
        }
      } catch (err) {
        console.error("Failed to fetch active plan:", err);
        setActivePlan(null);
      } finally {
        setLoading(false);
      }
    };

    fetchActivePlan();
  }, []);

  const handleSelectPlan = async (planName: string) => {
    setLoadingPlan(planName);
    try {
      const response = await fetch(
        `/api/apps/debug/createNewSubscription?action=create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planName }),
        }
      );
      const data = await response.json();
      if (data.confirmationUrl) {
        window.open(data.confirmationUrl, "_blank");
      }
    } catch (err) {
      console.error("Failed to start subscription:", err);
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleCancelSubscription = async () => {
    if (!activePlan) return;

    setCanceling(true);
    try {
      const response = await fetch(
        `/api/apps/debug/createNewSubscription?action=cancel`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscriptionId: activePlan.id }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Refresh the active plan data
        const res = await fetch(`/api/billing/active`);
        const planData = await res.json();

        if (
          planData?.status &&
          planData?.activePlan &&
          planData.activePlan.length > 0
        ) {
          setActivePlan(planData.activePlan[0]);
        } else {
          setActivePlan(null);
        }

        setShowCancelModal(false);

        // You might want to show a success toast or notification here
        console.log("Subscription cancelled successfully");
      } else {
        console.error("Failed to cancel subscription:", data.error);
        // You might want to show an error toast or notification here
      }
    } catch (err) {
      console.error("Failed to cancel subscription:", err);
      // You might want to show an error toast or notification here
    } finally {
      setCanceling(false);
    }
  };

  const isCurrentPlan = (planName: string) => {
    return activePlan?.name === planName;
  };

  const getCurrentPlanPrice = () => {
    if (!activePlan?.planDetails || activePlan.planDetails.length === 0) {
      return 0;
    }
    return parseFloat(activePlan.planDetails[0].amount);
  };

  const getButtonVariant = (plan: Plan) => {
    if (isCurrentPlan(plan.name)) {
      return "secondary";
    }

    const currentPrice = getCurrentPlanPrice();
    return plan.price > currentPrice ? "primary" : "secondary";
  };

  const getButtonText = (plan: Plan) => {
    if (isCurrentPlan(plan.name)) {
      return "Current Plan";
    }

    if (!activePlan) {
      return `Get Started with ${plan.name}`;
    }

    const currentPrice = getCurrentPlanPrice();
    if (plan.price > currentPrice) {
      return `Upgrade to ${plan.name}`;
    } else if (plan.price < currentPrice) {
      return `Downgrade to ${plan.name}`;
    } else {
      return `Switch to ${plan.name}`;
    }
  };

  if (loading) {
    return (
      <Page title="Choose Your Plan">
        <Layout>
          <Layout.Section>
            <Card>
              <div style={{ textAlign: "center", padding: "40px" }}>
                <Text as="p" variant="bodyMd">
                  Loading your current plan...
                </Text>
              </div>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page
      title="Choose Your Plan"
      subtitle="Select the perfect plan to grow your store with powerful promotional tools"
    >
      <Layout>
        {activePlan && (
          <Layout.Section>
            <Card>
              <BlockStack gap="300">
                <InlineStack gap="400" blockAlign="start" align="space-between">
                  <BlockStack gap="300">
                    <Text as="h3" variant="headingMd" fontWeight="semibold">
                      Current Active Plan
                    </Text>
                    <InlineStack gap="200" blockAlign="center">
                      <Badge tone="success">Active</Badge>
                      <Text as="span" variant="bodyMd" fontWeight="semibold">
                        {activePlan.name}
                      </Text>
                      <Text as="span" variant="bodyMd" tone="subdued">
                        ${activePlan.planDetails[0]?.amount}/
                        {activePlan.planDetails[0]?.interval === "EVERY_30_DAYS"
                          ? "month"
                          : "year"}
                      </Text>
                      {activePlan.test && <Badge tone="info">Test Mode</Badge>}
                    </InlineStack>
                    <Text as="p" variant="bodySm" tone="subdued">
                      Current period ends:{" "}
                      {new Date(
                        activePlan.currentPeriodEnd
                      ).toLocaleDateString()}
                    </Text>
                  </BlockStack>

                  <Button
                    variant="secondary"
                    tone="critical"
                    onClick={() => setShowCancelModal(true)}
                    size="medium"
                  >
                    Cancel Subscription
                  </Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        )}

        <Layout.Section>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px",
            }}
          >
            {plans.map((plan) => (
              <div key={plan.name} style={{ position: "relative" }}>
                {plan.popular && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-16px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      zIndex: 10,
                    }}
                  >
                    {/* @ts-ignore */}
                    <Badge tone="success" size="large">
                      <InlineStack gap="100" blockAlign="center">
                        <Icon source={StarFilledIcon} />
                        <Text as="span" variant="bodySm" fontWeight="semibold">
                          {plan.savings}
                        </Text>
                      </InlineStack>
                    </Badge>
                  </div>
                )}

                <Card padding="600">
                  <BlockStack gap="500">
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          marginBottom: "16px",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            padding: "12px",
                            backgroundColor: isCurrentPlan(plan.name)
                              ? "var(--p-color-bg-success-subdued)"
                              : "var(--p-color-bg-surface-secondary)",
                            borderRadius: "50%",
                          }}
                        >
                          <Icon
                            source={plan.icon}
                            tone={
                              isCurrentPlan(plan.name) ? "success" : undefined
                            }
                          />
                        </div>
                      </div>

                      <InlineStack gap="200" blockAlign="center" align="center">
                        <Text as="h2" variant="headingLg" fontWeight="bold">
                          {plan.name}
                        </Text>
                        {isCurrentPlan(plan.name) && (
                          <Badge tone="success" size="small">
                            Current
                          </Badge>
                        )}
                      </InlineStack>

                      <div style={{ marginTop: "8px", marginBottom: "16px" }}>
                        <InlineStack align="center" gap="100">
                          <Text
                            as="span"
                            variant="headingXl"
                            fontWeight="bold"
                            tone="success"
                          >
                            ${plan.price.toFixed(2)}
                          </Text>
                          <Text as="span" variant="bodyMd" tone="subdued">
                            /
                            {plan.interval === "EVERY_30_DAYS"
                              ? "month"
                              : "year"}
                          </Text>
                        </InlineStack>
                      </div>

                      <Text
                        as="p"
                        variant="bodyMd"
                        tone="subdued"
                        alignment="center"
                      >
                        {plan.description}
                      </Text>
                    </div>

                    <Divider />

                    <BlockStack gap="300">
                      <Text as="h3" variant="headingSm" fontWeight="semibold">
                        What's included:
                      </Text>
                      <BlockStack gap="200">
                        {plan.features.map((feature, index) => (
                          <InlineStack key={index} gap="200" blockAlign="start">
                            <div style={{ marginTop: "4px" }}>
                              <Icon source={CheckIcon} tone="success" />
                            </div>
                            <Text as="span" variant="bodyMd">
                              {feature}
                            </Text>
                          </InlineStack>
                        ))}
                      </BlockStack>
                    </BlockStack>

                    {/* CTA Button */}
                    <div style={{ paddingTop: "16px" }}>
                      <Button
                        variant={getButtonVariant(plan)}
                        size="large"
                        fullWidth
                        disabled={isCurrentPlan(plan.name)}
                        loading={loadingPlan === plan.name}
                        onClick={() => handleSelectPlan(plan.name)}
                      >
                        {loadingPlan === plan.name
                          ? "Processing..."
                          : getButtonText(plan)}
                      </Button>
                    </div>

                    {plan.popular && !isCurrentPlan(plan.name) && (
                      <div style={{ textAlign: "center" }}>
                        <Text as="p" variant="bodySm" tone="subdued">
                          ⚡ Start your 14-day free trial
                        </Text>
                      </div>
                    )}
                  </BlockStack>
                </Card>
              </div>
            ))}
          </div>
        </Layout.Section>

        {/* FAQ Section */}
        <Layout.Section>
          <div style={{ marginTop: "48px" }}>
            <Card padding="600">
              <BlockStack gap="500">
                <div style={{ textAlign: "center" }}>
                  <Text as="h2" variant="headingLg" fontWeight="bold">
                    Frequently Asked Questions
                  </Text>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "24px",
                  }}
                >
                  <BlockStack gap="300">
                    <Text as="h3" variant="headingSm" fontWeight="semibold">
                      Can I change plans anytime?
                    </Text>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Yes! You can upgrade or downgrade your plan at any time.
                      Changes take effect immediately.
                    </Text>
                  </BlockStack>

                  <BlockStack gap="300">
                    <Text as="h3" variant="headingSm" fontWeight="semibold">
                      Is there a free trial?
                    </Text>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      All plans come with a 14-day free trial. No credit card
                      required to start.
                    </Text>
                  </BlockStack>

                  <BlockStack gap="300">
                    <Text as="h3" variant="headingSm" fontWeight="semibold">
                      What payment methods do you accept?
                    </Text>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      We accept all major credit cards and PayPal through
                      Shopify's secure billing system.
                    </Text>
                  </BlockStack>

                  <BlockStack gap="300">
                    <Text as="h3" variant="headingSm" fontWeight="semibold">
                      Need help choosing?
                    </Text>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Contact our support team at support@yourapp.com for
                      personalized recommendations.
                    </Text>
                  </BlockStack>
                </div>
              </BlockStack>
            </Card>
          </div>
        </Layout.Section>
      </Layout>

      {/* Cancel Subscription Modal */}
      <Modal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Subscription"
        primaryAction={{
          content: canceling ? "Canceling..." : "Yes, Cancel Subscription",
          destructive: true,
          loading: canceling,
          onAction: handleCancelSubscription,
        }}
        secondaryActions={[
          {
            content: "Keep Subscription",
            onAction: () => setShowCancelModal(false),
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            <InlineStack gap="300" blockAlign="start">
              <div style={{ marginTop: "4px" }}>
                <Icon source={AlertTriangleIcon} tone="critical" />
              </div>
              <BlockStack gap="300">
                <Text as="p" variant="bodyMd">
                  Are you sure you want to cancel your{" "}
                  <Text as="span" fontWeight="semibold">
                    {activePlan?.name}
                  </Text>{" "}
                  subscription?
                </Text>
                <Text as="p" variant="bodyMd" tone="subdued">
                  Your subscription will remain active until{" "}
                  <Text as="span" fontWeight="semibold">
                    {activePlan?.currentPeriodEnd &&
                      new Date(
                        activePlan.currentPeriodEnd
                      ).toLocaleDateString()}
                  </Text>
                  , after which you'll lose access to all premium features.
                </Text>
                <Text as="p" variant="bodyMd" tone="subdued">
                  You can reactivate your subscription at any time by selecting
                  a new plan.
                </Text>
              </BlockStack>
            </InlineStack>
          </BlockStack>
        </Modal.Section>
      </Modal>
    </Page>
  );
};

export default BillingPlans;
