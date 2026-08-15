import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,

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
    /* ---------------------------------------------------------------------- */
    /* Access Token                                                           */
    /* ---------------------------------------------------------------------- */

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    /* ---------------------------------------------------------------------- */
    /* FormData / OCR                                                          */
    /* ---------------------------------------------------------------------- */

    if (config.data instanceof FormData) {
      /*
       * Do not manually set Content-Type for FormData.
       * The browser/Axios will automatically add:
       *
       * multipart/form-data; boundary=...
       */

      delete config.headers["Content-Type"];
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
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
      return;
    }

    if (token) {
      resolve(token);
    }
  });

  pendingRequests = [];
}

/* -------------------------------------------------------------------------- */
/* Response Interceptor                                                       */
/* -------------------------------------------------------------------------- */

api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    /* ---------------------------------------------------------------------- */
    /* Only handle 401                                                        */
    /* ---------------------------------------------------------------------- */

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    /* ---------------------------------------------------------------------- */
    /* Server-side request                                                    */
    /* ---------------------------------------------------------------------- */

    if (typeof window === "undefined") {
      return Promise.reject(error);
    }

    /* ---------------------------------------------------------------------- */
    /* Get Refresh Token                                                      */
    /* ---------------------------------------------------------------------- */

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
        `${API_BASE_URL}/auth/refresh`,
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
      /* Retry Pending Requests                                               */
      /* -------------------------------------------------------------------- */

      processPendingRequests(null, accessToken);

      /* -------------------------------------------------------------------- */
      /* Retry Original Request                                               */
      /* -------------------------------------------------------------------- */

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      /* -------------------------------------------------------------------- */
      /* Refresh Failed                                                        */
      /* -------------------------------------------------------------------- */

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
