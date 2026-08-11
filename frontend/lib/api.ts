import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1",

  timeout: 30000,

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface RefreshResponse {
  success: boolean;

  data: {
    accessToken: string;
    refreshToken: string;
  };
}

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

/* -------------------------------------------------------------------------- */
/* Request Interceptor                                                        */
/* -------------------------------------------------------------------------- */

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/* -------------------------------------------------------------------------- */
/* Refresh State                                                              */
/* -------------------------------------------------------------------------- */

let isRefreshing = false;

interface PendingRequest {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let pendingRequests: PendingRequest[] = [];

/* -------------------------------------------------------------------------- */
/* Process Pending Requests                                                   */
/* -------------------------------------------------------------------------- */

function processPendingRequests(error: unknown, token?: string) {
  pendingRequests.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });

  pendingRequests = [];
}

/* -------------------------------------------------------------------------- */
/* Response Interceptor                                                       */
/* -------------------------------------------------------------------------- */

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (typeof window === "undefined") {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      localStorage.removeItem("accessToken");

      window.location.href = "/login";

      return Promise.reject(error);
    }

    /* ---------------------------------------------------------------------- */
    /* Another request is already refreshing                                  */
    /* ---------------------------------------------------------------------- */

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;

            resolve(api(originalRequest));
          },

          reject,
        });
      });
    }

    /* ---------------------------------------------------------------------- */
    /* Start Refresh                                                           */
    /* ---------------------------------------------------------------------- */

    isRefreshing = true;

    try {
      const response = await axios.post<RefreshResponse>(
        `${
          process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1"
        }/auth/refresh`,
        {
          refreshToken,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

      const { accessToken, refreshToken: newRefreshToken } = response.data.data;

      /* -------------------------------------------------------------------- */
      /* Save Tokens                                                           */
      /* -------------------------------------------------------------------- */

      localStorage.setItem("accessToken", accessToken);

      localStorage.setItem("refreshToken", newRefreshToken);

      /* -------------------------------------------------------------------- */
      /* Retry Requests Waiting for Refresh                                   */
      /* -------------------------------------------------------------------- */

      processPendingRequests(null, accessToken);

      /* -------------------------------------------------------------------- */
      /* Retry Original Request                                               */
      /* -------------------------------------------------------------------- */

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      processPendingRequests(refreshError);

      localStorage.removeItem("accessToken");

      localStorage.removeItem("refreshToken");

      window.location.href = "/login";

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
