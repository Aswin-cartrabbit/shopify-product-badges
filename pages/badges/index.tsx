import { DataTable } from "@/components/tables/DataTable";
import {
  Page,
  Card,
  Text,
  Button,
  BlockStack,
  InlineStack,
  EmptyState,
} from "@shopify/polaris";
import { useRouter } from "next/router";

export default function Badges() {
  const router = useRouter();

  return (
    <div
      style={{
        padding: "20px 24px",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 60px" }}>
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <InlineStack align="start">
            <BlockStack gap="200">
              <Text as="h1" variant="headingXl" fontWeight="medium">
                Badges
              </Text>
              <Text as="p" tone="subdued">
                Design eye-catching badges to showcase discounts, new arrivals,
                or special offers on your products.{" "}
                <Button variant="plain">About badges</Button>
              </Text>
            </BlockStack>
            <div style={{ marginLeft: "auto" }}>
              <Button
                variant="primary"
                onClick={() => router.push("/badges/create")}
                accessibilityLabel="Create a new badge"
              >
                Create badge
              </Button>
            </div>
          </InlineStack>
        </div>

        <DataTable type="BADGE" />
      </div>
    </div>
  );
}