import axios, { AxiosRequestConfig } from "axios";
import { config } from "@/config";
import { storage } from "@/lib/storage";
import { QueryParams } from "@/types/auth";

const axiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// 請求攔截器：在發送請求前加入 token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = storage.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 回應攔截器：處理錯誤回應
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API Error:", error.response?.data); // 添加日誌

    if (error.response?.data?.message) {
      // 使用後端返回的錯誤訊息
      error.message = error.response.data.message;
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
