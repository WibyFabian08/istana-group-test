import axios from "axios";
import { useCookies } from "@/hooks/useCookies";

const { getCookie, removeCookie, setCookie } = useCookies();

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

api.interceptors.request.use(
  (config) => {
    const token = getCookie("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((token) => {
            if (!token) return reject(error);
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }


      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refresh = {
          refresh_token: getCookie("reToken"),
        };

        const response = await api.post("/auth/refresh", refresh);

        const newAccessToken = response?.data?.access_token;
        const newRefreshToken = response?.data?.refresh_token;

        setCookie("token", newAccessToken, {
          expires: 7,
          path: "/",
        });

        setCookie("reToken", newRefreshToken, {
          expires: 7,
          path: "/",
        });

        api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        onRefreshed(newAccessToken);

        return api(originalRequest);
      } catch (err) {
        removeCookie('token')
        removeCookie('reToken')
        localStorage.clear()
        onRefreshed(null);

        window.location.href = '/';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;