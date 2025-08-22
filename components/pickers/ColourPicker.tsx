import React, { useState, useCallback } from "react";
import {
  Card,
  ColorPicker,
  TextField,
  Popover,
  Button,
  Box,
  Text,
  InlineStack,
} from "@shopify/polaris";

export default function ColorPickerInput({ label = "" }) {
  const [color, setColor] = useState({
    hue: 120,
    brightness: 1,
    saturation: 1,
  });
  const [hex, setHex] = useState("#00FF00");
  const [active, setActive] = useState(false);

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const handleColorChange = (value: any) => {
    setColor(value);
    const hexValue = hsbToHex(value.hue, value.saturation, value.brightness);
    setHex(hexValue);
  };

  const handleHexChange = (value: string) => {
    setHex(value);
    // you can add a hex → hsb converter if needed
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
      <Text as="h4">{label}</Text>
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
                border: "3px solid #0000",
              }}
              onClick={toggleActive}
            ></div>
          }
          onClose={toggleActive}
        >
          <Card>
            <ColorPicker
              onChange={handleColorChange}
              color={color}
              allowAlpha
            />
          </Card>
        </Popover>

        <TextField
          value={hex}
          label=""
          onChange={handleHexChange}
          autoComplete="off"
        />
      </div>
    </div>
  );
}

// Simple HSB → HEX conversion helper
function hsbToHex(h: number, s: number, b: number) {
  // Polaris gives s and b as 0–1, convert to %
  s = s * 100;
  b = b * 100;

  const c = (b / 100) * (s / 100);
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = b / 100 - c;

  let r = 0,
    g = 0,
    bl = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    bl = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    bl = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    bl = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    bl = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    bl = c;
  } else {
    r = c;
    g = 0;
    bl = x;
  }

  const R = Math.round((r + m) * 255);
  const G = Math.round((g + m) * 255);
  const B = Math.round((bl + m) * 255);

  return (
    "#" +
    [R, G, B]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}
