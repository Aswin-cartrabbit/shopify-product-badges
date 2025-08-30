// Shared template data for both badges and labels

export interface TextTemplate {
  id: string;
  text: string;
  style: React.CSSProperties;
  category?: string[];
}

export interface ImageTemplate {
  id: string;
  src: string;
  alt: string;
  type: string;
  category?: string[];
}

// Text templates that work for both badges and labels
export const textTemplates: TextTemplate[] = [
  {
    id: "limited-time",
    text: "LIMITED TIME",
    category: ["Sales", "Limited"],
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
    category: ["Stock", "Availability"],
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
    category: ["New", "Fresh"],
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
    category: ["New", "Trending"],
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
    category: ["Sales", "Discount"],
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
    category: ["Sales", "Popular"],
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
    category: ["Sales", "Discount"],
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
    category: ["Featured", "Special"],
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
    category: ["Exclusive", "Premium"],
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
    category: ["Free shipping", "Shipping"],
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
    category: ["Premium", "Quality"],
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
    category: ["Trending", "Popular"],
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
    category: ["Sales", "Deal"],
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
    category: ["Quality", "Rating"],
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
    category: ["Limited", "Exclusive"],
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
    category: ["Sales", "Limited"],
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
    category: ["Organic", "Natural"],
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
    category: ["Luxury", "Premium"],
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
    category: ["Sales", "Clearance"],
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
    category: ["Wholesale", "Bulk"],
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
    category: ["Savings", "Discount"],
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
    category: ["Coming soon", "Pre-order"],
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
    category: ["Organic", "Eco-friendly"],
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
    category: ["Handmade", "Artisan"],
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
    category: ["Bundle", "Deal"],
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

// Image templates that work for both badges and labels
export const imageTemplates: ImageTemplate[] = [
  {
    id: "free-shipping-1",
    src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/674ec6d8ee7fe.png",
    alt: "Free shipping",
    type: "shipping",
    category: ["Shipping", "Free shipping"]
  },
  {
    id: "free-shipping-car",
    src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/67469f6b53270.png",
    alt: "Free shipping car with arrow",
    type: "shipping",
    category: ["Shipping", "Free shipping"]
  },
  {
    id: "express-delivery-1",
    src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/6746a377c8246.png",
    alt: "Express delivery guaranteed",
    type: "express_delivery",
    category: ["Express", "Delivery"]
  },
  {
    id: "express-delivery-2",
    src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/6746a3a804c12.png",
    alt: "Express delivery easy return",
    type: "express_delivery",
    category: ["Express", "Delivery"]
  },
  {
    id: "free-delivery-red",
    src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/6728a3f13ba1a.png",
    alt: "Free delivery red badge",
    type: "free_delivery",
    category: ["Delivery", "Free delivery"]
  },
  {
    id: "free-100-delivery",
    src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/6728a2a96fb99.png",
    alt: "Free 100% delivery",
    type: "free_delivery",
    category: ["Delivery", "Free delivery"]
  },
  {
    id: "free-shipping-plane",
    src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/asset-9-28.png",
    alt: "Free shipping plane",
    type: "shipping",
    category: ["Shipping", "Free shipping"]
  },
  {
    id: "same-day-delivery",
    src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/6728a2eead152.png",
    alt: "Same day delivery",
    type: "same_day_delivery",
    category: ["Same day", "Delivery"]
  },
  {
    id: "free-shipping-animated",
    src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/67289b422e95b.png",
    alt: "Free shipping animated",
    type: "shipping",
    category: ["Shipping", "Free shipping"]
  },
  {
    id: "free-delivery-truck",
    src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/67289c4850548.png",
    alt: "Free delivery blue truck",
    type: "free_delivery",
    category: ["Delivery", "Free delivery"]
  },
  {
    id: "express-delivery-stamp",
    src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/67289b0682b22.png",
    alt: "Express delivery stamp",
    type: "express_delivery",
    category: ["Express", "Delivery"]
  },
  {
    id: "free-shipping-green",
    src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/free-shipping-green.png",
    alt: "Free shipping round sticker",
    type: "shipping",
    category: ["Shipping", "Free shipping"]
  },
  {
    id: "free-delivery-plane",
    src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/6746d53030846.png",
    alt: "Free delivery tag plane",
    type: "free_delivery",
    category: ["Delivery", "Free delivery"]
  },
  {
    id: "free-delivery-card",
    src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/6746d5a59566e.png",
    alt: "Free delivery card",
    type: "free_delivery",
    category: ["Delivery", "Free delivery"]
  },
  {
    id: "free-shipping-2",
    src: "https://d3azqz9xba9gwd.cloudfront.net/storage/labels/pl-july-production-demo-store/658503fb07d32.png",
    alt: "Free Shipping",
    type: "shipping",
    category: ["Shipping", "Free shipping"]
  }
];

// Utility functions to filter templates
export const getTextTemplatesByCategory = (category: string): TextTemplate[] => {
  if (category === "All") return textTemplates;
  return textTemplates.filter(template => 
    template.category?.includes(category)
  );
};

export const getImageTemplatesByCategory = (category: string): ImageTemplate[] => {
  if (category === "All") return imageTemplates;
  return imageTemplates.filter(template => 
    template.category?.includes(category)
  );
};

export const getTemplateById = (id: string): TextTemplate | ImageTemplate | undefined => {
  return [...textTemplates, ...imageTemplates].find(template => template.id === id);
};

// Categories for filtering
export const textCategories = [
  "All", "Sales", "Free shipping", "Stock", "Coming soon", 
  "Organic", "New", "Pre-order", "Buy 1 get 1"
];

export const imageCategories = [
  "All", "Shipping", "Delivery", "Guarantee", "Express", 
  "Free shipping", "Same day", "Returns", "Security", "Quality"
];
