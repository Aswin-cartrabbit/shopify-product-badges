// Badge API utility functions
export interface Badge {
  id: string;
  name: string;
  type: "SINGLE_BANNER" | "ICON_BLOCK" | "PAYMENT_ICONS" | "FREE_SHIPPING_BAR";
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "ARCHIVED";
  title?: string;
  subheading?: string;
  iconUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  createdAt: string;
  updatedAt: string;
  design?: BadgeDesign;
  placement?: BadgePlacement;
  targeting?: BadgeTargeting[];
  translations?: BadgeTranslation[];
  totalAnalytics?: {
    views: number;
    clicks: number;
    conversions: number;
    revenue: number;
    ctr: string;
    conversionRate: string;
  };
}

export interface BadgeDesign {
  id: string;
  template?: string;
  backgroundType?: string;
  backgroundColor?: string;
  gradientColor1?: string;
  gradientColor2?: string;
  gradientAngle?: number;
  cornerRadius?: number;
  borderSize?: number;
  borderColor?: string;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  iconSize?: number;
  iconColor?: string;
  useOriginalIcon?: boolean;
  iconBackground?: string;
  iconRadius?: number;
  iconsPerRowDesktop?: number;
  iconsPerRowMobile?: number;
  fontFamily?: string;
  titleFontSize?: number;
  titleColor?: string;
  titleWeight?: string;
  subtitleFontSize?: number;
  subtitleColor?: string;
  subtitleWeight?: string;
  animation?: string;
  shadow?: string;
  opacity?: number;
}

export interface BadgePlacement {
  id: string;
  location: "PRODUCT_PAGE" | "COLLECTION_PAGE" | "CART_PAGE" | "CHECKOUT_PAGE" | "HOME_PAGE";
  position: "TOP_LEFT" | "TOP_RIGHT" | "TOP_CENTER" | "BOTTOM_LEFT" | "BOTTOM_RIGHT" | "BOTTOM_CENTER" | "CENTER" | "BEFORE_ADD_TO_CART" | "AFTER_ADD_TO_CART" | "CUSTOM";
  customSelector?: string;
  customCss?: string;
  zIndex?: number;
  showOnDesktop?: boolean;
  showOnMobile?: boolean;
  showOnTablet?: boolean;
  displayDelay?: number;
  autoHide?: boolean;
  autoHideDelay?: number;
}

export interface BadgeTargeting {
  id: string;
  ruleType: "ALL_PRODUCTS" | "SPECIFIC_PRODUCTS" | "COLLECTIONS" | "PRODUCT_TAGS" | "PRODUCT_TYPE" | "VENDOR" | "PRICE_RANGE";
  ruleValue: string;
  isInclusive: boolean;
}

export interface BadgeTranslation {
  id: string;
  language: string;
  title?: string;
  subheading?: string;
  ctaText?: string;
}

export interface CreateBadgeData {
  name: string;
  type: Badge["type"];
  title?: string;
  subheading?: string;
  iconUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  design?: Partial<BadgeDesign>;
  placement?: Partial<BadgePlacement>;
  targeting?: Partial<BadgeTargeting>[];
}

export interface UpdateBadgeData extends Partial<CreateBadgeData> {
  status?: Badge["status"];
  translations?: Partial<BadgeTranslation>[];
}

// API Functions
export const badgeApi = {
  // Get all badges
  async getBadges(params?: {
    status?: string;
    type?: string;
    limit?: number;
    offset?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`/api/badges?${searchParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch badges");
    }

    return response.json();
  },

  // Get a specific badge
  async getBadge(id: string) {
    const response = await fetch(`/api/badges/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch badge");
    }

    return response.json();
  },

  // Create a new badge
  async createBadge(data: CreateBadgeData) {
    const response = await fetch("/api/badges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create badge");
    }

    return response.json();
  },

  // Update a badge
  async updateBadge(id: string, data: UpdateBadgeData) {
    const response = await fetch(`/api/badges/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update badge");
    }

    return response.json();
  },

  // Delete a badge
  async deleteBadge(id: string) {
    const response = await fetch(`/api/badges/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete badge");
    }

    return response.json();
  },

  // Duplicate a badge
  async duplicateBadge(id: string, name?: string) {
    const response = await fetch(`/api/badges/${id}/duplicate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to duplicate badge");
    }

    return response.json();
  },

  // Get analytics
  async getAnalytics(params?: {
    badgeId?: string;
    startDate?: string;
    endDate?: string;
    groupBy?: "hour" | "day" | "week" | "month";
    deviceType?: string;
    location?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`/api/badges/analytics?${searchParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch analytics");
    }

    return response.json();
  },

  // Track an event
  async trackEvent(data: {
    badgeId: string;
    eventType: "view" | "click" | "conversion";
    revenue?: number;
    deviceType?: string;
    location?: string;
    country?: string;
  }) {
    const response = await fetch("/api/badges/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to track event");
    }

    return response.json();
  },
};

// Subscription API
export interface Subscription {
  id: string;
  planName: "free" | "starter" | "essential" | "pro";
  status: string;
  billingCycle?: string;
  amount?: number;
  currency?: string;
  maxBadges: number;
  maxTranslations: boolean;
  analytics: boolean;
  customCss: boolean;
}

export const subscriptionApi = {
  // Get current subscription
  async getSubscription() {
    const response = await fetch("/api/subscription", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch subscription");
    }

    return response.json();
  },

  // Create or update subscription
  async updateSubscription(data: {
    planName: Subscription["planName"];
    billingCycle?: string;
    amount?: number;
    currency?: string;
    shopifyChargeId?: string;
  }) {
    const response = await fetch("/api/subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update subscription");
    }

    return response.json();
  },
};

