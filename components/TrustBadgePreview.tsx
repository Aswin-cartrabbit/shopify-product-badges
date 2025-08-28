"use client";
import { BlockStack, Text } from "@shopify/polaris";

interface TrustBadgePreviewProps {
  data: {
    icons?: any[];
    layout?: "horizontal" | "vertical";
    iconSize?: number;
    spacing?: number;
    showTitle?: boolean;
    title?: string;
  };
}

const TrustBadgePreview = ({ data }: TrustBadgePreviewProps) => {
  const {
    icons = [],
    layout = "horizontal",
    iconSize = 40,
    spacing = 8,
    showTitle = true,
    title = "Secure payment with"
  } = data;

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: layout === "horizontal" ? "column" : "column",
    alignItems: "center",
    gap: showTitle ? "12px" : "0",
    padding: "20px",
    background: "#f9f9f9",
    borderRadius: "8px",
    minHeight: "200px",
    justifyContent: "center"
  };

  const iconsContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: layout === "horizontal" ? "row" : "column",
    alignItems: "center",
    gap: `${spacing}px`,
    flexWrap: layout === "horizontal" ? "wrap" : "nowrap",
    justifyContent: "center"
  };

  const iconStyle: React.CSSProperties = {
    width: `${iconSize}px`,
    height: "auto",
    objectFit: "contain",
    maxHeight: `${iconSize}px`
  };

  return (
    <BlockStack gap="400">
      <Text as="h2" variant="headingMd">Preview</Text>
      
      <div style={containerStyle}>
        {showTitle && title && (
          <Text as="p" variant="bodyMd" alignment="center">
            {title}
          </Text>
        )}
        
        {icons.length > 0 ? (
          <div style={iconsContainerStyle}>
            {icons.map((icon: any) => (
              <img
                key={icon.id}
                src={icon.src}
                alt={icon.name}
                style={iconStyle}
                title={icon.name}
              />
            ))}
          </div>
        ) : (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60px",
            border: "2px dashed #ccc",
            borderRadius: "4px",
            padding: "20px",
            textAlign: "center"
          }}>
            <Text as="p" tone="subdued">
              Add icons to see the preview
            </Text>
          </div>
        )}
      </div>

      {/* Preview Information */}
     
    </BlockStack>
  );
};

export default TrustBadgePreview;
