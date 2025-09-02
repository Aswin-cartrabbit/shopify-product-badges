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
  
  const getBannerStatus = (status: "DRAFT" | "ACTIVE") => {
    switch (status) {
      case "DRAFT":
        return <Badge tone="attention">Draft</Badge>;
      case "ACTIVE":
        return <Badge tone="success">Active</Badge>;
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
      console.log("Tab changed to:", selectedTabIndex);
      setSelectedTab(selectedTabIndex);
    },
    []
  );

  const handleSave = async () => {
    try {
      const payload = {
        name: formData.name || bannerName,
        type: bannerType,
        content: formData.content,
        display: formData.display,
        schedule: formData.schedule,
        design: formData.design,
        status: "DRAFT"
      };

      console.log("Saving banner payload:", payload);

      if (onSave) {
        onSave(payload);
      } else {
        // Default API call
        const response = await fetch('/api/banner/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          console.log("Banner created successfully");
          setIsModalOpen(false);
          router.push('/banners');
        } else {
          console.error("Failed to create banner");
        }
      }
    } catch (error) {
      console.error("Error creating banner:", error);
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

  const handleContentChange = (contentData: any) => {
    setFormData(prev => ({
      ...prev,
      content: { ...prev.content, ...contentData },
      display: { ...prev.display, ...contentData },
      schedule: { ...prev.schedule, ...contentData }
    }));
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
        titleMetadata={getBannerStatus("ACTIVE")}
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
          <div style={{
            display: "flex",
            gap: "4px",
            backgroundColor: "#f6f6f7",
            padding: "4px",
            borderRadius: "12px",
            width: "fit-content",
            maxWidth: "100%"
          }}>
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
                boxShadow: selectedTab === 0 ? "0 1px 3px rgba(0, 0, 0, 0.1)" : "none",
                minWidth: "auto",
                display: "flex",
                alignItems: "center",
                gap: "6px"
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
                boxShadow: selectedTab === 1 ? "0 1px 3px rgba(0, 0, 0, 0.1)" : "none",
                minWidth: "auto",
                display: "flex",
                alignItems: "center",
                gap: "6px"
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
            <div style={{ display: selectedTab === 0 ? 'block' : 'none' }}>
              <BannerContentForm 
                data={formData}
                onChange={handleContentChange}
                bannerType={bannerType}
              />
            </div>
            
            {/* Design Tab */}
            <div style={{ display: selectedTab === 1 ? 'block' : 'none' }}>
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
            <Card>
              {/* Banner Name and Status in Preview Area */}
              <BlockStack gap="400">
                <InlineStack gap="400" align="space-between">
                  <div style={{ flex: 1 }}>
                    <TextField
                      label=""
                      value={bannerName}
                      onChange={(value) => {
                        setBannerName(value);
                        setFormData(prev => ({ ...prev, name: value }));
                      }}
                      placeholder="Enter banner name"
                      autoComplete="off"
                    />
                  </div>
                  
                  {/* Status Tabs */}
                  <div style={{
                    display: "flex",
                    gap: "2px",
                    backgroundColor: "#f6f6f7",
                    padding: "2px",
                    borderRadius: "8px",
                    width: "fit-content"
                  }}>
                    <button
                      style={{
                        padding: "8px 16px",
                        borderRadius: "6px",
                        border: "none",
                        backgroundColor: bannerStatus === "Active" ? "#00a047" : "transparent",
                        color: bannerStatus === "Active" ? "#ffffff" : "#6b7280",
                        fontWeight: "500",
                        fontSize: "14px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        minWidth: "auto"
                      }}
                      onClick={() => setBannerStatus("Active")}
                    >
                      Active
                    </button>
                    <button
                      style={{
                        padding: "8px 16px",
                        borderRadius: "6px",
                        border: "none",
                        backgroundColor: bannerStatus === "Inactive" ? "#6b7280" : "transparent",
                        color: bannerStatus === "Inactive" ? "#ffffff" : "#6b7280",
                        fontWeight: "500",
                        fontSize: "14px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        minWidth: "auto"
                      }}
                      onClick={() => setBannerStatus("Inactive")}
                    >
                      Inactive
                    </button>
                  </div>
                </InlineStack>
                
                <BannerPreview 
                  bannerData={formData}
                  bannerType={bannerType}
                />
              </BlockStack>
            </Card>
          </div>
        </div>
      </Page>
    </Modal>
  );
};
