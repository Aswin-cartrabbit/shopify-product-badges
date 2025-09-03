import {
  Card,
  BlockStack,
  TextField,
  Bleed,
  Divider,
  Thumbnail,
  Button,
  Select,
  Text,
  Badge,
  RadioButton,
  InlineStack,
  Box,
  DropZone,
  LegacyStack,
  Tooltip,
  Icon,
  Popover,
  ActionList,
} from "@shopify/polaris";
import { QuestionCircleIcon, ProductUnavailableIcon, TextBoldIcon, TextItalicIcon, TextUnderlineIcon, ArrowLeftIcon, ArrowDiagonalIcon, ArrowRightIcon } from "@shopify/polaris-icons";
import { useCallback, useState, useEffect } from "react";
import { useBadgeStore, GridPosition } from "@/stores/BadgeStore";
import TemplateGalleryModal from "../TemplateGalleryModal";
import ColorPickerInput from "../pickers/ColourPicker";
import PositionGrid from "../PositionGrid";
import BadgeHorizontalPositionComponent, { BadgeHorizontalPosition, BadgeAlignmentComponent, BadgeAlignment } from "../BadgeHorizontalPosition";
import React from "react";

interface ContentFormProps {
  data?: any;
  onChange?: (data: any) => void;
  type?: string;
  badgeName?: string;
  setBadgeName?: (name: string) => void;
}

