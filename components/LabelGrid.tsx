import React, { useState } from "react";
import {
  Text,
  InlineStack,
  BlockStack,
  Tooltip,
  Box,
  Avatar,
} from "@shopify/polaris";
import { Modal, TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { useBadgeStore } from "@/stores/BadgeStore";
import ColorPickerInput from "./pickers/ColourPicker";

const LabelGrid = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const data = [
{
"src": "https://cdn.shopify.com/s/files/1/0746/2705/5920/files/Previewimage_350x350.png?v=1718609223",
"css": "clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
"description": "Rectangle/Square"
},
{
"src": "https://cdn.shopify.com/s/files/1/0746/2705/5920/files/Previewimage-2_350x350.png?v=1718609326",
"css": "clip-path: circle(50% at 50% 50%)",
"description": "Circle"
},
{
"src": "https://cdn.shopify.com/s/files/1/0746/2705/5920/files/Previewimage-4_350x350.png?v=1718609442",
"css": "clip-path: polygon(50% 0%, 63.23% 9.3%, 79.39% 9.55%, 84.62% 24.84%, 97.55% 34.55%, 92.8% 50%, 97.55% 65.45%, 84.62% 75.16%, 79.39% 90.45%, 63.23% 90.7%, 50% 100%, 36.77% 90.7%, 20.61% 90.45%, 15.38% 75.16%, 2.45% 65.45%, 7.2% 50%, 2.45% 34.55%, 15.38% 24.84%, 20.61% 9.55%, 36.77% 9.3%)",
"description": "Star"
},
{
"src": "https://cdn.shopify.com/s/files/1/0746/2705/5920/files/Previewimage-7_350x350.png?v=1718609592",
"css": "clip-path:polygon(100% 0,100% 100%,0% 100%,25% 50%,0% 0%)",
"description": "Pentagon/Arrow Right"
},
{
"src": "https://nkjnt347v17jvtoh-74627055920.shopifypreview.com/cdn/shop/files/Rectangle34624716_720x.png?v=1754472146",
"css": "clip-path:polygon(25% 0%,100% 0%,100% 100%,25% 100%,0% 50%)",
"description": "Parallelogram Right"
},
{
"src": "https://nkjnt347v17jvtoh-74627055920.shopifypreview.com/cdn/shop/files/Rectangle40332_720x.png?v=1754471973",
"css": "clip-path: polygon(0% 0%,75% 0%,100% 50%,75% 100%,0% 100%)",
"description": "Rectangle"
},


{
"src": "https://aot6qt8p4y2td8wy-74627055920.shopifypreview.com/cdn/shop/files/Vector_b0219c19-3a48-40fe-8284-46e29ea8ea83_720x.png?v=1754016404",
"css": "clip-path: xywh(0 0 100% 100% round 2rem 0)",
"description": "Right Triangle Top"
},
{
"src": "https://aot6qt8p4y2td8wy-74627055920.shopifypreview.com/cdn/shop/files/Vector_69897490-974a-483d-abfd-e4e16b149555_720x.png?v=1754017980",
"css": "clip-path:xywh(0 0 100% 100% round 0 2rem)",
"description": "Rounded Rectangle"
},
{
"src": "https://aot6qt8p4y2td8wy-74627055920.shopifypreview.com/cdn/shop/files/Vector_720x.png?v=1754016031",
"css": "clip-path: polygon(85% 0%,100% 50%,85% 100%,0% 100%,15% 50%,0% 0%)",
"description": "Trapezoid"
},
{
"src": "https://aot6qt8p4y2td8wy-74627055920.shopifypreview.com/cdn/shop/files/Vector_e87f0f25-6db9-4a41-8178-c80ceb70c3e7_720x.png?v=1754016509",
"css": "clip-path:polygon(100% 0%,85% 50%,100% 100%,15% 100%,0% 50%,15% 0%)",
"description": "Hexagon"
},
{
"src": "https://aot6qt8p4y2td8wy-74627055920.shopifypreview.com/cdn/shop/files/Rectangle34624658_720x.png?v=1754016605",
"css": "clip-path: polygon(100% 0%,85% 50%,100% 100%,0 100%,15% 50%,0 0)",
"description": "Parallelogram"
},
{
"src": "https://aot6qt8p4y2td8wy-74627055920.shopifypreview.com/cdn/shop/files/Vector_16ca299e-9d53-4e79-b8dd-9f597899301c_720x.png?v=1754016736",
"css": "clip-path:polygon(100% 0%,85% 50%,100% 100%,0 100%,0 50%,0 0)",
"description": "Arrow Right"
},
{
"src": "https://aot6qt8p4y2td8wy-74627055920.shopifypreview.com/cdn/shop/files/Vector_b8a75c38-d00b-41b6-8f91-c077decbc2ef_720x.png?v=1754016878",
"css": "clip-path:polygon(100% 0%,100% 50%,100% 100%,0 100%,15% 50%,0 0)",
"description": "Arrow Left"
},
{
"src": "https://aot6qt8p4y2td8wy-74627055920.shopifypreview.com/cdn/shop/files/Rectangle34624663_720x.png?v=1754017197",
"css": "clip-path: xywh(0 0 100% 100% round 4rem 0 0 0)",
"description": "Parallelogram Reverse"
},
{
"src": "https://aot6qt8p4y2td8wy-74627055920.shopifypreview.com/cdn/shop/files/Rectangle34624662_720x.png?v=1754017302",
"css": "clip-path: polygon(0% 0%, 80% 0%, 100% 100%, 20% 100%)",
"description": "Parallelogram Forward"
},
{
"src": "https://aot6qt8p4y2td8wy-74627055920.shopifypreview.com/cdn/shop/files/Rectangle34624664_720x.png?v=1754017406",
"css": "clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
"description": "Trapezoid Bottom"
},



  ];

  const { badge, updateDesign } = useBadgeStore();

  const handleShapeSelect = (index) => {
    setSelectedIndex(index);
    const selectedShape = data[index];
    updateDesign("shape", selectedShape.css);
    console.log("Shape selected:", selectedShape.description, selectedShape.css);
  };

  const renderShapeGrid = () => {
    const rows = [];
    for (let i = 0; i < data.length; i += 4) {
      const rowImages = data.slice(i, i + 4);
      rows.push(
        <InlineStack key={i} gap="400" align="start">
          {rowImages.map((src, rowIndex) => {
            const actualIndex = i + rowIndex;
            const isSelected = selectedIndex === actualIndex;
            return (
              <div
                onClick={() => handleShapeSelect(actualIndex)}
                style={{
                  width: "55px",
                  height: "55px",
                  backgroundColor: isSelected ? "#f6f6f7" : "#ffffff",
                  border: isSelected
                    ? "2px solid #001e80ff"
                    : "1.5px solid #d9d9d9",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.15s ease-in-out",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: isSelected
                    ? "0 0 0 1px #008060"
                    : "0 1px 2px rgba(0, 0, 0, 0.05)",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    // @ts-ignore
                    e.target.style.borderColor = "#b3b3b3";
                    // @ts-ignore
                    e.target.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    // @ts-ignore
                    e.target.style.borderColor = "#d9d9d9";
                    // @ts-ignore
                    e.target.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
                  }
                }}
              >
                <img
                  src={src.src}
                  alt={`Badge shape ${actualIndex + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    padding: "8px",
                  }}
                />
              </div>
            );
          })}
        </InlineStack>
      );
    }
    return rows;
  };

  return (
    <BlockStack gap="300">
      <BlockStack gap="200">
        <Tooltip
          content="Choose from our collection of professionally designed badge shapes to match your store's aesthetic"
          preferredPosition="above"
        >
          <Text as="h3" variant="headingMd" fontWeight="semibold" tone="base">
            Select shape
          </Text>
        </Tooltip>

        <Text as="p" variant="bodySm" tone="subdued">
          Choose a badge shape that complements your product images
        </Text>
      </BlockStack>

      <div
        style={{
          height: "280px",
          overflowY: "auto",
          paddingRight: "3px",
        }}
      >
        <BlockStack gap="300">{renderShapeGrid()}</BlockStack>
      </div>
    </BlockStack>
  );
};

export default LabelGrid;
