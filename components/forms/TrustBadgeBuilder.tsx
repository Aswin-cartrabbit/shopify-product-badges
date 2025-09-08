"use client";
import {
  Badge,
  Banner,
  BlockStack,
  Button,
  ButtonGroup,
  Card,
  Page,
  Icon,
  Text,
  Select,
} from "@shopify/polaris";
import { useCallback, useState, useEffect } from "react";
import {Modal, TitleBar} from '@shopify/app-bridge-react';
import { EditIcon, ProductAddIcon, ContentIcon } from "@shopify/polaris-icons";
import TrustBadgeContentForm from "./TrustBadgeContentForm";
import TrustBadgePreview from "../TrustBadgePreview";
import TrustBadgeProductsForm from "./TrustBadgeProductsForm";
import TrustBadgeDisplayForm from "./TrustBadgeDisplayForm"; 

interface TrustBadgeBuilderProps {
  selectedTemplate?: any;
  onSave?: (data: any) => void;
  onCancel?: () => void;
}

export const TrustBadgeBuilder = ({ 
  selectedTemplate, 
  onSave,
  onCancel 
}: TrustBadgeBuilderProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  const getBadges = (status: "DRAFT" | "ACTIVE") => {
    switch (status) {
      case "DRAFT":
        return <Badge tone="attention">Draft</Badge>;
      case "ACTIVE":
        return <Badge tone="success">Active</Badge>;
    }
  };

  const [name, setName] = useState(`Trust Badge`);
  const currentStatus: "DRAFT" | "ACTIVE" = "ACTIVE";

  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [formData, setFormData] = useState<any>({
    name: selectedTemplate?.title || name,
    type: "TRUST_BADGE",
    content: {
      icons: selectedTemplate?.icons || [],
      layout: "horizontal", // horizontal or vertical
      iconSize: 40,
      spacing: 8,
      showTitle: true,
      title: selectedTemplate?.title || "Secure payment with"
    },
    placement: {
      position: "below_buy_button", // Default position
      zIndex: 10,
      pageDisplay: {
        product: true,
        collection: true,
        home: true,
        search: true,
        cart: false
      }
    },
    settings: {
      visibility: "all",
      resourceIds: [],
      customerCondition: "all",
      customerTags: [],
      languagesMode: "all",
      customLanguages: [],
      isScheduled: false,
      startDateTime: undefined,
      endDateTime: undefined
    }
  });

  // Update formData when selectedTemplate changes
  useEffect(() => {
    if (selectedTemplate) {
      console.log("Updating formData with selectedTemplate:", selectedTemplate);

      setFormData(prev => ({
        ...prev,
        name: selectedTemplate.title || selectedTemplate.name || "Trust Badge",
        content: {
          ...prev.content,
          icons: selectedTemplate.icons || selectedTemplate.images || selectedTemplate.content?.icons || [],
          layout: selectedTemplate.content?.layout || "horizontal",
          iconSize: selectedTemplate.content?.iconSize || 40,
          spacing: selectedTemplate.content?.spacing || 8,
          showTitle: selectedTemplate.content?.showTitle !== undefined ? selectedTemplate.content.showTitle : true,
          title: selectedTemplate.content?.title || selectedTemplate.title || "Secure payment with"
        },
        placement: {
          ...prev.placement,
          ...selectedTemplate.display,
          position: selectedTemplate.display?.position || "below_buy_button",
          zIndex: selectedTemplate.display?.zIndex || 10
        },
        settings: {
          ...prev.settings,
          ...selectedTemplate.settings
        }
      }));
    }
  }, [selectedTemplate]);

  const handleTabChange = useCallback(
    (selectedTabIndex: any) => {
      console.log("Tab changed to:", selectedTabIndex);
      setSelectedTab(selectedTabIndex);
    },
    []
  );

  const handleSave = async () => {
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      console.log("=== HANDLE SAVE DEBUG ===");
      console.log("Current formData before save:", JSON.stringify(formData, null, 2));
      console.log("formData.content:", JSON.stringify(formData.content, null, 2));
      console.log("formData.content.icons:", JSON.stringify(formData.content?.icons, null, 2));
      console.log("formData.content.icons length:", formData.content?.icons?.length);
      
      // Structure the payload to match the API expectations
      const payload: any = {
        name: formData.name || name,
        type: "TRUST_BADGE", // Using uppercase as defined in ComponentType enum
        design: {
          // Map content to design structure for templates field
          content: {
            ...formData.content,
            icons: formData.content?.icons || [] // Ensure icons array is explicitly set
          }
        },
        display: {
          // Map placement and settings to display structure for rules field
          placement: formData.placement,
          ...formData.settings
        },
        settings: formData.settings || {},
        status: currentStatus
      };

      // Always use POST for new badges (no edit functionality for now)

      console.log("Final payload:", JSON.stringify(payload, null, 2));
      console.log("Payload design.content.icons:", JSON.stringify(payload.design.content?.icons, null, 2));
      console.log("Payload design.content.icons length:", payload.design.content?.icons?.length);
      console.log("=========================");

      // Always use POST for new badges
      const method = 'POST';
      
      // Always make the API call first
      const response = await fetch('/api/badge/create', {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log("API response status:", response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Trust badge created successfully:', result);
        
        // Call parent's onSave handler if provided (for refresh logic)
        if (onSave) {
          await onSave(payload);
        }
        
        // Close modal after successful save
        setIsModalOpen(false);
      } else {
        const error = await response.json();
        console.error('Failed to create trust badge:', error);
        setErrorMessage(error.message || 'Failed to create trust badge');
      }
    } catch (error) {
      console.error('Error creating trust badge:', error);
      setErrorMessage('An unexpected error occurred while creating the trust badge');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      setIsModalOpen(false);
    }
  };

  const handleContentChange = (newContent: any) => {
    console.log("=== HANDLE CONTENT CHANGE DEBUG ===");
    console.log("handleContentChange called with:", JSON.stringify(newContent, null, 2));
    console.log("Previous formData.content:", JSON.stringify(formData.content, null, 2));
    console.log("Previous formData.content.icons:", JSON.stringify(formData.content?.icons, null, 2));
    console.log("Previous formData.content.icons length:", formData.content?.icons?.length);
    
    setFormData(prev => {
      const updated = {
        ...prev,
        content: { ...prev.content, ...newContent }
      };
      console.log("Updated formData:", JSON.stringify(updated, null, 2));
      console.log("Updated formData.content.icons:", JSON.stringify(updated.content.icons, null, 2));
      console.log("Updated formData.content.icons length:", updated.content.icons?.length);
      console.log("=====================================");
      return updated;
    });
  };

  const handlePlacementChange = (newPlacement: any) => {
    console.log("handlePlacementChange called with:", newPlacement);
    setFormData(prev => {
      const updated = {
        ...prev,
        placement: { ...prev.placement, ...newPlacement }
      };
      console.log("Updated formData:", updated);
      return updated;
    });
  };

  const handleSettingsChange = (newSettings: any) => {
    console.log("handleSettingsChange called with:", newSettings);
    setFormData(prev => {
      const updated = {
        ...prev,
        settings: { ...prev.settings, ...newSettings }
      };
      console.log("Updated formData:", updated);
      return updated;
    });
  };

  return (
    <Modal variant="max" open={isModalOpen}>
      <TitleBar title="Trust Badge Editor" />
      <Page
        fullWidth
        backAction={{ content: "Trust Badges", url: "#" }}
        title="Trust Badge Editor"
        titleMetadata={getBadges(currentStatus)}
        subtitle="Customize your trust badge"
        primaryAction={{
          content: isLoading ? "Saving..." : "Save",
          disabled: isLoading,
          onAction: handleSave,
          loading: isLoading,
        }}
        secondaryActions={[
          {
            content: "Save as Draft",
            onAction: async () => {
              setIsLoading(true);
              setErrorMessage("");
              
              try {
                const payload: any = {
                  name: formData.name || name,
                  type: "TRUST_BADGE",
                  design: {
                    content: formData.content
                  },
                  display: {
                    placement: formData.placement,
                    ...formData.settings
                  },
                  settings: formData.settings || {},
                  status: "DRAFT"
                };

                // Add update fields if editing existing badge
                if (selectedTemplate?.id) {
                  payload.id = selectedTemplate.id;
                  payload.isUpdate = true;
                }

                // Use PUT for updates, POST for new badges
                const method = selectedTemplate?.id ? 'PUT' : 'POST';

                const response = await fetch('/api/badge/create', {
                  method: method,
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(payload),
                });

                if (response.ok) {
                  const result = await response.json();
                  console.log('Trust badge saved as draft:', result);
                  
                  if (onSave) {
                    await onSave(payload);
                  }
                  
                  setIsModalOpen(false);
                } else {
                  const error = await response.json();
                  console.error('Failed to save draft:', error);
                  setErrorMessage(error.message || 'Failed to save draft');
                }
              } catch (error) {
                console.error('Error saving draft:', error);
                setErrorMessage('An unexpected error occurred while saving draft');
              } finally {
                setIsLoading(false);
              }
            },
          },
          {
            content: "Close",
            onAction: handleCancel,
          },
        ]}
      >
        {/* Error Banner */}
        {errorMessage && (
          <div style={{ marginBottom: "12px" }}>
            <Banner tone="critical" onDismiss={() => setErrorMessage("")}>
              {errorMessage}
            </Banner>
          </div>
        )}
        
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
            {/* Content (index 0) */}
            <button
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                border: "none",
                backgroundColor:
                  selectedTab === 0 ? "#ffffff" : "transparent",
                color: selectedTab === 0 ? "#1a1a1a" : "#6b7280",
                fontWeight: selectedTab === 0 ? "600" : "500",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow:
                  selectedTab === 0
                    ? "0 1px 3px rgba(0, 0, 0, 0.1)"
                    : "none",
                minWidth: "auto",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
              onClick={() => handleTabChange(0)}
              onMouseEnter={(e) => {
                if (selectedTab !== 0) {
                  e.currentTarget.style.backgroundColor = "#eeeeee";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedTab !== 0) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              <Icon source={EditIcon} tone="base" />
              Content
            </button>
            {/* Placement (index 1) */}
            <button
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                border: "none",
                backgroundColor:
                  selectedTab === 1 ? "#ffffff" : "transparent",
                color: selectedTab === 1 ? "#1a1a1a" : "#6b7280",
                fontWeight: selectedTab === 1 ? "600" : "500",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow:
                  selectedTab === 1
                    ? "0 1px 3px rgba(0, 0, 0, 0.1)"
                    : "none",
                minWidth: "auto",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
              onClick={() => handleTabChange(1)}
              onMouseEnter={(e) => {
                if (selectedTab !== 1) {
                  e.currentTarget.style.backgroundColor = "#eeeeee";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedTab !== 1) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              <Icon source={ContentIcon} tone="base" />
              Placement
            </button>
          </div>
        </div>
        
        <div
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "25% 75%",
            alignItems: "flex-start",
            marginBottom: "16px",
          }}
        >
          <div>
            {/* Content tab */}
            <div
              style={{
                display: selectedTab === 0 ? "block" : "none",
              }}
            >
              <TrustBadgeContentForm 
                data={formData.content}
                onChange={handleContentChange}
                badgeName={formData.name}
                setBadgeName={(name) => {
                  console.log("Setting badge name:", name);
                  setFormData(prev => ({...prev, name}));
                }}
              />
            </div>
            {/* Placement tab */}
            <div
              style={{
                display: selectedTab === 1 ? "block" : "none",
              }}
            >
              <BlockStack gap="400">
                {/* Default Position Text */}
                <Card>
                  <BlockStack gap="200">
                    <Text variant="bodyMd" as="p" fontWeight="medium">
                      Default position
                    </Text>
                    <Text variant="bodySm" as="h1" tone="subdued">
                      Automatically show under "Buy" button
                    </Text>
                  </BlockStack>
                </Card>

                {/* Products Selection */}
                <TrustBadgeProductsForm
                  data={formData.settings}
                  onChange={handleSettingsChange}
                />

                {/* Display Settings */}
                <TrustBadgeDisplayForm
                  data={formData.settings}
                  onChange={handleSettingsChange}
                />

                {/* Z-Index Settings */}
               
              </BlockStack>
            </div>
          </div>
          <div
            style={{
              position: "sticky",
              top: "1rem",
              height: "calc(100vh - 2rem)",
              overflow: "auto",
              
            }}
          >

<div style={{ border:"none !important" }}>
            
              <TrustBadgePreview data={formData.content} />
            
            </div>
          </div>
        </div>
      </Page>
    </Modal>
  );
};
