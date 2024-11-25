import axios from 'axios';
import { API_URL } from '../config/api';

export const login = async (userName: string, password: string) => {
  const response = await axios.post(
    `${API_URL}/auth/login`,
    `userName=${userName}&password=${password}`,
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }
  );
  return response.data;
};

export const signup = async (userName: string, password: string, token: string) => {
  const response = await axios.post(
    `${API_URL}/user/create`,
    { userName, password },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    }
  );
  return response.data;
};

