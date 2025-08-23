import React from "react";
import "./Toasty.scss";
import { useToast } from "../../Context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";

const Toasty = () => {
  const { toast } = useToast();
  if (!toast || !toast.message) return null;
  return (
    <div className="toast-modal">
      <motion.div
        initial={{ opacity: 0, y: 200, scale: 0 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, x: 200 }}
        className={`toast-container ${
          toast.type === "error"
            ? "error"
            : toast.type === "success"
            ? "success"
            : toast.type === "default"
            ? "default"
            : ""
        }`}
      >
        {toast.message}
      </motion.div>
    </div>
  );
};

export default Toasty;
