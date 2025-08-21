import { Page, Badge, Card } from "@shopify/polaris";
import React from "react";

export const BadgeBuilder = () => {
  const getBadges = (status: "DRAFT" | "ACTIVE") => {
    switch (status) {
      case "DRAFT":
        return <Badge tone="info">Draft</Badge>;
      case "ACTIVE":
        return <Badge tone="success">Active</Badge>;
    }
  };

  // Example usage of the getBadges function
  const currentStatus: "DRAFT" | "ACTIVE" = "ACTIVE";

  return (
    <Page
      backAction={{ content: "Products", url: "#" }}
      title="3/4 inch Leather pet collar"
      titleMetadata={getBadges(currentStatus)}
      subtitle="Perfect for any pet"
      compactTitle
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
      pagination={{
        hasPrevious: true,
        hasNext: true,
      }}
    >
      <div style={{ marginBottom: "1rem" }}>
        <Card>
          <div style={{ padding: "1rem" }}>
            <h3>Product Status Examples</h3>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
              {getBadges("DRAFT")}
              {getBadges("ACTIVE")}
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ padding: "1rem" }}>
          <h3>Product Information</h3>
          <p>
            This is a high-quality leather pet collar perfect for dogs and cats.
          </p>
          <p>Available in multiple sizes and colors.</p>

          <div style={{ marginTop: "1rem" }}>
            <p>
              <strong>Current Status:</strong> {getBadges(currentStatus)}
            </p>
          </div>
        </div>
      </Card>

      <div style={{ marginTop: "1rem" }}>
        <Card>
          <div style={{ padding: "1rem" }}>
            <h3>Additional Details</h3>
            <ul>
              <li>Material: Genuine leather</li>
              <li>Width: 3/4 inch</li>
              <li>Available sizes: Small, Medium, Large</li>
              <li>Colors: Black, Brown, Red</li>
            </ul>
          </div>
        </Card>
      </div>
    </Page>
  );
};
