import {
  Page,
  Badge,
  Card,
  RadioButton,
  TextField,
  BlockStack,
  Text,
  Divider,
  Bleed,
  Button,
  Thumbnail,
  InlineStack,
  Select,
  LegacyCard,
  Tabs,
} from "@shopify/polaris";
import React, { useCallback, useState } from "react";
import DesignForm from "./DesignForm";

export const BadgeBuilder = () => {
  const getBadges = (status: "DRAFT" | "ACTIVE") => {
    switch (status) {
      case "DRAFT":
        return <Badge tone="attention">Draft</Badge>;
      case "ACTIVE":
        return <Badge tone="success">Active</Badge>;
    }
  };

  // Example usage of the getBadges function
  const currentStatus: "DRAFT" | "ACTIVE" = "ACTIVE";
  const [badgeType, setBadgeType] = useState("single");
  const [badgeName, setBadgeName] = useState("");

  const handleBadgeChange = useCallback(
    (newValue) => setBadgeName(newValue),
    []
  );
  const handleBadgeTypeChange = useCallback((value) => setBadgeType(value), []);
  const [title, setTitle] = useState("Free Shipping");
  const [subheading, setSubheading] = useState(
    "Delivered to Your doorstep, on us!"
  );
  const [icon, setIcon] = useState("/icons/truck.png"); // Example placeholder
  const [iconUploaded, setIconUploaded] = useState(true);

  const handleTitleChange = useCallback((value) => setTitle(value), []);
  const handleSubheadingChange = useCallback(
    (value) => setSubheading(value),
    []
  );
  const handleRemoveIcon = useCallback(() => {
    setIcon("");
    setIconUploaded(false);
  }, []);
  const handleUploadIcon = useCallback(() => {
    // You'd trigger file input here
    setIcon("/icons/truck.png");
    setIconUploaded(true);
  }, []);

  const options = [
    { label: "No call to action", value: "noCta" },
    { label: "Shop now", value: "shopNow" },
    { label: "Learn more", value: "learnMore" },
  ];
  const [selected, setSelected] = useState("noCta");

  const handleSelectChange = useCallback((value) => setSelected(value), []);
  const tabs = [
    {
      id: "content",
      content: "Content",
      accessibilityLabel: "Content",
      panelID: "content",
    },
    {
      id: "design",
      content: "Design",
      panelID: "design",
    },
    {
      id: "placement",
      content: "Placement",
      panelID: "placement",
    },
  ];
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const handleTabChange = useCallback(
    (selectedTabIndex: any) => setSelectedTab(selectedTabIndex),
    []
  );

  // Content Tab Component
  const ContentTab = () => (
    <Card>
      <BlockStack>
        <Text variant="headingMd" as="h2">
          Badge type
        </Text>

        <RadioButton
          label="Single banner"
          checked={badgeType === "single"}
          id="single"
          name="badgeType"
          onChange={() => handleBadgeTypeChange("single")}
        />
        <RadioButton
          label="Icon block"
          checked={badgeType === "icon"}
          id="icon"
          name="badgeType"
          onChange={() => handleBadgeTypeChange("icon")}
        />
        <RadioButton
          label="Payment icons"
          checked={badgeType === "payment"}
          id="payment"
          name="badgeType"
          onChange={() => handleBadgeTypeChange("payment")}
        />

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
          value={title}
          onChange={handleTitleChange}
          autoComplete="off"
        />
        <TextField
          label="Subheading"
          value={subheading}
          onChange={handleSubheadingChange}
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
              {iconUploaded && (
                <Thumbnail
                  source={
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
              {iconUploaded && (
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
                disabled={iconUploaded}
              >
                Upload Icon
              </Button>
            </div>
          </div>
        </BlockStack>
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

      <BlockStack gap={"400"}>
        <Select
          label="Call to action"
          options={options}
          onChange={handleSelectChange}
          value={selected}
        />
        <Bleed marginInline="400">
          <Divider />
        </Bleed>
      </BlockStack>
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

  // Design Tab Component
  const DesignTab = () => <DesignForm />;

  // Placement Tab Component
  const PlacementTab = () => (
    <Card>
      <BlockStack gap="400">
        <Text variant="headingMd" as="h2">
          Badge Placement
        </Text>

        <Select
          label="Page Location"
          options={[
            { label: "Product Page", value: "product" },
            { label: "Collection Page", value: "collection" },
            { label: "Cart Page", value: "cart" },
            { label: "Checkout Page", value: "checkout" },
          ]}
          onChange={() => {}}
          value="product"
        />

        <Select
          label="Position"
          options={[
            { label: "Top Left", value: "topLeft" },
            { label: "Top Right", value: "topRight" },
            { label: "Bottom Left", value: "bottomLeft" },
            { label: "Bottom Right", value: "bottomRight" },
            { label: "Center", value: "center" },
          ]}
          onChange={() => {}}
          value="topRight"
        />

        <RadioButton
          label="Show on all products"
          checked={true}
          id="allProducts"
          name="visibility"
          onChange={() => {}}
        />
        <RadioButton
          label="Show on specific products only"
          checked={false}
          id="specificProducts"
          name="visibility"
          onChange={() => {}}
        />

        <TextField
          label="Custom CSS Class"
          value=""
          onChange={() => {}}
          autoComplete="off"
          placeholder="custom-badge-class"
        />

        <Button fullWidth>Save Placement Settings</Button>
      </BlockStack>
    </Card>
  );

  // Function to render content based on selected tab
  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return <ContentTab />;
      case 1:
        return <DesignTab />;
      case 2:
        return <PlacementTab />;
      default:
        return <ContentTab />;
    }
  };

  return (
    <Page
      fullWidth
      backAction={{ content: "Products", url: "#" }}
      title="Your badge"
      titleMetadata={getBadges(currentStatus)}
      subtitle="Badge ID: 303cad73-3c53-481c-bad5-7f1fd81ea330"
      // compactTitle
      primaryAction={{
        content: "Save",
        disabled: false,
        onAction: () => alert("Save action"),
      }}
      secondaryActions={[
        {
          content: "Duplicate",
          accessibilityLabel: "Secondary action label",
          onAction: () => alert("Duplicate action"),
        },
        {
          content: "View on your store",
          onAction: () => alert("View on your store action"),
        },
      ]}
    >
      <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange} />
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "25% 75%",
        }}
      >
        {renderTabContent()}
        <Card>
          <div style={{ padding: "1rem" }}>
            <h3>Product Information</h3>
            <p>
              This is a high-quality leather pet collar perfect for dogs and
              cats.
            </p>
            <p>Available in multiple sizes and colors.</p>

            <div style={{ marginTop: "1rem" }}>
              <p>
                <strong>Current Status:</strong> {getBadges(currentStatus)}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Page>
  );
};
