export type UserRole = "admin" | "parent" | "child" | "individual";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  parentId?: string; // For children
  isFrozen?: boolean;
  createdAt: string;
}

export interface Budget {
  parentId: string;
  totalBudget: number;
  remainingBalance: number;
  updatedAt: string;
}

export type Category = 
  | "Food" 
  "Fees"
  | "Transport" 
  | "Shopping" 
  | "Entertainment" 
  | "Health" 
  | "Utilities" 
  | "Other";

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: Category;
  date: string;
  childId: string;
  childName: string;
  parentId: string;
  createdAt: string;
}

export type FilterType = "daily" | "weekly" | "monthly" | "all";
