"use client";
import {
  Badge,
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
    try {
      const payload = {
        name: formData.name || name,
        type: "TRUST_BADGE",
        content: formData.content,
        design: formData.design,
        placement: formData.placement,
        settings: formData.settings,
        status: "DRAFT"
      };

      console.log("Saving trust badge payload:", payload);

      if (onSave) {
        onSave(payload);
      } else {
        // Default API call if no custom onSave handler
        const response = await fetch('/api/badge/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          console.log('Trust badge created successfully');
          setIsModalOpen(false);
        } else {
          console.error('Failed to create trust badge');
        }
      }
    } catch (error) {
      console.error('Error creating trust badge:', error);
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
    setFormData(prev => ({
      ...prev,
      content: { ...prev.content, ...newContent }
    }));
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
          content: "Save",
          disabled: false,
          onAction: handleSave,
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
                setBadgeName={(name) => setFormData({...formData, name})}
              />
            )}
            {selectedTab === 1 && (
              <Card>
                <BlockStack gap="400">
                  <div>Design options coming soon...</div>
                </BlockStack>
              </Card>
            )}
            {selectedTab === 2 && (
              <Card>
                <BlockStack gap="400">
                  <div>Placement options coming soon...</div>
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
