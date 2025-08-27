import { useState, useEffect, useCallback } from "react";
import { badgeApi, Badge, CreateBadgeData, UpdateBadgeData } from "@/utils/api/badges";

export interface UseBadgesReturn {
  badges: Badge[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  // Actions
  createBadge: (data: CreateBadgeData) => Promise<Badge>;
  updateBadge: (id: string, data: UpdateBadgeData) => Promise<Badge>;
  deleteBadge: (id: string) => Promise<void>;
  duplicateBadge: (id: string, name?: string) => Promise<Badge>;
  refreshBadges: () => Promise<void>;
  // Filters
  setFilters: (filters: BadgeFilters) => void;
  filters: BadgeFilters;
}

interface BadgeFilters {
  status?: string;
  type?: string;
  limit?: number;
  offset?: number;
}

export const useBadges = (initialFilters: BadgeFilters = {}): UseBadgesReturn => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BadgeFilters>(initialFilters);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 50,
    offset: 0,
    hasMore: false,
  });

  // Fetch badges
  const fetchBadges = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await badgeApi.getBadges(filters);
      setBadges(response.badges);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch badges");
      console.error("Error fetching badges:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Initial fetch and refetch when filters change
  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  // Create badge
  const createBadge = useCallback(async (data: CreateBadgeData): Promise<Badge> => {
    try {
      setError(null);
      const response = await badgeApi.createBadge(data);
      const newBadge = response.badge;
      
      // Add to the beginning of the list
      setBadges(prev => [newBadge, ...prev]);
      
      return newBadge;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create badge";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Update badge
  const updateBadge = useCallback(async (id: string, data: UpdateBadgeData): Promise<Badge> => {
    try {
      setError(null);
      const response = await badgeApi.updateBadge(id, data);
      const updatedBadge = response.badge;
      
      // Update the badge in the list
      setBadges(prev => 
        prev.map(badge => 
          badge.id === id ? updatedBadge : badge
        )
      );
      
      return updatedBadge;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update badge";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Delete badge
  const deleteBadge = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await badgeApi.deleteBadge(id);
      
      // Remove from the list
      setBadges(prev => prev.filter(badge => badge.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete badge";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Duplicate badge
  const duplicateBadge = useCallback(async (id: string, name?: string): Promise<Badge> => {
    try {
      setError(null);
      const response = await badgeApi.duplicateBadge(id, name);
      const duplicatedBadge = response.badge;
      
      // Add to the beginning of the list
      setBadges(prev => [duplicatedBadge, ...prev]);
      
      return duplicatedBadge;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to duplicate badge";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Refresh badges
  const refreshBadges = useCallback(async () => {
    await fetchBadges();
  }, [fetchBadges]);

  return {
    badges,
    loading,
    error,
    pagination,
    createBadge,
    updateBadge,
    deleteBadge,
    duplicateBadge,
    refreshBadges,
    setFilters,
    filters,
  };
};

// Hook for single badge
export const useBadge = (id: string) => {
  const [badge, setBadge] = useState<Badge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBadge = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await badgeApi.getBadge(id);
      setBadge(response.badge);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch badge");
      console.error("Error fetching badge:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBadge();
  }, [fetchBadge]);

  const updateBadge = useCallback(async (data: UpdateBadgeData): Promise<Badge> => {
    try {
      setError(null);
      const response = await badgeApi.updateBadge(id, data);
      const updatedBadge = response.badge;
      setBadge(updatedBadge);
      return updatedBadge;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update badge";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [id]);

  return {
    badge,
    loading,
    error,
    updateBadge,
    refreshBadge: fetchBadge,
  };
};

