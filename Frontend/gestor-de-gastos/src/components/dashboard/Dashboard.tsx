import React, { useEffect, useState } from 'react';
import { getUserData } from '../../utils/storage';
import { getAllTransactions, Transaction } from '../../services/api_trans';
import TransactionList from '../transactions/TransactionsList';
import LoadingSpinner from '../common/LoadingSpinner';

const Dashboard: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = getUserData();
        if (userData) {
          setUserName(userData.userName);
          const transactionsData = await getAllTransactions(userData.userId);
          setTransactions(transactionsData);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error al cargar los datos. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateTotalBalance = () => {
    return transactions.reduce((total, transaction) => {
      return transaction.type === 'INCOME' 
        ? total + transaction.amount 
        : total - transaction.amount;
    }, 0);
  };

  const calculateTotalIncome = () => {
    return transactions
      .filter(transaction => transaction.type === 'INCOME')
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  const calculateTotalExpenses = () => {
    return transactions
      .filter(transaction => transaction.type === 'EXPENSE')
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 border-l-4 border-red-400">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p className="text-xl text-gray-600">Bienvenido, {userName}!</p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Balance Total</h3>
          <p className="text-2xl font-bold">${calculateTotalBalance().toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Ingresos Totales</h3>
          <p className="text-2xl font-bold text-green-600">${calculateTotalIncome().toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Gastos Totales</h3>
          <p className="text-2xl font-bold text-red-600">${calculateTotalExpenses().toFixed(2)}</p>
        </div>
      </div>

      <TransactionList />
    </div>
  );
};

export default Dashboard;

