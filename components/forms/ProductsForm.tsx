import {
  Card,
  BlockStack,
  Text,
  Button,
  Select,
  RadioButton,
  Divider,
  Bleed,
  InlineStack,
  Tooltip,
  Icon,
  Link,
  Modal,
  Grid,
  Box,
  TextField,
} from "@shopify/polaris";
import { QuestionCircleIcon } from "@shopify/polaris-icons";
import { useBadgeStore } from "@/stores/BadgeStore";
import { useAppBridge } from '@shopify/app-bridge-react';
import { useState, useCallback } from 'react';
import { imageTemplates, textTemplates } from "@/utils/templateData";

interface ProductsFormProps {
  data?: any;
  onChange?: (data: any) => void;
  type?: string;
}

const ProductsForm = ({ data, onChange, type = "BADGE" }: ProductsFormProps) => {
  const { badge, updateDisplay, updateContent, updateDesign } = useBadgeStore();
  const app = useAppBridge();
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleDisplayChange = (key: any, value: any) => {
    updateDisplay(key, value);
    if (onChange) {
      onChange({ [key]: value });
    }
  };

  const handleTemplateSelect = useCallback(
    (template: any) => {
      if (template.src) { // Image template
        updateContent("src", template.src);
        updateContent("alt", template.alt);
        updateContent("contentType", "image");
        setSelectedTemplate(template);
        
        if (onChange) {
          onChange({ src: template.src, alt: template.alt, contentType: "image", template: template });
        }
      } else if (template.text) { // Text template
        updateContent("text", template.text);
        updateContent("contentType", "text");
        setSelectedTemplate(template);
        
        if (template.style) {
          if (template.style.background) {
            updateDesign("color", template.style.background);
          }
          if (template.style.borderRadius) {
            const radius = typeof template.style.borderRadius === 'string' 
              ? parseInt(template.style.borderRadius.replace('px', '')) 
              : parseInt(template.style.borderRadius);
            updateDesign("cornerRadius", radius || 0);
          }
          if (template.style.clipPath) {
            updateDesign("shape", `clip-path: ${template.style.clipPath}`);
          }
        }
        
        if (onChange) {
          onChange({ text: template.text, contentType: "text", template: template });
        }
      }
      
      setIsTemplateModalOpen(false);
    },
    [updateContent, updateDesign, onChange]
  );

  async function openResourcePicker(resourceType: "product" | "collection", multiple = true) {
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
          if (resourceType === "product") {
            return {
              productTitle: resource.title,
              productHandle: resource.handle,
              productId: resource.id,
              variants: resource.variants?.map((variant) => ({
                variantId: variant.id,
                variantDisplayName: variant.displayName,
              })) || [],
            };
          } else {
            return {
              collectionTitle: resource.title,
              collectionHandle: resource.handle,
              collectionId: resource.id,
            };
          }
        });
        
        console.log('Updating display with resources:', mappedResources);
        updateDisplay("resourceIds", mappedResources);
      } else {
        console.log('No resources selected or picker was cancelled');
      }
    } catch (error) {
      console.error('Resource picker error:', error);
      alert(`Failed to open ${resourceType} selector: ${error.message || 'Unknown error'}. Please try again.`);
    }
  }

  const visibilityOptions = [
    { label: "All products", value: "all" },
    { label: "Specific products", value: "specific" },
    { label: "Product collections", value: "collections" },
  ];

  const TooltipIcon = ({ content }) => (
    <Tooltip content={content}>
      <Icon source={QuestionCircleIcon} tone="subdued" />
    </Tooltip>
  );

  return (
    <>
    <Card>
      <BlockStack gap="400">
        <InlineStack gap="100" align="start">
          <Text variant="headingMd" as="h2">
            Product Selection
          </Text>
          <TooltipIcon content="Choose which products will display this badge" />
        </InlineStack>

        <BlockStack gap="200">
          <Text as="p" variant="bodyMd" tone="subdued">
            Where should this {type.toLowerCase()} appear?
          </Text>
          
          <RadioButton
            label="All products (Show on every product)"
            checked={badge.display.visibility === "all"}
            id="all"
            name="visibility"
            onChange={() => handleDisplayChange("visibility", "all")}
            helpText="Badge will appear on all products in your store"
          />
          
          <RadioButton
            label="Specific products (Choose individual products)"
            checked={badge.display.visibility === "specific"}
            id="specific" 
            name="visibility"
            onChange={() => handleDisplayChange("visibility", "specific")}
            helpText="Select specific products to show this badge"
          />
          
          <RadioButton
            label="Product collections (Show on collection pages)"
            checked={badge.display.visibility === "collections"}
            id="collections"
            name="visibility"
            onChange={() => handleDisplayChange("visibility", "collections")}
            helpText="Badge will appear on products within selected collections"
          />
        </BlockStack>

        {(badge.display.visibility === "specific" || badge.display.visibility === "collections") && (
          <BlockStack gap="200">
            <Text as="p" variant="bodyMd">
              {badge.display.visibility === "specific" ? "Select Products" : "Select Collections"}
            </Text>
            <Button 
              fullWidth
              onClick={() => {
                if (badge.display.visibility === "specific") {
                  setTimeout(() => openResourcePicker("product", true), 100);
                } else {
                  setTimeout(() => openResourcePicker("collection", true), 100);
                }
              }}
            >
              {badge.display.visibility === "specific" 
                ? "Choose Products" 
                : "Choose Collections"}
            </Button>
            <Text as="p" variant="bodySm" tone="subdued">
              {badge.display.resourceIds?.length || 0} selected
            </Text>

            {/* Debug button - remove after testing */}
            <Button 
              onClick={() => {
                console.log('Direct test button clicked');
                if (badge.display.visibility === "specific") {
                  openResourcePicker("product", true);
                } else {
                  openResourcePicker("collection", true);
                }
              }}
              variant="secondary"
              size="micro"
            >
              Test Resource Picker
            </Button>

            {/* Show selected resources */}
            {badge.display.resourceIds && badge.display.resourceIds.length > 0 && (
              <Card>
                <BlockStack gap="200">
                  <Text variant="bodyMd" as="p" fontWeight="medium">
                    {badge.display.visibility === "specific"
                      ? `Selected products (${badge.display.resourceIds.length}):`
                      : `Selected collections (${badge.display.resourceIds.length}):`}
                  </Text>
                  <BlockStack gap="100">
                    {badge.display.resourceIds.map((resource, index) => (
                      <InlineStack key={index} gap="200" blockAlign="center">
                        <Text as="p">
                          • {badge.display.visibility === "specific" 
                              ? resource.productTitle 
                              : resource.collectionTitle}
                        </Text>
                        {resource.productHandle && (
                          <Link
                            url={`/products/${resource.productHandle}`}
                            target="_blank"
                            removeUnderline
                          >
                            View product
                          </Link>
                        )}
                        {resource.collectionHandle && (
                          <Link
                            url={`/collections/${resource.collectionHandle}`}
                            target="_blank"
                            removeUnderline
                          >
                            View collection
                          </Link>
                        )}
                      </InlineStack>
                    ))}
                  </BlockStack>

                  <Button
                    variant="plain"
                    onClick={() => {
                      if (badge.display.visibility === "specific") {
                        setTimeout(() => openResourcePicker("product", true), 100);
                      } else {
                        setTimeout(() => openResourcePicker("collection", true), 100);
                      }
                    }}
                  >
                    Edit selection
                  </Button>
                </BlockStack>
              </Card>
            )}
          </BlockStack>
        )}

        <Bleed marginInline="400">
          <Divider />
        </Bleed>

        {/* Template Selection Section */}
        <InlineStack gap="100" align="start">
          <Text variant="headingMd" as="h2">
            Badge Template
          </Text>
          <TooltipIcon content="Choose a pre-designed template for your badge" />
        </InlineStack>

        <BlockStack gap="200">
          <Text as="p" variant="bodyMd" tone="subdued">
            Select from our template library or continue with current design
          </Text>
          
          {/* Show selected template preview if any */}
          {selectedTemplate && (
            <Card>
              <BlockStack gap="200">
                <Text variant="bodyMd" as="p" fontWeight="medium">
                  Selected Template:
                </Text>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "12px",
                  padding: "12px",
                  border: "1px solid #e1e3e5",
                  borderRadius: "8px"
                }}>
                  {selectedTemplate.src ? (
                    <img 
                      src={selectedTemplate.src} 
                      alt={selectedTemplate.alt}
                      style={{ 
                        width: "40px", 
                        height: "40px", 
                        objectFit: "cover",
                        borderRadius: "4px"
                      }}
                    />
                  ) : (
                    <div 
                      style={{
                        ...selectedTemplate.style,
                        padding: "8px 12px",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        borderRadius: selectedTemplate.style?.borderRadius || "4px",
                        minWidth: "40px",
                        textAlign: "center"
                      }}
                    >
                      {selectedTemplate.text}
                    </div>
                  )}
                  <div>
                    <Text variant="bodyMd" as="p">
                      {selectedTemplate.alt || selectedTemplate.text}
                    </Text>
                    <Text variant="bodySm" as="p" tone="subdued">
                      {selectedTemplate.src ? "Image Template" : "Text Template"}
                    </Text>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setSelectedTemplate(null);
                    // Reset to default values if needed
                  }}
                  variant="secondary"
                  size="micro"
                >
                  Remove template
                </Button>
              </BlockStack>
            </Card>
          )}

          <InlineStack gap="200">
            <Button 
              onClick={() => setIsTemplateModalOpen(true)}
              variant="secondary"
              fullWidth
            >
              Choose from template library
            </Button>
            <Button 
              variant="primary"
              fullWidth
            >
              Continue with current design
            </Button>
          </InlineStack>
        </BlockStack>

        <Bleed marginInline="400">
          <Divider />
        </Bleed>

        <InlineStack gap="100" align="start">
          <Text variant="headingMd" as="h2">
            Display Rules
          </Text>
          <TooltipIcon content="Set conditions for when this badge should be visible" />
        </InlineStack>

        <BlockStack gap="200">
          <Text as="p" variant="bodyMd" tone="subdued">
            Additional conditions (optional)
          </Text>
          
          <Button fullWidth variant="secondary">
            Add condition
          </Button>
          
          <Text as="p" variant="bodySm" tone="subdued">
            Examples: Show only when product is on sale, out of stock, new arrival, etc.
          </Text>
        </BlockStack>

        <Bleed marginInline="400">
          <Divider />
        </Bleed>

        <Text as="p" variant="bodySm" tone="subdued">
          Advanced product targeting available with Pro plan.{" "}
          <a href="#" style={{ color: "blue" }}>
            Upgrade now.
          </a>
        </Text>
      </BlockStack>
    </Card>
    
    {/* Template Gallery Modal - Polaris Modal */}
    <Modal
      open={isTemplateModalOpen}
      onClose={() => {
        setIsTemplateModalOpen(false);
        setSearchQuery("");
      }}
      title="Choose Template"
      primaryAction={{
        content: "Cancel",
        onAction: () => setIsTemplateModalOpen(false),
      }}
      size="large"
    >
      <Modal.Section>
        <BlockStack gap="400">
          {/* Search */}
          <TextField
            label="Search templates"
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name or style..."
            autoComplete="off"
            clearButton
            onClearButtonClick={() => setSearchQuery("")}
          />

          {/* Templates Grid */}
          <Grid>
            {(() => {
              const templateType = badge.content.contentType === "text" ? "text" : "image";
              const predefinedTemplates = templateType === "text" ? textTemplates : imageTemplates;
              
              const filteredTemplates = predefinedTemplates.filter(template => {
                const searchText = templateType === "text" 
                  ? (template as any).text?.toLowerCase() 
                  : (template as any).alt?.toLowerCase();
                return searchText?.includes(searchQuery.toLowerCase()) || searchQuery === "";
              });

              return filteredTemplates.map((template) => (
                <Grid.Cell key={template.id} columnSpan={{ xs: 6, sm: 3, md: 2, lg: 2, xl: 2 }}>
                  <Card>
                    <div 
                      onClick={() => handleTemplateSelect(template)}
                      style={{ cursor: "pointer" }}
                    >
                      <Box paddingBlockEnd="200">
                        <div style={{
                          height: "120px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#f6f6f7",
                          borderRadius: "8px",
                          overflow: "hidden",
                          position: "relative"
                        }}>
                          {templateType === "text" ? (
                            <div style={{
                              ...(template as any).style,
                              padding: "8px 12px",
                              fontSize: "0.875rem",
                              fontWeight: 600,
                              borderRadius: (template as any).style?.borderRadius || "4px",
                              transform: "scale(0.8)",
                              overflow: "visible",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              minWidth: "60px",
                              minHeight: "30px"
                            }}>
                              <span style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                lineHeight: "1.2"
                              }}>
                                {(template as any).text}
                              </span>
                            </div>
                          ) : (
                            <>
                              <img 
                                src={(template as any).src} 
                                alt={(template as any).alt}
                                style={{
                                  maxWidth: "100%",
                                  maxHeight: "100%",
                                  objectFit: "contain"
                                }}
                                onError={(e: any) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                              <div style={{
                                display: "none",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "#e1e3e5",
                                color: "#6d7175",
                                fontSize: "0.875rem"
                              }}>
                                {(template as any).alt?.substring(0, 8)}
                              </div>
                            </>
                          )}
                        </div>
                      </Box>
                      {/* Template Name */}
                      <Text variant="bodySm" as="p" alignment="center">
                        {templateType === "text" ? (template as any).text : (template as any).alt}
                      </Text>
                    </div>
                  </Card>
                </Grid.Cell>
              ));
            })()}
          </Grid>

          {/* No results message */}
          {(() => {
            const templateType = badge.content.contentType === "text" ? "text" : "image";
            const predefinedTemplates = templateType === "text" ? textTemplates : imageTemplates;
            const filteredTemplates = predefinedTemplates.filter(template => {
              const searchText = templateType === "text" 
                ? (template as any).text?.toLowerCase() 
                : (template as any).alt?.toLowerCase();
              return searchText?.includes(searchQuery.toLowerCase()) || searchQuery === "";
            });

            if (filteredTemplates.length === 0 && searchQuery !== "") {
              return (
                <Box paddingBlock="800">
                  <Text variant="bodyMd" as="p" alignment="center" tone="subdued">
                    No templates found for "{searchQuery}"
                  </Text>
                </Box>
              );
            }
            return null;
          })()}
        </BlockStack>
      </Modal.Section>
    </Modal>
  </>
  );
};

export default ProductsForm;
