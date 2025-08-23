import React from "react";
import "./CategoryModal.scss";

const EditCategoryModal = ({ categoryModalOpen, onClose, category }) => {
  const handleEditCategory = (e, categoryName) => {
    console.log("Edit Category");
  };

  const [newCategoryName, setNewCategoryName] = useState(category.name);

  return (
    <div className="categoryModal">
      <div className="modal-content">
        <h3>Add Category</h3>
        <form onSubmit={() => handleEditCategory(newCategoryName)}>
          <label htmlFor="category-name">Rename Category</label>
          <input
            type="text"
            name="category-name"
            id="category-name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <button type="submit">Edit Category</button>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryModal;
