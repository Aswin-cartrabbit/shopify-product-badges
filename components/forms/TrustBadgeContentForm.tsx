"use client";
import {
  Card,
  BlockStack,
  TextField,
  Text,
  ButtonGroup,
  Button,
  RangeSlider,
  Select,
  InlineStack,
  Checkbox,
  Divider,
  Icon,
} from "@shopify/polaris";
import { PlusIcon, DeleteIcon } from "@shopify/polaris-icons";
import { useState, useCallback } from "react";
import IconLibraryModal from "../IconLibraryModal";

interface TrustBadgeContentFormProps {
  data: any;
  onChange: (data: any) => void;
  badgeName: string;
  setBadgeName: (name: string) => void;
}

const TrustBadgeContentForm = ({ 
  data, 
  onChange, 
  badgeName, 
  setBadgeName 
}: TrustBadgeContentFormProps) => {
  const [showIconLibrary, setShowIconLibrary] = useState(false);
  
  console.log("TrustBadgeContentForm render - showIconLibrary:", showIconLibrary);
  
  const handleNameChange = useCallback(
    (value: string) => setBadgeName(value),
    [setBadgeName]
  );

  const handleLayoutChange = useCallback(
    (layout: string) => {
      onChange({ ...data, layout });
    },
    [data, onChange]
  );

  const handleIconSizeChange = useCallback(
    (size: number) => {
      onChange({ ...data, iconSize: size });
    },
    [data, onChange]
  );

  const handleSpacingChange = useCallback(
    (spacing: number) => {
      onChange({ ...data, spacing });
    },
    [data, onChange]
  );

  const handleTitleChange = useCallback(
    (title: string) => {
      onChange({ ...data, title });
    },
    [data, onChange]
  );

  const handleShowTitleChange = useCallback(
    (showTitle: boolean) => {
      onChange({ ...data, showTitle });
    },
    [data, onChange]
  );

  const handleRemoveIcon = useCallback(
    (iconId: string) => {
      const updatedIcons = data.icons.filter((icon: any) => icon.id !== iconId);
      onChange({ ...data, icons: updatedIcons });
    },
    [data, onChange]
  );

  const handleAddIcon = useCallback(
    (newIcon: any) => {
      const updatedIcons = [...(data.icons || []), newIcon];
      onChange({ ...data, icons: updatedIcons });
      setShowIconLibrary(false);
    },
    [data, onChange]
  );

  const handleUploadIcon = useCallback(() => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          const newIcon = {
            id: `custom-${Date.now()}`,
            name: file.name.split('.')[0],
            src: event.target.result
          };
          handleAddIcon(newIcon);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, [handleAddIcon]);

  return (
    <>
      <Card>
        <BlockStack gap="400">
          <Text as="h2" variant="headingMd">Content</Text>
          
          {/* Badge Name */}
          <TextField
            label="Badge name"
            value={badgeName}
            onChange={handleNameChange}
            autoComplete="off"
          />

          <Divider />

          {/* Title Settings */}
          <BlockStack gap="200">
            <Checkbox
              label="Show title"
              checked={data.showTitle}
              onChange={handleShowTitleChange}
            />
            
            {data.showTitle && (
              <TextField
                label="Title text"
                value={data.title || ""}
                onChange={handleTitleChange}
                autoComplete="off"
              />
            )}
          </BlockStack>

          <Divider />

          {/* Icon List */}
          <BlockStack gap="300">
            <Text as="h3" variant="headingSm">Payment Icons</Text>
            
            {data.icons && data.icons.length > 0 ? (
              <BlockStack gap="200">
                {data.icons.map((icon: any, index: number) => (
                  <Card key={icon.id} padding="200">
                    <InlineStack align="space-between" blockAlign="center">
                      <InlineStack gap="200" blockAlign="center">
                        <img 
                          src={icon.src} 
                          alt={icon.name}
                          style={{
                            width: "24px",
                            height: "auto",
                            objectFit: "contain"
                          }}
                        />
                        <Text as="span" variant="bodySm">
                          {icon.name}
                        </Text>
                      </InlineStack>
                      <Button
                        size="micro"
                        icon={DeleteIcon}
                        onClick={() => handleRemoveIcon(icon.id)}
                      />
                    </InlineStack>
                  </Card>
                ))}
              </BlockStack>
            ) : (
              <Text as="p" tone="subdued">
                No icons added yet
              </Text>
            )}

            {/* Add Icon Buttons */}
            <InlineStack gap="200">
              <Button
                icon={PlusIcon}
                onClick={handleUploadIcon}
                size="slim"
              >
                Upload Icon
              </Button>
              <Button
                icon={PlusIcon}
                onClick={() => {
                  console.log("Add from Library clicked!");
                  setShowIconLibrary(true);
                }}
                size="slim"
                variant="secondary"
              >
                Add from Library
              </Button>
            </InlineStack>
          </BlockStack>

          <Divider />

          {/* Layout Options */}
          <BlockStack gap="300">
            <Text as="h3" variant="headingSm">Layout</Text>
            
            <ButtonGroup variant="segmented">
              <Button
                pressed={data.layout === "horizontal"}
                onClick={() => handleLayoutChange("horizontal")}
                size="slim"
              >
                Horizontal
              </Button>
              <Button
                pressed={data.layout === "vertical"}
                onClick={() => handleLayoutChange("vertical")}
                size="slim"
              >
                Vertical
              </Button>
            </ButtonGroup>
          </BlockStack>

          <Divider />

          {/* Icon Size */}
          <BlockStack gap="200">
            <Text as="h3" variant="headingSm">Icon Size</Text>
            <RangeSlider
              label={`Size: ${data.iconSize || 40}px`}
              value={data.iconSize || 40}
              min={20}
              max={80}
              onChange={handleIconSizeChange}
            />
          </BlockStack>

          <Divider />

          {/* Spacing */}
          <BlockStack gap="200">
            <Text as="h3" variant="headingSm">
              {data.layout === "horizontal" ? "Horizontal" : "Vertical"} Spacing
            </Text>
            <RangeSlider
              label={`Spacing: ${data.spacing || 8}px`}
              value={data.spacing || 8}
              min={0}
              max={40}
              onChange={handleSpacingChange}
            />
          </BlockStack>
        </BlockStack>
      </Card>

      {/* Icon Library Modal */}
      {showIconLibrary && (
        <IconLibraryModal
          onSelect={handleAddIcon}
          onClose={() => {
            console.log("Closing icon library modal");
            setShowIconLibrary(false);
          }}
        />
      )}
    </>
  );
};

export default TrustBadgeContentForm;
