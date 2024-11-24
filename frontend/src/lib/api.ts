import axios, { AxiosRequestConfig } from "axios";
import { config } from "@/config";

const axiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// 定義通用參數類型
interface QueryParams {
  [key: string]: string | number | boolean | null | undefined;
}

const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export const api = {
  get: async <T>(
    url: string,
    params?: QueryParams,
    config?: AxiosRequestConfig
  ) =>
    axiosInstance
      .get<T, { data: T }>(url, { ...config, params })
      .then((res) => res.data),

  post: async <T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ) =>
    axiosInstance
      .post<T, { data: T }>(url, data, config)
      .then((res) => res.data),

  put: async <T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ) =>
    axiosInstance
      .put<T, { data: T }>(url, data, config)
      .then((res) => res.data),

  delete: async <T>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<T, { data: T }>(url, config).then((res) => res.data),
};
