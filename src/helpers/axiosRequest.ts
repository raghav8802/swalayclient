import axios, { Method } from "axios";

interface ApiRequestParams {
  endpoint: string;
  data?: any;
  method: Method;
  headers?: Record<string, string>;
}

export const apiRequest = async ({
  endpoint,
  data,
  method,
  headers,
}: ApiRequestParams): Promise<any> => {
  try {
    const response = await axios({
      url: endpoint,
      method: method,
      data: data,
      headers: headers,
    });
    return response.data;
  } catch (error: any) {
    // Return a consistent error response format
    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.status || 500,
    };
  }
};

export const apiPost = (endpoint: string, data: any): Promise<any> => {
  const apiHeaders = {
    "Content-Type": "application/json",
  };

  return apiRequest({ endpoint, data, method: "post", headers: apiHeaders });
};

export const apiGet = (endpoint: string, data: any = null): Promise<any> => {
  const apiHeaders = {
    "Content-Type": "application/json",
  };
  return apiRequest({ endpoint, data, method: "get", headers: apiHeaders });
};

export const apiFormData = async (endpoint: string, formDataObj: any) => {
  try {
    const response = await axios.post(endpoint, formDataObj, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.status || 500,
    };
  }
};

export const apiGetCustomHeaders = (
  endpoint: string,
  data: any = null,
  headers: any
): Promise<any> => {
  return apiRequest({ endpoint, data, method: "get", headers });
};
