import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { login, signup } from '../../services/api';
import { setUserData, getUserData } from '../../utils/storage';
import LoadingSpinner from '../common/LoadingSpinner';

interface AuthProps {
  setIsAuthenticated: (value: boolean) => void;
}

const Auth: React.FC<AuthProps> = ({ setIsAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      if (isLogin) {
        const data = await login(username, password);
        setUserData(data);
        setIsAuthenticated(true);
        const storedData = getUserData();
        navigate('/');
      } else {
        const signupData = await signup(username, password);
        setSuccessMessage('Registro exitoso. Por favor, inicia sesión.');
        setTimeout(() => {
          setIsLogin(true);
          setSuccessMessage('');
        }, 3000);
      }
      setError('');
    } catch (err) {
      setError(isLogin ? 'Error de inicio de sesión. Por favor, verifica tus credenciales.' : 'Error de registro. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <h1 className="text-center text-4xl font-extrabold text-gray-900 mb-2">Gestor de Gastos</h1>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
            {isLogin ? 'Inicia sesión en tu cuenta' : 'Crea una nueva cuenta'}
          </h2>
        </div>
        {successMessage && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
            </div>
          </div>
        )}
        {isLogin ? (
          <LoginForm onSubmit={handleAuth} error={error} />
        ) : (
          <SignupForm onSubmit={handleAuth} error={error} />
        )}
        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out"
          >
            {isLogin ? '¿Necesitas una cuenta? Regístrate' : '¿Ya tienes una cuenta? Inicia sesión'}
          </button>
        </div>
        {isLoading && <LoadingSpinner />}
      </div>
    </div>
  );
};

export default Auth;

