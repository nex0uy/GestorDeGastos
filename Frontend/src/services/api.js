// src/services/api.js
import axios from 'axios';

const API_URL = 'https://api-fantasma.com'; 

// Llamada para agregar un gasto
export const addExpenseApi = async (expense) => {
  try {
    const response = await axios.post(`${API_URL}/expenses`, expense);
    return response.data;
  } catch (error) {
    console.error('Error agregando gasto:', error);
    throw error;
  }
};

// Llamada para agregar un ingreso
export const addIncomeApi = async (income) => {
  try {
    const response = await axios.post(`${API_URL}/incomes`, income);
    return response.data;
  } catch (error) {
    console.error('Error agregando ingreso:', error);
    throw error;
  }
};

// Llamada para obtener las transacciones
export const getTransactionsApi = async () => {
  try {
    const response = await axios.get(`${API_URL}/transactions`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo transacciones:', error);
    throw error;
  }
};
