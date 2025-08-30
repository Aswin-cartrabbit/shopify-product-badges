import React from "react";
import { Button, Icon } from "@shopify/polaris";
import { 
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon, 
  ArrowDownIcon, 
  ArrowDiagonalIcon 
} from "@shopify/polaris-icons";
import { GridPosition } from "@/stores/BadgeStore";

interface PositionGridProps {
  selectedPosition: GridPosition;
  onPositionChange: (position: GridPosition) => void;
}

const PositionGrid = ({ selectedPosition, onPositionChange }: PositionGridProps) => {
  const positions = [
    [GridPosition.TOP_LEFT, GridPosition.TOP_CENTER, GridPosition.TOP_RIGHT],
    [GridPosition.MIDDLE_LEFT, GridPosition.MIDDLE_CENTER, GridPosition.MIDDLE_RIGHT],
    [GridPosition.BOTTOM_LEFT, GridPosition.BOTTOM_CENTER, GridPosition.BOTTOM_RIGHT],
  ];

  const handlePositionClick = (position: GridPosition) => {
    onPositionChange(position);
  };



  const getPositionLabel = (position: GridPosition) => {
    switch (position) {
      case GridPosition.TOP_LEFT: return "Top Left";
      case GridPosition.TOP_CENTER: return "Top Center";
      case GridPosition.TOP_RIGHT: return "Top Right";
      case GridPosition.MIDDLE_LEFT: return "Middle Left";
      case GridPosition.MIDDLE_CENTER: return "Middle Center";
      case GridPosition.MIDDLE_RIGHT: return "Middle Right";
      case GridPosition.BOTTOM_LEFT: return "Bottom Left";
      case GridPosition.BOTTOM_CENTER: return "Bottom Center";
      case GridPosition.BOTTOM_RIGHT: return "Bottom Right";
      default: return "";
    }
  };

  const getPositionIcon = (position: GridPosition) => {
    switch (position) {
      case GridPosition.TOP_LEFT: return ArrowDiagonalIcon;
      case GridPosition.TOP_CENTER: return ArrowUpIcon;
      case GridPosition.TOP_RIGHT: return ArrowDiagonalIcon;
      case GridPosition.MIDDLE_LEFT: return ArrowLeftIcon;
      case GridPosition.MIDDLE_CENTER: return ArrowDiagonalIcon; // Center position
      case GridPosition.MIDDLE_RIGHT: return ArrowRightIcon;
      case GridPosition.BOTTOM_LEFT: return ArrowDiagonalIcon;
      case GridPosition.BOTTOM_CENTER: return ArrowDownIcon;
      case GridPosition.BOTTOM_RIGHT: return ArrowDiagonalIcon;
      default: return ArrowDiagonalIcon;
    }
  };

  const getIconRotation = (position: GridPosition) => {
    switch (position) {
      case GridPosition.TOP_LEFT: return "rotate(-45deg)"; // Point to top-left
      case GridPosition.TOP_RIGHT: return "rotate(45deg)"; // Point to top-right
      case GridPosition.BOTTOM_LEFT: return "rotate(-135deg)"; // Point to bottom-left
      case GridPosition.BOTTOM_RIGHT: return "rotate(135deg)"; // Point to bottom-right
      case GridPosition.MIDDLE_CENTER: return "rotate(0deg)"; // No rotation for center
      default: return "rotate(0deg)";
    }
  };

  return (
    <div style={{ 
      display: "flex", 
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      backgroundColor: "#f8f9fa",
      borderRadius: "8px",
      border: "1px solid #e1e3e5",
      width: "100%"
    }}>
      {/* 3x3 Grid Only */}
      <div style={{ display: "inline-block", width: "100%" }}>
        {positions.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex", gap: "4px", marginBottom: rowIndex < positions.length - 1 ? "4px" : "0" }}>
            {row.map((position) => {
              const isSelected = selectedPosition === position;
              
              return (
                <Button
                  key={position}
                  fullWidth={true}
                  pressed={isSelected}
                  onClick={() => handlePositionClick(position)}
                  icon={getPositionIcon(position)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PositionGrid;