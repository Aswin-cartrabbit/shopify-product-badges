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
} from "@shopify/polaris";
import { useCallback, useState, useEffect } from "react";
import {Modal, TitleBar} from '@shopify/app-bridge-react';
import { EditIcon, ProductAddIcon, ContentIcon } from "@shopify/polaris-icons";
import TrustBadgeContentForm from "./TrustBadgeContentForm";
import TrustBadgePreview from "../TrustBadgePreview";
import { DesignForm } from "./DesignForm"; 

interface TrustBadgeBuilderProps {
  selectedTemplate?: any;
  onSave?: (data: any) => void;
  onCancel?: () => void;
  isSaving?: boolean;
  errorMessage?: string | null;
  onClearError?: () => void;
}

export const TrustBadgeBuilder = ({ 
  selectedTemplate, 
  onSave,
  onCancel,
  isSaving = false,
  errorMessage: externalErrorMessage = null,
  onClearError
}: TrustBadgeBuilderProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  // Use external error message if provided, otherwise use internal
  const displayErrorMessage = externalErrorMessage || errorMessage;
  
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
    design: {
      background: "transparent",
      borderRadius: 0,
      padding: 16
    },
    placement: {},
    settings: {}
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
        design: {
          ...prev.design,
          ...selectedTemplate.design,
          background: selectedTemplate.design?.background || "transparent",
          borderRadius: selectedTemplate.design?.borderRadius || 0,
          padding: selectedTemplate.design?.padding || 16
        },
        placement: {
          ...prev.placement,
          ...selectedTemplate.display
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
    // Use external loading state if provided, otherwise use internal
    if (!isSaving) {
      setIsLoading(true);
    }
    setErrorMessage("");
    if (onClearError) {
      onClearError();
    }
    
    try {
      console.log("=== HANDLE SAVE DEBUG ===");
      console.log("Current formData before save:", JSON.stringify(formData, null, 2));
      console.log("formData.content:", JSON.stringify(formData.content, null, 2));
      console.log("formData.content.icons:", JSON.stringify(formData.content?.icons, null, 2));
      console.log("formData.content.icons length:", formData.content?.icons?.length);
      console.log("selectedTemplate (for edit check):", selectedTemplate);
      
      // Structure the payload to match the API expectations
      const payload: any = {
        name: formData.name || name,
        type: "TRUST_BADGE", // Using uppercase as defined in ComponentType enum
        design: {
          // Map content to design.templates structure for database
          content: {
            ...formData.content,
            icons: formData.content?.icons || [] // Ensure icons array is explicitly set
          },
          ...formData.design
        },
        display: {
          // Map placement and settings to display structure for database
          placement: formData.placement,
          ...formData.settings
        },
        settings: formData.settings || {},
        status: currentStatus
      };

      console.log("Final payload:", JSON.stringify(payload, null, 2));
      console.log("Payload design.content.icons:", JSON.stringify(payload.design.content?.icons, null, 2));
      console.log("Payload design.content.icons length:", payload.design.content?.icons?.length);
      console.log("=========================");

      // Call parent's onSave handler if provided (handles API call and navigation)
      if (onSave) {
        await onSave(payload);
      } else {
        // Fallback: direct API call (for backward compatibility)
        const response = await fetch('/api/badge/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        console.log("API response status:", response.status);
        
        if (response.ok) {
          const result = await response.json();
          console.log('Trust badge created successfully:', result);
          
          // Close modal after successful save
          setIsModalOpen(false);
        } else {
          const error = await response.json();
          console.error('Failed to create trust badge:', error);
          setErrorMessage(error.message || 'Failed to create trust badge');
        }
      }
    } catch (error) {
      console.error('Error creating trust badge:', error);
      setErrorMessage('An unexpected error occurred while creating the trust badge');
    } finally {
      if (!isSaving) {
        setIsLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    if (onCancel) {
      onCancel();
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

  const handleDesignChange = (newDesign: any) => {
    console.log("handleDesignChange called with:", newDesign);
    setFormData(prev => {
      const updated = {
        ...prev,
        design: { ...prev.design, ...newDesign }
      };
      console.log("Updated formData:", updated);
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

  return (
    <Modal variant="max" open={isModalOpen} onHide={handleCancel}>
      <TitleBar title="Trust Badge Editor" />
      <Page
        fullWidth
        backAction={{
          content: "Trust Badges",
          onAction: handleCancel,
        }}
        title="Trust Badge Editor"
        titleMetadata={getBadges(currentStatus)}
        subtitle="Customize your trust badge"
        primaryAction={{
          content: (isSaving || isLoading) ? "Saving..." : "Save",
          disabled: isSaving || isLoading,
          onAction: handleSave,
          loading: isSaving || isLoading,
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
                    content: formData.content,
                    ...formData.design
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
        {displayErrorMessage && (
          <div style={{ marginBottom: "12px" }}>
            <Banner tone="critical" onDismiss={() => {
              setErrorMessage("");
              if (onClearError) {
                onClearError();
              }
            }}>
              {displayErrorMessage}
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
            {/* Design (index 1) */}
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
              <Icon source={ProductAddIcon} tone="base" />
              Design
            </button>
            {/* Placement (index 2) */}
            <button
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                border: "none",
                backgroundColor:
                  selectedTab === 2 ? "#ffffff" : "transparent",
                color: selectedTab === 2 ? "#1a1a1a" : "#6b7280",
                fontWeight: selectedTab === 2 ? "600" : "500",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow:
                  selectedTab === 2
                    ? "0 1px 3px rgba(0, 0, 0, 0.1)"
                    : "none",
                minWidth: "auto",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
              onClick={() => handleTabChange(2)}
              onMouseEnter={(e) => {
                if (selectedTab !== 2) {
                  e.currentTarget.style.backgroundColor = "#eeeeee";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedTab !== 2) {
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
            {/* Design tab */}
              <div
                style={{
                  display: selectedTab === 1 ? "block" : "none",
                }}
              >
                <DesignForm
                  data={formData.design}
                  onChange={handleDesignChange}
                  selectedTemplate={selectedTemplate}
                  type="TRUST_BADGE"
                />
              </div>
            {/* Placement tab */}
            <div
              style={{
                display: selectedTab === 2 ? "block" : "none",
              }}
            >
              <Card>
                <BlockStack gap="400">
                  <div>Placement options coming soon...</div>
                  {/* TODO: Add placement form when ready */}
                </BlockStack>
              </Card>
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
