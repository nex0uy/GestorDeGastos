// src/components/ExpenseForm.jsx
import React, { useState, useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';

const ExpenseForm = () => {
  const { addExpense, addIncome } = useContext(ExpenseContext);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const handleAddExpense = (e) => {
    e.preventDefault();
    const expense = { description, amount: parseFloat(amount), type: 'gasto' };
    addExpense(expense);
    clearForm();
  };

  const handleAddIncome = (e) => {
    e.preventDefault();
    const income = { description, amount: parseFloat(amount), type: 'ingreso' };
    addIncome(income);
    clearForm();
  };

  const clearForm = () => {
    setDescription('');
    setAmount('');
  };

  return (
    <form className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <div className="mb-4">
        <label className="block text-gray-700">Descripción:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-2 p-2 border rounded w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Monto:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-2 p-2 border rounded w-full"
          required
        />
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleAddExpense}
          className="bg-red-500 text-white p-2 rounded w-full"
        >
          Agregar Gasto
        </button>
        <button
          onClick={handleAddIncome}
          className="bg-green-500 text-white p-2 rounded w-full"
        >
          Agregar Ingreso
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
