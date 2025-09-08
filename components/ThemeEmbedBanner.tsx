import { Banner, Button, InlineStack, Text, List } from "@shopify/polaris";
import { redirectToThemeEditor } from "@/utils/themeEmbedHelper";
import React, { useState, useCallback } from "react";

interface ThemeEmbedBannerProps {
  onDismiss?: () => void;
  onEnable?: () => void;
  activeTheme?: {
    id: string;
    name: string;
  };
}

const ThemeEmbedBanner: React.FC<ThemeEmbedBannerProps> = ({ 
  onDismiss, 
  onEnable,
  activeTheme
}) => {
  const [isDismissing, setIsDismissing] = useState(false);

  const handleDismissClick = useCallback(() => {
    if (isDismissing) {
      return;
    }
    
    setIsDismissing(true);
    
    if (onDismiss) {
      onDismiss();
    }
    
    // Reset after a short delay to prevent rapid clicks
    setTimeout(() => setIsDismissing(false), 500);
  }, [onDismiss, isDismissing]);

  const handleEnableClick = () => {
    if (onEnable) {
      onEnable();
    } else {
      // Default behavior - use helper function
      redirectToThemeEditor(undefined, activeTheme?.id);
    }
  };

  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Product Badges';

  return (
    <div style={{ marginBottom: "16px" }}>
      <Banner
        title="App Embed Setup Required"
        tone="warning"
        action={{
          content: "Open Theme Editor",
          onAction: handleEnableClick,
        }}
        secondaryAction={{
          content: "Learn More",
          url: "https://help.shopify.com/en/manual/online-store/themes/theme-structure/extend/app-embed-blocks",
          external: true,
        }}
        onDismiss={handleDismissClick}
      >
        <div style={{ marginBottom: "12px" }}>
          <Text as="p">
            To display your badges on the storefront, you need to enable the app embed in your theme{activeTheme ? ` "${activeTheme.name}"` : ''}. 
            Without this, your badges won't appear on your store.
          </Text>
        </div>

        <div style={{ marginTop: "12px" }}>
          <Text as="h4" variant="headingSm">Quick Setup Steps:</Text>
          <List type="number">
            <List.Item>Click "Open Theme Editor" above (or go to Online Store → Themes)</List.Item>
            <List.Item>In the theme editor, look for the "App embeds" section</List.Item>
            <List.Item>Find "{appName}" and toggle it ON</List.Item>
            <List.Item>Click "Save" to publish your changes</List.Item>
          </List>
        </div>

        <div style={{ marginTop: "12px", padding: "8px 12px", backgroundColor: "#f1f1f1", borderRadius: "4px" }}>
          <Text as="p" variant="bodySm" tone="subdued">
            💡 The app embed allows badges to display automatically across your store without affecting your theme's code.
          </Text>
        </div>
      </Banner>
    </div>
  );
};

export default ThemeEmbedBanner;
