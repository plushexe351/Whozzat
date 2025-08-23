import React, { createContext, useContext, useState } from "react";
import Toasty from "../Components/Toasty/Toasty";
import { AnimatePresence, motion } from "framer-motion";

const UIContext = createContext();

export const useUI = () => useContext(UIContext);

export const UIProvider = ({ children }) => {
  const [showGreet, setShowGreet] = useState(true);

  return (
    <UIContext.Provider value={{ showGreet, setShowGreet }}>
      {children}
    </UIContext.Provider>
  );
};
