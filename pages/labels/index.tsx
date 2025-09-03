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
    <div style={{ 
      padding: "20px 24px", 
      backgroundColor: "#f6f6f7", 
      minHeight: "100vh"
    }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 60px" }}>
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <BlockStack gap="200">
            <Text as="h1" variant="headingXl" fontWeight="medium">
              Labels
            </Text>
            <Text as="p" tone="subdued">
              Show labels inside the product image on product pages, collection pages or more.{" "}
              <Button variant="plain" >
                About labels
              </Button>
            </Text>
          </BlockStack>
        </div>

        {/* Main Content - Empty State */}

        <DataTable />
      </div>
    </div>
  );
}
