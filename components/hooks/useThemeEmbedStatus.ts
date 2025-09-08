import { useState, useEffect } from 'react';

interface ThemeEmbedStatus {
  hasAppEmbedEnabled: boolean;
  activeTheme?: {
    id: string;
    name: string;
  };
  appEmbedBlocks: number;
  allBlocks: number;
}

interface UseThemeEmbedStatusReturn {
  isLoading: boolean;
  error: string | null;
  embedStatus: ThemeEmbedStatus | null;
  checkStatus: () => Promise<void>;
}

export const useThemeEmbedStatus = (): UseThemeEmbedStatusReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [embedStatus, setEmbedStatus] = useState<ThemeEmbedStatus | null>(null);

  const checkStatus = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get session token from Shopify App Bridge if available
      let sessionToken = null;
      if (typeof window !== "undefined" && window.shopify?.idToken) {
        sessionToken = await window.shopify.idToken();
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (sessionToken) {
        headers["Authorization"] = `Bearer ${sessionToken}`;
      }

      const response = await fetch('/api/apps/theme-embed-status', {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        let errorMessage = 'Failed to check theme embed status';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If we can't parse the error response, use a generic message
          errorMessage = `API request failed with status ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setEmbedStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      // Only log in development to reduce noise in production
      if (process.env.NODE_ENV === 'development') {
        console.error('Error checking theme embed status:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only check on client side
    if (typeof window !== "undefined") {
      checkStatus();
    }
  }, []);

  return {
    isLoading,
    error,
    embedStatus,
    checkStatus,
  };
};
