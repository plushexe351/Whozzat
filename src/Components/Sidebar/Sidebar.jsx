import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import "./Sidebar.scss";
import logo from "../../assets/whozzat-logo.png";
import { Home, Link, LogOut, Settings, Share } from "react-feather";
import { ChartBar, User } from "lucide-react";
import { handleSignOut } from "../../utils/authHandlers";
import { useToast } from "../../Context/ToastContext";
import { useData } from "../../Context/DataContext";

const Sidebar = () => {
  const { addToast } = useToast();
  const { categories, setCategories, category, setCategory } = useData();
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
    <div className="Sidebar">
      <div className="logo">
        <img src={logo} alt="" width={65} />
        Whozzat
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
            >
              {link.icon}
              {link.title}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="categories">
        <div className="title">Categories</div>
        <nav>
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
