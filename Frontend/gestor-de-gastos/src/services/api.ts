import axios from 'axios';
import { API_URL } from '../config/api';
import { getUserData } from '../utils/storage';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const userData = getUserData();
  if (userData && userData.token) {
    config.headers['Authorization'] = `Bearer ${userData.token}`;
  }
  return config;
});

export const login = async (userName: string, password: string) => {
  const response = await api.post(
    '/auth/login',
    `userName=${userName}&password=${password}`,
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }
  );
  return response.data;
};

export const signup = async (userName: string, password: string) => {
  const response = await api.post(
    '/user/create',
    { userName, password },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

// Aquí puedes agregar más funciones para otras llamadas a la API

