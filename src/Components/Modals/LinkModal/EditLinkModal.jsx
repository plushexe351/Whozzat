import React, { useState, useEffect } from "react";
import "./LinkModal.scss";
import {
  CloudUpload,
  Pin,
  PinOff,
  Trash,
  Trash2,
  X,
  Link,
  FileText,
  Image,
  FolderOpen,
} from "lucide-react";

const EditLinkModal = ({
  open,
  onClose,
  onEdit,
  onDelete,
  onPin,
  link,
  categories = [],
  onCategoryChange,
}) => {
  const [name, setName] = useState(link?.name || "");
  const [url, setUrl] = useState(link?.url || "");
  const [description, setDescription] = useState(link?.description || "");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(link?.imageUrl || null);
  const [pinned, setPinned] = useState(link?.pinned || false);
  const [category, setCategory] = useState(link?.category || "");

  useEffect(() => {
    setName(link?.name || "");
    setUrl(link?.url || "");
    setDescription(link?.description || "");
    setImage(null);
    setImagePreview(link?.imageUrl || null);
    setPinned(link?.pinned || false);
    setCategory(link?.category || "");
  }, [link]);

  if (!open) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedLink = {
      ...link,
      name,
      url,
      description,
      image,
      pinned,
      category,
      imageUrl: imagePreview ? link.imageUrl : null,
    };
    onEdit(updatedLink);
    onClose();
  };

  return (
    <div className="add-link-modal-overlay">
      <div className="add-link-modal">
        <div className="modal-header">
          <h2>Edit Link</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="actions">
          <button
            type="button"
            onClick={() => {
              setPinned(!pinned);
              onPin && onPin(link);
            }}
            className="action-btn pin-btn"
          >
            {pinned ? (
              <>
                <PinOff size={17} />
                Unpin
              </>
            ) : (
              <>
                <Pin size={17} />
                Pin
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => onDelete(link)}
            className="action-btn delete-btn"
          >
            <Trash size={17} /> Delete
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-link-form">
          {/* Link Name Section */}
          <div className="form-section">
            <label className="form-label">
              <Link size={16} />
              Link Name
            </label>
            <input
              className="form-input"
              type="text"
              placeholder="Enter link name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={50}
            />
          </div>

          {/* URL Section */}
          <div className="form-section">
            <label className="form-label">
              <Link size={16} />
              URL
            </label>
            <input
              className="form-input"
              type="url"
              placeholder="Enter link URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          {/* Description Section */}
          <div className="form-section">
            <label className="form-label">
              <FileText size={16} />
              Description (Optional)
            </label>
            <textarea
              className="form-textarea"
              placeholder="Enter link description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={200}
            />
            <small className="form-help">
              {description.length}/200 characters
            </small>
          </div>

          {/* Category Section */}
          <div className="form-section">
            <label className="form-label">
              <FolderOpen size={16} />
              Category
            </label>
            <select
              className="form-select"
              id="category"
              name="category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                onCategoryChange && onCategoryChange(e.target.value);
              }}
            >
              <option value="">No Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Image Section */}
          <div className="form-section">
            <label className="form-label">
              <Image size={16} />
              Link Image
            </label>
            <div className="image-upload-section">
              <button
                type="button"
                className="upload-btn"
                onClick={() =>
                  document.getElementById("link-image-edit").click()
                }
              >
                <CloudUpload size={18} />
                {imagePreview ? "Change Image" : "Add Image"}
              </button>
              <input
                name="link-image-edit"
                id="link-image-edit"
                className="hidden-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
              {imagePreview && (
                <div className="image-preview-container">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="image-preview"
                  />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => {
                      setImagePreview(null);
                      setImage(null);
                    }}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLinkModal;
