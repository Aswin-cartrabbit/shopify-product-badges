import {
  Card,
  BlockStack,
  Text,
  Button,
  Checkbox,
  Box,
} from "@shopify/polaris";
import { useAppBridge } from '@shopify/app-bridge-react'; 
import { useState, useCallback } from 'react';

interface TrustBadgeProductsFormProps {
  data?: any;
  onChange?: (data: any) => void;
}

const TrustBadgeProductsForm = ({ data, onChange }: TrustBadgeProductsFormProps) => {
  const app = useAppBridge();

  const handleDisplayChange = (key: any, value: any) => {
    if (onChange) {
      onChange({ [key]: value });
    }
  };

  async function openResourcePicker(resourceType: "product", multiple = true) {
    console.log('Opening resource picker for:', resourceType, 'multiple:', multiple);
    console.log('Shopify object:', window?.shopify);
    
    try {
      if (!window?.shopify?.resourcePicker) {
        console.error('Shopify resource picker API not available');
        alert('Resource selector is not available. Please ensure you are in the Shopify admin.');
        return;
      }

      const selected = await window.shopify.resourcePicker({
        type: resourceType,
        action: "select",
        multiple,
        filter: resourceType === "product" ? {
          hidden: false,
          variants: true,
        } : undefined,
      });

      console.log('Resource picker result:', selected);

      if (selected && selected.length > 0) {
        const mappedResources = selected.map((resource) => {
          return {
            productTitle: resource.title,
            productHandle: resource.handle,
            productId: resource.id,
            variants: resource.variants?.map((variant) => ({
              variantId: variant.id,
              variantDisplayName: variant.displayName,
            })) || [],
          };
        });
        
        console.log('Updating display with resources:', mappedResources);
        handleDisplayChange("resourceIds", mappedResources);
      } else {
        console.log('No resources selected or picker was cancelled');
      }
    } catch (error) {
      console.error('Resource picker error:', error);
      alert(`Failed to open ${resourceType} selector: ${error.message || 'Unknown error'}. Please try again.`);
    }
  }

  return (
    <Card>
      <BlockStack gap="400">
        <Text variant="headingMd" as="h2">
          Product Selection
        </Text>

        <BlockStack gap="300">
          <Text variant="bodyMd" as="p" fontWeight="medium">
            Choose display logic:
          </Text>
          
          <Checkbox
            label="All products"
            checked={data?.visibility === "all"}
            onChange={(checked) => handleDisplayChange("visibility", checked ? "all" : "")}
          />
          
          <Checkbox
            label="Specific products"
            checked={data?.visibility === "specific"}
            onChange={(checked) => handleDisplayChange("visibility", checked ? "specific" : "")}
          />
          
          {/* Choose Products Button for Specific Products */}
          {data?.visibility === "specific" && (
            <Box paddingBlockStart="200" paddingInlineStart="400">
              <BlockStack gap="200">
                <Button 
                  fullWidth
                  onClick={() => {
                    setTimeout(() => openResourcePicker("product", true), 100);
                  }}
                >
                  Choose Products
                </Button>
                <Text as="p" variant="bodySm" tone="subdued">
                  {data?.resourceIds?.length || 0} selected
                </Text>
              </BlockStack>
            </Box>
          )}
        </BlockStack>

        {data?.visibility === "specific" && (
          <BlockStack gap="200">
            <Text as="p" variant="bodyMd">
              Select Products
            </Text>
            <Button 
              fullWidth
              onClick={() => {
                setTimeout(() => openResourcePicker("product", true), 100);
              }}
            >
              Choose Products
            </Button>
            <Text as="p" variant="bodySm" tone="subdued">
              {data?.resourceIds?.length || 0} selected
            </Text>

            {/* Show selected resources */}
            {data?.resourceIds && data.resourceIds.length > 0 && (
              <Card>
                <BlockStack gap="200">
                  <Text variant="bodyMd" as="p" fontWeight="medium">
                    Selected products ({data.resourceIds.length}):
                  </Text>
                  <BlockStack gap="100">
                    {data.resourceIds.map((resource, index) => (
                      <div key={index}>
                        <Text as="p">
                          • {resource.productTitle}
                        </Text>
                      </div>
                    ))}
                  </BlockStack>

                  <Button
                    variant="plain"
                    onClick={() => {
                      setTimeout(() => openResourcePicker("product", true), 100);
                    }}
                  >
                    Edit selection
                  </Button>
                </BlockStack>
              </Card>
            )}
          </BlockStack>
        )}
      </BlockStack>
    </Card>
  );
};

export default TrustBadgeProductsForm;
