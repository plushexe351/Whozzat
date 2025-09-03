import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { db, collection, getDocs } from "../firebase";
import { useAuth } from "./AuthContext";
import { sortLinksByPinnedAndDate } from "../utils/linkHandlers";
import { useLocation, useNavigate } from "react-router-dom";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [links, setLinks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("All");

  const location = useLocation();
  const navigate = useNavigate();

  // Fetch links
  useEffect(() => {
    const fetchLinks = async () => {
      if (!user) return;
      try {
        const linksCol = collection(db, "users", user.uid, "links");
        const snapshot = await getDocs(linksCol);
        let linksArr = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        linksArr = sortLinksByPinnedAndDate(linksArr);

        setLinks(linksArr);
      } catch (e) {
        setLinks([]);
      }
    };
    fetchLinks();
  }, [user]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      if (!user) return;
      try {
        const catCol = collection(db, "users", user.uid, "categories");
        const snapshot = await getDocs(catCol);
        setCategories(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (e) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, [user]);

  // === Analytics Logic (moved from QuickAnalytics) ===
  const analytics = useMemo(() => {
    const totalLinks = links.length;
    const pinnedLinks = links.filter((link) => link.pinned).length;
    const categoriesCount = categories.length;

    // Category stats
    const categoryStats = categories
      .map((cat) => ({
        ...cat,
        linkCount: links.filter((link) => link.category === cat.id).length,
      }))
      .sort((a, b) => b.linkCount - a.linkCount);

    const mostPopularCategory = categoryStats[0];

    // Recent activity (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentLinks = links.filter((link) => {
      const linkDate = new Date(link.createdAt || link.updatedAt || 0);
      return linkDate >= oneWeekAgo;
    });

    // Top 3 pinned links
    const topPinnedLinks = links.filter((link) => link.pinned).slice(0, 3);

    // Links added over last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();

    const dailyLinkCounts = last7Days.map(
      (date) =>
        links.filter((link) => {
          const linkDate = new Date(link.createdAt || link.updatedAt || 0);
          return linkDate.toISOString().split("T")[0] === date;
        }).length
    );

    return {
      totalLinks,
      pinnedLinks,
      categoriesCount,
      mostPopularCategory,
      recentLinks,
      topPinnedLinks,
      dailyLinkCounts,
      last7Days,
    };
  }, [links, categories]);

  return (
    <DataContext.Provider
      value={{
        links,
        setLinks,
        categories,
        setCategories,
        category,
        setCategory,
        analytics,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
