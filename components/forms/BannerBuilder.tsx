import {
  Badge,
  BlockStack,
  Button,
  Card,
  Icon,
  Page,
  Text,
  TextField,
  InlineStack,
  Select,
  ButtonGroup,
} from "@shopify/polaris";
import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/router";
import BannerContentForm from "./BannerContentForm";
import BannerDesignForm from "./BannerDesignForm";
import BannerPreview from "../BannerPreview";
import { Modal, TitleBar } from '@shopify/app-bridge-react';
import { EditIcon, ContentIcon } from "@shopify/polaris-icons";

interface BannerBuilderProps {
  bannerType?: "countdown" | "fixed" | "automatic" | "slider";
  onSave?: (data: any) => void;
  onCancel?: () => void;
}

export const BannerBuilder = ({ 
  bannerType = "fixed",
  onSave,
  onCancel 
}: BannerBuilderProps) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  
  const getBannerStatus = (status: "Active" | "Inactive") => {
    switch (status) {
      case "Active":
        return <Badge tone="success">Active</Badge>;
      case "Inactive":
        return <Badge tone="attention">Draft</Badge>;
    }
  };

  const [bannerName, setBannerName] = useState(`Deco banner`);
  const [bannerStatus, setBannerStatus] = useState<"Active" | "Inactive">("Active");
  const [selectedTab, setSelectedTab] = useState<number>(0);
  
  const [formData, setFormData] = useState<any>({
    name: bannerName,
    type: bannerType,
    content: {
      text: "Deco banner",
      link: "",
      openInNewTab: true,
      useButton: false,
      buttonText: "Shop now!",
      showCloseButton: false,
    },
    display: {
      homePages: true,
      collectionPages: false,
      productPages: false,
      specificPages: false,
    },
    schedule: {
      startDate: false,
      endDate: false,
    },
    design: {
      position: "top",
      sticky: false,
      backgroundColor: "#A7A7A7",
      textColor: "#000000",
      closeIconColor: "#ffffff",
      opacity: 1,
      textSize: 16,
      bannerSize: 60,
      buttonBackgroundColor: "#000000",
      buttonTextColor: "#ffffff",
      buttonBorderColor: "#000000",
      buttonTextSize: 16,
      buttonBorderSize: 0,
      buttonCornerRadius: 8,
    }
  });


  const handleTabChange = useCallback(
    (selectedTabIndex: number) => {
      setSelectedTab(selectedTabIndex);
    },
    []
  );

  const handleSave = async () => {
    try {
      // Transform banner data to match the existing badge API structure
      const payload = {
        name: formData.name || bannerName,
        description: `${bannerType.charAt(0).toUpperCase() + bannerType.slice(1)} banner`,
        type: "BANNER", // Use BANNER type for the existing API
        design: {
          // Map banner design data to the expected format
          ...formData.design,
          bannerType: bannerType, // Store banner type in design
          content: formData.content, // Store content in design
          schedule: formData.schedule // Store schedule in design
        },
        display: formData.display, // This maps to 'rules' in the API
        settings: {
          bannerType: bannerType,
          version: "1.0"
        },
        status: "DRAFT"
      };

      console.log("Saving banner payload:", payload);

      if (onSave) {
        onSave(payload);
      } else {
        // Use existing badge API endpoint
        const response = await fetch('/api/badge/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Banner created successfully:", result);
          setIsModalOpen(false);
          router.push('/banners');
        } else {
          const errorData = await response.json();
          console.error("Failed to create banner:", errorData);
          alert(`Failed to create banner: ${errorData.message || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error("Error creating banner:", error);
      alert("An error occurred while saving the banner. Please try again.");
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      setIsModalOpen(false);
      router.push('/banners');
    }
  };

  const handleContentChange = (data: any) => {
    setFormData(prev => {
      const newFormData = { ...prev };
      
      // Handle content updates
      if (data.text !== undefined || data.link !== undefined || data.openInNewTab !== undefined || 
          data.useButton !== undefined || data.buttonText !== undefined || data.showCloseButton !== undefined) {
        newFormData.content = { ...prev.content, ...data };
      }
      
      // Handle display updates
      if (data.homePages !== undefined || data.collectionPages !== undefined || 
          data.productPages !== undefined || data.specificPages !== undefined) {
        newFormData.display = { ...prev.display, ...data };
      }
      
      // Handle schedule updates
      if (data.startDate !== undefined || data.endDate !== undefined || 
          data.startDateTime !== undefined || data.endDateTime !== undefined) {
        newFormData.schedule = { ...prev.schedule, ...data };
      }
      
      return newFormData;
    });
  };

  const handleDesignChange = (designData: any) => {
    setFormData(prev => ({
      ...prev,
      design: { ...prev.design, ...designData }
    }));
  };

  const getBannerTypeInfo = (type: string) => {
    switch (type) {
      case "countdown":
        return {
          title: "Countdown Banner Editor",
          subtitle: "Create urgency with countdown timers",
          tag: "Growth"
        };
      case "fixed":
        return {
          title: "Fixed Banner Editor", 
          subtitle: "Display consistent promotional messages"
        };
      case "automatic":
        return {
          title: "Automatic Banner Editor",
          subtitle: "Rotate through multiple messages automatically"
        };
      case "slider":
        return {
          title: "Slider Banner Editor",
          subtitle: "Let users navigate through banner content"
        };
      default:
        return {
          title: "Banner Editor",
          subtitle: "Create and customize your banner"
        };
    }
  };

  const typeInfo = getBannerTypeInfo(bannerType);

  return (
    <Modal variant="max" open={isModalOpen}>
      <TitleBar title={typeInfo.title} />
      <Page
        fullWidth
        backAction={{ content: "Banners", onAction: handleCancel }}
        title={formData.name}
        titleMetadata={getBannerStatus(bannerStatus)}
        subtitle={typeInfo.subtitle}
        primaryAction={{
          content: "Save",
          disabled: false,
          onAction: handleSave,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: handleCancel,
          },
        ]}
      >
        {/* Custom Tab Implementation */}
        <div style={{ marginBottom: "1rem" }}>
          <div
            style={{
              display: "flex",
              gap: "4px",
              backgroundColor: "#f6f6f7",
              padding: "4px",
              borderRadius: "12px",
              width: "fit-content",
              maxWidth: "100%",
            }}
          >
            <button
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: selectedTab === 0 ? "#ffffff" : "transparent",
                color: selectedTab === 0 ? "#1a1a1a" : "#6b7280",
                fontWeight: selectedTab === 0 ? "600" : "500",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow:
                  selectedTab === 0 ? "0 1px 3px rgba(0, 0, 0, 0.1)" : "none",
                minWidth: "auto",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
              onClick={() => handleTabChange(0)}
            >
              <Icon source={ContentIcon} tone="base" />
              Content
            </button>
            <button
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: selectedTab === 1 ? "#ffffff" : "transparent",
                color: selectedTab === 1 ? "#1a1a1a" : "#6b7280",
                fontWeight: selectedTab === 1 ? "600" : "500",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow:
                  selectedTab === 1 ? "0 1px 3px rgba(0, 0, 0, 0.1)" : "none",
                minWidth: "auto",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
              onClick={() => handleTabChange(1)}
            >
              <Icon source={EditIcon} tone="base" />
              Design
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "25% 75%",
            alignItems: "flex-start",
          }}
        >
          <div>
            {/* Content Tab */}
            <div style={{ display: selectedTab === 0 ? "block" : "none" }}>
              <BannerContentForm
                data={formData}
                onChange={handleContentChange}
                bannerType={bannerType}
              />
            </div>

            {/* Design Tab */}
            <div style={{ display: selectedTab === 1 ? "block" : "none" }}>
              <BannerDesignForm
                data={formData}
                onChange={handleDesignChange}
                bannerType={bannerType}
              />
            </div>
          </div>

          {/* Preview Section */}
          <div
            style={{
              position: "sticky",
              top: "1rem",
              height: "calc(100vh - 2rem)",
              overflow: "auto",
            }}
          >
            <div style={{ marginBottom: "16px" }}>
              <Card>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    gap: "16px",
                  }}
                >
                  {/* Label Name Input */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <TextField
                      label=""
                      value={formData.name || bannerName}
                      onChange={(value) => {
                        setBannerName(value);
                        setFormData({ ...formData, name: value });
                      }}
                      placeholder="Deco Label"
                      autoComplete="off"
                    />

                    {/* Status Toggle */}
                    <div style={{ minWidth: "200px" }}>
                      <ButtonGroup variant="segmented">
                        <Button
                          pressed={bannerStatus === "Active"}
                          onClick={() => setBannerStatus("Active")}
                        >
                          Active
                        </Button>
                        <Button
                          pressed={bannerStatus === "Inactive"}
                          onClick={() => setBannerStatus("Inactive")}
                        >
                          Inactive
                        </Button>
                      </ButtonGroup>
                    </div>
                  </div>

                  {/* Support Button */}
                  <Button variant="secondary">Support</Button>
                </div>
              </Card>
            </div>
            <Card>
              {/* Banner Name and Status in Preview Area */}
              <BannerPreview bannerData={formData} bannerType={bannerType} />
            </Card>
          </div>
        </div>
      </Page>
    </Modal>
  );
};
