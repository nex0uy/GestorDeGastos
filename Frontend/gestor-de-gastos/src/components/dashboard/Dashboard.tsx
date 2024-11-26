import React, { useEffect, useState } from 'react';
import { getUserData } from '../../utils/storage';
import TransactionList from '../transactions/TransactionsList';

const Dashboard: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      setUserName(userData.userName);
    }
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p className="text-xl text-gray-600">Bienvenido, {userName}!</p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Balance</h3>
          <p className="text-2xl font-bold">$45,231.89</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Ingresos</h3>
          <p className="text-2xl font-bold text-green-600">$5,231.89</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Gastos</h3>
          <p className="text-2xl font-bold text-red-600">$3,231.89</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Cuentas Activas</h3>
          <p className="text-2xl font-bold">3</p>
        </div>
      </div>

      <TransactionList />
    </div>
  );
};

export default Dashboard;

