// BadgeBuilder.tsx - Fixed version to prevent content reset on tab switch

"use client";
import {
  Badge,
  Bleed,
  BlockStack,
  Button,
  ButtonGroup,
  Card,
  Banner,
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
import { DesignForm } from "./DesignForm";
import ProductsForm from "./ProductsForm";
import DisplayForm from "./DisplayForm";
import { Modal, TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { EditIcon, ProductAddIcon, ContentIcon } from "@shopify/polaris-icons";

interface BadgeBuilderProps {
  type?: "BADGE" | "LABEL";
  selectedTemplate?: any;
  onSave?: (data: any) => void;
  onCancel?: () => void;
  isSaving?: boolean;
  errorMessage?: string;
  onClearError?: () => void;
}

export const BadgeBuilder = ({ 
  type = "BADGE", 
  selectedTemplate, 
  onSave,
  onCancel,
  isSaving,
  errorMessage,
  onClearError
}: BadgeBuilderProps) => {


  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const [hasInitializedTemplate, setHasInitializedTemplate] = useState(false);
  
  // Auto-dismiss error message after 5 seconds
  useEffect(() => {
    if (errorMessage && onClearError) {
      const timer = setTimeout(() => {
        onClearError();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [errorMessage, onClearError]);
  
  const getBadges = (status: "DRAFT" | "ACTIVE") => {
    switch (status) {
      case "DRAFT":
        return <Badge tone="attention">Draft</Badge>;
      case "ACTIVE":
        return <Badge tone="success">Active</Badge>;
    }
  };
  // Determine if this is edit mode vs template selection mode
  const isEditMode = selectedTemplate && selectedTemplate.id && selectedTemplate.name && selectedTemplate.design;
  
  const [name, setName] = useState(() => {
    if (isEditMode) {
      return selectedTemplate.name;
    }
    return selectedTemplate?.text || selectedTemplate?.alt || `Your ${type.toLowerCase()}`;
  });
  
  const [componentType, setComponentType] = useState(type);
  const [currentStatus, setCurrentStatus] = useState<"DRAFT" | "ACTIVE">(() => {
    if (isEditMode) {
      return selectedTemplate.status || "ACTIVE";
    }
    return "ACTIVE";
  });

  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<any>(() => {
    if (isEditMode) {
      return {
        name: selectedTemplate.name,
        type: selectedTemplate.type || componentType,
        design: selectedTemplate.design || {},
        display: selectedTemplate.display || {},
        placement: selectedTemplate.settings?.placement || {},
        settings: selectedTemplate.settings || {}
      };
    }
    
    return {
      name: selectedTemplate?.text || selectedTemplate?.alt || `New ${componentType.toLowerCase()}`,
      type: componentType,
      design: selectedTemplate || {},
      display: {},
      placement: {},
      settings: {}
    };
  });

  console.log('isEditMode:', isEditMode);
  console.log('selectedTemplate:', selectedTemplate);
  console.log('formData:', formData);

  // Update formData when selectedTemplate changes
  useEffect(() => {
    if (selectedTemplate) {
      if (isEditMode) {
        // Edit mode: use database structure
        console.log('Updating formData for edit mode');
        setFormData({
          name: selectedTemplate.name,
          type: selectedTemplate.type || componentType,
          design: selectedTemplate.design || {},
          display: selectedTemplate.display || {},
          placement: selectedTemplate.settings?.placement || {},
          settings: selectedTemplate.settings || {}
        });
        setName(selectedTemplate.name);
        setCurrentStatus(selectedTemplate.status || "ACTIVE");
      } else {
        // Template selection mode: use template structure
        console.log('Updating formData for template selection mode');
        setFormData(prev => ({
          ...prev,
          name: selectedTemplate.text || selectedTemplate.alt || `New ${componentType.toLowerCase()}`,
          design: selectedTemplate
        }));
        setName(selectedTemplate.text || selectedTemplate.alt || `New ${componentType.toLowerCase()}`);
      }
    }
  }, [selectedTemplate, componentType, isEditMode]);

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
      
      if (isEditMode) {
        // Edit mode: Initialize from database structure
        console.log('Initializing badge store for edit mode');
        
        // Initialize content from settings
        if (selectedTemplate.settings?.content) {
          const content = selectedTemplate.settings.content;
          updateContent("text", content.text || "");
          updateContent("icon", content.src || content.icon || "");
          updateContent("iconUploaded", !!content.iconUploaded);
          updateContent("alt", content.alt || "");
          updateContent("textColor", content.textColor || "#000000");
          updateContent("contentType", content.contentType || "text");
        }
        
        // Initialize design from design object
        if (selectedTemplate.design) {
          const design = selectedTemplate.design;
          Object.keys(design).forEach(key => {
            updateDesign(key as any, design[key]);
          });
        }
        
      } else {
        // Template selection mode: Initialize from template structure
        console.log('Initializing badge store for template selection mode');
        
        // For text templates
        if (selectedTemplate.text && !selectedTemplate.src) {
          updateContent("text", selectedTemplate.text);
          updateContent("icon", "");
          updateContent("iconUploaded", false);
          
          if (selectedTemplate.style) {
            // Convert template styles to badge store format
            if (selectedTemplate.style.background || selectedTemplate.style.backgroundColor) {
              updateDesign("color", selectedTemplate.style.backgroundColor || selectedTemplate.style.background);
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
      
      setHasInitializedTemplate(true);
    }
  }, [selectedTemplate?.id, hasInitializedTemplate, isEditMode, updateContent, updateDesign, clearBadge]);

  const handleTabChange = useCallback(
    (selectedTabIndex: any) => {
      setSelectedTab(selectedTabIndex);
    },
    []
  );

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Get the latest badge store state right before creating payload
      const { badge } = useBadgeStore.getState();
      

      
      const payload = {
        name: formData.name || name,
        type: componentType,
        design: {
          templates: selectedTemplate ? {
            id: selectedTemplate.id,
            type: selectedTemplate.src ? "image" : "text",
            data: selectedTemplate
          } : null,
          ...badge.design,
          // Merge formData.design to capture latest changes from form
          ...formData.design,
          // Ensure all design properties are included with proper fallbacks
          // Priority: badge.design (most current) > formData.design > defaults
          background: badge.design.background || formData.design?.background || "solid",
          color: badge.design.color || formData.design?.color || "#7700ffff",
          width: badge.design.width || formData.design?.width || 120,
          height: badge.design.height || formData.design?.height || 40,
          fontSize: badge.design.fontSize || formData.design?.fontSize || 14,
          cornerRadius: badge.design.cornerRadius || formData.design?.cornerRadius || 8,
          borderSize: badge.design.borderSize || formData.design?.borderSize || 0,
          borderColor: badge.design.borderColor || formData.design?.borderColor || "#c5c8d1",
          opacity: badge.design.opacity || formData.design?.opacity || 100,
          rotation: badge.design.rotation || formData.design?.rotation || 0,
          size: badge.design.size || formData.design?.size || 36,
          positionX: badge.design.positionX || formData.design?.positionX || 0,
          positionY: badge.design.positionY || formData.design?.positionY || 0,
          gridPosition: badge.design.gridPosition || formData.design?.gridPosition,
          horizontalPosition: badge.design.horizontalPosition || formData.design?.horizontalPosition,
          textAlignment: badge.design.textAlignment || formData.design?.textAlignment,
          isBold: badge.design.isBold || formData.design?.isBold || false,
          isItalic: badge.design.isItalic || formData.design?.isItalic || false,
          isUnderline: badge.design.isUnderline || formData.design?.isUnderline || false,
          spacing: badge.design.spacing || formData.design?.spacing || {
            insideTop: "16",
            insideBottom: "16",
            outsideTop: "20",
            outsideBottom: "20"
          }
        },
        display: {
          // Include all display/rules properties (bgColor moved to settings)
          isScheduled: badge.display.isScheduled || false,
          startDateTime: badge.display.startDateTime || Date.now(),
          endDateTime: badge.display.endDateTime || Date.now(),
          visibility: badge.display.visibility || "all",
          resourceIds: badge.display.resourceIds || [],
          pageDisplay: badge.display.pageDisplay || { 
            product: true, 
            collection: true, 
            home: true, 
            search: true, 
            cart: false 
          },
          specificLinks: badge.display.specificLinks || [],
          languagesMode: badge.display.languagesMode || "all",
          customLanguages: badge.display.customLanguages || [],
          customerCondition: badge.display.customerCondition || "all",
          customerTags: badge.display.customerTags || [],
          priority: badge.display.priority || 0,
          respectProductPriority: badge.display.respectProductPriority !== undefined ? badge.display.respectProductPriority : true,
          ...formData.display
        },
        settings: {
          content: {
            ...badge.content,
            // Ensure we're using the latest content from the badge store
            text: badge.content.text || "",
            contentType: badge.content.contentType || "text",
            icon: badge.content.icon || "",
            iconUploaded: badge.content.iconUploaded || false,
            textColor: badge.content.textColor || "#ffffff",
            font: badge.content.font || "own_theme",
            callToAction: badge.content.callToAction || "noCta",
            subheading: badge.content.subheading || "",
            src: badge.content.src || "",
            alt: badge.content.alt || ""
          },
          placement: {
            position: badge.placement.position || badge.design.gridPosition,
            // Include positioning based on type
            ...(type === "LABEL" ? {
              gridPosition: badge.design.gridPosition
            } : {
              horizontalPosition: badge.design.horizontalPosition,
              textAlignment: badge.design.textAlignment
            })
          },
          // Move bgColor to settings
          bgColor: badge.display.bgColor || "#ffffff",
          ...formData.settings
        },
        status: currentStatus
      };



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
          setIsModalOpen(false);
        }
      }
    } catch (error) {
      console.error(`Error creating ${componentType}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    if (onCancel) {
      onCancel();
    } 
  };

  return (
    <>
    <div style={{zIndex: 99}}>
      <Modal variant="max" open={isModalOpen} onHide={handleCancel}>
        <TitleBar title={`${componentType} Editor`} />
        <Page
          fullWidth
          backAction={{
            content: type === "LABEL" ? "Labels" : "Badges",
            onAction: handleCancel,
          }}
          title={`${name}`}
          titleMetadata={getBadges(currentStatus)}
          subtitle={`${componentType.charAt(0) + componentType.slice(1).toLowerCase()} Editor`}
          primaryAction={{
            content: (isSaving || isLoading) ? "Saving..." : "Save",
            disabled: isSaving || isLoading,
            onAction: handleSave,
            loading: isSaving || isLoading,
          }}
          secondaryActions={[
            {
              content: "Close",
              onAction: handleCancel,
            },
          ]}
        >
        {/* Error Banner inside Page/Modal */}
        {errorMessage && (
          <div style={{ marginBottom: "12px" }}>
            <Banner tone="critical" onDismiss={onClearError}>
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
            {/* Unified tabs for both LABEL and BADGE types */}
            <>
              {/* Design (index 0) */}
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
                Design
              </button>
              {/* Products (index 1) */}
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
                Products
              </button>
              {/* Display (index 2) */}
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
                Display
              </button>
            </>
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
            {/* Unified form structure for both LABEL and BADGE types */}
            <>
              {/* Design tab combines Content + Design for both types */}
              <div
                style={{
                  display: selectedTab === 0 ? "block" : "none",
                }}
              >
                <ContentForm
                  data={isEditMode ? formData.settings || {} : selectedTemplate}
                  onChange={(data) => {
                    setFormData(prev => ({ ...prev, ...data }));
                  }}
                  type={componentType}
                  badgeName={formData.name}
                  setBadgeName={(name) => setFormData(prev => ({ ...prev, name }))}
                />
                <DesignForm
                  data={formData}
                  onChange={(key, value) => {
                    setFormData(prev => ({
                      ...prev, 
                      design: { 
                        ...prev.design, 
                        [key]: value
                      }
                    }));
                  }}
                  selectedTemplate={isEditMode ? formData.design : selectedTemplate}
                  type={componentType}
                />
              </div>
              {/* Products */}
              <div style={{zIndex: 9999999999999999999}}>
              <div style={{ display: selectedTab === 1 ? "block" : "none" , zIndex: 999999999 }}>
                <ProductsForm
                  data={formData}
                  onChange={(data) => {
                    setFormData(prev => ({ 
                      ...prev, 
                      products: data,
                      // Merge any display-related updates from products form
                      display: { ...prev.display, ...data }
                    }));
                  }}
                  type={componentType}
                />
              </div>
              </div>
              {/* Display */}
              <div style={{ display: selectedTab === 2 ? "block" : "none", zIndex: 10}}>
                <DisplayForm
                  data={formData}
                  onChange={(data) => {
                    setFormData(prev => ({ 
                      ...prev, 
                      display: { ...prev.display, ...data }
                    }));
                  }}
                  type={componentType}
                />
              </div>
            </>
          </div>
          <div
            style={{
              position: "sticky",
              top: "1rem", // distance from top while scrolling
              height: "calc(100vh - 2rem)", // keep within viewport height
              overflow: "auto", // scroll inside preview if needed
            }}
          >
            {/* Label Name and Status Controls - Upper Right Side */}
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
                      value={formData.name || name}
                      onChange={(value) => {
                        setName(value);
                        setFormData({ ...formData, name: value });
                      }}
                      placeholder="Deco Label"
                      autoComplete="off"
                    />

                    {/* Status Toggle */}
                    <div style={{ minWidth: "200px" }}>
                      <ButtonGroup variant="segmented">
                        <Button
                          pressed={currentStatus === "ACTIVE"}
                          onClick={() => setCurrentStatus("ACTIVE")}
                        >
                          Active
                        </Button>
                        <Button
                          pressed={currentStatus === "DRAFT"}
                          onClick={() => setCurrentStatus("DRAFT")}
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

            {/* Product Preview */}
            <Card>
              <HtmlPreviewer
                selectedTemplate={selectedTemplate}
                type={componentType}
              />
            </Card>
          </div>
        </div>
      </Page>
    </Modal>
    </div>
  </>
  );
};