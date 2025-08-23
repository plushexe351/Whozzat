import React, { useState, useEffect } from "react";
import "./LinkModal.scss";
import { CloudUpload, Pin, PinOff, Trash, Trash2, X } from "lucide-react";

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
    onEdit({
      ...link,
      name,
      url,
      description,
      image,
      pinned,
      category,
    });
    onClose();
  };

  return (
    <div className="add-link-modal-overlay">
      <div className="add-link-modal">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Edit Link</h2>
        <div className="actions">
          <button
            type="button"
            onClick={() => {
              setPinned(!pinned);
              onPin && onPin(link);
            }}
          >
            {pinned ? (
              <>
                <PinOff size={17} stroke="#e3dcff" />
                Unpin
              </>
            ) : (
              <>
                <Pin size={17} stroke="#e3dcff" />
                Pin
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => onDelete(link)}
            style={{ color: "red" }}
          >
            <Trash size={17} /> Delete
          </button>
        </div>
        <form onSubmit={handleSubmit} className="add-link-form">
          <input
            className="input input-url"
            type="text"
            placeholder="Link Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="input input-url"
            type="url"
            placeholder="Link URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <textarea
            className="input input-description"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
          {/* <label htmlFor="category" className="input">
            Select Category
          </label> */}
          <select
            id="category"
            name="category"
            className="input"
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
          <label htmlFor="link-image-edit" className="label-linkimage">
            <CloudUpload size={18} />
            {imagePreview ? "Change" : "Add"} Image
          </label>
          <input
            name="link-image-edit"
            id="link-image-edit"
            className="input-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />
          {imagePreview && (
            <>
              <img src={imagePreview} alt="Preview" className="image-preview" />
              <button className="remove-image">
                <Trash2 size={17} stroke="#e3dcff" />
              </button>
            </>
          )}

          <button type="submit" className="add-link-submit">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditLinkModal;
