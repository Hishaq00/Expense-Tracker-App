import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./providers/AuthProvider";
import { ExpenseProvider } from "./providers/ExpenseProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import { Layout } from "./components/Layout";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { Dashboard } from "./components/Dashboard";
import { ExpenseList } from "./components/ExpenseList";
import { ExpenseForm } from "./components/ExpenseForm";
import { AddChildForm } from "./components/AddChildForm";
import { AdminUserList } from "./components/AdminUserList";
import { SplashScreen } from "./components/SplashScreen";
import { Onboarding } from "./components/Onboarding";
import { Plus, Wallet, ShieldAlert, Users, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { signOut } from "firebase/auth";
import { auth } from "./lib/firebase";

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showChildForm, setShowChildForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [view, setView] = useState<"dashboard" | "users">("dashboard");
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Show splash for 2 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
      const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
      if (!hasSeenOnboarding) {
        setShowOnboarding(true);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    setShowOnboarding(false);
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-blue-600 rounded-2xl animate-pulse">
            <Wallet className="h-10 w-10 text-white" />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md"
            >
              <Login onToggle={() => setIsLogin(false)} />
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md"
            >
              <Signup onToggle={() => setIsLogin(true)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (profile.isFrozen) {
    return (
      <div className="min-h-screen bg-red-50 dark:bg-red-950 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl border border-red-100 dark:border-red-900 text-center"
        >
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Account Frozen</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Your account has been frozen by the administrator. You cannot perform any actions at this time.
          </p>
          <button
            onClick={() => signOut(auth)}
            className="w-full py-4 px-6 bg-gray-900 dark:bg-black text-white rounded-2xl font-bold hover:bg-gray-800 dark:hover:bg-gray-900 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            Sign Out
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <ExpenseProvider>
      <Layout>
        <div className="space-y-12">
          {profile.role === "admin" && (
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl w-fit">
              <button
                onClick={() => setView("dashboard")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                  view === "dashboard" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </button>
              <button
                onClick={() => setView("users")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                  view === "users" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                <Users className="h-5 w-5" />
                Users
              </button>
            </div>
          )}

          {view === "dashboard" ? (
            <>
              <Dashboard />
              
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Expenses</h2>
                  <div className="flex w-full sm:w-auto gap-3">
                    {profile.role === "parent" && (
                      <button
                        onClick={() => setShowChildForm(true)}
                        className="flex-1 sm:flex-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
                      >
                        <Plus className="h-5 w-5" />
                        Add Child
                      </button>
                    )}
                    {profile.role !== "admin" && (
                      <button
                        onClick={() => setShowForm(true)}
                        className="flex-1 sm:flex-none bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 dark:shadow-none active:scale-95"
                      >
                        <Plus className="h-5 w-5" />
                        Add Expense
                      </button>
                    )}
                  </div>
                </div>
                
                <ExpenseList 
                  onEdit={(expense) => {
                    setEditingExpense(expense);
                    setShowForm(true);
                  }} 
                />
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">User Management</h2>
              <AdminUserList />
            </div>
          )}
        </div>

        {showForm && (
          <ExpenseForm 
            expense={editingExpense} 
            onClose={() => {
              setShowForm(false);
              setEditingExpense(null);
            }} 
          />
        )}

        {showChildForm && (
          <AddChildForm onClose={() => setShowChildForm(false)} />
        )}
      </Layout>
    </ExpenseProvider>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
