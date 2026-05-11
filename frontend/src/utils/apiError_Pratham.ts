import axios from 'axios';

export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as
      | { error?: { message?: string }; message?: string }
      | undefined;
    const msg = data?.error?.message ?? data?.message;
    if (msg) return msg;
    if (err.response?.status) {
      return `${fallback} (HTTP ${err.response.status})`;
    }
    if (err.code === 'ERR_NETWORK') {
      return `${fallback}: network error — check that the API is running`;
    }
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}
