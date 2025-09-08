# Theme App Embed Check

This document explains the theme app embed functionality that has been implemented to ensure badges display correctly on the storefront.

## Overview

The theme app embed check ensures that the Shopify store has enabled the app embed in their theme. Without this, badges and other visual components won't display on the storefront.

## How It Works

### 1. Automatic Detection
- When the app loads, it automatically checks if the theme app embed is enabled
- This check happens via the `/api/apps/theme-embed-status` endpoint
- The check uses the Shopify GraphQL API to examine the active theme's `settings_data.json` file

### 2. User Notification
- If the app embed is not enabled, a warning banner appears at the top of the app
- The banner provides clear instructions on how to enable the app embed
- Users can dismiss the banner if needed (dismissal is stored in localStorage)

### 3. Direct Redirect
- A "Open Theme Editor" button redirects users directly to their theme editor
- The redirect takes them to the app embeds section where they can enable the functionality
- The redirect uses the specific theme ID when available

## Components

### API Endpoints

#### `/api/apps/theme-embed-status`
Main endpoint that checks if app embeds are enabled.

**Response:**
```json
{
  "hasAppEmbedEnabled": boolean,
  "activeTheme": {
    "id": "gid://shopify/Theme/123456789",
    "name": "Dawn"
  },
  "appEmbedBlocks": number,
  "allBlocks": number
}
```

#### `/api/apps/test-theme-embed` 
Debug endpoint that provides detailed information about themes and app embeds.

### React Components

#### `ThemeEmbedBanner`
- Displays the warning banner when app embed is not enabled
- Provides step-by-step instructions
- Includes redirect functionality

#### `useThemeEmbedStatus` Hook
- Custom React hook for checking embed status
- Handles loading states and error handling
- Provides `checkStatus()` function for manual refresh

### Utility Functions

#### `themeEmbedHelper.ts`
- `redirectToThemeEditor()` - Opens theme editor in new tab
- `getEmbedBannerDismissalStatus()` - Checks if banner was dismissed
- `setEmbedBannerDismissalStatus()` - Stores dismissal status
- `clearEmbedBannerDismissal()` - Clears dismissal for testing

## Integration

The theme embed check is integrated into the main dashboard page (`pages/index.tsx`), so it appears prominently on the app's home page when users first load the app.

### Key Features:
- **Automatic checking** on app load
- **Smart dismissal** that persists across sessions
- **Error handling** for API failures
- **Loading states** during checks
- **Direct navigation** to theme editor

## Technical Details

### GraphQL Queries Used

1. **Get Active Theme:**
```graphql
query GetActiveTheme {
  themes(first: 50) {
    edges {
      node {
        id
        name
        role
        createdAt
        updatedAt
      }
    }
  }
}
```

2. **Get Theme Settings:**
```graphql
query GetThemeAsset($input: AssetInput!) {
  themeAsset(input: $input) {
    ... on OnlineStoreThemeFileBodyText {
      content
    }
    ... on UserError {
      field
      message
    }
  }
}
```

### App Embed Detection Logic

The system looks for blocks in `settings_data.json` that:
1. Have a `type` field containing `/blocks/`
2. Are not marked as `disabled: true`
3. Are app embed blocks (as opposed to regular theme blocks)

## Testing

Use the `/api/apps/test-theme-embed` endpoint to debug and test the embed detection:

```bash
GET /api/apps/test-theme-embed
```

This provides detailed information about:
- All themes in the store
- Theme files
- Block configuration
- App embed status

## Setup Instructions for Store Owners

1. Go to **Online Store** → **Themes** in Shopify admin
2. Click **Customize** on your active theme
3. In the theme editor, click the **App embeds** tab
4. Find "Product Badges" (or your app name) and toggle it **ON**
5. Click **Save** to publish changes

## Environment Variables

- `NEXT_PUBLIC_APP_NAME` - Used in banner text to reference the app by name

## Troubleshooting

### Common Issues:

1. **Banner keeps appearing after enabling embed:**
   - Clear the dismissal status: `clearEmbedBannerDismissal()`
   - Refresh the page to re-check status

2. **API errors during check:**
   - Check Shopify API permissions
   - Verify GraphQL client is properly configured
   - Check network connectivity

3. **Redirect not working:**
   - Ensure popup blockers are disabled
   - Check that shop domain is correctly detected
   - Verify Shopify App Bridge is loaded

### Debug Steps:

1. Check `/api/apps/test-theme-embed` for detailed status
2. Verify browser console for JavaScript errors
3. Check network tab for API call responses
4. Test with different themes if available
