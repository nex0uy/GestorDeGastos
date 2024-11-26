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

export interface Budget {
  budgetId: number;
  maxAmount: number;
  alertTriggered: boolean;
  initialDate: string;
  category: {
    categoryId: number;
    categoryName: string;
  };
  user: {
    userId: number;
    userName: string;
  };
}

export interface CreateBudgetData {
  maxAmount: number;
  alertTriggered: boolean;
  initialDate: string;
  category: {
    categoryId: number;
  };
  user: {
    userId: number;
  };
}

export const getAllBudgets = async (): Promise<Budget[]> => {
  const response = await api.get('/budget/getall');
  return response.data;
};

export const deleteBudget = async (budgetId: number): Promise<void> => {
  await api.delete(`/budget/delete/${budgetId}`);
};

export const createBudget = async (budgetData: CreateBudgetData): Promise<Budget> => {
  const response = await api.post('/budget/create', budgetData);
  return response.data;
};

export const updateBudget = async (budgetId: number, budgetData: CreateBudgetData): Promise<Budget> => {
  const response = await api.put(`/budget/update/${budgetId}`, budgetData);
  return response.data;
};
