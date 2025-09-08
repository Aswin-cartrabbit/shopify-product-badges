import {
  Page,
  Card,
  Text,
  Button,
  BlockStack,
  InlineStack,
  Toast,
  Modal,
  EmptyState,
  Spinner,
} from "@shopify/polaris";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { TrustBadgeBuilder } from "../../components/forms/TrustBadgeBuilder";
import { DataTable } from "../../components/tables/DataTable";

export default function TrustBadges() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [trustBadges, setTrustBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const templateModalRef = useRef(null);

  // Modal handlers
  const handleOpenTemplateModal = () => {
    console.log("Opening template modal");
    setShowTemplateModal(true);
  };

  const handleCloseTemplateModal = () => {
    console.log("Closing template modal");
    setShowTemplateModal(false);
    setSelectedTemplate(null);
  };

  const handleSelectTemplate = (template) => {
    console.log("Selecting template:", template.title);
    setSelectedTemplate(template);
    setShowTemplateModal(false);
    setShowBuilder(true);
  };

  // Fetch existing trust badges
  useEffect(() => {
    const fetchTrustBadges = async () => {
      try {
        const response = await fetch('/api/badge?type=TRUST_BADGE');
        if (response.ok) {
          const result = await response.json();
          setTrustBadges(result.data?.components || []);
        }
      } catch (error) {
        console.error('Error fetching trust badges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrustBadges();
  }, []);

  // Cleanup effect to reset modal states
  useEffect(() => {
    console.log("Modal state changed - Template:", showTemplateModal, "Builder:", showBuilder);
    if (!showTemplateModal && !showBuilder) {
      // Reset states when both modals are closed
      console.log("Resetting selected template");
      setSelectedTemplate(null);
    }
  }, [showTemplateModal, showBuilder]);

  const trustBadgeTemplates = [
    // Payment Section
    {
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
    // Seasonal Section
    {
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
  ];

  return (
    <div
      style={{
        padding: "20px 24px",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 60px" }}>
        {/* Header matching screenshot */}
        <div style={{ marginBottom: "24px" }}>
          <InlineStack align="space-between" blockAlign="center">
            <BlockStack gap="200">
              <Text as="h1" variant="headingXl" fontWeight="medium">
                Trust badges
              </Text>
              <Text as="p" tone="subdued">
                Enhance store's credibility and professionalism with trust badges.{" "}
                <Button variant="plain">About trust badges</Button>
              </Text>
            </BlockStack>
            <Button
              variant="primary"
              // onClick={() => router.push("/trust-badges/create")}
              onClick={handleOpenTemplateModal}
            >
              Create trust badge
            </Button>
          </InlineStack>
        </div>

        {/* Main Content */}
        {loading ? (
          <Card>
            <div style={{ textAlign: "center", padding: "40px" }}>
              <Spinner size="large" />
              <Text as="p">Loading...</Text>
            </div>
          </Card>
        ) : trustBadges.length === 0 ? (
          /* Show templates when no badges exist */
          <Card>
            <BlockStack gap="400">
              <div style={{ textAlign: "center", padding: "20px" }}>
                <Text as="h2" variant="headingMd">Get started with trust badges</Text>
                <Text as="p" tone="subdued">
                  Choose from our collection of trust badge templates
                </Text>
              </div>
              
              <div style={{
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
                gap: "20px",
                padding: "20px"
              }}>
                {trustBadgeTemplates.map((template) => (
                  <Card key={template.id} padding="400">
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "16px",
                      minHeight: "200px",
                      justifyContent: "center"
                    }}>
                      <div style={{
                        display: "flex",
                        gap: "12px",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        maxWidth: "280px"
                      }}>
                        {template.icons?.map((icon) => (
                          <div key={icon.id} style={{
                            width: "50px",
                            height: "50px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#f6f6f7",
                            borderRadius: "8px",
                            padding: "6px"
                          }}>
                            <img 
                              src={icon.src} 
                              alt={icon.name}
                              style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "contain"
                              }}
                            />
                          </div>
                        ))}
                      </div>
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
                            Select
                          </Button>
                        </InlineStack>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </BlockStack>
          </Card>
        ) : (
          /* Show DataTable when badges exist - matching screenshot layout */
          <DataTable type="TRUST_BADGE" />
        )}

        {/* Template Selection Modal */}
        <Modal
          open={showTemplateModal}
          onClose={handleCloseTemplateModal}
          title="Select a trust badge type"
        >
          <Modal.Section>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              padding: "20px",
              maxHeight: "600px",
              overflowY: "auto"
            }}>
              {trustBadgeTemplates.map((template) => (
                <Card key={template.id} padding="400">
                  <div 
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "20px",
                      padding: "20px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      borderRadius: "12px"
                    }}
                    onClick={() => handleSelectTemplate(template)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f9f9f9";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    {/* Section Title */}
                    <Text as="h3" variant="headingMd" alignment="center">
                      {template.title}
                    </Text>
                    
                    {/* Icons Row */}
                    <div style={{
                      display: "flex",
                      gap: "16px",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: "80px"
                    }}>
                      {template.icons?.map((icon) => (
                        <div key={icon.id} style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "8px",
                          minWidth: "80px"
                        }}>
                          <div style={{
                            width: "60px",
                            height: "60px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#f6f6f7",
                            borderRadius: "12px",
                            padding: "8px"
                          }}>
                            <img 
                              src={icon.src} 
                              alt={icon.name}
                              style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "contain"
                              }}
                            />
                          </div>
                          {(template.type === "feature-group" || template.type === "trust-group") && (
                            <Text as="p" variant="bodySm" alignment="center" tone="subdued">
                              {icon.name}
                            </Text>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Modal.Section>
        </Modal>
        

        {/* Trust Badge Builder Modal */}
        {showBuilder && selectedTemplate && (
          <TrustBadgeBuilder
            selectedTemplate={selectedTemplate}
            onSave={async (data) => {
              console.log("Trust badge saved:", data);
              setShowBuilder(false);
              setSelectedTemplate(null);
              setToastMessage("Trust badge created successfully!");
              
              // Refresh the trust badges list
              try {
                const refreshResponse = await fetch('/api/badge?type=TRUST_BADGE');
                if (refreshResponse.ok) {
                  const refreshResult = await refreshResponse.json();
                  setTrustBadges(refreshResult.data?.components || []);
                }
              } catch (error) {
                console.error('Error refreshing trust badges:', error);
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