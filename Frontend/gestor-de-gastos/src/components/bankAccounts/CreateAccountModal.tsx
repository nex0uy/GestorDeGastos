import React, { useState } from 'react';
import { createBankAccount } from '../../services/api';
import { getUserData } from '../../utils/storage';

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountCreated: () => void;
}

const CreateAccountModal: React.FC<CreateAccountModalProps> = ({ isOpen, onClose, onAccountCreated }) => {
  const [newAccount, setNewAccount] = useState({
    bankName: '',
    baseCurrency: '',
    initialBalance: 0,
  });
  const [error, setError] = useState('');

  const handleCreateAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userData = getUserData();
      if (userData) {
        await createBankAccount({
          ...newAccount,
          user: { userId: userData.userId },
        });
        onAccountCreated();
        onClose();
        setNewAccount({ bankName: '', baseCurrency: '', initialBalance: 0 });
      }
    } catch (err) {
      setError('Error al crear la cuenta bancaria');
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Crear Nueva Cuenta</h2>
        <form onSubmit={handleCreateAccount}>
          <div className="mb-4">
            <label htmlFor="bankName" className="block mb-2">Nombre del Banco</label>
            <input
              id="bankName"
              type="text"
              value={newAccount.bankName}
              onChange={(e) => setNewAccount({ ...newAccount, bankName: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="baseCurrency" className="block mb-2">Moneda Base</label>
            <select
              id="baseCurrency"
              value={newAccount.baseCurrency}
              onChange={(e) => setNewAccount({ ...newAccount, baseCurrency: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Seleccione una moneda</option>
              <option value="UYU">UYU</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="initialBalance" className="block mb-2">Saldo Inicial</label>
            <input
              id="initialBalance"
              type="number"
              value={newAccount.initialBalance}
              onChange={(e) => setNewAccount({ ...newAccount, initialBalance: parseFloat(e.target.value) })}
              className="w-full p-2 border rounded"
              required
              step="0.01"
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 rounded">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Crear Cuenta</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAccountModal;

