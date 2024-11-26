import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HomeIcon, CreditCardIcon, ChartPieIcon, ChartBarIcon, ArrowLeftOnRectangleIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { Bars3Icon } from '@heroicons/react/24/solid';
import { clearUserData } from '../../utils/storage';

interface SidebarProps {
  updateAuthStatus: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ updateAuthStatus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearUserData();
    updateAuthStatus();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-20 bg-gray-800 text-white p-2 rounded-md"
        aria-label="Toggle sidebar"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>
      <div className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-10`}>
        <nav>
          <Link to="/" onClick={closeSidebar} className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname === '/' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
            <HomeIcon className="h-5 w-5 inline-block mr-2" />
            Dashboard
          </Link>
          <Link to="/bank-accounts" onClick={closeSidebar} className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname === '/bank-accounts' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
            <CreditCardIcon className="h-5 w-5 inline-block mr-2" />
            Cuentas Bancarias
          </Link>
          <Link to="/budgets" onClick={closeSidebar} className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname === '/budgets' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
            <CurrencyDollarIcon className="h-5 w-5 inline-block mr-2" />
            Presupuestos
          </Link>
          <Link to="/monthly-report" onClick={closeSidebar} className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname === '/monthly-report' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
            <ChartPieIcon className="h-5 w-5 inline-block mr-2" />
            Reporte Mensual
          </Link>
          <Link to="/category-report" onClick={closeSidebar} className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname === '/category-report' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
            <ChartBarIcon className="h-5 w-5 inline-block mr-2" />
            Reporte por Categoría
          </Link>
        </nav>
        <button
          onClick={handleLogout}
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 w-full text-left"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 inline-block mr-2" />
          Cerrar Sesión
        </button>
      </div>
    </>
  );
};

export default Sidebar;

