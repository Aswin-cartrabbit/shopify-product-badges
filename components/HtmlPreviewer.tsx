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
          background: "#f6f6f7", // Match the new preview background
          borderRadius: "12px",
          padding: "0", // Remove extra padding
          minHeight: "400px",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            width: getWidth(),
            transition: "all 0.4s ease-in-out", // smooth resize
            margin: "0 auto", // keep centered
            display: "flex",
            justifyContent: "center",
            // Remove the border that was causing visual issues
          }}
        >
          <div style={{ width: "100%" }}>
            <TemplatePreview 
              key={`preview-${selectedTemplate?.id || 'default'}`}
              selectedTemplate={selectedTemplate} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
