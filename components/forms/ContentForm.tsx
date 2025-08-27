import {
  Card,
  BlockStack,
  TextField,
  Bleed,
  Divider,
  Thumbnail,
  Button,
  Select,
  Text,
  Badge,
} from "@shopify/polaris";
import { useCallback, useState, useEffect } from "react";
import { useBadgeStore } from "@/stores/BadgeStore";
import React from "react";

interface ContentFormProps {
  data?: any;
  onChange?: (data: any) => void;
  type?: string;
  badgeName?: string;
  setBadgeName?: (name: string) => void;
}

const ContentForm = ({ data, onChange, type = "BADGE", badgeName, setBadgeName }: ContentFormProps) => {
  const { badge, updateContent } = useBadgeStore();
  
  // Local state for form fields
  const [localName, setLocalName] = useState("");
  const [localText, setLocalText] = useState("");

  // Initialize local state from props/data
  useEffect(() => {
    if (data) {
      const initialName = badgeName || 
        data?.name || 
        (data?.text ? `${data.text} ${type.toLowerCase()}` : "") ||
        (data?.alt ? `${data.alt} ${type.toLowerCase()}` : "") ||
        `New ${type.toLowerCase()}`;
      
      setLocalName(initialName);
      setLocalText(data?.text || badge.content.text || "");
    }
  }, [data?.id, data?.text, data?.alt, badgeName, type]); // Only trigger when template actually changes

  // Local state for form elements not directly related to badge data

  const handleBadgeChange = useCallback(
    (newValue: string) => {
      setLocalName(newValue);
      if (setBadgeName) {
        setBadgeName(newValue);
      }
      if (onChange) {
        onChange({ name: newValue });
      }
    },
    [setBadgeName, onChange]
  );

  const handleTextChange = useCallback(
    (newValue: string) => {
      setLocalText(newValue);
      updateContent("text", newValue);
      if (onChange) {
        onChange({ text: newValue });
      }
    },
    [updateContent, onChange]
  );

  const handleContentChange = useCallback(
    (field: keyof import('@/stores/BadgeStore').BadgeContent, value: any) => {
      updateContent(field, value);
      if (onChange) {
        onChange({ [field]: value });
      }
    },
    [updateContent, onChange]
  );

  const handleRemoveIcon = useCallback(() => {
    updateContent("icon", "");
    updateContent("iconUploaded", false);
    if (onChange) {
      onChange({ icon: "", iconUploaded: false });
    }
  }, [updateContent, onChange]);

  const handleUploadIcon = useCallback(() => {
    // You'd trigger file input here
    const iconUrl = "/icons/truck.png";
    updateContent("icon", iconUrl);
    updateContent("iconUploaded", true);
    if (onChange) {
      onChange({ icon: iconUrl, iconUploaded: true });
    }
  }, [updateContent, onChange]);

  const ctaOptions = [
    { label: "No call to action", value: "noCta" },
    { label: "Shop now", value: "shopNow" },
    { label: "Learn more", value: "learnMore" },
  ];

  return (
    <Card>
      <BlockStack>
        <TextField
          label={`${type.charAt(0) + type.slice(1).toLowerCase()} name`}
          value={localName}
          onChange={handleBadgeChange}
          placeholder={`Your ${type.toLowerCase()}`}
          autoComplete="off"
          helpText={
            <Text variant="bodySm" tone="subdued" as="p">
              Only visible to you. For your own internal reference.
            </Text>
          }
        />
        <div
          style={{
            marginTop: "10px",
          }}
        ></div>
        <Bleed marginInline="400">
          <Divider />
        </Bleed>
      </BlockStack>
      <div style={{ margin: "10px" }}></div>
      <BlockStack gap={"400"}>
        <TextField
          label="Title"
          value={localText}
          onChange={handleTextChange}
          autoComplete="off"
        />

        <BlockStack>
          <Text as="p" variant="bodyMd">
            Icon
          </Text>
          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <div
              style={{
                minWidth: "fit",
              }}
            >
              {badge.content.iconUploaded && (
                <Thumbnail
                  source={
                    badge.content.icon ||
                    "https://rivmorkxomnwzdlytbgv.supabase.co/storage/v1/object/public/public/ecom-icons/delivery2.svg?width=32px"
                  }
                  alt="Icon preview"
                  size="large"
                />
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                width: "100%",
              }}
            >
              {badge.content.iconUploaded && (
                <Button
                  onClick={handleRemoveIcon}
                  variant="secondary"
                  tone="critical"
                  fullWidth
                >
                  Remove icon
                </Button>
              )}
              <Button
                fullWidth
                onClick={handleUploadIcon}
                disabled={badge.content.iconUploaded}
              >
                Upload Icon
              </Button>
            </div>
          </div>
        </BlockStack>

        {/* <Select
          label="Call to action"
          options={ctaOptions}
          value={badge.content.callToAction || "noCta"}
          onChange={(value) => updateContent("callToAction", value)}
        /> */}

        <Text as="p" variant="bodySm" tone="subdued">
          Available with Starter plan.{" "}
          <a href="#" style={{ color: "blue" }}>
            Upgrade now.
          </a>
        </Text>
        <Bleed marginInline="400">
          <Divider />
        </Bleed>
      </BlockStack>
      <div style={{ margin: "10px" }}></div>
      <div style={{ margin: "10px" }}></div>
      <div
        style={{
          marginTop: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <Text as="p" variant="headingSm">
            Translations
          </Text>
          <Badge tone="info">Essential plan</Badge>
        </div>
        <Button fullWidth>Add translation</Button>
        <Bleed marginInline="400">
          <Divider />
        </Bleed>
      </div>
      <Button fullWidth>Continue to design</Button>
    </Card>
  );
};

export default ContentForm;
