"use client";
import {
  Badge,
  Bleed,
  BlockStack,
  Button,
  ButtonGroup,
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
import {Modal, TitleBar, useAppBridge} from '@shopify/app-bridge-react';

export const BadgeBuilder = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  
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

  const [selectedTab, setSelectedTab] = useState<number>(0);

  const handleTabChange = useCallback(
    (selectedTabIndex: any) => {
      console.log("Tab changed to:", selectedTabIndex);
      setSelectedTab(selectedTabIndex);
    },
    []
  );

  return (
    <Modal variant="max" open={isModalOpen}>
      <TitleBar title="Badge Editor" />
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
          {
            content: "Close",
            onAction: () => setIsModalOpen(false),
          },
        ]}
      >
        {/* Custom Tab Implementation */}
        <div style={{ marginBottom: "1rem" }}>
          <ButtonGroup variant="segmented">
            <Button
              pressed={selectedTab === 0}
              onClick={() => handleTabChange(0)}
            >
              Content
            </Button>
            <Button
              pressed={selectedTab === 1}
              onClick={() => handleTabChange(1)}
            >
              Design
            </Button>
            <Button
              pressed={selectedTab === 2}
              onClick={() => handleTabChange(2)}
            >
              Placement
            </Button>
            <Button
              pressed={selectedTab === 3}
              onClick={() => handleTabChange(3)}
            >
              Display
            </Button>
          </ButtonGroup>
        </div>
        
        <div
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "25% 75%",
            alignItems: "flex-start",
          }}
        >
          <div>
            {selectedTab === 0 && <ContentForm />}
            {selectedTab === 1 && <DesignForm />}
            {selectedTab === 2 && <PlacementForm />}
            {selectedTab === 3 && <DisplayForm />}
          </div>
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
    </Modal>
  );
};
