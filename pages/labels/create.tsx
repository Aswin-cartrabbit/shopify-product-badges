import {
  Page,
  Card,
  Text,
  Button,
  BlockStack,
  InlineStack,
  Tabs,
  Badge,
  TextField,
  Icon,
  Avatar,
  Box,
} from "@shopify/polaris";
import { useState } from "react";
import { useRouter } from "next/router";
import { 
  ArrowLeftIcon,
  UploadIcon,
  ImageIcon
} from "@shopify/polaris-icons";

export default function CreateLabel() {
  const [selectedTab, setSelectedTab] = useState(0);

  const [selectedCategory, setSelectedCategory] = useState("Sales");
  const [aiPrompt, setAiPrompt] = useState("");
  const router = useRouter();

  // Text label templates with the provided styles
  const textLabels = [
    {
      id: "limited-time",
      text: "LIMITED TIME",
      style: {
        width: "120px",
        height: "30px",
        background: "#FF1919",
        color: "white",
        fontWeight: "bold",
        fontFamily: "'Alata', sans-serif",
        fontSize: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)"
      }
    },
    {
      id: "in-stock",
      text: "IN STOCK",
      style: {
        width: "120px",
        height: "30px",
        background: "#8BC34A",
        color: "black",
        fontWeight: "bold",
        fontFamily: "'Alata', sans-serif",
        fontSize: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)"
      }
    },
    {
      id: "new-arrival",
      text: "NEW ARRIVAL",
      style: {
        width: "120px",
        height: "30px",
        background: "#3F51B5",
        color: "white",
        fontWeight: "bold",
        fontFamily: "'Alata', sans-serif",
        fontSize: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "15px"
      }
    },
    {
      id: "hot-item",
      text: "HOT ITEM",
      style: {
        width: "120px",
        height: "30px",
        background: "#FF5722",
        color: "white",
        fontWeight: "bold",
        fontFamily: "'Alata', sans-serif",
        fontSize: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "15px"
      }
    },
    {
      id: "sale",
      text: "SALE",
      style: {
        width: "60px",
        height: "60px",
        background: "#FFEB3B",
        color: "black",
        fontWeight: "bold",
        fontFamily: "'Alata', sans-serif",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%"
      }
    },
    {
      id: "bestseller",
      text: "BESTSELLER",
      style: {
        width: "120px",
        height: "30px",
        background: "#9C27B0",
        color: "white",
        fontWeight: "bold",
        fontFamily: "'Alata', sans-serif",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)"
      }
    },
    {
      id: "50-off",
      text: "50% OFF",
      style: {
        width: "60px",
        height: "60px",
        background: "#E91E63",
        color: "white",
        fontWeight: "bold",
        fontFamily: "'Alata', sans-serif",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%"
      }
    },
    {
      id: "featured",
      text: "FEATURED",
      style: {
        width: "120px",
        height: "30px",
        background: "#009688",
        color: "white",
        fontWeight: "bold",
        fontFamily: "'Alata', sans-serif",
        fontSize: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "15px"
      }
    },
    {
      id: "exclusive",
      text: "EXCLUSIVE",
      style: {
        width: "120px",
        height: "30px",
        background: "#FFB300",
        color: "black",
        fontWeight: "bold",
        fontFamily: "'Alata', sans-serif",
        fontSize: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)"
      }
    },
    {
      id: "free-ship",
      text: "FREE SHIP",
      style: {
        width: "70px",
        height: "70px",
        background: "#4CAF50",
        color: "white",
        fontWeight: "bold",
        fontFamily: "'Alata', sans-serif",
        fontSize: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%"
      }
    },
    {
      id: "premium",
      text: "PREMIUM",
      style: {
        width: "120px",
        height: "30px",
        background: "#212121",
        color: "white",
        fontWeight: "bold",
        fontFamily: "'Alata', sans-serif",
        fontSize: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "15px"
      }
    },
    {
      id: "trending",
      text: "TRENDING",
      style: {
        width: "120px",
        height: "30px",
        background: "#FF9800",
        color: "white",
        fontWeight: "bold",
        fontFamily: "'Alata', sans-serif",
        fontSize: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)"
      }
    },
    {
      id: "deal",
      text: "DEAL",
      style: {
        width: "60px",
        height: "60px",
        background: "#F44336",
        color: "white",
        fontWeight: "bold",
        fontFamily: "'Alata', sans-serif",
        fontSize: "13px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        clipPath: "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)"
      }
    },
    {
      id: "top-rated",
      text: "TOP RATED",
      style: {
        width: "120px",
        height: "30px",
        background: "#2196F3",
        color: "white",
        fontWeight: "bold",
        fontFamily: "'Alata', sans-serif",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)"
      }
    },
    {
      id: "limited",
      text: "LIMITED",
      style: {
        width: "60px",
        height: "60px",
        background: "#673AB7",
        color: "white",
        fontWeight: "bold",
        fontFamily: "'Alata', sans-serif",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%"
      }
    },
    {
      id: "flash-sale",
      text: "FLASH SALE",
      style: {
        width: "120px",
        height: "30px",
        background: "#FFC107",
        color: "black",
        fontWeight: "bold",
        fontFamily: "'Alata', sans-serif",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)"
      }
    },
    {
      id: "organic",
      text: "ORGANIC",
      style: {
        width: "120px",
        height: "30px",
        background: "#689F38",
        color: "white",
        fontWeight: "bold",
        fontFamily: "'Alata', sans-serif",
        fontSize: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "15px"
      }
    },
    {
      id: "luxury",
      text: "LUXURY",
      style: {
        width: "60px",
        height: "60px",
        background: "linear-gradient(45deg, #FFD700, #FFA500)",
        color: "black",
        fontWeight: "bold",
        fontFamily: "'Alata', sans-serif",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%"
      }
    },
    {
      id: "clearance",
      text: "CLEARANCE",
      style: {
        width: "120px",
        height: "30px",
        background: "#E91E63",
        color: "white",
        fontWeight: "bold",
        fontFamily: "'Alata', sans-serif",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)"
      }
    },
    {
      id: "wholesale",
      text: "WHOLESALE",
      style: {
        width: "120px",
        height: "30px",
        background: "#00BCD4",
        color: "white",
        fontWeight: "bold",
        fontFamily: "'Alata', sans-serif",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "15px"
      }
    },
    {
      id: "save-money",
      text: "SAVE $10",
      style: {
        width: "80px",
        height: "80px",
        background: "#4CAF50",
        color: "white",
        fontWeight: "bold",
        fontFamily: "'Alata', sans-serif",
        fontSize: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        border: "3px solid #2E7D32"
      }
    },
    {
      id: "coming-soon",
      text: "COMING SOON",
      style: {
        width: "130px",
        height: "25px",
        background: "#607D8B",
        color: "white",
        fontWeight: "bold",
        fontFamily: "'Alata', sans-serif",
        fontSize: "11px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "12px"
      }
    },
    {
      id: "eco-friendly",
      text: "ECO",
      style: {
        width: "60px",
        height: "60px",
        background: "#8BC34A",
        color: "white",
        fontWeight: "bold",
        fontFamily: "'Alata', sans-serif",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%"
      }
    },
    {
      id: "handmade",
      text: "HANDMADE",
      style: {
        width: "120px",
        height: "30px",
        background: "#8D6E63",
        color: "white",
        fontWeight: "bold",
        fontFamily: "'Alata', sans-serif",
        fontSize: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "15px"
      }
    },
    {
      id: "bundle-deal",
      text: "BUNDLE",
      style: {
        width: "120px",
        height: "30px",
        background: "#FF6F00",
        color: "white",
        fontWeight: "bold",
        fontFamily: "'Alata', sans-serif",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)"
      }
    }
  ];

  // Image labels from the provided JSON data
  const imageLabels = [
    {
      id: "free-shipping-1",
      src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/674ec6d8ee7fe.png",
      alt: "Free shipping",
      type: "shipping"
    },
    {
      id: "free-shipping-car",
      src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/67469f6b53270.png",
      alt: "Free shipping car with arrow",
      type: "shipping"
    },
    {
      id: "express-delivery-1",
      src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/6746a377c8246.png",
      alt: "Express delivery guaranteed",
      type: "express_delivery"
    },
    {
      id: "express-delivery-2",
      src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/6746a3a804c12.png",
      alt: "Express delivery easy return",
      type: "express_delivery"
    },
    {
      id: "free-delivery-red",
      src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/6728a3f13ba1a.png",
      alt: "Free delivery red badge",
      type: "free_delivery"
    },
    {
      id: "free-100-delivery",
      src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/6728a2a96fb99.png",
      alt: "Free 100% delivery",
      type: "free_delivery"
    },
    {
      id: "free-shipping-plane",
      src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/asset-9-28.png",
      alt: "Free shipping plane",
      type: "shipping"
    },
    {
      id: "same-day-delivery",
      src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/6728a2eead152.png",
      alt: "Same day delivery",
      type: "same_day_delivery"
    },
    {
      id: "free-shipping-animated",
      src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/67289b422e95b.png",
      alt: "Free shipping animated",
      type: "shipping"
    },
    {
      id: "free-delivery-truck",
      src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/67289c4850548.png",
      alt: "Free delivery blue truck",
      type: "free_delivery"
    },
    {
      id: "express-delivery-stamp",
      src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/67289b0682b22.png",
      alt: "Express delivery stamp",
      type: "express_delivery"
    },
    {
      id: "free-shipping-green",
      src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/free-shipping-green.png",
      alt: "Free shipping round sticker",
      type: "shipping"
    },
    {
      id: "free-delivery-plane",
      src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/6746d53030846.png",
      alt: "Free delivery tag plane",
      type: "free_delivery"
    },
    {
      id: "free-delivery-card",
      src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/6746d5a59566e.png",
      alt: "Free delivery card",
      type: "free_delivery"
    },
    {
      id: "free-shipping-2",
      src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/658503fb07d32.png",
      alt: "Free Shipping",
      type: "shipping"
    }
  ];

  const tabs = [
    {
      id: "image-label", 
      content: "Image Label",
      accessibilityLabel: "Image Label",
      panelID: "image-label-panel",
    },
    {
      id: "text-label",
      content: "Text Label",
      accessibilityLabel: "Text Label",
      panelID: "text-label-panel",
    },
  ];

  const handleLabelSelect = (labelId: string) => {
    // Find the selected template data
    const selectedTemplate = [...textLabels, ...imageLabels].find(
      (template) => template.id === labelId
    );
    
    // Immediately navigate to customization page with selected template
    router.push({
      pathname: "/labels/new",
      query: { 
        template: labelId,
        templateData: JSON.stringify(selectedTemplate)
      }
    });
  };

  const renderTextLabels = () => {
    // Filter labels based on selected category
    const filteredLabels = textLabels.filter(label => {
      if (selectedCategory === "Sales") {
        return ["sale", "50-off", "flash-sale", "clearance", "deal", "limited-time", "bestseller"].includes(label.id);
      }
      if (selectedCategory === "Free shipping") {
        return ["free-ship"].includes(label.id);
      }
      if (selectedCategory === "Stock") {
        return ["in-stock"].includes(label.id);
      }
      if (selectedCategory === "Coming soon") {
        return ["coming-soon"].includes(label.id);
      }
      if (selectedCategory === "Organic") {
        return ["organic", "eco-friendly"].includes(label.id);
      }
      if (selectedCategory === "New") {
        return ["new-arrival", "hot-item"].includes(label.id);
      }
      // Add more category filtering as needed
      return true;
    });
    
    return (
      <div 
        className="scroll-container"
        style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(3, 1fr)", 
          gap: "8px",
          width: "100%",
          minHeight: "530px",
          maxHeight: "530px",
          overflowY: "auto",
          overflowX: "hidden",
          padding: "5px 8px 5px 0",
          WebkitOverflowScrolling: "touch",
          position: "relative"
        }}>
        {/* Create from scratch card */}
        <div 
          style={{
            backgroundColor: "#f6f6f7",
            border: "1px solid #e1e1e1",
            borderRadius: "12px",
            padding: "16px",
            textAlign: "center",
            width: "244px",
            height: "272px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer"
          }}
        >
          {/* Sparkle icons */}
          <div style={{ position: "relative", marginBottom: "16px" }}>
            <div style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#1976d2",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative"
            }}>
              <svg 
                viewBox="0 0 20 20" 
                style={{ width: "24px", height: "24px", fill: "white" }}
                focusable="false" 
                aria-hidden="true"
              >
                <path 
                  fillRule="evenodd" 
                  d="M7 3.25a.75.75 0 0 1 .695.467l2.75 6.75a.75.75 0 0 1-1.39.566l-.632-1.553a.752.752 0 0 1-.173.02h-2.68l-.625 1.533a.75.75 0 1 1-1.39-.566l2.75-6.75a.75.75 0 0 1 .695-.467Zm.82 4.75-.82-2.012-.82 2.012h1.64Z"
                />
                <path d="M4.25 12.5a.75.75 0 0 0 0 1.5h11.5a.75.75 0 0 0 0-1.5h-11.5Z" />
                <path d="M4.25 15a.75.75 0 0 0 0 1.5h7a.75.75 0 0 0 0-1.5h-7Z" />
                <path 
                  fillRule="evenodd" 
                  d="M15.066 5.94a3 3 0 1 0 0 5.118.75.75 0 0 0 1.434-.308v-4.5a.75.75 0 0 0-1.434-.31Zm-1.566 4.06a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                />
              </svg>
            </div>
            {/* Orange sparkle */}
            <div style={{
              position: "absolute",
              top: "-8px",
              left: "-8px",
              width: "16px",
              height: "16px",
              backgroundColor: "#ff9800",
              clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"
            }}></div>
            {/* Blue sparkle */}
            <div style={{
              position: "absolute",
              top: "-4px",
              right: "-12px",
              width: "20px",
              height: "20px",
              backgroundColor: "#2196f3",
              clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"
            }}></div>
          </div>
          
          <div style={{ marginBottom: "16px" }}>
            <div style={{ 
              fontSize: "16px", 
              fontWeight: "600", 
              color: "#1a1a1a",
              marginBottom: "8px"
            }}>
              Design Text Badge
            </div>
          </div>
          
          <Button 
            variant="secondary"
            size="medium"
            onClick={() => router.push({
              pathname: "/labels/new",
              query: { 
                template: "create-from-scratch",
                templateData: JSON.stringify({
                  id: "create-from-scratch",
                  type: "text",
                  text: "SAVE XX%",
                                    style: {
                    width: "30%",
                    height: "10%",
                    backgroundColor: "rgb(185, 185, 185)",
                    color: "rgb(94, 88, 115)",
                    fontSize: "12.4px",
                    fontWeight: "normal",
                    letterSpacing: "0px",
                    textDecoration: "none",
                    wordBreak: "break-word",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "0px",
                    border: "0px none rgb(0, 0, 0)",
                    margin: "0px",
                    opacity: 1,
                    top: "0px",
                    left: "0px"
                  }
                })
              }
            })}
          >
            Create from Scratch
          </Button>
        </div>
        
        {filteredLabels.map((label) => (
        <div 
          key={label.id}
          style={{
            backgroundColor: "white",
            border: "1px solid #e1e1e1",
            borderRadius: "12px",
            padding: "16px",
            textAlign: "center",
            width: "244px",
            height: "272px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          {/* Label Preview Area */}
          <div style={{
            width: "100%",
            height: "120px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            borderRadius: "8px",
            backgroundColor: "#f8f9fa",
            marginBottom: "12px"
          }}>
            <div style={{
              ...label.style,
              transform: "scale(0.8)"
            }}>
              {label.text}
            </div>
          </div>
          
          {/* Text Icon and Text */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            marginBottom: "8px"
          }}>
            <div style={{
              display: "flex", 
              alignItems: "center", 
              gap: "4px",
              backgroundColor: "gray",
              color: "white",
              padding: "2px 6px",
              borderRadius: "6px",
              fontSize: "11px"
            }}>
              <svg 
                viewBox="0 0 20 20" 
                style={{ width: "12px", height: "12px", fill: "currentColor" }}
                focusable="false" 
                aria-hidden="true"
              >
                <path 
                  fillRule="evenodd" 
                  d="M7 3.25a.75.75 0 0 1 .695.467l2.75 6.75a.75.75 0 0 1-1.39.566l-.632-1.553a.752.752 0 0 1-.173.02h-2.68l-.625 1.533a.75.75 0 1 1-1.39-.566l2.75-6.75a.75.75 0 0 1 .695-.467Zm.82 4.75-.82-2.012-.82 2.012h1.64Z"
                />
                <path d="M4.25 12.5a.75.75 0 0 0 0 1.5h11.5a.75.75 0 0 0 0-1.5h-11.5Z" />
                <path d="M4.25 15a.75.75 0 0 0 0 1.5h7a.75.75 0 0 0 0-1.5h-7Z" />
                <path 
                  fillRule="evenodd" 
                  d="M15.066 5.94a3 3 0 1 0 0 5.118.75.75 0 0 0 1.434-.308v-4.5a.75.75 0 0 0-1.434-.31Zm-1.566 4.06a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                />
              </svg>
              <span>Text</span>
            </div>
          </div>
          
          {/* Label Title */}
          <div style={{ marginBottom: "12px" }}>
            <Text as="p" variant="bodySm" fontWeight="medium">
              {label.text.charAt(0) + label.text.slice(1).toLowerCase()}
            </Text>
          </div>
          
          {/* Select Button */}
          <Button 
            variant="secondary"
            onClick={() => handleLabelSelect(label.id)}
            size="medium"
            fullWidth
          >
            Select
          </Button>
        </div>
        ))}
      </div>
    );
  };

  const renderImageLabels = () => {
    // Filter image labels based on selected category
    const filteredImageLabels = imageLabels.filter(label => {
      if (selectedCategory === "Shipping") {
        return label.type === "shipping";
      }
      if (selectedCategory === "Delivery") {
        return ["free_delivery", "same_day_delivery"].includes(label.type);
      }
      if (selectedCategory === "Express") {
        return label.type === "express_delivery";
      }
      if (selectedCategory === "Free shipping") {
        return label.type === "shipping";
      }
      if (selectedCategory === "Same day") {
        return label.type === "same_day_delivery";
      }
      // Add more category filtering as needed
      return true;
    });
    
    return (
      <div 
        className="scroll-container"
        style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(3, 1fr)", 
          gap: "8px",
          width: "100%",
          minHeight: "530px",
          maxHeight: "530px",
          overflowY: "auto",
          overflowX: "hidden",
          padding: "5px 8px 5px 0",
          WebkitOverflowScrolling: "touch",
          position: "relative"
        }}>
        {/* Create from scratch card */}
        <div 
          style={{
            backgroundColor: "#f6f6f7",
            border: "1px solid #e1e1e1",
            borderRadius: "12px",
            padding: "16px",
            textAlign: "center",
            width: "244px",
            height: "272px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer"
          }}
        >
          {/* Sparkle icons */}
          <div style={{ position: "relative", marginBottom: "16px" }}>
            <div style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#1976d2",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative"
            }}>
              <svg 
                viewBox="0 0 20 20" 
                style={{ width: "24px", height: "24px", fill: "white" }}
                focusable="false" 
                aria-hidden="true"
              >
                <path 
                  fillRule="evenodd" 
                  d="M7 3.25a.75.75 0 0 1 .695.467l2.75 6.75a.75.75 0 0 1-1.39.566l-.632-1.553a.752.752 0 0 1-.173.02h-2.68l-.625 1.533a.75.75 0 1 1-1.39-.566l2.75-6.75a.75.75 0 0 1 .695-.467Zm.82 4.75-.82-2.012-.82 2.012h1.64Z"
                />
                <path d="M4.25 12.5a.75.75 0 0 0 0 1.5h11.5a.75.75 0 0 0 0-1.5h-11.5Z" />
                <path d="M4.25 15a.75.75 0 0 0 0 1.5h7a.75.75 0 0 0 0-1.5h-7Z" />
                <path 
                  fillRule="evenodd" 
                  d="M15.066 5.94a3 3 0 1 0 0 5.118.75.75 0 0 0 1.434-.308v-4.5a.75.75 0 0 0-1.434-.31Zm-1.566 4.06a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                />
              </svg>
            </div>
            {/* Orange sparkle */}
            <div style={{
              position: "absolute",
              top: "-8px",
              left: "-8px",
              width: "16px",
              height: "16px",
              backgroundColor: "#ff9800",
              clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"
            }}></div>
            {/* Blue sparkle */}
            <div style={{
              position: "absolute",
              top: "-4px",
              right: "-12px",
              width: "20px",
              height: "20px",
              backgroundColor: "#2196f3",
              clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"
            }}></div>
          </div>
          
          <div style={{ marginBottom: "16px" }}>
            <div style={{ 
              fontSize: "16px", 
              fontWeight: "600", 
              color: "#1a1a1a",
              marginBottom: "8px"
            }}>
              Design Image Badge
            </div>
          </div>
          
          <Button 
            variant="secondary"
            size="medium"
            onClick={() => router.push({
              pathname: "/labels/new",
              query: { 
                template: "create-from-scratch",
                templateData: JSON.stringify({
                  id: "create-from-scratch",
                  type: "image",
                  src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/8-4.png",
                  alt: "Custom label"
                })
              }
            })}
          >
            Create from Scratch
          </Button>
        </div>
        
        {filteredImageLabels.map((label) => (
        <div 
          key={label.id}
          style={{
            backgroundColor: "white",
            border: "1px solid #e1e1e1",
            borderRadius: "12px",
            padding: "16px",
            textAlign: "center",
            width: "244px",
            height: "272px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          {/* Image Preview Area */}
          <div style={{
            width: "100%",
            height: "120px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            borderRadius: "8px",
            backgroundColor: "#f8f9fa",
            marginBottom: "12px"
          }}>
            <img 
              src={label.src} 
              alt={label.alt}
              style={{
                maxWidth: "90%",
                maxHeight: "90%",
                objectFit: "contain"
              }}
            />
          </div>
          
          {/* Image Icon and Text */}
          <div style={{
           
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            marginBottom: "8px"
          }}>
            <Icon source={ImageIcon} tone="subdued" />
            <Text as="span" tone="subdued" variant="bodySm">Image</Text>
          </div>
          
          {/* Label Title */}
          <div style={{ marginBottom: "12px" }}>
            <Text as="p" variant="bodySm" fontWeight="medium">
              {label.alt.length > 15 ? label.alt.substring(0, 15) + "..." : label.alt}
            </Text>
          </div>
          
          {/* Select Button */}
          <Button 
            variant="secondary"
            onClick={() => handleLabelSelect(label.id)}
            size="medium"
            fullWidth
          >
            Select
          </Button>
        </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <style>{`
        .scroll-container::-webkit-scrollbar {
          width: 8px;
        }
        .scroll-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .scroll-container::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        .scroll-container::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
        .scroll-container {
          scroll-behavior: smooth;
        }
      `}</style>
      <div style={{ 
        padding: "20px 24px", 
        backgroundColor: "#f6f6f7", 
        minHeight: "100vh"
      }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <InlineStack align="space-between" blockAlign="center">
            <InlineStack gap="300" blockAlign="center">
              <Button 
                icon={ArrowLeftIcon}
                variant="tertiary"
                onClick={() => router.push("/labels")}
              />
              <Text as="h1" variant="headingLg" fontWeight="medium">
                Create label with most popular collections
              </Text>
            </InlineStack>
            <Button variant="tertiary">
              My labels
            </Button>
          </InlineStack>
        </div>

        {/* AI Label Generator */}
        {/* <div style={{ marginBottom: "24px" }}>
          <Card>
            <div style={{ padding: "20px" }}>
              <InlineStack gap="400" blockAlign="center">
                <div style={{
                  width: "48px",
                  height: "48px",
                  backgroundColor: "#8b5cf6",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "18px"
                }}>
                  AI
                </div>
                <BlockStack gap="200" inlineAlign="start">
                  <InlineStack gap="200" blockAlign="center">
                    <Text as="h2" variant="headingMd" fontWeight="semibold">
                      AI Label Generator
                    </Text>
                    <Badge tone="info">0/0 used</Badge>
                    <Button size="micro" variant="primary">Upgrade</Button>
                  </InlineStack>
                  <Text as="p" tone="subdued">
                    Describe the label you want AI to create.
                  </Text>
                </BlockStack>
                <div style={{ marginLeft: "auto" }}>
                  <Button variant="secondary">
                    Create with AI
                  </Button>
                </div>
              </InlineStack>
            </div>
          </Card>
        </div> */}

        {/* Label Preset Section */}
        <Card>
          <div style={{ padding: "16px" }}>
            <BlockStack gap="100">
              <InlineStack align="space-between" blockAlign="center">
                <BlockStack gap="100">
                  <Text as="h2" variant="headingMd" fontWeight="semibold">
                    Label Preset
                  </Text>
                  <Text as="p" tone="subdued">
                    Select a popular template and begin customizing.
                  </Text>
                </BlockStack>
                <Text as="span" tone="subdued">1/2 used</Text>
              </InlineStack>
              
              {/* Tabs */}
              <Tabs 
                tabs={tabs} 
                selected={selectedTab} 
                onSelect={setSelectedTab}
              >
                <div style={{ padding: "10px 0" }}>
                  {selectedTab === 1 ? (
                    <div style={{ display: "flex", gap: "24px", height: "570px" }}>
                      {/* Fixed Sidebar Categories */}
                      <div style={{ 
                        width: "240px", 
                        flexShrink: 0,
                        height: "100%",
                        position: "sticky",
                        top: "0"
                      }}>
                        <div style={{
                          maxHeight: "100%",
                          overflowY: "auto",
                          paddingRight: "8px"
                        }}>
                          <div style={{ marginBottom: "16px" }}>
                            <Badge tone="success">Most popular</Badge>
                          </div>
                          {[
                            "Sales",
                            "Free shipping", 
                            "Stock",
                            "Coming soon",
                            "Organic",
                            "New",
                            "Pre-order",
                            "Buy 1 get 1",
                            "AutoText"
                          ].map((category) => (
                            <div
                              key={category}
                              style={{
                                backgroundColor: selectedCategory === category ? "#e5e5e5" : "transparent",
                                borderRadius: "6px",
                                padding: "8px 12px",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: selectedCategory === category ? "600" : "400",
                                marginBottom: "4px"
                              }}
                              onClick={() => setSelectedCategory(category)}
                            >
                              {category}
                            </div>
                          ))}
                          <div
                            style={{
                              color: "#2563eb",
                              cursor: "pointer",
                              fontSize: "14px",
                              padding: "8px 12px",
                              marginTop: "8px"
                            }}
                          >
                            See all text labels
                          </div>
                        </div>
                      </div>
                      
                      {/* Scrollable Text Labels Grid */}
                      <div style={{ 
                        flex: 1,
                        height: "100%",
                        overflow: "hidden",
                        position: "relative",
                        minHeight: "0"
                      }}>
                        <div style={{
          height: "540px",
          overflowY: "auto",
          scrollBehavior: "smooth"
        }}>
          {renderTextLabels()}
        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: "24px", height: "570px" }}>
                      {/* Fixed Sidebar Categories for Image Labels */}
                      <div style={{ 
                        width: "240px", 
                        flexShrink: 0,
                        height: "100%",
                        position: "sticky",
                        top: "0"
                      }}>
                        <div style={{
                          maxHeight: "100%",
                          overflowY: "auto",
                          paddingRight: "8px"
                        }}>
                          <div style={{ marginBottom: "16px" }}>
                            <Badge tone="success">Most popular</Badge>
                          </div>
                          {[
                            "Shipping",
                            "Delivery", 
                            "Guarantee",
                            "Express",
                            "Free shipping",
                            "Same day",
                            "Returns",
                            "Security",
                            "Quality"
                          ].map((category) => (
                            <div
                              key={category}
                              style={{
                                backgroundColor: selectedCategory === category ? "#e5e5e5" : "transparent",
                                borderRadius: "6px",
                                padding: "8px 12px",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: selectedCategory === category ? "600" : "400",
                                marginBottom: "4px"
                              }}
                              onClick={() => setSelectedCategory(category)}
                            >
                              {category}
                            </div>
                          ))}
                          <div
                            style={{
                              color: "#2563eb",
                              cursor: "pointer",
                              fontSize: "14px",
                              padding: "8px 12px",
                              marginTop: "8px"
                            }}
                          >
                            See all image labels
                          </div>
                        </div>
                      </div>
                      
                      {/* Scrollable Image Labels Grid */}
                      <div style={{ 
                        flex: 1,
                        height: "100%",
                        overflow: "hidden",
                        position: "relative",
                        minHeight: "0"
                      }}>
                        <div style={{
          height: "540px",
          overflowY: "auto",
          scrollBehavior: "smooth"
        }}>
          {renderImageLabels()}
        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Tabs>
            </BlockStack>
          </div>
        </Card>


      </div>
    </div>
    </>
  );
}
