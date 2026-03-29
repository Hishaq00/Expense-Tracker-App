import React, { useState, useEffect } from "react";
import { userService } from "../services/userService";
import { UserProfile } from "../types";
import { User, Shield, ShieldOff, Mail, Calendar, Search, Filter, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function AdminUserList() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  useEffect(() => {
    const unsubscribe = userService.subscribeToAllUsers((allUsers) => {
      setUsers(allUsers);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleToggleFreeze = async (user: UserProfile) => {
    try {
      await userService.toggleFreezeUser(user.uid, !user.isFrozen);
    } catch (error) {
      alert("Failed to update user status");
    }
  };

  const handleRemoveUser = async (user: UserProfile) => {
    if (window.confirm(`Are you sure you want to permanently remove ${user.displayName}?`)) {
      try {
        await userService.removeUser(user.uid);
      } catch (error) {
        alert("Failed to remove user");
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            className="flex-1 md:flex-none px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="parent">Parents</option>
            <option value="child">Children</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredUsers.map((user) => (
            <motion.div
              key={user.uid}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border transition-all ${
                user.isFrozen ? "border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-900/10" : "border-gray-100 dark:border-gray-700"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    user.role === 'admin' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                    user.role === 'parent' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                    'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  }`}>
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{user.displayName}</h3>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500">
                      {user.role}
                    </span>
                  </div>
                </div>
                {user.role !== 'admin' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleFreeze(user)}
                      className={`p-2 rounded-lg transition-colors ${
                        user.isFrozen 
                          ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50" 
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                      title={user.isFrozen ? "Unfreeze User" : "Freeze User"}
                    >
                      {user.isFrozen ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => handleRemoveUser(user)}
                      className="p-2 rounded-lg transition-colors bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
                      title="Remove User"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 opacity-40" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 opacity-40" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {user.isFrozen && (
                <div className="mt-4 pt-3 border-t border-red-100 dark:border-red-900/30">
                  <span className="text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-1">
                    <ShieldOff className="h-3 w-3" />
                    Account Frozen
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
          <User className="h-12 w-12 text-gray-200 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No users found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
