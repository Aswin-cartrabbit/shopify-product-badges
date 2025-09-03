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

  useEffect(() => {
    if (router.query.template && router.query.templateData) {
      try {
        const templateData = JSON.parse(router.query.templateData as string);
        setSelectedTemplate(templateData);
        setShowBuilder(true);
      } catch (error) {
        console.error("Error parsing template data:", error);
        // Fallback to template ID lookup
        const template = getTemplateById(router.query.template as string);
        if (template) {
          setSelectedTemplate(template);
          setShowBuilder(true);
        }
      }
    }
  }, [router.query]);

  const handleSave = async (labelData: any) => {
    try {
      setIsSaving(true);
      setErrorMessage(null);
      const response = await fetch("/api/badge/create", {
        method: "POST",
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
          setErrorMessage(errorData.message || `Failed to create label (${response.status})`);
        } catch (parseError) {
          // If we can't parse the error response, show a generic error
          setErrorMessage(`Failed to create label (${response.status})`);
        }
      }
    } catch (error) {
      console.error("Error creating label:", error);
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
