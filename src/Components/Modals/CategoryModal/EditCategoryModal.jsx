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
import { Trash, X, FolderOpen, Edit } from "lucide-react";

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
      className="category-modal-overlay"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
    >
      <div className="category-modal">
        <div className="modal-header">
          <h2>Edit Category</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="category-form">
          <div className="form-section">
            <label className="form-label" htmlFor="category-name">
              <FolderOpen size={16} />
              Category Name
            </label>
            <input
              type="text"
              name="category-name"
              id="category-name"
              placeholder="Enter category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="form-input"
              required
              maxLength={30}
            />
            <small className="form-help">
              {newCategoryName.length}/30 characters
            </small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Edit size={16} />
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="btn btn-danger"
            >
              <Trash size={16} />
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditCategoryModal;
