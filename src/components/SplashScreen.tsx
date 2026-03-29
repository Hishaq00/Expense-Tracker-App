import React from "react";
import { motion } from "motion/react";
import { Wallet } from "lucide-react";

export function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-950 flex flex-col items-center justify-center z-[100] transition-colors">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center gap-6"
      >
        <div className="w-24 h-24 bg-blue-600 dark:bg-blue-500 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-200 dark:shadow-blue-900/20">
          <Wallet className="h-12 w-12 text-white" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            FamilyFinance<span className="text-blue-600 dark:text-blue-400">Pro</span>
          </h1>
          <p className="text-gray-400 dark:text-gray-500 font-medium mt-1">Smart spending for smart families</p>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-12 flex flex-col items-center gap-4"
      >
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-2 h-2 bg-blue-600 dark:bg-blue-500 rounded-full"
            />
          ))}
        </div>
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 dark:text-gray-600">
          Initializing Secure Session
        </span>
      </motion.div>
    </div>
  );
}
