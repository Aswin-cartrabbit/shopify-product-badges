/**
 * Utility functions for handling Shopify template-based display logic
 * Maps Shopify template information to badge/label visibility settings
 */

export interface ShopifyTemplate {
  directory: string | null;
  name: string;
  suffix: string | null;
}

export interface PageDisplaySettings {
  product: boolean;
  collection: boolean;
  home: boolean;
  search: boolean;
  cart: boolean;
}

/**
 * Maps Shopify template names to our pageDisplay settings
 */
export const TEMPLATE_TO_PAGE_MAPPING = {
  // Product templates
  'product': 'product',
  'product.section': 'product',
  'product.json': 'product',
  
  // Collection templates
  'collection': 'collection',
  'collection.section': 'collection',
  'collection.json': 'collection',
  'list-collections': 'collection',
  
  // Home page templates
  'index': 'home',
  'index.section': 'home',
  'index.json': 'home',
  
  // Search templates
  'search': 'search',
  'search.section': 'search',
  'search.json': 'search',
  
  // Cart templates
  'cart': 'cart',
  'cart.section': 'cart',
  'cart.json': 'cart',
  
  // Other templates (default to home)
  '404': 'home',
  'article': 'home',
  'blog': 'home',
  'page': 'home',
  'password': 'home',
  'gift_card': 'home',
} as const;

/**
 * Determines if a badge/label should be displayed based on Shopify template information
 * @param template - Shopify template object with directory, name, suffix
 * @param pageDisplay - Page display settings from badge/label configuration
 * @returns boolean indicating if the badge/label should be shown
 */
export function shouldDisplayBasedOnTemplate(
  template: ShopifyTemplate,
  pageDisplay: PageDisplaySettings
): boolean {
  // Get the template key (name + suffix if exists)
  const templateKey = template.suffix ? `${template.name}.${template.suffix}` : template.name;
  
  // Map template to our page type
  const pageType = TEMPLATE_TO_PAGE_MAPPING[templateKey] || TEMPLATE_TO_PAGE_MAPPING[template.name] || 'home';
  
  // Check if this page type is enabled in pageDisplay settings
  return pageDisplay[pageType] || false;
}

/**
 * Gets a human-readable description of what pages a badge/label will appear on
 * @param pageDisplay - Page display settings
 * @returns Array of page descriptions
 */
export function getPageDisplayDescription(pageDisplay: PageDisplaySettings): string[] {
  const descriptions: string[] = [];
  
  if (pageDisplay.product) {
    descriptions.push('Product pages');
  }
  if (pageDisplay.collection) {
    descriptions.push('Collection pages');
  }
  if (pageDisplay.home) {
    descriptions.push('Home page');
  }
  if (pageDisplay.search) {
    descriptions.push('Search results');
  }
  if (pageDisplay.cart) {
    descriptions.push('Cart page');
  }
  
  return descriptions;
}

/**
 * Gets the default pageDisplay settings for a badge/label type
 * @param type - Badge or label type
 * @returns Default page display settings
 */
export function getDefaultPageDisplay(type: 'BADGE' | 'LABEL'): PageDisplaySettings {
  if (type === 'LABEL') {
    // Labels typically appear on product images
    return {
      product: true,
      collection: true,
      home: false,
      search: false,
      cart: false,
    };
  } else {
    // Badges typically appear below product titles
    return {
      product: true,
      collection: true,
      home: true,
      search: true,
      cart: false,
    };
  }
}

/**
 * Validates pageDisplay settings and provides suggestions
 * @param pageDisplay - Current page display settings
 * @param type - Badge or label type
 * @returns Validation result with suggestions
 */
export function validatePageDisplaySettings(
  pageDisplay: PageDisplaySettings,
  type: 'BADGE' | 'LABEL'
): { isValid: boolean; suggestions: string[] } {
  const suggestions: string[] = [];
  let isValid = true;
  
  // Check if at least one page is enabled
  const enabledPages = Object.values(pageDisplay).filter(Boolean).length;
  
  if (enabledPages === 0) {
    isValid = false;
    suggestions.push('At least one page type must be enabled');
  }
  
  // Type-specific suggestions
  if (type === 'LABEL') {
    if (!pageDisplay.product && !pageDisplay.collection) {
      suggestions.push('Labels work best on product and collection pages');
    }
    if (pageDisplay.cart) {
      suggestions.push('Labels on cart page may not be visible');
    }
  } else if (type === 'BADGE') {
    if (!pageDisplay.product) {
      suggestions.push('Badges are most effective on product pages');
    }
  }
  
  return { isValid, suggestions };
}
