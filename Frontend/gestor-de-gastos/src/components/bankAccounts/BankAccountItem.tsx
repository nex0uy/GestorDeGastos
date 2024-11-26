import React, { useState } from 'react';
import { updateBankAccount, deleteBankAccount } from '../../services/api';
import { getUserData } from '../../utils/storage';

interface BankAccount {
  bankAccountId: number;
  bankName: string;
  baseCurrency: string;
  initialBalance: number;
  user: {
    userId: number;
  };
}

interface BankAccountItemProps {
  account: BankAccount;
  onUpdate: () => void;
  onDelete: () => void;
}

const BankAccountItem: React.FC<BankAccountItemProps> = ({ account, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAccount, setEditedAccount] = useState(account);
  const [error, setError] = useState('');

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedAccount(account);
    setError('');
  };

  const handleSave = async () => {
    try {
      const userData = getUserData();
      if (!userData || !userData.token) {
        throw new Error('No se encontró el token de autenticación');
      }
      await updateBankAccount(account.bankAccountId, {
        ...editedAccount,
        user: { userId: account.user.userId }
      });
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      setError('Error al actualizar la cuenta. Por favor, inténtalo de nuevo.');
    }
  };

  const handleDelete = async () => {
    try {
      const userData = getUserData();
      if (!userData || !userData.token) {
        throw new Error('No se encontró el token de autenticación');
      }
      await deleteBankAccount(account.bankAccountId);
      onDelete();
    } catch (error) {
      setError('Error al eliminar la cuenta. Por favor, inténtalo de nuevo.');
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <input
          type="text"
          value={editedAccount.bankName}
          onChange={(e) => setEditedAccount({ ...editedAccount, bankName: e.target.value })}
          className="w-full p-2 border rounded-md mb-2"
          required
        />
        <select
          value={editedAccount.baseCurrency}
          onChange={(e) => setEditedAccount({ ...editedAccount, baseCurrency: e.target.value })}
          className="w-full p-2 border rounded-md mb-2"
          required
        >
          <option value="UYU">UYU</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
        <input
          type="number"
          value={editedAccount.initialBalance}
          onChange={(e) => setEditedAccount({ ...editedAccount, initialBalance: parseFloat(e.target.value) })}
          className="w-full p-2 border rounded-md mb-2"
          required
          step="0.01"
        />
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <div className="flex justify-end space-x-2">
          <button onClick={handleSave} className="bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600">
            Guardar
          </button>
          <button onClick={handleCancel} className="bg-gray-300 text-gray-800 py-1 px-2 rounded-md hover:bg-gray-400">
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h3 className="font-bold text-lg">{account.bankName}</h3>
      <p className="text-gray-600">Moneda: {account.baseCurrency}</p>
      <p className="text-gray-600">Saldo: {account.initialBalance.toFixed(2)}</p>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="mt-2 space-x-2">
        <button
          onClick={handleEdit}
          className="bg-yellow-500 text-white py-1 px-2 rounded-md hover:bg-yellow-600 transition-colors duration-200"
        >
          Editar
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600 transition-colors duration-200"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default BankAccountItem;

