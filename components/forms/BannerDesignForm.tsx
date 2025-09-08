// @ts-nocheck
import {
  BlockStack,
  Card,
  Text,
  RadioButton,
  Checkbox,
  RangeSlider,
  Collapsible,
  Button,
  InlineStack,
  Icon,
} from "@shopify/polaris";
import { useState, useCallback } from "react";
import { QuestionCircleIcon } from "@shopify/polaris-icons";
import ColorPickerInput from "../pickers/ColourPicker";

interface BannerDesignFormProps {
  data?: any;
  onChange?: (data: any) => void;
  bannerType?: string;
}

const BannerDesignForm = ({
  data,
  onChange,
  bannerType,
}: BannerDesignFormProps) => {
  const [showBannerDesign, setShowBannerDesign] = useState(true);
  const [showButton, setShowButton] = useState(false);

  const handlePositionChange = useCallback(
    (checked: boolean, position: string) => {
      if (checked) {
        onChange?.({ position });
      }
    },
    [onChange]
  );

  const handleStickyChange = useCallback(
    (checked: boolean) => {
      onChange?.({ sticky: checked });
    },
    [onChange]
  );

  const handleColorChange = useCallback(
    (colorType: string, color: string) => {
      onChange?.({ [colorType]: color });
    },
    [onChange]
  );

  const handleSliderChange = useCallback((property: string, value: number | [number, number]) => {
    const numericValue = Array.isArray(value) ? value[0] : value;
    onChange?.({ [property]: numericValue });
  }, [onChange]);

  return (
    <BlockStack gap="400">
      {/* Position Section */}
      <Card>
        <BlockStack gap="400">
          <InlineStack gap="200" align="start">
            {/* <Icon source={QuestionCircleIcon} tone="subdued" /> */}
            <Text variant="headingMd" as="h3" tone="base">
              Position
            </Text>
          </InlineStack>

          <BlockStack gap="300">
            <RadioButton
              label="Top"
              checked={data?.design?.position === "top"}
              id="position_top"
              name="banner_position"
              onChange={(checked) => handlePositionChange(checked, "top")}
            />
            <RadioButton
              label="Bottom"
              checked={data?.design?.position === "bottom"}
              id="position_bottom"
              name="banner_position"
              onChange={(checked) => handlePositionChange(checked, "bottom")}
            />
            {/* <RadioButton
              label="Other position (Add block)"
              checked={data?.design?.position === "other"}
              id="position_other"
              name="banner_position"
              onChange={(checked) => handlePositionChange(checked, "other")}
            />

            <Checkbox
              label={
                <BlockStack gap="100">
                  <Text as="span">Sticky banner</Text>
                  <Text as="span" variant="bodySm" tone="subdued">
                    Customer will see banner while scrolling
                  </Text>
                </BlockStack>
              }
              checked={data?.design?.sticky || false}
              onChange={handleStickyChange}
            /> */}
          </BlockStack>
        </BlockStack>
      </Card>

      {/* Banner Design Section */}
      <Card>
        <BlockStack gap="400">
          {/* <Button
            variant="plain"
            textAlign="left"
            icon={showBannerDesign ? "chevron-down" : "chevron-right"}
            onClick={() => setShowBannerDesign(!showBannerDesign)}
          >
            Banner design
          </Button> */}

          <BlockStack gap="200">
            <Text variant="headingSm" as="h3">
              Banner Design
            </Text>
          </BlockStack>

          {/* <Collapsible
            open={showBannerDesign}
            id="banner-design-collapsible"
            transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
          > */}
            <BlockStack gap="400">
              {/* Color Pickers */}
              <BlockStack gap="300">
                <div>
                  <Text variant="bodyMd" as="p" fontWeight="medium">
                    Background color
                  </Text>
                  {/* <Text variant="bodySm" as="span" tone="subdued">
                    {data?.design?.backgroundColor || "#A7A7A7"}
                  </Text> */}
                  <div style={{ marginTop: "8px" }}>
                    <ColorPickerInput
                      value={data?.design?.backgroundColor || "#A7A7A7"}
                      onChange={(color) =>
                        handleColorChange("backgroundColor", color)
                      }
                    />
                  </div>
                </div>

                <div>
                  <Text variant="bodyMd" as="p" fontWeight="medium">
                    Banner text color
                  </Text>
                  {/* <Text variant="bodySm" as="span" tone="subdued">
                    {data?.design?.textColor || "#000000"}
                  </Text> */}
                  <div style={{ marginTop: "8px" }}>
                    <ColorPickerInput
                      value={data?.design?.textColor || "#000000"}
                      onChange={(color) =>
                        handleColorChange("textColor", color)
                      }
                    />
                  </div>
                </div>

                <div>
                  <Text variant="bodyMd" as="p" fontWeight="medium">
                    Close icon color
                  </Text>
                  {/* <Text variant="bodySm" as="span" tone="subdued">
                    {data?.design?.closeIconColor || "#ffffff"}
                  </Text> */}
                  <div style={{ marginTop: "8px" }}>
                    <ColorPickerInput
                      value={data?.design?.closeIconColor || "#ffffff"}
                      onChange={(color) =>
                        handleColorChange("closeIconColor", color)
                      }
                    />
                  </div>
                </div>
              </BlockStack>

              {/* Sliders */}
              <BlockStack gap="300">
                <RangeSlider
                  label={`Banner opacity: ${data?.design?.opacity || 1}`}
                  value={data?.design?.opacity || 1}
                  onChange={(value) => handleSliderChange("opacity", value)}
                  min={0}
                  max={1}
                  step={0.1}
                  output
                />

                <RangeSlider
                  label={`Banner text size (desktop): ${data?.design?.textSize || 16}px`}
                  value={data?.design?.textSize || 16}
                  onChange={(value) => handleSliderChange("textSize", value)}
                  min={10}
                  max={32}
                  step={1}
                  output
                />

                <RangeSlider
                  label={`Banner size (desktop): ${data?.design?.bannerSize || 60}px`}
                  value={data?.design?.bannerSize || 60}
                  onChange={(value) => handleSliderChange("bannerSize", value)}
                  min={40}
                  max={120}
                  step={1}
                  output
                />
              </BlockStack>
            </BlockStack>
          {/* </Collapsible> */}
        </BlockStack>
      </Card>

      {/* Button Section */}
      <Card>
        <BlockStack gap="400">
          {/* <Button
            variant="plain"
            textAlign="left"
            icon={showButton ? "chevron-down" : "chevron-right"}
            onClick={() => setShowButton(!showButton)}
          >
            Button
          </Button> */}

          <BlockStack gap="200">
            <Text variant="headingSm" as="h3">Button Design</Text>
          </BlockStack>

          {/* <Collapsible
            open={showButton}
            id="button-collapsible"
            transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
          > */}
            <BlockStack gap="400">
              {/* Button Color Pickers */}
              <BlockStack gap="300">
                <div>
                  <Text variant="bodyMd" as="p" fontWeight="medium">
                    Button background color
                  </Text>
                  {/* <Text variant="bodySm" as="span" tone="subdued">
                    {data?.design?.buttonBackgroundColor || "#000000"}
                  </Text> */}
                  <div style={{ marginTop: "8px" }}>
                    <ColorPickerInput
                      value={data?.design?.buttonBackgroundColor || "#000000"}
                      onChange={(color) =>
                        handleColorChange("buttonBackgroundColor", color)
                      }
                    />
                  </div>
                </div>

                <div>
                  <Text variant="bodyMd" as="p" fontWeight="medium">
                    Button text color
                  </Text>
                  {/* <Text variant="bodySm" as="span" tone="subdued">
                    {data?.design?.buttonTextColor || "#ffffff"}
                  </Text> */}
                  <div style={{ marginTop: "8px" }}>
                    <ColorPickerInput
                      value={data?.design?.buttonTextColor || "#ffffff"}
                      onChange={(color) =>
                        handleColorChange("buttonTextColor", color)
                      }
                    />
                  </div>
                </div>

                <div>
                  <Text variant="bodyMd" as="p" fontWeight="medium">
                    Button border color
                  </Text>
                  {/* <Text variant="bodySm" as="span" tone="subdued">
                    {data?.design?.buttonBorderColor || "#000000"}
                  </Text> */}
                  <div style={{ marginTop: "8px" }}>
                    <ColorPickerInput
                      value={data?.design?.buttonBorderColor || "#000000"}
                      onChange={(color) =>
                        handleColorChange("buttonBorderColor", color)
                      }
                    />
                  </div>
                </div>
              </BlockStack>

              {/* Button Sliders */}
              <BlockStack gap="300">
                <RangeSlider
                  label={`Button text size: ${data?.design?.buttonTextSize || 16}px`}
                  value={data?.design?.buttonTextSize || 16}
                  onChange={(value) =>
                    handleSliderChange("buttonTextSize", value)
                  }
                  min={10}
                  max={24}
                  step={1}
                  output
                />

                <RangeSlider
                  label={`Button border size: ${data?.design?.buttonBorderSize || 0}px`}
                  value={data?.design?.buttonBorderSize || 0}
                  onChange={(value) =>
                    handleSliderChange("buttonBorderSize", value)
                  }
                  min={0}
                  max={5}
                  step={1}
                  output
                />

                <RangeSlider
                  label={`Button corner radius: ${data?.design?.buttonCornerRadius || 8}px`}
                  value={data?.design?.buttonCornerRadius || 8}
                  onChange={(value) =>
                    handleSliderChange("buttonCornerRadius", value)
                  }
                  min={0}
                  max={20}
                  step={1}
                  output
                />
              </BlockStack>
            </BlockStack>
          {/* </Collapsible> */}
        </BlockStack>
      </Card>

      {/* Help Section */}
      <Card>
        <BlockStack gap="200">
          <Text variant="bodyMd" as="p">
            About Banner? <Button variant="plain">See Banner docs</Button> or{" "}
            <Button variant="plain">Contact us</Button>.
          </Text>
        </BlockStack>
      </Card>
    </BlockStack>
  );
};

export default BannerDesignForm;
