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
} from "@shopify/polaris";
import { AppsIcon } from "@shopify/polaris-icons";
import { useRouter } from "next/router";

export default function Dashboard() {
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
  const router = useRouter();
  return (
    <Page title="Get started with Hackathon Badges - Free forever">
      <BlockStack gap="400">
        <Card>
          <InlineStack align="space-between" blockAlign="center">
            <Text as="span" fontWeight="semibold">
              Hackathon Badges - Free forever · Drive website traffic and sales!
              Improve site speed and Google rankings, discount 30%
            </Text>
            <Button>Free Trial</Button>
          </InlineStack>
        </Card>
        <Card>
          <InlineStack align="space-between" blockAlign="center">
            <InlineStack gap="100" blockAlign="center">
              <Icon source={AppsIcon} />
              <Text as="span" fontWeight="semibold">
                Show app embed in online store{" "}
                <Badge tone="success">ACTIVE</Badge>
              </Text>
            </InlineStack>
            <Button disabled>OFF</Button>
          </InlineStack>
        </Card>
        <ReviewBanner />
        <Card>
          <Text as="span" variant="headingMd">
            Views
          </Text>
          <Text as="p" tone="subdued">
            0
          </Text>
        </Card>

        <Card>
          <EmptyState
            heading="Add your first badges"
            action={{
              content: "Create new badge",
              onAction: () => {
                router.push("/badges/new");
              },
            }}
            image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
          >
            <p>
              Begin by designing your first badge and publishing it to your
              store.
            </p>
          </EmptyState>
        </Card>
        <Card>
          <InlineStack gap="100" blockAlign="center" align="space-evenly">
            {recommendedApps.map((item) => {
              const { id, name, description, link } = item;
              return (
                <div
                  style={{
                    width: "30%",
                  }}
                >
                  <Card>
                    <BlockStack gap="200">
                      <InlineStack align="start" gap="200" wrap={false}>
                        <img
                          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAALVBMVEVHcEz4XBv4XBv4XBv4XBv4Wxr4XBr////4UgL6mXz/7ej7sJr5d0n6hWD9yrx1fS3IAAAABnRSTlMA6qjLPQR0YhwDAAAApElEQVQ4jdWT3RLFEAyEQzWJn3r/x60yQzWcXJ+9MWY/YWIDUOSsQSFjHTSdh3SbjrP6i9O9ykNsz9ca5f5fPqIDOzbMErDQX8Apehacge57IgqMjD6mFzKAUAC6KkeZF8BjkE91ocg7IDcgaABtgahVwAb4LcApTG+UQGnYxcs+jNJTx1cA/jHQvvvr4xyYLEO3iNwko4dWjb06OProqcOrjP8NtG8YZ7x6OSQAAAAASUVORK5CYII="
                          alt=""
                        />
                        <Text fontWeight="semibold" as="p" alignment="start">
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
        </Card>
      </BlockStack>
    </Page>
  );
}
