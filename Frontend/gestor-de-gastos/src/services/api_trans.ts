import axios from 'axios';
import { API_URL } from '../config/api';
import { getUserData } from '../utils/storage';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const userData = getUserData();
  if (userData && userData.token) {
    if (config.url === '/category/getall') {
      config.headers['Authorization'] = `Bearer ${userData.token}`;
    } else {
      config.headers['Authorization'] = userData.token;
    }
  }
  return config;
});

export interface Transaction {
  transactionId: number;
  date: string;
  description: string;
  amount: number;
  type: 'EXPENSE' | 'INCOME';
  isRecurrent: boolean;
  user: {
    userId: number;
    userName?: string;
  };
  category: {
    categoryId: number;
    categoryName?: string;
  };
  bankAccount: {
    bankAccountId: number;
    bankName?: string;
    baseCurrency?: string;
    initialBalance?: number;
  };
}

export interface Category {
  categoryId: number;
  categoryName: string;
}

export const getAllTransactions = async (userId: number): Promise<Transaction[]> => {
  const response = await api.get(`/transaction/getall/user/${userId}`);
  return response.data;
};

export const updateTransaction = async (transactionId: number, transactionData: Partial<Transaction>): Promise<Transaction> => {
  const userData = getUserData();
  if (!userData || !userData.token) {
    throw new Error('No authentication token found');
  }

  const response = await api.put(`/transaction/update/${transactionId}/user/${userData.userId}`, transactionData, {
    headers: {
      'Authorization': userData.token,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const deleteTransaction = async (transactionId: number): Promise<void> => {
  const userData = getUserData();
  if (!userData || !userData.token) {
    throw new Error('No authentication token found');
  }


  try {
    await api.delete(`/transaction/delete/${transactionId}/user/${userData.userId}`, {
      headers: {
        'Authorization': userData.token
      }
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to delete transaction: ${error.response?.status} ${error.response?.statusText}`);
    }
    throw error;
  }
};

export const getAllCategories = async (): Promise<Category[]> => {
  const userData = getUserData();
  if (!userData || !userData.token) {
    throw new Error('No authentication token found');
  }
  
  try {
    const response = await api.get('/category/getall', {
      headers: {
        'Authorization': `Bearer ${userData.token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createTransaction = async (transactionData: Omit<Transaction, 'transactionId' | 'user' | 'category' | 'bankAccount'> & { 
  user: { userId: number },
  category: { categoryId: number },
  bankAccount: { bankAccountId: number }
}): Promise<Transaction> => {
  const userData = getUserData();
  if (!userData || !userData.token) {
    throw new Error('No authentication token found');
  }

  const payload = {
    date: transactionData.date,
    description: transactionData.description,
    amount: transactionData.amount,
    type: transactionData.type,
    isRecurrent: transactionData.isRecurrent,
    user: { userId: transactionData.user.userId },
    category: { categoryId: transactionData.category.categoryId },
    bankAccount: { bankAccountId: transactionData.bankAccount.bankAccountId }
  };

  const response = await api.post('/transaction/create', payload, {
    headers: {
      'Authorization': userData.token,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

