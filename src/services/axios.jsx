import axios from 'axios';
import { apiHost } from '../constants';

axios.defaults.baseURL = apiHost;
axios.defaults.withCredentials = true;

const axiosInstance = axios.create({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=UTF-8',
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => error
);

export default axiosInstance;
