import {
  Page,
  Card,
  Text,
  Button,
  BlockStack,
  InlineStack,
} from "@shopify/polaris";
import { useRouter } from "next/router";

export default function TrustBadges() {
  const router = useRouter();

  const trustBadgeTemplates = [
    {
      id: "1",
      title: "Only 3 products left!",
      subtitle: "Select",
      image:"https://pl-app.smartifyapps.com/assets/countdown-f817d454.webp",
      category: "Urgency"
    },
    {
      id: "2", 
      title: "FREE SHIPPING ORDERS ABOVE $30",
      subtitle: "Select",
      image: "https://pl-app.smartifyapps.com/assets/payment-91361088.webp",
      category: "Shipping"
    },
    {
      id: "3",
      title: "School Season!",
      subtitle: "Select", 
      image: "https://pl-app.smartifyapps.com/assets/season-39cc46fe.webp",

      category: "Payment"
    },
    {
      id: "4",
      title: "Why choosing us",
      subtitle: "Select",
      image: "https://pl-app.smartifyapps.com/assets/fill-de06fc96.webp",
      category: "Features"
    },
    {
      id: "5",
      title: "secure payment !",
      subtitle: "Select",
      image: "https://pl-app.smartifyapps.com/assets/black-2d1ed17c.webp",

      category: "Seasonal"
    }
  ];

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
              Trust badges
            </Text>
            <Text as="p" tone="subdued">
              Enhance store's credibility and professionalism with trust badges.{" "}
              <Button variant="plain" textDecorationLine="underline">
                About trust badges
              </Button>
            </Text>
          </BlockStack>
        </div>

        {/* Trust Badge Templates - Outer Container */}
        <Card padding="500">
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(2, 1fr)", 
            gap: "20px"
          }}>
            {trustBadgeTemplates.map((template) => (
              <Card key={template.id} padding="400">
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "16px",
                  padding: "20px"
                }}>
                  <img 
                    src={template.image} 
                    alt={template.title}
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      maxHeight: "200px",
                      objectFit: "contain"
                    }}
                  />
                  <div style={{ textAlign: "center", width: "100%" }}>
                    <InlineStack align="space-between" blockAlign="center">
                      <div style={{ flex: 1 }}>
                        <Text as="p" variant="bodyMd" fontWeight="medium">
                          {template.title}
                        </Text>
                      </div>
                      <Button 
                        variant="plain"
                        onClick={() => {
                          // Handle template selection
                          console.log('Selected template:', template.id);
                        }}
                      >
                        {template.subtitle}
                      </Button>
                    </InlineStack>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
