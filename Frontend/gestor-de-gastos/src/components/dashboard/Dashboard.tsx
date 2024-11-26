import React, { useEffect, useState } from 'react';
import { getUserData } from '../../utils/storage';
import { getAllTransactions, Transaction } from '../../services/api_trans';
import { checkBudgetStatus, getAllCategories, BudgetAlert } from '../../services/api_dash';
import TransactionList from '../transactions/TransactionsList';
import LoadingSpinner from '../common/LoadingSpinner';

interface DashboardProps {
  refreshDashboard: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ refreshDashboard }) => {
  const [userName, setUserName] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [budgetAlerts, setBudgetAlerts] = useState<BudgetAlert[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = getUserData();
        if (userData) {
          setUserName(userData.userName);
          const transactionsData = await getAllTransactions(userData.userId);
          setTransactions(transactionsData);

          const categories = await getAllCategories();
          const alerts = await Promise.all(
            categories.map(async (category) => {
              const alert = await checkBudgetStatus(userData.userId, category.categoryId);
              if (alert) {
                return { ...alert, categoryName: category.categoryName };
              }
              return null;
            })
          );
          setBudgetAlerts(alerts.filter((alert): alert is BudgetAlert => alert !== null));
        }
      } catch (err) {
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
      {budgetAlerts.length > 0 && (
        <div className="mb-4">
          {budgetAlerts.map((alert, index) => (
            <div key={index} className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-2">
              <p className="font-bold">{alert.categoryName}</p>
              <p>{alert.message}</p>
            </div>
          ))}
        </div>
      )}
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

      <TransactionList refreshDashboard={refreshDashboard} />
    </div>
  );
};

export default Dashboard;

