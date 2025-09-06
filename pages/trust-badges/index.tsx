import {
  Page,
  Card,
  Text,
  Button,
  BlockStack,
  InlineStack,
  Toast,
} from "@shopify/polaris";
import { useRouter } from "next/router";
import { useState } from "react";
import { TrustBadgeBuilder } from "../../components/forms/TrustBadgeBuilder";
import { DataTable } from "../../components/tables/DataTable";

export default function TrustBadges() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const trustBadgeTemplates = [
    
    {
      id: "2", 
      title: "FREE SHIPPING ORDERS ABOVE $30",
      subtitle: "Select",
      image: "https://pl-app.smartifyapps.com/assets/payment-91361088.webp",
      category: "Payment",
      type:"payment-group",

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
    // {
    //   id: "payment-icons",
    //   title: "Secure payment with",
    //   subtitle: "Select",
    //   category: "Payment",
    //   type: "payment-group",
    //   icons: [
    //     {
    //       id: "stripe",
    //       name: "Stripe",
    //       src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b68ffe926d.svg"
    //     },
    //     {
    //       id: "opay", 
    //       name: "OPay",
    //       src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b632915548.svg"
    //     },
    //     {
    //       id: "amex",
    //       name: "American Express", 
    //       src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b6328a9177.svg"
    //     },
    //     {
    //       id: "visa",
    //       name: "Visa",
    //       src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b68521f50c.svg"
    //     }
    //   ]
    // },
    {
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
    {
      id: "why-choosing-us",
      title: "Why choosing us",
      subtitle: "Select",
      category: "Features",
      type: "icon-group",
      icons: [
        {
          id: "feature-1",
          name: "Feature Badge 1",
          src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b643b71133.svg"
        },
        {
          id: "feature-2", 
          name: "Feature Badge 2",
          src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b643b705bb.svg"
        },
        {
          id: "feature-3",
          name: "Feature Badge 3", 
          src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b643b6f93c.svg"
        },
        {
          id: "feature-4",
          name: "Feature Badge 4",
          src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b643b6ea95.svg"
        }
      ]
    },
    {
      id: "security-trust",
      title: "Secure & Trusted",
      subtitle: "Select",
      category: "Security",
      type: "icon-group",
      icons: [
        {
          id: "security-1",
          name: "Security Badge 1",
          src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/6756aefc811d4.svg"
        },
        {
          id: "security-2", 
          name: "Security Badge 2",
          src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/6756aefc8382f.svg"
        },
        {
          id: "security-3",
          name: "Security Badge 3", 
          src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/6756aefc82f21.svg"
        },
        {
          id: "security-4",
          name: "Security Badge 4",
          src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/6756aefc82308.svg"
        }
      ]
    }
  ];

  return (
    <div style={{ 
      padding: "20px 24px", 
      backgroundColor: "#f6f6f7", 
      minHeight: "100vh"
    }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 60px" }}>
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <BlockStack gap="200">
            <Text as="h1" variant="headingXl" fontWeight="medium">
              Trust badges
            </Text>
            <Text as="p" tone="subdued">
              Enhance store's credibility and professionalism with trust badges.{" "}
              <Button variant="plain">
                About trust badges
              </Button>
            </Text>
          </BlockStack>
        </div>

        {/* Trust Badge Templates - Outer Container */}
        <Card padding="500">
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(2, 1fr)", 
            gap: "20px"
          }}>
            {trustBadgeTemplates.map((template) => (
              <Card key={template.id} padding="400">
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "16px",
                  padding: "20px"
                }}>
                  {template.type === "payment-group" || template.type === "icon-group" ? (
                    <div style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      maxWidth: "200px"
                    }}>
                      {template.icons?.map((icon) => (
                        <img 
                          key={icon.id}
                          src={icon.src} 
                          alt={icon.name}
                          style={{
                            width: "40px",
                            height: "auto",
                            objectFit: "contain"
                          }}
                        />
                      ))}
                    </div>
                  ) : template.type === "image-group" ? (
                    <div style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      maxWidth: "200px"
                    }}>
                      {template.images?.map((image) => (
                        <img 
                          key={image.id}
                          src={image.src} 
                          alt={image.name}
                          style={{
                            width: "40px",
                            height: "auto",
                            objectFit: "contain"
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <img 
                      src={template.image} 
                      alt={template.title}
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        maxHeight: "200px",
                        objectFit: "contain"
                      }}
                    />
                  )}
                  <div style={{ textAlign: "center", width: "100%" }}>
                    <InlineStack align="space-between" blockAlign="center">
                      <div style={{ flex: 1 }}>
                        <Text as="p" variant="bodyMd" fontWeight="medium">
                          {template.title}
                        </Text>
                      </div>
                      <Button 
                        variant="primary"
                        onClick={() => {
                          setSelectedTemplate(template);
                          setShowBuilder(true);
                        }}
                      >
                        {template.subtitle}
                      </Button>
                    </InlineStack>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
        
        {/* Existing Trust Badges Table */}
        <Card>
          <BlockStack gap="400">
            <InlineStack align="space-between" blockAlign="center">
              <Text as="h2" variant="headingMd">Your Trust Badges</Text>
              <Text as="p" tone="subdued">
                Manage your existing trust badges
              </Text>
            </InlineStack>
            <DataTable type="TRUST_BADGE" />
          </BlockStack>
        </Card>
        
        {/* Trust Badge Builder Modal */}
        {showBuilder && selectedTemplate && (
          <TrustBadgeBuilder
            selectedTemplate={selectedTemplate}
            onSave={async (data) => {
              console.log("Trust badge saved:", data);
              try {
                // Make API call to save the trust badge
                const response = await fetch('/api/badge/create', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(data),
                });

                if (response.ok) {
                  const result = await response.json();
                  console.log('Trust badge created successfully:', result);
                  // Close modal and reset state
                  setShowBuilder(false);
                  setSelectedTemplate(null);
                  // Show success toast
                  setToastMessage("Trust badge created successfully!");
                } else {
                  const error = await response.json();
                  console.error('Failed to create trust badge:', error);
                  // Show error toast
                  setToastMessage(`Failed to create trust badge: ${error.message || 'Unknown error'}`);
                }
              } catch (error) {
                console.error('Error creating trust badge:', error);
                // Show error toast
                setToastMessage(`Error creating trust badge: ${error.message || 'Unknown error'}`);
              }
            }}
            onCancel={() => {
              setShowBuilder(false);
              setSelectedTemplate(null);
            }}
          />
        )}
        
        {/* Toast for success/error messages */}
        {toastMessage && (
          <Toast
            content={toastMessage}
            onDismiss={() => setToastMessage("")}
          />
        )}
      </div>
    </div>
  );
}
