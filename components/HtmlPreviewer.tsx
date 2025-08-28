import React, { useState } from "react";
import {
  Card,
  Button,
  ButtonGroup,
  Icon,
  InlineStack,
  Box,
  Bleed,
  Divider,
  BlockStack,
} from "@shopify/polaris";
import { TabletIcon, MobileIcon } from "@shopify/polaris-icons";
import TemplatePreview from "./TemplatePreview";

interface HtmlPreviewerProps {
  selectedTemplate?: any;
}

export default function HtmlPreviewer({ selectedTemplate }: HtmlPreviewerProps) {
  const [device, setDevice] = useState("desktop");

  const getWidth = () => {
    switch (device) {
      case "mobile":
        return "375px";
      case "tablet":
        return "768px";
      default:
        return "100%";
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "5px",
        }}
      >
        <ButtonGroup variant="segmented">
          <Button
            pressed={device === "desktop"}
            onClick={() => setDevice("desktop")}
            icon={TabletIcon}
          >
            Desktop
          </Button>
         
          <Button
            pressed={device === "mobile"}
            onClick={() => setDevice("mobile")}
            icon={MobileIcon}
          >
            Mobile
          </Button>
        </ButtonGroup>
      </div>
      <Bleed marginInline="400">
        <Divider />
      </Bleed>
      {/* Preview Area */}
      <div
        style={{
          background: "#fff", // Polaris token "bg-surface" is just white
          borderRadius: "12px", // Polaris border-radius="200"
          padding: "1.5rem", // Polaris padding="400"
          minHeight: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: getWidth(),
            transition: "all 0.4s ease-in-out", // smooth resize
            margin: "0 auto", // keep centered
            display: "flex",
            justifyContent: "center",
            border: "1px solid #ddd",
            padding: "20px",
          }}
        >
          <div style={{ width: "100%" }}>
            <TemplatePreview 
              key={`preview-${selectedTemplate?.id || 'default'}-${Date.now()}`}
              selectedTemplate={selectedTemplate} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
