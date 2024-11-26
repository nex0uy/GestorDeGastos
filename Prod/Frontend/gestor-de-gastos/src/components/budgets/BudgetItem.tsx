import React from 'react';
import { Budget } from '../../services/api_bud';

interface BudgetItemProps {
  budget: Budget;
  onDelete: (budgetId: number) => void;
  onEdit: (budget: Budget) => void;
}

const BudgetItem: React.FC<BudgetItemProps> = ({ budget, onDelete, onEdit }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">{budget.category.categoryName}</h2>
      <p className="text-gray-600">Monto máximo: ${budget.maxAmount.toFixed(2)}</p>
      <p className="text-gray-600">Fecha inicial: {new Date(budget.initialDate).toLocaleDateString()}</p>
      <p className="text-gray-600">
        Alerta: {budget.alertTriggered ? 'Activada' : 'No activada'}
      </p>
      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={() => onEdit(budget)}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(budget.budgetId)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default BudgetItem;

