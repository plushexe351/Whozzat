import React, { createContext, useContext, useState } from "react";
import Toasty from "../Components/Toasty/Toasty";
import { AnimatePresence } from "framer-motion";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const addToast = (message, type = "default") => {
    setToast({ message, type });
    setTimeout(() => removeToast(), 4000);
  };

  const removeToast = () => {
    setToast(null);
  };

  return (
    <ToastContext.Provider value={{ toast, addToast }}>
      {children}
      <AnimatePresence mode="wait">
        {toast !== null && <Toasty key={toast.message + toast.type} />}
      </AnimatePresence>
    </ToastContext.Provider>
  );
};
