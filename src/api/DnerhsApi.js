import axios from "axios";
import history from "utils/History";

export const origin = `${process.env.REACT_APP_DNERHS_API_PROTOCOL}://${process.env.REACT_APP_DNERHS_API_HOST}`;

export const CancelToken = axios.CancelToken;

const instance = axios.create({
  baseURL: origin,
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});
instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("dnerhs-jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (err) {
    return Promise.reject(err);
  }
);

// Interceptor para llamar a refreshToken cuando el access token vence.
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("ERROR", error);
    if (error.response) {
      let status = error.response.status;
      switch (status) {
        case 401:
          localStorage.removeItem("dnerhs-jwt");
          history.push(`/login`);
          break;
        case 403:
          history.push(`/forbidden`);
          break;
      
        default:
          break;
      }
      
    }
    return Promise.reject(error);
  }
);

export default instance;
