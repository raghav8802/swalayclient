interface ApiResponse<T = any> {
  success: boolean;
  subscription?: T;
  message?: string;
}

export const apiGet = async <T>(url: string): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}; 