import ReviewBanner from "@/components/banners/ReviewBanner";
import isInitialLoad from "@/utils/middleware/isInitialLoad";
import {
  Page,
  Card,
  Text,
  Button,
  BlockStack,
  InlineStack,
  Icon,
  TextField,
  Tooltip,
} from "@shopify/polaris";
import {
  SearchIcon,
  InfoIcon,
  StarFilledIcon,
  DiscountIcon,
  CheckIcon,
  NotificationIcon,
} from "@shopify/polaris-icons";
import { useRouter } from "next/router";
import { useState } from "react";

export async function getServerSideProps(context) {
  //DO NOT REMOVE THIS.
  return await isInitialLoad(context);
}
export default function Dashboard() {
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  const activeElements = [
    {
      id: "1",
      title: "Labels",
      subtitle: "Create label",
      icon: StarFilledIcon,
      iconBg: "#E3F2FD",
      iconColor: "#1976D2",
      onClick: () => router.push("/labels/create"),
      tooltip:
        "Create custom labels for your products to highlight features, promotions, or categories.",
    },
    {
      id: "2",
      title: "Badges",
      subtitle: "Create badge",
      icon: DiscountIcon,
      iconBg: "#E3F2FD",
      iconColor: "#1976D2",
      onClick: () => router.push("/badges/create"),
      tooltip:
        "Design eye-catching badges to showcase discounts, new arrivals, or special offers.",
    },
    {
      id: "3",
      title: "Trust badges",
      subtitle: "Create trust badge",
      icon: CheckIcon,
      iconBg: "#E3F2FD",
      iconColor: "#1976D2",
      onClick: () => router.push("/trust-badges"),
      tooltip:
        "Build customer confidence with trust badges showing security, guarantees, or certifications.",
    },
    {
      id: "4",
      title: "Banners",
      subtitle: "Create banner",
      icon: NotificationIcon,
      iconBg: "#E3F2FD",
      iconColor: "#1976D2",
      onClick: () => router.push("/banners"),
      tooltip:
        "Create promotional banners to announce sales, free shipping, or important notifications.",
    },
  ];

  const recommendedApps = [
    {
      id: "1",
      name: "Retainful",
      description:
        "Drive more revenue with connected email, SMS, and WhatsApp marketing automation that turn one-time buyers into repeat customers. All in one platform. Zero extra work.",
      src: "https://www.retainful.com/wp-content/uploads/2025/02/retainful-logo.png",
      link: "Try Retainful Free",
      href: "https://retainful.com",
    },
    {
      id: "2",
      name: "Afflr",
      description:
        "The best Shopify affiliate marketing app to launch affiliate & referral programs in minutes. Automate sign-ups, track sales and commissions, and manage payouts easily.",
      src: "https://afflr.io/wp-content/uploads/2024/03/cropped-Afflr-Favicon.png",
      link: "Try Afflr Free",
      href: "https://afflr.io",
    },
    {
      id: "3",
      name: "Yoko",
      description:
        "Unify your customer engagement with one platform. Collect reviews, reward loyalty, and drive referrals – all without extra apps or complex setups.",
      src: "https://yuko.so/wp-content/uploads/2025/06/Yuko-Fav-Icon.png",
      link: "Try Yoko Free",
      href: "https://yoko.so",
    },
  ];

  return (
    <div
      style={{
        padding: "20px 24px",
        backgroundColor: "#f6f6f7",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <InlineStack align="space-between" blockAlign="center">
            <Text as="h1" variant="headingXl" fontWeight="medium">
              Hello pt4cik-g2
            </Text>
            <Text as="span" tone="subdued">
              Free plan
            </Text>
          </InlineStack>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: "28px" }}>
          <TextField
            label=""
            labelHidden
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Search feature or solution"
            prefix={<Icon source={SearchIcon} />}
            autoComplete="off"
          />
        </div>

        {/* Active Elements Section */}
        <Card padding="500">
          <BlockStack gap="400">
            <Text as="h2" variant="headingLg" fontWeight="medium">
              Active elements
            </Text>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "12px",
                width: "100%",
              }}
            >
              {activeElements.map((element) => (
                <Card key={element.id} padding="400">
                  <InlineStack align="space-between" blockAlign="center">
                    <InlineStack gap="300" blockAlign="center">
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          backgroundColor: element.iconBg,
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon source={element.icon} tone="base" />
                      </div>
                      <BlockStack gap="100">
                        <Text as="h3" variant="bodyMd" fontWeight="semibold">
                          {element.title}
                        </Text>
                        <Button
                          variant="plain"
                          onClick={element.onClick}
                          textAlign="left"
                        >
                          {element.subtitle}
                        </Button>
                      </BlockStack>
                    </InlineStack>
                    <div style={{ alignSelf: "flex-start" }}>
                      <Tooltip content={element.tooltip}>
                        <Icon source={InfoIcon} tone="subdued" />
                      </Tooltip>
                    </div>
                  </InlineStack>
                </Card>
              ))}
            </div>
          </BlockStack>
        </Card>

        {/* Marketing/Recommended Apps Section */}
        <div style={{ marginTop: "24px" }}>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingLg" fontWeight="medium">
                Recommended apps
              </Text>
              <InlineStack gap="100" blockAlign="center" align="space-evenly">
                {recommendedApps.map((item) => {
                  const { id, name, description, link, href } = item;
                  return (
                    <div
                      key={id}
                      style={{
                        width: "30%",
                      }}
                    >
                      <Card>
                        <BlockStack gap="200">
                          <InlineStack align="start" gap="300" wrap={false}>
                            <img
                              src={item.src}
                              alt=""
                              style={{ width: "32px", height: "30px" }}
                            />
                            <Text
                              fontWeight="semibold"
                              as="p"
                              alignment="start"
                            >
                              {name}
                            </Text>
                          </InlineStack>
                          <Text tone="subdued" as="p">
                            {description}
                          </Text>
                          <Button
                            variant="plain"
                            onClick={() => window.open(href, "_blank")}
                          >
                            {link}
                          </Button>
                        </BlockStack>
                      </Card>
                    </div>
                  );
                })}
              </InlineStack>
            </BlockStack>
          </Card>
        </div>
      </div>
    </div>
  );
}
