import React, { useEffect, useState } from 'react';
import { getUserData } from '../../utils/storage';

const Dashboard: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      setUserName(userData.userName);
    }
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-xl">Bienvenido, {userName}!</p>
      <p className="mt-4">Aquí podrás ver un resumen de tus finanzas y acceder a todas las funcionalidades de la aplicación.</p>
    </div>
  );
};

export default Dashboard;

