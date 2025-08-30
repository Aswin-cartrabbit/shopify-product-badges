"use client";
import {
  Badge,
  Bleed,
  BlockStack,
  Button,
  ButtonGroup,
  Card,
  Divider,
  Page,
  RadioButton,
  Select,
  Tabs,
  Text,
  TextField,
  Thumbnail,
} from "@shopify/polaris";
import { useCallback, useState, useEffect } from "react";
import { useBadgeStore, GridPosition } from "@/stores/BadgeStore";
import HtmlPreviewer from "../HtmlPreviewer";
import ContentForm from "./ContentForm";
import DesignForm from "./DesignForm";
import ProductsForm from "./ProductsForm";
import {Modal, TitleBar, useAppBridge} from '@shopify/app-bridge-react';

interface BadgeBuilderProps {
  type?: "BADGE" | "LABEL";
  selectedTemplate?: any;
  onSave?: (data: any) => void;
  onCancel?: () => void;
}

export const BadgeBuilder = ({ 
  type = "BADGE", 
  selectedTemplate, 
  onSave,
  onCancel 
}: BadgeBuilderProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  
  const getBadges = (status: "DRAFT" | "ACTIVE") => {
    switch (status) {
      case "DRAFT":
        return <Badge tone="attention">Draft</Badge>;
      case "ACTIVE":
        return <Badge tone="success">Active</Badge>;
    }
  };
  const [name, setName] = useState(`Your ${type.toLowerCase()}`);
  const [componentType, setComponentType] = useState(type);
  // Example usage of the getBadges function
  const currentStatus: "DRAFT" | "ACTIVE" = "ACTIVE";

  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [formData, setFormData] = useState<any>({
    name: selectedTemplate?.text || selectedTemplate?.alt || name,
    type: componentType,
    design: selectedTemplate || {},
    display: {},
    placement: {},
    settings: {}
  });

  // Update formData when selectedTemplate changes
  useEffect(() => {
    if (selectedTemplate) {
      setFormData(prev => ({
        ...prev,
        name: selectedTemplate.text || selectedTemplate.alt || `New ${componentType.toLowerCase()}`,
        design: selectedTemplate
      }));
    }
  }, [selectedTemplate, componentType]);

  const { updateContent, updateDesign, clearBadge } = useBadgeStore();

  // Set default position based on type
  useEffect(() => {
    if (type === "LABEL") {
      updateDesign("gridPosition", GridPosition.TOP_LEFT);
    } else if (type === "BADGE") {
      updateDesign("gridPosition", GridPosition.TOP_RIGHT);
    }
  }, [type, updateDesign]);

  // Initialize the badge store with selected template data
  useEffect(() => {
    // Clear previous badge data to avoid state issues
    clearBadge();
    
    if (selectedTemplate) {
      // For text templates
      if (selectedTemplate.text && !selectedTemplate.src) {
        updateContent("text", selectedTemplate.text);
        updateContent("icon", "");
        updateContent("iconUploaded", false);
        
        if (selectedTemplate.style) {
          // Convert template styles to badge store format
          if (selectedTemplate.style.background) {
            updateDesign("color", selectedTemplate.style.background);
            updateDesign("background", "solid");
          }
          
          if (selectedTemplate.style.borderRadius) {
            const radius = typeof selectedTemplate.style.borderRadius === 'string' 
              ? parseInt(selectedTemplate.style.borderRadius.replace('px', '')) 
              : parseInt(selectedTemplate.style.borderRadius);
            updateDesign("cornerRadius", radius || 0);
          }
          
          // Handle clip-path as shape
          if (selectedTemplate.style.clipPath) {
            updateDesign("shape", `clip-path: ${selectedTemplate.style.clipPath}`);
          }
          
          // Set template identifier
          updateDesign("template", `Template_${selectedTemplate.id}`);
        }
      }
      
      // For image templates
      if (selectedTemplate.src) {
        updateContent("icon", selectedTemplate.src);
        updateContent("iconUploaded", true);
        updateContent("text", selectedTemplate.alt || "");
        // No shapes for image templates
        updateDesign("shape", "");
      }
    }
  }, [selectedTemplate, updateContent, updateDesign, clearBadge]);

  const handleTabChange = useCallback(
    (selectedTabIndex: any) => {
      console.log("Tab changed to:", selectedTabIndex);
      setSelectedTab(selectedTabIndex);
    },
    []
  );

  const handleSave = async () => {
    try {
      const { badge } = useBadgeStore.getState();
      
      const payload = {
        name: formData.name || name,
        type: componentType,
        design: {
          templates: selectedTemplate ? {
            id: selectedTemplate.id,
            type: selectedTemplate.src ? "image" : "text",
            data: selectedTemplate
          } : badge.design,
          ...badge.design
        },
        display: {
          rules: badge.display,
          ...formData.display
        },
        settings: {
          content: badge.content,
          placement: badge.placement,
          ...formData.settings
        },
        status: "DRAFT"
      };

      console.log("Saving payload:", payload);

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
          console.log(`${componentType} created successfully`);
          setIsModalOpen(false);
        } else {
          console.error(`Failed to create ${componentType}`);
        }
      }
    } catch (error) {
      console.error(`Error creating ${componentType}:`, error);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      setIsModalOpen(false);
    } 
  };

  return (
    <Modal variant="max" open={isModalOpen}>
      <TitleBar title="Badge Editor" />
      <Page
        fullWidth
        backAction={{ content: "Products", url: "/badges" }}
        title={`Your ${componentType.toLowerCase()}`}
        titleMetadata={getBadges(currentStatus)}
        subtitle={`${componentType.charAt(0) + componentType.slice(1).toLowerCase()} Editor`}
        primaryAction={{
          content: "Save",
          disabled: false,
          onAction: handleSave,
        }}
        secondaryActions={[
          
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
              Products
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
              <ContentForm 
                data={selectedTemplate}
                onChange={(data) => setFormData({...formData, ...data})}
                type={componentType}
                badgeName={formData.name}
                setBadgeName={(name) => setFormData({...formData, name})}
              />
            )}
            {selectedTab === 1 && (
              <DesignForm 
                data={formData}
                onChange={(data) => setFormData({...formData, design: data})}
                selectedTemplate={selectedTemplate}
                type={componentType}
              />
            )}
            {selectedTab === 2 && (
              <ProductsForm 
                data={formData}
                onChange={(data) => setFormData({...formData, products: data})}
                type={componentType}
              />
            )}
          </div>
          <div
            style={{
              position: "sticky",
              top: "1rem", // distance from top while scrolling
              height: "calc(100vh - 2rem)", // keep within viewport height
              overflow: "auto", // scroll inside preview if
            }}
          >
            <Card>
              <HtmlPreviewer selectedTemplate={selectedTemplate} />
            </Card>
          </div>
        </div>
      </Page>
    </Modal>
  );
};
