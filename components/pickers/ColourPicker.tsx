import React, { useState, useCallback, useEffect } from "react";
import {
  Card,
  TextField,
  Popover,
  Button,
  Box,
  Text,
  InlineStack,
} from "@shopify/polaris";

export default function ColorPickerInput({
  label = "",
  value,
  onChange,
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [hex, setHex] = useState(value || "#7700ff");
  const [active, setActive] = useState(false);

  // Update local state when prop value changes
  useEffect(() => {
    if (value) {
      setHex(value);
    }
  }, [value]);

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const handleHexChange = (value: string) => {
    setHex(value);
    onChange(value);
  };

  const handleColorInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setHex(newColor);
    onChange(newColor);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "start",
        gap: "3px",
        minWidth: "150px",
        flexDirection: "column",
      }}
    >
      {label && <Text as="h4">{label}</Text>}
      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "end",
          minWidth: "150px",
        }}
      >
        <Popover
          active={active}
          activator={
            <div
              style={{
                cursor: "pointer",
                backgroundColor: hex,
                width: "35px",
                height: "35px",
                borderRadius: "4px",
                border: "2px solid #ddd",
                position: "relative",
                overflow: "hidden"
              }}
              onClick={toggleActive}
            >
              <input
                type="color"
                value={hex}
                onChange={handleColorInputChange}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                  cursor: "pointer",
                  border: "none",
                  padding: 0,
                  margin: 0
                }}
              />
            </div>
          }
          onClose={toggleActive}
        >
          <Card>
            <div style={{ padding: "16px", width: "200px" }}>
              <Text variant="bodyMd" as="p" style={{ marginBottom: "8px" }}>
                Choose Color
              </Text>
              <input
                type="color"
                value={hex}
                onChange={handleColorInputChange}
                style={{
                  width: "100%",
                  height: "40px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginBottom: "8px"
                }}
              />
              <TextField
                value={hex}
                label="Hex Value"
                onChange={handleHexChange}
                autoComplete="off"
                prefix="#"
              />
            </div>
          </Card>
        </Popover>

        <TextField
          value={hex}
          label=""
          onChange={handleHexChange}
          autoComplete="off"
          prefix="#"
        />
      </div>
    </div>
  );
}


