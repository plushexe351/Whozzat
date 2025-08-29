import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import "./Sidebar.scss";
import logo from "../../assets/whozzat-logo.png";
import { Home, Link, LogOut, Settings, Share } from "react-feather";
import { ChartBar, Plus, User, X } from "lucide-react";
import { handleSignOut } from "../../utils/authHandlers";
import { useToast } from "../../Context/ToastContext";
import { useData } from "../../Context/DataContext";
import { useUI } from "../../Context/UIContext";
import AddCategoryModal from "../Modals/CategoryModal/AddCategoryModal";

const Sidebar = () => {
  const { addToast } = useToast();
  const { categories, setCategories, category, setCategory } = useData();
  const { showSidebar, setShowSidebar } = useUI();

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const NavLinks = [
    {
      title: "Dashboard",
      path: "/home/dashboard",
      icon: <Home className="icon" size={17} />,
    },
    {
      title: "Profile",
      path: "/home/profile",
      icon: <User className="icon" size={17} />,
    },
    {
      title: "Analytics",
      path: "/home/analytics",
      icon: <ChartBar className="icon" size={17} />,
    },
    {
      title: "Settings",
      path: "/home/settings",
      icon: <Settings className="icon" size={17} />,
    },
  ];

  return (
    <div className={`Sidebar ${showSidebar ? "open" : ""}`}>
      <div className="logo">
        <img src={logo} alt="" width={65} />
        Whozzat
        <button className="close-sidebar" onClick={() => setShowSidebar(false)}>
          &times;
        </button>
      </div>
      <div className="navigation">
        <div className="title">Navigation</div>
        <nav>
          {NavLinks.map((link, index) => (
            <NavLink
              to={link.path}
              className={`navlink ${
                location.pathname === link.path ? "active" : ""
              }`}
              key={index}
              onClick={() => setShowSidebar(false)}
            >
              {link.icon}
              {link.title}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="categories">
        <AddCategoryModal
          open={categoryModalOpen}
          onClose={() => setCategoryModalOpen(false)}
          setCategory={setCategory}
        />
        <div className="title">Categories</div>
        <nav>
          <div
            className={`navlink add-category-toggle`}
            onClick={() => setCategoryModalOpen(true)}
          >
            <Plus stroke="#888" size={17} />
            <span>Add new category</span>
          </div>
          <div
            className={`navlink ${category === "All" ? "active" : ""}`}
            onClick={() => {
              setCategory("All");
              navigate("/home/dashboard");
            }}
          >
            All
          </div>
          {categories.map((cat, index) => (
            <div
              className={`navlink ${category === cat.name ? "active" : ""}`}
              key={cat.id + "d2"}
              onClick={() => {
                setCategory(cat.name);
                navigate(
                  `/home/dashboard?category=${encodeURIComponent(cat.name)}`
                );
                setShowSidebar(false);
              }}
            >
              {cat.name}
            </div>
          ))}
        </nav>
      </div>
      <div className="buttons">
        <button className="share-profile">
          <Share size={17} /> Share Profile
        </button>
        <button className="logout" onClick={() => handleSignOut(addToast)}>
          <LogOut size={17} /> Log out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
