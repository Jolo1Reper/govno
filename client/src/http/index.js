import axios from 'axios';

const $host = axios.create({
  baseURL: 'http://localhost:5000',
});

const $authHost = axios.create({
  baseURL: 'http://localhost:5000',
});

const authInstance = (config) => {
  config.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
  return config;
};

$authHost.interceptors.request.use(authInstance);

export { $host, $authHost };
