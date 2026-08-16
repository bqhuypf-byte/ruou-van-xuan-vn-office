interface ApiErrorLike {
  response?: {
    data?: {
      error?: { message?: string };
      message?: string;
    };
  };
}

const hasResponseData = (error: unknown): error is ApiErrorLike =>
  typeof error === 'object' && error !== null && 'response' in error;

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (hasResponseData(error)) {
    const data = error.response?.data;
    return data?.error?.message ?? data?.message ?? fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
};
