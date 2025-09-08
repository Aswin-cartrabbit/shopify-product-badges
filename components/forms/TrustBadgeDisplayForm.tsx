import {
  BlockStack,
  Card,
  Text,
  RadioButton,
  FormLayout,
  ChoiceList,
  TextField,
  Checkbox,
  DatePicker,
} from "@shopify/polaris";
import { useCallback, useState } from "react";

interface TrustBadgeDisplayFormProps {
  data?: any;
  onChange?: (data: any) => void;
}

const TrustBadgeDisplayForm = ({ data, onChange }: TrustBadgeDisplayFormProps) => {
  // DatePicker state
  const [startDateState, setStartDateState] = useState({
    month: data?.startDateTime ? new Date(data.startDateTime).getMonth() + 1 : new Date().getMonth() + 1,
    year: data?.startDateTime ? new Date(data.startDateTime).getFullYear() : new Date().getFullYear()
  });
  const [endDateState, setEndDateState] = useState({
    month: data?.endDateTime ? new Date(data.endDateTime).getMonth() + 1 : new Date().getMonth() + 1,
    year: data?.endDateTime ? new Date(data.endDateTime).getFullYear() : new Date().getFullYear()
  });
  const [selectedStartDates, setSelectedStartDates] = useState({
    start: data?.startDateTime ? new Date(data.startDateTime) : new Date(),
    end: data?.startDateTime ? new Date(data.startDateTime) : new Date(),
  });
  const [selectedEndDates, setSelectedEndDates] = useState({
    start: data?.endDateTime ? new Date(data.endDateTime) : new Date(),
    end: data?.endDateTime ? new Date(data.endDateTime) : new Date(),
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

  const handleChange = (key: any, value: any) => {
    if (onChange) {
      onChange({ [key]: value });
    }
  };

  return (
    <BlockStack gap="400">
      {/* Languages */}
      <Card>
        <BlockStack gap="200">
          <Text variant="headingSm" as="h3">Show label on store languages</Text>
          <RadioButton 
            label="All Languages" 
            checked={(data?.languagesMode ?? "all") === "all"} 
            id="allLanguages" 
            name="languages" 
            onChange={() => handleChange("languagesMode", "all")} 
          />
          <RadioButton 
            label="Custom languages" 
            checked={(data?.languagesMode ?? "all") === "custom"} 
            id="customLanguages" 
            name="languages" 
            onChange={() => handleChange("languagesMode", "custom")} 
          />
          {data?.languagesMode === "custom" && (
            <FormLayout>
              <ChoiceList
                title="Select languages"
                allowMultiple
                selected={data?.customLanguages || []}
                onChange={(values) => handleChange("customLanguages", values)}
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

      {/* Customer condition */}
      <Card>
        <BlockStack gap="200">
          <Text variant="headingSm" as="h3">Customer condition</Text>
          <RadioButton 
            label="All customers" 
            checked={(data?.customerCondition ?? "all") === "all"} 
            id="allCustomers" 
            name="customerCondition" 
            onChange={() => handleChange("customerCondition", "all")} 
          />
          <RadioButton 
            label="Customer with tags" 
            checked={data?.customerCondition === "tags"} 
            id="customersWithTags" 
            name="customerCondition" 
            onChange={() => handleChange("customerCondition", "tags")} 
          />
          {data?.customerCondition === "tags" && (
            <FormLayout>
              <TextField
                label="Customer tags"
                placeholder="vip, wholesale, influencer"
                helpText="Enter customer tags as a comma-separated list."
                autoComplete="off"
                value={(data?.customerTags || []).join(", ")}
                onChange={(value) => {
                  const tags = value
                    .split(",")
                    .map((t) => t.trim())
                    .filter((t) => t.length > 0);
                  handleChange("customerTags", tags);
                }}
              />
            </FormLayout>
          )}
          <RadioButton 
            label="Logged-in customers" 
            checked={data?.customerCondition === "logged_in"} 
            id="loggedInCustomers" 
            name="customerCondition" 
            onChange={() => handleChange("customerCondition", "logged_in")} 
          />
        </BlockStack>
      </Card>

      {/* Scheduled Display */}
      <Card>
        <BlockStack gap="200">
          <Text variant="headingSm" as="h3">Scheduled Display</Text>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Text variant="bodyMd" as="p">Start Date</Text>
            <Checkbox 
              label={data?.startDateTime ? 
                new Date(data.startDateTime).toLocaleDateString() : 
                "Start Date"
              }
              checked={showStartCheckbox}
              onChange={(checked) => {
                setShowStartCheckbox(checked);
                setShowStartDatePicker(checked);
                if (checked) {
                  // Don't auto-set to current time - let user pick date
                } else {
                  handleChange("startDateTime", undefined);
                }
              }}
            />
          </div>
          
          {showStartDatePicker && (
            <DatePicker
              month={startDateState.month}
              year={startDateState.year}
              onChange={(dates) => {
                setSelectedStartDates(dates);
                const timestamp = dates.start.getTime();
                console.log("Start date selected:", dates.start, "Timestamp:", timestamp);
                handleChange("startDateTime", timestamp);
                setShowStartDatePicker(false);
              }}
              onMonthChange={handleStartMonthChange}
              selected={selectedStartDates}
            />
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Text variant="bodyMd" as="p">End Date</Text>
            <Checkbox
              label={data?.endDateTime ? 
                new Date(data.endDateTime).toLocaleDateString() : 
                "End Date"
              }
              checked={showEndCheckbox}
              onChange={(checked) => {
                setShowEndCheckbox(checked);
                setShowEndDatePicker(checked);
                if (checked) {
                  // Don't auto-set to current time - let user pick date
                } else {
                  handleChange("endDateTime", undefined);
                }
              }}
            />
          </div>
          
          {showEndDatePicker && (
            <DatePicker
              month={endDateState.month}
              year={endDateState.year}
              onChange={(dates) => {
                setSelectedEndDates(dates);
                const timestamp = dates.start.getTime();
                console.log("End date selected:", dates.start, "Timestamp:", timestamp);
                handleChange("endDateTime", timestamp);
                setShowEndDatePicker(false);
              }}
              onMonthChange={handleEndMonthChange}
              selected={selectedEndDates}
            />
          )}
        </BlockStack>
      </Card>
    </BlockStack>
  );
};

export default TrustBadgeDisplayForm;
