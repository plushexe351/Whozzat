import React, { useState } from "react";
import "./CategoryModal.scss";
import {
  handleDeleteCategory,
  handleEditCategory,
} from "../../../utils/linkHandlers";
import { useAuth } from "../../../Context/AuthContext";
import { useData } from "../../../Context/DataContext";
import { useToast } from "../../../Context/ToastContext";
import { motion } from "framer-motion";
import { Trash } from "lucide-react";

const EditCategoryModal = ({ open, onClose, category, setCategory }) => {
  if (!open) return null;

  const [newCategoryName, setNewCategoryName] = useState(category?.name || "");

  const { user } = useAuth();
  const { setCategories } = useData();
  const { addToast } = useToast();

  const categoryId = category?.id;

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEditCategory(
      categoryId,
      newCategoryName,
      user,
      setCategories,
      setCategory,
      onClose,
      addToast
    );
  };

  const handleDelete = () => {
    handleDeleteCategory(
      categoryId,
      user,
      setCategories,
      setCategory,
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
        <h2>Edit Category</h2>
        <form onSubmit={handleSubmit} className="category-form">
          <label htmlFor="category-name"></label>
          <input
            type="text"
            name="category-name"
            id="category-name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <div className="buttons">
            <button type="submit" className="submit">
              Rename
            </button>
            <button type="button" className="delete" onClick={handleDelete}>
              <Trash size={20} stroke="red" />
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditCategoryModal;
