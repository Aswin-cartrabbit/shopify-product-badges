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
  Checkbox,
  Popover,
} from "@shopify/polaris";
import { useCallback, useState, useEffect } from "react";
import { DatePicker } from '@shopify/polaris';
import { QuestionCircleIcon, CalendarTimeIcon, CheckboxIcon } from "@shopify/polaris-icons";
import { useBadgeStore } from "@/stores/BadgeStore";
import { useAppBridge } from '@shopify/app-bridge-react';

interface DisplayFormProps {
  data?: any;
  onChange?: (data: any) => void;
  type?: string;
}

const DisplayForm = ({ data, onChange, type }: DisplayFormProps) => {
  const { badge, updateDisplay } = useBadgeStore();
  const app = useAppBridge();
  // Local UI-only states
  const [displayRules, setDisplayRules] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [newLink, setNewLink] = useState<string>("");

  // DatePicker state
  const [startDateState, setStartDateState] = useState({
    month: badge.display?.startDateTime ? new Date(badge.display.startDateTime).getMonth() + 1 : new Date().getMonth() + 1,
    year: badge.display?.startDateTime ? new Date(badge.display.startDateTime).getFullYear() : new Date().getFullYear()
  });
  const [endDateState, setEndDateState] = useState({
    month: badge.display?.endDateTime ? new Date(badge.display.endDateTime).getMonth() + 1 : new Date().getMonth() + 1,
    year: badge.display?.endDateTime ? new Date(badge.display.endDateTime).getFullYear() : new Date().getFullYear()
  });
  const [selectedStartDates, setSelectedStartDates] = useState({
    start: badge.display?.startDateTime ? new Date(badge.display.startDateTime) : new Date(),
    end: badge.display?.startDateTime ? new Date(badge.display.startDateTime) : new Date(),
  });
  const [selectedEndDates, setSelectedEndDates] = useState({
    start: badge.display?.endDateTime ? new Date(badge.display.endDateTime) : new Date(),
    end: badge.display?.endDateTime ? new Date(badge.display.endDateTime) : new Date(),
  });
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartCheckbox, setShowStartCheckbox] = useState(false);
  const [showEndCheckbox, setShowEndCheckbox] = useState(false);

  const handleStartMonthChange = useCallback(
    (month: number, year: number) => setStartDateState({month, year}),
    [],
  );

  const handleEndMonthChange = useCallback(
    (month: number, year: number) => setEndDateState({month, year}),
    [],
  );

  const handleScheduleToggle = () => {
    updateDisplay("isScheduled", !badge.display.isScheduled);
    if (!badge.display.isScheduled) {
      // Don't auto-set dates - let user choose when to schedule
      updateDisplay("startDateTime", undefined);
      updateDisplay("endDateTime", undefined);
    }
  };

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
        {/* <Card>
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

        <Divider /> */}

        {/* Page display (new) */}
        <Card>
          <BlockStack gap="200">
            <InlineStack gap="200" blockAlign="center">
              <Text variant="headingSm" as="h3">Page display</Text>
              <Tooltip content="Choose which store pages should show this label">
                <Icon source={QuestionCircleIcon} tone="subdued" />
              </Tooltip>
            </InlineStack>
            <BlockStack gap="200">
              <Checkbox label="Product page" checked={badge.display?.pageDisplay?.product ?? true} onChange={(v) => updateDisplay("pageDisplay", { ...(badge.display?.pageDisplay||{}), product: v } as any)} />
              <Checkbox label="Collection page" checked={badge.display?.pageDisplay?.collection ?? true} onChange={(v) => updateDisplay("pageDisplay", { ...(badge.display?.pageDisplay||{}), collection: v } as any)} />
              <Checkbox label="Home page" checked={badge.display?.pageDisplay?.home ?? true} onChange={(v) => updateDisplay("pageDisplay", { ...(badge.display?.pageDisplay||{}), home: v } as any)} />
              <Checkbox label="Search page" checked={badge.display?.pageDisplay?.search ?? true} onChange={(v) => updateDisplay("pageDisplay", { ...(badge.display?.pageDisplay||{}), search: v } as any)} />
              <Checkbox label="Cart page" checked={badge.display?.pageDisplay?.cart ?? false} onChange={(v) => updateDisplay("pageDisplay", { ...(badge.display?.pageDisplay||{}), cart: v } as any)} />
            </BlockStack>
          </BlockStack>
        </Card>

        {/* Languages (new) */}
        <Card>
          <BlockStack gap="200">
            <Text variant="headingSm" as="h3">Show label on store languages</Text>
            <RadioButton label="All Languages" checked={(badge.display?.languagesMode ?? "all") === "all"} id="allLanguages" name="languages" onChange={() => updateDisplay("languagesMode", "all" as any)} />
            <RadioButton label="Custom languages" checked={(badge.display?.languagesMode ?? "all") === "custom"} id="customLanguages" name="languages" onChange={() => updateDisplay("languagesMode", "custom" as any)} />
            {badge.display?.languagesMode === "custom" && (
              <FormLayout>
                <ChoiceList
                  title="Select languages"
                  allowMultiple
                  selected={(((badge.display as any)?.customLanguages) || []) as any}
                  onChange={(values) => updateDisplay("customLanguages" as any, values as any)}
                  choices={[
                    { label: "English", value: "en" },
                    { label: "French", value: "fr" },
                    { label: "German", value: "de" },
                    { label: "Spanish", value: "es" },
                    { label: "Italian", value: "it" },
                    { label: "Portuguese", value: "pt" },
                    { label: "Dutch", value: "nl" },
                    { label: "Japanese", value: "ja" },
                    { label: "Korean", value: "ko" },
                    { label: "Chinese (Simplified)", value: "zh-CN" },
                    { label: "Chinese (Traditional)", value: "zh-TW" },
                    { label: "Arabic", value: "ar" },
                    { label: "Hindi", value: "hi" },
                    { label: "Swedish", value: "sv" },
                    { label: "Polish", value: "pl" },
                  ]}
                />
              </FormLayout>
            )}
          </BlockStack>
        </Card>

        {/* Customer condition (new) */}
        <Card>
          <BlockStack gap="200">
            <Text variant="headingSm" as="h3">Customer condition</Text>
            <RadioButton label="All customers" checked={(badge.display?.customerCondition ?? "all") === "all"} id="allCustomers" name="customerCondition" onChange={() => updateDisplay("customerCondition", "all" as any)} />
            <RadioButton label="Customer with tags" checked={badge.display?.customerCondition === "tags"} id="customersWithTags" name="customerCondition" onChange={() => updateDisplay("customerCondition", "tags" as any)} />
            {badge.display?.customerCondition === "tags" && (
              <FormLayout>
                <TextField
                  label="Customer tags"
                  placeholder="vip, wholesale, influencer"
                  helpText="Enter customer tags as a comma-separated list."
                  autoComplete="off"
                  value={(((badge.display as any)?.customerTags) || []).join(", ")}
                  onChange={(value) => {
                    const tags = value
                      .split(",")
                      .map((t) => t.trim())
                      .filter((t) => t.length > 0);
                    updateDisplay("customerTags" as any, tags as any);
                  }}
                />
              </FormLayout>
            )}
            <RadioButton label="Logged-in customers" checked={badge.display?.customerCondition === "logged_in"} id="loggedInCustomers" name="customerCondition" onChange={() => updateDisplay("customerCondition", "logged_in" as any)} />
          </BlockStack>
        </Card>

        {/* Schedule (new) */}
        {/* <Card>
          <BlockStack gap="300">
            <InlineStack gap="200" blockAlign="center">
              <Icon source={CalendarTimeIcon} tone="subdued" />
              <Text variant="headingSm" as="h3">Schedule</Text>
            </InlineStack>
            <BlockStack gap="200">
              <Checkbox label="Start date" checked={Boolean(badge.display?.startDateTime)} onChange={(v) => {
                if (v) {
                  // Only set date when user explicitly enables - don't auto-set to now
                  setShowStartCheckbox(true);
                  setShowStartDatePicker(true);
                } else {
                  updateDisplay("startDateTime", undefined);
                  setShowStartCheckbox(false);
                  setShowStartDatePicker(false);
                }
              }} />
              {badge.display?.startDateTime && (
                <InlineStack gap="200">
                  <div style={{ flex: 1 }}>
                    <DateTimePicker dateLabel="" timeLabel="" initialValue={badge.display.startDateTime} onChange={(value) => updateDisplay("startDateTime", value)} />
                  </div>
                </InlineStack>
              )}
              <Checkbox label="End date" checked={Boolean(badge.display?.endDateTime)} onChange={(v) => {
                if (v) {
                  // Only set date when user explicitly enables - don't auto-set to now
                  setShowEndCheckbox(true);
                  setShowEndDatePicker(true);
                } else {
                  updateDisplay("endDateTime", undefined);
                  setShowEndCheckbox(false);
                  setShowEndDatePicker(false);
                }
              }} />
              {badge.display?.endDateTime && (
                <InlineStack gap="200">
                  <div style={{ flex: 1 }}>
                    <DateTimePicker dateLabel="" timeLabel="" initialValue={badge.display.endDateTime} onChange={(value) => updateDisplay("endDateTime", value)} />
                  </div>
                </InlineStack>
              )}
            </BlockStack>
          </BlockStack>
        </Card> */}

        {/* Scheduled Display */}
        {/* Scheduled Display */}
        <Card>
          <BlockStack gap="200">
            <Text variant="headingSm" as="h3">Scheduled Display</Text>
            
            <InlineStack align="space-between" blockAlign="center">
              <Text variant="bodyMd" as="p">Start Date</Text>
              <Checkbox 
                label={badge.display?.startDateTime ? 
                  new Date(badge.display.startDateTime).toLocaleDateString() : 
                  "Start Date"
                }
                checked={showStartCheckbox}

               
                onChange={(checked) => {
                  setShowStartCheckbox(checked);
                  setShowStartDatePicker(checked);
                  if (checked) {
                    // Don't auto-set to current time - let user pick date
                    // updateDisplay("startDateTime", Date.now());
                  } else {
                    updateDisplay("startDateTime", undefined);
                  }
                }}
              >
              </Checkbox>
            </InlineStack>
            
            {showStartDatePicker && (
              <DatePicker
                month={startDateState.month}
                year={startDateState.year}

                onChange={(dates) => {
                  setSelectedStartDates(dates);
                  const timestamp = dates.start.getTime();
                  console.log("Start date selected:", dates.start, "Timestamp:", timestamp);
                  updateDisplay("startDateTime", timestamp);
                  setShowStartDatePicker(false);
                }}
                onMonthChange={handleStartMonthChange}
                selected={selectedStartDates}
              />
            )}

            <InlineStack align="space-between" blockAlign="center">
              <Text variant="bodyMd" as="p">End Date</Text>
              <Checkbox
                label={badge.display?.endDateTime ? 
                  new Date(badge.display.endDateTime).toLocaleDateString() : 
                  "End Date"
                }
                checked={showEndCheckbox}

               
                onChange={(checked) => {
                  setShowEndCheckbox(checked);
                  setShowEndDatePicker(checked);
                  if (checked) {
                    // Don't auto-set to current time - let user pick date
                    // updateDisplay("endDateTime", Date.now());
                  } else {
                    updateDisplay("endDateTime", undefined);
                  }
                }}
              >
               
              </Checkbox>
            </InlineStack>
            
            {showEndDatePicker && (
              <DatePicker
                month={endDateState.month}
                year={endDateState.year}
                onChange={(dates) => {
                  setSelectedEndDates(dates);
                  const timestamp = dates.start.getTime();
                  console.log("End date selected:", dates.start, "Timestamp:", timestamp);
                  updateDisplay("endDateTime", timestamp);
                  setShowEndDatePicker(false);
                }}
                onMonthChange={handleEndMonthChange}
                selected={selectedEndDates}
              />
            )}
          </BlockStack>
        </Card>
       

        {/* Display Rules (new) */}
        {/* <Card>
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
        </Card> */}

        {/* Product selection moved to Products tab; no visibility controls here */}

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
