import { useState, useEffect, useCallback } from "react";
import { subscriptionApi, Subscription } from "@/utils/api/badges";

export interface UseSubscriptionReturn {
  subscription: Subscription | null;
  usage: {
    badges: {
      current: number;
      limit: number;
      percentage: number;
    };
    translations: {
      current: number;
      allowed: boolean;
    };
    features: {
      analytics: boolean;
      customCss: boolean;
    };
  } | null;
  loading: boolean;
  error: string | null;
  isNearLimit: boolean;
  hasExceededLimit: boolean;
  // Actions
  updateSubscription: (data: {
    planName: Subscription["planName"];
    billingCycle?: string;
    amount?: number;
    currency?: string;
    shopifyChargeId?: string;
  }) => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

export const useSubscription = (): UseSubscriptionReturn => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<UseSubscriptionReturn["usage"]>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNearLimit, setIsNearLimit] = useState(false);
  const [hasExceededLimit, setHasExceededLimit] = useState(false);

  // Fetch subscription data
  const fetchSubscription = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await subscriptionApi.getSubscription();
      setSubscription(response.subscription);
      setUsage(response.usage);
      setIsNearLimit(response.isNearLimit);
      setHasExceededLimit(response.hasExceededLimit);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch subscription");
      console.error("Error fetching subscription:", err);
      
      // Set default free plan on error
      setSubscription({
        id: "",
        planName: "free",
        status: "active",
        maxBadges: 1,
        maxTranslations: false,
        analytics: false,
        customCss: false,
      });
      setUsage({
        badges: { current: 0, limit: 1, percentage: 0 },
        translations: { current: 0, allowed: false },
        features: { analytics: false, customCss: false },
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  // Update subscription
  const updateSubscription = useCallback(async (data: {
    planName: Subscription["planName"];
    billingCycle?: string;
    amount?: number;
    currency?: string;
    shopifyChargeId?: string;
  }) => {
    try {
      setError(null);
      const response = await subscriptionApi.updateSubscription(data);
      
      // Refresh subscription data after update
      await fetchSubscription();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update subscription";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [fetchSubscription]);

  // Refresh subscription
  const refreshSubscription = useCallback(async () => {
    await fetchSubscription();
  }, [fetchSubscription]);

  return {
    subscription,
    usage,
    loading,
    error,
    isNearLimit,
    hasExceededLimit,
    updateSubscription,
    refreshSubscription,
  };
};

// Hook for checking specific plan features
export const usePlanFeatures = () => {
  const { subscription } = useSubscription();

  const canCreateBadge = useCallback((currentCount: number) => {
    if (!subscription) return false;
    return subscription.maxBadges === -1 || currentCount < subscription.maxBadges;
  }, [subscription]);

  const canUseTranslations = useCallback(() => {
    return subscription?.maxTranslations || false;
  }, [subscription]);

  const canUseAnalytics = useCallback(() => {
    return subscription?.analytics || false;
  }, [subscription]);

  const canUseCustomCss = useCallback(() => {
    return subscription?.customCss || false;
  }, [subscription]);

  const getPlanLimits = useCallback(() => {
    if (!subscription) return null;
    
    return {
      maxBadges: subscription.maxBadges,
      hasTranslations: subscription.maxTranslations,
      hasAnalytics: subscription.analytics,
      hasCustomCss: subscription.customCss,
    };
  }, [subscription]);

  return {
    canCreateBadge,
    canUseTranslations,
    canUseAnalytics,
    canUseCustomCss,
    getPlanLimits,
    planName: subscription?.planName || "free",
  };
};

