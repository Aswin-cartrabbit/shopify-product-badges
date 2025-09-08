import {
  BlockStack,
  Button,
  Card,
  Text,
  InlineStack,
  Select,
} from "@shopify/polaris";
import { useState } from "react";

interface BannerPreviewProps {
  bannerData?: any;
  bannerType?: string;
}

const BannerPreview = ({ bannerData, bannerType }: BannerPreviewProps) => {
  const [viewMode, setViewMode] = useState("desktop");

  const getBannerContent = () => {
    const content = bannerData?.content || {};
    const design = bannerData?.design || {};

    // Handle different banner types
    if (bannerType === "countdown") {
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <Text as="span" variant="bodyLg" fontWeight="medium">
            FLASH SALE ENDS IN
          </Text>
          <div style={{ 
            display: "flex", 
            gap: "8px", 
            fontSize: "18px",
            fontWeight: "bold"
          }}>
            <span>00 : 03 : 48</span>
          </div>
          <div style={{
            fontSize: "12px",
            opacity: 0.8
          }}>
            Hours    Minutes    Seconds
          </div>
        </div>
      );
    }

    if (bannerType === "slider") {
      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <Button size="slim" variant="plain">
            ←
          </Button>
          <Text as="span" variant="bodyMd" fontWeight="medium">
            {content.text || "NEW DEALS THIS MONTH"}
          </Text>
          <Button size="slim" variant="plain">
            →
          </Button>
        </div>
      );
    }

    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: content.showCloseButton ? "space-between" : "center", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Text as="span" variant="bodyMd" fontWeight="medium">
            {content.text || "Deco banner"}
          </Text>
          {content.useButton && (
            <div
              style={{
                backgroundColor: design.buttonBackgroundColor || "#000000",
                color: design.buttonTextColor || "#ffffff",
                border: `${design.buttonBorderSize || 0}px solid ${design.buttonBorderColor || "#000000"}`,
                borderRadius: `${design.buttonCornerRadius || 8}px`,
                fontSize: `${design.buttonTextSize || 16}px`,
                padding: "8px 16px",
                cursor: "pointer",
                display: "inline-block",
              }}
            >
              {content.buttonText || "Shop now!"}
            </div>
          )}
        </div>
        {content.showCloseButton && (
          <div
            style={{
              color: design.closeIconColor || "#ffffff",
              cursor: "pointer",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            ×
          </div>
        )}
      </div>
    );
  };

  const bannerStyle = {
    backgroundColor: bannerData?.design?.backgroundColor || "#A7A7A7",
    color: bannerData?.design?.textColor || "#000000",
    opacity: bannerData?.design?.opacity || 1,
    fontSize: `${bannerData?.design?.textSize || 16}px`,
    height: `${bannerData?.design?.bannerSize || 60}px`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 20px",
    position: bannerData?.design?.sticky ? "sticky" as const : "static" as const,
    top: bannerData?.design?.sticky ? 0 : "auto",
    width: "100%",
    zIndex: bannerData?.design?.sticky ? 1000 : "auto"
  };

  return (
    <BlockStack gap="400">
      {/* View Mode Selector */}
      <InlineStack gap="200" align="space-between">
        <Text variant="headingMd" as="h3">
          Preview
        </Text>
        <Select
          label=""
          options={[
            { label: "Desktop view", value: "desktop" },
            { label: "Mobile view", value: "mobile" },
          ]}
          value={viewMode}
          onChange={setViewMode}
        />
      </InlineStack>

      {/* Preview Container */}
      <div
        style={{
          border: "1px solid #e1e3e5",
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor: "#ffffff",
          minHeight: "400px",
          position: "relative"
        }}
      >
        {/* Banner Preview */}
        <div style={bannerStyle}>
          {getBannerContent()}
        </div>

        {/* Mock Website Content */}
        <div style={{ padding: "20px" }}>
          {/* Mock Navigation */}
          <div style={{
            display: "flex",
            gap: "20px",
            paddingBottom: "20px",
            borderBottom: "1px solid #e1e3e5",
            marginBottom: "20px"
          }}>
            <Text variant="bodyMd" as="span" fontWeight="medium">Home</Text>
            <Text variant="bodyMd" as="span" fontWeight="medium">Catalog</Text>
            <Text variant="bodyMd" as="span" fontWeight="medium">Contact</Text>
          </div>

          {/* Mock Product Content */}
          <div style={{
            display: "grid",
            gridTemplateColumns: viewMode === "desktop" ? "1fr 1fr" : "1fr",
            gap: "20px",
            alignItems: "start"
          }}>
            {/* Product Image */}
            <div style={{
              backgroundColor: "#f6f6f7",
              aspectRatio: "1",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Text variant="bodyMd" as="span" tone="subdued">Product Image</Text>
            </div>

            {/* Product Info */}
            <div>
              <BlockStack gap="300">
                <Text variant="headingLg" as="h1">
                  Product name
                </Text>
                <Text variant="bodyLg" as="p">
                  $10 USD (Product price)
                </Text>
                <Button variant="primary" size="large">
                  ADD TO CART
                </Button>
              </BlockStack>
            </div>
          </div>
        </div>
      </div>

      {/* Position Indicator */}
      {bannerData?.design?.position && (
        <Card>
          <BlockStack gap="200">
            <Text variant="bodyMd" as="p" fontWeight="medium">
              Banner Position: {bannerData.design.position.charAt(0).toUpperCase() + bannerData.design.position.slice(1)}
            </Text>
            {bannerData.design.sticky && (
              <Text variant="bodySm" as="p" tone="subdued">
                Sticky: Banner will remain visible while scrolling
              </Text>
            )}
          </BlockStack>
        </Card>
      )}
    </BlockStack>
  );
};

export default BannerPreview;
