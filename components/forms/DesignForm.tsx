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
  ColorPicker,
  Box,
  Checkbox,
  Tooltip,
  Icon,
} from "@shopify/polaris";
import { QuestionCircleIcon } from "@shopify/polaris-icons";
import ColorPickerInput from "../pickers/ColourPicker";
import { useBadgeStore } from "@/stores/BadgeStore";
import LabelGrid from "../LabelGrid";

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
        {/* Template */}
        <BlockStack gap="200">
          <InlineStack gap="100" align="start">
            <Text variant="bodyMd" as="p">
              Quick Start Template
            </Text>
            <TooltipIcon content="Choose a pre-designed template to get started quickly, or select Custom to create your own unique design." />
          </InlineStack>
          <Select
            label="Template"
            labelHidden
            options={templateOptions}
            value={badge.design.template}
            onChange={(value) => handleDesignChange("template", value)}
            helpText="Pre-built designs optimized for conversions. You can customize any template after selection."
          />

          <LabelGrid />
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

        {/* Background type */}
        <BlockStack gap="200">
          <Text as="p" variant="bodyMd" tone="subdued">
            Background Style
          </Text>
          <RadioButton
            label="Single color background (Clean and simple)"
            checked={badge.design.background === "single"}
            id="single"
            name="background"
            onChange={() => handleDesignChange("background", "single")}
            helpText="Perfect for minimal, professional looks"
          />
          <RadioButton
            label="Gradient background (Eye-catching and modern)"
            checked={badge.design.background === "gradient"}
            id="gradient"
            name="background"
            onChange={() => handleDesignChange("background", "gradient")}
            helpText="Creates depth and draws attention"
          />
        </BlockStack>

        {/* Gradient angle */}
        {badge.design.background === "gradient" ? (
          <BlockStack gap="200">
            <InlineStack gap="100" align="start">
              <Text as="p" variant="bodyMd">
                Gradient Direction
              </Text>
              <TooltipIcon content="0° = left to right, 90° = bottom to top, 180° = right to left, 270° = top to bottom" />
            </InlineStack>
            <RangeSlider
              label="Gradient angle"
              min={0}
              max={360}
              value={badge.design.gradientAngle}
              onChange={(value) => {
                if (typeof value === "number") {
                  handleDesignChange("gradientAngle", value);
                }
              }}
              output
              helpText={`${badge.design.gradientAngle}° - Adjust the gradient flow direction`}
            />
            <InlineStack gap="200">
              <Box>
                <InlineStack gap="100" align="start">
                  <Text as="p" variant="bodyMd">
                    Start Color
                  </Text>
                  <TooltipIcon content="The color your gradient starts with" />
                </InlineStack>
                <ColorPickerInput
                  onChange={(value: string) => handleDesignChange("gradient1", value)}
                  value={badge.design.gradient1}
                />
              </Box>
              <Box>
                <InlineStack gap="100" align="start">
                  <Text as="p" variant="bodyMd">
                    End Color
                  </Text>
                  <TooltipIcon content="The color your gradient transitions to" />
                </InlineStack>
                <ColorPickerInput
                  onChange={(value: string) => handleDesignChange("gradient2", value)}
                  value={badge.design.gradient2}
                />
              </Box>
            </InlineStack>
          </BlockStack>
        ) : (
          <Box>
            <InlineStack gap="100" align="start">
              <Text as="p" variant="bodyMd">
                Background Color
              </Text>
              <TooltipIcon content="Choose a color that contrasts well with your text for better readability" />
            </InlineStack>
            <ColorPickerInput
              value={badge.design.color}
              onChange={(value: string) => handleDesignChange("color", value)}
            />
          </Box>
        )}

        {/* Corner radius */}
        <InlineStack gap="200" align="start">
          <div style={{ maxWidth: "120px" }}>
            <InlineStack gap="100" align="start" blockAlign="start">
              <Text as="p" variant="bodyMd">
                Roundness
              </Text>
              <TooltipIcon content="Higher values create more rounded corners. 0px = sharp corners, 20px+ = very rounded" />
            </InlineStack>
            <TextField
              label="Corner radius"
              labelHidden
              type="number"
              suffix="px"
              value={badge.design.cornerRadius.toString()}
              onChange={(value) =>
                handleDesignChange("cornerRadius", parseInt(value) || 8)
              }
              autoComplete=""
            />
          </div>
        </InlineStack>

        {/* Border */}
        <InlineStack gap="100" align="start">
          <Text as="p" variant="bodyMd">
            Border Settings
          </Text>
          <TooltipIcon content="Add a border to make your badge stand out more against product images" />
        </InlineStack>
        <InlineStack gap="200" align="start" direction={"row"} wrap={false}>
          <TextField
            label="Border thickness"
            type="number"
            suffix="px"
            value={badge.design.borderSize.toString()}
            onChange={(value) =>
              handleDesignChange("borderSize", parseInt(value) || 0)
            }
            autoComplete=""
            helpText="0px = no border"
          />
          <ColorPickerInput
            label="Border color"
            onChange={(value: string) => handleDesignChange("borderColor", value)}
            value={badge.design.borderColor}
          />
        </InlineStack>

        {/* Spacing */}
        <BlockStack gap="200">
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
            {/* <Box paddingBlockStart={"600"}> */}
            <TextField
              label="Bottom padding"
              type="number"
              suffix="px"
              value={badge.design.spacing.insideBottom}
              onChange={(val) => updateSpacing("insideBottom", val)}
              autoComplete=""
              helpText="Space below content"
            />
            {/* </Box> */}
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
        </BlockStack>

        <Bleed marginInline="400">
          <Divider />
        </Bleed>

        <BlockStack gap="400">
          <InlineStack gap="100" align="start">
            <Text variant="headingMd" as={"h3"}>
              Icon Styling
            </Text>
            <TooltipIcon content="Customize how icons appear in your badges - size, colors, and layout options" />
          </InlineStack>

          {/* Icon size + Icon color */}
          <InlineStack gap="400">
            <TextField
              label="Icon size (pixels)"
              type="number"
              suffix="px"
              value={badge.display.iconSize}
              onChange={(value) => updateDisplay("iconSize", value)}
              autoComplete="off"
              helpText="Recommended: 16-32px"
            />{" "}
          </InlineStack>

          {/* Background color */}
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
              value={badge.display.bgColor}
            />
          </Box>

          {/* Corner radius */}
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

          {/* Row display */}
          {/* <BlockStack gap="200">
            <InlineStack gap="100" align="start">
              <Text as="h4" variant="bodyMd">
                Icons Per Row
              </Text>
              <TooltipIcon content="Control how many icons display horizontally. 'Auto' adapts based on available space." />
            </InlineStack>
            <InlineStack gap="400">
              <Select
                label="Desktop (how many icons per row)"
                options={rowOptions}
                value={badge.display.desktopRow}
                onChange={(value) => updateDisplay("desktopRow", value)}
                helpText="For larger screens"
              />
              <Select
                label="Mobile (how many icons per row)"
                options={rowOptions}
                value={badge.display.mobileRow}
                onChange={(value) => updateDisplay("mobileRow", value)}
                helpText="For phones and tablets"
              />
            </InlineStack>
          </BlockStack> */}

          <Bleed marginInline="400">
            <Divider />
          </Bleed>
        </BlockStack>

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
      </BlockStack>
    </Card>
  );
}
