import {
  Page,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Button,
  Badge,
} from "@shopify/polaris";
import { useRouter } from "next/router";

export default function ChooseBadgeType() {
  const router = useRouter();
  return (
    <Page title="Choose badge type">
      <InlineStack gap="400" align="start" wrap={false}>
        {/* Product Page */}
        <Card>
          <BlockStack gap="200">
            <div
              style={{
                height: "140px",
                background: "#f6f6f7",
                borderRadius: "8px",
              }}
            />
            <BlockStack gap="100">
              <Text variant="headingMd" as="h3">
                Product page
              </Text>
              <Text variant="bodyMd" as="p">
                Block in product page below add to cart button.
              </Text>
            </BlockStack>
            <Button
              fullWidth
              onClick={() => {
                router.push("/badges/create");
              }}
            >
              Select this badge type
            </Button>
          </BlockStack>
        </Card>

        {/* Cart Page */}
        <Card>
          <BlockStack gap="200">
            <div
              style={{
                height: "140px",
                background: "#f6f6f7",
                borderRadius: "8px",
              }}
            />
            <BlockStack gap="100">
              <InlineStack align="space-between">
                <Text variant="headingMd" as="h3">
                  Cart page
                </Text>
                <Badge tone="info">Essential plan</Badge>
              </InlineStack>
              <Text variant="bodyMd" as="p">
                Add a badge block to cart page or cart drawer.
              </Text>
            </BlockStack>
            <Button
              fullWidth
              onClick={() => {
                router.push("/badges/create");
              }}
            >
              Select this badge type
            </Button>
          </BlockStack>
        </Card>

        {/* Essential Free Shipping Bar */}
        <Card>
          <BlockStack gap="200">
            <div
              style={{
                height: "140px",
                background: "#111",
                color: "#fff",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              Increase AOV with <br /> Free Shipping Bar + Upsell!
            </div>
            <BlockStack gap="100">
              <Text variant="headingMd" as="h3">
                Essential Free Shipping Bar
              </Text>
              <Text variant="bodyMd" as="p">
                Increase average order value by up to 30% with a free shipping
                bar.
              </Text>
            </BlockStack>
            <Button
              fullWidth
              onClick={() => {
                router.push("/badges/create");
              }}
            >
              View app
            </Button>
          </BlockStack>
        </Card>
      </InlineStack>
    </Page>
  );
}
