import React, { useState, useEffect } from 'react';
import { getAllBudgets, deleteBudget, Budget } from '../../services/api_bud';
import LoadingSpinner from '../common/LoadingSpinner';
import BudgetItem from './BudgetItem';
import CreateBudgetModal from './CreateBudgetModal';
import EditBudgetModal from './EditBudgetModal';

const BudgetList: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const data = await getAllBudgets();
      setBudgets(data);
    } catch (err) {
      setError('Error al cargar los presupuestos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleDelete = async (budgetId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este presupuesto?')) {
      try {
        await deleteBudget(budgetId);
        setBudgets(budgets.filter(budget => budget.budgetId !== budgetId));
      } catch (err) {
        setError('Error al eliminar el presupuesto. Por favor, intenta de nuevo.');
      }
    }
  };

  const handleEdit = (budget: Budget) => {
    setSelectedBudget(budget);
    setIsEditModalOpen(true);
  };

  const handleCreateBudget = () => {
    setIsCreateModalOpen(true);
  };

  const handleBudgetCreated = () => {
    fetchBudgets();
  };

  const handleBudgetUpdated = () => {
    fetchBudgets();
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 border-l-4 border-red-400">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Presupuestos</h1>
        <button
          onClick={handleCreateBudget}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Crear Presupuesto
        </button>
      </div>
      {budgets.length === 0 ? (
        <p className="text-gray-500 text-center">No hay presupuestos registrados.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => (
            <BudgetItem 
              key={budget.budgetId} 
              budget={budget} 
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
      <CreateBudgetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onBudgetCreated={handleBudgetCreated}
      />
      <EditBudgetModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onBudgetUpdated={handleBudgetUpdated}
        budget={selectedBudget}
      />
    </div>
  );
};

export default BudgetList;

