import React, { useState, useEffect } from 'react';
import { getUserData } from '../../utils/storage';
import { getAllTransactions, deleteTransaction, Transaction } from '../../services/api_trans';
import LoadingSpinner from '../common/LoadingSpinner';
import TransactionItem from './TransactionItem';
import TransactionForm from './TransactionsForm';

interface TransactionListProps {
  refreshDashboard: () => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ refreshDashboard }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>(undefined);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const userData = getUserData();
      if (userData) {
        const data = await getAllTransactions(userData.userId);
        const sortedTransactions = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setTransactions(sortedTransactions);
      }
    } catch (err) {
      setError('Error al cargar las transacciones. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDeleteTransaction = async (transactionId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
      try {
        await deleteTransaction(transactionId);
        await fetchTransactions();
        refreshDashboard();
      } catch (err) {
        setError('Error al eliminar la transacción. Por favor, intenta de nuevo.');
      }
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(undefined);
  };

  const handleTransactionCreated = async () => {
    await fetchTransactions();
    refreshDashboard();
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
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Transacciones Recientes</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Nueva Transacción
        </button>
      </div>
      
      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-gray-500">No hay transacciones registradas</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <TransactionItem
              key={transaction.transactionId}
              transaction={transaction}
              onDelete={handleDeleteTransaction}
              onEdit={handleEditTransaction}
            />
          ))}
        </ul>
      )}
      
      <TransactionForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onTransactionCreated={handleTransactionCreated}
        transaction={selectedTransaction}
      />
    </div>
  );
};

export default TransactionList;

