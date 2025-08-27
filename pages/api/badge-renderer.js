// Badge Renderer Script for Shopify Storefronts
// This script is injected into Shopify themes to render badges

import withMiddleware from "@/utils/middleware/withMiddleware";
import { PrismaClient } from "@/prisma/client";

const prisma = new PrismaClient();

/**
 * @param {import("next").NextApiRequest} req - The HTTP request object.
 * @param {import("next").NextApiResponse} res - The HTTP response object.
 */
const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { shop } = req.query;
    
    if (!shop) {
      return res.status(400).json({ error: "Shop parameter is required" });
    }

    // Get the store
    const store = await prisma.stores.findUnique({
      where: { shop: shop },
      include: {
        badges: {
          where: { status: "ACTIVE" },
          include: {
            design: true,
            placement: true,
            targeting: true,
          },
        },
      },
    });

    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    // Generate the badge renderer JavaScript
    const script = generateBadgeScript(store.badges, shop);

    res.setHeader("Content-Type", "application/javascript");
    res.setHeader("Cache-Control", "public, max-age=300"); // Cache for 5 minutes
    return res.status(200).send(script);
  } catch (error) {
    console.error("---> Error generating badge renderer:", error);
    return res.status(500).send("// Error loading badge renderer");
  }
};

function generateBadgeScript(badges, shop) {
  return `
(function() {
  'use strict';
  
  // Badge configuration
  const BADGES = ${JSON.stringify(badges)};
  const SHOP_DOMAIN = '${shop}';
  const API_URL = '${process.env.SHOPIFY_APP_URL}';
  
  // Badge renderer class
  class HackathonBadgeRenderer {
    constructor() {
      this.badges = BADGES;
      this.rendered = new Set();
      this.init();
    }
    
    init() {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.renderBadges());
      } else {
        this.renderBadges();
      }
      
      // Handle dynamic content (for SPA-like themes)
      this.observeChanges();
    }
    
    renderBadges() {
      this.badges.forEach(badge => {
        this.renderBadge(badge);
      });
    }
    
    renderBadge(badge) {
      const { placement, design, targeting } = badge;
      
      // Check if badge should be displayed on current page
      if (!this.shouldShowBadge(badge)) {
        return;
      }
      
      // Find target elements based on placement
      const targetElements = this.findTargetElements(placement);
      
      targetElements.forEach(element => {
        const badgeId = \`badge-\${badge.id}-\${this.getElementId(element)}\`;
        
        // Skip if already rendered
        if (this.rendered.has(badgeId)) {
          return;
        }
        
        // Create and insert badge
        const badgeElement = this.createBadgeElement(badge, badgeId);
        this.insertBadge(element, badgeElement, placement);
        
        this.rendered.add(badgeId);
        
        // Track view
        this.trackEvent(badge.id, 'view');
      });
    }
    
    shouldShowBadge(badge) {
      const { placement, targeting } = badge;
      const currentPage = this.getCurrentPageType();
      
      // Check page location
      if (placement.location === 'PRODUCT_PAGE' && currentPage !== 'product') {
        return false;
      }
      if (placement.location === 'COLLECTION_PAGE' && currentPage !== 'collection') {
        return false;
      }
      if (placement.location === 'CART_PAGE' && currentPage !== 'cart') {
        return false;
      }
      
      // Check device type
      const deviceType = this.getDeviceType();
      if (!placement.showOnDesktop && deviceType === 'desktop') return false;
      if (!placement.showOnMobile && deviceType === 'mobile') return false;
      if (!placement.showOnTablet && deviceType === 'tablet') return false;
      
      // Check targeting rules
      return this.checkTargeting(targeting);
    }
    
    checkTargeting(targeting) {
      if (!targeting || targeting.length === 0) {
        return true; // No targeting rules = show to all
      }
      
      // For product pages, check product-specific targeting
      if (window.meta && window.meta.product) {
        const product = window.meta.product;
        
        for (const rule of targeting) {
          const shouldShow = this.evaluateTargetingRule(rule, product);
          if (rule.isInclusive && shouldShow) return true;
          if (!rule.isInclusive && shouldShow) return false;
        }
      }
      
      return true;
    }
    
    evaluateTargetingRule(rule, product) {
      switch (rule.ruleType) {
        case 'ALL_PRODUCTS':
          return true;
        case 'SPECIFIC_PRODUCTS':
          const productIds = rule.ruleValue.split(',');
          return productIds.includes(product.id.toString());
        case 'PRODUCT_TAGS':
          const requiredTags = rule.ruleValue.split(',');
          return requiredTags.some(tag => product.tags.includes(tag.trim()));
        case 'PRODUCT_TYPE':
          return product.type === rule.ruleValue;
        case 'VENDOR':
          return product.vendor === rule.ruleValue;
        default:
          return true;
      }
    }
    
    findTargetElements(placement) {
      const { location, position, customSelector } = placement;
      
      if (customSelector) {
        return Array.from(document.querySelectorAll(customSelector));
      }
      
      // Default selectors based on common Shopify theme patterns
      const selectors = {
        'PRODUCT_PAGE': {
          'TOP_RIGHT': '.product-single, .product, .product-form',
          'BEFORE_ADD_TO_CART': '.product-form__buttons, .btn-product, [name="add"]',
          'AFTER_ADD_TO_CART': '.product-form__buttons, .btn-product, [name="add"]',
        },
        'COLLECTION_PAGE': {
          'TOP_CENTER': '.collection-header, .page-header',
        },
        'CART_PAGE': {
          'TOP_CENTER': '.cart-header, .cart, #cart',
        }
      };
      
      const selector = selectors[location]?.[position];
      if (selector) {
        return Array.from(document.querySelectorAll(selector));
      }
      
      return [];
    }
    
    createBadgeElement(badge, badgeId) {
      const { design, title, subheading, iconUrl, ctaText } = badge;
      
      const badgeEl = document.createElement('div');
      badgeEl.id = badgeId;
      badgeEl.className = 'hackathon-badge';
      
      // Apply design styles
      const styles = this.generateBadgeStyles(design);
      Object.assign(badgeEl.style, styles);
      
      // Create badge content
      let content = '';
      
      if (iconUrl) {
        content += \`<img src="\${iconUrl}" class="badge-icon" style="width: \${design.iconSize || 32}px; height: \${design.iconSize || 32}px;" />\`;
      }
      
      if (title) {
        content += \`<h3 class="badge-title">\${title}</h3>\`;
      }
      
      if (subheading) {
        content += \`<p class="badge-subtitle">\${subheading}</p>\`;
      }
      
      if (ctaText) {
        content += \`<button class="badge-cta" onclick="hackathonBadgeRenderer.handleCTA('\${badge.id}')">\${ctaText}</button>\`;
      }
      
      badgeEl.innerHTML = content;
      
      // Add click tracking
      badgeEl.addEventListener('click', () => {
        this.trackEvent(badge.id, 'click');
      });
      
      return badgeEl;
    }
    
    generateBadgeStyles(design) {
      const styles = {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: \`\${design.paddingTop || 16}px \${design.paddingLeft || 16}px \${design.paddingBottom || 16}px \${design.paddingRight || 16}px\`,
        margin: \`\${design.marginTop || 20}px \${design.marginRight || 0}px \${design.marginBottom || 20}px \${design.marginLeft || 0}px\`,
        borderRadius: \`\${design.cornerRadius || 8}px\`,
        border: design.borderSize ? \`\${design.borderSize}px solid \${design.borderColor || '#ccc'}\` : 'none',
        zIndex: design.zIndex || 1000,
        fontFamily: design.fontFamily === 'own_theme' ? 'inherit' : design.fontFamily,
      };
      
      // Background
      if (design.backgroundType === 'gradient' && design.gradientColor1 && design.gradientColor2) {
        styles.background = \`linear-gradient(\${design.gradientAngle || 0}deg, \${design.gradientColor1}, \${design.gradientColor2})\`;
      } else {
        styles.backgroundColor = design.backgroundColor || '#000000';
      }
      
      return styles;
    }
    
    insertBadge(targetElement, badgeElement, placement) {
      const { position } = placement;
      
      switch (position) {
        case 'BEFORE_ADD_TO_CART':
          targetElement.parentNode.insertBefore(badgeElement, targetElement);
          break;
        case 'AFTER_ADD_TO_CART':
          targetElement.parentNode.insertBefore(badgeElement, targetElement.nextSibling);
          break;
        case 'TOP_LEFT':
        case 'TOP_RIGHT':
        case 'TOP_CENTER':
          targetElement.insertBefore(badgeElement, targetElement.firstChild);
          break;
        default:
          targetElement.appendChild(badgeElement);
      }
    }
    
    handleCTA(badgeId) {
      this.trackEvent(badgeId, 'click');
      // Additional CTA handling can be added here
    }
    
    trackEvent(badgeId, eventType) {
      // Debounce tracking events
      const key = \`\${badgeId}-\${eventType}\`;
      if (this.tracking && this.tracking[key]) {
        clearTimeout(this.tracking[key]);
      }
      
      if (!this.tracking) this.tracking = {};
      
      this.tracking[key] = setTimeout(() => {
        fetch(\`\${API_URL}/api/badges/analytics\`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            badgeId,
            eventType,
            deviceType: this.getDeviceType(),
            location: this.getCurrentPageType(),
            timestamp: new Date().toISOString(),
          }),
        }).catch(err => console.warn('Badge tracking failed:', err));
        
        delete this.tracking[key];
      }, 100);
    }
    
    getCurrentPageType() {
      const path = window.location.pathname;
      if (path.includes('/products/')) return 'product';
      if (path.includes('/collections/')) return 'collection';
      if (path.includes('/cart')) return 'cart';
      if (path === '/') return 'home';
      return 'other';
    }
    
    getDeviceType() {
      const width = window.innerWidth;
      if (width <= 768) return 'mobile';
      if (width <= 1024) return 'tablet';
      return 'desktop';
    }
    
    getElementId(element) {
      return element.id || element.className.replace(/\\s+/g, '-') || 'unknown';
    }
    
    observeChanges() {
      // Re-render badges when DOM changes (for dynamic themes)
      const observer = new MutationObserver((mutations) => {
        let shouldRerender = false;
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            shouldRerender = true;
          }
        });
        
        if (shouldRerender) {
          setTimeout(() => this.renderBadges(), 100);
        }
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  }
  
  // Initialize badge renderer
  window.hackathonBadgeRenderer = new HackathonBadgeRenderer();
  
  // Add basic styles
  const styles = document.createElement('style');
  styles.textContent = \`
    .hackathon-badge {
      max-width: 100%;
      box-sizing: border-box;
    }
    .hackathon-badge .badge-title {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }
    .hackathon-badge .badge-subtitle {
      margin: 0;
      font-size: 14px;
      opacity: 0.8;
    }
    .hackathon-badge .badge-icon {
      flex-shrink: 0;
    }
    .hackathon-badge .badge-cta {
      background: rgba(255,255,255,0.2);
      border: 1px solid rgba(255,255,255,0.3);
      padding: 4px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }
    .hackathon-badge .badge-cta:hover {
      background: rgba(255,255,255,0.3);
    }
  \`;
  document.head.appendChild(styles);
  
})();
`;
}

export default withMiddleware("verifyProxy")(handler);
