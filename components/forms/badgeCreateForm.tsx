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
  Toast,
  Frame,
  Spinner,
} from "@shopify/polaris";
import React, { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/router";
import DesignForm from "./DesignForm";
import { useBadges, useBadge } from "@/components/hooks/useBadges";
import { useSubscription } from "@/components/hooks/useSubscription";
import { Badge as BadgeType, CreateBadgeData, UpdateBadgeData } from "@/utils/api/badges";

export const BadgeBuilder = () => {
  const router = useRouter();
  const { id: badgeId } = router.query;
  const isEditing = !!badgeId;
  
  // Hooks
  const { createBadge, updateBadge } = useBadges();
  const { badge, loading: badgeLoading, updateBadge: updateSingleBadge } = useBadge(badgeId as string);
  const { usage } = useSubscription();
  
  // UI State
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  
  // Form State
  const [badgeType, setBadgeType] = useState("single");
  const [badgeName, setBadgeName] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "ACTIVE" | "PAUSED" | "ARCHIVED">("DRAFT");

  const [title, setTitle] = useState("");
  const [subheading, setSubheading] = useState("");
  const [icon, setIcon] = useState("");
  const [iconUploaded, setIconUploaded] = useState(false);
  const [ctaText, setCtaText] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  
  // Design state
  const [designData, setDesignData] = useState<any>({});
  const [placementData, setPlacementData] = useState<any>({});
  const [targetingData, setTargetingData] = useState<any[]>([]);
  
  // Load existing badge data when editing
  useEffect(() => {
    if (badge && isEditing) {
      setBadgeName(badge.name || "");
      setBadgeType(getFormBadgeType(badge.type));
      setStatus(badge.status);
      setTitle(badge.title || "");
      setSubheading(badge.subheading || "");
      setIcon(badge.iconUrl || "");
      setIconUploaded(!!badge.iconUrl);
      setCtaText(badge.ctaText || "");
      setCtaUrl(badge.ctaUrl || "");
      setDesignData(badge.design || {});
      setPlacementData(badge.placement || {});
      setTargetingData(badge.targeting || []);
    }
  }, [badge, isEditing]);
  
  const getBadges = (status: "DRAFT" | "ACTIVE") => {
    switch (status) {
      case "DRAFT":
        return <Badge tone="attention">Draft</Badge>;
      case "ACTIVE":
        return <Badge tone="success">Active</Badge>;
    }
  };
  
  const getFormBadgeType = (apiType: string) => {
    switch (apiType) {
      case "SINGLE_BANNER":
        return "single";
      case "ICON_BLOCK":
        return "icon";
      case "PAYMENT_ICONS":
        return "payment";
      default:
        return "single";
    }
  };
  
  const getApiBadgeType = (formType: string) => {
    switch (formType) {
      case "single":
        return "SINGLE_BANNER";
      case "icon":
        return "ICON_BLOCK";
      case "payment":
        return "PAYMENT_ICONS";
      default:
        return "SINGLE_BANNER";
    }
  };
  
  const handleBadgeChange = useCallback(
    (newValue) => setBadgeName(newValue),
    []
  );
  const handleBadgeTypeChange = useCallback((value) => setBadgeType(value), []);

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
  
  const handleSave = async (shouldActivate = false) => {
    if (!badgeName.trim()) {
      setToastMessage("Badge name is required");
      return;
    }
    
    if (usage && !isEditing && usage.badges.current >= usage.badges.limit) {
      setToastMessage("Badge limit reached. Please upgrade your plan.");
      return;
    }
    
    setSaving(true);
    
    try {
      const badgeData = {
        name: badgeName,
        type: getApiBadgeType(badgeType) as any,
        title: title || undefined,
        subheading: subheading || undefined,
        iconUrl: icon || undefined,
        ctaText: ctaText || undefined,
        ctaUrl: ctaUrl || undefined,
        status: shouldActivate ? "ACTIVE" : status,
        design: Object.keys(designData).length > 0 ? designData : undefined,
        placement: Object.keys(placementData).length > 0 ? placementData : undefined,
        targeting: targetingData.length > 0 ? targetingData : undefined,
      };
      
      if (isEditing) {
        await updateSingleBadge(badgeData as UpdateBadgeData);
        setToastMessage("Badge updated successfully");
      } else {
        const newBadge = await createBadge(badgeData as CreateBadgeData);
        setToastMessage("Badge created successfully");
        router.push(`/badges/create?id=${newBadge.id}`);
      }
      
      if (shouldActivate) {
        setStatus("ACTIVE");
      }
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : "Failed to save badge");
    } finally {
      setSaving(false);
    }
  };
  
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
      <InlineStack gap="200">
        <Button 
          fullWidth 
          loading={saving}
          onClick={() => handleSave(false)}
        >
          Save as Draft
        </Button>
        <Button 
          fullWidth 
          variant="primary"
          loading={saving}
          onClick={() => handleSave(true)}
        >
          Save & Activate
        </Button>
      </InlineStack>
    </Card>
  );

  // Design Tab Component
  const DesignTab = () => (
    <DesignForm 
      data={designData} 
      onChange={setDesignData}
    />
  );

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

        <InlineStack gap="200">
          <Button 
            fullWidth 
            loading={saving}
            onClick={() => handleSave(false)}
          >
            Save as Draft
          </Button>
          <Button 
            fullWidth 
            variant="primary"
            loading={saving}
            onClick={() => handleSave(true)}
          >
            Save & Activate
          </Button>
        </InlineStack>
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

  if (badgeLoading && isEditing) {
    return (
      <Page title="Loading...">
        <Card>
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Spinner size="large" />
            <Text as="p">Loading badge...</Text>
          </div>
        </Card>
      </Page>
    );
  }
  
  return (
    <Frame>
      <Page
        fullWidth
        backAction={{ 
          content: "Badges", 
          onAction: () => router.push("/badges")
        }}
        title={isEditing ? `Edit: ${badgeName || "Badge"}` : "Create Badge"}
        titleMetadata={isEditing ? getBadges(status === "PAUSED" || status === "ARCHIVED" ? "DRAFT" : status as "DRAFT" | "ACTIVE") : undefined}
        subtitle={isEditing && badge ? `Badge ID: ${badge.id}` : "Create a new badge for your store"}
        primaryAction={{
          content: isEditing ? "Update Badge" : "Save Badge",
          loading: saving,
          onAction: () => handleSave(false),
        }}
        secondaryActions={isEditing ? [
          {
            content: status === "ACTIVE" ? "Deactivate" : "Activate",
            loading: saving,
            onAction: () => handleSave(status !== "ACTIVE"),
          },
          {
            content: "Duplicate",
            onAction: () => {
              // This would be handled by the parent component
              setToastMessage("Duplicate functionality coming soon");
            },
          },
        ] : []}
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
                <strong>Current Status:</strong> {getBadges(status as "DRAFT" | "ACTIVE")}
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Toast Messages */}
      {toastMessage && (
        <Toast 
          content={toastMessage} 
          onDismiss={() => setToastMessage(null)} 
        />
      )}
    </Page>
    </Frame>
  );
};
