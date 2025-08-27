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
              Badges
            </Text>
            <Text as="p" tone="subdued">
              Design eye-catching badges to showcase discounts, new arrivals, or special offers on your products.{" "}
              <Button variant="plain" textDecorationLine="underline">
                About badges
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
                heading="There is no badge here"
                action={{
                  content: "Create badge",
                  onAction: () => router.push("/badges/create"),
                }}
                secondaryAction={{
                  content: "Learn more",
                  onAction: () => {
                    // Add learn more functionality
                  },
                }}
                image="https://u6rrdvqerrb6efrx-74627055920.shopifypreview.com/cdn/shop/files/1_a80ab60f-ca0e-4cbe-8223-6d3ac5a87cc1_720x.png?v=1754897563"
              >
                <p>Start creating badges or watch guidelines.</p>
              </EmptyState>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}