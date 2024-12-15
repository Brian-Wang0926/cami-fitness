import axios, { AxiosRequestConfig } from "axios";
import { config } from "@/config";
import { storage } from "@/lib/storage";
import { QueryParams } from "@/types/auth";
import { logger } from "./logger";

const axiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// 請求攔截器：在發送請求前加入 token
axiosInstance.interceptors.request.use(
  (config) => {
    // 加入 token
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 記錄請求
    logger.log("API Request", {
      method: config.method?.toUpperCase(),
      url: config.url,
      params: config.params,
      data: config.data,
    });
    return config;
  },
  (error) => {
    logger.error("Request Error", {
      message: error.message,
      config: error.config,
    });
    return Promise.reject(error);
  }
);

// 回應攔截器：處理錯誤回應
axiosInstance.interceptors.response.use(
  (response) => {
    // 記錄成功響應
    logger.log("API Response", {
      method: response.config.method?.toUpperCase(),
      url: response.config.url,
      status: response.status,
      data: response.data,
    });

    return response;
  },
  (error) => {
    // 記錄錯誤響應
    logger.error("API Error", {
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    // 處理 401 未授權錯誤
    if (error.response?.status === 401) {
      // 清除本地存儲的驗證信息
      storage.clear();

      // 如果不在登入頁面，則重定向到登入頁面
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = "/login?redirect=" + window.location.pathname;
      }
    }

    // 使用後端返回的錯誤訊息
    if (error.response?.data?.message) {
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