const ContentForm = ({ data, onChange, type = "BADGE", badgeName, setBadgeName }: ContentFormProps) => {
  const { badge, updateContent, updateDesign } = useBadgeStore();

  const TooltipIcon = ({ content }) => (
    <Tooltip content={content}>
      <Icon source={QuestionCircleIcon} tone="subdued" />
    </Tooltip>
  );
  
  // Local state for form fields
  const [localName, setLocalName] = useState("");
  const [localText, setLocalText] = useState("");
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);


  // AutoText options
  const autoTextOptions = [
    { content: 'Discount %', value: '{{discount_percentage}}' },
    { content: 'Discount amount', value: '{{discount_amount}}' },
    { content: 'Price', value: '{{price}}' },
    { content: 'Day release', value: '{{day_release}}' },
    { content: 'Remaining stock', value: '{{remaining_stock}}' },
    { content: 'Number of reviews', value: '{{review_count}}' },
    { content: 'Average rating', value: '{{average_rating}}' },
    { content: 'Product metafields', value: '{{product_metafields}}' },
  ];

  // Initialize local state from props/data and auto-detect content type
  // Only run once when component mounts or when a completely new template is selected
  
  useEffect(() => {
    // Only initialize on first mount or when data prop changes from parent (not from template selection)
    if (data && !hasInitialized) {
      console.log('Initializing ContentForm with data:', data);
      
      const initialName = badgeName || 
        data?.name || 
        (data?.text ? `${data.text} ${type.toLowerCase()}` : "") ||
        (data?.alt ? `${data.alt} ${type.toLowerCase()}` : "") ||
        `New ${type.toLowerCase()}`;
      
      setLocalName(initialName);
      
      // Initialize with data from parent component (initial template selection)
      if (data?.text || data?.src) {
        if (data.src) {
          // Image template from parent
          updateContent("contentType", "image");
          updateContent("icon", data.src);
          updateContent("iconUploaded", true);
          updateContent("text", data.alt || "");
          setLocalText(data.alt || "");
        } else if (data.text) {
          // Text template from parent
          updateContent("contentType", "text");
          updateContent("text", data.text);
          setLocalText(data.text);
        }
        
        // Set selected template if data has template info
        if ((data.text && data.style) || data.src) {
          setSelectedTemplate(data);
        }
      } else {
        // No initial template - use existing badge store text if available
        setLocalText(badge.content.text || "");
        
        // Set default content type
        if (!badge.content.contentType) {
          updateContent("contentType", "text");
        }
      }
      
      setHasInitialized(true);
    }
  }, [data, badgeName, type, updateContent, hasInitialized, badge.content.text, badge.content.contentType]); // Only trigger when data actually changes from parent

  // Sync local text state with badge store only when badge store is updated externally
  // Don't sync if the change came from this component to avoid loops
  useEffect(() => {
    if (badge.content.text !== localText && document.activeElement?.tagName !== 'TEXTAREA' && document.activeElement?.tagName !== 'INPUT') {
      setLocalText(badge.content.text);
    }
  }, [badge.content.text]); // Sync when badge store text changes externally

  // Force re-render when badge store content changes to update preview
  useEffect(() => {
    setPreviewKey(prev => prev + 1);
  }, [badge.content.text, badge.design.color, badge.design.cornerRadius, badge.design.shape, badge.design.isBold, badge.design.isItalic, badge.design.isUnderline]);

           // AutoText popover state
         const [autoTextPopoverActive, setAutoTextPopoverActive] = useState(false);
         const [emojiPopoverActive, setEmojiPopoverActive] = useState(false);
         const [boldPressed, setBoldPressed] = useState(false);
         const [italicPressed, setItalicPressed] = useState(false);
         const [underlinePressed, setUnderlinePressed] = useState(false);

         // Function to insert AutoText placeholders
         const insertAutoText = useCallback((placeholder: string) => {
           console.log("insertAutoText called with:", placeholder);
           const autoTextPattern = /\{\{[^}]+\}\}/g;
           const textWithoutAutoText = localText.replace(autoTextPattern, '').trim();
           const newText = textWithoutAutoText ? `${textWithoutAutoText} ${placeholder}` : placeholder;
           console.log("New text after AutoText insertion:", newText);
           setLocalText(newText);
           updateContent("text", newText);
           if (onChange) {
             console.log("Calling onChange with AutoText:", newText);
             onChange({ text: newText });
           }
         }, [localText, updateContent, onChange]);

         // Function to insert emojis
         const insertEmoji = useCallback((emoji: string) => {
           console.log("insertEmoji called with:", emoji);
           const newText = localText ? `${localText} ${emoji}` : emoji;
           console.log("New text after emoji insertion:", newText);
           setLocalText(newText);
           updateContent("text", newText);
           if (onChange) {
             console.log("Calling onChange with emoji:", newText);
             onChange({ text: newText });
           }
         }, [localText, updateContent, onChange]);

         // Formatting functions
         const handleBold = useCallback(() => {
           setBoldPressed(!boldPressed);
           const selection = window.getSelection()?.toString();
           if (selection) {
             const newText = localText.replace(selection, `<b>${selection}</b>`);
             setLocalText(newText);
             updateContent("text", newText);
             if (onChange) {
               onChange({ text: newText });
             }
           }
         }, [localText, updateContent, boldPressed, onChange]);

         const handleItalic = useCallback(() => {
           setItalicPressed(!italicPressed);
           const selection = window.getSelection()?.toString();
           if (selection) {
             const newText = localText.replace(selection, `<i>${selection}</i>`);
             setLocalText(newText);
             updateContent("text", newText);
             if (onChange) {
               onChange({ text: newText });
             }
           }
         }, [localText, updateContent, italicPressed, onChange]);

         const handleUnderline = useCallback(() => {
           setUnderlinePressed(!underlinePressed);
           const selection = window.getSelection()?.toString();
           if (selection) {
             const newText = localText.replace(selection, `<u>${selection}</u>`);
             setLocalText(newText);
             updateContent("text", newText);
             if (onChange) {
               onChange({ text: newText });
             }
           }
         }, [localText, updateContent, underlinePressed, onChange]);

         // Local state for form elements not directly related to badge data

  const handleBadgeChange = useCallback(
    (newValue: string) => {
      setLocalName(newValue);
      if (setBadgeName) {
        setBadgeName(newValue);
      }
      if (onChange) {
        onChange({ name: newValue });
      }
    },
    [setBadgeName, onChange]
  );

  const handleTextChange = useCallback(
    (newValue: string) => {
      console.log("handleTextChange called with:", newValue);
      setLocalText(newValue);
      updateContent("text", newValue);
      if (onChange) {
        console.log("Calling onChange with text:", newValue);
        onChange({ text: newValue });
      }
    },
    [updateContent, onChange]
  );

  const handleContentChange = useCallback(
    (field: keyof import('@/stores/BadgeStore').BadgeContent, value: any) => {
      updateContent(field, value);
      if (onChange) {
        onChange({ [field]: value });
      }
    },
    [updateContent, onChange]
  );

  const handleContentTypeChange = useCallback(
    (contentType: "text" | "image") => {
      updateContent("contentType", contentType);
      if (onChange) {
        onChange({ contentType });
      }
    },
    [updateContent, onChange]
  );

  const handleTemplateSelect = useCallback(
    (template: any) => {
      console.log('Template selected:', template);
      
      if (template.src) {
        // Image template
        updateContent("icon", template.src);
        updateContent("iconUploaded", true);
        updateContent("contentType", "image");
        updateContent("text", template.alt || ""); // Clear text for image templates
        setLocalText(template.alt || "");
        setSelectedTemplate(template);
        
        if (onChange) {
          onChange({ 
            icon: template.src, 
            iconUploaded: true, 
            contentType: "image",
            text: template.alt || ""
          });
        }
      } else if (template.text) {
        // Text template - force update all content
        console.log('Updating text template with:', template.text);
        
        // Update badge store content
        updateContent("text", template.text);
        updateContent("contentType", "text");
        updateContent("icon", ""); // Clear any existing icon
        updateContent("iconUploaded", false);
        
        // Update local state
        setLocalText(template.text);
        setSelectedTemplate(template);
        
        // Apply template styling if available
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
          // Set template identifier
          updateDesign("template", `Template_${template.id}`);
        }
        
        // Force update the form data to ensure parent component knows about the change
        if (onChange) {
          onChange({ 
            text: template.text,
            contentType: "text",
            template: template,
            icon: "",
            iconUploaded: false
          });
        }
        
        // Force preview update
        setPreviewKey(prev => prev + 1);
      }
      
      // Close the template modal
      setIsTemplateModalOpen(false);
    },
    [updateContent, updateDesign, onChange, setLocalText, setPreviewKey, setIsTemplateModalOpen]
  );

  const handleRemoveIcon = useCallback(() => {
    updateContent("icon", "");
    updateContent("iconUploaded", false);
    if (onChange) {
      onChange({ icon: "", iconUploaded: false });
    }
  }, [updateContent, onChange]);

  const handleUploadIcon = useCallback(() => {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
    fileInput.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        // Create a local URL for the uploaded file
        const imageUrl = URL.createObjectURL(file);
        updateContent("icon", imageUrl);
        updateContent("iconUploaded", true);
        updateContent("contentType", "image");
        if (onChange) {
          onChange({ 
            icon: imageUrl, 
            iconUploaded: true, 
            contentType: "image" 
          });
        }
      }
    };
    
    // Trigger the file input
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  }, [updateContent, onChange]);

  const ctaOptions = [
    { label: "No call to action", value: "noCta" },
    { label: "Shop now", value: "shopNow" },
    { label: "Learn more", value: "learnMore" },
  ];

  return (
    <>
    <Card>
      {/* <BlockStack>
        <TextField
          label={`${type.charAt(0) + type.slice(1).toLowerCase()} name`}
          value={localName}
          onChange={handleBadgeChange}
          placeholder={`Your ${type.toLowerCase()}`}
          autoComplete="off"
          helpText={
            <Text variant="bodySm" tone="subdued" as="p">
              Only visible to you. For your own internal reference.
            </Text>
          }
        />
        <div
          style={{
            marginTop: "10px",
          }}
        ></div>
        <Bleed marginInline="400">
          <Divider />
        </Bleed>
      </BlockStack> */}
      <div style={{ margin: "10px" }}></div>
      <BlockStack gap={"400"}>
       

        {/* Conditional Content Based on Type */}
        {badge.content.contentType === "text" ? (
          // Text Content
          <BlockStack gap="200">
            <Text as="p" variant="bodyMd">
              Text Content
            </Text>
            
            {/* Show current badge content preview */}
            {(localText || badge.content.text || (selectedTemplate && selectedTemplate.text) || (data && data.text)) && (
              <Box key={previewKey}>
                <div
                  style={{
                    // Use badge store design values first, then fall back to template
                    background: badge.design.color && badge.design.color !== "#7700ffff" ? badge.design.color : (selectedTemplate?.style?.background || data?.style?.background || "#7700ffff"),
                    color: badge.content.textColor || (selectedTemplate?.style?.color || data?.style?.color || "#ffffff"),
                    padding: "8px 12px",
                    borderRadius: badge.design.cornerRadius !== undefined && badge.design.cornerRadius !== 8 ? `${badge.design.cornerRadius}px` : (selectedTemplate?.style?.borderRadius || data?.style?.borderRadius || "4px"),
                    display: "inline-block",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    marginBottom: "8px",
                    // Apply clip-path if exists
                    ...(badge.design.shape && badge.design.shape.includes("clip-path") ? {
                      clipPath: badge.design.shape.match(/clip-path:\s*([^;]+)/)?.[1]
                    } : {})
                  }}
                >
                  <span style={{
                    fontWeight: badge.design.isBold ? 'bold' : 'normal',
                    fontStyle: badge.design.isItalic ? 'italic' : 'normal',
                    textDecoration: badge.design.isUnderline ? 'underline' : 'none'
                  }}>
                    {localText || badge.content.text || "Badge Text"}
                  </span>
                </div>
              </Box>
            )}

            <InlineStack gap="200">
              <Button
                onClick={() => {
                  setIsTemplateModalOpen(true);
                }}
                variant="secondary"
                fullWidth
              >
                Choose from library
              </Button>
             
            </InlineStack>

            <BlockStack gap="200">
              <Text as="p" variant="bodyMd">
                Label content
              </Text>

              {/* Formatting Tools */}
              <div style={{ 
                backgroundColor: '#f6f6f7', 
                borderRadius: '6px', 
                padding: '8px 12px',
                display: 'flex',
                gap: '8px',
                alignItems: 'center'
              }}>
                <Button
                  size="slim"
                  variant="plain"
                  icon={TextBoldIcon}
                  onClick={handleBold}
                  pressed={boldPressed}
                />
                <Button
                  size="slim"
                  variant="plain"
                  icon={TextItalicIcon}
                  onClick={handleItalic}
                  pressed={italicPressed}
                />
                <Button
                  size="slim"
                  variant="plain"
                  icon={TextUnderlineIcon}
                  onClick={handleUnderline}
                  pressed={underlinePressed}
                />
                <Button
                  size="slim"
                  variant="plain"
                  onClick={() => setEmojiPopoverActive(!emojiPopoverActive)}
                >
                  😊
                </Button>
                <Button
                  size="slim"
                  variant="secondary"
                  icon={ProductUnavailableIcon}
                  onClick={() => setAutoTextPopoverActive(!autoTextPopoverActive)}
                >
                  AutoText
                </Button>
              </div>

              {/* AutoText Dropdown */}
              {autoTextPopoverActive && (
                <div style={{
                  position: 'relative',
                  zIndex: 999999
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    padding: '8px',
                    zIndex: 999999
                  }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '8px'
                    }}>
                      {autoTextOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            insertAutoText(option.value);
                            setAutoTextPopoverActive(false);
                          }}
                          style={{
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontSize: '12px',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f9fafb';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                          }}
                        >
                          <div style={{ fontWeight: '500', marginBottom: '2px' }}>
                            {option.content}
                          </div>
                          <div style={{ fontSize: '11px', color: '#6b7280' }}>
                            {option.content === 'Discount %' ? 'SAVE 50%' : 
                             option.content === 'Discount amount' ? 'SAVE $50' :
                             option.content === 'Price' ? 'ONLY $50' :
                             option.content === 'Day release' ? 'NEW IN 3 DAYS' :
                             option.content === 'Remaining stock' ? 'ONLY 5 LEFT' :
                             option.content === 'Number of reviews' ? '45 reviews' :
                             option.content === 'Average rating' ? '5 stars' :
                             '100% cotton'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Emoji Popover */}
              {emojiPopoverActive && (
                <div style={{
                  position: 'relative',
                  zIndex: 999999
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '8px',
                    zIndex: 999999
                  }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(8, 1fr)',
                      gap: '4px'
                    }}>
                      {['😊', '🎉', '🔥', '⭐', '💯', '🚀', '✨', '💎', '🏆', '🎯', '💪', '🌟', '💫', '🎊', '🎁', '💖'].map((emoji, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            insertEmoji(emoji);
                            setEmojiPopoverActive(false);
                          }}
                          style={{
                            padding: '6px',
                            border: 'none',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            fontSize: '16px',
                            borderRadius: '4px',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <TextField
                label=""
                value={localText}
                onChange={handleTextChange}
                autoComplete="off"
                multiline={3}
                placeholder="Buy One<br>Get One<br>FREE"
              />
            </BlockStack>

          </BlockStack>
        ) : (
          // Image Content
          <BlockStack gap="200">
            <Text as="p" variant="bodyMd">
              Choose Image
            </Text>
            
            {badge.content.iconUploaded && (
              <Box>
                <Thumbnail
                  source={badge.content.icon || ""}
                  alt="Selected image"
                  size="large"
                />
              </Box>
            )}

            <InlineStack gap="200">
              <Button
                onClick={() => {
                  setIsTemplateModalOpen(true);
                }}
                variant="secondary"
                fullWidth
              >
                Choose from library
              </Button>
              <Button
                onClick={handleUploadIcon}
                fullWidth
              >
                Upload image
              </Button>
            </InlineStack>

            {badge.content.iconUploaded && (
              <Button
                onClick={handleRemoveIcon}
                variant="secondary"
                tone="critical"
                fullWidth
              >
                Remove image
              </Button>
            )}


          </BlockStack>
        )}

      
        <Text as="p" variant="bodySm" tone="subdued">
          Available with Starter plan.{" "}
          <a href="#" style={{ color: "blue" }}>
            Upgrade now.
          </a>
        </Text>
        <Bleed marginInline="400">
          <Divider />
        </Bleed>
      </BlockStack>
      <div style={{ margin: "10px" }}></div>
      <div style={{ margin: "10px" }}></div>
      <div
        style={{
          marginTop: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "10px",
        }}
      >
       
      </div>

      {/* Position Control */}
      <div style={{ margin: "10px" }}></div>
      <BlockStack gap="400">
        <InlineStack gap="100" align="start">
          <Text variant="headingMd" as={"h3"}>
            Position
          </Text>
          <TooltipIcon content={type === "LABEL" ? "Choose where to position your label on the product image" : "Choose how to align your badge below the product title"} />
        </InlineStack>

        <BlockStack gap="200">
          {type === "LABEL" ? (
            // Show 9-position grid for labels (overlays on product images)
            <>
              <Text as="p" variant="bodyMd" tone="subdued">
                Choose label position on product image
              </Text>
              
              <Box>
                <PositionGrid
                  selectedPosition={badge.design.gridPosition || GridPosition.TOP_LEFT}
                  onPositionChange={(position) => updateDesign("gridPosition", position)}
                />
                {/* <Text as="p" variant="bodySm" tone="subdued">
                  Click to select label position
                </Text> */}
              </Box>
            </>
          ) : (
            // Show horizontal position for badges (below product title)
            <>
              <Text as="p" variant="bodyMd" tone="subdued">
                Choose badge position on product page
              </Text>
              
              <Box>
                <BadgeHorizontalPositionComponent
                  selectedPosition={badge.design.horizontalPosition || BadgeHorizontalPosition.BELOW_PRODUCT_TITLE}
                  onPositionChange={(position) => updateDesign("horizontalPosition", position)}
                />
                <Text as="p" variant="bodySm" tone="subdued">
                  Select where to position the badge on the product page
                </Text>
              </Box>
              
              <BlockStack gap="200">
                <Text as="p" variant="bodyMd" tone="subdued">
                  Alignment
                </Text>
                <BadgeAlignmentComponent
                  selectedAlignment={badge.design.textAlignment || BadgeAlignment.LEFT}
                  onAlignmentChange={(alignment) => updateDesign("textAlignment", alignment)}
                />
                <Text as="p" variant="bodySm" tone="subdued">
                  Choose how to align the badge horizontally
                </Text>
              </BlockStack>
            </>
          )}
        </BlockStack>

        {/* <Bleed marginInline="400">
          <Divider />
        </Bleed> */}
      </BlockStack>

      {/* <Button fullWidth>Continue to design</Button> */}
    </Card>

    <TemplateGalleryModal
      isOpen={isTemplateModalOpen}
      onClose={() => setIsTemplateModalOpen(false)}
      onSelect={handleTemplateSelect}
      templateType={badge.content.contentType === "text" ? "text" : "image"}
    />
    </>
  );
};

export default ContentForm;
