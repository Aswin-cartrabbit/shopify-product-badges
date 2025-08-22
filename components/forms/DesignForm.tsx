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
} from "@shopify/polaris";
import { useState } from "react";
import ColorPickerInput from "../pickers/ColourPicker";
import { label } from "next-api-middleware";

export default function DesignForm() {
  const [template, setTemplate] = useState("Black and Yellow");
  const [background, setBackground] = useState("gradient");
  const [gradientAngle, setGradientAngle] = useState(0);
  const [cornerRadius, setCornerRadius] = useState("8");
  const [borderSize, setBorderSize] = useState("0");
  const [borderColor, setBorderColor] = useState("#c5c8d1");
  const [color, setColor] = useState({
    hue: 300,
    brightness: 1,
    saturation: 0.7,
    alpha: 0.7,
  });
  const [gradient1, setGradient1] = useState("#DDDDDD");
  const [gradient2, setGradient2] = useState("#FFFFFF");

  const [spacing, setSpacing] = useState({
    insideTop: "16",
    insideBottom: "16",
    outsideTop: "20",
    outsideBottom: "20",
  });

  const templateOptions = [
    { label: "Black and Yellow", value: "Black and Yellow" },
    { label: "Blue and White", value: "Blue and White" },
    { label: "Custom", value: "Custom" },
  ];
  const [iconSize, setIconSize] = useState("32");
  const [iconColor, setIconColor] = useState("#ffffff");
  const [useOriginal, setUseOriginal] = useState(false);
  const [bgColor, setBgColor] = useState("#000000");
  const [desktopRow, setDesktopRow] = useState("auto");
  const [mobileRow, setMobileRow] = useState("auto");

  const rowOptions = [
    { label: "Auto", value: "auto" },
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
  ];
  const fontOptions = [
    {
      label: "Use your theme fonts",
      value: "own_theme",
    },
    {
      label: "Helvetica",
      value: "helvetica",
    },
    {
      label: "Arial",
      value: "arial",
    },
    {
      label: "Tahoma",
      value: "tahoma",
    },
    {
      label: "Trebuchet MS",
      value: "trebuchet_ms",
    },
    {
      label: "Georgia",
      value: "georgia",
    },
    {
      label: "Garamond",
      value: "garamond",
    },
    {
      label: "Courier New",
      value: "courier_new",
    },
  ];
  return (
    <Card>
      <BlockStack gap="400">
        {/* Template */}
        <Select
          label="Template"
          options={templateOptions}
          value={template}
          onChange={setTemplate}
        />
        <Bleed marginInline="400">
          <Divider />
        </Bleed>
        <Text variant="headingSm" as="h2">
          Card
        </Text>
        {/* Background type */}
        <BlockStack gap="200">
          <RadioButton
            label="Single color background"
            checked={background === "single"}
            id="single"
            name="background"
            onChange={() => setBackground("single")}
          />
          <RadioButton
            label="Gradient background"
            checked={background === "gradient"}
            id="gradient"
            name="background"
            onChange={() => setBackground("gradient")}
          />
        </BlockStack>

        {/* Gradient angle */}
        {background === "gradient" ? (
          <BlockStack gap="200">
            <RangeSlider
              label="Gradient angle"
              min={0}
              max={360}
              value={gradientAngle}
              onChange={() => {}}
              output
            />
            <InlineStack gap="200">
              <ColorPickerInput />
              <ColorPickerInput />
            </InlineStack>
          </BlockStack>
        ) : (
          <ColorPickerInput />
        )}

        {/* Corner radius */}
        <div style={{ maxWidth: "100px" }}>
          <TextField
            label="Corner radius"
            type="number"
            suffix="px"
            value={cornerRadius}
            onChange={setCornerRadius}
            autoComplete=""
          />
        </div>

        {/* Border */}
        <InlineStack
          gap="200"
          align="space-between"
          direction={"row"}
          wrap={false}
        >
          <TextField
            label="Border size"
            type="number"
            suffix="px"
            value={borderSize}
            onChange={setBorderSize}
            autoComplete=""
          />
          <ColorPickerInput label="Border color" />
        </InlineStack>

        {/* Spacing */}
        <BlockStack gap="200">
          <InlineStack gap="200" wrap={false} align="center" direction={"row"}>
            <TextField
              label="Spacing"
              type="number"
              suffix="px"
              value={spacing.insideTop}
              autoComplete=""
              onChange={(val) => setSpacing({ ...spacing, insideTop: val })}
              helpText={<span>Inside top</span>}
            />
            <Box paddingBlockStart={"600"}>
              <TextField
                label=""
                type="number"
                suffix="px"
                value={spacing.insideBottom}
                onChange={(val) =>
                  setSpacing({ ...spacing, insideBottom: val })
                }
                autoComplete=""
                helpText={<span>Inside bottom</span>}
              />
            </Box>
          </InlineStack>
          <InlineStack gap="200" wrap={false}>
            <TextField
              label=""
              type="number"
              suffix="px"
              value={spacing.outsideTop}
              onChange={(val) => setSpacing({ ...spacing, outsideTop: val })}
              autoComplete=""
              helpText={<span>Outside top</span>}
            />
            <TextField
              label=""
              type="number"
              suffix="px"
              value={spacing.outsideBottom}
              onChange={(val) => setSpacing({ ...spacing, outsideBottom: val })}
              autoComplete=""
              helpText={<span>Outside bottom</span>}
            />
          </InlineStack>
        </BlockStack>
        <Bleed marginInline="400">
          <Divider />
        </Bleed>
        <BlockStack gap="400">
          <Text variant="headingMd" as={"dd"}>
            Icon
          </Text>

          {/* Icon size + Icon color */}
          <InlineStack gap="400">
            <TextField
              label="Icon size"
              type="number"
              suffix="px"
              value={iconSize}
              onChange={setIconSize}
              autoComplete="off"
            />
            <TextField
              label="Icon color"
              value={iconColor}
              onChange={setIconColor}
              autoComplete="off"
            />
          </InlineStack>

          <Checkbox
            label="Use original icon color"
            checked={useOriginal}
            onChange={setUseOriginal}
          />

          {/* Background color */}
          <ColorPickerInput label="Background color" />

          {/* Corner radius */}
          <Box maxWidth="100px">
            <TextField
              label="Corner radius"
              type="number"
              suffix="px"
              value={cornerRadius}
              onChange={setCornerRadius}
              autoComplete="off"
            />
          </Box>

          {/* Row display */}
          <BlockStack gap="200">
            <Text as="h4" variant="bodyMd">
              Icons displayed in one row
            </Text>
            <InlineStack gap="400">
              <Select
                label="Desktop"
                labelHidden
                options={rowOptions}
                value={desktopRow}
                onChange={setDesktopRow}
              />
              <Select
                label="Mobile"
                labelHidden
                options={rowOptions}
                value={mobileRow}
                onChange={setMobileRow}
              />
            </InlineStack>
          </BlockStack>
          <Bleed marginInline="400">
            <Divider />
          </Bleed>
        </BlockStack>
        <BlockStack gap="400">
          <Text variant="headingMd" as={"dd"}>
            Typography
          </Text>

          <Select
            label="Font"
            labelHidden
            options={fontOptions}
            value={mobileRow}
            onChange={setMobileRow}
            helpText={
              <Text as="p" variant="bodySm">
                Theme fonts are not available in the preview mode. Publish timer
                to preview it in store.
              </Text>
            }
          />
          <Bleed marginInline="400">
            <Divider />
          </Bleed>
        </BlockStack>
      </BlockStack>
    </Card>
  );
}
