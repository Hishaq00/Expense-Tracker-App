import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Wallet, ShieldCheck, Users, TrendingUp, ArrowRight, Check } from "lucide-react";

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const STEPS: Step[] = [
  {
    title: "Family Finance Management",
    description: "Manage your family's spending in one place. Set budgets for children and track expenses in real-time.",
    icon: <Wallet className="h-10 w-10" />,
    color: "bg-blue-600 dark:bg-blue-500",
  },
  {
    title: "Secure and Private",
    description: "Your data is protected with enterprise-grade security. Only family members can access shared financial information.",
    icon: <ShieldCheck className="h-10 w-10" />,
    color: "bg-green-600 dark:bg-green-500",
  },
  {
    title: "Role-Based Access",
    description: "Admins manage users, parents manage budgets, and children track their own spending habits.",
    icon: <Users className="h-10 w-10" />,
    color: "bg-purple-600 dark:bg-purple-500",
  },
  {
    title: "Smart Analytics",
    description: "Visualize your spending patterns with intuitive charts and category breakdowns.",
    icon: <TrendingUp className="h-10 w-10" />,
    color: "bg-orange-600 dark:bg-orange-500",
  },
];

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-950 flex items-center justify-center z-[90] p-6 transition-colors">
      <div className="max-w-md w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col items-center text-center gap-8"
          >
            <div className={`w-24 h-24 ${STEPS[currentStep].color} rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-gray-200 dark:shadow-none`}>
              {STEPS[currentStep].icon}
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
                {STEPS[currentStep].title}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
                {STEPS[currentStep].description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-16 flex flex-col items-center gap-8">
          <div className="flex gap-2">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentStep ? "w-8 bg-blue-600 dark:bg-blue-500" : "w-2 bg-gray-200 dark:bg-gray-800"
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-full py-5 px-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all active:scale-95 shadow-xl shadow-gray-200 dark:shadow-none"
          >
            {currentStep === STEPS.length - 1 ? (
              <>
                Get Started
                <Check className="h-5 w-5" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
          
          <button 
            onClick={onComplete}
            className="text-gray-400 dark:text-gray-500 font-bold text-sm hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            Skip Intro
          </button>
        </div>
      </div>
    </div>
  );
}
