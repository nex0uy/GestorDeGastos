// src/App.jsx
import React from 'react';
import ExpenseProvider from './context/ExpenseContext';
import ExpenseForm from './components/ExpenseForm';
import TransactionList from './components/TransactionList';

function App() {
  return (
    <ExpenseProvider>
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Gestor de Gastos e Ingresos</h1>
        <ExpenseForm />
        <TransactionList />
      </div>
    </ExpenseProvider>
  );
}

export default App;
