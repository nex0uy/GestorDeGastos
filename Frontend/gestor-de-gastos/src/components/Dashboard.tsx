import React, { useEffect, useState } from 'react';
import { getUserData, clearUserData } from '../utils/storage';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      setUserName(userData.userName);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    clearUserData();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Bienvenido a tu Gestor de Gastos, {userName}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Aquí podrás gestionar tus gastos de manera eficiente.
        </p>
        <div className="mt-6 text-center">
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

