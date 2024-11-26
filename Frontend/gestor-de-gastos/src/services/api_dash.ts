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

export interface BudgetAlert {
  categoryId: number;
  categoryName: string;
  message: string;
}

export const checkBudgetStatus = async (userId: number, categoryId: number): Promise<BudgetAlert | null> => {
  try {
    const response = await api.get(`/budget/check-budget-status/category/${categoryId}/user/${userId}`);
    if (response.data === "Alert: You have exceeded 80% of your budget for this category!") {
      return {
        categoryId,
        categoryName: '', // We'll need to fetch the category name separately or pass it as a parameter
        message: response.data
      };
    }
    return null;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    return null;
  }
};

export const getAllCategories = async (): Promise<{ categoryId: number; categoryName: string }[]> => {
  try {
    const response = await api.get('/category/getall');
    return response.data;
  } catch (error) {
    return [];
  }
};
