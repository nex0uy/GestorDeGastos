import React from 'react';
import { Transaction } from '../../services/api_trans';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (transactionId: number) => void;
  onEdit: (transaction: Transaction) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onDelete, onEdit }) => {
  return (
    <li className="px-4 py-4 sm:px-6 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-indigo-600 truncate">
          {transaction.description}
        </p>
        <div className="ml-2 flex-shrink-0 flex">
          <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            transaction.type === 'EXPENSE' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
            {transaction.type === 'EXPENSE' ? '-' : '+'}${transaction.amount.toFixed(2)}
          </p>
        </div>
      </div>
      <div className="mt-2 sm:flex sm:justify-between">
        <div className="sm:flex">
          <p className="flex items-center text-sm text-gray-500">
            {transaction.category.categoryName}
          </p>
          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
            {transaction.bankAccount.bankName}
          </p>
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
          <p>
            {new Date(transaction.date).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="mt-2 flex justify-end space-x-2">
        <button
          onClick={() => onEdit(transaction)}
          className="text-indigo-600 hover:text-indigo-900"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(transaction.transactionId)}
          className="text-red-600 hover:text-red-900"
        >
          Eliminar
        </button>
      </div>
    </li>
  );
};

export default TransactionItem;

