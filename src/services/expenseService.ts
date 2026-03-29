import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot, 
  orderBy,
  getDoc,
  runTransaction
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { Expense, UserProfile } from "../types";

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const expenseService = {
  async addExpense(expense: Omit<Expense, "id" | "childId" | "parentId" | "createdAt">, userProfile: UserProfile) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const parentId = userProfile.role === "parent" ? user.uid : userProfile.parentId;
    if (!parentId) throw new Error("Parent ID not found");

    const path = `expenses`;
    const budgetPath = `budgets/${parentId}`;

    try {
      await runTransaction(db, async (transaction) => {
        const budgetDoc = await transaction.get(doc(db, budgetPath));
        if (!budgetDoc.exists()) {
          throw new Error("Budget not found for this family");
        }

        const budgetData = budgetDoc.data();
        if (budgetData.remainingBalance < expense.amount) {
          throw new Error("Insufficient budget balance");
        }

        // 1. Create Expense
        const expenseRef = doc(collection(db, path));
        transaction.set(expenseRef, {
          ...expense,
          childId: user.uid,
          childName: userProfile.displayName || user.email?.split("@")[0] || "Unknown",
          parentId: parentId,
          createdAt: new Date().toISOString(),
        });

        // 2. Update Budget
        transaction.update(doc(db, budgetPath), {
          remainingBalance: budgetData.remainingBalance - expense.amount,
          updatedAt: new Date().toISOString()
        });
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  subscribeToExpenses(userProfile: UserProfile, callback: (expenses: Expense[]) => void) {
    const user = auth.currentUser;
    if (!user) return () => {};

    let q;
    if (userProfile.role === "admin") {
      q = query(collection(db, "expenses"), orderBy("date", "desc"));
    } else if (userProfile.role === "parent") {
      q = query(collection(db, "expenses"), where("parentId", "==", user.uid), orderBy("date", "desc"));
    } else {
      q = query(collection(db, "expenses"), where("childId", "==", user.uid), orderBy("date", "desc"));
    }

    return onSnapshot(q, (snapshot) => {
      const expenses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Expense[];
      callback(expenses);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "expenses");
    });
  },

  async deleteExpense(expenseId: string, amount: number, parentId: string) {
    const path = `expenses/${expenseId}`;
    const budgetPath = `budgets/${parentId}`;

    try {
      await runTransaction(db, async (transaction) => {
        const budgetDoc = await transaction.get(doc(db, budgetPath));
        if (!budgetDoc.exists()) {
          throw new Error("Budget not found for this family");
        }

        const budgetData = budgetDoc.data();

        // 1. Delete Expense
        transaction.delete(doc(db, "expenses", expenseId));

        // 2. Update Budget
        transaction.update(doc(db, budgetPath), {
          remainingBalance: budgetData.remainingBalance + amount,
          updatedAt: new Date().toISOString()
        });
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }
};
