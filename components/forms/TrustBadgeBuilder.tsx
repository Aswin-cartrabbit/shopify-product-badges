"use client";
import {
  Badge,
  Banner,
  BlockStack,
  Button,
  ButtonGroup,
  Card,
  Page,
} from "@shopify/polaris";
import { useCallback, useState, useEffect } from "react";
import {Modal, TitleBar} from '@shopify/app-bridge-react';
import TrustBadgeContentForm from "./TrustBadgeContentForm";
import TrustBadgePreview from "../TrustBadgePreview"; 

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
      setFormData(prev => ({
        ...prev,
        name: selectedTemplate.title || "Trust Badge",
        content: {
          ...prev.content,
          icons: selectedTemplate.icons || selectedTemplate.images || [],
          title: selectedTemplate.title || (selectedTemplate.type === "payment-group" ? "Secure payment with" : selectedTemplate.title)
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
      console.log("Current formData before save:", formData);
      
      // Structure the payload to match the API expectations
      const payload = {
        name: formData.name || name,
        type: "TRUST_BADGE", // Using uppercase as defined in ComponentType enum
        design: {
          // Map content to design structure for templates field
          content: formData.content,
          ...formData.design
        },
        display: {
          // Map placement and settings to display structure for rules field
          placement: formData.placement,
          ...formData.settings
        },
        settings: formData.settings || {},
        status: currentStatus
      };

      console.log("Saving trust badge payload:", payload);

      if (onSave) {
        console.log("Using custom onSave handler");
        onSave(payload);
        // Don't close modal here - let the parent component handle it
      } else {
        console.log("Using default API call");
        // Default API call if no custom onSave handler
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
          // Only close modal after successful save
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
    console.log("handleContentChange called with:", newContent);
    setFormData(prev => {
      const updated = {
        ...prev,
        content: { ...prev.content, ...newContent }
      };
      console.log("Updated formData:", updated);
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
            content: "Duplicate",
            accessibilityLabel: "Secondary action label",
            onAction: () => alert("Duplicate action"),
          },
          {
            content: "View on your store",
            onAction: () => alert("View on your store action"),
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
          <ButtonGroup variant="segmented">
            <Button
              pressed={selectedTab === 0}
              onClick={() => handleTabChange(0)}
            >
              Content
            </Button>
            <Button
              pressed={selectedTab === 1}
              onClick={() => handleTabChange(1)}
            >
              Design
            </Button>
            <Button
              pressed={selectedTab === 2}
              onClick={() => handleTabChange(2)}
            >
              Placement
            </Button>
          </ButtonGroup>
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
            {selectedTab === 0 && (
              <TrustBadgeContentForm 
                data={formData.content}
                onChange={handleContentChange}
                badgeName={formData.name}
                setBadgeName={(name) => {
                  console.log("Setting badge name:", name);
                  setFormData(prev => ({...prev, name}));
                }}
              />
            )}
            {selectedTab === 1 && (
              <Card>
                <BlockStack gap="400">
                  <div>Design options coming soon...</div>
                  {/* TODO: Add design form when ready */}
                </BlockStack>
              </Card>
            )}
            {selectedTab === 2 && (
              <Card>
                <BlockStack gap="400">
                  <div>Placement options coming soon...</div>
                  {/* TODO: Add placement form when ready */}
                </BlockStack>
              </Card>
            )}
          </div>
          <div
            style={{
              position: "sticky",
              top: "1rem",
              height: "calc(100vh - 2rem)",
              overflow: "auto",
            }}
          >
            <Card>
              <TrustBadgePreview data={formData.content} />
            </Card>
          </div>
        </div>
      </Page>
    </Modal>
  );
};
