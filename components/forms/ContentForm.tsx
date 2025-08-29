import {
  Card,
  BlockStack,
  TextField,
  Bleed,
  Divider,
  Thumbnail,
  Button,
  Select,
  Text,
  Badge,
  RadioButton,
  InlineStack,
  Box,
  DropZone,
  LegacyStack,
  Tooltip,
  Icon,
} from "@shopify/polaris";
import { QuestionCircleIcon } from "@shopify/polaris-icons";
import { useCallback, useState, useEffect } from "react";
import { useBadgeStore, GridPosition } from "@/stores/BadgeStore";
import TemplateGalleryModal from "../TemplateGalleryModal";
import ColorPickerInput from "../pickers/ColourPicker";
import PositionGrid from "../PositionGrid";
import React from "react";

interface ContentFormProps {
  data?: any;
  onChange?: (data: any) => void;
  type?: string;
  badgeName?: string;
  setBadgeName?: (name: string) => void;
}

const ContentForm = ({ data, onChange, type = "BADGE", badgeName, setBadgeName }: ContentFormProps) => {
  const { badge, updateContent, updateDesign } = useBadgeStore();

  const TooltipIcon = ({ content }) => (
    <Tooltip content={content}>
      <Icon source={QuestionCircleIcon} tone="subdued" />
    </Tooltip>
  );
  
  // Local state for form fields
  const [localName, setLocalName] = useState("");
  const [localText, setLocalText] = useState("");
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  // Initialize local state from props/data and auto-detect content type
  useEffect(() => {
    if (data) {
      const initialName = badgeName || 
        data?.name || 
        (data?.text ? `${data.text} ${type.toLowerCase()}` : "") ||
        (data?.alt ? `${data.alt} ${type.toLowerCase()}` : "") ||
        `New ${type.toLowerCase()}`;
      
      setLocalName(initialName);
      setLocalText(data?.text || badge.content.text || "");

      // Set selected template if data has template info
      if (data?.text && data?.style) {
        setSelectedTemplate(data);
      }

      // Auto-detect content type based on template
      if (data?.src) {
        // If template has src, it's an image
        updateContent("contentType", "image");
        updateContent("icon", data.src);
        updateContent("iconUploaded", true);
      } else if (data?.text) {
        // If template has text, it's a text template
        updateContent("contentType", "text");
        updateContent("text", data.text);
      } else {
        // Default to text if no clear type
        updateContent("contentType", "text");
      }
    }
  }, [data?.id, data?.text, data?.alt, data?.src, badgeName, type, updateContent]); // Only trigger when template actually changes

  // Sync local text state with badge store (avoid infinite loops)
  useEffect(() => {
    if (badge.content.text && badge.content.text !== localText) {
      setLocalText(badge.content.text);
    }
  }, [badge.content.text]); // Sync when badge store text changes

  // Local state for form elements not directly related to badge data

  const handleBadgeChange = useCallback(
    (newValue: string) => {
      setLocalName(newValue);
      if (setBadgeName) {
        setBadgeName(newValue);
      }
      if (onChange) {
        onChange({ name: newValue });
      }
    },
    [setBadgeName, onChange]
  );

  const handleTextChange = useCallback(
    (newValue: string) => {
      setLocalText(newValue);
      updateContent("text", newValue);
      if (onChange) {
        onChange({ text: newValue });
      }
    },
    [updateContent, onChange]
  );

  const handleContentChange = useCallback(
    (field: keyof import('@/stores/BadgeStore').BadgeContent, value: any) => {
      updateContent(field, value);
      if (onChange) {
        onChange({ [field]: value });
      }
    },
    [updateContent, onChange]
  );

  const handleContentTypeChange = useCallback(
    (contentType: "text" | "image") => {
      updateContent("contentType", contentType);
      if (onChange) {
        onChange({ contentType });
      }
    },
    [updateContent, onChange]
  );

  const handleTemplateSelect = useCallback(
    (template: any) => {
      if (template.src) {
        // Image template
        updateContent("icon", template.src);
        updateContent("iconUploaded", true);
        updateContent("contentType", "image");
        if (onChange) {
          onChange({ 
            icon: template.src, 
            iconUploaded: true, 
            contentType: "image" 
          });
        }
      } else if (template.text) {
        // Text template
        updateContent("text", template.text);
        updateContent("contentType", "text");
        setLocalText(template.text);
        setSelectedTemplate(template); // Store the selected template for preview
        
        // Apply template styling if available
        if (template.style) {
          if (template.style.background) {
            updateDesign("color", template.style.background);
          }
          if (template.style.borderRadius) {
            const radius = typeof template.style.borderRadius === 'string' 
              ? parseInt(template.style.borderRadius.replace('px', '')) 
              : parseInt(template.style.borderRadius);
            updateDesign("cornerRadius", radius || 0);
          }
          if (template.style.clipPath) {
            updateDesign("shape", `clip-path: ${template.style.clipPath}`);
          }
        }
        
        // Force update the form data to ensure parent component knows about the change
        if (onChange) {
          onChange({ 
            text: template.text,
            contentType: "text",
            template: template
          });
        }
        

      }
    },
    [updateContent, updateDesign, onChange, setLocalText]
  );

  const handleRemoveIcon = useCallback(() => {
    updateContent("icon", "");
    updateContent("iconUploaded", false);
    if (onChange) {
      onChange({ icon: "", iconUploaded: false });
    }
  }, [updateContent, onChange]);

  const handleUploadIcon = useCallback(() => {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
    fileInput.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        // Create a local URL for the uploaded file
        const imageUrl = URL.createObjectURL(file);
        updateContent("icon", imageUrl);
        updateContent("iconUploaded", true);
        updateContent("contentType", "image");
        if (onChange) {
          onChange({ 
            icon: imageUrl, 
            iconUploaded: true, 
            contentType: "image" 
          });
        }
      }
    };
    
    // Trigger the file input
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  }, [updateContent, onChange]);

  const ctaOptions = [
    { label: "No call to action", value: "noCta" },
    { label: "Shop now", value: "shopNow" },
    { label: "Learn more", value: "learnMore" },
  ];

  return (
    <>
    <Card>
      {/* <BlockStack>
        <TextField
          label={`${type.charAt(0) + type.slice(1).toLowerCase()} name`}
          value={localName}
          onChange={handleBadgeChange}
          placeholder={`Your ${type.toLowerCase()}`}
          autoComplete="off"
          helpText={
            <Text variant="bodySm" tone="subdued" as="p">
              Only visible to you. For your own internal reference.
            </Text>
          }
        />
        <div
          style={{
            marginTop: "10px",
          }}
        ></div>
        <Bleed marginInline="400">
          <Divider />
        </Bleed>
      </BlockStack> */}
      <div style={{ margin: "10px" }}></div>
      <BlockStack gap={"400"}>
       

        {/* Conditional Content Based on Type */}
        {badge.content.contentType === "text" ? (
          // Text Content
          <BlockStack gap="200">
            <Text as="p" variant="bodyMd">
              Text Content
            </Text>
            
            {/* Show selected template preview if any */}
            {((data && data.text && data.style) || (selectedTemplate && selectedTemplate.text && selectedTemplate.style)) && (
              <Box>
                
                <div
                  style={{
                    ...(selectedTemplate?.style || data?.style),
                    padding: "8px 12px",
                    borderRadius: (selectedTemplate?.style?.borderRadius || data?.style?.borderRadius) || "4px",
                    display: "inline-block",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    marginBottom: "8px"
                  }}
                >
                  {selectedTemplate?.text || data?.text}
                </div>
                
                {/* Remove template button */}
                
              </Box>
            )}

            <InlineStack gap="200">
              <Button
                onClick={() => {
                  setIsTemplateModalOpen(true);
                }}
                variant="secondary"
                fullWidth
              >
                Choose from library
              </Button>
             
            </InlineStack>

            <TextField
              label="Title"
              value={localText}
              onChange={handleTextChange}
              autoComplete="off"
              helpText="Enter the text to display on your badge"
            />

          </BlockStack>
        ) : (
          // Image Content
          <BlockStack gap="200">
            <Text as="p" variant="bodyMd">
              Choose Image
            </Text>
            
            {badge.content.iconUploaded && (
              <Box>
                <Thumbnail
                  source={badge.content.icon || ""}
                  alt="Selected image"
                  size="large"
                />
              </Box>
            )}

            <InlineStack gap="200">
              <Button
                onClick={() => {
                  setIsTemplateModalOpen(true);
                }}
                variant="secondary"
                fullWidth
              >
                Choose from library
              </Button>
              <Button
                onClick={handleUploadIcon}
                fullWidth
              >
                Upload image
              </Button>
            </InlineStack>

            {badge.content.iconUploaded && (
              <Button
                onClick={handleRemoveIcon}
                variant="secondary"
                tone="critical"
                fullWidth
              >
                Remove image
              </Button>
            )}


          </BlockStack>
        )}

      
        <Text as="p" variant="bodySm" tone="subdued">
          Available with Starter plan.{" "}
          <a href="#" style={{ color: "blue" }}>
            Upgrade now.
          </a>
        </Text>
        <Bleed marginInline="400">
          <Divider />
        </Bleed>
      </BlockStack>
      <div style={{ margin: "10px" }}></div>
      <div style={{ margin: "10px" }}></div>
      <div
        style={{
          marginTop: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <Text as="p" variant="headingSm">
            Translations
          </Text>
          <Badge tone="info">Essential plan</Badge>
        </div>
        <Button fullWidth>Add translation</Button>
        <Bleed marginInline="400">
          <Divider />
        </Bleed>
      </div>

      {/* Position Control */}
      <div style={{ margin: "10px" }}></div>
      <BlockStack gap="400">
        <InlineStack gap="100" align="start">
          <Text variant="headingMd" as={"h3"}>
            Position
          </Text>
          <TooltipIcon content="Choose where to position your badge on the product image" />
        </InlineStack>

        <BlockStack gap="200">
          <Text as="p" variant="bodyMd" tone="subdued">
            Choose badge position
          </Text>
          
          <Box>
            <PositionGrid
              selectedPosition={badge.design.gridPosition || GridPosition.TOP_LEFT}
              onPositionChange={(position) => updateDesign("gridPosition", position)}
            />
            <Text as="p" variant="bodySm" tone="subdued">
              Click to select badge position
            </Text>
          </Box>
        </BlockStack>

        <Bleed marginInline="400">
          <Divider />
        </Bleed>
      </BlockStack>

      <Button fullWidth>Continue to design</Button>
    </Card>

    <TemplateGalleryModal
      isOpen={isTemplateModalOpen}
      onClose={() => setIsTemplateModalOpen(false)}
      onSelect={handleTemplateSelect}
      templateType={badge.content.contentType === "text" ? "text" : "image"}
    />
    </>
  );
};

export default ContentForm;
