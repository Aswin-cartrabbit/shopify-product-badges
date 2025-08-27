import React, { useState } from "react";
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
  EmptyState,
  Toast,
  Frame,
  Modal,
  TextContainer,
  ButtonGroup,
  Tooltip,
  Banner,
} from "@shopify/polaris";
import { useRouter } from "next/router";
import { useBadges } from "@/components/hooks/useBadges";
import { useSubscription } from "@/components/hooks/useSubscription";

const index = () => {
  const router = useRouter();
  const { badges, loading, error, deleteBadge, duplicateBadge } = useBadges();
  const { usage, isNearLimit } = useSubscription();
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; badgeId?: string; badgeName?: string }>({ open: false });
  const [duplicateLoading, setDuplicateLoading] = useState<string | null>(null);

  const resourceName = {
    singular: "badge",
    plural: "badges",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(badges as unknown as { [key: string]: unknown }[]);

  const getBadgeStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge tone="success">Active</Badge>;
      case "DRAFT":
        return <Badge tone="attention">Draft</Badge>;
      case "PAUSED":
        return <Badge tone="warning">Paused</Badge>;
      case "ARCHIVED":
        return <Badge tone="critical">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getBadgeTypeBadge = (type: string) => {
    switch (type) {
      case "SINGLE_BANNER":
        return <Badge tone="info">Single Banner</Badge>;
      case "ICON_BLOCK":
        return <Badge tone="info">Icon Block</Badge>;
      case "PAYMENT_ICONS":
        return <Badge tone="info">Payment Icons</Badge>;
      case "FREE_SHIPPING_BAR":
        return <Badge tone="info">Free Shipping Bar</Badge>;
      default:
        return <Badge tone="info">{type}</Badge>;
    }
  };

  const handleDeleteBadge = async () => {
    if (!deleteModal.badgeId) return;
    
    try {
      await deleteBadge(deleteModal.badgeId);
      setToastMessage("Badge deleted successfully");
      setDeleteModal({ open: false });
    } catch (error) {
      setToastMessage("Failed to delete badge");
    }
  };

  const handleDuplicateBadge = async (badgeId: string, badgeName: string) => {
    try {
      setDuplicateLoading(badgeId);
      await duplicateBadge(badgeId, `${badgeName} (Copy)`);
      setToastMessage("Badge duplicated successfully");
    } catch (error) {
      setToastMessage("Failed to duplicate badge");
    } finally {
      setDuplicateLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const rowMarkup = badges.map((badge, index) => (
    <IndexTable.Row
      id={badge.id}
      key={badge.id}
      selected={selectedResources.includes(badge.id)}
      position={index}
    >
      <IndexTable.Cell>
        <Text variant="bodyMd" fontWeight="semibold" as="span">
          {badge.name}
        </Text>
        {badge.title && (
          <Text variant="bodySm" tone="subdued" as="p">
            {badge.title}
          </Text>
        )}
      </IndexTable.Cell>
      <IndexTable.Cell>{getBadgeTypeBadge(badge.type)}</IndexTable.Cell>
      <IndexTable.Cell>{getBadgeStatusBadge(badge.status)}</IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" alignment="end" numeric>
          {badge.totalAnalytics?.views || 0}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" alignment="end" numeric>
          {badge.totalAnalytics?.clicks || 0}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" alignment="end" numeric>
          {badge.totalAnalytics?.ctr || 0}%
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>{formatDate(badge.updatedAt)}</IndexTable.Cell>
      <IndexTable.Cell>
        <ButtonGroup>
          <Button
            size="slim"
            onClick={() => router.push(`/badges/create?id=${badge.id}`)}
          >
            Edit
          </Button>
          <Button
            size="slim"
            loading={duplicateLoading === badge.id}
            onClick={() => handleDuplicateBadge(badge.id, badge.name)}
          >
            Duplicate
          </Button>
          <Button
            size="slim"
            tone="critical"
            onClick={() => setDeleteModal({ 
              open: true, 
              badgeId: badge.id, 
              badgeName: badge.name 
            })}
          >
            Delete
          </Button>
        </ButtonGroup>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  const emptyStateMarkup = (
    <EmptyState
      heading="Create your first badge"
      action={{
        content: "Create badge",
        onAction: () => router.push("/badges/new"),
      }}
      image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
    >
      <p>Start by creating a badge to showcase on your product pages.</p>
    </EmptyState>
  );

  const promotionalBanner = usage && isNearLimit && (
    <Banner tone="warning">
      <InlineStack align="space-between" blockAlign="center">
        <TextContainer>
          <Text variant="headingMd" as="h3">
            You're approaching your badge limit
          </Text>
          <Text as="p">
            You've used {usage.badges.current} of {usage.badges.limit} badges. 
            Upgrade your plan to create more badges.
          </Text>
        </TextContainer>
        <Button variant="primary">Upgrade Plan</Button>
      </InlineStack>
    </Banner>
  );

  if (loading) {
    return (
      <Page title="Badges">
        <Card>
          <BlockStack gap="400">
            <div style={{ textAlign: "center", padding: "40px" }}>
              <Text as="p">Loading badges...</Text>
            </div>
          </BlockStack>
        </Card>
      </Page>
    );
  }

  if (error) {
    return (
      <Page title="Badges">
        <Banner tone="critical">
          <Text as="p">Error: {error}</Text>
        </Banner>
      </Page>
    );
  }

  return (
    <Frame>
      <Page
        title="Badges"
        primaryAction={{
          content: "Create badge",
          onAction: () => router.push("/badges/new"),
          disabled: usage ? usage.badges.current >= usage.badges.limit : false,
        }}
        subtitle={`${badges.length} badge${badges.length !== 1 ? 's' : ''}`}
      >
        <BlockStack gap="400">
          {promotionalBanner}
          
          <Card>
            {badges.length === 0 ? (
              emptyStateMarkup
            ) : (
              <IndexTable
                resourceName={resourceName}
                itemCount={badges.length}
                selectedItemsCount={
                  allResourcesSelected ? "All" : selectedResources.length
                }
                onSelectionChange={handleSelectionChange}
                headings={[
                  { title: "Name" },
                  { title: "Type" },
                  { title: "Status" },
                  { title: "Views", alignment: "end" },
                  { title: "Clicks", alignment: "end" },
                  { title: "CTR", alignment: "end" },
                  { title: "Updated" },
                  { title: "Actions" },
                ]}
                loading={loading}
              >
                {rowMarkup}
              </IndexTable>
            )}
          </Card>
        </BlockStack>
      </Page>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false })}
        title="Delete badge"
        primaryAction={{
          content: "Delete",
          destructive: true,
          onAction: handleDeleteBadge,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setDeleteModal({ open: false }),
          },
        ]}
      >
        <Modal.Section>
          <p>
            Are you sure you want to delete "{deleteModal.badgeName}"? This action cannot be undone.
          </p>
        </Modal.Section>
      </Modal>

      {/* Toast Messages */}
      {toastMessage && (
        <Toast 
          content={toastMessage} 
          onDismiss={() => setToastMessage(null)} 
        />
      )}
    </Frame>
  );
};

export default index;
