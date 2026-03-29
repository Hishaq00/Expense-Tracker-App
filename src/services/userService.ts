import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection, 
  query, 
  where,
  onSnapshot,
  orderBy,
  runTransaction,
  deleteDoc
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { UserProfile, Budget } from "../types";

export const userService = {
  async createUserProfile(uid: string, email: string, displayName: string, role: "admin" | "parent" | "child", parentId?: string) {
    const path = `users/${uid}`;
    try {
      await setDoc(doc(db, path), {
        uid,
        email,
        displayName,
        role,
        parentId: parentId || null,
        createdAt: new Date().toISOString()
      });

      // If parent, initialize budget
      if (role === "parent") {
        await setDoc(doc(db, `budgets/${uid}`), {
          parentId: uid,
          totalBudget: 0,
          remainingBalance: 0,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  },

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const docRef = doc(db, `users/${uid}`);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as UserProfile) : null;
  },

  subscribeToChildren(parentId: string, callback: (children: UserProfile[]) => void) {
    const q = query(collection(db, "users"), where("parentId", "==", parentId), where("role", "==", "child"));
    return onSnapshot(q, (snapshot) => {
      const children = snapshot.docs.map(doc => doc.data() as UserProfile);
      callback(children);
    });
  },

  subscribeToParents(callback: (parents: UserProfile[]) => void) {
    const q = query(collection(db, "users"), where("role", "==", "parent"));
    return onSnapshot(q, (snapshot) => {
      const parents = snapshot.docs.map(doc => doc.data() as UserProfile);
      callback(parents);
    });
  },

  subscribeToAllUsers(callback: (users: UserProfile[]) => void) {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map(doc => doc.data() as UserProfile);
      callback(users);
    });
  },

  async toggleFreezeUser(uid: string, isFrozen: boolean) {
    const userRef = doc(db, `users/${uid}`);
    try {
      await updateDoc(userRef, { isFrozen });
    } catch (error) {
      console.error("Error toggling user freeze status:", error);
      throw error;
    }
  },

  async removeUser(uid: string) {
    const userRef = doc(db, `users/${uid}`);
    try {
      await deleteDoc(userRef);
    } catch (error) {
      console.error("Error removing user:", error);
      throw error;
    }
  },

  subscribeToBudget(parentId: string, callback: (budget: Budget) => void) {
    return onSnapshot(doc(db, `budgets/${parentId}`), (doc) => {
      if (doc.exists()) {
        callback(doc.data() as Budget);
      }
    });
  },

  async updateBudget(parentId: string, totalBudget: number) {
    const budgetRef = doc(db, `budgets/${parentId}`);
    try {
      await runTransaction(db, async (transaction) => {
        const budgetDoc = await transaction.get(budgetRef);
        if (!budgetDoc.exists()) throw new Error("Budget not found");

        const budgetData = budgetDoc.data() as Budget;
        const spent = budgetData.totalBudget - budgetData.remainingBalance;
        
        transaction.update(budgetRef, {
          totalBudget,
          remainingBalance: totalBudget - spent,
          updatedAt: new Date().toISOString()
        });
      });
    } catch (error) {
      console.error("Error updating budget:", error);
      throw error;
    }
  }
};
