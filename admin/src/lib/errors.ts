type ApiErrorLike = {
  response?: {
    data?: string | {
      detail?: string;
      message?: string;
    };
  };
};

const isApiErrorLike = (error: unknown): error is ApiErrorLike => {
  return typeof error === 'object' && error !== null && 'response' in error;
};

export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (isApiErrorLike(error)) {
    const data = error.response?.data;
    if (typeof data === 'string' && data.trim()) {
      return data;
    }
    if (typeof data === 'object' && data?.detail) {
      return data.detail;
    }
    if (typeof data === 'object' && data?.message) {
      return data.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};
