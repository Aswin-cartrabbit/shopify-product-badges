import {
  Modal,
  Text,
  BlockStack,
  InlineStack,
  TextField,
  Button,
  Card,
  Box,
  Grid,
  LegacyCard,
  ButtonGroup,
  Badge,
  Bleed,
} from "@shopify/polaris";
import { useState } from "react";
import { imageTemplates, textTemplates } from "@/utils/templateData";

interface TemplateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: any) => void;
  templateType?: "text" | "image"; // New prop to specify template type
}

const TemplateGalleryModal = ({ isOpen, onClose, onSelect, templateType = "image" }: TemplateGalleryModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  // Use the appropriate templates based on type
  const predefinedTemplates = templateType === "text" ? textTemplates : imageTemplates;

  const categories = ["All", "Sales", "New", "Christmas", "Black friday", "Stock", "Shipping", "Popular"];

  const filteredTemplates = predefinedTemplates.filter(template => {
    const searchText = templateType === "text" 
      ? (template as any).text?.toLowerCase() 
      : (template as any).alt?.toLowerCase();
    const matchesSearch = searchText?.includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || (template.category && template.category.includes(selectedCategory));
    return matchesSearch && matchesCategory;
  });

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      onSelect(selectedTemplate);
      onClose();
      setSelectedTemplate(null);
    }
  };

  const handleCancel = () => {
    onClose();
    setSelectedTemplate(null);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
      onClick={handleCancel}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          maxWidth: "800px",
          maxHeight: "80vh",
          width: "100%",
          overflowY: "auto",
          padding: "1.5rem",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <Text variant="headingLg" as="h2">Template gallery</Text>
          <Button onClick={handleCancel}>✕</Button>
        </div>
        <BlockStack gap="400">
          {/* Search */}
          <TextField
            label=""
            labelHidden
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Searching all templates"
            autoComplete="off"
          />

        

          {/* Category filters */}
          <Box>
            <InlineStack gap="200" wrap>
              {categories.map((category) => (
                <Button
                  key={category}
                  pressed={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "primary" : "secondary"}
                >
                  {category}
                </Button>
              ))}
            </InlineStack>
          </Box>

          {/* Template Grid */}
          <Grid>
            {filteredTemplates.map((template) => (
              <Grid.Cell key={template.id} columnSpan={{ xs: 6, sm: 3, md: 2, lg: 2, xl: 2 }}>
                <Card>
                  <div 
                    style={{ 
                      cursor: "pointer",
                      textAlign: "center",
                      border: selectedTemplate?.id === template.id ? "1px solid #0454F6" : "1px solid transparent",
                      borderRadius: "8px",
                      transition: "all 0.3s ease",
                      padding: "4px"
                    }}
                    className="template-card-hover"
                    onClick={() => handleTemplateSelect(template)}
                    onMouseEnter={(e) => {
                      if (selectedTemplate?.id !== template.id) {
                        e.currentTarget.style.border = "1px solid #0454F6";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedTemplate?.id !== template.id) {
                        e.currentTarget.style.border = "1px solid transparent";
                      }
                    }}
                  >
                    <Box paddingBlockEnd="200">
                      <div
                        style={{
                          width: "100%",
                          height: "80px",
                          backgroundColor: "#f6f6f7",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid #e1e3e5",
                          overflow: "hidden",
                        }}
                      >
                        {templateType === "text" ? (
                          // Render text template with proper styling
                          <div
                            style={{
                              ...(template as any).style,
                              transform: "scale(0.8)",
                              transformOrigin: "center",
                              fontSize: "8px",
                              fontWeight: "bold",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              minWidth: "60px",
                              minHeight: "20px",
                              maxWidth: "100px",
                              maxHeight: "35px",
                              whiteSpace: "nowrap",
                              overflow: "visible", // Allow clip-path to show properly
                              textOverflow: "clip",
                              // Ensure the text is properly positioned within shaped containers
                              
                              boxSizing: "border-box"
                            }}
                          >
                            <span style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "100%",
                              height: "100%",
                              textAlign: "center"
                            }}>
                              {(template as any).text}
                            </span>
                          </div>
                        ) : (
                          // Render image template
                          <>
                            <img
                              src={(template as any).src}
                              alt={(template as any).alt}
                              style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "contain",
                              }}
                              onError={(e: any) => {
                                // Fallback to placeholder if image fails to load
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                            <div
                              style={{
                                width: "60px",
                                height: "30px",
                                backgroundColor: template.category?.includes("Sales") ? "#dc2626" : 
                                               template.category?.includes("New") ? "#16a34a" :
                                               template.category?.includes("Christmas") ? "#dc2626" :
                                               template.category?.includes("Black friday") ? "#000000" :
                                               "#3b82f6",
                                borderRadius: "4px",
                                display: "none",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontSize: "10px",
                                fontWeight: "bold",
                              }}
                            >
                              {(template as any).alt?.substring(0, 8)}
                            </div>
                          </>
                        )}
                      </div>
                    </Box>
                    
                    {/* Selection indicator */}
                    {selectedTemplate?.id === template.id && (
                      <Box paddingBlockStart="100">
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4px"
                        }}>
                          <div style={{
                            width: "16px",
                            height: "16px",
                            backgroundColor: "#0454F6",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "12px",
                            fontWeight: "bold"
                          }}>
                            ✓
                          </div>
                          <Badge tone="info">Selected</Badge>
                        </div>
                      </Box>
                    )}
                    
                    {/* Template Name */}
                    {/* <Text variant="bodySm" as="p" alignment="center">
                      {templateType === "text" ? (template as any).text : (template as any).alt}
                    </Text> */}
                  </div>
                </Card>
              </Grid.Cell>
            ))}
          </Grid>

          {/* Use template button */}
          <Box paddingBlockStart="400">
            <Button 
              fullWidth 
              variant="primary" 
              disabled={!selectedTemplate}
              onClick={handleUseTemplate}
            >
              Use template
            </Button>
          </Box>
        </BlockStack>
      </div>
    </div>
  );
};

export default TemplateGalleryModal;
