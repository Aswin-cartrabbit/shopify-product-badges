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
  Popover,
  FormLayout,
  Checkbox,
  Badge,
} from "@shopify/polaris";
import { QuestionCircleIcon, ChevronDownIcon, ChevronUpIcon } from "@shopify/polaris-icons";
import { useBadgeStore } from "@/stores/BadgeStore";
import { useAppBridge } from '@shopify/app-bridge-react';
import { useState, useCallback } from 'react';
import { imageTemplates, textTemplates } from "@/utils/templateData";
import {
  DomainLandingPageIcon
} from '@shopify/polaris-icons';

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
  const [selectedRule, setSelectedRule] = useState<string>("");
  
  // Popover state
  const [popoverActive, setPopoverActive] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string>("specific");
  const [basicExpanded, setBasicExpanded] = useState(false);
  const [advancedExpanded, setAdvancedExpanded] = useState(true);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  // Input field states
  const [priceCondition, setPriceCondition] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inventoryCondition, setInventoryCondition] = useState("");
  const [quantityThreshold, setQuantityThreshold] = useState("");
  const [tagCondition, setTagCondition] = useState("");
  const [productTags, setProductTags] = useState("");
  
  // Judge.me integration state
  const [judgeIntegrationSelected, setJudgeIntegrationSelected] = useState(false);
  const [reviewOption, setReviewOption] = useState("");
  const [reviewCondition, setReviewCondition] = useState("");
  const [reviewValue, setReviewValue] = useState("");
  const [showReviewText, setShowReviewText] = useState(false);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );

  const handleConditionChange = useCallback(
    (condition: string, checked: boolean) => {
      if (checked) {
        setSelectedConditions(prev => [...prev, condition]);
      } else {
        setSelectedConditions(prev => prev.filter(c => c !== condition));
      }
    },
    [],
  );

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

 

  const TooltipIcon = ({ content }) => (
    <Tooltip content={content}>
      <Icon source={QuestionCircleIcon} tone="subdued" />
    </Tooltip>
  );

  const activator = (
    <Button onClick={togglePopoverActive} disclosure>
      Apply label to
    </Button>
  );

  return (
    <BlockStack gap="600">
    <Card>
      <BlockStack gap="600">
        <InlineStack gap="100" align="start">
          <Text variant="headingMd" as="h2">
            Display Logic
          </Text>
          <TooltipIcon content="Set conditions for when this badge should be visible" />
        </InlineStack>

        <BlockStack gap="300">
          <Text variant="bodyMd" as="p" fontWeight="medium">
            Choose display logic:
          </Text>
          
          <Checkbox
            label="All products"
            checked={badge.display.visibility === "all"}
            onChange={(checked) => handleDisplayChange("visibility", checked ? "all" : "")}
          />
          
          <Checkbox
            label="Specific products"
            checked={badge.display.visibility === "specific"}
            onChange={(checked) => handleDisplayChange("visibility", checked ? "specific" : "")}
          />
          
          {/* Choose Products Button for Specific Products */}
          {badge.display.visibility === "specific" && (
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
                  {badge.display.resourceIds?.length || 0} selected
                </Text>
              </BlockStack>
            </Box>
          )}
          
          <Checkbox
            label="Product collections"
            checked={badge.display.visibility === "collections"}
            onChange={(checked) => handleDisplayChange("visibility", checked ? "collections" : "")}
          />
          
          {/* Choose Collections Button for Collections */}
          {badge.display.visibility === "collections" && (
            <Box paddingBlockStart="200" paddingInlineStart="400">
              <BlockStack gap="200">
                <Button 
                  fullWidth
                  onClick={() => {
                    setTimeout(() => openResourcePicker("collection", true), 100);
                  }}
                >
                  Choose Collections
                </Button>
                <Text as="p" variant="bodySm" tone="subdued">
                  {badge.display.resourceIds?.length || 0} selected
                </Text>
              </BlockStack>
            </Box>
          )}
          
          <Checkbox
            label="Price Range"
            checked={selectedRule === "price"}
            onChange={(checked) => setSelectedRule(checked ? "price" : "")}
          />
          
          {/* Price Range Input Fields */}
          {selectedRule === "price" && (
            <Box paddingBlockStart="200" paddingInlineStart="400">
              <BlockStack gap="300">
                                  <InlineStack gap="200">
                    <Select
                      label="Price condition"
                      options={[
                        { label: "Greater than", value: "gt" },
                        { label: "Less than", value: "lt" },
                        { label: "Between", value: "between" },
                        { label: "Equal to", value: "eq" }
                      ]}
                      value={priceCondition}
                      onChange={setPriceCondition}
                    />
                    <TextField
                      label="Minimum price ($)"
                      value={minPrice}
                      onChange={setMinPrice}
                      type="number"
                      autoComplete="off"
                    />
                    <TextField
                      label="Maximum price ($)"
                      value={maxPrice}
                      onChange={setMaxPrice}
                      type="number"
                      autoComplete="off"
                    />
                  </InlineStack>
                <Text variant="bodySm" as="p" tone="subdued">
                  Examples: Show badge for products over $50, between $25-$100, or under $20
                </Text>
              </BlockStack>
            </Box>
          )}
          
          <Checkbox
            label="Inventory Level"
            checked={selectedRule === "inventory"}
            onChange={(checked) => setSelectedRule(checked ? "inventory" : "")}
          />
          
          {/* Inventory Level Input Fields */}
          {selectedRule === "inventory" && (
            <Box paddingBlockStart="200" paddingInlineStart="400">
              <BlockStack gap="300">
                                  <InlineStack gap="200">
                    <Select
                      label="Inventory condition"
                      options={[
                        { label: "Out of stock", value: "out_of_stock" },
                        { label: "Low stock", value: "low_stock" },
                        { label: "In stock", value: "in_stock" },
                        { label: "High stock", value: "high_stock" },
                        { label: "Custom quantity", value: "custom" }
                      ]}
                      value={inventoryCondition}
                      onChange={setInventoryCondition}
                    />
                    <TextField
                      label="Quantity threshold"
                      value={quantityThreshold}
                      onChange={setQuantityThreshold}
                      type="number"
                      autoComplete="off"
                      helpText="Define low/high stock threshold"
                    />
                  </InlineStack>
                <Text variant="bodySm" as="p" tone="subdued">
                  Examples: Show "Low Stock" badge when less than 5 items, "Out of Stock" when 0 items
                </Text>
              </BlockStack>
            </Box>
          )}
          
          <Checkbox
              label="Product Tags"
            checked={selectedRule === "tags"}
            onChange={(checked) => setSelectedRule(checked ? "tags" : "")}
          />
          
          {/* Product Tags Input Fields */}
          {selectedRule === "tags" && (
            <Box paddingBlockStart="200" paddingInlineStart="400">
              <BlockStack gap="300">
                                  <InlineStack gap="200">
                    <Select
                      label="Tag condition"
                      options={[
                        { label: "Has any of these tags", value: "any" },
                        { label: "Has all of these tags", value: "all" },
                        { label: "Does not have these tags", value: "none" }
                      ]}
                      value={tagCondition}
                      onChange={setTagCondition}
                    />
                  </InlineStack>
                  
                  <TextField
                    label="Product tags (comma separated)"
                    value={productTags}
                    onChange={setProductTags}
                    placeholder="new, exclusive, sale, limited-edition"
                    autoComplete="off"
                    helpText="Enter tags separated by commas"
                  />
                
                <BlockStack gap="100">
                  <Text variant="bodyMd" as="p" fontWeight="medium">Quick tag presets:</Text>
                  <InlineStack gap="200">
                    <Button size="micro" variant="secondary" onClick={() => {}}>New</Button>
                    <Button size="micro" variant="secondary" onClick={() => {}}>Exclusive</Button>
                    <Button size="micro" variant="secondary" onClick={() => {}}>Sale</Button>
                    <Button size="micro" variant="secondary" onClick={() => {}}>Limited Edition</Button>
                    <Button size="micro" variant="secondary" onClick={() => {}}>Best Seller</Button>
                  </InlineStack>
                </BlockStack>
                
                <Text variant="bodySm" as="p" tone="subdued">
                  Examples: Show badge for products tagged as "new" or "exclusive"
                </Text>
              </BlockStack>
            </Box>
          )}
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

       

    
      </BlockStack>
    </Card>

  {/* Integrations Card */}
<Card >
  <BlockStack gap="400">
    <InlineStack gap="200" align="start">
      <Text  alignment="start" variant="headingMd" as="h2">
      Integrations
      </Text>

    </InlineStack>

    <BlockStack gap="300">
     
      
      <Text variant="bodySm" as="p" tone="subdued">
        Show labels on products with a specific review number or star rating.
      </Text>
      <Card background="bg-surface-secondary">
        <InlineStack gap="200" align="space-between" blockAlign="center" wrap={false}>
          <InlineStack gap="200" align="start" blockAlign="center" wrap={false}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              overflow: "hidden"
            }}>
              <img 
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAflBMVEU+s6M/sqQ+s6I9tKFAsaQ2tJ9IsqQzsKDW8ez///8qrZzI6eP///6Qz8T9//8jrZi14tvW7exCsKOFyr/+/f/f7+8xspu/497y+vmz2dar3Nbd8vAsqprS7umg189wwbec18xcu6p/yLtqwLJyxbZZua5rx7WEzcDp+flRv63FFClNAAABU0lEQVR4AXyQB2LDIAxFJYGrfEqUpe7dZt7/gg3EJc183tYDDboGMzFdRwJdJXY311YTiw6ulkA6APXoOSHdIte9hGTYxaOKpcQN1YyjMSbd9L/BRGkMYCfoDI67+3i4/wO8CoVHmGNyzxRaB6MnuPWCPmOL46Uj/jNe679eGBmKa3hTFqqkd+QmyAesfJlhkLj8KHHzJuhnESovVQg6RKEJ4153+9IivM5gR4LbrspRLPm/YX4gPMNQhbdXiaTfLWhmj0UoY+pTREk/aLj5F20JLeXjfPEOMzR+tM5hUoyG7xN81KKJl8g4wTLmqR+cvuEUx0qngWsNLI+ww+UwzFIMtIO7OfKhkfH5GoV6pDTvOGCY9nEOxOnbkGGGXK4Sp0BCe6bd1x3gbuaesf5JUzqAQ2RdPaJin6Ix8KEwDcI62rw/P7//JGUJrYJDdIvQ76gLAK3TGRSf3nldAAAAAElFTkSuQmCC"
                alt="Judge.me Logo"
                style={{
                  width: "32px",
                  height: "32px",
                  objectFit: "contain"
                }}
              />
            </div>
            
            <Text variant="bodyMd" as="p" fontWeight="medium">
              Judge.me Product Reviews App
            </Text>
            <Icon source="external" tone="subdued" />
          </InlineStack>
          
          <Button variant="primary" size="medium" onClick={() => setJudgeIntegrationSelected(true)}>
            Select
          </Button>
        </InlineStack>
      </Card>
      
      {/* Judge.me Integration Form */}
      {judgeIntegrationSelected && (
        <Card background="bg-surface-secondary">
          <BlockStack gap="400">
            <InlineStack gap="200" align="space-between" blockAlign="center">
              <InlineStack gap="200" align="start" blockAlign="center">
                <div style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  overflow: "hidden"
                }}>
                  <img 
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAflBMVEU+s6M/sqQ+s6I9tKFAsaQ2tJ9IsqQzsKDW8ez///8qrZzI6eP///6Qz8T9//8jrZi14tvW7exCsKOFyr/+/f/f7+8xspu/497y+vmz2dar3Nbd8vAsqprS7umg189wwbec18xcu6p/yLtqwLJyxbZZua5rx7WEzcDp+flRv63FFClNAAABU0lEQVR4AXyQB2LDIAxFJYGrfEqUpe7dZt7/gg3EJc183tYDDboGMzFdRwJdJXY311YTiw6ulkA6APXoOSHdIte9hGTYxaOKpcQN1YyjMSbd9L/BRGkMYCfoDI67+3i4/wO8CoVHmGNyzxRaB6MnuPWCPmOL46Uj/jNe679eGBmKa3hTFqqkd+QmyAesfJlhkLj8KHHzJuhnESovVQg6RKEJ4153+9IivM5gR4LbrspRLPm/YX4gPMNQhbdXiaTfLWhmj0UoY+pTREk/aLj5F20JLeXjfPEOMzR+tM5hUoyG7xN81KKJl8g4wTLmqR+cvuEUx0qngWsNLI+ww+UwzFIMtIO7OfKhkfH5GoV6pDTvOGCY9nEOxOnbkGGGXK4Sp0BCe6bd1x3gbuaesf5JUzqAQ2RdPaJin6Ix8KEwDcI62rw/P7//JGUJrYJDdIvQ76gLAK3TGRSf3nldAAAAAElFTkSuQmCC"
                    alt="Judge.me Logo"
                    style={{
                      width: "24px",
                      height: "24px",
                      objectFit: "contain"
                    }}
                  />
                </div>
                <Text variant="bodyMd" as="p" fontWeight="medium">
                  Judge.me Product Reviews App
                </Text>
              </InlineStack>
              
              <Button variant="plain" onClick={() => setJudgeIntegrationSelected(false)}>
                Remove
              </Button>
            </InlineStack>
            
            <BlockStack gap="300">
              <Text variant="bodyMd" as="p" fontWeight="medium">
                Review option
              </Text>
              <Select
                label=""
                options={[
                  { label: "Number of reviews", value: "number_of_reviews" },
                  { label: "Average star rating", value: "average_rating" },
                  { label: "Has reviews", value: "has_reviews" },
                  { label: "Review score", value: "review_score" }
                ]}
                value={reviewOption}
                onChange={setReviewOption}
                placeholder="Choose review option"
              />
            </BlockStack>
            
            <BlockStack gap="300">
              <Text variant="bodyMd" as="p" fontWeight="medium">
                Condition
              </Text>
              <InlineStack gap="200">
                <div style={{ flex: 1 }}>
                  <Select
                    label=""
                    options={[
                      { label: "Greater than", value: "greater_than" },
                      { label: "Less than", value: "less_than" },
                      { label: "Equal to", value: "equal_to" },
                      { label: "Between", value: "between" }
                    ]}
                    value={reviewCondition}
                    onChange={setReviewCondition}
                    placeholder="Choose condition"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <TextField
                    label=""
                    value={reviewValue}
                    onChange={setReviewValue}
                    type="number"
                    placeholder={reviewOption === "average_rating" ? "4.5" : "10"}
                    autoComplete="off"
                  />
                </div>
              </InlineStack>
            </BlockStack>
            
           
          </BlockStack>
        </Card>
      )}
    </BlockStack>
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
    </BlockStack>

  
  );
};

export default ProductsForm;