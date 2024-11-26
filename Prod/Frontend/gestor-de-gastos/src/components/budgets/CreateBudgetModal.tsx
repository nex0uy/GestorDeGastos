import React, { useState, useEffect } from 'react';
import { createBudget, CreateBudgetData } from '../../services/api_bud';
import { getAllCategories, Category } from '../../services/api_trans';
import { getUserData } from '../../utils/storage';

interface CreateBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBudgetCreated: () => void;
}

const CreateBudgetModal: React.FC<CreateBudgetModalProps> = ({ isOpen, onClose, onBudgetCreated }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<CreateBudgetData>({
    maxAmount: 0,
    alertTriggered: false,
    initialDate: new Date().toISOString().split('T')[0],
    category: { categoryId: 0 },
    user: { userId: 0 },
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Error al cargar las categorías. Por favor, intenta de nuevo.');
      }
    };

    if (isOpen) {
      fetchCategories();
      const userData = getUserData();
      if (userData) {
        setFormData(prev => ({ ...prev, user: { userId: userData.userId } }));
      }
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
             name === 'category' ? { categoryId: parseInt(value) } : 
             name === 'maxAmount' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBudget(formData);
      onBudgetCreated();
      onClose();
    } catch (err) {
      console.error('Error creating budget:', err);
      setError('Error al crear el presupuesto. Por favor, intenta de nuevo.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Crear Nuevo Presupuesto</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="maxAmount" className="block text-sm font-medium text-gray-700">Monto Máximo</label>
            <input
              type="number"
              id="maxAmount"
              name="maxAmount"
              value={formData.maxAmount}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="initialDate" className="block text-sm font-medium text-gray-700">Fecha Inicial</label>
            <input
              type="date"
              id="initialDate"
              name="initialDate"
              value={formData.initialDate}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoría</label>
            <select
              id="category"
              name="category"
              value={formData.category.categoryId}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Selecciona una categoría</option>
              {categories.map(category => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="alertTriggered"
                checked={formData.alertTriggered}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">Activar Alerta</span>
            </label>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Crear Presupuesto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBudgetModal;

