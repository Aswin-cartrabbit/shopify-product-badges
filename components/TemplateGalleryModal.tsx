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
import { imageTemplates } from "@/utils/templateData";

interface TemplateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: any) => void;
}

const TemplateGalleryModal = ({ isOpen, onClose, onSelect }: TemplateGalleryModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Use actual image templates from templateData
  const predefinedTemplates = imageTemplates;

  const categories = ["All", "Sales", "New", "Christmas", "Black friday", "Stock", "Shipping", "Popular"];

  const filteredTemplates = predefinedTemplates.filter(template => {
    const matchesSearch = template.alt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || (template.category && template.category.includes(selectedCategory));
    return matchesSearch && matchesCategory;
  });

  const handleTemplateSelect = (template: any) => {
    onSelect(template);
    onClose();
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
      onClick={onClose}
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
          <Button onClick={onClose}>✕</Button>
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

          {/* Custom banner */}
          <Card>
            <InlineStack align="space-between" blockAlign="center">
              <BlockStack gap="100">
                <Text variant="bodyMd" as="p">
                  Need a custom label or badge that fits your brand vibe? Let us help! 😎
                </Text>
                <Button variant="plain" textAlign="left">
                  Chat now to get started!
                </Button>
              </BlockStack>
              <Button onClick={onClose}>✕</Button>
            </InlineStack>
          </Card>

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
                      padding: "1rem",
                    }}
                    onClick={() => handleTemplateSelect(template)}
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
                        <img
                          src={template.src}
                          alt={template.alt}
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
                          {template.alt.substring(0, 8)}
                        </div>
                      </div>
                    </Box>
                  </div>
                </Card>
              </Grid.Cell>
            ))}
          </Grid>

          {/* Use template button */}
          <Box paddingBlockStart="400">
            <Button fullWidth variant="primary" disabled>
              Use template
            </Button>
          </Box>
        </BlockStack>
      </div>
    </div>
  );
};

export default TemplateGalleryModal;
