import React, { useEffect, useState } from "react";
import { useBadgeStore } from "@/stores/BadgeStore";

interface TemplatePreviewProps {
  selectedTemplate?: any;
}

export default function TemplatePreview({ selectedTemplate }: TemplatePreviewProps) {
  const { badge } = useBadgeStore();
  const [forceUpdate, setForceUpdate] = useState(0);

  // Force re-render when template changes
  useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [selectedTemplate, badge]);
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
      // Create responsive badge style that grows with content
      const responsiveBadgeStyle: React.CSSProperties = {
        ...selectedTemplate.style,
        // Override with any changes from badge store
        background: design.color !== "#7700ffff" ? design.color : selectedTemplate.style.background,
        color: content.textColor || selectedTemplate.style.color || "#ffffff",
        borderRadius: design.cornerRadius !== 0 ? `${design.cornerRadius}px` : selectedTemplate.style.borderRadius,
        // Make it responsive to content
        minWidth: selectedTemplate.style.width || "auto",
        width: "auto", // Allow it to grow
        maxWidth: "250px", // Increased max width
        height: "auto",
        minHeight: selectedTemplate.style.height || "30px",
        padding: "10px 16px", // Better padding for text
        fontSize: `${(design.size || 36) * 0.5}px`, // Scale font size with design size
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        whiteSpace: "nowrap",
        overflow: "visible", // Allow content to be visible
        textOverflow: "clip", // Don't ellipsize
        // Ensure proper sizing for preview
        transform: "scale(0.8)",
        transformOrigin: "center",
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
                {content.text || selectedTemplate.text}
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

    // Default text badge with store styling - RESPONSIVE AND SHAPES
    const textLength = (content.text || "Badge Text").length;
    const badgeStyles: React.CSSProperties = {
      padding: "10px 16px", // Better responsive padding
      background: getBackgroundCSS(),
      color: content.textColor || "#ffffff",
      fontSize: `${(design.size || 36) * 0.4}px`, // Scale font size with design size
      fontWeight: 600,
      borderRadius: `${design.cornerRadius}px`,
      whiteSpace: "nowrap",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      border: `${design.borderSize}px solid ${design.borderColor}`,
      fontFamily: content.font === "own_theme" ? "inherit" : content.font?.replace("_", " "),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      // Responsive sizing based on text length
      minWidth: `${Math.max(60, textLength * 6)}px`,
      width: "auto", // Allow growth
      maxWidth: "250px", // Prevent overflow
      height: "auto",
      minHeight: "30px",
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
              {content.text || "Badge Text"}
            </div>
          </div>
        );
      }
    }

    return (
      <div style={badgeStyles}>
        {content.text || "Badge Text"}
      </div>
    );
  };

  const positionClass = design.gridPosition 
    ? positionMap[design.gridPosition] 
    : "badge-top-right";

  return (
    <div key={`template-${selectedTemplate?.id || 'default'}-${forceUpdate}`}>
      <style>{`
        .product-image-container {
          position: relative;
          display: inline-block;
          width: 100%;
        }

        /* Top row positions */
        .badge-top-left {
          position: absolute;
          top: 0.5rem;
          left: 0.5rem;
          z-index: 10;
        }

        .badge-top-center {
          position: absolute;
          top: 0.5rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
        }

        .badge-top-right {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          z-index: 10;
        }

        /* Middle row positions */
        .badge-middle-left {
          position: absolute;
          top: 50%;
          left: 0.5rem;
          transform: translateY(-50%);
          z-index: 10;
        }

        .badge-middle-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
        }

        .badge-middle-right {
          position: absolute;
          top: 50%;
          right: 0.5rem;
          transform: translateY(-50%);
          z-index: 10;
        }

        /* Bottom row positions */
        .badge-bottom-left {
          position: absolute;
          bottom: 0.5rem;
          left: 0.5rem;
          z-index: 10;
        }

        .badge-bottom-center {
          position: absolute;
          bottom: 0.5rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
        }

        .badge-bottom-right {
          position: absolute;
          bottom: 0.5rem;
          right: 0.5rem;
          z-index: 10;
        }
      `}</style>
      
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "3rem",
        alignItems: "start"
      }}>
        <div>
          <div className="product-image-container" style={{ marginBottom: "2rem", maxWidth: "300px" }}>
            <div style={{
              backgroundImage: "url('https://cdn.shopify.com/s/files/1/0746/2705/5920/files/gh__240x240_bc4473fa-0e07-4983-bbd4-ea2ccd19d36e_350x350.png?v=1718181897')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundColor: "#f8f9fa",
              aspectRatio: "1",
              borderRadius: "0.5rem",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.125rem",
              color: "#6b7280"
            }}>
            </div>
            
            <div className={`product-badge ${positionClass}`}>
              {renderBadgeContent()}
            </div>
          </div>
          
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {[1, 2, 3, 4].map(num => (
              <div
                key={num}
                style={{
                  backgroundColor: "#f8f9fa",
                  aspectRatio: "1",
                  borderRadius: "0.375rem",
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.875rem",
                  color: "#9ca3af",
                  cursor: "pointer"
                }}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <div style={{
            marginBottom: "0.5rem",
            fontSize: "0.875rem",
            color: "#6b7280",
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}>
            Category Name
          </div>
          
          <h1 style={{
            fontSize: "2.25rem",
            fontWeight: "bold",
            marginBottom: "1rem",
            lineHeight: 1.2
          }}>
            Premium Product Name
          </h1>
          
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1.5rem"
          }}>
            <div style={{ display: "flex", color: "#fbbf24" }}>★★★★★</div>
            <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>(128 reviews)</span>
          </div>
          
          <div style={{ marginBottom: "2rem" }}>
            <div style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#2563eb",
              marginBottom: "0.5rem"
            }}>
              $299.99
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              <span style={{ textDecoration: "line-through" }}>$399.99</span>
              <span style={{ color: "#dc2626", marginLeft: "0.5rem", fontWeight: 500 }}>
                25% off
              </span>
            </div>
          </div>
          
          <p style={{
            color: "#4b5563",
            marginBottom: "2rem",
            lineHeight: 1.6
          }}>
            This is a detailed product description that highlights the key features
            and benefits of the product. It provides customers with essential
            information to make an informed purchasing decision.
          </p>
          
          <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
            <button style={{
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              padding: "0.75rem 2rem",
              borderRadius: "0.375rem",
              fontSize: "1rem",
              fontWeight: 500,
              cursor: "pointer",
              flex: 1
            }}>
              Add to Cart
            </button>
            <button style={{
              backgroundColor: "transparent",
              color: "#2563eb",
              border: "1px solid #2563eb",
              padding: "0.75rem 1rem",
              borderRadius: "0.375rem",
              cursor: "pointer"
            }}>
              ♡
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
