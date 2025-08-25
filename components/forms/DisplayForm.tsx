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
} from "@shopify/polaris";
import { useCallback, useState } from "react";
import { DateTimePicker } from "../pickers/DateTimePicker";
import { QuestionCircleIcon, CalendarTimeIcon } from "@shopify/polaris-icons";

const DisplayForm = () => {
  const [visibility, setVisibility] = useState<"all" | "single" | "multiple">(
    "all"
  );
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [startDateTime, setStartDateTime] = useState<string>("");
  const [endDateTime, setEndDateTime] = useState<string>("");
  const [isScheduled, setIsScheduled] = useState<boolean>(false);

  async function openResourcePicker(multiple = false, initQuery = "") {
    const selected = await window?.shopify?.resourcePicker({
      type: "product",
      query: initQuery,
      filter: {
        hidden: false,
        variants: true,
      },
      action: "select",
      multiple,
    });

    if (selected && selected.length > 0) {
      setSelectedProducts(selected);
    }
  }

  const handleVisibilityChange = (value: "all" | "single" | "multiple") => {
    setVisibility(value);

    if (value === "single") {
      openResourcePicker(false);
    } else if (value === "multiple") {
      openResourcePicker(true);
    } else {
      setSelectedProducts([]);
    }
  };

  const handleScheduleToggle = () => {
    setIsScheduled(!isScheduled);
    if (!isScheduled) {
      // Reset dates when enabling schedule
      setStartDateTime("");
      setEndDateTime("");
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
                {isScheduled ? "Remove Schedule" : "Add Schedule"}
              </Button>
            </InlineStack>

            {isScheduled && (
              <BlockStack gap="300">
                {/* <InlineStack gap="400"> */}
                <div style={{ flex: 1 }}>
                  <DateTimePicker
                    dateLabel="Start Date"
                    timeLabel="Start Time"
                    onChange={(value) => {
                      setStartDateTime(value);
                      console.log("Start date and time:", value);
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <DateTimePicker
                    dateLabel="End Date"
                    timeLabel="End Time"
                    onChange={(value) => {
                      setEndDateTime(value);
                      console.log("End date and time:", value);
                    }}
                  />
                </div>
                {/* </InlineStack> */}

                {startDateTime && endDateTime && (
                  <InlineStack gap="200">
                    <Badge tone="info">
                      {`Scheduled: ${new Date(startDateTime).toLocaleDateString()}
                      - ${new Date(endDateTime).toLocaleDateString()}`}
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
                      label: "Low inventory (less than 10 items)",
                      value: "low_inventory",
                    },
                    { label: "Customer is logged in", value: "logged_in" },
                    { label: "Customer is VIP/tagged", value: "vip_customer" },
                    { label: "Mobile devices only", value: "mobile_only" },
                    { label: "Desktop devices only", value: "desktop_only" },
                  ]}
                  selected={selectedConditions}
                  onChange={handleConditionsChange}
                  allowMultiple
                />

                <FormLayout>
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

                <TextField
                  label="Product Tags (comma-separated)"
                  //   value={selectedProducts}
                  //   onChange={setSelectedProducts}
                  placeholder="summer, sale, featured"
                  helpText="Badge will only show on products with these tags"
                  autoComplete="off"
                />
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
            selectedProducts.length > 0 && (
              <Card>
                <BlockStack gap="200">
                  <Text variant="bodyMd" as="p" fontWeight="medium">
                    {visibility === "single"
                      ? "Selected product:"
                      : `Selected products (${selectedProducts.length}):`}
                  </Text>
                  <BlockStack gap="100">
                    {selectedProducts.map((product) => (
                      <InlineStack
                        key={product.id}
                        gap="200"
                        blockAlign="center"
                      >
                        <Text as="p">• {product.title}</Text>
                        {product.handle && (
                          <Link
                            url={`/products/${product.handle}`}
                            external
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
                      onClick={() => openResourcePicker(true)}
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

        <InlineStack gap="200" align="end">
          <Button>Cancel</Button>
          <Button
            variant="primary"
            disabled={isScheduled && (!startDateTime || !endDateTime)}
          >
            Save Display Settings
          </Button>
        </InlineStack>
      </BlockStack>
    </Card>
  );
};

export default DisplayForm;
