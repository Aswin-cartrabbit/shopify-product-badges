import React from "react";
import { Select, Button, ButtonGroup, BlockStack, InlineStack, Text } from "@shopify/polaris";
import { 
  ArrowLeftIcon,
  ArrowDiagonalIcon,
  ArrowRightIcon
} from "@shopify/polaris-icons";

// Define text alignment options
export enum BadgeAlignment {
  LEFT = "LEFT",
  CENTER = "CENTER",
  RIGHT = "RIGHT"
}

// Define all badge positions from screenshot
export enum BadgeHorizontalPosition {
  ABOVE_PRODUCT_TITLE = "ABOVE_PRODUCT_TITLE",
  BELOW_PRODUCT_TITLE = "BELOW_PRODUCT_TITLE",
  ABOVE_PRODUCT_PRICE = "ABOVE_PRODUCT_PRICE",
  BELOW_PRODUCT_PRICE = "BELOW_PRODUCT_PRICE",
  BELOW_PRODUCT_IMAGE = "BELOW_PRODUCT_IMAGE",
  BEFORE_PRODUCT_TITLE = "BEFORE_PRODUCT_TITLE",
  AFTER_PRODUCT_TITLE = "AFTER_PRODUCT_TITLE",
  BEFORE_PRODUCT_PRICE = "BEFORE_PRODUCT_PRICE",
  AFTER_PRODUCT_PRICE = "AFTER_PRODUCT_PRICE"
}

interface BadgeHorizontalPositionProps {
  selectedPosition: BadgeHorizontalPosition;
  onPositionChange: (position: BadgeHorizontalPosition) => void;
}

interface BadgeAlignmentProps {
  selectedAlignment: BadgeAlignment;
  onAlignmentChange: (alignment: BadgeAlignment) => void;
}

const BadgeAlignmentComponent = ({ selectedAlignment, onAlignmentChange }: BadgeAlignmentProps) => {
  const alignmentOptions = [
    { value: BadgeAlignment.LEFT, icon: ArrowLeftIcon, label: "Left" },
    { value: BadgeAlignment.CENTER, icon: ArrowDiagonalIcon, label: "Center" },
    { value: BadgeAlignment.RIGHT, icon: ArrowRightIcon, label: "Right" }
  ];

  return (
    <div style={{ display: "inline-block", width: "100%" }}>
      <div style={{ display: "flex", gap: "4px" }}>
        {alignmentOptions.map((option) => (
          <Button
            key={option.value}
            size="medium"
            fullWidth={true}
            pressed={selectedAlignment === option.value}
            onClick={() => onAlignmentChange(option.value)}
            icon={option.icon}
          />
        ))}
      </div>
    </div>
  );
};

const BadgeHorizontalPositionComponent = ({ selectedPosition, onPositionChange }: BadgeHorizontalPositionProps) => {
  const positionOptions = [
    { label: "Above product title", value: BadgeHorizontalPosition.ABOVE_PRODUCT_TITLE },
    { label: "Below product title", value: BadgeHorizontalPosition.BELOW_PRODUCT_TITLE },
    { label: "Above product price", value: BadgeHorizontalPosition.ABOVE_PRODUCT_PRICE },
    { label: "Below product price", value: BadgeHorizontalPosition.BELOW_PRODUCT_PRICE },
    { label: "Below product image", value: BadgeHorizontalPosition.BELOW_PRODUCT_IMAGE },
    { label: "Before product title", value: BadgeHorizontalPosition.BEFORE_PRODUCT_TITLE },
    { label: "After product title", value: BadgeHorizontalPosition.AFTER_PRODUCT_TITLE },
    { label: "Before product price", value: BadgeHorizontalPosition.BEFORE_PRODUCT_PRICE },
    { label: "After product price", value: BadgeHorizontalPosition.AFTER_PRODUCT_PRICE }
  ];

  return (
    <BlockStack gap="300">
      <Select
        label="Position"
        options={positionOptions}
        value={selectedPosition}
        onChange={(value) => onPositionChange(value as BadgeHorizontalPosition)}
      />
    </BlockStack>
  );
};

export default BadgeHorizontalPositionComponent;
export { BadgeAlignmentComponent };
