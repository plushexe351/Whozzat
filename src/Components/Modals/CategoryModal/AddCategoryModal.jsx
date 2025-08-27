import React, { useState } from "react";
import "./CategoryModal.scss";
import { handleAddCategory } from "../../../utils/linkHandlers";
import { useAuth } from "../../../Context/AuthContext";
import { useData } from "../../../Context/DataContext";
import { motion } from "framer-motion";
import { useToast } from "../../../Context/ToastContext";

const AddCategoryModal = ({ open, onClose, setCategory }) => {
  if (!open) return null;

  const { user } = useAuth();
  const { setCategories } = useData();
  const { addToast } = useToast();

  const [newCategory, setNewCategory] = useState("");

  return (
    <motion.div
      className="categoryModal"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
    >
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Add Category</h2>
        <form
          className="category-form"
          onSubmit={(e) => {
            handleAddCategory(
              e,
              user,
              newCategory,
              setNewCategory,
              setCategories,
              setCategory,
              addToast
            );
            onClose();
          }}
        >
          <label htmlFor="category-name"></label>
          <input
            type="text"
            name="category-name"
            id="category-name"
            placeholder="New category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            required
          />
          <button type="submit" className="submit">
            Add Category
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default AddCategoryModal;
