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

        {/* Label Templates Gallery */}
        <Card padding="500">
          <div style={{ marginBottom: "24px" }}>
            <Text as="h2" variant="headingMd" fontWeight="medium">
              Label templates
            </Text>
          </div>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(2, 1fr)", 
            gap: "20px"
          }}>
            {/* Label Template 1 */}
            <Card padding="400">
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
                padding: "20px"
              }}>
                <img 
                  src="https://y9vv34fayuioeiup-89428984115.shopifypreview.com/cdn/shop/files/1_1_c26769d6-0a30-428d-b794-4b41dbf3699e.webp?v=1753243238"
                  alt="Label Template 1"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    maxHeight: "200px",
                    objectFit: "contain"
                  }}
                />
                <div style={{ textAlign: "center", width: "100%" }}>
                  <Button 
                    variant="plain"
                    onClick={() => {
                      console.log('Selected label template 1');
                    }}
                  >
                    Select
                  </Button>
                </div>
              </div>
            </Card>

            {/* Label Template 2 */}
            <Card padding="400">
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
                padding: "20px"
              }}>
                <img 
                  src="https://y9vv34fayuioeiup-89428984115.shopifypreview.com/cdn/shop/files/2_5.webp?v=1753243238"
                  alt="Label Template 2"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    maxHeight: "200px",
                    objectFit: "contain"
                  }}
                />
                <div style={{ textAlign: "center", width: "100%" }}>
                  <Button 
                    variant="plain"
                    onClick={() => {
                      console.log('Selected label template 2');
                    }}
                  >
                    Select
                  </Button>
                </div>
              </div>
            </Card>

            {/* Label Template 3 */}
            <Card padding="400">
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
                padding: "20px"
              }}>
                <img 
                  src="https://y9vv34fayuioeiup-89428984115.shopifypreview.com/cdn/shop/files/4_1.webp?v=1753243238"
                  alt="Label Template 3"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    maxHeight: "200px",
                    objectFit: "contain"
                  }}
                />
                <div style={{ textAlign: "center", width: "100%" }}>
                  <Button 
                    variant="plain"
                    onClick={() => {
                      console.log('Selected label template 3');
                    }}
                  >
                    Select
                  </Button>
                </div>
              </div>
            </Card>

            {/* Label Template 4 */}
            <Card padding="400">
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
                padding: "20px"
              }}>
                <img 
                  src="https://y9vv34fayuioeiup-89428984115.shopifypreview.com/cdn/shop/files/5_1.webp?v=1753243238"
                  alt="Label Template 4"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    maxHeight: "200px",
                    objectFit: "contain"
                  }}
                />
                <div style={{ textAlign: "center", width: "100%" }}>
                  <Button 
                    variant="plain"
                    onClick={() => {
                      console.log('Selected label template 4');
                    }}
                  >
                    Select
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </Card>
      </div>
    </div>
  );
}
