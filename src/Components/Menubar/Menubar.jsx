import React, { useEffect, useState } from "react";
import "./Menubar.scss";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { handleSignOut } from "../../utils/authHandlers.js";
import { useToast } from "../../Context/ToastContext.jsx";
import WhozzatLogo from "../../assets/whozzat-logo.png";
import placeholder from "../../assets/profile_placeholder.png";

const menuItems = [
  { name: "About", path: "/landing", id: "about" },
  { name: "Why us", path: "/landing", id: "why-us" },
  { name: "FAQs", path: "/landing", id: "faqs" },
];

const Menubar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const Navigate = useNavigate();
  const [showFixed, setShowFixed] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(window.scrollY);
  const [activeId, setActiveId] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY <= 50 || currentScrollY == 100) {
            setShowFixed(false);
          } else if (currentScrollY < lastScrollY) {
            setShowFixed(true);
          } else if (currentScrollY > lastScrollY) {
            setShowFixed(false);
          }
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // When on landing, observe sections and update activeId based on scroll
  useEffect(() => {
    if (location.pathname !== "/landing") {
      setActiveId(null);
      return;
    }

    const ids = menuItems.map((m) => m.id).filter(Boolean);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { root: null, rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [location.pathname]);

  return (
    <nav className={`apple-menubar${showFixed ? " fixed-menubar" : ""}`}>
      <div
        className="logo"
        onClick={() => {
          Navigate("/");
        }}
      >
        <img src={WhozzatLogo} alt="whozzat-logo" width={80} />
      </div>
      <div className="page-links">
        <>
          {menuItems.map((item) => (
            <a
              key={item.path + item.name}
              href={item.path}
              className={
                location.pathname === "/landing"
                  ? activeId === item.id
                    ? "active"
                    : undefined
                  : location.pathname === item.path
                  ? "active"
                  : undefined
              }
              onClick={(e) => {
                e.preventDefault();
                // If already on landing, just scroll
                if (location.pathname === item.path) {
                  const el = document.getElementById(item.id);
                  if (el)
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                  return;
                }
                // Otherwise navigate to landing then scroll after a short delay
                Navigate(item.path);
                setTimeout(() => {
                  const el = document.getElementById(item.id);
                  if (el)
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 220);
              }}
            >
              {item.name}
            </a>
          ))}
        </>
      </div>
      <NavLink to="/home" className="dashboard-link">
        Dashboard
      </NavLink>
      <div className="buttons regularScreen">
        {user && (
          <div className="user">
            {/* <div className="user-name">@{user.displayName}</div> */}

            {user?.profileURL && (
              <img
                className="user-profile-image"
                src={user?.profileURL || placeholder}
                alt=""
              />
            )}
            <button className="user-add-link" onClick={handleSignOut}>
              Log out
            </button>
          </div>
        )}
        {!user && (
          <>
            <Link className="login" to="/auth">
              Login
            </Link>
            <Link className="signup" to="/auth">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Menubar;
