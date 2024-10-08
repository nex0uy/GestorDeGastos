// src/components/TransactionList.jsx
import React, { useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';

const TransactionList = () => {
  const { transactions } = useContext(ExpenseContext);

  return (
    <div className="max-w-md mx-auto mt-6">
      <h3 className="text-lg font-semibold mb-4">Lista de Transacciones</h3>
      <ul className="bg-white shadow-md rounded-lg p-4">
        {transactions.map((transaction, index) => (
          <li
            key={index}
            className={`p-2 border-b last:border-none ${transaction.type === 'gasto' ? 'text-red-500' : 'text-green-500'}`}
          >
            {transaction.description} - ${transaction.amount} ({transaction.type === 'gasto' ? 'Gasto' : 'Ingreso'})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
