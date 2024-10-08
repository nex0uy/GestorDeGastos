// src/context/ExpenseContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { addExpenseApi, addIncomeApi, getTransactionsApi } from '../services/api';

export const ExpenseContext = createContext();

const ExpenseProvider = ({ children }) => {
  // Mockeamos algunas transacciones
  const [transactions, setTransactions] = useState([
    { description: 'Compra Supermercado', amount: 50, type: 'gasto' },
    { description: 'Pago de Netflix', amount: 15, type: 'gasto' },
    { description: 'Sueldo', amount: 1200, type: 'ingreso' },
  ]);

  // Simulamos la carga de transacciones desde una API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getTransactionsApi();
        setTransactions([...transactions, ...data]); // Agregamos los datos mockeados
      } catch (error) {
        console.error('Error cargando las transacciones:', error);
      }
    };

    fetchTransactions();
  }, []);

  const addExpense = async (expense) => {
    try {
      const newExpense = await addExpenseApi(expense);
      setTransactions([...transactions, newExpense]);
    } catch (error) {
      console.error('Error agregando gasto:', error);
    }
  };

  const addIncome = async (income) => {
    try {
      const newIncome = await addIncomeApi(income);
      setTransactions([...transactions, newIncome]);
    } catch (error) {
      console.error('Error agregando ingreso:', error);
    }
  };

  return (
    <ExpenseContext.Provider value={{ transactions, addExpense, addIncome }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export default ExpenseProvider;
