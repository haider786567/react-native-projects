import axios, { AxiosError, create, InternalAxiosRequestConfig, isAxiosError } from "axios";
import Constants from "expo-constants";
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from "./secureStore";

const developmentHost = Constants.expoConfig?.hostUri?.split(":")[0];
export const API_URL = process.env.EXPO_PUBLIC_API_URL
  ?? (developmentHost ? `http://${developmentHost}:3000/api` : "http://localhost:3000/api");

const api = create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

let refreshRequest: Promise<string> | null = null;
let unauthorizedHandler: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  unauthorizedHandler = handler;
};

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const isAuthRequest = request?.url?.includes("/auth/login")
      || request?.url?.includes("/auth/register")
      || request?.url?.includes("/auth/refresh-token");

    if (error.response?.status !== 401 || !request || request._retry || isAuthRequest) {
      return Promise.reject(error);
    }

    request._retry = true;
    try {
      refreshRequest ??= (async () => {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token");
        const response = await axios.post<{ accessToken: string; refreshToken: string }>(
          `${API_URL}/auth/refresh-token`,
          { refreshToken },
        );
        await saveTokens(response.data.accessToken, response.data.refreshToken);
        return response.data.accessToken;
      })().finally(() => { refreshRequest = null; });

      const accessToken = await refreshRequest;
      request.headers.Authorization = `Bearer ${accessToken}`;
      return api(request);
    } catch {
      await clearTokens();
      unauthorizedHandler?.();
      return Promise.reject(error);
    }
  },
);

export const getApiErrorMessage = (error: unknown) => {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? (error.code === "ECONNABORTED"
      ? "The server took too long to respond."
      : "Could not connect to the server.");
  }
  return error instanceof Error ? error.message : "Something went wrong.";
};

export default api;
