import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import Auth from './components/auth/Auth';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import BankAccounts from './components/BankAccounts';
import { getUserData, clearUserData } from './utils/storage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const updateAuthStatus = useCallback(() => {
    const userData = getUserData();
    setIsAuthenticated(!!userData);
  }, []);

  useEffect(() => {
    updateAuthStatus();
  }, [updateAuthStatus]);

  const Layout = ({ children }: { children: React.ReactNode }) => (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {isAuthenticated && <Sidebar updateAuthStatus={updateAuthStatus} />}
      <div className="flex-1 p-4 md:p-6">
        {children}
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" replace /> : <Auth setIsAuthenticated={setIsAuthenticated} />
        } />
        <Route path="/" element={
          <Layout>
            {isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />}
          </Layout>
        } />
        <Route path="/bank-accounts" element={
          <Layout>
            {isAuthenticated ? <BankAccounts /> : <Navigate to="/login" replace />}
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
