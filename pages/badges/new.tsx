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

export default function ChooseBadgeType() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showBuilder, setShowBuilder] = useState(false);

  useEffect(() => {
    if (router.query.template) {
      // First, try to get template by ID from centralized data
      const template = getTemplateById(router.query.template as string);
      if (template) {
        setSelectedTemplate(template);
        setShowBuilder(true);
        return;
      }

      // Handle AI generated template
      if (router.query.template === "ai-generated" && router.query.aiGeneratedSrc) {
        setSelectedTemplate({
          id: "ai-generated",
          src: router.query.aiGeneratedSrc as string,
          alt: "AI Generated Badge",
          type: "ai"
        });
        setShowBuilder(true);
        return;
      }

      // Handle create from scratch
      if (router.query.template === "create-from-scratch") {
        setSelectedTemplate(null);
        setShowBuilder(true);
        return;
      }

      // Fallback: try to parse templateData (for backward compatibility)
      if (router.query.templateData) {
        try {
          const templateData = JSON.parse(router.query.templateData as string);
          setSelectedTemplate(templateData);
          setShowBuilder(true);
        } catch (error) {
          console.error("Error parsing template data:", error);
        }
      }
    }
  }, [router.query]);

  const handleSave = async (badgeData: any) => {
    try {
      const response = await fetch('/api/badge/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...badgeData,
          type: 'BADGE'
        }),
      });

      if (response.ok) {
        router.push('/badges');
      } else {
        console.error('Failed to create badge');
      }
    } catch (error) {
      console.error('Error creating badge:', error);
    }
  };

  const handleCancel = () => {
    router.push('/badges');
  };

  if (showBuilder) {
    return (
      <BadgeBuilder 
        type="BADGE"
        selectedTemplate={selectedTemplate}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }
  return (
    <Page title="Choose badge type">
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
                router.push("/badges/create");
              }}
            >
              Select this badge type
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
                Add a badge block to cart page or cart drawer.
              </Text>
            </BlockStack>
            <Button
              fullWidth
              onClick={() => {
                router.push("/badges/create");
              }}
            >
              Select this badge type
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
                router.push("/badges/create");
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
