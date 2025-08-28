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
} from "@shopify/polaris";
import { useCallback, useState, useEffect } from "react";
import { useBadgeStore } from "@/stores/BadgeStore";
import TemplateGalleryModal from "../TemplateGalleryModal";
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
  
  // Local state for form fields
  const [localName, setLocalName] = useState("");
  const [localText, setLocalText] = useState("");
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

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
    },
    [updateContent, onChange]
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
      <BlockStack>
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
      </BlockStack>
      <div style={{ margin: "10px" }}></div>
      <BlockStack gap={"400"}>
        {/* Content Type Switcher */}
        <InlineStack gap="200">
          <Button
            pressed={badge.content.contentType === "text"}
            onClick={() => handleContentTypeChange("text")}
            variant={badge.content.contentType === "text" ? "primary" : "secondary"}
          >
            Text Badge
          </Button>
          <Button
            pressed={badge.content.contentType === "image"}
            onClick={() => handleContentTypeChange("image")}
            variant={badge.content.contentType === "image" ? "primary" : "secondary"}
          >
            Image Badge
          </Button>
        </InlineStack>

        {/* Conditional Content Based on Type */}
        {badge.content.contentType === "text" ? (
          // Text Content
          <TextField
            label="Title"
            value={localText}
            onChange={handleTextChange}
            autoComplete="off"
            helpText="Enter the text to display on your badge"
          />
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
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
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

            {/* Size Control */}
            <BlockStack gap="200">
              <Text as="p" variant="bodyMd">
                Size
              </Text>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={badge.design.size || 36}
                    onChange={(e) => updateDesign("size", parseInt(e.target.value))}
                    style={{ width: "100%" }}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <TextField
                    label=""
                    labelHidden
                    value={(badge.design.size || 36).toString()}
                    onChange={(value) => updateDesign("size", parseInt(value) || 36)}
                    type="number"
                    autoComplete="off"
                  />
                  <Text as="span" variant="bodyMd">px</Text>
                </div>
              </div>
            </BlockStack>
          </BlockStack>
        )}

        {/* <Select
          label="Call to action"
          options={ctaOptions}
          value={badge.content.callToAction || "noCta"}
          onChange={(value) => updateContent("callToAction", value)}
        /> */}

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
      <Button fullWidth>Continue to design</Button>
    </Card>

    <TemplateGalleryModal
      isOpen={isTemplateModalOpen}
      onClose={() => setIsTemplateModalOpen(false)}
      onSelect={handleTemplateSelect}
    />
    </>
  );
};

export default ContentForm;
