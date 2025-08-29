import React, { useState, useRef } from "react";
import { useAuth } from "../../../Context/AuthContext";
import { useToast } from "../../../Context/ToastContext";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../firebase";
import {
  X,
  Camera,
  User,
  Mail,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import "./ProfileEditModal.scss";
import LazyImage from "../../LazyImg";

const ProfileEditModal = ({ open, onClose }) => {
  const { user, setUser } = useAuth();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    bio: user?.bio || "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profileURL || "");
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState(user?.coverURL || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setCoverPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return user?.profileURL;
    const storageRef = ref(storage, `profile-images/${user.uid}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  const handleCoverUpload = async (file) => {
    if (!file) return user?.coverURL;
    const storageRef = ref(storage, `cover-images/${user.uid}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let newProfileURL = user?.profileURL;
      let newCoverURL = user?.coverURL;

      if (profileImage) {
        newProfileURL = await handleImageUpload(profileImage);
      }
      if (coverImage) {
        newCoverURL = await handleCoverUpload(coverImage);
      }

      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        username: formData.displayName,
        bio: formData.bio,
        profileURL: newProfileURL,
        coverURL: newCoverURL,
      });

      setUser((prev) => ({
        ...prev,
        displayName: formData.displayName,
        bio: formData.bio,
        profileURL: newProfileURL,
        coverURL: newCoverURL,
      }));

      addToast("Profile updated successfully!", "success");
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      addToast("Failed to update profile. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      displayName: user?.displayName || "",
      bio: user?.bio || "",
    });
    setProfileImage(null);
    setCoverImage(null);
    setPreviewUrl(user?.profileURL || "");
    setCoverPreviewUrl(user?.coverURL || "");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="profile-edit-modal-overlay" onClick={handleClose}>
      <div className="profile-edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button className="close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="profile-edit-form">
          {/* Cover Image Section */}
          <div className="form-section">
            <label className="form-label">
              <ImageIcon size={16} />
              Cover Image
            </label>
            <div className="profile-picture-section">
              <div className="current-picture">
                <LazyImage
                  src={
                    coverPreviewUrl || user?.coverURL || "/default-cover.png"
                  }
                  alt="Cover"
                  className="cover-preview"
                />
                <button
                  type="button"
                  className="change-picture-btn"
                  onClick={() => coverInputRef.current?.click()}
                >
                  Change Cover
                </button>
              </div>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                style={{ display: "none" }}
              />
            </div>
          </div>

          {/* Profile Picture Section */}
          <div className="form-section">
            <label className="form-label">
              <Camera size={16} />
              Profile Picture
            </label>
            <div className="profile-picture-section">
              <div className="current-picture">
                <img
                  src={previewUrl || user?.profileURL || "/default-avatar.png"}
                  alt="Profile"
                  className="profile-preview"
                />
                <button
                  type="button"
                  className="change-picture-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change Picture
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>
          </div>

          {/* Display Name Section */}
          <div className="form-section">
            <label className="form-label">
              <User size={16} />
              Display Name
            </label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              placeholder="Enter your display name"
              className="form-input"
              maxLength={30}
            />
          </div>

          {/* Email Section (Read-only) */}
          <div className="form-section">
            <label className="form-label">
              <Mail size={16} />
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ""}
              className="form-input disabled"
              disabled
              title="Email cannot be changed"
            />
            <small className="form-help">
              Email address cannot be modified
            </small>
          </div>

          {/* Bio Section */}
          <div className="form-section">
            <label className="form-label">
              <FileText size={16} />
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself..."
              className="form-textarea"
              rows={4}
              maxLength={200}
            />
            <small className="form-help">
              {formData.bio.length}/200 characters
            </small>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;
