import {
  BlockStack,
  Card,
  Text,
  TextField,
  RadioButton,
  Checkbox,
  Collapsible,
  Button,
  Badge,
  Icon,
  Tooltip,
  InlineStack,
  FormLayout
} from "@shopify/polaris";
import { useState, useCallback } from "react";
import { DatePicker } from '@shopify/polaris';
import { QuestionCircleIcon, CalendarTimeIcon } from "@shopify/polaris-icons";
import { DateTimePicker } from "../pickers/DateTimePicker";

interface BannerContentFormProps {
  data?: any;
  onChange?: (data: any) => void;
  bannerType?: string;
}

const BannerContentForm = ({ data, onChange, bannerType }: BannerContentFormProps) => {
  const [linkOption, setLinkOption] = useState<"new_tab" | "same_tab">("new_tab");
  const [showPageDisplay, setShowPageDisplay] = useState(true);
  const [showCustomerConditions, setShowCustomerConditions] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  // DatePicker state for schedule
  const [startDateState, setStartDateState] = useState({
    month: data?.schedule?.startDateTime ? new Date(data.schedule.startDateTime).getMonth() + 1 : new Date().getMonth() + 1,
    year: data?.schedule?.startDateTime ? new Date(data.schedule.startDateTime).getFullYear() : new Date().getFullYear()
  });
  const [endDateState, setEndDateState] = useState({
    month: data?.schedule?.endDateTime ? new Date(data.schedule.endDateTime).getMonth() + 1 : new Date().getMonth() + 1,
    year: data?.schedule?.endDateTime ? new Date(data.schedule.endDateTime).getFullYear() : new Date().getFullYear()
  });
  const [selectedStartDates, setSelectedStartDates] = useState({
    start: data?.schedule?.startDateTime ? new Date(data.schedule.startDateTime) : new Date(),
    end: data?.schedule?.startDateTime ? new Date(data.schedule.startDateTime) : new Date(),
  });
  const [selectedEndDates, setSelectedEndDates] = useState({
    start: data?.schedule?.endDateTime ? new Date(data.schedule.endDateTime) : new Date(),
    end: data?.schedule?.endDateTime ? new Date(data.schedule.endDateTime) : new Date(),
  });
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartCheckbox, setShowStartCheckbox] = useState(false);
  const [showEndCheckbox, setShowEndCheckbox] = useState(false);

  const TooltipIcon = ({ content }: { content: string }) => (
    <Tooltip content={content}>
      <Icon source={QuestionCircleIcon} tone="subdued" />
    </Tooltip>
  );

  const handleTextChange = useCallback((value: string) => {
    onChange?.({ text: value });
  }, [onChange]);

  const handleLinkChange = useCallback((value: string) => {
    onChange?.({ link: value });
  }, [onChange]);

  const handleLinkOptionChange = useCallback((checked: boolean, option: "new_tab" | "same_tab") => {
    if (checked) {
      setLinkOption(option);
      onChange?.({ openInNewTab: option === "new_tab" });
    }
  }, [onChange]);

  const handleUseButtonChange = useCallback((checked: boolean) => {
    onChange?.({ useButton: checked });
  }, [onChange]);

  const handleButtonTextChange = useCallback((value: string) => {
    onChange?.({ buttonText: value });
  }, [onChange]);

  const handleShowCloseButtonChange = useCallback((checked: boolean) => {
    onChange?.({ showCloseButton: checked });
  }, [onChange]);

  const handlePageDisplayChange = useCallback((page: string, checked: boolean) => {
    onChange?.({ [page]: checked });
  }, [onChange]);

  const handleStartMonthChange = useCallback(
    (month: number, year: number) => setStartDateState({month, year}),
    [],
  );

  const handleEndMonthChange = useCallback(
    (month: number, year: number) => setEndDateState({month, year}),
    [],
  );

  return (
    <BlockStack gap="400">
      {/* Banner Content Section */}
      <Card>
        <BlockStack gap="400">
          <InlineStack gap="200" align="space-between">
            <Text variant="headingMd" as="h3">
              Banner content
            </Text>
          </InlineStack>

          <FormLayout>
            <TextField
              label="Text"
              value={data?.content?.text || "Deco banner"}
              onChange={handleTextChange}
              placeholder="Enter banner text"
              multiline={2}
              helpText="This text will appear in your banner"
              autoComplete="off"
            />

            <TextField
              label="Link (Optional)"
              value={data?.content?.link || ""}
              onChange={handleLinkChange}
              placeholder="https://example.com"
              helpText="Add a link to make your banner clickable"
              autoComplete="off"
            />

            {/* Link Options */}
            <BlockStack gap="200">
              <Text variant="bodyMd" as="p">
                Link behavior
              </Text>
              <BlockStack gap="200">
                <RadioButton
                  label="Open link in new tab."
                  checked={linkOption === "new_tab"}
                  id="new_tab"
                  name="link_option"
                  onChange={(checked) =>
                    handleLinkOptionChange(checked, "new_tab")
                  }
                />
                {/* <RadioButton
                  label={
                    <InlineStack gap="100">
                      <Text as="span">Open link in the same tab.</Text>
                      <Button variant="plain" size="micro">
                        Contact us to activate
                      </Button>
                    </InlineStack>
                  }
                  checked={linkOption === "same_tab"}
                  id="same_tab"
                  name="link_option"
                  onChange={(checked) => handleLinkOptionChange(checked, "same_tab")}
                  disabled
                /> */}
              </BlockStack>
            </BlockStack>

            {/* Additional Options */}
            <BlockStack gap="200">
              <Checkbox
                label="Use button for click action"
                checked={data?.content?.useButton || false}
                onChange={handleUseButtonChange}
              />

              {/* Show button text input when useButton is checked */}
              {data?.content?.useButton && (
                <div style={{ marginLeft: "24px" }}>
                  <TextField
                    label="Button text"
                    value={data?.content?.buttonText || "Shop now!"}
                    onChange={handleButtonTextChange}
                    placeholder="Enter button text"
                    helpText="This text will appear on your button"
                    autoComplete="off"
                  />
                </div>
              )}

              <Checkbox
                label='Show close button "X"'
                checked={data?.content?.showCloseButton || false}
                onChange={handleShowCloseButtonChange}
              />
            </BlockStack>
          </FormLayout>
        </BlockStack>
      </Card>

      {/* Countdown Timer Section - Only show for countdown banners */}
      {bannerType === "countdown" && (
        <Card>
          <BlockStack gap="400">
            <InlineStack gap="200" align="space-between">
              <Text variant="headingMd" as="h3">
                <InlineStack gap="200" align="center">
                  <Icon source={CalendarTimeIcon} tone="base" />
                  <Text variant="headingMd" as="span">Countdown Timer</Text>
                </InlineStack>
              </Text>
            </InlineStack>

            <FormLayout>
              <BlockStack gap="400">
                {/* Show countdown on banner checkbox */}
                <Checkbox
                  label="Show countdown on banner"
                  checked={data?.content?.countdown?.enabled || false}
                  onChange={(checked) => onChange?.({ 
                    countdown: { 
                      ...data?.content?.countdown, 
                      enabled: checked 
                    } 
                  })}
                  helpText="Check for this box to show countdown timer on banner"
                />

                {data?.content?.countdown?.enabled && (
                  <div style={{ marginLeft: "24px" }}>
                    <BlockStack gap="300">
                      {/* Auto responsive */}
                      <Checkbox
                        label="Auto responsive"
                        checked={data?.content?.countdown?.autoResponsive || false}
                        onChange={(checked) => onChange?.({ 
                          countdown: { 
                            ...data?.content?.countdown, 
                            autoResponsive: checked 
                          } 
                        })}
                      />

                      {/* Countdown type selection */}
                      <BlockStack gap="200">
                        <RadioButton
                          label="Count down to a specific date"
                          checked={data?.content?.countdown?.type === "specific_date" || !data?.content?.countdown?.type}
                          id="specific_date"
                          name="countdown_type"
                          onChange={(checked) => {
                            if (checked) {
                              onChange?.({ 
                                countdown: { 
                                  ...data?.content?.countdown, 
                                  type: "specific_date" 
                                } 
                              });
                            }
                          }}
                        />

                        {/* Date/Time picker for specific date */}
                        {(data?.content?.countdown?.type === "specific_date" || !data?.content?.countdown?.type) && (
                          <div style={{ marginLeft: "24px" }}>
                            <InlineStack gap="200">
                              <div style={{ flex: 1 }}>
                                <TextField
                                  label=""
                                  value={data?.content?.countdown?.targetDate || "Mon Jul 29 2024"}
                                  onChange={(value) => onChange?.({ 
                                    countdown: { 
                                      ...data?.content?.countdown, 
                                      targetDate: value 
                                    } 
                                  })}
                                  placeholder="Select date"
                                  autoComplete="off"
                                />
                              </div>
                              <div style={{ flex: 1 }}>
                                <TextField
                                  label=""
                                  value={data?.content?.countdown?.targetTime || "05:09:31 PM"}
                                  onChange={(value) => onChange?.({ 
                                    countdown: { 
                                      ...data?.content?.countdown, 
                                      targetTime: value 
                                    } 
                                  })}
                                  placeholder="Select time"
                                  autoComplete="off"
                                />
                              </div>
                            </InlineStack>
                          </div>
                        )}

                        <RadioButton
                          label="Fixed times (Minute)"
                          checked={data?.content?.countdown?.type === "fixed_time"}
                          id="fixed_time"
                          name="countdown_type"
                          onChange={(checked) => {
                            if (checked) {
                              onChange?.({ 
                                countdown: { 
                                  ...data?.content?.countdown, 
                                  type: "fixed_time" 
                                } 
                              });
                            }
                          }}
                        />
                      </BlockStack>

                      {/* Time labels */}
                      <BlockStack gap="200">
                        <Text variant="bodyMd" as="p">Time labels</Text>
                        <InlineStack gap="200">
                          <TextField
                            label=""
                            value={data?.content?.countdown?.labels?.days || "Days"}
                            onChange={(value) => onChange?.({ 
                              countdown: { 
                                ...data?.content?.countdown, 
                                labels: {
                                  ...data?.content?.countdown?.labels,
                                  days: value
                                }
                              } 
                            })}
                            placeholder="Days"
                            autoComplete="off"
                          />
                          <TextField
                            label=""
                            value={data?.content?.countdown?.labels?.hours || "Hrs"}
                            onChange={(value) => onChange?.({ 
                              countdown: { 
                                ...data?.content?.countdown, 
                                labels: {
                                  ...data?.content?.countdown?.labels,
                                  hours: value
                                }
                              } 
                            })}
                            placeholder="Hrs"
                            autoComplete="off"
                          />
                          <TextField
                            label=""
                            value={data?.content?.countdown?.labels?.minutes || "Mins"}
                            onChange={(value) => onChange?.({ 
                              countdown: { 
                                ...data?.content?.countdown, 
                                labels: {
                                  ...data?.content?.countdown?.labels,
                                  minutes: value
                                }
                              } 
                            })}
                            placeholder="Mins"
                            autoComplete="off"
                          />
                          <TextField
                            label=""
                            value={data?.content?.countdown?.labels?.seconds || "Secs"}
                            onChange={(value) => onChange?.({ 
                              countdown: { 
                                ...data?.content?.countdown, 
                                labels: {
                                  ...data?.content?.countdown?.labels,
                                  seconds: value
                                }
                              } 
                            })}
                            placeholder="Secs"
                            autoComplete="off"
                          />
                        </InlineStack>
                      </BlockStack>

                      {/* When time ends */}
                      <BlockStack gap="200">
                        <Text variant="bodyMd" as="p">When time ends</Text>
                        <select
                          value={data?.content?.countdown?.action || "do_nothing"}
                          onChange={(e) => onChange?.({ 
                            countdown: { 
                              ...data?.content?.countdown, 
                              action: e.target.value 
                            } 
                          })}
                          style={{
                            padding: "8px 12px",
                            border: "1px solid #c9cccf",
                            borderRadius: "6px",
                            fontSize: "14px",
                            backgroundColor: "#ffffff",
                            color: "#202223",
                            width: "100%"
                          }}
                        >
                          <option value="do_nothing">Do nothing</option>
                          <option value="hide_banner">Hide banner</option>
                          <option value="show_message">Show custom message</option>
                          <option value="redirect">Redirect to URL</option>
                        </select>
                      </BlockStack>
                    </BlockStack>
                  </div>
                )}
              </BlockStack>
            </FormLayout>
          </BlockStack>
        </Card>
      )}

      {/* Page Display Section */}
      <Card>
        <BlockStack gap="400">
          {/* <Button
            variant="plain"
            textAlign="left"
            icon={showPageDisplay ? "chevron-down" : "chevron-right"}
            onClick={() => setShowPageDisplay(!showPageDisplay)}
          >
            Page display
          </Button> */}

          <BlockStack gap="200">
            <Text variant="headingSm" as="h3">
              Page display
            </Text>
          </BlockStack>

          {/* <Collapsible
            open={showPageDisplay}
            id="page-display-collapsible"
            transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
          > */}
          <BlockStack gap="300">
            <Text variant="bodyMd" as="p" tone="subdued">
              Choose where to display this banner
            </Text>

            <BlockStack gap="200">
              <Checkbox
                label="Home pages"
                checked={data?.display?.homePages || false}
                onChange={(checked) =>
                  handlePageDisplayChange("homePages", checked)
                }
              />
              <Checkbox
                label="Collection pages"
                checked={data?.display?.collectionPages || false}
                onChange={(checked) =>
                  handlePageDisplayChange("collectionPages", checked)
                }
              />
              <Checkbox
                label="Product pages"
                checked={data?.display?.productPages || false}
                onChange={(checked) =>
                  handlePageDisplayChange("productPages", checked)
                }
              />
              {/* <Checkbox
                label={
                  <InlineStack gap="100">
                    <Text as="span">Specific pages</Text>
                    <Badge tone="magic">Growth</Badge>
                  </InlineStack>
                }
                checked={data?.display?.specificPages || false}
                onChange={(checked) =>
                  handlePageDisplayChange("specificPages", checked)
                }
              /> */}
            </BlockStack>
          </BlockStack>
          {/* </Collapsible> */}
        </BlockStack>
      </Card>

      {/* Customer Conditions Section */}
      {/* <Card>
        <BlockStack gap="400">
          <InlineStack gap="200" align="start">
            <Button
              variant="plain"
              textAlign="left"
              icon={showCustomerConditions ? "chevron-down" : "chevron-right"}
              onClick={() => setShowCustomerConditions(!showCustomerConditions)}
            >
              Customer conditions
            </Button>
            <Badge tone="magic">Growth</Badge>
          </InlineStack>

          <Collapsible
            open={showCustomerConditions}
            id="customer-conditions-collapsible"
            transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
          >
            <BlockStack gap="300">
              <Text variant="bodyMd" as="p" tone="subdued">
                Set conditions for when to show this banner to customers
              </Text>

              <Text variant="bodyMd" as="p">
                Customer targeting options will be available here.
              </Text>
            </BlockStack>
          </Collapsible>
        </BlockStack>
      </Card> */}

      {/* Schedule Section - Using DisplayForm style */}
      <Card>
        <BlockStack gap="400">
          {/* <Button
            variant="plain"
            textAlign="left"
            icon={showSchedule ? "chevron-down" : "chevron-right"}
            onClick={() => setShowSchedule(!showSchedule)}
          >
            Schedule
          </Button> */}

          {/* <Collapsible
            open={showSchedule}
            id="schedule-collapsible"
            transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
          > */}
          <BlockStack gap="200">
            <Text variant="headingSm" as="h3">
              Scheduled Display
            </Text>

            <InlineStack align="space-between" blockAlign="center">
              <Text variant="bodyMd" as="p">
                Start Date
              </Text>
              <Checkbox
                label={
                  data?.schedule?.startDateTime
                    ? new Date(data.schedule.startDateTime).toLocaleDateString()
                    : "Start Date"
                }
                checked={showStartCheckbox}
                onChange={(checked) => {
                  setShowStartCheckbox(checked);
                  setShowStartDatePicker(checked);
                  if (checked) {
                    // Don't auto-set to current time - let user pick date
                  } else {
                    onChange?.({ startDateTime: undefined });
                  }
                }}
              />
            </InlineStack>

            {showStartDatePicker && (
              <DatePicker
                month={startDateState.month}
                year={startDateState.year}
                onChange={(dates) => {
                  setSelectedStartDates(dates);
                  const timestamp = dates.start.getTime();
                  console.log(
                    "Start date selected:",
                    dates.start,
                    "Timestamp:",
                    timestamp
                  );
                  onChange?.({ startDateTime: timestamp });
                  setShowStartDatePicker(false);
                }}
                onMonthChange={handleStartMonthChange}
                selected={selectedStartDates}
              />
            )}

            <InlineStack align="space-between" blockAlign="center">
              <Text variant="bodyMd" as="p">
                End Date
              </Text>
              <Checkbox
                label={
                  data?.schedule?.endDateTime
                    ? new Date(data.schedule.endDateTime).toLocaleDateString()
                    : "End Date"
                }
                checked={showEndCheckbox}
                onChange={(checked) => {
                  setShowEndCheckbox(checked);
                  setShowEndDatePicker(checked);
                  if (checked) {
                    // Don't auto-set to current time - let user pick date
                  } else {
                    onChange?.({ endDateTime: undefined });
                  }
                }}
              />
            </InlineStack>

            {showEndDatePicker && (
              <DatePicker
                month={endDateState.month}
                year={endDateState.year}
                onChange={(dates) => {
                  setSelectedEndDates(dates);
                  const timestamp = dates.start.getTime();
                  console.log(
                    "End date selected:",
                    dates.start,
                    "Timestamp:",
                    timestamp
                  );
                  onChange?.({ endDateTime: timestamp });
                  setShowEndDatePicker(false);
                }}
                onMonthChange={handleEndMonthChange}
                selected={selectedEndDates}
              />
            )}
          </BlockStack>
          {/* </Collapsible> */}
        </BlockStack>
      </Card>

      {/* Translation Section */}
      {/* <Card>
        <BlockStack gap="400">
          <Button
            variant="plain"
            textAlign="left"
            icon={showTranslation ? "chevron-down" : "chevron-right"}
            onClick={() => setShowTranslation(!showTranslation)}
          >
            Translation
          </Button>

          <Collapsible
            open={showTranslation}
            id="translation-collapsible"
            transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
          >
            <BlockStack gap="300">
              <Button variant="plain">Add translations</Button>
              <Badge tone="info">Unlimited</Badge>

              <Text variant="bodyMd" as="p" tone="subdued">
                Add translations for different languages.{" "}
                <Button variant="plain">Read more</Button>
              </Text>
            </BlockStack>
          </Collapsible>
        </BlockStack>
      </Card> */}
    </BlockStack>
  );
};

export default BannerContentForm;
