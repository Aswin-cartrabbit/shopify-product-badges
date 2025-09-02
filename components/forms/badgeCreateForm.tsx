// BadgeBuilder.tsx - Fixed version to prevent content reset on tab switch

"use client";
import {
  Badge,
  Bleed,
  BlockStack,
  Button,
  ButtonGroup,
  Card,
  Divider,
  Icon,
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
import { BadgeHorizontalPosition, BadgeAlignment } from "@/components/BadgeHorizontalPosition";
import HtmlPreviewer from "../HtmlPreviewer";
import ContentForm from "./ContentForm";
import DesignForm from "./DesignForm";
import ProductsForm from "./ProductsForm";
import {Modal, TitleBar, useAppBridge} from '@shopify/app-bridge-react';
import { EditIcon, ProductAddIcon, ContentIcon } from "@shopify/polaris-icons";

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
  const [hasInitializedTemplate, setHasInitializedTemplate] = useState(false);
  
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
      updateDesign("horizontalPosition", BadgeHorizontalPosition.BELOW_PRODUCT_TITLE);
      updateDesign("textAlignment", BadgeAlignment.LEFT);
    }
  }, [type, updateDesign]);

  // Initialize the badge store with selected template data - only once
  useEffect(() => {
    // Only initialize when we have a new template and haven't initialized yet
    if (selectedTemplate && !hasInitializedTemplate) {
      // Clear previous badge data to avoid state issues - only on first load
      clearBadge();
      
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
      
      setHasInitializedTemplate(true);
    }
  }, [selectedTemplate?.id, hasInitializedTemplate, updateContent, updateDesign, clearBadge]);

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
              <Icon source={EditIcon} tone="base" />
              Design
            </button>
            <button
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: selectedTab === 2 ? "#ffffff" : "transparent",
                color: selectedTab === 2 ? "#1a1a1a" : "#6b7280",
                fontWeight: selectedTab === 2 ? "600" : "500",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: selectedTab === 2 ? "0 1px 3px rgba(0, 0, 0, 0.1)" : "none",
                minWidth: "auto",
                display: "flex",
                alignItems: "center",
                gap: "6px"
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
              <Icon source={ProductAddIcon} tone="base" />
              Products
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
            {/* SOLUTION: Always render all forms but hide them with CSS */}
            <div style={{ display: selectedTab === 0 ? 'block' : 'none' }}>
              <ContentForm 
                data={selectedTemplate}
                onChange={(data) => setFormData({...formData, ...data})}
                type={componentType}
                badgeName={formData.name}
                setBadgeName={(name) => setFormData({...formData, name})}
              />
            </div>
            <div style={{ display: selectedTab === 1 ? 'block' : 'none' }}>
              <DesignForm 
                data={formData}
                onChange={(data) => setFormData({...formData, design: data})}
                selectedTemplate={selectedTemplate}
                type={componentType}
              />
            </div>
            <div style={{ display: selectedTab === 2 ? 'block' : 'none' }}>
              <ProductsForm 
                data={formData}
                onChange={(data) => setFormData({...formData, products: data})}
                type={componentType}
              />
            </div>
          </div>
          <div
            style={{
              position: "sticky",
              top: "1rem", // distance from top while scrolling
              height: "calc(100vh - 2rem)", // keep within viewport height
              overflow: "auto", // scroll inside preview if needed
            }}
          >
            <Card>
              <HtmlPreviewer selectedTemplate={selectedTemplate} type={componentType} />
            </Card>
          </div>
        </div>
      </Page>
    </Modal>
  );
};