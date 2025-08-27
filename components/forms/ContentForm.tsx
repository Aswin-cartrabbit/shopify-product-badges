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
import { useCallback, useState } from "react";
import { useBadgeStore } from "@/stores/BadgeStore";
import React from "react";

const ContentForm = ({ badgeName, setBadgeName }) => {
  const { badge, updateContent } = useBadgeStore();
  // Local state for form elements not directly related to badge data

  const handleBadgeChange = useCallback(
    (newValue: string) => setBadgeName(newValue),
    []
  );

  const handleRemoveIcon = useCallback(() => {
    updateContent("icon", "");
    updateContent("iconUploaded", false);
  }, [updateContent]);

  const handleUploadIcon = useCallback(() => {
    // You'd trigger file input here
    updateContent("icon", "/icons/truck.png");
    updateContent("iconUploaded", true);
  }, [updateContent]);

  const ctaOptions = [
    { label: "No call to action", value: "noCta" },
    { label: "Shop now", value: "shopNow" },
    { label: "Learn more", value: "learnMore" },
  ];

  return (
    <Card>
      <BlockStack>
        <TextField
          label="Badge name"
          value={badgeName}
          onChange={handleBadgeChange}
          placeholder="Your badge"
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
          value={badge.content.text}
          onChange={(value) => updateContent("text", value)}
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
