import React, { useState, useEffect } from "react";
import {
  Page,
  Card,
  Button,
  Text,
  BlockStack,
  InlineStack,
  Badge,
  Banner,
  Spinner,
  Toast,
  Frame,
  Divider,
  List,
} from "@shopify/polaris";
import { useRouter } from "next/router";

export default function Settings() {
  const router = useRouter();
  
  const [integrationStatus, setIntegrationStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch integration status
  useEffect(() => {
    fetchIntegrationStatus();
  }, []);

  const fetchIntegrationStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/shopify/integration", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch integration status");
      }

      const data = await response.json();
      setIntegrationStatus(data);
    } catch (error) {
      setToastMessage("Failed to load integration status");
      console.error("Error fetching integration status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleIntegration = async () => {
    try {
      setActionLoading(true);
      
      const method = integrationStatus?.integration?.enabled ? "DELETE" : "POST";
      const response = await fetch("/api/shopify/integration", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update integration");
      }

      const data = await response.json();
      setToastMessage(data.message);
      
      // Refresh integration status
      await fetchIntegrationStatus();
    } catch (error) {
      setToastMessage("Failed to update integration");
      console.error("Error updating integration:", error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Page title="Settings">
        <Card>
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Spinner size="large" />
            <Text as="p">Loading settings...</Text>
          </div>
        </Card>
      </Page>
    );
  }

  const { shopInfo, theme, integration, badges } = integrationStatus || {};

  return (
    <Frame>
      <Page
        title="App Settings"
        backAction={{
          content: "Dashboard",
          onAction: () => router.push("/"),
        }}
      >
        <BlockStack gap="400">
          {/* Shop Information */}
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Shop Information
              </Text>
              
              {shopInfo && (
                <BlockStack gap="200">
                  <InlineStack align="space-between">
                    <Text as="span" fontWeight="medium">Shop Name:</Text>
                    <Text as="span">{shopInfo.name}</Text>
                  </InlineStack>
                  <InlineStack align="space-between">
                    <Text as="span" fontWeight="medium">Domain:</Text>
                    <Text as="span">{shopInfo.myshopifyDomain}</Text>
                  </InlineStack>
                  <InlineStack align="space-between">
                    <Text as="span" fontWeight="medium">Plan:</Text>
                    <Text as="span">{shopInfo.plan?.displayName || "Unknown"}</Text>
                  </InlineStack>
                </BlockStack>
              )}
            </BlockStack>
          </Card>

          {/* App Integration Status */}
          <Card>
            <BlockStack gap="400">
              <InlineStack align="space-between" blockAlign="center">
                <Text variant="headingMd" as="h2">
                  App Integration
                </Text>
                <Badge tone={integration?.enabled ? "success" : "attention"}>
                  {integration?.enabled ? "Active" : "Inactive"}
                </Badge>
              </InlineStack>

              {integration?.enabled ? (
                <Banner tone="success">
                  <p>
                    Your badge app is active and rendering badges on your storefront.
                    Currently showing {badges?.active || 0} active badge{badges?.active !== 1 ? 's' : ''}.
                  </p>
                </Banner>
              ) : (
                <Banner tone="warning">
                  <p>
                    Your badge app is not active. Enable it to start showing badges on your storefront.
                  </p>
                </Banner>
              )}

              <BlockStack gap="200">
                <Text variant="bodyMd" as="p">
                  The app integration injects a lightweight script into your theme that renders 
                  badges based on your configuration. This script only loads when there are 
                  active badges to display.
                </Text>
                
                {integration?.enabled && (
                  <BlockStack gap="100">
                    <Text variant="bodySm" tone="subdued" as="p">
                      Script URL: {integration.scriptUrl}
                    </Text>
                    {integration.lastUpdated && (
                      <Text variant="bodySm" tone="subdued" as="p">
                        Last Updated: {new Date(integration.lastUpdated).toLocaleString()}
                      </Text>
                    )}
                  </BlockStack>
                )}
              </BlockStack>

              <InlineStack gap="200">
                <Button
                  variant={integration?.enabled ? "secondary" : "primary"}
                  tone={integration?.enabled ? "critical" : undefined}
                  loading={actionLoading}
                  onClick={handleToggleIntegration}
                >
                  {integration?.enabled ? "Disable Integration" : "Enable Integration"}
                </Button>
                
                {integration?.enabled && (
                  <Button
                    variant="secondary"
                    loading={actionLoading}
                    onClick={fetchIntegrationStatus}
                  >
                    Refresh Status
                  </Button>
                )}
              </InlineStack>
            </BlockStack>
          </Card>

          {/* Theme Information */}
          {theme && (
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">
                  Current Theme
                </Text>
                
                <BlockStack gap="200">
                  <InlineStack align="space-between">
                    <Text as="span" fontWeight="medium">Theme Name:</Text>
                    <Text as="span">{theme.name}</Text>
                  </InlineStack>
                  <InlineStack align="space-between">
                    <Text as="span" fontWeight="medium">Theme ID:</Text>
                    <Text as="span">{theme.id}</Text>
                  </InlineStack>
                  <InlineStack align="space-between">
                    <Text as="span" fontWeight="medium">Role:</Text>
                    <Badge tone="info">{theme.role}</Badge>
                  </InlineStack>
                </BlockStack>
              </BlockStack>
            </Card>
          )}

          {/* Badge Statistics */}
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Badge Statistics
              </Text>
              
              <InlineStack align="space-between">
                <Text as="span" fontWeight="medium">Active Badges:</Text>
                <Badge tone="success">{badges?.active || 0}</Badge>
              </InlineStack>
              
              <Text variant="bodyMd" tone="subdued" as="p">
                Only active badges are displayed on your storefront. Draft badges are not visible to customers.
              </Text>
              
              <Button 
                variant="primary" 
                onClick={() => router.push("/badges")}
              >
                Manage Badges
              </Button>
            </BlockStack>
          </Card>

          {/* Help & Documentation */}
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Help & Documentation
              </Text>
              
              <Text variant="bodyMd" as="p">
                Need help with your badge setup? Here are some useful resources:
              </Text>
              
              <List type="bullet">
                <List.Item>
                  <Text as="span">Badges appear automatically based on your targeting rules</Text>
                </List.Item>
                <List.Item>
                  <Text as="span">Use the badge preview to see how your badges will look</Text>
                </List.Item>
                <List.Item>
                  <Text as="span">Check analytics to track badge performance</Text>
                </List.Item>
                <List.Item>
                  <Text as="span">Contact support if you experience any issues</Text>
                </List.Item>
              </List>
              
              <InlineStack gap="200">
                <Button variant="secondary">
                  View Documentation
                </Button>
                <Button variant="secondary">
                  Contact Support
                </Button>
              </InlineStack>
            </BlockStack>
          </Card>
        </BlockStack>
      </Page>

      {/* Toast Messages */}
      {toastMessage && (
        <Toast 
          content={toastMessage} 
          onDismiss={() => setToastMessage(null)} 
        />
      )}
    </Frame>
  );
}

