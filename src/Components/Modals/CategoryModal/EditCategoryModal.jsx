import React, { useState } from "react";
import "./CategoryModal.scss";
import { handleEditCategory } from "../../../utils/linkHandlers";
import { useAuth } from "../../../Context/AuthContext";
import { useData } from "../../../Context/DataContext";
import { useToast } from "../../../Context/ToastContext";
import { motion } from "framer-motion";

const EditCategoryModal = ({ open, onClose, category }) => {
  if (!open) return null;

  const [newCategoryName, setNewCategoryName] = useState(category?.name || "");

  const { user } = useAuth();
  const { setCategories } = useData();
  const { addToast } = useToast();

  const categoryId = category?.id;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Edit Category");
    handleEditCategory(
      categoryId,
      newCategoryName,
      user,
      setCategories,
      onClose,
      addToast
    );
  };

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
        <form onSubmit={handleSubmit} className="category-form">
          <label htmlFor="category-name"></label>
          <input
            type="text"
            name="category-name"
            id="category-name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <button type="submit" className="submit">
            Edit Category
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default EditCategoryModal;
