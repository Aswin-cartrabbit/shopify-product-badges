import {
  BlockStack,
  Button,
  Card,
  Checkbox,
  ChoiceList,
  Collapsible,
  FormLayout,
  RangeSlider,
  Select,
  TextField,
  Text,
  Divider,
  InlineStack,
  Badge,
} from "@shopify/polaris";
import React, { useState, useCallback } from "react";
import GridPosition from "../GridPosition";

const PlacementForm = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [displayRules, setDisplayRules] = useState(false);
  const [badgeSize, setBadgeSize] = useState(100);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedProducts, setSelectedProducts] = useState("");
  const [customSelector, setCustomSelector] = useState("");
  const [responsiveSettings, setResponsiveSettings] = useState(false);

  const handleConditionsChange = useCallback(
    (value) => setSelectedConditions(value),
    []
  );
  const handleSizeChange = useCallback((value) => setBadgeSize(value), []);
  const handleOffsetXChange = useCallback((value) => setOffsetX(value), []);
  const handleOffsetYChange = useCallback((value) => setOffsetY(value), []);

  return (
    <Card>
      <BlockStack gap="400">
        <Text variant="headingMd" as="h2">
          Badge Placement
        </Text>

        {/* Existing Page Location */}
        <Select
          label="Page Location"
          options={[
            { label: "Product Image", value: "product_image" },
            { label: "Product Detail", value: "product_detail" },
            { label: "Collection Page", value: "collection" },
            { label: "Cart preview", value: "cart_preview" },
          ]}
          onChange={() => {}}
          value="product"
        />

        {/* Existing Grid Position */}
        <GridPosition />

        {/* New: Badge Size and Fine-tuning */}
        <Card>
          <BlockStack gap="300">
            <Text variant="headingSm" as="h3">
              Size & Position Fine-tuning
            </Text>

            <RangeSlider
              label={`Badge Size: ${badgeSize}%`}
              value={badgeSize}
              onChange={handleSizeChange}
              min={50}
              max={200}
              step={10}
              output
            />

            <InlineStack gap="300">
              <div style={{ flex: 1 }}>
                <RangeSlider
                  label={`Horizontal Offset: ${offsetX}px`}
                  value={offsetX}
                  onChange={handleOffsetXChange}
                  min={-50}
                  max={50}
                  step={1}
                  output
                />
              </div>
              <div style={{ flex: 1 }}>
                <RangeSlider
                  label={`Vertical Offset: ${offsetY}px`}
                  value={offsetY}
                  onChange={handleOffsetYChange}
                  min={-50}
                  max={50}
                  step={1}
                  output
                />
              </div>
            </InlineStack>
          </BlockStack>
        </Card>

        {/* New: Advanced Settings */}
        <Card>
          <BlockStack gap="300">
            <InlineStack align="space-between">
              <Text variant="headingSm" as="h3">
                Advanced Settings
              </Text>
              <Button
                variant="plain"
                onClick={() => setShowAdvanced(!showAdvanced)}
                ariaExpanded={showAdvanced}
                ariaControls="advanced-settings"
              >
                {showAdvanced ? "Hide" : "Show"} Advanced
              </Button>
            </InlineStack>

            <Collapsible open={showAdvanced} id="advanced-settings">
              <BlockStack gap="300">
                <TextField
                  label="Custom CSS Selector"
                  value={customSelector}
                  onChange={setCustomSelector}
                  placeholder=".product-images .main-image"
                  helpText="For advanced users: specify exact element to attach badge to"
                  autoComplete="off"
                />

                <Select
                  label="Layer Priority (Z-index)"
                  options={[
                    { label: "Behind content (1)", value: "1" },
                    { label: "Normal (10)", value: "10" },
                    { label: "Above content (100)", value: "100" },
                    { label: "Top layer (999)", value: "999" },
                  ]}
                  onChange={() => {}}
                  value="10"
                />

                <Checkbox
                  label="Different position for mobile devices"
                  checked={responsiveSettings}
                  onChange={setResponsiveSettings}
                />

                {responsiveSettings && (
                  <Card>
                    <BlockStack gap="300">
                      <Text as="p" variant="bodyMd" tone="subdued">
                        <Badge tone="info">Mobile Settings</Badge>
                      </Text>
                      <Select
                        label="Mobile Page Location"
                        options={[
                          { label: "Same as desktop", value: "same" },
                          { label: "Product Page", value: "product" },
                          { label: "Collection Page", value: "collection" },
                          { label: "Hide on mobile", value: "hide" },
                        ]}
                        onChange={() => {}}
                        value="same"
                      />
                      {/* You could add another GridPosition component here for mobile */}
                    </BlockStack>
                  </Card>
                )}
              </BlockStack>
            </Collapsible>
          </BlockStack>
        </Card>

        {/* New: Preview & Testing */}
        <Card>
          <BlockStack gap="300">
            <Text variant="headingSm" as="h3">
              Preview & Testing
            </Text>
            <InlineStack gap="200">
              <Button size="slim" variant="plain">
                Preview on Store
              </Button>
              <Button size="slim" variant="plain">
                Test Mobile View
              </Button>
              <Button size="slim" variant="plain">
                Reset to Defaults
              </Button>
            </InlineStack>
          </BlockStack>
        </Card>

        <Divider />

        {/* Existing Save Button */}
        <Button variant="primary" fullWidth size="large">
          Save Placement Settings
        </Button>
      </BlockStack>
    </Card>
  );
};

export default PlacementForm;
