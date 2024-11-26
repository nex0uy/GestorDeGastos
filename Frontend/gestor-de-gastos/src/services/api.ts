import axios from 'axios';
import { API_URL } from '../config/api';
import { getUserData } from '../utils/storage';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const userData = getUserData();
  if (userData && userData.token) {
    config.headers['Authorization'] = userData.token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

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

export const getBankAccounts = async (userId: number) => {
  const userData = getUserData();
  if (!userData || !userData.token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await api.get(`/bank-accounts/user/${userId}`, {
      headers: {
        'Authorization': userData.token
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createBankAccount = async (accountData: any) => {
  const response = await api.post('/bank-accounts/create', accountData);
  return response.data;
};

export const updateBankAccount = async (bankAccountId: number, accountData: any) => {
  if (!bankAccountId) {
    throw new Error('Account ID is required for updating a bank account');
  }
  const userData = getUserData();
  if (!userData || !userData.token) {
    throw new Error('No authentication token found');
  }
  const response = await api.put(`/bank-accounts/update/${bankAccountId}`, accountData, {
    headers: {
      'Authorization': userData.token
    }
  });
  return response.data;
};

export const deleteBankAccount = async (bankAccountId: number) => {
  if (!bankAccountId) {
    throw new Error('Account ID is required for deleting a bank account');
  }
  const userData = getUserData();
  if (!userData || !userData.token) {
    throw new Error('No authentication token found');
  }
  const response = await api.delete(`/bank-accounts/delete/${bankAccountId}`, {
    headers: {
      'Authorization': userData.token
    }
  });
  return response.data;
};

export const getBankAccountDetails = async (userId: number, bankAccountId: number) => {
  const response = await api.get(`/bank-accounts/user/${userId}/account/${bankAccountId}`);
  return response.data;
};
