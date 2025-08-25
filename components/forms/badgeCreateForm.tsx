"use client";
import {
  Badge,
  Bleed,
  BlockStack,
  Button,
  Card,
  Divider,
  Page,
  RadioButton,
  Select,
  Tabs,
  Text,
  TextField,
  Thumbnail,
} from "@shopify/polaris";
import { useCallback, useState } from "react";
import DesignForm from "./DesignForm";
import HtmlPreviewer from "../HtmlPreviewer";
import GridPosition from "../GridPosition";
import { useBadgeStore } from "@/stores/BadgeStore";
import ContentForm from "./ContentForm";
import DisplayForm from "./DisplayForm";
import PlacementForm from "./PlacementForm";

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
    {
      id: "display",
      content: "display",
      panelID: "display",
    },
  ];
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const handleTabChange = useCallback(
    (selectedTabIndex: any) => setSelectedTab(selectedTabIndex),
    []
  );

  // Design Tab Component
  const DesignTab = () => <DesignForm />;

  // Placement Tab Component

  // Function to render content based on selected tab
  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return <ContentForm />;
      case 1:
        return <DesignTab />;
      case 2:
        return <PlacementForm />;
      case 3:
        return <DisplayForm />;
      default:
        return <ContentForm />;
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
          alignItems: "flex-start",
        }}
      >
        <div>{renderTabContent()}</div>
        <div
          style={{
            position: "sticky",
            top: "1rem", // distance from top while scrolling
            height: "calc(100vh - 2rem)", // keep within viewport height
            overflow: "auto", // scroll inside preview if
          }}
        >
          <Card>
            <HtmlPreviewer />
          </Card>
        </div>
      </div>
    </Page>
  );
};
