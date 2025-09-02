import {
  Page,
  Card,
  Text,
  Button,
  BlockStack,
  InlineStack,
  EmptyState,
  Modal,
  Badge,
} from "@shopify/polaris";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Banners() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const bannerTypes = [
    {
      id: "countdown",
      title: "Countdown banner",
      image: "/api/placeholder/400/200", // This would be your countdown banner preview image
      route: "/banners/create?type=countdown",
      tag: "Growth",
      tagColor: "purple" as const
    },
    {
      id: "fixed",
      title: "Fixed banner", 
      image: "/api/placeholder/400/200", // This would be your fixed banner preview image
      route: "/banners/create?type=fixed"
    },
    {
      id: "automatic",
      title: "Automatic banner",
      image: "/api/placeholder/400/200", // This would be your automatic banner preview image  
      route: "/banners/create?type=automatic"
    },
    {
      id: "slider",
      title: "Slider banner",
      image: "/api/placeholder/400/200", // This would be your slider banner preview image
      route: "/banners/create?type=slider"
    }
  ];

  const handleBannerTypeSelect = (route: string) => {
    setIsModalOpen(false);
    router.push(route);
  };

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
              Banners
            </Text>
            <Text as="p" tone="subdued">
              Create promotional banners to announce sales, free shipping, or important notifications.{" "}
              <Button variant="plain" >
                About banners
              </Button>
            </Text>
          </BlockStack>
        </div>

        {/* Banner Gallery */}
        <Card padding="500">
          <div style={{ marginBottom: "24px" }}>
            <Text as="h2" variant="headingMd" fontWeight="medium">
              Banner gallery
            </Text>
          </div>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(2, 1fr)", 
            gap: "20px"
          }}>
            {/* Banner Template 1 - Loyalty Program */}
            <Card padding="0">
              <div style={{
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                color: "white",
                padding: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                minHeight: "80px"
              }}>
                <Text as="span" variant="bodyMd" fontWeight="medium">
                  Start Earning Rewards with our Loyalty Program
                </Text>
                <Button size="slim" variant="monochromePlain">
                  Join now
                </Button>
              </div>
                             <div style={{ padding: "12px", textAlign: "center" }}>
                 <Button variant="primary">Select</Button>
                </div>
            </Card>

            {/* Banner Template 2 - Back to School */}
            <Card padding="0">
              <div style={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "white",
                padding: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "80px"
              }}>
                <Text as="span" variant="bodyMd" fontWeight="medium">
                  BACK TO SCHOOL - FREE SHIPPING FOR ORDER $50+ 🎒
                </Text>
              </div>
                             <div style={{ padding: "12px", textAlign: "center" }}>
                 <Button variant="primary">Select</Button>
                </div>
            </Card>

            {/* Banner Template 3 - 20% Off */}
            <Card padding="0">
              <div style={{
                background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                color: "white",
                padding: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                minHeight: "80px"
              }}>
                <div>
                  <Text as="span" variant="bodyMd" fontWeight="medium">
                    20% Off Everything
                  </Text>
                  <div style={{ display: "flex", gap: "8px", marginTop: "8px", fontSize: "14px" }}>
                    <span>01 Days</span>
                    <span>12 Hrs</span>
                    <span>23 Mins</span>
                    <span>12 Secs</span>
                  </div>
                </div>
                <Button size="slim" variant="monochromePlain">
                  Get deals now
                </Button>
              </div>
                             <div style={{ padding: "12px", textAlign: "center" }}>
                 <Button variant="primary">Select</Button>
                </div>
            </Card>

            {/* Banner Template 4 - Collection */}
            <Card padding="0">
              <div style={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                color: "white",
                padding: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                minHeight: "80px"
              }}>
                <Text as="span" variant="bodyMd" fontWeight="medium">
                  Explore Collection For Him!
                </Text>
                <Button size="slim" variant="monochromePlain">
                  Discover now
                </Button>
              </div>
                             <div style={{ padding: "12px", textAlign: "center" }}>
                 <Button variant="primary">Select</Button>
                </div>
            </Card>

            {/* Banner Template 5 - Free Shipping */}
            <Card padding="0">
              <div style={{
                background: "linear-gradient(135deg, #84cc16 0%, #65a30d 100%)",
                color: "white",
                padding: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                minHeight: "80px"
              }}>
                <Text as="span" variant="bodyMd" fontWeight="medium">
                  Free Shipping on Orders Over $50!
                </Text>
                <Button size="slim" variant="monochromePlain">
                  Shop now
                </Button>
              </div>
                             <div style={{ padding: "12px", textAlign: "center" }}>
                 <Button variant="primary">Select</Button>
                </div>
            </Card>

            {/* Banner Template 6 - Create Your Own */}
            <Card padding="0">
              <div style={{
                background: "#f3f4f6",
                color: "#6b7280",
                padding: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "80px",
                border: "2px dashed #d1d5db"
              }}>
                <Text as="span" variant="bodyMd" fontWeight="medium">
                  Create your own design
                </Text>
              </div>
              <div style={{ padding: "12px", textAlign: "center" }}>
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>Select</Button>
              </div>
            </Card>
          </div>
        </Card>
      </div>

      {/* Banner Type Selection Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select a banner type"
        primaryAction={{
          content: "Select",
          disabled: true,
        }}
      >
        <Modal.Section>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(2, 1fr)", 
            gap: "16px",
            padding: "0 8px"
          }}>
            {/* Countdown Banner */}
            <Card padding="0">
              <div 
                onClick={() => handleBannerTypeSelect(bannerTypes[0].route)}
                style={{ cursor: "pointer" }}
              >
                <div style={{
                  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                  color: "white",
                  padding: "20px",
                  textAlign: "center",
                  position: "relative",
                  minHeight: "120px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center"
                }}>
                  <Text as="span" variant="bodyLg" fontWeight="medium">
                    FLASH SALE ENDS IN
                  </Text>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "center", 
                    gap: "8px", 
                    marginTop: "8px",
                    fontSize: "18px",
                    fontWeight: "bold"
                  }}>
                    <span>00 : 03 : 48</span>
                  </div>
                  <div style={{
                    fontSize: "12px",
                    marginTop: "4px",
                    opacity: 0.8
                  }}>
                    Hours    Minutes    Seconds
                  </div>
                </div>
                <div style={{ padding: "12px", textAlign: "center" }}>
                  <BlockStack gap="200">
                    <Text as="h3" variant="bodyMd" fontWeight="medium">
                      Countdown banner
                    </Text>
                    <div>
                      <Badge tone="magic">Growth</Badge>
                    </div>
                  </BlockStack>
                </div>
              </div>
            </Card>

            {/* Fixed Banner */}
            <Card padding="0">
              <div 
                onClick={() => handleBannerTypeSelect(bannerTypes[1].route)}
                style={{ cursor: "pointer" }}
              >
                <div style={{
                  background: "linear-gradient(135deg, #ea580c 0%, #dc2626 100%)",
                  color: "white",
                  padding: "20px",
                  textAlign: "center",
                  minHeight: "120px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <BlockStack gap="200">
                    <Text as="span" variant="bodyLg" fontWeight="medium">
                      NEW COLLECTION
                    </Text>
                    <Button size="slim" variant="monochromePlain">
                      DISCOVER OUT NOW!
                    </Button>
                  </BlockStack>
                </div>
                <div style={{ padding: "12px", textAlign: "center" }}>
                  <Text as="h3" variant="bodyMd" fontWeight="medium">
                    Fixed banner
                  </Text>
                </div>
              </div>
            </Card>

            {/* Automatic Banner */}
            <Card padding="0">
              <div 
                onClick={() => handleBannerTypeSelect(bannerTypes[2].route)}
                style={{ cursor: "pointer" }}
              >
                <div style={{
                  background: "linear-gradient(135deg, #a3a3a3 0%, #737373 100%)",
                  color: "white",
                  padding: "20px",
                  textAlign: "center",
                  minHeight: "120px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                  <Text as="span" variant="bodyMd">
                    FREESHIPPING BUY 2 GET 1 FREE
                  </Text>
                  <div style={{ 
                    display: "flex", 
                    gap: "4px",
                    fontSize: "12px"
                  }}>
                    <span>—</span>
                    <span>••</span>
                  </div>
                </div>
                <div style={{ padding: "12px", textAlign: "center" }}>
                  <Text as="h3" variant="bodyMd" fontWeight="medium">
                    Automatic banner
                  </Text>
                </div>
              </div>
            </Card>

            {/* Slider Banner */}
            <Card padding="0">
              <div 
                onClick={() => handleBannerTypeSelect(bannerTypes[3].route)}
                style={{ cursor: "pointer" }}
              >
                <div style={{
                  background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
                  color: "white",
                  padding: "20px",
                  textAlign: "center",
                  minHeight: "120px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                  <Button size="slim" variant="monochromePlain">
                    ←
                  </Button>
                  <Text as="span" variant="bodyMd" fontWeight="medium">
                    NEW DEALS THIS MONTH
                  </Text>
                  <Button size="slim" variant="monochromePlain">
                    →
                  </Button>
                </div>
                <div style={{ padding: "12px", textAlign: "center" }}>
                  <Text as="h3" variant="bodyMd" fontWeight="medium">
                    Slider banner
                  </Text>
                </div>
              </div>
            </Card>
          </div>
        </Modal.Section>
      </Modal>
    </div>
  );
}
