import { DataTable } from "@/components/tables/DataTable";
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
  Tabs,
} from "@shopify/polaris";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { bannerTemplates, getBannerTemplatesByCategory, getBannerTemplatesByType, bannerCategories, bannerTypes as bannerTypeOptions } from "@/utils/bannerTemplateData";

export default function Banners() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

  // Fetch existing banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('/api/badge?type=BANNER');
        if (response.ok) {
          const result = await response.json();
          setBanners(result.data?.components || []);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

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

  const handleTemplateSelect = (templateId: string) => {
    // Navigate to banner create page with template ID
    router.push({
      pathname: "/banners/create",
      query: { 
        template: templateId
      }
    });
  };

  const tabs = [
    {
      id: "templates",
      content: "Templates",
      accessibilityLabel: "Banner Templates",
      panelID: "templates-panel",
    },
    {
      id: "scratch",
      content: "From Scratch",
      accessibilityLabel: "Create from Scratch",
      panelID: "scratch-panel",
    },
  ];

  const renderBannerTemplates = () => {
    // Get filtered templates based on selected filters
    let filteredTemplates = bannerTemplates;
    
    if (selectedCategory !== "All") {
      filteredTemplates = getBannerTemplatesByCategory(selectedCategory);
    }
    
    if (selectedType !== "All") {
      filteredTemplates = filteredTemplates.filter(template => template.type === selectedType);
    }

    return (
      <>
        <style>{`
          .banner-scroll-container::-webkit-scrollbar {
            width: 6px;
          }
          .banner-scroll-container::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 6px;
          }
          .banner-scroll-container::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 6px;
          }
          .banner-scroll-container::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
          }
        `}</style>
        <div 
          className="banner-scroll-container"
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", 
            gap: "20px",
            width: "100%",
            maxHeight: "600px",
            overflowY: "auto",
            padding: "10px 20px 10px 5px",
            scrollBehavior: "smooth"
          }}>
        {filteredTemplates.map((template) => (
          <Card key={template.id} padding="400">
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              minHeight: "200px"
            }}>
              {/* Template Preview */}
              <div style={{
                width: "100%",
                height: "80px",
                backgroundColor: template.design.style.backgroundColor,
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: template.design.style.textColor,
                fontSize: "12px",
                fontWeight: template.design.style.fontWeight,
                overflow: "hidden",
                position: "relative"
              }}>
                <div style={{ textAlign: "center", padding: "8px" }}>
                  <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                    {template.design.content.title}
                  </div>
                  {template.design.content.message && (
                    <div style={{ fontSize: "10px", opacity: 0.9 }}>
                      {template.design.content.message}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Template Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <Badge tone={
                    template.type === "countdown" ? "critical" :
                    template.type === "fixed" ? "info" :
                    template.type === "automatic" ? "attention" : "success"
                  }>
                    {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                  </Badge>
                </div>
                
                <Text as="h3" variant="bodyMd" fontWeight="semibold">
                  {template.title}
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  {template.description}
                </Text>
              </div>
              
              {/* Select Button */}
              <Button 
                variant="primary"
                onClick={() => handleTemplateSelect(template.id)}
                size="medium"
                fullWidth
              >
                Use Template
              </Button>
            </div>
          </Card>
        ))}
        </div>
      </>
    );
  };

  const renderBannerTypes = () => {
    return (
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "16px",
        padding: "20px"
      }}>
        {bannerTypes.map((type) => (
          <Card key={type.id} padding="400">
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              minHeight: "180px",
              justifyContent: "center"
            }}>
              <div style={{
                width: "100%",
                height: "100px",
                backgroundColor: "#f6f6f7",
                borderRadius: "8px",
                backgroundImage: `url(${type.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}></div>
              
              <div style={{ textAlign: "center", width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "8px" }}>
                  <Text as="h3" variant="bodyMd" fontWeight="semibold">
                    {type.title}
                  </Text>
                  {type.tag && (
                    <Badge tone="info">{type.tag}</Badge>
                  )}
                </div>
                
                <Button 
                  variant="primary"
                  onClick={() => handleBannerTypeSelect(type.route)}
                  size="medium"
                  fullWidth
                >
                  Create
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div style={{ 
      padding: "20px 24px", 
      minHeight: "100vh"
    }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 60px" }}>
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
        <InlineStack align="start">
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
          <div style={{ marginLeft: "auto" }}>
              <Button
                variant="primary"
                onClick={() => setIsModalOpen(true)}
                accessibilityLabel="Create a new banner"
              >
                Create banner
              </Button>
            </div>
          </InlineStack>
        </div>

        {/* Main Content */}

        
        {loading ? (
          <Card>
            <div style={{ textAlign: "center", padding: "40px" }}>
              <Text as="p">Loading...</Text>
            </div>
          </Card>
        ) : banners.length === 0 ? (
          /* Show templates when no banners exist */
           <Card padding="500">
           <div style={{ marginBottom: "24px" }}>
             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
               <div>
                 <Text as="h2" variant="headingMd" fontWeight="medium">
                   Banner gallery
                 </Text>
                 <Text as="p" variant="bodySm" tone="subdued">
                   {(() => {
                     let count = bannerTemplates.length;
                     if (selectedCategory !== "All") {
                       count = getBannerTemplatesByCategory(selectedCategory).length;
                     }
                     if (selectedType !== "All") {
                       const filtered = selectedCategory !== "All" 
                         ? getBannerTemplatesByCategory(selectedCategory)
                         : bannerTemplates;
                       count = filtered.filter(template => template.type === selectedType).length;
                     }
                     return `${count} templates available`;
                   })()}
                 </Text>
               </div>
               <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                 <Text as="span" variant="bodySm" tone="subdued">Filter by:</Text>
                 <select 
                   value={selectedCategory} 
                   onChange={(e) => setSelectedCategory(e.target.value)}
                   style={{
                     padding: "6px 12px",
                     borderRadius: "6px",
                     border: "1px solid #d1d5db",
                     backgroundColor: "white",
                     fontSize: "14px"
                   }}
                 >
                   {bannerCategories.map((category) => (
                     <option key={category} value={category}>{category}</option>
                   ))}
                 </select>
                 <select 
                   value={selectedType} 
                   onChange={(e) => setSelectedType(e.target.value)}
                   style={{
                     padding: "6px 12px",
                     borderRadius: "6px",
                     border: "1px solid #d1d5db",
                     backgroundColor: "white",
                     fontSize: "14px"
                   }}
                 >
                   {bannerTypeOptions.map((type) => (
                     <option key={type} value={type}>
                       {type.charAt(0).toUpperCase() + type.slice(1)}
                     </option>
                   ))}
                 </select>
               </div>
             </div>
           </div>

           {renderBannerTemplates()}

           </Card>
        ) : (
          /* Show DataTable when banners exist */
          <DataTable type="BANNER" />
        )}




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
