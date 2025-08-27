import {
  Page,
  Card,
  Text,
  Button,
  BlockStack,
  InlineStack,
  Tabs,
  Badge,
} from "@shopify/polaris";
import { useState } from "react";
import { useRouter } from "next/router";

export default function BadgePresets() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
  const router = useRouter();

  // Text badge templates - similar to labels but as badges
  const textBadges = [
    {
      id: "sale-badge",
      text: "SALE",
      style: {
        width: "80px",
        height: "80px",
        background: "#E91E63",
        color: "white",
        fontWeight: "bold",
        fontFamily: "'Alata', sans-serif",
        fontSize: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        border: "3px solid white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
      }
    },
    {
      id: "new-badge",
      text: "NEW",
      style: {
        width: "70px",
        height: "70px",
        background: "#4CAF50",
        color: "white",
        fontWeight: "bold",
        fontFamily: "'Alata', sans-serif",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        border: "2px solid #2E7D32"
      }
    },
    {
      id: "hot-badge",
      text: "HOT",
      style: {
        width: "60px",
        height: "30px",
        background: "#FF5722",
        color: "white",
        fontWeight: "bold",
        fontFamily: "'Alata', sans-serif",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "15px",
        transform: "rotate(-15deg)"
      }
    },
    {
      id: "discount-badge",
      text: "-30%",
      style: {
        width: "70px",
        height: "70px",
        background: "#F44336",
        color: "white",
        fontWeight: "bold",
        fontFamily: "'Alata', sans-serif",
        fontSize: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        border: "3px solid #FFEB3B"
      }
    },
    {
      id: "bestseller-badge",
      text: "BEST",
      style: {
        width: "80px",
        height: "25px",
        background: "#9C27B0",
        color: "white",
        fontWeight: "bold",
        fontFamily: "'Alata', sans-serif",
        fontSize: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)"
      }
    },
    {
      id: "featured-badge",
      text: "★ FEATURED",
      style: {
        width: "100px",
        height: "30px",
        background: "#FF9800",
        color: "white",
        fontWeight: "bold",
        fontFamily: "'Alata', sans-serif",
        fontSize: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "15px"
      }
    },
    {
      id: "premium-badge",
      text: "PREMIUM",
      style: {
        width: "90px",
        height: "30px",
        background: "linear-gradient(45deg, #FFD700, #FFA500)",
        color: "black",
        fontWeight: "bold",
        fontFamily: "'Alata', sans-serif",
        fontSize: "11px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "15px",
        border: "2px solid #B8860B"
      }
    },
    {
      id: "limited-badge",
      text: "LIMITED",
      style: {
        width: "80px",
        height: "20px",
        background: "#673AB7",
        color: "white",
        fontWeight: "bold",
        fontFamily: "'Alata', sans-serif",
        fontSize: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "10px",
        transform: "rotate(45deg)"
      }
    }
  ];

  // Image badges - could use same images as labels or different badge-specific ones
  const imageBadges = [
    {
      id: "shipping-badge-1",
      src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/674ec6d8ee7fe.png",
      alt: "Free shipping badge",
      type: "shipping"
    },
    {
      id: "shipping-badge-2", 
      src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/67469f6b53270.png",
      alt: "Free shipping car badge",
      type: "shipping"
    },
    {
      id: "delivery-badge-1",
      src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/6746a377c8246.png",
      alt: "Express delivery badge",
      type: "express_delivery"
    },
    {
      id: "delivery-badge-2",
      src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/6746a3a804c12.png",
      alt: "Express delivery return badge",
      type: "express_delivery"
    },
    {
      id: "free-delivery-badge",
      src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/6728a3f13ba1a.png",
      alt: "Free delivery red badge",
      type: "free_delivery"
    },
    {
      id: "guarantee-badge",
      src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/6728a2a96fb99.png",
      alt: "100% guarantee badge",
      type: "guarantee"
    }
  ];

  const tabs = [
    {
      id: "text-badge",
      content: "Text Badge",
      accessibilityLabel: "Text Badge", 
      panelID: "text-badge-panel",
    },
    {
      id: "image-badge",
      content: "Image Badge",
      accessibilityLabel: "Image Badge",
      panelID: "image-badge-panel",
    },
  ];

  const handleBadgeSelect = (badgeId: string) => {
    setSelectedBadge(badgeId);
  };

  const renderTextBadges = () => (
    <div style={{ 
      display: "grid", 
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
      gap: "16px",
      padding: "16px 0"
    }}>
      {textBadges.map((badge) => (
        <Card key={badge.id} padding="300">
          <BlockStack gap="300" align="center">
            <div style={{
              width: "120px",
              height: "100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "8px auto"
            }}>
              <div style={badge.style}>
                {badge.text}
              </div>
            </div>
            <Button 
              variant={selectedBadge === badge.id ? "primary" : "secondary"}
              onClick={() => handleBadgeSelect(badge.id)}
              size="medium"
              fullWidth
            >
              {selectedBadge === badge.id ? "Selected" : "Select"}
            </Button>
          </BlockStack>
        </Card>
      ))}
    </div>
  );

  const renderImageBadges = () => (
    <div style={{ 
      display: "grid", 
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
      gap: "16px",
      padding: "16px 0"
    }}>
      {imageBadges.map((badge) => (
        <Card key={badge.id} padding="300">
          <BlockStack gap="300" align="center">
            <div style={{
              width: "120px",
              height: "80px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              borderRadius: "8px",
              backgroundColor: "#f6f6f7"
            }}>
              <img 
                src={badge.src} 
                alt={badge.alt}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain"
                }}
              />
            </div>
            <Button 
              variant={selectedBadge === badge.id ? "primary" : "secondary"}
              onClick={() => handleBadgeSelect(badge.id)}
              size="medium"
              fullWidth
            >
              {selectedBadge === badge.id ? "Selected" : "Select"}
            </Button>
          </BlockStack>
        </Card>
      ))}
    </div>
  );

  return (
    <div style={{ 
      padding: "20px 24px", 
      backgroundColor: "#f6f6f7", 
      minHeight: "100vh"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <BlockStack gap="200">
            <InlineStack align="space-between" blockAlign="center">
              <Text as="h1" variant="headingXl" fontWeight="medium">
                Badge Preset
              </Text>
              <InlineStack gap="200" align="end">
                <Text as="span" tone="subdued">
                  1/2 used
                </Text>
              </InlineStack>
            </InlineStack>
            <Text as="p" tone="subdued">
              Select a popular template and begin customizing.
            </Text>
          </BlockStack>
        </div>

        {/* Tabs */}
        <Card>
          <Tabs 
            tabs={tabs} 
            selected={selectedTab} 
            onSelect={setSelectedTab}
          >
            <div style={{ padding: "20px" }}>
              {selectedTab === 0 ? (
                <div>
                  <InlineStack gap="200" align="center" blockAlign="center" wrap={false}>
                    <Badge tone="success">Most popular</Badge>
                  </InlineStack>
                  {renderTextBadges()}
                </div>
              ) : (
                <div>
                  {renderImageBadges()}
                </div>
              )}
            </div>
          </Tabs>
        </Card>

        {/* Footer actions */}
        {selectedBadge && (
          <div style={{ 
            position: "fixed", 
            bottom: "20px", 
            right: "20px",
            zIndex: 1000
          }}>
            <InlineStack gap="200">
              <Button onClick={() => setSelectedBadge(null)}>
                Cancel
              </Button>
              <Button 
                variant="primary"
                onClick={() => {
                  // Navigate to customization page with selected template
                  console.log("Selected badge:", selectedBadge);
                  router.push("/badges/create");
                }}
              >
                Customize Badge
              </Button>
            </InlineStack>
          </div>
        )}
      </div>
    </div>
  );
}
