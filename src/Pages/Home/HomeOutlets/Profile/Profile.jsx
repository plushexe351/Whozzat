// Sync category state with URL param on mount or param change
import { AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useMemo } from "react";
import AddLinkModal from "../../../../Components/Modals/LinkModal/AddLinkModal";
import EditLinkModal from "../../../../Components/Modals/LinkModal/EditLinkModal";
import LinkItem from "../../../../Components/LinkItem/LinkItem";
import { useData } from "../../../../Context/DataContext";
import { useAuth } from "../../../../Context/AuthContext";
import {
  handleAddLink,
  handleEditLink,
  handleDeleteLink,
  handlePinLink,
  handleBookmarkLink,
} from "../../../../utils/linkHandlers";
import WhozzatLogo from "../../../../assets/whozzat-logo.png";

import { Link, Mail, Plus } from "react-feather";

import "./Profile.scss";

import LazyImage from "../../../../Components/LazyImg";
import AddCategoryModal from "../../../../Components/Modals/CategoryModal/AddCategoryModal";
import { useToast } from "../../../../Context/ToastContext";
import { useLocation, useNavigate, useParams } from "react-router";
import EditCategoryModal from "../../../../Components/Modals/CategoryModal/EditCategoryModal";
import {
  Edit,
  Edit2,
  Edit3,
  Edit3Icon,
  Pen,
  Pencil,
  Sidebar,
} from "lucide-react";
import { useUI } from "../../../../Context/UIContext";
import QuickAnalytics from "../../../../Components/QuickAnalytics/QuickAnalytics";
import ProfileEditModal from "../../../../Components/Modals/ProfileEditModal/ProfileEditModal";
import {
  db,
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "../../../../firebase";

const Profile = () => {
  const routeParams = useParams();
  const publicUsername = routeParams.username;
  const isPublicView = Boolean(publicUsername);

  const { user } = useAuth();
  const { links, setLinks, categories, setCategories, category, setCategory } =
    useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryEditModalOpen, setCategoryEditModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [actionMenuId, setActionMenuId] = useState(null);
  const [currentCategoryObj, setCurrentCategoryObj] = useState(null);
  const [profileEditModalOpen, setProfileEditModalOpen] = useState(false);
  const [publicUser, setPublicUser] = useState(null);
  const [previewViewOnly, setPreviewViewOnly] = useState(false);
  const { addToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // If public view, fetch public user's data and their links/categories
  useEffect(() => {
    async function fetchPublicUser() {
      if (!isPublicView) return;
      try {
        const usersCol = collection(db, "users");
        const q = query(usersCol, where("username", "==", publicUsername));
        const snap = await getDocs(q);
        if (snap.empty) return;
        const userDoc = snap.docs[0];
        const data = userDoc.data();
        setPublicUser({ id: userDoc.id, ...data });

        // Fetch their links and categories
        const linksCol = collection(db, "users", userDoc.id, "links");
        const catCol = collection(db, "users", userDoc.id, "categories");
        const [linksSnap, catSnap] = await Promise.all([
          getDocs(linksCol),
          getDocs(catCol),
        ]);
        const publicLinks = linksSnap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((l) => l.visibility !== false);
        const publicCats = catSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setLinks(publicLinks);
        setCategories(publicCats);
        setCategory("All");
      } catch (e) {
        console.log(e);
      }
    }
    fetchPublicUser();
  }, [isPublicView, publicUsername]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const catParam = params.get("category");
    if (catParam && catParam !== category) {
      setCategory(catParam);
    } else if (!catParam && category !== "All") {
      setCategory("All");
    }
  }, [location.search]);

  const filteredLinks = useMemo(() => {
    if (category === "All") return links;
    const selectedCat = categories.find((cat) => cat.name === category);
    if (selectedCat) {
      return links.filter((link) => link.category === selectedCat.id);
    }
    return [];
  }, [links, categories, category]);

  useEffect(() => {
    const selectedCat = categories.find((cat) => cat.name === category);
    setCurrentCategoryObj(selectedCat);
  }, [category, categories]);

  const displayUser = isPublicView ? publicUser : user;
  const effectiveViewOnly = isPublicView || previewViewOnly;

  return (
    <div className="Profile">
      <header>
        <div className="header-container">
          <div className="profile-cover-image">
            <img src={displayUser?.coverURL || ""} alt="" className="img" />
          </div>
          <div className="header-content">
            <div className="user-profile">
              <LazyImage
                src={displayUser?.profileURL}
                alt=""
                className="profile-img"
              />
              <p className="display-name">
                @{displayUser?.displayName || publicUsername}
                {!effectiveViewOnly && (
                  <Edit2
                    className="edit-profile-toggle"
                    size={17}
                    stroke="#c4b6fd"
                    onClick={() => setProfileEditModalOpen(true)}
                    style={{ cursor: "pointer" }}
                  />
                )}
              </p>
              <div className="title">
                <span className="username">
                  <Mail size={17} className="icon" />
                  {displayUser?.email}
                </span>
              </div>
              <div className="bio">{displayUser?.bio}</div>
            </div>
            {!isPublicView && (
              <div className="view-toggle">
                <label htmlFor="preview-toggle">
                  <input
                    type="checkbox"
                    id="preview-toggle"
                    checked={previewViewOnly}
                    onChange={(e) => setPreviewViewOnly(e.target.checked)}
                  />
                  <span className="toggle-switch"></span>
                  <span className="toggle-label">View only mode</span>
                </label>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* <QuickAnalytics isMobile={true} /> */}

      <AnimatePresence>
        {!effectiveViewOnly && (
          <AddLinkModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onAdd={(data) => handleAddLink(data, user, setLinks, addToast)}
            categories={categories}
            currentCategoryObj={currentCategoryObj}
          />
        )}
        {!effectiveViewOnly && (
          <EditLinkModal
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            onEdit={(data) =>
              handleEditLink(
                data,
                user,
                setLinks,
                setEditModalOpen,
                setActionMenuId,
                addToast
              )
            }
            onDelete={(link) =>
              handleDeleteLink(link, user, setLinks, setActionMenuId, addToast)
            }
            link={selectedLink}
            categories={categories}
          />
        )}
        {!effectiveViewOnly && (
          <ProfileEditModal
            open={profileEditModalOpen}
            onClose={() => setProfileEditModalOpen(false)}
          />
        )}
      </AnimatePresence>
      <div className="links-list-container">
        <div className="categories">
          {!effectiveViewOnly && (
            <button
              className="add-category"
              onClick={() => setCategoryModalOpen(true)}
            >
              <Plus size={17} /> Add Category
            </button>
          )}
          <div
            className={`cat ${category === "All" ? "active" : ""}`}
            onClick={() => {
              setCategory("All");
              setCategoryModalOpen(false);
              navigate(isPublicView ? `/u/${publicUsername}` : "/home/profile");
            }}
          >
            <Link className="icon" size={17} />
            All
          </div>
          {categories.map((cat) => (
            <div
              className={`cat ${category === cat.name ? "active" : ""}`}
              key={cat.id}
              onClick={() => {
                setCategory(cat.name);
                setCategoryModalOpen(false);
                navigate(
                  isPublicView
                    ? `/u/${publicUsername}?category=${encodeURIComponent(
                        cat.name
                      )}`
                    : `/home/profile?category=${encodeURIComponent(cat.name)}`
                );
              }}
            >
              <Link className="icon" size={17} />
              {cat.name}
            </div>
          ))}

          {!effectiveViewOnly && (
            <AddCategoryModal
              open={categoryModalOpen}
              onClose={() => setCategoryModalOpen(false)}
              setCategory={setCategory}
            />
          )}
          {!effectiveViewOnly && (
            <EditCategoryModal
              open={categoryEditModalOpen}
              onClose={() => setCategoryEditModalOpen(false)}
              category={currentCategoryObj}
              setCategory={setCategory}
            />
          )}
        </div>
        <div className="title">
          {category === "All" ? "All Links" : `${category}`} (
          {filteredLinks.length}){" "}
          {!effectiveViewOnly && category !== "All" && (
            <Edit
              size={17}
              stroke="#c4b6fd"
              className="editCategoryModalToggle icon"
              onClick={() => setCategoryEditModalOpen(true)}
            />
          )}
        </div>
        <div className="links-list">
          {!effectiveViewOnly && (
            <button className="add-link-btn" onClick={() => setModalOpen(true)}>
              + Add a link
            </button>
          )}
          {filteredLinks.map((link) => (
            <LinkItem
              key={link.id}
              link={link}
              actionMenuId={actionMenuId}
              setActionMenuId={setActionMenuId}
              setSelectedLink={setSelectedLink}
              setEditModalOpen={setEditModalOpen}
              handleDeleteLink={handleDeleteLink}
              handlePinLink={handlePinLink}
              handleBookmarkLink={handleBookmarkLink}
              user={user}
              setLinks={setLinks}
              viewOnly={effectiveViewOnly}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
