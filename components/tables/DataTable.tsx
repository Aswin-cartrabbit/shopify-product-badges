import { useSessionStore } from "@/stores/sessionStore";
import { getGetOptions } from "@/utils/const/FetchOptions";
import {
  Badge,
  Button,
  ButtonGroup,
  ChoiceList,
  EmptyState,
  Frame,
  Icon,
  IndexFilters,
  IndexTable,
  LegacyCard,
  Pagination,
  Spinner,
  Text,
  TextField,
  Toast,
  useIndexResourceState,
  useSetIndexFiltersMode,
} from "@shopify/polaris";

import { DeleteIcon, EditIcon } from "@shopify/polaris-icons";

import { useCallback, useEffect, useState } from "react";

export function DataTable() {
  // Utility functions
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const isEmpty = (value) => {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === "" || value == null;
    }
  };

  const disambiguateLabel = (key, value) => {
    switch (key) {
      case "componentType":
        return value.map((val) => `Type: ${val}`).join(", ");
      case "componentStatus":
        return value.map((val) => `Status: ${val}`).join(", ");
      case "publishedStatus":
        return `Published: ${value === "true" ? "Yes" : "No"}`;
      case "taggedWith":
        return `Name contains: ${value}`;
      default:
        return value;
    }
  };
  const { storeId } = useSessionStore();
  // State management
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [pageSize] = useState(20);

  // Filter tabs state
  const [itemStrings, setItemStrings] = useState([
    "All Components",
    "Active",
    "Published",
    "Draft",
    "Badges",
    "Banners",
  ]);
  const [selected, setSelected] = useState(0);

  // IndexFilters state
  const { mode, setMode }: any = useSetIndexFiltersMode();
  const [sortSelected, setSortSelected] = useState(["createdAt desc"]);
  const [queryValue, setQueryValue] = useState("");

  // Filter states
  const [componentType, setComponentType] = useState(undefined);
  const [componentStatus, setComponentStatus] = useState(undefined);
  const [publishedStatus, setPublishedStatus] = useState(undefined);
  const [taggedWith, setTaggedWith] = useState("");

  // Resource state for selection
  const resourceName = {
    singular: "component",
    plural: "components",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(components);

  // Tab management functions
  const deleteView = (index) => {
    const newItemStrings = [...itemStrings];
    newItemStrings.splice(index, 1);
    setItemStrings(newItemStrings);
    setSelected(0);
  };

  const duplicateView = async (name) => {
    setItemStrings([...itemStrings, name]);
    setSelected(itemStrings.length);
    await sleep(1);
    return true;
  };

  const onCreateNewView = async (value) => {
    await sleep(500);
    setItemStrings([...itemStrings, value]);
    setSelected(itemStrings.length);
    return true;
  };

  // Tab configuration
  const tabs: any = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => {},
    id: `${item}-${index}`,
    isLocked: index === 0,
    actions:
      index === 0
        ? []
        : [
            {
              type: "rename",
              onAction: () => {},
              onPrimaryAction: async (value) => {
                const newItemsStrings = tabs.map((item, idx) => {
                  if (idx === index) {
                    return value;
                  }
                  return item.content;
                });
                await sleep(1);
                setItemStrings(newItemsStrings);
                return true;
              },
            },
            {
              type: "duplicate",
              onPrimaryAction: async (value) => {
                await sleep(1);
                duplicateView(value);
                return true;
              },
            },
            {
              type: "edit",
            },
            {
              type: "delete",
              onPrimaryAction: async () => {
                await sleep(1);
                deleteView(index);
                return true;
              },
            },
          ],
  }));

  // Sort options configuration
  const sortOptions: any = [
    { label: "Name", value: "name asc", directionLabel: "A-Z" },
    { label: "Name", value: "name desc", directionLabel: "Z-A" },
    {
      label: "Created Date",
      value: "createdAt asc",
      directionLabel: "Oldest first",
    },
    {
      label: "Created Date",
      value: "createdAt desc",
      directionLabel: "Newest first",
    },
    {
      label: "Updated Date",
      value: "updatedAt asc",
      directionLabel: "Oldest first",
    },
    {
      label: "Updated Date",
      value: "updatedAt desc",
      directionLabel: "Newest first",
    },
    { label: "Type", value: "type asc", directionLabel: "A-Z" },
    { label: "Type", value: "type desc", directionLabel: "Z-A" },
    { label: "Status", value: "status asc", directionLabel: "A-Z" },
    { label: "Status", value: "status desc", directionLabel: "Z-A" },
  ];

  // Primary action configuration
  const onHandleCancel = () => {
    setMode("DEFAULT");
  };

  const onHandleSave = async () => {
    await sleep(1);
    return true;
  };

  const primaryAction: any =
    selected === 0
      ? {
          type: "save-as",
          onAction: onCreateNewView,
          disabled: false,
          loading: false,
        }
      : {
          type: "save",
          onAction: onHandleSave,
          disabled: false,
          loading: false,
        };

  // Filter handlers
  const handleComponentTypeChange = useCallback(
    (value) => setComponentType(value),
    []
  );

  const handleComponentStatusChange = useCallback(
    (value) => setComponentStatus(value),
    []
  );

  const handlePublishedStatusChange = useCallback(
    (value) => setPublishedStatus(value),
    []
  );

  const handleTaggedWithChange = useCallback(
    (value) => setTaggedWith(value),
    []
  );

  const handleFiltersQueryChange = useCallback(
    (value) => setQueryValue(value),
    []
  );

  // Filter remove handlers
  const handleComponentTypeRemove = useCallback(
    () => setComponentType(undefined),
    []
  );

  const handleComponentStatusRemove = useCallback(
    () => setComponentStatus(undefined),
    []
  );

  const handlePublishedStatusRemove = useCallback(
    () => setPublishedStatus(undefined),
    []
  );

  const handleTaggedWithRemove = useCallback(() => setTaggedWith(""), []);

  const handleQueryValueRemove = useCallback(() => setQueryValue(""), []);
  console.log({ storeId });

  const handleFiltersClearAll = useCallback(() => {
    handleComponentTypeRemove();
    handleComponentStatusRemove();
    handlePublishedStatusRemove();
    handleTaggedWithRemove();
    handleQueryValueRemove();
    setCurrentPage(1);
  }, [
    handleComponentTypeRemove,
    handleComponentStatusRemove,
    handlePublishedStatusRemove,
    handleTaggedWithRemove,
    handleQueryValueRemove,
  ]);

  // API call function
  const fetchComponents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [sortField, sortDirection] = sortSelected[0].split(" ");
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        sortBy: sortField,
        sortOrder: sortDirection,
      });

      // Add filters based on current tab and applied filters
      if (selected === 1) params.append("status", "ACTIVE"); // Active tab
      // if (selected === 2) params.append("isPublished", "true"); // Published tab
      // if (selected === 3) params.append("isPublished", "false"); // Draft tab
      if (selected === 4) params.append("type", "BADGE"); // Badges tab
      if (selected === 5) params.append("type", "BANNER"); // Banners tab

      // Add applied filters
      if (componentType && !isEmpty(componentType)) {
        componentType.forEach((type) => params.append("type", type));
      }
      if (componentStatus && !isEmpty(componentStatus)) {
        componentStatus.forEach((status) => params.append("status", status));
      }
      if (publishedStatus) {
        params.append("isPublished", publishedStatus);
      }
      if (queryValue) {
        params.append("search", queryValue);
      }

      const response = await fetch(
        `/api/badge?${params}`,
        getGetOptions(storeId)
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch components");
      }

      if (data.error) {
        throw new Error(data.message);
      }

      setComponents(data.data.components);
      setCurrentPage(data.data.pagination.currentPage);
      setTotalPages(data.data.pagination.totalPages);
      setTotalCount(data.data.pagination.totalCount);
      setHasNextPage(data.data.pagination.hasNextPage);
      setHasPreviousPage(data.data.pagination.hasPreviousPage);
    } catch (err) {
      setError(err.message);
      setToast({
        content: `Error: ${err.message}`,
        error: true,
      });
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    pageSize,
    sortSelected,
    selected,
    componentType,
    componentStatus,
    publishedStatus,
    queryValue,
  ]);

  // Effect to fetch data
  useEffect(() => {
    fetchComponents();
  }, [fetchComponents]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selected, componentType, componentStatus, publishedStatus, queryValue]);

  // Pagination handlers
  const handlePreviousPage = useCallback(() => {
    if (hasPreviousPage) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage, hasPreviousPage]);

  const handleNextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, hasNextPage]);

  // Filters configuration
  const filters = [
    {
      key: "componentType",
      label: "Component Type",
      filter: (
        <ChoiceList
          title="Component Type"
          titleHidden
          choices={[
            { label: "Badge", value: "BADGE" },
            { label: "Banner", value: "BANNER" },
            { label: "Button", value: "BUTTON" },
            { label: "Modal", value: "MODAL" },
            { label: "Popup", value: "POPUP" },
          ]}
          selected={componentType || []}
          onChange={handleComponentTypeChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: "componentStatus",
      label: "Status",
      filter: (
        <ChoiceList
          title="Component Status"
          titleHidden
          choices={[
            { label: "Active", value: "ACTIVE" },
            { label: "Inactive", value: "INACTIVE" },
            { label: "Draft", value: "DRAFT" },
          ]}
          selected={componentStatus || []}
          onChange={handleComponentStatusChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    // {
    //   key: "publishedStatus",
    //   label: "Published Status",
    //   filter: (
    //     <ChoiceList
    //       title="Published Status"
    //       titleHidden
    //       choices={[
    //         { label: "Published", value: "true" },
    //         { label: "Draft", value: "false" },
    //       ]}
    //       selected={publishedStatus ? [publishedStatus] : []}
    //       onChange={handlePublishedStatusChange}
    //     />
    //   ),
    // },
    {
      key: "taggedWith",
      label: "Name contains",
      filter: (
        <TextField
          label="Name contains"
          value={taggedWith}
          onChange={handleTaggedWithChange}
          autoComplete="off"
          labelHidden
          placeholder="Search by name..."
        />
      ),
      shortcut: true,
    },
  ];

  // Applied filters
  const appliedFilters = [];
  if (componentType && !isEmpty(componentType)) {
    appliedFilters.push({
      key: "componentType",
      label: disambiguateLabel("componentType", componentType),
      onRemove: handleComponentTypeRemove,
    });
  }
  if (componentStatus && !isEmpty(componentStatus)) {
    appliedFilters.push({
      key: "componentStatus",
      label: disambiguateLabel("componentStatus", componentStatus),
      onRemove: handleComponentStatusRemove,
    });
  }
  if (publishedStatus) {
    appliedFilters.push({
      key: "publishedStatus",
      label: disambiguateLabel("publishedStatus", publishedStatus),
      onRemove: handlePublishedStatusRemove,
    });
  }
  if (!isEmpty(taggedWith)) {
    appliedFilters.push({
      key: "taggedWith",
      label: disambiguateLabel("taggedWith", taggedWith),
      onRemove: handleTaggedWithRemove,
    });
  }

  // Helper functions for badges
  const getStatusBadge = (status) => {
    const statusConfig = {
      ACTIVE: { progress: "complete", children: "Active" },
      INACTIVE: { progress: "incomplete", children: "Inactive" },
      DRAFT: { progress: "partiallyComplete", children: "Draft" },
    };
    return (
      <Badge {...statusConfig[status]}>
        {statusConfig[status]?.children || status}
      </Badge>
    );
  };

  const getPublishedBadge = (isPublished) => {
    if (isPublished) {
      return <Badge progress="complete">Published</Badge>;
    }
    return <Badge>Draft</Badge>;
  };

  const getTypeBadge = (type) => {
    const typeColors = {
      BADGE: "info",
      BANNER: "success",
      BUTTON: "warning",
      MODAL: "critical",
      POPUP: "info",
    };
    return <Badge tone={typeColors[type] || "info"}>{type}</Badge>;
  };

  // Table rows
  const rowMarkup = components.map((component, index) => (
    <IndexTable.Row
      id={component.id}
      key={component.id}
      selected={selectedResources.includes(component.id)}
      position={index}
    >
      <IndexTable.Cell>
        <Text variant="bodyMd" fontWeight="semibold" as="span">
          {component.name}
        </Text>
        {component.description && (
          <Text variant="bodySm" tone="subdued" as="p">
            {component.description}
          </Text>
        )}
      </IndexTable.Cell>
      <IndexTable.Cell>{getTypeBadge(component.type)}</IndexTable.Cell>
      <IndexTable.Cell>{getStatusBadge(component.status)}</IndexTable.Cell>
      {/* <IndexTable.Cell>
        {getPublishedBadge(component.isPublished)}
      </IndexTable.Cell> */}
      <IndexTable.Cell>
        <Text as="span" alignment="center" numeric>
          {component.impressions?.toLocaleString() || 0}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" alignment="center" numeric>
          {component.clicks?.toLocaleString() || 0}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text variant="bodySm" tone="subdued" as="p">
          {new Date(component.createdAt).toLocaleDateString()}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <ButtonGroup>
          <div>
            <Icon source={EditIcon} tone="base" />
          </div>
          <div>
            <Icon source={DeleteIcon} tone="base" />
          </div>
        </ButtonGroup>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  // Loading state
  if (loading && components.length === 0) {
    return (
      <LegacyCard>
        <div style={{ padding: "40px", textAlign: "center" }}>
          <Spinner accessibilityLabel="Loading components" size="large" />
          <Text variant="bodyMd" tone="subdued" as="p">
            Loading visual components...
          </Text>
        </div>
      </LegacyCard>
    );
  }
  // Error state
  if (error && components.length === 0) {
    return (
      <LegacyCard>
        <EmptyState
          heading="Unable to load components"
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          action={{
            content: "Try again",
            onAction: fetchComponents,
          }}
        >
          <p>{error}</p>
        </EmptyState>
      </LegacyCard>
    );
  }

  // Empty state
  if (!loading && components.length === 0) {
    return (
      <LegacyCard>
        <IndexFilters
          sortOptions={sortOptions}
          sortSelected={sortSelected}
          queryValue={queryValue}
          queryPlaceholder="Search components..."
          onQueryChange={handleFiltersQueryChange}
          onQueryClear={() => setQueryValue("")}
          onSort={setSortSelected}
          primaryAction={primaryAction}
          cancelAction={{
            onAction: onHandleCancel,
            disabled: false,
            loading: false,
          }}
          tabs={tabs}
          selected={selected}
          onSelect={setSelected}
          canCreateNewView
          onCreateNewView={onCreateNewView}
          filters={filters}
          appliedFilters={appliedFilters}
          onClearAll={handleFiltersClearAll}
          mode={mode}
          setMode={setMode}
        />
        <EmptyState
          heading="No visual components found"
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          action={{
            content: "Create component",
            onAction: () => {
              // Navigate to create component page
            },
          }}
        >
          <p>
            Start by creating your first visual component or adjust your
            filters.
          </p>
        </EmptyState>
      </LegacyCard>
    );
  }

  return (
    <Frame>
      {toast && (
        <Toast
          content={toast.content}
          error={toast.error}
          onDismiss={() => setToast(null)}
        />
      )}

      <LegacyCard>
        <IndexFilters
          sortOptions={sortOptions}
          sortSelected={sortSelected}
          queryValue={queryValue}
          queryPlaceholder="Search components..."
          onQueryChange={handleFiltersQueryChange}
          onQueryClear={() => setQueryValue("")}
          onSort={setSortSelected}
          primaryAction={primaryAction}
          cancelAction={{
            onAction: onHandleCancel,
            disabled: false,
            loading: false,
          }}
          tabs={tabs}
          selected={selected}
          onSelect={setSelected}
          canCreateNewView
          onCreateNewView={onCreateNewView}
          filters={filters}
          appliedFilters={appliedFilters}
          onClearAll={handleFiltersClearAll}
          mode={mode}
          setMode={setMode}
          loading={loading}
        />

        <IndexTable
          resourceName={resourceName}
          itemCount={components.length}
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          loading={loading}
          headings={[
            { title: "Name" },
            { title: "Type" },
            { title: "Status" },
            // { title: "Published" },
            { title: "Impressions", alignment: "center" },
            { title: "Clicks", alignment: "center" },
            { title: "Created" },
            {
              title: "Actions",
            },
          ]}
          promotedBulkActions={[
            {
              content: "Activate",
              onAction: () => console.log("Activate selected"),
            },
            {
              content: "Publish",
              onAction: () => console.log("Publish selected"),
            },
          ]}
          bulkActions={[
            {
              content: "Deactivate",
              onAction: () => console.log("Deactivate selected"),
            },
            {
              content: "Unpublish",
              onAction: () => console.log("Unpublish selected"),
            },
            {
              content: "Duplicate",
              onAction: () => console.log("Duplicate selected"),
            },
            {
              content: "Delete",
              onAction: () => console.log("Delete selected"),
              // destructive: true,
            },
          ]}
        >
          {rowMarkup}
        </IndexTable>

        {/* Custom Pagination Footer */}
        {totalPages > 1 && (
          <div
            style={{
              padding: "16px 20px",
              borderTop: "1px solid #e1e3e5",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text variant="bodySm" tone="subdued" as="p">
              Showing {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, totalCount)} of{" "}
              {totalCount.toLocaleString()} components
            </Text>

            <Pagination
              hasPrevious={hasPreviousPage}
              onPrevious={handlePreviousPage}
              hasNext={hasNextPage}
              onNext={handleNextPage}
              label={`Page ${currentPage} of ${totalPages}`}
            />
          </div>
        )}
      </LegacyCard>
    </Frame>
  );
}
