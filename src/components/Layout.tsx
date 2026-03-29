import React from "react";
import { useAuth } from "../providers/AuthProvider";
import { useTheme } from "../providers/ThemeProvider";
import { LogOut, Wallet, Sun, Moon } from "lucide-react";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100 hidden sm:block">
                Expense<span className="text-blue-600 dark:text-blue-400">Tracker</span>
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-amber-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              {user && (
                <>
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user.displayName || user.email?.split("@")[0]}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{user.email}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-full transition-all"
                    title="Sign Out"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
