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
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    padding: "24px",
    background: "#ffffff",
    borderRadius: "12px",
    minHeight: "200px",
    justifyContent: "center",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
  };

  const iconsContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    justifyContent: "center",
    maxWidth: "100%"
  };

  const iconStyle: React.CSSProperties = {
    width: "130px",
    height: "80px",
    objectFit: "contain",
    borderRadius: "6px",
    padding: "8px",
  
    transition: "all 0.2s ease"
  };

  return (
    <BlockStack gap="400">
      <Text as="h2" variant="headingMd">Preview</Text>
      
      <div style={containerStyle}>
        {showTitle && title && (
          <Text as="h3" variant="headingMd" alignment="center" fontWeight="semibold">
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
