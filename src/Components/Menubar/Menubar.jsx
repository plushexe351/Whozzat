import React, { useEffect, useState } from "react";
import "./Menubar.scss";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { handleSignOut } from "../../utils/authHandlers.js";
import { useToast } from "../../Context/ToastContext.jsx";
import WhozzatLogo from "../../assets/whozzat-logo.png";

const menuItems = [
  { name: "About", path: "/landing" },
  { name: "Home", path: "/home" },
  { name: "Profile", path: "/profile" },
  { name: "Bookmarks", path: "/bookmarks" },
  { name: "Analytics", path: "/analytics" },
];

const Menubar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const Navigate = useNavigate();
  const [showFixed, setShowFixed] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(window.scrollY);
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

  return (
    <nav className={`apple-menubar${showFixed ? " fixed-menubar" : ""}`}>
      <div
        className="logo"
        onClick={() => {
          Navigate("/");
          console.log(user);
        }}
      >
        <img src={WhozzatLogo} alt="whozzat-logo" width={80} />
        <div className="buttons smallScreen">
          {user && (
            <div className="user">
              <div className="user-name">@{user?.displayName}</div>
              {user?.profileURL && (
                <img
                  className="user-profile-image"
                  src={user?.profileURL}
                  alt=""
                />
              )}
              <button className="user-add-link">Log out</button>
            </div>
          )}
          {!user && (
            <Link className="login" to="/auth">
              Login
            </Link>
          )}
        </div>
      </div>
      <div className="page-links">
        <>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={location.pathname === item.path ? "active" : undefined}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              {item.name}
            </Link>
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
                src={user?.profileURL}
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
