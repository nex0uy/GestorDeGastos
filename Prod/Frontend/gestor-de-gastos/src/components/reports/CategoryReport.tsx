import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { startOfMonth, endOfMonth, parseISO, format } from 'date-fns';
import { getAllTransactions, Transaction } from '../../services/api_trans';
import { getUserData } from '../../utils/storage';
import LoadingSpinner from '../common/LoadingSpinner';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryReport: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const userData = getUserData();
        if (userData) {
          const data = await getAllTransactions(userData.userId);
          setTransactions(data);
        }
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Error al cargar las transacciones. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = parseISO(transaction.date);
    return transactionDate >= startOfMonth(selectedMonth) && transactionDate <= endOfMonth(selectedMonth);
  });

  const expensesByCategory = filteredTransactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, t) => {
      const categoryName = t.category?.categoryName || 'Sin categoría';
      if (!acc[categoryName]) {
        acc[categoryName] = 0;
      }
      acc[categoryName] += t.amount;
      return acc;
    }, {} as Record<string, number>);

  const sortedCategories = Object.entries(expensesByCategory)
    .sort(([, a], [, b]) => b - a);

  const chartData = {
    labels: sortedCategories.map(([category]) => category),
    datasets: [
      {
        data: sortedCategories.map(([, amount]) => amount),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384',
        ],
        hoverBackgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: `Gastos por Categoría - ${format(selectedMonth, 'MMMM yyyy')}`,
      },
    },
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMonth(new Date(event.target.value));
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

  const totalExpenses = Object.values(expensesByCategory).reduce((a, b) => a + b, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Reporte por Categoría</h1>
      <div className="mb-4">
        <label htmlFor="month-select" className="block text-sm font-medium text-gray-700">Seleccionar mes:</label>
        <input
          type="month"
          id="month-select"
          value={format(selectedMonth, 'yyyy-MM')}
          onChange={handleMonthChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Distribución de Gastos por Categoría</h2>
        <div className="w-full max-w-2xl mx-auto">
          <Doughnut data={chartData} options={chartOptions} />
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Desglose de Gastos:</h3>
          <ul className="list-disc pl-5">
            {sortedCategories.map(([category, amount]) => (
              <li key={category} className="text-lg">
                {category}: ${amount.toFixed(2)} ({((amount / totalExpenses) * 100).toFixed(2)}%)
              </li>
            ))}
          </ul>
          <p className="text-lg font-semibold mt-4">
            Total Gastos: ${totalExpenses.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryReport;

