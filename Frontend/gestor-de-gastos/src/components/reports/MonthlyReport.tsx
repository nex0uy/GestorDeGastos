import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { getAllTransactions, Transaction } from '../../services/api_trans';
import { getUserData } from '../../utils/storage';
import LoadingSpinner from '../common/LoadingSpinner';

ChartJS.register(ArcElement, Tooltip, Legend);

const MonthlyReport: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const userData = getUserData();
        if (userData) {
          const data = await getAllTransactions(userData.userId);
          setTransactions(data);
        }
      } catch (err) {
        setError('Error al cargar las transacciones. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const currentMonthTransactions = transactions.filter(transaction => {
    const transactionDate = parseISO(transaction.date);
    const now = new Date();
    return transactionDate >= startOfMonth(now) && transactionDate <= endOfMonth(now);
  });

  const totalExpense = currentMonthTransactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = currentMonthTransactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const chartData = {
    labels: ['Gastos', 'Ingresos'],
    datasets: [
      {
        data: [totalExpense, totalIncome],
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Reporte Mensual</h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Distribución de Gastos e Ingresos</h2>
        <div className="w-full max-w-md mx-auto">
          <Pie data={chartData} />
        </div>
        <div className="mt-4">
          <p className="text-lg">Total Gastos: ${totalExpense.toFixed(2)}</p>
          <p className="text-lg">Total Ingresos: ${totalIncome.toFixed(2)}</p>
          <p className="text-lg font-semibold">
            Balance: ${(totalIncome - totalExpense).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MonthlyReport;

