import React, { useState } from "react";
import "./LinkModal.scss";
import { CloudUpload } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "../../../Context/ToastContext";

const PRESETS = [
  {
    name: "GitHub",
    icon: "/src/assets/github.png",
    placeholder: "https://github.com/username",
  },
  {
    name: "LinkedIn",
    icon: "/src/assets/linkedin.png",
    placeholder: "https://linkedin.com/in/username",
  },
  {
    name: "Instagram",
    icon: "/src/assets/instagram.png",
    placeholder: "https://instagram.com/username",
  },
  {
    name: "Twitter",
    icon: "/src/assets/twitter.png",
    placeholder: "https://twitter.com/username",
  },
  {
    name: "YouTube",
    icon: "/src/assets/youtube.png",
    placeholder: "https://youtube.com/@username",
  },
  {
    name: "Custom",
    icon: "/src/assets/weblink.png",
    placeholder: "https://yourwebsite.com",
  },
];

const AddLinkModal = ({ open, onClose, onAdd, categories }) => {
  const [selected, setSelected] = useState(PRESETS[0]);
  const [name, setName] = useState(selected.name || "");

  const [url, setUrl] = useState(selected.placeholder);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { addToast } = useToast();

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
      name: selected.name || name,
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
    setSelected(PRESETS[0]);
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
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Add a Link</h2>
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
            placeholder={selected.placeholder}
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
            className="input"
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
          <label htmlFor="link-image" className="label-linkimage">
            <CloudUpload size={18} />
            Add Image
          </label>
          <input
            name="link-image"
            id="link-image"
            className="input-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="image-preview" />
          )}
          <button type="submit" className="add-link-submit">
            Add Link
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default AddLinkModal;
