import React, { useState } from "react";
import "./CategoryModal.scss";
import { handleAddCategory } from "../../../utils/linkHandlers";
import { useAuth } from "../../../Context/AuthContext";
import { useData } from "../../../Context/DataContext";
import { motion } from "framer-motion";
import { useToast } from "../../../Context/ToastContext";
import { X, FolderPlus } from "lucide-react";

const AddCategoryModal = ({ open, onClose, setCategory }) => {
  if (!open) return null;

  const { user } = useAuth();
  const { setCategories } = useData();
  const { addToast } = useToast();

  const [newCategory, setNewCategory] = useState("");

  return (
    <motion.div
      className="category-modal-overlay"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
    >
      <div className="category-modal">
        <div className="modal-header">
          <h2>Add Category</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

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
          <div className="form-section">
            <label className="form-label" htmlFor="category-name">
              <FolderPlus size={16} />
              Category Name
            </label>
            <input
              type="text"
              name="category-name"
              id="category-name"
              placeholder="Enter category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="form-input"
              required
              maxLength={30}
            />
            <small className="form-help">
              {newCategory.length}/30 characters
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
              Add Category
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AddCategoryModal;
