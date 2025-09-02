import {
  Bleed,
  BlockStack,
  Card,
  Divider,
  InlineStack,
  RadioButton,
  RangeSlider,
  Select,
  TextField,
  Text,
  Checkbox,
  Tooltip,
  Icon,
} from "@shopify/polaris";
import { QuestionCircleIcon } from "@shopify/polaris-icons";
import ColorPickerInput from "../pickers/ColourPicker";
import { useBadgeStore, GridPosition } from "@/stores/BadgeStore";
import LabelGrid from "../LabelGrid";
import PositionGrid from "../PositionGrid";
import { useState, useCallback } from "react";

interface DesignFormProps {
  data?: any;
  onChange?: (data: any) => void;
  selectedTemplate?: any;
  type?: string;
}

export default function DesignForm({ data, onChange, selectedTemplate, type }: DesignFormProps) {
  const {
    badge,
    updateContent,
    updateDesign,
    updatePlacement,
    updateDisplay,
    updateSpacing,
  } = useBadgeStore();

  const [showImageControls, setShowImageControls] = useState(false);
  const [showOpacityControl, setShowOpacityControl] = useState(false);
  const [showRotationControl, setShowRotationControl] = useState(false);

  const handleShowImageControlsChange = useCallback(
    (newChecked: boolean) => setShowImageControls(newChecked),
    [],
  );

  const handleShowOpacityControlChange = useCallback(
    (newChecked: boolean) => setShowOpacityControl(newChecked),
    [],
  );

  const handleShowRotationControlChange = useCallback(
    (newChecked: boolean) => setShowRotationControl(newChecked),
    [],
  );

  // Enhanced updateDesign with onChange notification
  const handleDesignChange = (key: any, value: any) => {
    updateDesign(key, value);
    if (onChange) {
      onChange({ [key]: value });
    }
  };

  const templateOptions = [
    {
      label: "Black and Yellow (High contrast, great for sales)",
      value: "Black and Yellow",
    },
    {
      label: "Blue and White (Professional, trustworthy look)",
      value: "Blue and White",
    },
    { label: "Custom (Create your own unique design)", value: "Custom" },
  ];

  const rowOptions = [
    { label: "Auto (Recommended)", value: "auto" },
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
  ];

  const fontOptions = [
    {
      label: "Use your theme fonts (Matches your store design)",
      value: "own_theme",
    },
    {
      label: "Helvetica (Clean and modern)",
      value: "helvetica",
    },
    {
      label: "Arial (Classic and readable)",
      value: "arial",
    },
    {
      label: "Tahoma (Bold and clear)",
      value: "tahoma",
    },
    {
      label: "Trebuchet MS (Friendly and approachable)",
      value: "trebuchet_ms",
    },
    {
      label: "Georgia (Elegant serif)",
      value: "georgia",
    },
    {
      label: "Garamond (Sophisticated serif)",
      value: "garamond",
    },
    {
      label: "Courier New (Typewriter style)",
      value: "courier_new",
    },
  ];

  // Fixed TooltipIcon component
  const TooltipIcon = ({ content }: { content: string }) => (
    <Tooltip content={content}>
      <Icon source={QuestionCircleIcon} tone="subdued" />
    </Tooltip>
  );

  return (
    <Card>
      <BlockStack gap="400">
        {/* Show template/background controls only for text badges */}
        {badge.content.contentType === "text" && (
          <>
            {/* Template */}
            <BlockStack gap="200">
              <LabelGrid />
            </BlockStack>

            <Bleed marginInline="400">
              <Divider />
            </Bleed>

            {/* Size Controls */}
            <BlockStack gap="400">
              <InlineStack gap="100" align="start">
                <Text as="p" variant="bodyMd">
                  Badge Dimensions
                </Text>
                <TooltipIcon content="Adjust the size and dimensions of your badge" />
              </InlineStack>
              
              {/* Text Size */}
              <BlockStack gap="200">
                <RangeSlider
                  label="Text Size"
                  min={8}
                  max={48}
                  value={badge.design.fontSize || 14}
                  onChange={(value) => {
                    if (typeof value === "number") {
                      handleDesignChange("fontSize", value);
                    }
                  }}
                  output
                  suffix="px"
                />
              </BlockStack>

              {/* Badge Width */}
              <BlockStack gap="200">
                <RangeSlider
                  label="Badge Width"
                  min={50}
                  max={300}
                  value={badge.design.width || 120}
                  onChange={(value) => {
                    if (typeof value === "number") {
                      handleDesignChange("width", value);
                    }
                  }}
                  output
                  suffix="px"
                />
              </BlockStack>

              {/* Badge Height */}
              <BlockStack gap="200">
                <RangeSlider
                  label="Badge Height"
                  min={20}
                  max={100}
                  value={badge.design.height || 40}
                  onChange={(value) => {
                    if (typeof value === "number") {
                      handleDesignChange("height", value);
                    }
                  }}
                  output
                  suffix="px"
                />
              </BlockStack>
            </BlockStack>

            <Bleed marginInline="400">
              <Divider />
            </Bleed>

            <InlineStack gap="100" align="start">
              <Text variant="headingSm" as="h2">
                Badge Background
              </Text>
              <TooltipIcon content="Configure how your badge background appears - solid colors work well for minimal designs, gradients add visual appeal." />
            </InlineStack>

            {badge.content.contentType === "text" && (
              <BlockStack gap="200">
                <InlineStack gap="100" align="start">
                  <Text as="p" variant="bodyMd">
                    Text Color
                  </Text>
                  <TooltipIcon content="Choose the color of your text for better readability" />
                </InlineStack>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="color"
                    value={badge.content.textColor || "#ffffff"}
                    onChange={(e) => updateContent("textColor", e.target.value)}
                    style={{
                      width: '40px',
                      height: '40px',
                      border: '1px solid #ccc',
                      borderRadius: '50%',
                      cursor: 'pointer'
                    }}
                  />
                  <Text variant="bodySm" tone="subdued" as="span">
                    {badge.content.textColor || "#ffffff"}
                  </Text>
                </div>
              </BlockStack>
            )}

            {/* Background type */}
            <BlockStack gap="200">
              <InlineStack gap="100" align="start">
                <Text as="p" variant="bodyMd" tone="subdued">
                  Background Color
                </Text>
                <TooltipIcon content="Choose the background color for your badge" />
              </InlineStack>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="color"
                  value={badge.design.color || "#7700ffff"}
                  onChange={(e) => handleDesignChange("color", e.target.value)}
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '1px solid #ccc',
                    borderRadius: '50%',
                    cursor: 'pointer'
                  }}
                />
                <Text variant="bodySm" tone="subdued" as="span">
                  {badge.design.color || "#7700ffff"}
                </Text>
              </div>
            </BlockStack>

            <Bleed marginInline="400">
              <Divider />
            </Bleed>
          </>
        )}

        {/* Image Size Controls - For both badges and labels */}
        <BlockStack gap="400">
          <Checkbox
            label="Image Size"
            checked={showImageControls}
            onChange={handleShowImageControlsChange}
          />
          
          {showImageControls && (
            <RangeSlider
              label=""
              min={20}
              max={200}
              value={badge.design.size || 36}
              onChange={(value) => {
                if (typeof value === "number") {
                  handleDesignChange("size", value);
                }
              }}
              output
              suffix="px"
            />
          )}
        </BlockStack>

        {/* Conditional sections based on content type */}
        {badge.content.contentType === "image" && (
          <BlockStack gap="400">
            <Checkbox
              label="Opacity"
              checked={showOpacityControl}
              onChange={handleShowOpacityControlChange}
            />
            
            {showOpacityControl && (
              <RangeSlider
                label=""
                min={0}
                max={100}
                value={badge.design.opacity || 100}
                onChange={(value) => {
                  if (typeof value === "number") {
                    handleDesignChange("opacity", value);
                  }
                }}
                output
                suffix="%"
              />
            )}

            <Checkbox
              label="Rotation"
              checked={showRotationControl}
              onChange={handleShowRotationControlChange}
            />
            
            {showRotationControl && (
              <RangeSlider
                label=""
                min={-180}
                max={180}
                value={badge.design.rotation || 0}
                onChange={(value) => {
                  if (typeof value === "number") {
                    handleDesignChange("rotation", value);
                  }
                }}
                output
                suffix="°"
              />
            )}

            <Bleed marginInline="400">
              <Divider />
            </Bleed>
          </BlockStack>
        )}

        {badge.content.contentType === "text" && (
          <BlockStack gap="400">
            <InlineStack gap="100" align="start">
              <Text variant="headingMd" as="h3">
                Text Styling
              </Text>
              <TooltipIcon content="Choose fonts that match your brand and are easy to read on all devices" />
            </InlineStack>

            <Select
              label="Font Family"
              options={fontOptions}
              value={badge.content.font}
              onChange={(value) => updateContent("font", value)}
              helpText="Theme fonts will match your store's design perfectly but won't show in preview mode - publish to see the final result in your store."
            />

            <Bleed marginInline="400">
              <Divider />
            </Bleed>
          </BlockStack>
        )}
      </BlockStack>
    </Card>
  );
}