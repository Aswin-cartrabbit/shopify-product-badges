import React, { useEffect, useState } from "react";
import { useBadgeStore } from "@/stores/BadgeStore";
import { Icon } from "@shopify/polaris";

interface TemplatePreviewProps {
  selectedTemplate?: any;
  device?: string;
}

export default function TemplatePreview({ selectedTemplate, device = 'desktop' }: TemplatePreviewProps) {
  const { badge } = useBadgeStore();
  const [forceUpdate, setForceUpdate] = useState(0);

  // Force re-render only when template actually changes (preserve view mode during design changes)
  useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [selectedTemplate?.id, selectedTemplate?.text, selectedTemplate?.src]);
  const { content, design, placement } = badge;

  // Helper function to detect shape type from clip-path
  const getShapeType = (clipPath: string): string => {
    const lowerPath = clipPath.toLowerCase();
    if (lowerPath.includes('circle') || lowerPath.includes('ellipse')) {
      return 'circular';
    }
    if (lowerPath.includes('polygon') && lowerPath.match(/polygon\([^)]*50%[^)]*\)/)) {
      if (lowerPath.match(/polygon\([^)]*,\s*[^,]*,\s*[^,]*,\s*[^,]*,\s*[^,]*,\s*[^,]*\)/)) {
        return 'hexagon';
      }
      if (lowerPath.includes('star') || lowerPath.match(/polygon\([^)]*\d+%\s+\d+%[^)]*\d+%\s+\d+%[^)]*\d+%\s+\d+%[^)]*\)/)) {
        return 'star';
      }
      return 'oval';
    }
    return 'polygon';
  };

  const positionMap = {
    TOP_LEFT: "badge-top-left",
    TOP_CENTER: "badge-top-center", 
    TOP_RIGHT: "badge-top-right",
    MIDDLE_LEFT: "badge-middle-left",
    MIDDLE_CENTER: "badge-middle-center",
    MIDDLE_RIGHT: "badge-middle-right",
    BOTTOM_LEFT: "badge-bottom-left",
    BOTTOM_CENTER: "badge-bottom-center",
    BOTTOM_RIGHT: "badge-bottom-right",
  };

  // Generate background CSS based on design settings
  const getBackgroundCSS = () => {
    if (design.background === "gradient" && design.isGradient) {
      return `linear-gradient(${design.gradientAngle}deg, ${design.gradient1}, ${design.gradient2})`;
    }
    return design.color;
  };

  // Function to render the badge content based on template type
  const renderBadgeContent = () => {
    // For image templates - NO SHAPES, just the image
    if (content.iconUploaded && content.icon) {
      const imageStyle: React.CSSProperties = {
        maxWidth: `${design.size || 36}px`,
        maxHeight: `${design.size || 36}px`,
        objectFit: "contain",
        opacity: (design.opacity || 100) / 100,
        transform: `rotate(${design.rotation || 0}deg) translate(${design.positionX || 0}px, ${design.positionY || 0}px)`,
        transition: "all 0.3s ease"
      };

      return (
        <img 
          src={content.icon} 
          alt="Badge icon"
          style={imageStyle}
        />
      );
    }

    // For text templates - combine selected template style with badge store data
    const isTemplateSelected = selectedTemplate && selectedTemplate.text && selectedTemplate.style;
    
    if (isTemplateSelected) {
      // Create responsive badge style that grows with content - using design dimensions
      const responsiveBadgeStyle: React.CSSProperties = {
        ...selectedTemplate.style,
        // Override with any changes from badge store
        background: design.color !== "#7700ffff" ? design.color : selectedTemplate.style.background,
        color: content.textColor || selectedTemplate.style.color || "#ffffff",
        borderRadius: design.cornerRadius !== 0 ? `${design.cornerRadius}px` : selectedTemplate.style.borderRadius,
        // Use design dimensions
        width: `${design.width || 120}px`,
        height: `${design.height || 40}px`,
        padding: "6px 12px", // Card-optimized padding
        fontSize: `${design.fontSize || 14}px`, // Use fontSize from design
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        whiteSpace: "nowrap",
        overflow: "visible", // Allow content to be visible
        textOverflow: "clip", // Don't ellipsize
        // Better text handling
        wordBreak: "keep-all",
        lineHeight: 1.2
      };

      // Apply shape from design store if selected - with proper text fitting
      if (design.shape && design.shape.includes("clip-path")) {
        const clipPathMatch = design.shape.match(/clip-path:\s*([^;]+)/);
        if (clipPathMatch) {
          const textLength = (content.text || selectedTemplate.text || "").length;
          
          // Apply the clip-path
          responsiveBadgeStyle.clipPath = clipPathMatch[1];
          
          // Analyze the shape and adjust accordingly
          const shapeType = getShapeType(clipPathMatch[1]);
          
          // Adjust styling for shaped badges based on shape type
          if (shapeType === 'circular' || shapeType === 'oval') {
            responsiveBadgeStyle.padding = "12px";
            responsiveBadgeStyle.minWidth = `${Math.max(80, textLength * 8)}px`;
            responsiveBadgeStyle.minHeight = `${Math.max(80, textLength * 8)}px`;
          } else if (shapeType === 'hexagon' || shapeType === 'star') {
            responsiveBadgeStyle.padding = "6px 12px";
            responsiveBadgeStyle.minWidth = `${Math.max(90, textLength * 9)}px`;
            responsiveBadgeStyle.minHeight = "50px";
          } else {
            responsiveBadgeStyle.padding = "8px 16px";
            responsiveBadgeStyle.minWidth = `${Math.max(100, textLength * 10)}px`;
            responsiveBadgeStyle.minHeight = "40px";
          }
          
          // Create shaped text container with adaptive styling
          const innerTextStyle: React.CSSProperties = {
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            wordWrap: "break-word",
            hyphens: "auto",
            lineHeight: shapeType === 'circular' ? 1.0 : 1.1,
            letterSpacing: shapeType === 'circular' ? "-1px" : "-0.5px",
            fontSize: shapeType === 'circular' ? "0.9em" : "1em",
            maxWidth: shapeType === 'circular' ? "80%" : "100%",
            margin: "auto"
          };

          return (
            <div style={responsiveBadgeStyle}>
              <div style={innerTextStyle}>
                <span style={{
                  fontWeight: design.isBold ? 'bold' : 'normal',
                  fontStyle: design.isItalic ? 'italic' : 'normal',
                  textDecoration: design.isUnderline ? 'underline' : 'none'
                }}>
                  {content.text || selectedTemplate.text}
                </span>
              </div>
            </div>
          );
        }
      }

      return (
        <div style={responsiveBadgeStyle}>
          {content.text || selectedTemplate.text}
        </div>
      );
    }

    // Default text badge with store styling - using design dimensions
    const badgeStyles: React.CSSProperties = {
      padding: "6px 12px", // Optimized for card view
      background: getBackgroundCSS(),
      color: content.textColor || "#ffffff",
      fontSize: `${design.fontSize || 14}px`, // Use fontSize from design
      fontWeight: 600,
      borderRadius: `${design.cornerRadius || 4}px`,
      whiteSpace: "nowrap",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      border: `${design.borderSize || 0}px solid ${design.borderColor || "transparent"}`,
      fontFamily: content.font === "own_theme" ? "inherit" : content.font?.replace("_", " "),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      // Use design dimensions
      width: `${design.width || 120}px`,
      height: `${design.height || 40}px`,
      overflow: "visible", // Allow content to be visible
      textOverflow: "clip",
      lineHeight: 1.2,
      wordBreak: "keep-all"
    };

    // Apply clip-path if it exists in design - with proper text container
    if (design.shape && design.shape.includes("clip-path")) {
      const clipPathMatch = design.shape.match(/clip-path:\s*([^;]+)/);
      if (clipPathMatch) {
        // Apply the clip-path
        badgeStyles.clipPath = clipPathMatch[1];
        
        // Analyze the shape and adjust accordingly
        const shapeType = getShapeType(clipPathMatch[1]);
        
        // Get text length for shape adjustments
        const textLength = (content.text || "Badge Text").length;
        
        // Adjust styling for shaped badges based on shape type
        if (shapeType === 'circular' || shapeType === 'oval') {
          badgeStyles.padding = "12px";
          badgeStyles.minWidth = `${Math.max(80, textLength * 8)}px`;
          badgeStyles.minHeight = `${Math.max(80, textLength * 8)}px`;
        } else if (shapeType === 'hexagon' || shapeType === 'star') {
          badgeStyles.padding = "6px 12px";
          badgeStyles.minWidth = `${Math.max(90, textLength * 9)}px`;
          badgeStyles.minHeight = "50px";
        } else {
          badgeStyles.padding = "8px 16px";
          badgeStyles.minWidth = `${Math.max(100, textLength * 10)}px`;
          badgeStyles.minHeight = "40px";
        }
        
        // Create shaped text container with adaptive styling
        const innerTextStyle: React.CSSProperties = {
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          wordWrap: "break-word",
          hyphens: "auto",
          lineHeight: shapeType === 'circular' ? 1.0 : 1.1,
          letterSpacing: shapeType === 'circular' ? "-1px" : "-0.5px",
          fontSize: shapeType === 'circular' ? "0.9em" : "1em",
          maxWidth: shapeType === 'circular' ? "80%" : "100%",
          margin: "auto",
          padding: "2px 4px"
        };

        return (
          <div style={badgeStyles}>
            <div style={innerTextStyle}>
              <span style={{
                fontWeight: design.isBold ? 'bold' : 'normal',
                fontStyle: design.isItalic ? 'italic' : 'normal',
                textDecoration: design.isUnderline ? 'underline' : 'none'
              }}>
                {content.text || "Badge Text"}
              </span>
            </div>
          </div>
        );
      }
    }

    return (
      <div style={badgeStyles}>
        <span style={{
          fontWeight: design.isBold ? 'bold' : 'normal',
          fontStyle: design.isItalic ? 'italic' : 'normal',
          textDecoration: design.isUnderline ? 'underline' : 'none'
        }}>
          {content.text || "Badge Text"}
        </span>
      </div>
    );
  };

  const positionClass = design.gridPosition 
    ? positionMap[design.gridPosition] 
    : "badge-top-right";

  // Sample badge variations for multiple display
  const sampleBadges = [
    { text: content.text || "LIMITED TIME", color: "#ff1919", position: "badge-top-left" },
    { text: "IN STOCK", color: "#8bc34a", position: "badge-top-center" },
    { text: "NEW ARRIVAL", color: "#2196f3", position: "badge-top-right" },
    { text: "HOT ITEM", color: "#ff9800", position: "badge-middle-right" },
    { text: "SALE", color: "#e91e63", position: "badge-bottom-left" },
    { text: "TOP PICK", color: "#9c27b0", position: "badge-bottom-center" },
    { text: "EXCLUSIVE", color: "#607d8b", position: "badge-bottom-right" },
    { text: "FLASH DEAL", color: "#ff5722", position: "badge-middle-left" }
  ];

  const ProductCard = ({ badges = [], className = "", showUserBadge = false }: { badges?: any[], className?: string, showUserBadge?: boolean }) => (
    <div className={`product-card ${className}`} style={{
      backgroundColor: "white",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      transition: "all 0.2s ease"
    }}>
      <div className="product-image-container" style={{ 
        position: "relative", 
        aspectRatio: "1",
        backgroundColor: "#f8f9fa",
        backgroundImage: "url('https://cdn.shopify.com/s/files/1/0746/2705/5920/files/gh__240x240_bc4473fa-0e07-4983-bbd4-ea2ccd19d36e_350x350.png?v=1718181897')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
        {/* Show user's current badge if showUserBadge is true */}
        {showUserBadge && (
          <div className={`product-badge ${positionClass}`} style={{ position: "absolute", zIndex: 10 }}>
            {renderBadgeContent()}
          </div>
        )}
        
        {/* Show sample badges if not showing user badge */}
        {!showUserBadge && badges.map((badgeData, index) => (
          <div 
            key={index}
            className={`product-badge ${badgeData.position || positionClass}`}
            style={{
              padding: "6px 12px",
              background: badgeData.color || design.color,
              color: "white",
              fontSize: "0.75rem",
              fontWeight: "600",
              borderRadius: "4px",
              whiteSpace: "nowrap",
              zIndex: 10
            }}
          >
            {badgeData.text}
          </div>
        ))}
      </div>
      <div style={{ padding: "16px" }}>
        <h3 className="product-title" style={{ 
          fontSize: "1rem", 
          fontWeight: "600", 
          marginBottom: "8px",
          color: "#111827",
          lineHeight: "1.4"
        }}>
          Product name
        </h3>
        <p className="price" style={{ 
          fontSize: "1rem", 
          fontWeight: "600", 
          color: "#111827" 
        }}>
          $10 USD <span className="original-price" style={{ fontSize: "0.875rem", color: "#6B7280", fontWeight: "400" }}>(Product price)</span>
        </p>
      </div>
    </div>
  );

  return (
    <div key={`template-preview-${selectedTemplate?.id || 'default'}`}>
      <style>{`
        .product-image-container {
          position: relative;
          display: inline-block;
          width: 100%;
        }

        /* Badge positioning */
        .badge-top-left {
          position: absolute;
          top: 8px;
          left: 8px;
        }

        .badge-top-center {
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
        }

        .badge-top-right {
          position: absolute;
          top: 8px;
          right: 8px;
        }

        .badge-middle-left {
          position: absolute;
          top: 50%;
          left: 8px;
          transform: translateY(-50%);
        }

        .badge-middle-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .badge-middle-right {
          position: absolute;
          top: 50%;
          right: 8px;
          transform: translateY(-50%);
        }

        .badge-bottom-left {
          position: absolute;
          bottom: 8px;
          left: 8px;
        }

        .badge-bottom-center {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
        }

        .badge-bottom-right {
          position: absolute;
          bottom: 8px;
          right: 8px;
        }

        .product-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .preview-container {
          
          min-height: 400px;
          border-radius: 12px;
          padding: 24px;
        }

        .preview-container.mobile {
          padding: 16px;
        }

        .products-grid {
          display: grid;
          gap: 24px;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          max-width: 1200px;
          margin: 0 auto;
        }

        .products-grid.mobile {
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          max-width: 380px;
          margin: 0 auto;
        }

        .products-grid.mobile .product-card {
          min-height: 280px;
        }

        .products-grid.mobile .product-card img {
          height: 160px;
        }

        .products-grid.mobile .product-card h3 {
          font-size: 14px !important;
          margin: 8px 0 4px 0 !important;
        }

        .products-grid.mobile .product-card .price {
          font-size: 13px !important;
          font-weight: 600 !important;
          color: #333 !important;
        }

        .products-grid.mobile .product-card .original-price {
          font-size: 11px !important;
          color: #666 !important;
        }

        .products-grid.mobile .product-card > div:last-child {
          padding: 12px !important;
        }

        .view-toggle {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }
      `}</style>
      
      {/* Preview Container - Collection Page Only */}
      <div className="preview-container collection">
        <div className={`products-grid ${device}`}>
          <ProductCard showUserBadge={true} />
          <ProductCard showUserBadge={true} />
          <ProductCard showUserBadge={true} />
          {device === 'mobile' && <ProductCard showUserBadge={true} />}
        </div>
      </div>
    </div>
  );
}
