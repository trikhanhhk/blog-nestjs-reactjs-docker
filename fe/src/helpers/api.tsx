import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import { startCheckingTokenExpiration } from './tokenUtils';

export const httpClient = async (contentType: string = "application/json") => {
  const headers = {
    'Accept': 'aplication/json',
    'Content-Type': contentType,
    'Access-Control-Allow-Origin': '*',
  };
  const config: AxiosRequestConfig = {
    headers: headers,
    baseURL: `${process.env.REACT_APP_BASE_API_URL}${process.env.REACT_APP_API_VERSION}`,
  };

  const instance = axios.create(config);

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      return config;
    },

    (error) => {
      console.error(error)
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    async (response) => {
      return await response;
    },

    async (error) => {
      console.error("Error from api:", error)
      const originalConfig = error.config;
      if (error.response && error.response.status === 403) {
        toast.error("Bạn không có quyền truy cập trang này");
        window.location.href = '/forbidden';
        return false;
      } else {
        if (error && error.response) {
          toast.error(error.response.data.message);
          console.error(error);
        }
        return false;
      }
    }
  );



  return instance;
};

startCheckingTokenExpiration();