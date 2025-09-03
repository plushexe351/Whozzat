import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.scss";
import logo from "../../assets/whozzat-logo.png";
import { Home, Link, LogOut, Settings, Share, Search } from "react-feather";
import { ChartBar, Plus, User, X } from "lucide-react";
import { handleSignOut } from "../../utils/authHandlers";
import { useToast } from "../../Context/ToastContext";
import { useData } from "../../Context/DataContext";
import { useUI } from "../../Context/UIContext";
import AddCategoryModal from "../Modals/CategoryModal/AddCategoryModal";
import { db, collection, getDocs, query, where } from "../../firebase";
import { useAuth } from "../../Context/AuthContext";

const Sidebar = () => {
  const { addToast } = useToast();
  const { categories, setCategories, category, setCategory } = useData();
  const { showSidebar, setShowSidebar } = useUI();
  const { user, setUser } = useAuth();

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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
    // {
    //   title: "Settings",
    //   path: "/home/settings",
    //   icon: <Settings className="icon" size={17} />,
    // },
  ];

  function normalizeQuery(q) {
    return q.replace(/\s+/g, " ").trim();
  }

  async function searchUsers(qRaw) {
    const q = normalizeQuery(qRaw);
    const usersCol = collection(db, "users");
    const results = [];
    const pushUnique = (arr) => {
      arr.forEach((d) => {
        const exists = results.find((r) => r.id === d.id);
        if (!exists) results.push(d);
      });
    };

    try {
      // Exact match on username (covers spaces and case-sensitive exacts)
      const exactU = query(usersCol, where("username", "==", q));
      const exactSnap = await getDocs(exactU);
      pushUnique(exactSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch {}

    try {
      // Exact match on email
      const exactE = query(usersCol, where("email", "==", q));
      const exactESnap = await getDocs(exactE);
      pushUnique(exactESnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch {}

    // Prefix queries (best-effort; Firestore is case-sensitive)
    try {
      const q1 = query(
        usersCol,
        where("username", ">=", q),
        where("username", "<=", q + "\uf8ff")
      );
      const snap1 = await getDocs(q1);
      pushUnique(snap1.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch {}

    try {
      const q2 = query(
        usersCol,
        where("email", ">=", q),
        where("email", "<=", q + "\uf8ff")
      );
      const snap2 = await getDocs(q2);
      pushUnique(snap2.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch {}

    return results.slice(0, 8);
  }

  // Debounce suggestions
  useEffect(() => {
    if (!searchText.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setIsSearching(true);
    const t = setTimeout(async () => {
      try {
        const res = await searchUsers(searchText);
        setSuggestions(res);
        setShowSuggestions(true);
      } catch (e) {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [searchText]);

  async function handleSearchSubmit(e) {
    e.preventDefault();
    const q = searchText.trim();
    if (!q) return;
    setIsSearching(true);
    try {
      const res = await searchUsers(q);
      if (res.length === 0) {
        addToast("No matching user found", "error");
      } else {
        const u = res[0];
        const username = u.username || (u.email ? u.email.split("@")[0] : u.id);
        navigate(`/u/${encodeURIComponent(username)}`);
        setShowSidebar(false);
        setShowSuggestions(false);
      }
    } catch (err) {
      addToast("Search failed", "error");
    } finally {
      setIsSearching(false);
    }
  }

  function handleShareProfile() {
    const username =
      user?.displayName || user?.email?.split("@")[0] || "profile";
    const url = `${window.location.origin}/u/${encodeURIComponent(username)}`;
    navigator.clipboard
      .writeText(url)
      .then(() => addToast("Profile URL copied!", "success"));
  }

  return (
    <div className={`Sidebar ${showSidebar ? "open" : ""}`}>
      <div className="logo">
        <img src={logo} alt="" width={65} />
        Whozzat
        <button className="close-sidebar" onClick={() => setShowSidebar(false)}>
          &times;
        </button>
      </div>
      <form
        className="user-search"
        onSubmit={handleSearchSubmit}
        autoComplete="off"
      >
        <input
          type="text"
          placeholder="Search users"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onFocus={() => searchText && setShowSuggestions(true)}
        />
        <button type="submit" disabled={isSearching}>
          <Search size={14} />
        </button>
      </form>
      {showSuggestions && suggestions.length > 0 && (
        <div className="user-suggestions">
          {suggestions.map((u) => {
            const username =
              u.username || (u.email ? u.email.split("@")[0] : u.id);
            return (
              <div
                key={u.id}
                className="suggestion-item"
                onClick={() => {
                  navigate(`/u/${encodeURIComponent(username)}`);
                  setShowSuggestions(false);
                  setShowSidebar(false);
                }}
              >
                <span className="name">{username}</span>
                {u.email && <span className="email">{u.email}</span>}
              </div>
            );
          })}
        </div>
      )}
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
        <button className="share-profile" onClick={handleShareProfile}>
          <Share size={17} /> Share Profile
        </button>
        <button
          className="logout"
          onClick={() => handleSignOut(addToast, setUser)}
        >
          <LogOut size={17} /> Log out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
