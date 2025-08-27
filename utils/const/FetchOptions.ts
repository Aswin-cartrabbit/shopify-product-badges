export const getPostOptions = (data: any) => {
  return {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  };
};

export const getGetOptions = () => {
  return {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
};
