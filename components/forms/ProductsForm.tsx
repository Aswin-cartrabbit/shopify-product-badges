import {
  Card,
  BlockStack,
  Text,
  Button,
  Select,
  RadioButton,
  Divider,
  Bleed,
  InlineStack,
  Tooltip,
  Icon,
} from "@shopify/polaris";
import { QuestionCircleIcon } from "@shopify/polaris-icons";
import { useBadgeStore } from "@/stores/BadgeStore";

interface ProductsFormProps {
  data?: any;
  onChange?: (data: any) => void;
  type?: string;
}

const ProductsForm = ({ data, onChange, type = "BADGE" }: ProductsFormProps) => {
  const { badge, updateDisplay } = useBadgeStore();

  const handleDisplayChange = (key: any, value: any) => {
    updateDisplay(key, value);
    if (onChange) {
      onChange({ [key]: value });
    }
  };

  const visibilityOptions = [
    { label: "All products", value: "all" },
    { label: "Specific products", value: "specific" },
    { label: "Product collections", value: "collections" },
  ];

  const TooltipIcon = ({ content }) => (
    <Tooltip content={content}>
      <Icon source={QuestionCircleIcon} tone="subdued" />
    </Tooltip>
  );

  return (
    <Card>
      <BlockStack gap="400">
        <InlineStack gap="100" align="start">
          <Text variant="headingMd" as="h2">
            Product Selection
          </Text>
          <TooltipIcon content="Choose which products will display this badge" />
        </InlineStack>

        <BlockStack gap="200">
          <Text as="p" variant="bodyMd" tone="subdued">
            Where should this {type.toLowerCase()} appear?
          </Text>
          
          <RadioButton
            label="All products (Show on every product)"
            checked={badge.display.visibility === "all"}
            id="all"
            name="visibility"
            onChange={() => handleDisplayChange("visibility", "all")}
            helpText="Badge will appear on all products in your store"
          />
          
          <RadioButton
            label="Specific products (Choose individual products)"
            checked={badge.display.visibility === "specific"}
            id="specific" 
            name="visibility"
            onChange={() => handleDisplayChange("visibility", "specific")}
            helpText="Select specific products to show this badge"
          />
          
          <RadioButton
            label="Product collections (Show on collection pages)"
            checked={badge.display.visibility === "collections"}
            id="collections"
            name="visibility"
            onChange={() => handleDisplayChange("visibility", "collections")}
            helpText="Badge will appear on products within selected collections"
          />
        </BlockStack>

        {(badge.display.visibility === "specific" || badge.display.visibility === "collections") && (
          <BlockStack gap="200">
            <Text as="p" variant="bodyMd">
              {badge.display.visibility === "specific" ? "Select Products" : "Select Collections"}
            </Text>
            <Button fullWidth>
              {badge.display.visibility === "specific" 
                ? "Choose Products" 
                : "Choose Collections"}
            </Button>
            <Text as="p" variant="bodySm" tone="subdued">
              {badge.display.resourceIds?.length || 0} selected
            </Text>
          </BlockStack>
        )}

        <Bleed marginInline="400">
          <Divider />
        </Bleed>

        <InlineStack gap="100" align="start">
          <Text variant="headingMd" as="h2">
            Display Rules
          </Text>
          <TooltipIcon content="Set conditions for when this badge should be visible" />
        </InlineStack>

        <BlockStack gap="200">
          <Text as="p" variant="bodyMd" tone="subdued">
            Additional conditions (optional)
          </Text>
          
          <Button fullWidth variant="secondary">
            Add condition
          </Button>
          
          <Text as="p" variant="bodySm" tone="subdued">
            Examples: Show only when product is on sale, out of stock, new arrival, etc.
          </Text>
        </BlockStack>

        <Bleed marginInline="400">
          <Divider />
        </Bleed>

        <Text as="p" variant="bodySm" tone="subdued">
          Advanced product targeting available with Pro plan.{" "}
          <a href="#" style={{ color: "blue" }}>
            Upgrade now.
          </a>
        </Text>
      </BlockStack>
    </Card>
  );
};

export default ProductsForm;
