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
import {Modal, TitleBar, useAppBridge} from '@shopify/app-bridge-react';
import { DataTable } from "@/components/tables/DataTable";

export default function Labels() {
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
                Labels
              </Text>
              <Text as="p" tone="subdued">
                Show labels inside the product image on product pages,
                collection pages or more.{" "}
                <Button variant="plain">About labels</Button>
              </Text>
            </BlockStack>
            <div style={{ marginLeft: "auto" }}>
              <Button
                variant="primary"
                onClick={() => router.push("/labels/create")}
                accessibilityLabel="Create a new label"
              >
                Create label
              </Button>
            </div>
          </InlineStack>
        </div>

        {/* Main Content - Empty State */}

        <DataTable type="LABEL" />
      </div>
    </div>
  );
}
