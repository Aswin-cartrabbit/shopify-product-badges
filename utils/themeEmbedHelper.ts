/**
 * Utility functions for theme app embed management
 */

/**
 * Redirects the user to the theme editor's app embeds section
 * @param shop - The shop domain (e.g., 'example.myshopify.com')
 * @param themeId - Optional specific theme ID to edit
 */
export const redirectToThemeEditor = (shop?: string, themeId?: string) => {
  if (typeof window === "undefined") {
    console.warn("redirectToThemeEditor can only be called in browser environment");
    return;
  }

  let targetShop = shop;
  
  // Try to get shop from Shopify App Bridge if not provided
  if (!targetShop && window.shopify?.config?.shop) {
    targetShop = window.shopify.config.shop;
  }

  if (!targetShop) {
    console.error("Unable to determine shop domain for theme editor redirect");
    return;
  }

  // Remove https:// if present and ensure .myshopify.com domain
  targetShop = targetShop.replace(/^https?:\/\//, '');
  if (!targetShop.includes('.myshopify.com')) {
    targetShop = `${targetShop}.myshopify.com`;
  }

  // Construct the theme editor URL
  let themeEditorUrl = `https://${targetShop}/admin/themes`;
  
  if (themeId) {
    themeEditorUrl += `/${themeId}/editor?context=apps`;
  } else {
    themeEditorUrl += '/current/editor?context=apps';
  }

  // Open in new tab
  window.open(themeEditorUrl, '_blank', 'noopener,noreferrer');
};

/**
 * Gets the app embed installation URL for direct installation
 * @param shop - The shop domain
 * @param appHandle - The app handle/identifier  
 */
export const getAppEmbedInstallUrl = (shop?: string, appHandle?: string) => {
  if (typeof window === "undefined") {
    return null;
  }

  let targetShop = shop;
  
  if (!targetShop && window.shopify?.config?.shop) {
    targetShop = window.shopify.config.shop;
  }

  if (!targetShop) {
    return null;
  }

  targetShop = targetShop.replace(/^https?:\/\//, '');
  if (!targetShop.includes('.myshopify.com')) {
    targetShop = `${targetShop}.myshopify.com`;
  }

  return `https://${targetShop}/admin/themes/current/editor?context=apps&tutorial=apps`;
};

/**
 * Checks if localStorage is available and works
 */
export const isLocalStorageAvailable = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }
  
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, 'test');
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Gets the dismissal status from localStorage
 */
export const getEmbedBannerDismissalStatus = (): boolean => {
  if (!isLocalStorageAvailable()) {
    return false;
  }
  
  return localStorage.getItem('theme-embed-banner-dismissed') === 'true';
};

/**
 * Sets the dismissal status in localStorage
 */
export const setEmbedBannerDismissalStatus = (dismissed: boolean): void => {
  if (!isLocalStorageAvailable()) {
    return;
  }
  
  try {
    if (dismissed) {
      localStorage.setItem('theme-embed-banner-dismissed', 'true');
    } else {
      localStorage.removeItem('theme-embed-banner-dismissed');
    }
  } catch (error) {
    console.error('Failed to save dismissal status:', error);
  }
};

/**
 * Clears the dismissal status (useful for testing or when app embed status changes)
 */
export const clearEmbedBannerDismissal = (): void => {
  if (!isLocalStorageAvailable()) {
    return;
  }
  
  localStorage.removeItem('theme-embed-banner-dismissed');
};

/**
 * Debug function to check current dismissal status
 * Run in browser console: window.checkThemeEmbedDismissal()
 */
export const checkThemeEmbedDismissal = (): void => {
  if (typeof window !== "undefined") {
    const dismissed = getEmbedBannerDismissalStatus();
    console.log('Theme embed banner dismissal status:', dismissed);
    
    // Make it available globally for debugging
    (window as any).clearThemeEmbedDismissal = clearEmbedBannerDismissal;
    (window as any).setThemeEmbedDismissal = setEmbedBannerDismissalStatus;
    
    console.log('Debug functions available:');
    console.log('- window.clearThemeEmbedDismissal() - Clear dismissal');
    console.log('- window.setThemeEmbedDismissal(true/false) - Set dismissal status');
  }
};
