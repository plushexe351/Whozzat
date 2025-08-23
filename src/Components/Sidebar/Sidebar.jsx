import React from "react";
import { NavLink, useLocation } from "react-router";
import "./Sidebar.scss";
import logo from "../../assets/whozzat-logo.png";
import { Home, Link, LogOut, Settings, Share } from "react-feather";
import { ChartBar, User } from "lucide-react";
import { handleSignOut } from "../../utils/authHandlers";
import { useToast } from "../../Context/ToastContext";

const Sidebar = () => {
  const { addToast } = useToast();
  const location = useLocation();
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
  const Categories = [
    {
      title: "All",
      path: "/home/dashboard",
    },
    {
      title: "Socials",
      path: "/home/dashboard",
    },
    {
      title: "Projects",
      path: "/home/mylinks",
    },
    {
      title: "Other",
      path: "/home/analytics",
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
          {Categories.map((cat, index) => (
            <NavLink to={cat.path} className="navlink" key={index}>
              {cat.title}
            </NavLink>
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
