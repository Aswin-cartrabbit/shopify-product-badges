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
import { useState } from "react";

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
      label: "Arial (ClassNclassNameic and readable)",
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

  const TooltipIcon = ({ content }) => (
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
              <Text as="p" variant="bodyMd" tone="subdued">
                Background Color
              </Text>
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

            {/* Text Color Control - Only for text badges */}
            

            {/* Spacing */}
            {/* <BlockStack gap="200">
              <InlineStack gap="100" align="start">
                <Text as="p" variant="bodyMd">
                  Spacing & Padding
                </Text>
                <TooltipIcon content="Inside spacing controls padding within the badge. Outside spacing controls distance from other elements." />
              </InlineStack>

              <InlineStack gap="200" wrap={false} align="center" direction={"row"}>
                <TextField
                  label="Top padding"
                  type="number"
                  suffix="px"
                  value={badge.design.spacing.insideTop}
                  autoComplete=""
                  onChange={(val) => updateSpacing("insideTop", val)}
                  helpText="Space above content"
                />
                <TextField
                  label="Bottom padding"
                  type="number"
                  suffix="px"
                  value={badge.design.spacing.insideBottom}
                  onChange={(val) => updateSpacing("insideBottom", val)}
                  autoComplete=""
                  helpText="Space below content"
                />
              </InlineStack>

              <InlineStack gap="200" wrap={false}>
                <TextField
                  label="Top margin"
                  type="number"
                  suffix="px"
                  value={badge.design.spacing.outsideTop}
                  onChange={(val) => updateSpacing("outsideTop", val)}
                  autoComplete=""
                  helpText="Distance from elements above"
                />
                <TextField
                  label="Bottom margin"
                  type="number"
                  suffix="px"
                  value={badge.design.spacing.outsideBottom}
                  onChange={(val) => updateSpacing("outsideBottom", val)}
                  autoComplete=""
                  helpText="Distance from elements below"
                />
              </InlineStack>
            </BlockStack> */}

            <Bleed marginInline="400">
              <Divider />
            </Bleed>

            {/* <BlockStack gap="400">
              <InlineStack gap="100" align="start">
                <Text variant="headingMd" as={"h3"}>
                  Icon Styling
                </Text>
                <TooltipIcon content="Customize how icons appear in your badges - size, colors, and layout options" />
              </InlineStack>

              <InlineStack gap="400">
                <TextField
                  label="Icon size (pixels)"
                  type="number"
                  suffix="px"
                  autoComplete="off"
                  helpText="Recommended: 16-32px"
                />{" "}
              </InlineStack>

              <Box>
                <InlineStack gap="100" align="start">
                  <Text as="p" variant="bodyMd">
                    Icon Background Color
                  </Text>
                  <TooltipIcon content="Add a background color behind icons for better visibility" />
                </InlineStack>
                <ColorPickerInput
                  label=""
                  onChange={(value: string) => updateDisplay("bgColor", value)}
                  value={badge.display.bgColor || "#ffffff"}
                />
              </Box>

              <Box maxWidth="200px">
                <InlineStack gap="100" align="start">
                  <Text as="p" variant="bodyMd">
                    Icon Corner
                  </Text>
                  <TooltipIcon content="Make icon backgrounds more or less rounded" />
                </InlineStack>
                <Box maxWidth="120px">
                  <TextField
                    label="Corner radius"
                    labelHidden
                    type="number"
                    suffix="px"
                    value={badge.design.cornerRadius.toString()}
                    onChange={(value) =>
                      handleDesignChange("cornerRadius", parseInt(value) || 8)
                    }
                    autoComplete="off"
                  />
                </Box>
              </Box>

              <Bleed marginInline="400">
                <Divider />
              </Bleed>
            </BlockStack> */}
          </>
        )}

        {/* Conditional sections based on content type */}
        {badge.content.contentType === "image" && (
          <BlockStack gap="400">
            <InlineStack gap="100" align="start">
              <Text variant="headingMd" as={"h3"}>
                Image Controls
              </Text>
              <TooltipIcon content="Fine-tune your image badge appearance with these controls" />
            </InlineStack>

            {/* Opacity Control */}
            <BlockStack gap="200">
              <InlineStack gap="100" align="start">
                <Text as="p" variant="bodyMd">
                  Opacity
                </Text>
                <TooltipIcon content="Control the transparency of your badge image" />
              </InlineStack>
              <RangeSlider
                label="Opacity"
                min={0}
                max={100}
                value={badge.design.opacity || 100}
                onChange={(value) => {
                  if (typeof value === "number") {
                    handleDesignChange("opacity", value);
                  }
                }}
                output
                helpText={`${badge.design.opacity || 100}% - Adjust image transparency`}
              />
            </BlockStack>

            {/* Rotation Control */}
            <BlockStack gap="200">
              <InlineStack gap="100" align="start">
                <Text as="p" variant="bodyMd">
                  Rotation
                </Text>
                <TooltipIcon content="Rotate your badge image (in degrees)" />
              </InlineStack>
              <RangeSlider
                label="Rotation"
                min={-180}
                max={180}
                value={badge.design.rotation || 0}
                onChange={(value) => {
                  if (typeof value === "number") {
                    handleDesignChange("rotation", value);
                  }
                }}
                output
                helpText={`${badge.design.rotation || 0}° - Rotate the image`}
              />
            </BlockStack>

            <Bleed marginInline="400">
              <Divider />
            </Bleed>
          </BlockStack>
        )}



        {badge.content.contentType === "text" && (
          <BlockStack gap="400">
            <InlineStack gap="100" align="start">
              <Text variant="headingMd" as={"h3"}>
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
