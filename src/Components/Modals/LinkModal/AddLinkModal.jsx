import React, { useState } from "react";
import "./LinkModal.scss";
import {
  CloudUpload,
  Trash2,
  Link,
  FileText,
  Image,
  FolderOpen,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "../../../Context/ToastContext";
import Github from "../../../assets/github.png";
import Linkedin from "../../../assets/linkedin.png";
import Instagram from "../../../assets/instagram.png";
import Twitter from "../../../assets/twitter.png";
import Youtube from "../../../assets/youtube.png";
import Weblink from "../../../assets/weblink.png";

const PRESETS = [
  {
    name: "GitHub",
    icon: Github,
    placeholder: "https://github.com/username",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    placeholder: "https://linkedin.com/in/username",
  },
  {
    name: "Instagram",
    icon: Instagram,
    placeholder: "https://instagram.com/username",
  },
  {
    name: "Twitter",
    icon: Twitter,
    placeholder: "https://twitter.com/username",
  },
  {
    name: "YouTube",
    icon: Youtube,
    placeholder: "https://youtube.com/@username",
  },
  {
    name: "Custom",
    icon: Weblink,
    placeholder: "https://yourwebsite.com",
  },
];

const AddLinkModal = ({
  open,
  onClose,
  onAdd,
  categories,
  currentCategoryObj,
}) => {
  // Set initial selected preset and category
  const initialCategory = currentCategoryObj?.id || "";
  const [selected, setSelected] = useState({
    ...PRESETS[0],
    category: initialCategory,
  });
  const [name, setName] = useState(selected.name || "");
  const [url, setUrl] = useState(selected.placeholder);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { addToast } = useToast();

  // Reset category when modal opens
  React.useEffect(() => {
    if (open) {
      setSelected((prev) => ({ ...PRESETS[0], category: initialCategory }));
    }
  }, [open, initialCategory]);

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
    onAdd({
      name: name,
      icon: selected.icon,
      url,
      description,
      image,
      imagePreview,
      category: selected.category,
    });
    setUrl("");
    setDescription("");
    setImage(null);
    setImagePreview(null);
    setSelected({ ...PRESETS[0], category: initialCategory });
    onClose();
  };

  return (
    <motion.div
      className="add-link-modal-overlay"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
    >
      <div className="add-link-modal">
        <div className="modal-header">
          <h2>Add a Link</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="presets">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              className={`preset-btn${
                selected.name === preset.name ? " selected" : ""
              }`}
              onClick={() => {
                setSelected(preset);
                setName(preset.name);
                setUrl(preset.placeholder);
              }}
            >
              <img src={preset.icon} alt={preset.name} width={28} height={28} />
              <span>{preset.name}</span>
            </button>
          ))}
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
              placeholder={selected.placeholder}
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
              name="category"
              id="category"
              value={selected.category || ""}
              onChange={(e) =>
                setSelected({ ...selected, category: e.target.value })
              }
            >
              <option value="">No Category</option>
              {categories &&
                categories.map((cat) => (
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
              Link Image (Optional)
            </label>
            <div className="image-upload-section">
              <button
                type="button"
                className="upload-btn"
                onClick={() => document.getElementById("link-image").click()}
              >
                <CloudUpload size={18} />
                Choose Image
              </button>
              <input
                name="link-image"
                id="link-image"
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
              Add Link
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AddLinkModal;
