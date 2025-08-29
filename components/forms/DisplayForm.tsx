import {
  BlockStack,
  Button,
  Card,
  RadioButton,
  Text,
  Tooltip,
  Link,
  InlineStack,
  Icon,
  Divider,
  Badge,
  Collapsible,
  TextField,
  FormLayout,
  ChoiceList,
  Select,
} from "@shopify/polaris";
import { useCallback, useState, useEffect } from "react";
import { DateTimePicker } from "../pickers/DateTimePicker";
import { QuestionCircleIcon, CalendarTimeIcon } from "@shopify/polaris-icons";
import { useBadgeStore } from "@/stores/BadgeStore";
import { useAppBridge } from '@shopify/app-bridge-react';

interface DisplayFormProps {
  data?: any;
  onChange?: (data: any) => void;
  type?: string;
}

const DisplayForm = ({ data, onChange, type }: DisplayFormProps) => {
  const [visibility, setVisibility] = useState<"all" | "single" | "multiple">(
    "all"
  );
  const { badge, updateDisplay } = useBadgeStore();
  const app = useAppBridge();

  // Initialize visibility based on existing badge data
  useEffect(() => {
    if (badge.display.resourceIds && badge.display.resourceIds.length > 0) {
      setVisibility(badge.display.resourceIds.length === 1 ? "single" : "multiple");
    } else {
      setVisibility("all");
    }
  }, [badge.display.resourceIds]);
  async function openResourcePicker(multiple = false, initQuery = "") {

    
    try {
      // Try multiple approaches to open the resource picker
      let selected = null;
      
      // Method 1: Try window.shopify.resourcePicker (traditional method)
      if (window?.shopify?.resourcePicker) {
        console.log('Using window.shopify.resourcePicker');
        selected = await window.shopify.resourcePicker({
          type: "product",
          query: initQuery,
          filter: {
            hidden: false,
            variants: true,
          },
          action: "select",
          multiple,
        });
      }
      // Method 2: Try with shopify global (alternative)
      else if (window?.shopify) {
        console.log('Trying alternative Shopify API access');
        // Force refresh the shopify object
        await new Promise(resolve => setTimeout(resolve, 500));
        if (window.shopify.resourcePicker) {
          selected = await window.shopify.resourcePicker({
            type: "product",
            action: "select",
            multiple,
          });
        }
      } 
      // Method 3: Direct app bridge approach
      else {
        console.error('Shopify resource picker API not available');
        alert('Product selector is not available. This might be a context issue. Please try refreshing the page.');
        return;
      }

      console.log('Resource picker result:', selected);

      if (selected && selected.length > 0) {
        const mappedProducts = selected.map((product) => {
          return {
            productTitle: product.title,
            productHandle: product.handle,
            productId: product.id,
            variants: product.variants?.map((variant) => {
              return {
                variantId: variant.id,
                variantDisplayName: variant.displayName,
              };
            }) || [],
          };
        });
        
        console.log('Updating display with products:', mappedProducts);
        updateDisplay("resourceIds", mappedProducts);
      } else {
        console.log('No products selected or picker was cancelled');
      }
    } catch (error) {
      console.error('Resource picker error:', error);
      alert(`Failed to open product selector: ${error.message || 'Unknown error'}. Please try refreshing the page and try again.`);
    }
  }

  const handleVisibilityChange = (value: "all" | "single" | "multiple") => {
    setVisibility(value);

    if (value === "single") {
      // Small delay to ensure modal context is ready
      setTimeout(() => openResourcePicker(false), 100);
    } else if (value === "multiple") {
      // Small delay to ensure modal context is ready
      setTimeout(() => openResourcePicker(true), 100);
    } else {
      updateDisplay("resourceIds", []);
    }
  };

  const handleScheduleToggle = () => {
    updateDisplay("isScheduled", !badge.display.isScheduled);
    if (!badge.display.isScheduled) {
      updateDisplay("startDateTime", Date.now());
      updateDisplay("endDateTime", Date.now());
    }
  };

  const [displayRules, setDisplayRules] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const handleConditionsChange = useCallback(
    (value) => setSelectedConditions(value),
    []
  );
  return (
    <Card>
      <BlockStack gap="400">
        <InlineStack align="space-between">
          <Text variant="headingMd" as="h2">
            Badge Display Settings
          </Text>
          <Tooltip content="Configure when and where your badges will appear on your store">
            <Icon source={QuestionCircleIcon} tone="subdued" />
          </Tooltip>
        </InlineStack>

        {/* Scheduling Section */}
        <Card>
          <BlockStack gap="300">
            <InlineStack align="space-between" blockAlign="center">
              <InlineStack gap="200" blockAlign="center">
                <Icon source={CalendarTimeIcon} tone="subdued" />
                <Text variant="headingSm" as="h3">
                  Schedule Display
                </Text>
              </InlineStack>
              <Button variant="plain" onClick={handleScheduleToggle}>
                {badge.display.isScheduled ? "Remove Schedule" : "Add Schedule"}
              </Button>
            </InlineStack>

            {badge.display.isScheduled && (
              <BlockStack gap="300">
                <div style={{ flex: 1 }}>
                  <DateTimePicker
                    dateLabel="Start Date"
                    timeLabel="Start Time"
                    initialValue={badge.display.startDateTime}
                    onChange={(value) => {
                      updateDisplay("startDateTime", value);
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <DateTimePicker
                    dateLabel="End Date"
                    timeLabel="End Time"
                    initialValue={badge.display.startDateTime}
                    onChange={(value) => {
                      updateDisplay("endDateTime", value);
                    }}
                  />
                </div>
                {/* </InlineStack> */}

                {badge.display.startDateTime && badge.display.endDateTime && (
                  <InlineStack gap="200">
                    <Badge tone="info">
                      {`Scheduled: ${new Date(badge.display.startDateTime).toLocaleDateString()}
                      - ${new Date(badge.display.endDateTime).toLocaleDateString()}`}
                    </Badge>
                  </InlineStack>
                )}
              </BlockStack>
            )}
          </BlockStack>
        </Card>

        <Divider />

        <Card>
          <BlockStack gap="300">
            <InlineStack align="space-between">
              <Text variant="headingSm" as="h3">
                Display Rules
              </Text>
              <Button
                variant="plain"
                onClick={() => setDisplayRules(!displayRules)}
                ariaExpanded={displayRules}
                ariaControls="display-rules"
              >
                {displayRules ? "Hide" : "Show"} Rules
              </Button>
            </InlineStack>

            <Collapsible open={displayRules} id="display-rules">
              <BlockStack gap="300">
                <ChoiceList
                  title="Show badge when:"
                  choices={[
                    { label: "Product is on sale", value: "on_sale" },
                    {
                      label: "Product is new (added in last 30 days)",
                      value: "new_product",
                    },
                    {
                      label: "Based on inventory level",
                      value: "inventory_level",
                    },
                    {
                      label: "Best seller (top 10% of sales)",
                      value: "best_seller",
                    },
                    {
                      label: "based on price range",
                      value: "price_range",
                    },
                    { label: "Customer is logged in", value: "logged_in" },
                    { label: "Based on tags", value: "tags" },
                    { label: "Based on collections", value: "collection" },
                    { label: "Based on vendors", value: "vendor" },
                    { label: "Mobile devices only", value: "mobile_only" },
                    { label: "Desktop devices only", value: "desktop_only" },
                  ]}
                  selected={selectedConditions}
                  onChange={handleConditionsChange}
                  allowMultiple
                />

                {selectedConditions.includes("price_range") && (
                  <Card>
                    <FormLayout>
                      <Text variant="headingMd" as="p">
                        Set Price Range ($)
                      </Text>
                      <FormLayout.Group>
                        <TextField
                          label="Min Price ($)"
                          type="number"
                          value={priceRange.min}
                          onChange={(value) =>
                            setPriceRange({ ...priceRange, min: value })
                          }
                          autoComplete="off"
                          placeholder="0.00"
                        />
                        <TextField
                          label="Max Price ($)"
                          type="number"
                          value={priceRange.max}
                          onChange={(value) =>
                            setPriceRange({ ...priceRange, max: value })
                          }
                          autoComplete="off"
                          placeholder="999.99"
                        />
                      </FormLayout.Group>
                    </FormLayout>
                  </Card>
                )}
                {selectedConditions.includes("tags") && (
                  <Card>
                    <FormLayout>
                      <InlineStack align="space-between" blockAlign="center">
                        <Text variant="headingMd" as="p">
                          Specify Product Tags
                        </Text>
                        <Tooltip content="Define which product tags will trigger the badge display">
                          <Icon source={QuestionCircleIcon} tone="subdued" />
                        </Tooltip>
                      </InlineStack>

                      <FormLayout.Group>
                        <TextField
                          label="Product Tags (comma-separated)"
                          //   value={selectedProducts}
                          //   onChange={setSelectedProducts}
                          placeholder="summer, sale, featured"
                          helpText="Badge will only show on products with these tags"
                          autoComplete="off"
                        />
                      </FormLayout.Group>
                    </FormLayout>
                  </Card>
                )}
                {selectedConditions.includes("collection") && (
                  <Card>
                    <FormLayout>
                      <InlineStack align="space-between" blockAlign="center">
                        <Text variant="headingMd" as="p">
                          Specify Product Collections
                        </Text>
                        <Tooltip content="Define which product collections will trigger the badge display">
                          <Icon source={QuestionCircleIcon} tone="subdued" />
                        </Tooltip>
                      </InlineStack>
                      <FormLayout.Group>
                        <TextField
                          label="Product Tags (comma-separated)"
                          //   value={selectedProducts}
                          //   onChange={setSelectedProducts}
                          placeholder="summer, sale, featured"
                          helpText="Badge will only show on products with these collections"
                          autoComplete="off"
                        />
                      </FormLayout.Group>
                    </FormLayout>
                  </Card>
                )}
                {selectedConditions.includes("vendor") && (
                  <Card>
                    <FormLayout>
                      <InlineStack align="space-between" blockAlign="center">
                        <Text variant="headingMd" as="p">
                          Specify Product Tags
                        </Text>
                        <Tooltip content="Define which product vendors will trigger the badge display">
                          <Icon source={QuestionCircleIcon} tone="subdued" />
                        </Tooltip>
                      </InlineStack>

                      <FormLayout.Group>
                        <TextField
                          label="Product Tags (comma-separated)"
                          //   value={selectedProducts}
                          //   onChange={setSelectedProducts}
                          placeholder="summer, sale, featured"
                          helpText="Badge will only show on products with these vendors"
                          autoComplete="off"
                        />
                      </FormLayout.Group>
                    </FormLayout>
                  </Card>
                )}
                {selectedConditions.includes("inventory_level") && (
                  <Card>
                    <FormLayout>
                      <InlineStack align="space-between" blockAlign="center">
                        <Text variant="headingMd" as="p">
                          Set Inventory Threshold
                        </Text>
                        <Tooltip content="Define the inventory level below which the badge will be displayed">
                          <Icon source={QuestionCircleIcon} tone="subdued" />
                        </Tooltip>
                      </InlineStack>

                      <FormLayout.Group>
                        <TextField
                          label="Inventory Threshold (units)"
                          //   value={selectedProducts}
                          //   onChange={setSelectedProducts}
                          placeholder="10"
                          helpText="Badge will show when inventory is below this number"
                          autoComplete="off"
                          min={0}
                          type="number"
                          value="10"
                        />
                      </FormLayout.Group>
                    </FormLayout>
                  </Card>
                )}
                {selectedConditions.includes("best_seller") && (
                  <Card>
                    <BlockStack gap="300">
                      <InlineStack align="space-between" blockAlign="center">
                        <Text as="p" variant="bodyMd" fontWeight="medium">
                          Best Seller Configuration
                        </Text>
                        <Tooltip content="Define what percentage of top-selling products should get the best seller badge">
                          <Icon source={QuestionCircleIcon} tone="subdued" />
                        </Tooltip>
                      </InlineStack>
                      <FormLayout>
                        <Select
                          label="Best seller criteria"
                          options={[
                            {
                              label: "Top 5% of products by sales",
                              value: "5",
                            },
                            {
                              label: "Top 10% of products by sales",
                              value: "10",
                            },
                            {
                              label: "Top 15% of products by sales",
                              value: "15",
                            },
                            {
                              label: "Top 20% of products by sales",
                              value: "20",
                            },
                          ]}
                          // value={ruleConfig.bestSellerPercentile.toString()}
                          // onChange={(value) =>
                          //   updateRuleConfig(
                          //     "bestSellerPercentile",
                          //     parseInt(value)
                          //   )
                          // }
                        />
                        <Select
                          label="Time period for sales calculation"
                          options={[
                            { label: "Last 7 days", value: "7" },
                            { label: "Last 30 days", value: "30" },
                            { label: "Last 90 days", value: "90" },
                            { label: "All time", value: "all" },
                          ]}
                          value="30"
                          onChange={() => {}}
                        />
                      </FormLayout>
                      <Text as="p" variant="bodySm" tone="subdued">
                        📊 Based on total units sold within the selected time
                        period
                      </Text>
                    </BlockStack>
                  </Card>
                )}
              </BlockStack>
            </Collapsible>
          </BlockStack>
        </Card>

        {/* Product Visibility Section */}
        <BlockStack gap="300">
          <InlineStack align="space-between" blockAlign="center">
            <Text variant="headingSm" as="h3">
              Product Visibility
            </Text>
            <Tooltip content="Choose which products will display the badge. You can show it on all products or select specific ones.">
              <Icon source={QuestionCircleIcon} tone="subdued" />
            </Tooltip>
          </InlineStack>

          <BlockStack gap="200">
            <RadioButton
              label="Show on all products"
              checked={visibility === "all"}
              id="allProducts"
              name="visibility"
              onChange={() => handleVisibilityChange("all")}
              helpText="Badge will appear on every product in your store"
            />

            <RadioButton
              label="Show on a single product"
              checked={visibility === "single"}
              id="singleProduct"
              name="visibility"
              onChange={() => handleVisibilityChange("single")}
              helpText="Choose one specific product to display the badge"
            />
            
          

            <RadioButton
              label="Show on multiple specific products"
              checked={visibility === "multiple"}
              id="multipleProducts"
              name="visibility"
              onChange={() => handleVisibilityChange("multiple")}
              helpText="Select multiple products to display the badge"
            />
          </BlockStack>

          {(visibility === "single" || visibility === "multiple") &&
            badge.display.resourceIds.length > 0 && (
              <Card>
                <BlockStack gap="200">
                  <Text variant="bodyMd" as="p" fontWeight="medium">
                    {visibility === "single"
                      ? "Selected product:"
                      : `Selected products (${badge.display.resourceIds.length}):`}
                  </Text>
                  <BlockStack gap="100">
                    {badge.display.resourceIds.map((product, index) => (
                      <InlineStack key={index} gap="200" blockAlign="center">
                        <Text as="p">• {product.productTitle}</Text>
                        {product.productHandle && (
                          <Link
                            url={`/products/${product.productHandle}`}
                            target="_blank"
                            removeUnderline
                          >
                            View product
                          </Link>
                        )}
                      </InlineStack>
                    ))}
                  </BlockStack>

                  {visibility === "multiple" && (
                    <Button
                      variant="plain"
                      onClick={() => setTimeout(() => openResourcePicker(true), 100)}
                    >
                      Edit selection
                    </Button>
                  )}
                </BlockStack>
              </Card>
            )}
        </BlockStack>
        <Divider />

        {/* Help Section */}
        <Card>
          <BlockStack gap="200">
            <Text variant="bodyMd" as="p">
              Need help setting up your badges?
              <Link url="/help/badges" removeUnderline>
                {" "}
                Learn more about badge configuration
              </Link>
            </Text>
          </BlockStack>
        </Card>
      </BlockStack>
    </Card>
  );
};

export default DisplayForm;
