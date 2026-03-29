import React, { useState } from "react";
import { useExpenses } from "../providers/ExpenseProvider";
import { Trash2, Edit2, Calendar, Tag, Banknote, Search, Filter, Users, AlertTriangle, X } from "lucide-react";
import { format, parseISO } from "date-fns";
import { motion, AnimatePresence } from "motion/react";

export function ExpenseList({ onEdit }: { onEdit: (expense: any) => void }) {
  const { filteredExpenses, deleteExpense, loading } = useExpenses();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<any>(null);

  const handleDelete = async () => {
    if (!expenseToDelete) return;
    try {
      await deleteExpense(expenseToDelete.id, expenseToDelete.amount, expenseToDelete.parentId);
      setExpenseToDelete(null);
    } catch (error) {
      console.error("Failed to delete expense:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  if (filteredExpenses.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-dashed border-gray-300 dark:border-gray-700">
        <div className="bg-gray-50 dark:bg-gray-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="h-8 w-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">No expenses found</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Try changing your filters or add a new expense.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Recent Expenses
        </h3>
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {filteredExpenses.length} Entries
        </span>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
        {filteredExpenses.map((expense) => (
          <div 
            key={expense.id} 
            className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${getCategoryColor(expense.category)}`}>
                <Tag className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">{expense.title}</h4>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(parseISO(expense.date), "MMM d, yyyy")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {expense.category}
                  </span>
                  {expense.childName && (
                    <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
                      <Users className="h-3 w-3" />
                      {expense.childName}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end gap-6">
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900 dark:text-white flex items-center justify-end">
                  <span className="text-sm mr-1">Rs</span>
                  {expense.amount.toFixed(2)}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Paid on {format(parseISO(expense.date), "HH:mm")}</p>
              </div>
              
              <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all">
                <button
                  onClick={() => onEdit(expense)}
                  className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                  title="Edit"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setExpenseToDelete(expense)}
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {expenseToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 dark:border-gray-800"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-2xl">
                    <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-500" />
                  </div>
                  <button 
                    onClick={() => setExpenseToDelete(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Delete Expense?</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium mb-8">
                  Are you sure you want to delete <span className="text-gray-900 dark:text-gray-200 font-bold">"{expenseToDelete.title}"</span>? 
                  This will restore <span className="text-blue-600 dark:text-blue-400 font-bold">Rs {expenseToDelete.amount.toFixed(2)}</span> to your family budget.
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={() => setExpenseToDelete(null)}
                    className="flex-1 px-6 py-4 rounded-2xl font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-6 py-4 rounded-2xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 dark:shadow-none transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getCategoryColor(category: string) {
  switch (category) {
    case "Fees": return "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400";
    case "Food": return "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400";
    case "Transport": return "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400";
    case "Shopping": return "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400";
    case "Entertainment": return "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400";
    case "Health": return "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400";
    case "Utilities": return "bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400";
    default: return "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300";
  }
}
