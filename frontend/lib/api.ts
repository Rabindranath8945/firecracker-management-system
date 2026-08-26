import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

/* -------------------------------------------------------------------------- */
/* API BASE URL                                                               */
/* -------------------------------------------------------------------------- */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://one-hub-erp.onrender.com/api/v1/";

/* -------------------------------------------------------------------------- */
/* AXIOS INSTANCE                                                             */
/* -------------------------------------------------------------------------- */

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
/* TYPES                                                                      */
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
/* REQUEST INTERCEPTOR                                                        */
/* -------------------------------------------------------------------------- */

api.interceptors.request.use(
  (config) => {
    /* ---------------------------------------------------------------------- */
    /* ACCESS TOKEN                                                           */
    /* ---------------------------------------------------------------------- */

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    /* ---------------------------------------------------------------------- */
    /* FORMDATA                                                               */
    /* ---------------------------------------------------------------------- */

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },

  (error) => Promise.reject(error),
);

/* -------------------------------------------------------------------------- */
/* REFRESH STATE                                                              */
/* -------------------------------------------------------------------------- */

let isRefreshing = false;

interface PendingRequest {
  resolve: (token: string) => void;

  reject: (error: unknown) => void;
}

let pendingRequests: PendingRequest[] = [];

/* -------------------------------------------------------------------------- */
/* PROCESS PENDING REQUESTS                                                   */
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
/* RESPONSE INTERCEPTOR                                                       */
/* -------------------------------------------------------------------------- */

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    /* ---------------------------------------------------------------------- */
    /* ONLY HANDLE 401                                                        */
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
    /* SERVER SIDE                                                             */
    /* ---------------------------------------------------------------------- */

    if (typeof window === "undefined") {
      return Promise.reject(error);
    }

    /* ---------------------------------------------------------------------- */
    /* REFRESH TOKEN                                                           */
    /* ---------------------------------------------------------------------- */

    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      localStorage.removeItem("accessToken");

      window.location.href = "/login";

      return Promise.reject(error);
    }

    /* ---------------------------------------------------------------------- */
    /* WAIT FOR EXISTING REFRESH                                              */
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
    /* START REFRESH                                                           */
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
      /* SAVE TOKENS                                                          */
      /* -------------------------------------------------------------------- */

      localStorage.setItem("accessToken", accessToken);

      localStorage.setItem("refreshToken", newRefreshToken);

      /* -------------------------------------------------------------------- */
      /* RETRY PENDING REQUESTS                                               */
      /* -------------------------------------------------------------------- */

      processPendingRequests(null, accessToken);

      /* -------------------------------------------------------------------- */
      /* RETRY ORIGINAL REQUEST                                               */
      /* -------------------------------------------------------------------- */

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      /* -------------------------------------------------------------------- */
      /* REFRESH FAILED                                                       */
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
