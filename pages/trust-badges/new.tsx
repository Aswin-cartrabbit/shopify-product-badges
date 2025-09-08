import {
  Page,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Button,
  Badge,
} from "@shopify/polaris";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { TrustBadgeBuilder } from "@/components/forms/TrustBadgeBuilder";

export default function ChooseTrustBadgeType() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editDataLoaded, setEditDataLoaded] = useState(false);

  useEffect(() => {
    // Only run when router is ready and we haven't already loaded edit data
    if (!router.isReady || isLoading || editDataLoaded) return;

    console.log('Router query:', router.query);

    // Check if we're in edit mode
    if (router.query.edit === 'true' && router.query.id) {
      console.log('Edit mode detected, fetching component data...');
      setIsLoading(true);
      fetchComponentData(router.query.id as string);
      return;
    }

    // Legacy: Check if we're in edit mode with data passed directly
    if (router.query.edit === 'true' && router.query.data) {
      try {
        const editData = JSON.parse(router.query.data as string);
        console.log('Legacy edit data loaded:', editData);
        setSelectedTemplate(editData);
        setShowBuilder(true);
        setEditDataLoaded(true);
        return;
      } catch (error) {
        console.error("Error parsing edit data:", error);
      }
    }

    // Only handle template logic if we're not in edit mode
    if (!router.query.edit && router.query.template) {
      // Handle create from scratch
      if (router.query.template === "create-from-scratch") {
        console.log('Create from scratch mode');
        setSelectedTemplate(null);
        setShowBuilder(true);
        return;
      }

      // Handle template by ID (hardcoded templates)
      const templates = {
        "payment-section": {
          id: "payment-section",
          title: "Secure payment with",
          category: "Payment",
          type: "payment-group",
          icons: [
            {
              id: "stripe",
              name: "Stripe",
              src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b68ffe926d.svg"
            },
            {
              id: "opay", 
              name: "OPay",
              src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b632915548.svg"
            },
            {
              id: "amex",
              name: "American Express",
              src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b6328a9177.svg"
            },
            {
              id: "visa",
              name: "Visa",
              src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b68521f50c.svg"
            }
          ]
        },
        "school-season": {
          id: "school-season",
          title: "School Season!",
          subtitle: "Select",
          category: "Seasonal",
          type: "image-group",
          images: [
            {
              id: "school-1",
              name: "School Badge 1",
              src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/6880479ab6639.png"
            },
            {
              id: "school-2", 
              name: "School Badge 2",
              src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/6880479aaf42a.png"
            },
            {
              id: "school-3",
              name: "School Badge 3", 
              src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/6880479abc83b.png"
            },
            {
              id: "school-4",
              name: "School Badge 4",
              src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/6880479ab9bd3.png"
            }
          ]
        },
        "trust-badges": {
          id: "trust-badges",
          title: "Trust & Quality",
          category: "Trust",
          type: "trust-group", 
          icons: [
            {
              id: "worldwide-shipping",
              name: "Worldwide Shipping",
              src: "https://cdn-icons-png.flaticon.com/512/2769/2769339.png"
            },
            {
              id: "50k-reviews",
              name: "50,000+ Reviews",
              src: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png"
            },
            {
              id: "organic-certified",
              name: "Organic Certified",
              src: "https://cdn-icons-png.flaticon.com/512/1598/1598431.png"
            },
            {
              id: "top-5-world-brands",
              name: "Top 5 World Brands",
              src: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png"
            }
          ]
        },
        "back-to-school": {
          id: "back-to-school",
          title: "Back To School Season!",
          category: "Seasonal",
          type: "seasonal-group",
          icons: [
            {
              id: "school-bus",
              name: "School Bus",
              src: "https://cdn-icons-png.flaticon.com/512/3652/3652191.png"
            },
            {
              id: "backpack",
              name: "Backpack",
              src: "https://cdn-icons-png.flaticon.com/512/2769/2769339.png"
            },
            {
              id: "gift-bag",
              name: "Gift Bag",
              src: "https://cdn-icons-png.flaticon.com/512/1598/1598431.png"
            },
            {
              id: "credit-card",
              name: "Credit Card",
              src: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png"
            }
          ]
        }
      };

      const template = templates[router.query.template as string];
      if (template) {
        console.log('Template loaded from ID:', template);
        setSelectedTemplate(template);
        setShowBuilder(true);
        return;
      }

      // Fallback: try to parse templateData (for backward compatibility)
      if (router.query.templateData) {
        try {
          const templateData = JSON.parse(router.query.templateData as string);
          console.log('Template data loaded:', templateData);
          setSelectedTemplate(templateData);
          setShowBuilder(true);
        } catch (error) {
          console.error("Error parsing template data:", error);
        }
      }
    }
  }, [router.isReady, router.query.edit, router.query.id, router.query.template, router.query.templateData, router.query.data, isLoading, editDataLoaded]);

  // Fetch component data for editing
  const fetchComponentData = async (componentId: string) => {
    try {
      console.log('Fetching component data for ID:', componentId);
      
      const response = await fetch(`/api/badge/${componentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Fetched component data from DB:', result.data);
        
        // Map the database structure to the expected template structure
        const componentData = {
          id: result.data.id,
          name: result.data.name,
          description: result.data.description,
          type: result.data.type,
          title: result.data.templates?.content?.title || result.data.name,
          // Extract content from templates.content for direct access
          content: result.data.templates?.content || {},
          icons: result.data.templates?.content?.icons || [],
          // Map design properties from templates (excluding content)
          design: {
            background: result.data.templates?.background || "transparent",
            borderRadius: result.data.templates?.borderRadius || 0,
            padding: result.data.templates?.padding || 16
          },
          display: result.data.rules,       // rules field from DB maps to display
          settings: result.data.settings,
          status: result.data.status,
          createdAt: result.data.createdAt,
          updatedAt: result.data.updatedAt,
        };

        console.log('Setting selectedTemplate with edit data:', componentData);
        console.log('Mapped icons:', componentData.icons);
        console.log('Mapped content:', componentData.content);
        console.log('Mapped design:', componentData.design);
        setSelectedTemplate(componentData);
        setShowBuilder(true);
        setEditDataLoaded(true);
        setIsLoading(false);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch component data:', errorData);
        setErrorMessage(`Failed to load trust badge data: ${errorData.message || 'Unknown error'}`);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching component data:', error);
      setErrorMessage('Error loading trust badge data. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSave = async (trustBadgeData: any) => {
    try {
      setIsSaving(true);
      setErrorMessage(null);
      
      const isEdit = router.query.edit === 'true' && router.query.id;
      const url = isEdit ? `/api/badge/update?id=${router.query.id}` : '/api/badge/create';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...trustBadgeData,
          type: "TRUST_BADGE",
        }),
      });

      console.log('response ------->', response);

      if (response.ok) {
        router.push("/trust-badges");
      } else {
        // Handle error response
        try {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          setErrorMessage(errorData.message || `Failed to ${isEdit ? 'update' : 'create'} trust badge (${response.status})`);
        } catch (parseError) {
          // If we can't parse the error response, show a generic error
          setErrorMessage(`Failed to ${isEdit ? 'update' : 'create'} trust badge (${response.status})`);
        }
      }
    } catch (error) {
      console.error(`Error ${router.query.edit === 'true' ? 'updating' : 'creating'} trust badge:`, error);
      setErrorMessage(error.message || "An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/trust-badges");
  };

  if (showBuilder) {
    return (
      <TrustBadgeBuilder 
        selectedTemplate={selectedTemplate}
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={isSaving}
        errorMessage={errorMessage}
        onClearError={() => setErrorMessage(null)}
      />
    );
  }

  return (
    <Page title="Choose trust badge type">
      <InlineStack gap="400" align="start" wrap={false}>
        {/* Product Page */}
        <Card>
          <BlockStack gap="200">
            <div
              style={{
                height: "140px",
                background: "#f6f6f7",
                borderRadius: "8px",
              }}
            />
            <BlockStack gap="100">
              <Text variant="headingMd" as="h3">
                Product page
              </Text>
              <Text variant="bodyMd" as="p">
                Show trust badges below add to cart button on product pages.
              </Text>
            </BlockStack>
            <Button
              fullWidth
              onClick={() => {
                router.push("/trust-badges/create");
              }}
            >
              Select this trust badge type
            </Button>
          </BlockStack>
        </Card>

        {/* Cart Page */}
        <Card>
          <BlockStack gap="200">
            <div
              style={{
                height: "140px",
                background: "#f6f6f7",
                borderRadius: "8px",
              }}
            />
            <BlockStack gap="100">
              <InlineStack align="space-between">
                <Text variant="headingMd" as="h3">
                  Cart page
                </Text>
                <Badge tone="info">Essential plan</Badge>
              </InlineStack>
              <Text variant="bodyMd" as="p">
                Add trust badges to cart page or cart drawer.
              </Text>
            </BlockStack>
            <Button
              fullWidth
              onClick={() => {
                router.push("/trust-badges/create");
              }}
            >
              Select this trust badge type
            </Button>
          </BlockStack>
        </Card>

        {/* Footer Trust Section */}
        <Card>
          <BlockStack gap="200">
            <div
              style={{
                height: "140px",
                background: "#111",
                color: "#fff",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              Build Customer Trust <br /> with Security Badges!
            </div>
            <BlockStack gap="100">
              <Text variant="headingMd" as="h3">
                Essential Trust Footer
              </Text>
              <Text variant="bodyMd" as="p">
                Increase customer confidence with trust badges in your site footer.
              </Text>
            </BlockStack>
            <Button
              fullWidth
              onClick={() => {
                router.push("/trust-badges/create");
              }}
            >
              View app
            </Button>
          </BlockStack>
        </Card>
      </InlineStack>
    </Page>
  );
}
