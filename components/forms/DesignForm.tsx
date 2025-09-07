import React, { useState, useCallback } from "react";
import {
  Card,
  BlockStack,
  Text,
  RangeSlider,
  Checkbox,
  ButtonGroup,
  Button,
  Bleed,
  Divider,
  InlineStack,
  Tooltip,
  Icon,
  Select,
} from "@shopify/polaris";
import { QuestionCircleIcon } from "@shopify/polaris-icons";
import LabelGrid from "../LabelGrid";

interface DesignFormProps {
  data: any;
  onChange: (key: string, value: any) => void;
  selectedTemplate?: any;
  type?: string;
}

export const DesignForm: React.FC<DesignFormProps> = ({
  data,
  onChange,
  selectedTemplate,
  type,
}) => {
  const [showImageControls, setShowImageControls] = useState(false);
  const [showOpacityControl, setShowOpacityControl] = useState(false);
  const [showIconSizeControl, setShowIconSizeControl] = useState(true);
  const [showIconSpacingControl, setShowIconSpacingControl] = useState(true);

  const handleDesignChange = useCallback(
    (key: string, value: any) => {
      onChange(key, value);
    },
    [onChange]
  );

  const updateContent = useCallback(
    (key: string, value: any) => {
      onChange(`content.${key}`, value);
    },
    [onChange]
  );

  const handleShowImageControlsChange = useCallback(
    (checked: boolean) => {
      setShowImageControls(checked);
    },
    []
  );

  const handleShowOpacityControlChange = useCallback(
    (checked: boolean) => {
      setShowOpacityControl(checked);
    },
    []
  );

  const handleShowIconSizeControlChange = useCallback(
    (checked: boolean) => {
      setShowIconSizeControl(checked);
    },
    []
  );

  const handleShowIconSpacingControlChange = useCallback(
    (checked: boolean) => {
      setShowIconSpacingControl(checked);
    },
    []
  );

  const badge = {
    content: data.content || {},
    design: data.design || {},
  };

  const fontOptions = [
    {
      label: "Arial (Default)",
      value: "arial",
    },
    {
      label: "Helvetica (Clean)",
      value: "helvetica",
    },
    {
      label: "Times New Roman (Serif)",
      value: "times_new_roman",
    },
    {
      label: "Georgia (Serif)",
      value: "georgia",
    },
    {
      label: "Verdana (Sans-serif)",
      value: "verdana",
    },
    {
      label: "Courier New (Typewriter style)",
      value: "courier_new",
    },
  ];

  const fontWeightOptions = [
    {
      label: "Normal",
      value: "normal",
    },
    {
      label: "Bold",
      value: "bold",
    },
    {
      label: "Lighter",
      value: "lighter",
    },
    {
      label: "Bolder",
      value: "bolder",
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
        {/* Trust Badge Design Controls */}
        {type === "TRUST_BADGE" ? (
          <BlockStack gap="400">
            {/* Layout Options */}
            <BlockStack gap="300">
              <Text as="h3" variant="headingSm">Layout</Text>
              
              <ButtonGroup variant="segmented">
                <Button
                  pressed={badge.content.layout === "horizontal"}
                  onClick={() => updateContent("layout", "horizontal")}
                  size="slim"
                >
                  Horizontal
                </Button>
                <Button
                  pressed={badge.content.layout === "vertical"}
                  onClick={() => updateContent("layout", "vertical")}
                  size="slim"
                >
                  Vertical
                </Button>
              </ButtonGroup>
            </BlockStack>

            <Bleed marginInline="400">
              <Divider />
            </Bleed>

            {/* Icon Size Control */}
            <BlockStack gap="400">
              <Checkbox
                label="Icon Size"
                checked={showIconSizeControl}
                onChange={handleShowIconSizeControlChange}
              />
              
              {showIconSizeControl && (
                <RangeSlider
                  label=""
                  min={20}
                  max={100}
                  value={badge.content.iconSize || 40}
                  onChange={(value) => {
                    if (typeof value === "number") {
                      updateContent("iconSize", value);
                    }
                  }}
                  output
                  suffix="px"
                />
              )}
            </BlockStack>

            {/* Icon Spacing Control */}
            <BlockStack gap="400">
              <Checkbox
                label="Icon Spacing"
                checked={showIconSpacingControl}
                onChange={handleShowIconSpacingControlChange}
              />
              
              {showIconSpacingControl && (
                <RangeSlider
                  label=""
                  min={0}
                  max={50}
                  value={badge.content.spacing || 8}
                  onChange={(value) => {
                    if (typeof value === "number") {
                      updateContent("spacing", value);
                    }
                  }}
                  output
                  suffix="px"
                />
              )}
            </BlockStack>
          </BlockStack>
        ) : (
          <>
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
                      min={0}
                      max={300}
                      value={badge.design.width || 200}
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
                      min={0}
                      max={200}
                      value={badge.design.height || 60}
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

                {/* Background Controls */}
                <BlockStack gap="400">
                  <InlineStack gap="100" align="start">
                    <Text as="p" variant="bodyMd">
                      Background
                    </Text>
                    <TooltipIcon content="Customize the background appearance of your badge" />
                  </InlineStack>
                  
                  <BlockStack gap="200">
                    <RangeSlider
                      label="Background Opacity"
                      min={0}
                      max={100}
                      value={badge.design.backgroundOpacity || 100}
                      onChange={(value) => {
                        if (typeof value === "number") {
                          handleDesignChange("backgroundOpacity", value);
                        }
                      }}
                      output
                      suffix="%"
                    />
                  </BlockStack>

                  <BlockStack gap="200">
                    <RangeSlider
                      label="Border Radius"
                      min={0}
                      max={50}
                      value={badge.design.borderRadius || 0}
                      onChange={(value) => {
                        if (typeof value === "number") {
                          handleDesignChange("borderRadius", value);
                        }
                      }}
                      output
                      suffix="px"
                    />
                  </BlockStack>

                  <BlockStack gap="200">
                    <RangeSlider
                      label="Padding"
                      min={0}
                      max={50}
                      value={badge.design.padding || 16}
                      onChange={(value) => {
                        if (typeof value === "number") {
                          handleDesignChange("padding", value);
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

                {/* Color Controls */}
                <BlockStack gap="400">
                  <InlineStack gap="100" align="start">
                    <Text as="p" variant="bodyMd">
                      Colors
                    </Text>
                    <TooltipIcon content="Customize the colors of your badge" />
                  </InlineStack>
                  
                  <BlockStack gap="200">
                    <InlineStack gap="200" align="start">
                      <Text as="p" variant="bodyMd">
                        Background Color
                      </Text>
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          backgroundColor: badge.design.background || "#7700ffff",
                          border: "1px solid #e1e3e5",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          const color = prompt("Enter background color (hex):", badge.design.background || "#7700ffff");
                          if (color) {
                            handleDesignChange("background", color);
                          }
                        }}
                      />
                    </InlineStack>
                  </BlockStack>

                  <BlockStack gap="200">
                    <InlineStack gap="200" align="start">
                      <Text as="p" variant="bodyMd">
                        Text Color
                      </Text>
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          backgroundColor: badge.design.color || "#7700ffff",
                          border: "1px solid #e1e3e5",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          const color = prompt("Enter text color (hex):", badge.design.color || "#7700ffff");
                          if (color) {
                            handleDesignChange("color", color);
                          }
                        }}
                      />
                    </InlineStack>
                  </BlockStack>
                </BlockStack>

                <Bleed marginInline="400">
                  <Divider />
                </Bleed>

                {/* Font Controls */}
                <BlockStack gap="400">
                  <InlineStack gap="100" align="start">
                    <Text as="p" variant="bodyMd">
                      Font
                    </Text>
                    <TooltipIcon content="Customize the font family and weight of your badge" />
                  </InlineStack>
                  
                  <BlockStack gap="200">
                    <Select
                      label="Font Family"
                      options={fontOptions}
                      value={badge.design.fontFamily || "arial"}
                      onChange={(value) => handleDesignChange("fontFamily", value)}
                    />
                  </BlockStack>

                  <BlockStack gap="200">
                    <Select
                      label="Font Weight"
                      options={fontWeightOptions}
                      value={badge.design.fontWeight || "normal"}
                      onChange={(value) => handleDesignChange("fontWeight", value)}
                    />
                  </BlockStack>
                </BlockStack>

                <Bleed marginInline="400">
                  <Divider />
                </Bleed>

                {/* Color Preview */}
                <BlockStack gap="200">
                  <Text as="p" variant="bodyMd">
                    Color Preview
                  </Text>
                  <div
                    style={{
                      width: "100%",
                      height: "60px",
                      backgroundColor: badge.design.background || "#7700ffff",
                      borderRadius: `${badge.design.borderRadius || 0}px`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: badge.design.color || "#7700ffff",
                      fontFamily: badge.design.fontFamily || "arial",
                      fontWeight: badge.design.fontWeight || "normal",
                      fontSize: `${badge.design.fontSize || 14}px`,
                      padding: `${badge.design.padding || 16}px`,
                    }}
                  >
                     <Text as="p" variant="bodyMd">
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
              </BlockStack>
            )}
          </>
        )}
      </BlockStack>
    </Card>
  );
};