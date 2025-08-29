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

import "./Dashboard.scss";
import "./LinksList.scss";
import LazyImage from "../../../../Components/LazyImg";
import AddCategoryModal from "../../../../Components/Modals/CategoryModal/AddCategoryModal";
import { useToast } from "../../../../Context/ToastContext";
import { useLocation, useNavigate } from "react-router";
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

const Dashboard = () => {
  const { user } = useAuth();
  const { links, setLinks, categories, category, setCategory } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryEditModalOpen, setCategoryEditModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [actionMenuId, setActionMenuId] = useState(null);
  const [currentCategoryObj, setCurrentCategoryObj] = useState(null);
  const { addToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

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

  return (
    <div className="Dashboard">
      <header>
        <div className="header-container">
          <div className="header-content">
            <div className="profile">
              <div className="title">
                <span className="username">
                  <Mail size={17} className="icon" />
                  {user?.email}
                </span>
              </div>
              <LazyImage
                src={user?.profileURL}
                alt=""
                className="profile-img"
              />
              <p>@{user?.displayName}</p>
            </div>
            <div className="categories">
              <button
                className="add-category"
                onClick={() => setCategoryModalOpen(true)}
              >
                <Plus size={17} /> Add Category
              </button>
              <div
                className={`cat ${category === "All" ? "active" : ""}`}
                onClick={() => {
                  setCategory("All");
                  setCategoryModalOpen(false);
                  navigate("/home/dashboard");
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
                      `/home/dashboard?category=${encodeURIComponent(cat.name)}`
                    );
                  }}
                >
                  <Link className="icon" size={17} />
                  {cat.name}
                </div>
              ))}

              <AddCategoryModal
                open={categoryModalOpen}
                onClose={() => setCategoryModalOpen(false)}
                setCategory={setCategory}
              />
              <EditCategoryModal
                open={categoryEditModalOpen}
                onClose={() => setCategoryEditModalOpen(false)}
                category={currentCategoryObj}
                setCategory={setCategory}
              />
            </div>
            <QuickAnalytics />
          </div>
        </div>
      </header>
      <QuickAnalytics isMobile={true} />

      <AnimatePresence>
        <AddLinkModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onAdd={(data) => handleAddLink(data, user, setLinks, addToast)}
          categories={categories}
          currentCategoryObj={currentCategoryObj}
        />
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
      </AnimatePresence>
      <div className="links-list-container">
        <div className="title">
          {category === "All" ? "All Links" : `${category}`} (
          {filteredLinks.length}){" "}
          {category !== "All" && (
            <Edit
              size={17}
              stroke="#c4b6fd"
              className="editCategoryModalToggle icon"
              onClick={() => setCategoryEditModalOpen(true)}
            />
          )}
        </div>
        <div className="links-list">
          <button className="add-link-btn" onClick={() => setModalOpen(true)}>
            + Add a link
          </button>
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
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
