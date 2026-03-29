import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { Expense, FilterType, Budget, UserProfile } from "../types";
import { expenseService } from "../services/expenseService";
import { userService } from "../services/userService";
import { useAuth } from "./AuthProvider";
import { 
  isToday, 
  isThisWeek, 
  isThisMonth, 
  parseISO,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  getMonth
} from "date-fns";

interface ExpenseContextType {
  expenses: Expense[];
  filteredExpenses: Expense[];
  filter: FilterType;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  setFilter: (filter: FilterType) => void;
  totalSpending: number;
  categoryBreakdown: { name: string; value: number }[];
  childSpendingBreakdown: { name: string; value: number; id: string }[];
  weeklySpending: { name: string; amount: number }[];
  budget: Budget | null;
  children: UserProfile[];
  allUsers: UserProfile[];
  allParents: UserProfile[];
  loading: boolean;
  addExpense: (expense: Omit<Expense, "id" | "childId" | "parentId" | "createdAt">) => Promise<void>;
  deleteExpense: (expenseId: string, amount: number, parentId: string) => Promise<void>;
  updateBudget: (total: number) => Promise<void>;
  refreshData: () => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const { user, profile } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [childrenList, setChildrenList] = useState<UserProfile[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [allParents, setAllParents] = useState<UserProfile[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!user || !profile) {
      setExpenses([]);
      setBudget(null);
      setChildrenList([]);
      setAllUsers([]);
      setAllParents([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // 1. Subscribe to Expenses
    const unsubExpenses = expenseService.subscribeToExpenses(profile, (data) => {
      setExpenses(data);
      setLoading(false);
    });

    // 2. Subscribe to Budget (Parent/Child)
    const parentId = profile.role === "parent" ? user.uid : profile.parentId;
    let unsubBudget = () => {};
    if (parentId) {
      unsubBudget = userService.subscribeToBudget(parentId, (data) => {
        setBudget(data);
      });
    }

    // 3. Subscribe to Children (Parent)
    let unsubChildren = () => {};
    if (profile.role === "parent") {
      unsubChildren = userService.subscribeToChildren(user.uid, (data) => {
        setChildrenList(data);
      });
    }

    // 4. Subscribe to All Users/Parents (Admin)
    let unsubAllUsers = () => {};
    let unsubAllParents = () => {};
    if (profile.role === "admin") {
      unsubAllUsers = userService.subscribeToAllUsers((data) => {
        setAllUsers(data);
      });
      unsubAllParents = userService.subscribeToParents((data) => {
        setAllParents(data);
      });
    }

    return () => {
      unsubExpenses();
      unsubBudget();
      unsubChildren();
      unsubAllUsers();
      unsubAllParents();
    };
  }, [user, profile, refreshKey]);

  const refreshData = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const date = parseISO(expense.date);
      
      // Month filter
      if (getMonth(date) !== selectedMonth) return false;

      // Time filter
      if (filter === "daily") return isToday(date);
      if (filter === "weekly") return isThisWeek(date);
      if (filter === "monthly") return isThisMonth(date);
      return true;
    });
  }, [expenses, filter, selectedMonth]);

  const totalSpending = useMemo(() => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [filteredExpenses]);

  const categoryBreakdown = useMemo(() => {
    const breakdown: Record<string, number> = {};
    filteredExpenses.forEach((expense) => {
      breakdown[expense.category] = (breakdown[expense.category] || 0) + expense.amount;
    });
    return Object.entries(breakdown).map(([name, value]) => ({ name, value }));
  }, [filteredExpenses]);

  const childSpendingBreakdown = useMemo(() => {
    if (!profile || profile.role !== "parent") return [];
    const breakdown: Record<string, { value: number; name: string }> = {};
    
    filteredExpenses.forEach((expense) => {
      if (!breakdown[expense.childId]) {
        breakdown[expense.childId] = { value: 0, name: expense.childName };
      }
      breakdown[expense.childId].value += expense.amount;
    });

    return Object.entries(breakdown).map(([id, data]) => ({ 
      id, 
      name: data.name, 
      value: data.value 
    }));
  }, [filteredExpenses, profile]);

  const weeklySpending = useMemo(() => {
    const now = new Date();
    const start = startOfWeek(now);
    const end = endOfWeek(now);
    const days = eachDayOfInterval({ start, end });
    
    const spendingMap: Record<string, number> = {};
    days.forEach(day => {
      spendingMap[format(day, "EEE")] = 0;
    });

    expenses.forEach(expense => {
      const date = parseISO(expense.date);
      if (isThisWeek(date)) {
        const dayName = format(date, "EEE");
        spendingMap[dayName] = (spendingMap[dayName] || 0) + expense.amount;
      }
    });

    return Object.entries(spendingMap).map(([name, amount]) => ({ name, amount }));
  }, [expenses]);

  const addExpense = async (expense: Omit<Expense, "id" | "childId" | "parentId" | "createdAt">) => {
    if (!profile) return;
    await expenseService.addExpense(expense, profile);
  };

  const deleteExpense = async (expenseId: string, amount: number, parentId: string) => {
    await expenseService.deleteExpense(expenseId, amount, parentId);
  };

  const updateBudget = async (total: number) => {
    if (!profile || profile.role !== "parent") return;
    await userService.updateBudget(profile.uid, total);
  };

  return (
    <ExpenseContext.Provider value={{ 
      expenses, 
      filteredExpenses, 
      filter, 
      selectedMonth,
      setSelectedMonth,
      setFilter, 
      totalSpending, 
      categoryBreakdown,
      childSpendingBreakdown,
      weeklySpending,
      budget,
      children: childrenList,
      allUsers,
      allParents,
      loading,
      addExpense,
      deleteExpense,
      updateBudget,
      refreshData
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) throw new Error("useExpenses must be used within an ExpenseProvider");
  return context;
};
