import React, { useState } from "react";
import { useExpenses } from "../providers/ExpenseProvider";
import { useAuth } from "../providers/AuthProvider";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { TrendingUp, CreditCard, Calendar as CalendarIcon, PieChart as PieChartIcon, Users, Wallet, AlertCircle, ChevronDown, RefreshCw } from "lucide-react";
import { useTheme } from "../providers/ThemeProvider";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#6b7280"];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function Dashboard() {
  const { profile } = useAuth();
  const { theme } = useTheme();
  const { 
    totalSpending, 
    weeklySpending, 
    categoryBreakdown, 
    childSpendingBreakdown,
    budget, 
    children,
    allUsers,
    allParents,
    selectedMonth,
    setSelectedMonth,
    updateBudget,
    refreshData,
    loading
  } = useExpenses();
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [newBudget, setNewBudget] = useState(budget?.totalBudget.toString() || "0");

  const handleUpdateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateBudget(parseFloat(newBudget));
    setIsEditingBudget(false);
  };

  const isLowBalance = budget && budget.remainingBalance < (budget.totalBudget * 0.2);

  const getDashboardTitle = () => {
    if (profile?.role === "admin") return "Global Overview";
    if (profile?.role === "parent") return "Family Dashboard";
    return "My Spending";
  };

  const getSpendingLabel = () => {
    if (profile?.role === "admin") return "Total Platform Spending";
    if (profile?.role === "parent") return "Total Family Spending";
    return "My Total Spending";
  };

  // Safe color variables for recharts
  const chartTextColor = theme === 'dark' ? '#9ca3af' : '#6b7280';
  const gridColor = theme === 'dark' ? '#374151' : '#f3f4f6';

  return (
    <div className="space-y-8">
      {/* Header with Month Selector and Refresh */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            {getDashboardTitle()}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            {profile?.role === 'admin' ? 'Monitoring all family accounts' : 'Manage your finances'}
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={refreshData}
            disabled={loading}
            className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-75 disabled:cursor-not-allowed"
            title="Refresh Data"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin text-blue-600 dark:text-blue-400" : ""}`} />
          </button>
          
          <div className="relative group flex-1 sm:flex-none">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="w-full appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-6 py-3 pr-10 rounded-xl font-bold text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer shadow-sm"
            >
              {MONTHS.map((month, index) => (
                <option key={month} value={index}>{month}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Budget Card (Parent/Child) */}
        {(profile?.role === "parent" || profile?.role === "child") && budget && (
          <div className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border transition-all ${isLowBalance ? "border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-900/10" : "border-gray-100 dark:border-gray-700"}`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${isLowBalance ? "bg-red-100 dark:bg-red-900/40" : "bg-blue-50 dark:bg-blue-900/20"}`}>
                <Wallet className={`h-6 w-6 ${isLowBalance ? "text-red-600 dark:text-red-400" : "text-blue-600 dark:text-blue-400"}`} />
              </div>
              {profile?.role === "parent" && (
                <button 
                  onClick={() => setIsEditingBudget(!isEditingBudget)}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
                >
                  {isEditingBudget ? "Cancel" : "Set Budget"}
                </button>
              )}
            </div>
            
            {isEditingBudget ? (
              <form onSubmit={handleUpdateBudget} className="space-y-2">
                <input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-bold transition-colors">
                  Update
                </button>
              </form>
            ) : (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-tight">Remaining Balance</p>
                <h3 className={`text-2xl font-black ${isLowBalance ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-white"}`}>
                  Rs {budget.remainingBalance.toFixed(2)}
                </h3>
                <div className="mt-2 w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${isLowBalance ? "bg-red-500 dark:bg-red-600" : "bg-blue-600 dark:bg-blue-500"}`}
                    style={{ width: `${Math.min(100, (budget.remainingBalance / budget.totalBudget) * 100)}%` }}
                  />
                </div>
                {isLowBalance && (
                  <p className="text-[10px] text-red-600 dark:text-red-400 mt-1 font-bold flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Low Balance Warning!
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-tight">{getSpendingLabel()}</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">Rs {totalSpending.toFixed(2)}</h3>
          </div>
        </div>

        {profile?.role === "parent" && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-tight">Children Accounts</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{children.length}</h3>
            </div>
          </div>
        )}

        {profile?.role === "admin" && (
          <>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-tight">Total Users</p>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">{allUsers.length}</h3>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-tight">Total Families</p>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">{allParents.length}</h3>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Spending Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-gray-900 dark:text-white">Weekly Spending Trend</h3>
          </div>
          <div className="h-[300px] w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={weeklySpending}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 12 }} tickFormatter={(value) => `Rs ${value}`} />
                <Tooltip 
                  cursor={{ fill: theme === 'dark' ? '#374151' : '#f9fafb' }} 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                    color: theme === 'dark' ? '#f3f4f6' : '#111827'
                  }} 
                />
                <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-6">
            <PieChartIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h3 className="font-bold text-gray-900 dark:text-white">Category Breakdown</h3>
          </div>
          <div className="h-[300px] w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke={theme === 'dark' ? '#1f2937' : '#ffffff'}
                  strokeWidth={2}
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                    color: theme === 'dark' ? '#f3f4f6' : '#111827'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {categoryBreakdown.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spending by Child (Parent Only) */}
      {profile?.role === "parent" && childSpendingBreakdown.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">Spending by Child</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Breakdown of expenses per child for {MONTHS[selectedMonth]}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {childSpendingBreakdown.map((child) => (
              <div key={child.id} className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{child.name}</h4>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">Total Spent</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-gray-900 dark:text-white">Rs {child.value.toFixed(2)}</span>
                  </div>
                </div>
                
                {budget && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                      <span className="text-gray-400 dark:text-gray-500">Of Family Budget</span>
                      <span className="text-blue-600 dark:text-blue-400">{((child.value / budget.totalBudget) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (child.value / budget.totalBudget) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
