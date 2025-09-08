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
import { BannerBuilder } from "@/components/forms/BannerBuilder";
import { getBannerTemplateById } from "@/utils/bannerTemplateData";

export default function BannerNew() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editDataLoaded, setEditDataLoaded] = useState(false);
  const [bannerType, setBannerType] = useState<string>("fixed");

  useEffect(() => {
    // Only run when router is ready and we haven't already loaded edit data
    if (!router.isReady || isLoading || editDataLoaded) return;

    console.log('Router query:', router.query);

    // Check if we're in edit mode
    if (router.query.edit === 'true' && router.query.id) {
      console.log('Edit mode detected, fetching banner data...');
      setIsLoading(true);
      fetchBannerData(router.query.id as string);
      return;
    }

    // Handle template selection for creation mode
    if (router.query.template) {
      const templateData = getBannerTemplateById(router.query.template as string);
      if (templateData) {
        console.log('Template loaded:', templateData);
        setSelectedTemplate(templateData);
        setBannerType(templateData.type);
        setShowBuilder(true);
      } else {
        // Fallback for create from scratch
        setBannerType('fixed');
        setShowBuilder(true);
      }
      return;
    }

    // Handle banner type for simple creation
    if (router.query.type) {
      setBannerType(router.query.type as string);
      setShowBuilder(true);
      return;
    }

    // Default: show builder with fixed type
    setBannerType('fixed');
    setShowBuilder(true);
  }, [router.isReady, router.query.edit, router.query.id, router.query.template, router.query.type, isLoading, editDataLoaded]);

  // Fetch banner data for editing
  const fetchBannerData = async (bannerId: string) => {
    try {
      console.log('Fetching banner data for ID:', bannerId);
      
      const response = await fetch(`/api/badge/${bannerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Fetched banner data from DB:', result.data);
        
        // Map the database structure to what BannerBuilder expects
        // Database stores: templates.content, templates.backgroundColor, etc.
        // BannerBuilder expects: design.content, design.style, etc.
        const bannerData = {
          id: result.data.id,
          name: result.data.name,
          description: result.data.description,
          type: result.data.type,
          title: result.data.templates?.content?.title || result.data.name,
          
          // Map to the structure BannerBuilder expects for templates
          design: {
            content: result.data.templates?.content || {
              title: result.data.templates?.title || "",
              message: "",
              buttonText: "",
              buttonUrl: "",
              countdown: {}
            },
            style: {
              backgroundColor: result.data.templates?.backgroundColor || "#f3f4f6",
              textColor: result.data.templates?.textColor || "#1f2937",
              buttonColor: result.data.templates?.buttonColor || "#3b82f6",
              fontSize: result.data.templates?.fontSize || "16px",
              fontWeight: result.data.templates?.fontWeight || "500",
              padding: result.data.templates?.padding || "12px 20px",
              borderRadius: result.data.templates?.borderRadius || "0px",
              height: result.data.templates?.height || "60px"
            },
            position: {
              placement: result.data.templates?.placement || "top",
              sticky: result.data.templates?.sticky || false,
              zIndex: result.data.templates?.zIndex || 100
            }
          },
          
          display: result.data.rules,       // rules field from DB maps to display
          settings: result.data.settings,
          status: result.data.status,
          createdAt: result.data.createdAt,
          updatedAt: result.data.updatedAt,
        };

        console.log('Setting selectedTemplate with edit data:', bannerData);
        setSelectedTemplate(bannerData);
        setBannerType(result.data.type?.toLowerCase() || "fixed");
        setShowBuilder(true);
        setEditDataLoaded(true);
        setIsLoading(false);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch banner data:', errorData);
        setErrorMessage(`Failed to load banner data: ${errorData.message || 'Unknown error'}`);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching banner data:', error);
      setErrorMessage('Error loading banner data. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSave = async (bannerData: any) => {
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
          ...bannerData,
          type: "BANNER",
        }),
      });

      console.log('Banner save response:', response);

      if (response.ok) {
        router.push("/banners");
      } else {
        // Handle error response
        try {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          setErrorMessage(errorData.message || `Failed to ${isEdit ? 'update' : 'create'} banner (${response.status})`);
        } catch (parseError) {
          // If we can't parse the error response, show a generic error
          setErrorMessage(`Failed to ${isEdit ? 'update' : 'create'} banner (${response.status})`);
        }
      }
    } catch (error) {
      console.error(`Error ${router.query.edit === 'true' ? 'updating' : 'creating'} banner:`, error);
      setErrorMessage(error.message || "An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/banners");
  };

  if (isLoading) {
    return (
      <Page title="Loading banner...">
        <Card>
          <div style={{ padding: "40px", textAlign: "center" }}>
            <Text variant="bodyMd" tone="subdued" as="p">
              Loading banner data...
            </Text>
          </div>
        </Card>
      </Page>
    );
  }

  if (errorMessage) {
    return (
      <Page title="Error">
        <Card>
          <div style={{ padding: "40px", textAlign: "center" }}>
            <Text variant="bodyMd" tone="critical" as="p">
              {errorMessage}
            </Text>
            <div style={{ marginTop: "16px" }}>
              <Button onClick={() => router.push("/banners")}>
                Back to Banners
              </Button>
            </div>
          </div>
        </Card>
      </Page>
    );
  }

  if (showBuilder) {
    return (
      <BannerBuilder 
        bannerType={bannerType as "countdown" | "fixed" | "automatic" | "slider"}
        selectedTemplate={selectedTemplate}
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={isSaving}
        errorMessage={errorMessage}
        onClearError={() => setErrorMessage(null)}
      />
    );
  }

  // Fallback loading state
  return (
    <Page title="Setting up banner editor...">
      <Card>
        <div style={{ padding: "40px", textAlign: "center" }}>
          <Text variant="bodyMd" tone="subdued" as="p">
            Setting up banner editor...
          </Text>
        </div>
      </Card>
    </Page>
  );
}
