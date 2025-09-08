import {
  Card,
  Text,
} from "@shopify/polaris";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BannerBuilder } from "../../components/forms/BannerBuilder";
import { getBannerTemplateById } from "@/utils/bannerTemplateData";

export default function BannerCreate() {
  const router = useRouter();
  const { type, template } = router.query;
  const [bannerType, setBannerType] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  useEffect(() => {
    if (template) {
      // Load template by ID
      const templateData = getBannerTemplateById(template as string);
      if (templateData) {
        console.log('Template loaded:', templateData);
        setSelectedTemplate(templateData);
        setBannerType(templateData.type);
      } else {
        console.error('Template not found:', template);
        setBannerType('fixed'); // fallback
      }
    } else if (type) {
      setBannerType(type as string);
    } else {
      // Default to 'fixed' banner type if no type is specified
      setBannerType('fixed');
    }
  }, [type, template]);



  const handleCancel = () => {
    router.back();
  };

  if (!bannerType) {
    return (
      <div style={{ 
        padding: "20px 24px", 
        backgroundColor: "#f6f6f7", 
        minHeight: "100vh"
      }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 60px" }}>
          <Card padding="500">
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <Text as="h2" variant="headingMd">
                Loading banner builder...
              </Text>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <BannerBuilder 
      bannerType={bannerType as "countdown" | "fixed" | "automatic" | "slider"}
      selectedTemplate={selectedTemplate}
      onCancel={handleCancel}
    />
  );
}
