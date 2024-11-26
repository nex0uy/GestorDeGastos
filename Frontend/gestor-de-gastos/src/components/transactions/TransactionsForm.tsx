import React, { useState, useEffect } from 'react';
import { createTransaction, getAllCategories, Category, updateTransaction, Transaction } from '../../services/api_trans';
import { getBankAccounts } from '../../services/api';
import { getUserData } from '../../utils/storage';

interface BankAccount {
  bankAccountId: number;
  bankName: string;
}

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onTransactionCreated: () => void;
  transaction?: Transaction;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ isOpen, onClose, onTransactionCreated, transaction }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [formData, setFormData] = useState({
    date: '',
    description: '',
    amount: '',
    type: 'EXPENSE' as 'EXPENSE' | 'INCOME',
    isRecurrent: false,
    categoryId: '',
    bankAccountId: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = getUserData();
        if (!userData) {
          throw new Error('No user data found');
        }

        const [categoriesData, accountsData] = await Promise.all([
          getAllCategories(),
          getBankAccounts(userData.userId)
        ]);
        setCategories(categoriesData);
        setBankAccounts(accountsData);
      } catch (err) {
        setError('Error al cargar los datos. Por favor, intenta de nuevo.');
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (transaction) {
      setFormData({
        date: transaction.date,
        description: transaction.description,
        amount: transaction.amount.toString(),
        type: transaction.type,
        isRecurrent: transaction.isRecurrent,
        categoryId: transaction.category.categoryId.toString(),
        bankAccountId: transaction.bankAccount.bankAccountId.toString(),
      });
    } else {
      setFormData({
        date: '',
        description: '',
        amount: '',
        type: 'EXPENSE',
        isRecurrent: false,
        categoryId: '',
        bankAccountId: '',
      });
    }
  }, [transaction]);

  const handleInputChange = (
e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = getUserData();
      if (!userData) {
        throw new Error('No user data found');
      }

      const transactionData = {
        date: formData.date,
        description: formData.description,
        amount: parseFloat(formData.amount),
        type: formData.type,
        isRecurrent: formData.isRecurrent,
        user: { userId: userData.userId },
        category: { 
          categoryId: parseInt(formData.categoryId),
          categoryName: categories.find(c => c.categoryId.toString() === formData.categoryId)?.categoryName || ''
        },
        bankAccount: { bankAccountId: parseInt(formData.bankAccountId) },
      };


      if (transaction) {
        await updateTransaction(transaction.transactionId, transactionData);
      } else {
        await createTransaction(transactionData);
      }

      onTransactionCreated();
      onClose();
      setFormData({
        date: '',
        description: '',
        amount: '',
        type: 'EXPENSE',
        isRecurrent: false,
        categoryId: '',
        bankAccountId: '',
      });
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Error al crear/actualizar la transacción: ${err.message}`);
      } else {
        setError('Error al crear/actualizar la transacción. Por favor, intenta de nuevo.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-xl">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            {transaction ? 'Editar Transacción' : 'Crear Nueva Transacción'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Descripción de la transacción"
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Monto
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                required
                step="0.01"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <div className="relative">
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-4 text-base md:text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none bg-white [&>option]:p-2 [&>option]:cursor-pointer [&>option]:text-base"
              >
                <option value="EXPENSE">Gasto</option>
                <option value="INCOME">Ingreso</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isRecurrent"
                name="isRecurrent"
                checked={formData.isRecurrent}
                onChange={handleInputChange}
                className="h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 transition-all"
              />
              <label htmlFor="isRecurrent" className="ml-3 text-sm font-medium text-gray-700">
                Es recurrente
              </label>
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <div className="relative">
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-4 text-base md:text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none bg-white [&>option]:p-2 [&>option]:cursor-pointer [&>option]:text-base"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map(category => (
                    <option key={category.categoryId} value={category.categoryId.toString()}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="bankAccountId" className="block text-sm font-medium text-gray-700 mb-1">
                Cuenta Bancaria
              </label>
              <div className="relative">
                <select
                  id="bankAccountId"
                  name="bankAccountId"
                  value={formData.bankAccountId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-4 text-base md:text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none bg-white [&>option]:p-2 [&>option]:cursor-pointer [&>option]:text-base"
                >
                  <option value="">Selecciona una cuenta bancaria</option>
                  {bankAccounts.map(account => (
                    <option key={account.bankAccountId} value={account.bankAccountId.toString()}>
                      {account.bankName}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 text-sm font-medium rounded-lg text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
              >
                {transaction ? 'Actualizar Transacción' : 'Crear Transacción'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;

