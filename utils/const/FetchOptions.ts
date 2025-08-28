export const getPostOptions = (data: any, storeId?: string, sessionToken?: string) => {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  
  if (storeId) {
    headers["x-shopify-storefront-id"] = storeId;
  }
  
  if (sessionToken) {
    headers["Authorization"] = `Bearer ${sessionToken}`;
  }

  return {
    headers,
    method: "POST",
    body: JSON.stringify(data),
  };
};

export const getGetOptions = (storeId?: string, sessionToken?: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (storeId) {
    headers["x-shopify-storefront-id"] = storeId;
  }
  
  if (sessionToken) {
    headers["Authorization"] = `Bearer ${sessionToken}`;
  }

  return {
    method: "GET",
    headers,
  };
};
