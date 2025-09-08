// Banner template data for predefined banner designs

export interface BannerTemplate {
  id: string;
  title: string;
  description: string;
  type: "countdown" | "fixed" | "automatic" | "slider";
  category: string[];
  preview: string; // Preview image URL
  design: {
    content: {
      title?: string;
      message?: string;
      buttonText?: string;
      buttonUrl?: string;
      countdown?: {
        enabled: boolean;
        type?: string;
        targetDate?: string;
        targetTime?: string;
        autoResponsive?: boolean;
        labels?: {
          days?: string;
          hours?: string;
          minutes?: string;
          seconds?: string;
        };
        action?: string;
        endDate?: string;
        format?: string;
      };
      images?: Array<{
        src: string;
        alt: string;
      }>;
    };
    style: {
      backgroundColor: string;
      textColor: string;
      buttonColor?: string;
      fontSize: string;
      fontWeight: string;
      padding: string;
      borderRadius: string;
      border?: string;
      backgroundImage?: string;
      height: string;
    };
    position: {
      placement: "top" | "bottom" | "middle";
      sticky: boolean;
      zIndex: number;
    };
  };
}

export const bannerTemplates: BannerTemplate[] = [
  // Countdown Banners
  {
    id: "countdown-sale-red",
    title: "Flash Sale Countdown",
    description: "Urgent red countdown banner for flash sales",
    type: "countdown",
    category: ["Sales", "Countdown", "Urgent"],
    preview: "/api/placeholder/400/80",
    design: {
      content: {
        title: "🔥 FLASH SALE ENDS IN:",
        message: "Get 50% OFF on all items!",
        buttonText: "Shop Now",
        buttonUrl: "/collections/sale",
        countdown: {
          enabled: true,
          type: "specific_date",
          targetDate: "Mon Jul 29 2024",
          targetTime: "23:59:59",
          autoResponsive: true,
          labels: {
            days: "Days",
            hours: "Hrs",
            minutes: "Mins", 
            seconds: "Secs"
          },
          action: "do_nothing"
        }
      },
      style: {
        backgroundColor: "#dc2626",
        textColor: "#ffffff",
        buttonColor: "#fbbf24",
        fontSize: "16px",
        fontWeight: "bold",
        padding: "12px 20px",
        borderRadius: "0px",
        height: "60px"
      },
      position: {
        placement: "top",
        sticky: true,
        zIndex: 1000
      }
    }
  },
  {
    id: "countdown-black-friday",
    title: "Black Friday Countdown",
    description: "Black Friday themed countdown with urgency",
    type: "countdown",
    category: ["Sales", "Countdown", "Black Friday"],
    preview: "/api/placeholder/400/80",
    design: {
      content: {
        title: "⚡ BLACK FRIDAY MEGA SALE",
        message: "Limited time only! Don't miss out!",
        buttonText: "Get Deal",
        buttonUrl: "/collections/black-friday",
        countdown: {
          enabled: true,
          type: "specific_date",
          targetDate: "Mon Jul 29 2024",
          targetTime: "23:59:59",
          autoResponsive: true,
          labels: {
            days: "Days",
            hours: "Hrs",
            minutes: "Mins", 
            seconds: "Secs"
          },
          action: "do_nothing"
        }
      },
      style: {
        backgroundColor: "#000000",
        textColor: "#ffffff",
        buttonColor: "#ff6b35",
        fontSize: "18px",
        fontWeight: "bold",
        padding: "15px 20px",
        borderRadius: "0px",
        height: "70px"
      },
      position: {
        placement: "top",
        sticky: true,
        zIndex: 1000
      }
    }
  },
  {
    id: "countdown-holiday-green",
    title: "Holiday Sale Timer",
    description: "Festive green countdown for holiday sales",
    type: "countdown",
    category: ["Sales", "Countdown", "Holiday"],
    preview: "/api/placeholder/400/80",
    design: {
      content: {
        title: "🎄 HOLIDAY SPECIAL ENDS SOON",
        message: "Free shipping on orders over $50",
        buttonText: "Shop Holiday",
        buttonUrl: "/collections/holiday",
        countdown: {
          enabled: true,
          type: "specific_date",
          targetDate: "Mon Jul 29 2024",
          targetTime: "23:59:59",
          autoResponsive: true,
          labels: {
            days: "Days",
            hours: "Hrs",
            minutes: "Mins", 
            seconds: "Secs"
          },
          action: "do_nothing"
        }
      },
      style: {
        backgroundColor: "#16a34a",
        textColor: "#ffffff",
        buttonColor: "#dc2626",
        fontSize: "16px",
        fontWeight: "600",
        padding: "12px 20px",
        borderRadius: "0px",
        height: "65px"
      },
      position: {
        placement: "top",
        sticky: true,
        zIndex: 1000
      }
    }
  },

  // Fixed Banners
  {
    id: "fixed-free-shipping",
    title: "Free Shipping Banner",
    description: "Simple free shipping announcement",
    type: "fixed",
    category: ["Shipping", "Free", "Announcement"],
    preview: "/api/placeholder/400/60",
    design: {
      content: {
        title: "🚚 FREE SHIPPING",
        message: "On all orders over $75 worldwide",
        buttonText: "Shop Now",
        buttonUrl: "/collections/all"
      },
      style: {
        backgroundColor: "#3b82f6",
        textColor: "#ffffff",
        buttonColor: "#fbbf24",
        fontSize: "14px",
        fontWeight: "500",
        padding: "10px 20px",
        borderRadius: "0px",
        height: "50px"
      },
      position: {
        placement: "top",
        sticky: false,
        zIndex: 100
      }
    }
  },
  {
    id: "fixed-new-collection",
    title: "New Collection Alert",
    description: "Announce new product collections",
    type: "fixed",
    category: ["New", "Collection", "Announcement"],
    preview: "/api/placeholder/400/60",
    design: {
      content: {
        title: "✨ NEW ARRIVALS",
        message: "Discover our latest collection now available",
        buttonText: "Explore",
        buttonUrl: "/collections/new"
      },
      style: {
        backgroundColor: "#8b5cf6",
        textColor: "#ffffff",
        buttonColor: "#f59e0b",
        fontSize: "15px",
        fontWeight: "600",
        padding: "12px 20px",
        borderRadius: "0px",
        height: "55px"
      },
      position: {
        placement: "top",
        sticky: false,
        zIndex: 100
      }
    }
  },
  {
    id: "fixed-newsletter-signup",
    title: "Newsletter Signup",
    description: "Encourage newsletter subscriptions",
    type: "fixed",
    category: ["Newsletter", "Signup", "Marketing"],
    preview: "/api/placeholder/400/60",
    design: {
      content: {
        title: "📧 STAY UPDATED",
        message: "Subscribe for exclusive deals and updates",
        buttonText: "Subscribe",
        buttonUrl: "/pages/newsletter"
      },
      style: {
        backgroundColor: "#059669",
        textColor: "#ffffff",
        buttonColor: "#fbbf24",
        fontSize: "14px",
        fontWeight: "500",
        padding: "10px 20px",
        borderRadius: "0px",
        height: "50px"
      },
      position: {
        placement: "bottom",
        sticky: true,
        zIndex: 100
      }
    }
  },

  // Automatic Banners
  {
    id: "automatic-cart-abandonment",
    title: "Cart Abandonment Reminder",
    description: "Automatic banner for abandoned carts",
    type: "automatic",
    category: ["Cart", "Automatic", "Recovery"],
    preview: "/api/placeholder/400/60",
    design: {
      content: {
        title: "🛒 ITEMS IN YOUR CART",
        message: "Complete your purchase before they're gone!",
        buttonText: "Complete Order",
        buttonUrl: "/cart"
      },
      style: {
        backgroundColor: "#f59e0b",
        textColor: "#000000",
        buttonColor: "#dc2626",
        fontSize: "14px",
        fontWeight: "600",
        padding: "10px 20px",
        borderRadius: "0px",
        height: "50px"
      },
      position: {
        placement: "top",
        sticky: true,
        zIndex: 200
      }
    }
  },
  {
    id: "automatic-first-visit",
    title: "First Visit Welcome",
    description: "Welcome banner for first-time visitors",
    type: "automatic",
    category: ["Welcome", "Automatic", "First Visit"],
    preview: "/api/placeholder/400/60",
    design: {
      content: {
        title: "👋 WELCOME!",
        message: "Get 10% off your first order with code WELCOME10",
        buttonText: "Get Discount",
        buttonUrl: "/collections/all"
      },
      style: {
        backgroundColor: "#6366f1",
        textColor: "#ffffff",
        buttonColor: "#10b981",
        fontSize: "15px",
        fontWeight: "600",
        padding: "12px 20px",
        borderRadius: "0px",
        height: "55px"
      },
      position: {
        placement: "top",
        sticky: false,
        zIndex: 150
      }
    }
  },
  {
    id: "automatic-low-stock",
    title: "Low Stock Alert",
    description: "Automatic alert for low stock items",
    type: "automatic",
    category: ["Stock", "Automatic", "Alert"],
    preview: "/api/placeholder/400/60",
    design: {
      content: {
        title: "⚠️ LOW STOCK ALERT",
        message: "This item is almost sold out! Order now!",
        buttonText: "Buy Now",
        buttonUrl: "#"
      },
      style: {
        backgroundColor: "#dc2626",
        textColor: "#ffffff",
        buttonColor: "#fbbf24",
        fontSize: "14px",
        fontWeight: "bold",
        padding: "10px 20px",
        borderRadius: "0px",
        height: "50px"
      },
      position: {
        placement: "middle",
        sticky: false,
        zIndex: 300
      }
    }
  },

  // Slider Banners
  {
    id: "slider-promotions",
    title: "Multi-Promotion Slider",
    description: "Rotating banner with multiple promotions",
    type: "slider",
    category: ["Slider", "Promotions", "Multiple"],
    preview: "/api/placeholder/400/80",
    design: {
      content: {
        images: [
          {
            src: "/api/placeholder/1200/80",
            alt: "Free shipping promotion"
          },
          {
            src: "/api/placeholder/1200/80", 
            alt: "New collection banner"
          },
          {
            src: "/api/placeholder/1200/80",
            alt: "Sale announcement"
          }
        ]
      },
      style: {
        backgroundColor: "#f3f4f6",
        textColor: "#1f2937",
        fontSize: "16px",
        fontWeight: "500",
        padding: "0px",
        borderRadius: "0px",
        height: "80px"
      },
      position: {
        placement: "top",
        sticky: false,
        zIndex: 100
      }
    }
  },
  {
    id: "slider-seasonal",
    title: "Seasonal Collections Slider",
    description: "Rotating seasonal product showcases",
    type: "slider",
    category: ["Slider", "Seasonal", "Collections"],
    preview: "/api/placeholder/400/100",
    design: {
      content: {
        images: [
          {
            src: "/api/placeholder/1200/100",
            alt: "Spring collection"
          },
          {
            src: "/api/placeholder/1200/100",
            alt: "Summer sale"
          },
          {
            src: "/api/placeholder/1200/100",
            alt: "Fall arrivals"
          }
        ]
      },
      style: {
        backgroundColor: "#ffffff",
        textColor: "#000000",
        fontSize: "18px",
        fontWeight: "600",
        padding: "0px",
        borderRadius: "0px",
        height: "100px"
      },
      position: {
        placement: "top",
        sticky: false,
        zIndex: 100
      }
    }
  }
];

// Utility functions
export const getBannerTemplatesByCategory = (category: string): BannerTemplate[] => {
  if (category === "All") return bannerTemplates;
  return bannerTemplates.filter(template => 
    template.category?.includes(category)
  );
};

export const getBannerTemplatesByType = (type: string): BannerTemplate[] => {
  if (type === "All") return bannerTemplates;
  return bannerTemplates.filter(template => template.type === type);
};

export const getBannerTemplateById = (id: string): BannerTemplate | undefined => {
  return bannerTemplates.find(template => template.id === id);
};

// Categories for filtering
export const bannerCategories = [
  "All", "Sales", "Countdown", "Shipping", "Free", "Announcement", 
  "New", "Collection", "Newsletter", "Marketing", "Cart", "Automatic", 
  "Welcome", "Stock", "Alert", "Slider", "Promotions", "Seasonal"
];

// Banner types
export const bannerTypes = [
  "All", "countdown", "fixed", "automatic", "slider"
];
