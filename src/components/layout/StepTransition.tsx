"use client";

import { motion, AnimatePresence } from "framer-motion";

interface StepTransitionProps {
  children: React.ReactNode;
  stepKey: number;
}

export function StepTransition({ children, stepKey }: StepTransitionProps) {
  return (
      <AnimatePresence mode="wait">
        <motion.div
            key={stepKey}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
  );
}
