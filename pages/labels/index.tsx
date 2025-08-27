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
              <Button variant="plain" textDecorationLine="underline">
                About labels
              </Button>
            </Text>
          </BlockStack>
        </div>

        {/* Main Content - Empty State */}
        <Card>
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center",
            minHeight: "450px",
            padding: "40px 20px"
          }}>
            <div style={{ maxWidth: "500px", textAlign: "center" }}>
              <EmptyState
                heading="There is no label here"
                action={{
                  content: "Create label",
                  onAction: () => router.push("/labels/create"),
                }}
                secondaryAction={{
                  content: "Learn more",
                  onAction: () => {
                    // Add learn more functionality
                  },
                }}
                image="https://u6rrdvqerrb6efrx-74627055920.shopifypreview.com/cdn/shop/files/1_ef0e920c-660d-4694-8b5c-454f22a6e1d2_720x.png?v=1754898246"
              >
                <p>Start creating labels or watch guidelines.</p>
              </EmptyState>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
