"use client";
import { GridPosition, useBadgeStore } from "@/stores/BadgeStore";
import { useState } from "react";

interface Position {
  id: string;
  position: GridPosition;
  selected: boolean;
}

export default function GridPositionComponent() {
  const { updatePlacement, badge } = useBadgeStore();
  const [positions, setPositions] = useState<Position[]>(() => {
    const positionOrder = [
      GridPosition.TOP_LEFT,
      GridPosition.TOP_CENTER,
      GridPosition.TOP_RIGHT,
      GridPosition.MIDDLE_LEFT,
      GridPosition.MIDDLE_CENTER,
      GridPosition.MIDDLE_RIGHT,
      GridPosition.BOTTOM_LEFT,
      GridPosition.BOTTOM_CENTER,
      GridPosition.BOTTOM_RIGHT,
    ];

    return positionOrder.map((pos, index) => ({
      id: `${index}`,
      position: pos,
      selected: false,
    }));
  });
  console.log(positions);
  const selectPosition = (id: string) => {
    setPositions((prev) =>
      prev.map((pos) => ({
        ...pos,
        selected: pos.id === id ? !pos.selected : false,
      }))
    );
    const clickedPosition = positions.find((pos) => pos.id === id);
    if (clickedPosition) {
      updatePlacement(
        "position",
        clickedPosition.selected ? null : clickedPosition.position
      );
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "12px",
        padding: "0",
      }}
    >
      {positions.map((position) => (
        <div
          key={position.id}
          onClick={() => selectPosition(position.id)}
          style={{
            height: "80px",
            backgroundColor: position.selected ? "#d1d5db" : "#ffffff",
            border: "2px solid #e5e7eb",
            borderRadius: "12px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
            userSelect: "none",
            position: "relative",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#9ca3af";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#e5e7eb";
          }}
        >
          {position.selected && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "24px",
              }}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
}
