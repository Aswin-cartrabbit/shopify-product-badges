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
import { BadgeBuilder } from "@/components/forms/badgeCreateForm";
import { getTemplateById } from "@/utils/templateData";

export default function ChooseLabelType() {
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
      // First, try to get template by ID from centralized data
      const template = getTemplateById(router.query.template as string);
      if (template) {
        console.log('Template loaded from ID:', template);
        setSelectedTemplate(template);
        setShowBuilder(true);
        return;
      }

      // Handle create from scratch
      if (router.query.template === "create-from-scratch") {
        console.log('Create from scratch mode');
        setSelectedTemplate(null);
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
          design: result.data.templates,    // templates field from DB maps to design
          display: result.data.rules,       // rules field from DB maps to display
          settings: result.data.settings,
          status: result.data.status,
          createdAt: result.data.createdAt,
          updatedAt: result.data.updatedAt,
        };

        console.log('Setting selectedTemplate with edit data:', componentData);
        setSelectedTemplate(componentData);
        setShowBuilder(true);
        setEditDataLoaded(true);
        setIsLoading(false);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch component data:', errorData);
        setErrorMessage(`Failed to load label data: ${errorData.message || 'Unknown error'}`);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching component data:', error);
      setErrorMessage('Error loading label data. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSave = async (labelData: any) => {
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
          ...labelData,
          type: "LABEL",
        }),
      });

      console.log('response ------->', response);

      if (response.ok) {
        router.push("/labels");
      } else {
        // Handle error response
        try {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          setErrorMessage(errorData.message || `Failed to ${isEdit ? 'update' : 'create'} label (${response.status})`);
        } catch (parseError) {
          // If we can't parse the error response, show a generic error
          setErrorMessage(`Failed to ${isEdit ? 'update' : 'create'} label (${response.status})`);
        }
      }
    } catch (error) {
      console.error(`Error ${router.query.edit === 'true' ? 'updating' : 'creating'} label:`, error);
      setErrorMessage(error.message || "An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/labels");
  };

  if (showBuilder) {
    return (
      <BadgeBuilder 
        type="LABEL"
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
    <Page title="Choose label type">
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
                Block in product page below add to cart button.
              </Text>
            </BlockStack>
            <Button
              fullWidth
              onClick={() => {
                router.push("/labels/create");
              }}
            >
              Select this label type
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
                Add a label block to cart page or cart drawer.
              </Text>
            </BlockStack>
            <Button
              fullWidth
              onClick={() => {
                router.push("/labels/create");
              }}
            >
              Select this label type
            </Button>
          </BlockStack>
        </Card>

        {/* Essential Free Shipping Bar */}
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
              Increase AOV with <br /> Free Shipping Bar + Upsell!
            </div>
            <BlockStack gap="100">
              <Text variant="headingMd" as="h3">
                Essential Free Shipping Bar
              </Text>
              <Text variant="bodyMd" as="p">
                Increase average order value by up to 30% with a free shipping
                bar.
              </Text>
            </BlockStack>
            <Button
              fullWidth
              onClick={() => {
                router.push("/labels/create");
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
