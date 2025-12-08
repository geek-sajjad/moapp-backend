// Success response
export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

// Error response
export interface ApiErrorResponse {
  status: boolean;
  message: string;
  errorCode?: string; // Optional error code for further categorization
}
