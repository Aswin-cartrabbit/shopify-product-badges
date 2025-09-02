import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  Bleed,
  Divider,
} from "@shopify/polaris";
import { TabletIcon, MobileIcon } from "@shopify/polaris-icons";
import TemplatePreview from "./TemplatePreview";

interface HtmlPreviewerProps {
  selectedTemplate?: any;
  type?: "BADGE" | "LABEL";
}

export default function HtmlPreviewer({ selectedTemplate, type = "BADGE" }: HtmlPreviewerProps) {
  const [device, setDevice] = useState("desktop");

  return (
    <div>
      {/* Device Toggle - Top Container */}
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
          padding: device === 'mobile' ? "20px" : "0", // Add padding for mobile frame
          minHeight: "400px",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: device === 'mobile' ? "flex-start" : "center"
        }}
      >
        <div
          style={{
            width: device === "mobile" ? "375px" : "100%",
            transition: "all 0.4s ease-in-out", // smooth resize
            margin: "0 auto", // keep centered
            display: "flex",
            justifyContent: "center",
            // Mobile frame styling
            ...(device === 'mobile' && {
              border: "3px solid #ddd",
              borderRadius: "25px",
              padding: "20px 10px",
              backgroundColor: "rgb(246, 246, 247)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
              position: "relative"
            })
          }}
        >
          {device === 'mobile' && (
            <>
              {/* Mobile notch */}
              <div style={{
                position: "absolute",
                top: "8px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "60px",
                height: "4px",
                backgroundColor: "#999",
                borderRadius: "2px"
              }} />
              {/* Mobile home indicator */}
              <div style={{
                position: "absolute",
                bottom: "8px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "40px",
                height: "4px",
                backgroundColor: "#999",
                borderRadius: "2px"
              }} />
            </>
          )}
          <div style={{ 
            width: "100%",
            backgroundColor: device === 'mobile' ? "#fff" : "transparent",
            borderRadius: device === 'mobile' ? "15px" : "0",
            overflow: "hidden"
          }}>
            <TemplatePreview 
              key={`preview-${selectedTemplate?.id || 'default'}`}
              selectedTemplate={selectedTemplate}
              device={device}
              type={type}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
