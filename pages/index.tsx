import ReviewBanner from "@/components/banners/ReviewBanner";
import {
  Page,
  Card,
  EmptyState,
  Text,
  Button,
  BlockStack,
  InlineStack,
  ResourceList,
  ResourceItem,
  Icon,
  Badge,
  ProgressBar,
  Grid,
  LegacyCard,
} from "@shopify/polaris";
import { AppsIcon } from "@shopify/polaris-icons";
import { useRouter } from "next/router";
import { useBadges } from "@/components/hooks/useBadges";
import { useSubscription } from "@/components/hooks/useSubscription";
import { useState, useEffect } from "react";
import { badgeApi } from "@/utils/api/badges";

export default function Dashboard() {
  const router = useRouter();
  const { badges, loading: badgesLoading } = useBadges({ limit: 5 });
  const { subscription, usage, loading: subscriptionLoading } = useSubscription();
  
  const [analytics, setAnalytics] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  // Fetch overall analytics
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const response = await badgeApi.getAnalytics({
          startDate: thirtyDaysAgo.toISOString(),
          endDate: new Date().toISOString(),
        });
        setAnalytics(response);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setAnalyticsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const recommendedApps = [
    {
      id: "1",
      name: "Retainful Email Marketing, SMS",
      description:
        "Retainful combines email marketing, SMS and WhatsApp automation in one platform for Shopify stores",
      link: "Try Retainful Free",
    },
    {
      id: "2",
      name: "Retainful Email Marketing, SMS", 
      description:
        "Retainful combines email marketing, SMS and WhatsApp automation in one platform for Shopify stores",
      link: "Try Retainful Free",
    },
    {
      id: "3",
      name: "Retainful Email Marketing, SMS",
      description:
        "Retainful combines email marketing, SMS and WhatsApp automation in one platform for Shopify stores", 
      link: "Try Retainful Free",
    },
  ];
  if (subscriptionLoading || badgesLoading) {
    return (
      <Page title="Dashboard">
        <Card>
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Text as="p">Loading dashboard...</Text>
          </div>
        </Card>
      </Page>
    );
  }

  return (
    <Page title={`Welcome to Hackathon Badges${subscription ? ` - ${subscription.planName.charAt(0).toUpperCase() + subscription.planName.slice(1)} Plan` : ""}`}>
      <BlockStack gap="400">
        {/* Plan Status Card */}
        {subscription && usage && (
          <Card>
            <InlineStack align="space-between" blockAlign="center">
              <BlockStack gap="100">
                <Text variant="headingMd" as="h3">
                  Your Plan: {subscription.planName.charAt(0).toUpperCase() + subscription.planName.slice(1)}
                </Text>
                <Text as="p">
                  {usage.badges.current} of {usage.badges.limit === -1 ? "unlimited" : usage.badges.limit} badges used
                </Text>
                {usage.badges.limit !== -1 && (
                  <ProgressBar 
                    progress={usage.badges.percentage} 
                    tone={usage.badges.percentage > 80 ? "critical" : "primary"}
                  />
                )}
              </BlockStack>
              {subscription.planName === "free" && (
                <Button variant="primary">Upgrade Plan</Button>
              )}
            </InlineStack>
          </Card>
        )}

        {/* App Status */}
        <Card>
          <InlineStack align="space-between" blockAlign="center">
            <InlineStack gap="100" blockAlign="center">
              <Icon source={AppsIcon} />
              <Text as="span" fontWeight="semibold">
                App embed status{" "}
                <Badge tone="success">ACTIVE</Badge>
              </Text>
            </InlineStack>
            <Button variant="secondary">Manage</Button>
          </InlineStack>
        </Card>

        {/* Analytics Overview */}
        <Grid>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <LegacyCard title="Total Views" sectioned>
              <Text variant="heading2xl" as="p">
                {analyticsLoading ? "..." : analytics?.totals?.views || 0}
              </Text>
            </LegacyCard>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <LegacyCard title="Total Clicks" sectioned>
              <Text variant="heading2xl" as="p">
                {analyticsLoading ? "..." : analytics?.totals?.clicks || 0}
              </Text>
            </LegacyCard>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <LegacyCard title="Click Rate" sectioned>
              <Text variant="heading2xl" as="p">
                {analyticsLoading ? "..." : `${analytics?.totals?.ctr || 0}%`}
              </Text>
            </LegacyCard>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <LegacyCard title="Active Badges" sectioned>
              <Text variant="heading2xl" as="p">
                {badges.filter(b => b.status === "ACTIVE").length}
              </Text>
            </LegacyCard>
          </Grid.Cell>
        </Grid>

        <ReviewBanner />

        {/* Recent Badges or Empty State */}
        <Card>
          {badges.length === 0 ? (
            <EmptyState
              heading="Create your first badge"
              action={{
                content: "Create badge",
                onAction: () => router.push("/badges/new"),
              }}
              image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
            >
              <p>
                Start by creating a badge to showcase on your product pages and increase conversions.
              </p>
            </EmptyState>
          ) : (
            <BlockStack gap="400">
              <InlineStack align="space-between">
                <Text variant="headingMd" as="h3">
                  Recent Badges
                </Text>
                <Button
                  variant="plain"
                  onClick={() => router.push("/badges")}
                >
                  View all badges
                </Button>
              </InlineStack>
              
              <BlockStack gap="200">
                {badges.slice(0, 3).map((badge) => (
                  <InlineStack key={badge.id} align="space-between" blockAlign="center">
                    <BlockStack gap="100">
                      <InlineStack gap="200" align="start">
                        <Text variant="bodyMd" fontWeight="semibold" as="span">
                          {badge.name}
                        </Text>
                        <Badge tone={badge.status === "ACTIVE" ? "success" : "attention"}>
                          {badge.status}
                        </Badge>
                      </InlineStack>
                      {badge.title && (
                        <Text variant="bodySm" tone="subdued" as="p">
                          {badge.title}
                        </Text>
                      )}
                      <InlineStack gap="400">
                        <Text variant="bodySm" as="span">
                          Views: {badge.totalAnalytics?.views || 0}
                        </Text>
                        <Text variant="bodySm" as="span">
                          Clicks: {badge.totalAnalytics?.clicks || 0}
                        </Text>
                        <Text variant="bodySm" as="span">
                          CTR: {badge.totalAnalytics?.ctr || 0}%
                        </Text>
                      </InlineStack>
                    </BlockStack>
                    <Button
                      size="slim"
                      onClick={() => router.push(`/badges/create?id=${badge.id}`)}
                    >
                      Edit
                    </Button>
                  </InlineStack>
                ))}
              </BlockStack>
              
              <Button
                fullWidth
                variant="primary"
                onClick={() => router.push("/badges/new")}
                disabled={usage ? usage.badges.current >= usage.badges.limit : false}
              >
                Create New Badge
              </Button>
            </BlockStack>
          )}
        </Card>

        {/* Recommended Apps */}
        <Card>
          <BlockStack gap="400">
            <Text variant="headingMd" as="h3">
              Recommended Apps
            </Text>
            <InlineStack gap="400" align="start" wrap>
              {recommendedApps.map((item) => {
                const { id, name, description, link } = item;
                return (
                  <div key={id} style={{ flex: "1", minWidth: "300px" }}>
                    <Card>
                      <BlockStack gap="200">
                        <InlineStack align="start" gap="200" wrap={false}>
                          <img
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAALVBMVEVHcEz4XBv4XBv4XBv4XBv4Wxr4XBr////4UgL6mXz/7ej7sJr5d0n6hWD9yrx1fS3IAAAABnRSTlMA6qjLPQR0YhwDAAAApElEQVQ4jdWT3RLFEAyEQzWJn3r/x60yQzWcXJ+9MWY/YWIDUOSsQSFjHTSdh3SbjrP6i9O9ykNsz9ca5f5fPqIDOzbMErDQX8Apehacge57IgqMjD6mFzKAUAC6KkeZF8BjkE91ocg7IDcgaABtgahVwAb4LcApTG+UQGnYxcs+jNJTx1cA/jHQvvvr4xyYLEO3iNwko4dWjb06OProqcOrjP8NtG8YZ7x6OSQAAAAASUVORK5CYII="
                            alt={name}
                            style={{ width: "32px", height: "32px" }}
                          />
                          <Text fontWeight="semibold" as="p">
                            {name}
                          </Text>
                        </InlineStack>
                        <Text tone="subdued" as="p">
                          {description}
                        </Text>
                        <Button variant="plain">{link}</Button>
                      </BlockStack>
                    </Card>
                  </div>
                );
              })}
            </InlineStack>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
