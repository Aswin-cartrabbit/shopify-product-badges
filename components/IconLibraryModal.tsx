"use client";
import {
  Card,
  Text,
  Button,
  BlockStack,
  TextField,
} from "@shopify/polaris";
import { useState, useCallback } from "react";

interface IconLibraryModalProps {
  onSelect: (icon: any) => void;
  onClose: () => void;
}

const IconLibraryModal = ({ onSelect, onClose }: IconLibraryModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  console.log("IconLibraryModal rendering!");

  // Predefined icon library with your provided payment icons
  const iconLibrary = {
    payment: [
      {
        id: "adyen",
        name: "Adyen",
        src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b6328966b4.svg",
        category: "payment"
      },
      {
        id: "affirm",
        name: "Affirm",
        src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b63289a5cb.svg",
        category: "payment"
      },
      {
        id: "afterpay",
        name: "Afterpay",
        src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b63289b68c.svg",
        category: "payment"
      },
      {
        id: "alipay",
        name: "Alipay",
        src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b63289ca4c.svg",
        category: "payment"
      },
      {
        id: "amazon",
        name: "Amazon",
        src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b63289e0ea.svg",
        category: "payment"
      },
      {
        id: "amazon-pay",
        name: "Amazon Pay",
        src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b63289f009.svg",
        category: "payment"
      },
      {
        id: "amazon-pay-2",
        name: "Amazon Pay Alt",
        src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b6328a016e.svg",
        category: "payment"
      },
      {
        id: "amazon-pay-minified",
        name: "Amazon Pay Mini",
        src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b6328a11c1.svg",
        category: "payment"
      },
      {
        id: "amazon-pay-minified-1",
        name: "Amazon Pay Mini 2",
        src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b6328a2518.svg",
        category: "payment"
      },
      {
        id: "american-express",
        name: "American Express",
        src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b6328a33d8.svg",
        category: "payment"
      },
      {
        id: "american-express-color",
        name: "American Express Color",
        src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b6328a47d7.svg",
        category: "payment"
      },
      {
        id: "amex-minified",
        name: "Amex Mini",
        src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b6328a7232.svg",
        category: "payment"
      },
      {
        id: "amex-minified-1",
        name: "Amex Mini 2",
        src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b6328a9177.svg",
        category: "payment"
      },
      {
        id: "apple-pay",
        name: "Apple Pay",
        src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b6328a9b8e.svg",
        category: "payment"
      },
      {
        id: "apple-pay-2",
        name: "Apple Pay Alt",
        src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b6328ab2f8.svg",
        category: "payment"
      },
      {
        id: "authorize",
        name: "Authorize.Net",
        src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b6328ac881.svg",
        category: "payment"
      },
      {
        id: "bancontact",
        name: "Bancontact",
        src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b6328ade7e.svg",
        category: "payment"
      },
      {
        id: "bancontact-1",
        name: "Bancontact Alt",
        src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b6328af13d.svg",
        category: "payment"
      },
      {
        id: "bancontact-2",
        name: "Bancontact 2",
        src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b6328b0501.svg",
        category: "payment"
      },
      {
        id: "barclays",
        name: "Barclays",
        src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b6328b139e.svg",
        category: "payment"
      },
      {
        id: "binance-pay",
        name: "Binance Pay",
        src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b6328b3107.svg",
        category: "payment"
      },
      {
        id: "bitcoin",
        name: "Bitcoin",
        src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b6328b8c0b.svg",
        category: "payment"
      },
      {
        id: "bitcoin-1",
        name: "Bitcoin Alt",
        src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b6328c4a12.svg",
        category: "payment"
      },
      {
        id: "bitcoin-cash",
        name: "Bitcoin Cash",
        src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b6328c8370.svg",
        category: "payment"
      },
      {
        id: "bitpay",
        name: "BitPay",
        src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b6328c98fc.svg",
        category: "payment"
      },
      {
        id: "bitpay-1",
        name: "BitPay Alt",
        src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b6328cbf71.svg",
        category: "payment"
      },
      {
        id: "ach",
        name: "ACH",
        src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b6328cd8a8.svg",
        category: "payment"
      },
      {
        id: "braintree",
        name: "Braintree",
        src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b6328d1339.svg",
        category: "payment"
      },
      {
        id: "citadele",
        name: "Citadele",
        src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b6328e9b40.svg",
        category: "payment"
      },
      {
        id: "coinbase",
        name: "Coinbase",
        src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b6328ea858.svg",
        category: "payment"
      },
      // Keep original icons for backward compatibility
      {
        id: "stripe",
        name: "Stripe",
        src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b68ffe926d.svg",
        category: "payment"
      },
      {
        id: "opay",
        name: "OPay", 
        src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b632915548.svg",
        category: "payment"
      },
      {
        id: "visa",
        name: "Visa",
        src: "https://d3azqz9xba9gwd.cloudfront.net/storage/icon-gallery/668b68521f50c.svg",
        category: "payment"
      }
    ],
    security: [
      {
        id: "ssl",
        name: "SSL Secure",
        src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzAwQUY1NCIvPgo8dGV4dCB4PSIyMCIgeT0iMTYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U1NMPC90ZXh0Pgo8L3N2Zz4K",
        category: "security"
      },
      {
        id: "verified",
        name: "Verified",
        src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzAwN0RGRiIvPgo8dGV4dCB4PSIyMCIgeT0iMTYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI3IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VkVSSUZJRUQ8L3RleHQ+Cjwvc3ZnPgo=",
        category: "security"
      }
    ],
    shipping: [
      {
        id: "free-shipping",
        name: "Free Shipping",
        src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iI0ZGNkIzNSIvPgo8dGV4dCB4PSIyMCIgeT0iMTYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI3IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RlJFRTwvdGV4dD4KPC9zdmc+Cg==",
        category: "shipping"
      },
      {
        id: "fast-delivery",
        name: "Fast Delivery",
        src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzlDNERDQyIvPgo8dGV4dCB4PSIyMCIgeT0iMTYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI3IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RkFTVDwvdGV4dD4KPC9zdmc+Cg==",
        category: "shipping"
      }
    ]
  };

  const getAllIcons = () => {
    // Combine all icons from all categories into one array
    const allIcons = [
      ...iconLibrary.payment,
      ...iconLibrary.security,
      ...iconLibrary.shipping
    ];
    
    if (!searchQuery) return allIcons;
    
    return allIcons.filter(icon => 
      icon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleIconSelect = (icon: any) => {
    onSelect({
      ...icon,
      id: `${icon.id}-${Date.now()}` // Ensure unique ID
    });
  };

  return (
    <div 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          maxWidth: "800px",
          width: "100%",
          maxHeight: "80vh",
          overflow: "hidden",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }}
      >
        {/* Header */}
        <div style={{
          padding: "20px",
          borderBottom: "1px solid #e1e5e9",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <Text as="h2" variant="headingMd">
            Icon Library
          </Text>
          <Button onClick={onClose} variant="plain">
            ✕
          </Button>
        </div>

        {/* Content */}
        <div style={{ padding: "20px", overflowY: "auto", maxHeight: "calc(80vh - 80px)" }}>
          <BlockStack gap="400">
            {/* Search */}
            <TextField
              label="Search icons"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for icons..."
              autoComplete="off"
            />

            {/* Icon Grid - All Icons */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
              gap: "12px",
              maxHeight: "500px",
              overflowY: "auto"
            }}>
              {getAllIcons().map((icon) => (
                <Card key={icon.id} padding="200">
                  <div 
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      padding: "8px",
                      borderRadius: "4px"
                    }}
                    onClick={() => handleIconSelect(icon)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f6f6f7";
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <img
                      src={icon.src}
                      alt={icon.name}
                      style={{
                        width: "40px",
                        height: "auto",
                        objectFit: "contain",
                        maxHeight: "40px"
                      }}
                    />
                    <Text as="p" variant="bodyXs" alignment="center">
                      {icon.name}
                    </Text>
                  </div>
                </Card>
              ))}
            </div>

            {getAllIcons().length === 0 && (
              <div style={{
                textAlign: "center",
                padding: "40px",
                color: "#637381"
              }}>
                <Text as="p">
                  {searchQuery ? "No icons found matching your search." : "No icons available."}
                </Text>
              </div>
            )}
          </BlockStack>
        </div>
      </div>
    </div>
  );
};

export default IconLibraryModal;
