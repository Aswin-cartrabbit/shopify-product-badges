export const getPostOptions = (data: any, storeId: string) => {
  return {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-shopify-storefront-id": storeId,
    },
    method: "POST",
    body: JSON.stringify(data),
  };
};

export const getGetOptions = (storeId: string) => {
  return {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-shopify-storefront-id": storeId,
    },
  };
};
