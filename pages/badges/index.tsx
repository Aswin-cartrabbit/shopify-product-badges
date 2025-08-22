import React from "react";
import {
  IndexTable,
  Page,
  Card,
  Button,
  Badge,
  Text,
  useIndexResourceState,
  InlineStack,
  BlockStack,
} from "@shopify/polaris";
import { useRouter } from "next/router";
import { BadgeBuilder } from "@/components/forms/badgeCreateForm";

const index = () => {
  const router = useRouter();

  const orders = [
    {
      id: "1020",
      order: "#1020",
      date: "Jul 20 at 4:34pm",
      customer: "Jaydon Stanton",
      total: "$969.44",
      paymentStatus: <Badge tone="success">Paid</Badge>,
      fulfillmentStatus: <Badge tone="attention">Unfulfilled</Badge>,
    },
    {
      id: "1019",
      order: "#1019",
      date: "Jul 20 at 3:46pm",
      customer: "Ruben Westerfelt",
      total: "$701.19",
      paymentStatus: <Badge tone="warning">Partially paid</Badge>,
      fulfillmentStatus: <Badge tone="attention">Unfulfilled</Badge>,
    },
    {
      id: "1018",
      order: "#1018",
      date: "Jul 20 at 3.44pm",
      customer: "Leo Carder",
      total: "$798.24",
      paymentStatus: <Badge tone="success">Paid</Badge>,
      fulfillmentStatus: <Badge tone="attention">Unfulfilled</Badge>,
    },
  ];

  const resourceName = {
    singular: "order",
    plural: "orders",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(orders);

  const rowMarkup = orders.map(
    (
      { id, order, date, customer, total, paymentStatus, fulfillmentStatus },
      index
    ) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="semibold" as="span">
            {order}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{date}</IndexTable.Cell>
        <IndexTable.Cell>{customer}</IndexTable.Cell>
        <IndexTable.Cell>
          <Text as="span" alignment="end" numeric>
            {total}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{paymentStatus}</IndexTable.Cell>
        <IndexTable.Cell>{fulfillmentStatus}</IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  return (
    <Page
      title="Badges"
      primaryAction={{
        content: "Create badge",
        onAction: () => router.push("/badges/new"),
      }}
    >
      <BlockStack gap="400">
        <Card>
          <IndexTable
            resourceName={resourceName}
            itemCount={orders.length}
            selectedItemsCount={
              allResourcesSelected ? "All" : selectedResources.length
            }
            onSelectionChange={handleSelectionChange}
            headings={[
              { title: "Order" },
              { title: "Date" },
              { title: "Customer" },
              { title: "Total", alignment: "end" },
              { title: "Payment status" },
              { title: "Fulfillment status" },
            ]}
          >
            {rowMarkup}
          </IndexTable>
        </Card>
        {/* 
        <Card>
          <BadgeBuilder />
        </Card> */}
      </BlockStack>
    </Page>
  );
};

export default index;
