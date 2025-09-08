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

  const handleShowCloseButtonChange = useCallback((checked: boolean) => {
    onChange?.({ showCloseButton: checked });
  }, [onChange]);

  const handlePageDisplayChange = useCallback((page: string, checked: boolean) => {
    onChange?.({ [page]: checked });
  }, [onChange]);

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
            />

            <TextField
              label="Link (Optional)"
              value={data?.content?.link || ""}
              onChange={handleLinkChange}
              placeholder="https://example.com"
              helpText="Add a link to make your banner clickable"
            />

            {/* Link Options */}
            <BlockStack gap="200">
              <Text variant="bodyMd" as="p">Link behavior</Text>
              <BlockStack gap="200">
                <RadioButton
                  label="Open link in new tab."
                  checked={linkOption === "new_tab"}
                  id="new_tab"
                  name="link_option"
                  onChange={(checked) => handleLinkOptionChange(checked, "new_tab")}
                />
                <RadioButton
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
                />
              </BlockStack>
            </BlockStack>

            {/* Additional Options */}
            <BlockStack gap="200">
              <Checkbox
                label="Use button for click action"
                checked={data?.content?.useButton || false}
                onChange={handleUseButtonChange}
              />
              <Checkbox
                label='Show close button "X"'
                checked={data?.content?.showCloseButton || false}
                onChange={handleShowCloseButtonChange}
              />
            </BlockStack>
          </FormLayout>
        </BlockStack>
      </Card>

      {/* Page Display Section */}
      <Card>
        <BlockStack gap="400">
          <Button
            variant="plain"
            textAlign="left"
            icon={showPageDisplay ? "chevron-down" : "chevron-right"}
            onClick={() => setShowPageDisplay(!showPageDisplay)}
          >
            <InlineStack gap="200">
              <Icon source={QuestionCircleIcon} tone="subdued" />
              <Text variant="headingMd" as="h3" tone="base">
                Page display
              </Text>
            </InlineStack>
          </Button>

          <Collapsible
            open={showPageDisplay}
            id="page-display-collapsible"
            transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
          >
            <BlockStack gap="300">
              <Text variant="bodyMd" tone="subdued">
                Choose where to display this banner
              </Text>
              
              <BlockStack gap="200">
                <Checkbox
                  label="Home pages"
                  checked={data?.display?.homePages || true}
                  onChange={(checked) => handlePageDisplayChange('homePages', checked)}
                />
                <Checkbox
                  label="Collection pages"
                  checked={data?.display?.collectionPages || false}
                  onChange={(checked) => handlePageDisplayChange('collectionPages', checked)}
                />
                <Checkbox
                  label="Product pages"
                  checked={data?.display?.productPages || false}
                  onChange={(checked) => handlePageDisplayChange('productPages', checked)}
                />
                <Checkbox
                  label={
                    <InlineStack gap="100">
                      <Text as="span">Specific pages</Text>
                      <Badge tone="magic">Growth</Badge>
                    </InlineStack>
                  }
                  checked={data?.display?.specificPages || false}
                  onChange={(checked) => handlePageDisplayChange('specificPages', checked)}
                />
              </BlockStack>
            </BlockStack>
          </Collapsible>
        </BlockStack>
      </Card>

      {/* Customer Conditions Section */}
      <Card>
        <BlockStack gap="400">
          <Button
            variant="plain"
            textAlign="left"
            icon={showCustomerConditions ? "chevron-down" : "chevron-right"}
            onClick={() => setShowCustomerConditions(!showCustomerConditions)}
          >
            <InlineStack gap="200">
              <Icon source={QuestionCircleIcon} tone="subdued" />
              <Text variant="headingMd" as="h3" tone="base">
                Customer conditions
              </Text>
              <Badge tone="magic">Growth</Badge>
            </InlineStack>
          </Button>

          <Collapsible
            open={showCustomerConditions}
            id="customer-conditions-collapsible"
            transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
          >
            <BlockStack gap="300">
              <Text variant="bodyMd" tone="subdued">
                Set conditions for when to show this banner to customers
              </Text>
              
              <Text variant="bodyMd">
                Customer targeting options will be available here.
              </Text>
            </BlockStack>
          </Collapsible>
        </BlockStack>
      </Card>

      {/* Schedule Section */}
      <Card>
        <BlockStack gap="400">
          <Button
            variant="plain"
            textAlign="left"
            icon={showSchedule ? "chevron-down" : "chevron-right"}
            onClick={() => setShowSchedule(!showSchedule)}
          >
            <InlineStack gap="200">
              <Icon source={CalendarTimeIcon} tone="subdued" />
              <Text variant="headingMd" as="h3" tone="base">
                Schedule
              </Text>
            </InlineStack>
          </Button>

          <Collapsible
            open={showSchedule}
            id="schedule-collapsible"
            transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
          >
            <BlockStack gap="400">
              <BlockStack gap="300">
                <Checkbox
                  label="Start date"
                  checked={data?.schedule?.startDate || false}
                  onChange={(checked) => onChange?.({ startDate: checked })}
                />
                {data?.schedule?.startDate && (
                  <div style={{ marginLeft: "24px" }}>
                    <DateTimePicker
                      dateLabel="Start Date"
                      timeLabel="Start Time"
                      onChange={(value) => onChange?.({ startDateTime: value })}
                      initialValue={data?.schedule?.startDateTime || undefined}
                    />
                  </div>
                )}
              </BlockStack>

              <BlockStack gap="300">
                <Checkbox
                  label="End date"
                  checked={data?.schedule?.endDate || false}
                  onChange={(checked) => onChange?.({ endDate: checked })}
                />
                {data?.schedule?.endDate && (
                  <div style={{ marginLeft: "24px" }}>
                    <DateTimePicker
                      dateLabel="End Date"
                      timeLabel="End Time"
                      onChange={(value) => onChange?.({ endDateTime: value })}
                      initialValue={data?.schedule?.endDateTime || undefined}
                    />
                  </div>
                )}
              </BlockStack>
            </BlockStack>
          </Collapsible>
        </BlockStack>
      </Card>

      {/* Translation Section */}
      <Card>
        <BlockStack gap="400">
          <Button
            variant="plain"
            textAlign="left"
            icon={showTranslation ? "chevron-down" : "chevron-right"}
            onClick={() => setShowTranslation(!showTranslation)}
          >
            <InlineStack gap="200">
              <Icon source={QuestionCircleIcon} tone="subdued" />
              <Text variant="headingMd" as="h3" tone="base">
                Translation
              </Text>
            </InlineStack>
          </Button>

          <Collapsible
            open={showTranslation}
            id="translation-collapsible"
            transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
          >
            <BlockStack gap="300">
              <Button variant="plain">
                Add translations
                <Badge tone="info">Unlimited</Badge>
              </Button>
              
              <Text variant="bodyMd" tone="subdued">
                Add translations for different languages.{" "}
                <Button variant="plain">Read more</Button>
              </Text>
            </BlockStack>
          </Collapsible>
        </BlockStack>
      </Card>
    </BlockStack>
  );
};

export default BannerContentForm;
