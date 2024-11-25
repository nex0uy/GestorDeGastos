import React, { useState, useEffect } from 'react';
import { getUserData } from '../utils/storage';
import { getBankAccounts } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import BankAccountItem from './BankAccountItem';
import CreateAccountModal from './CreateAccountModal';

interface BankAccount {
  bankAccountId: number;
  bankName: string;
  baseCurrency: string;
  initialBalance: number;
  user: {
    userId: number;
  };
}

const BankAccounts: React.FC = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const userData = getUserData();
      if (userData) {
        const data = await getBankAccounts(userData.userId);
        setAccounts(data);
      }
    } catch (err) {
      setError('Error al cargar las cuentas bancarias');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cuentas Bancarias</h1>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          + Agregar Cuenta
        </button>
      </div>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <div className="grid grid-cols-1 gap-4">
        {accounts.length === 0 ? (
          <p className="text-gray-500 text-center">No tienes cuentas bancarias. Crea una nueva cuenta.</p>
        ) : (
          accounts.map((account) => (
            <BankAccountItem
              key={account.bankAccountId}
              account={account}
              onUpdate={fetchAccounts}
              onDelete={fetchAccounts}
            />
          ))
        )}
      </div>
      <CreateAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAccountCreated={fetchAccounts}
      />
    </div>
  );
};

export default BankAccounts;

