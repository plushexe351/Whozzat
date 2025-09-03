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
  const [engagements, setEngagements] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  // Fetch links (also re-run when route changes so we restore user links after viewing a public profile)
  useEffect(() => {
    if (!user) {
      setLinks([]);
      setCategories([]);
    }
    const fetchLinks = async () => {
      if (!user) return;
      // Don't fetch current user's links while viewing someone else's public profile
      if (location.pathname.startsWith("/u/")) return;
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
  }, [user, location.pathname]);

  // Fetch categories (re-run on route change to restore after public profile view)
  useEffect(() => {
    const fetchCategories = async () => {
      if (!user) return;
      // Skip when viewing a public profile
      if (location.pathname.startsWith("/u/")) return;
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
  }, [user, location.pathname]);

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

    // Engagement aggregates
    const totalEngagements = engagements.length;

    const byDevice = engagements.reduce(
      (acc, e) => {
        const d = (e.device || "unknown").toLowerCase();
        acc[d] = (acc[d] || 0) + 1;
        return acc;
      },
      { mobile: 0, desktop: 0, tablet: 0, unknown: 0 }
    );

    const byViewerMap = engagements.reduce((acc, e) => {
      const id = e.viewerId || e.viewerName || "anonymous";
      if (!acc[id])
        acc[id] = {
          viewerId: e.viewerId || null,
          viewerName: e.viewerName || "",
          viewerProfileImage: e.viewerProfileImage || "",
          count: 0,
        };
      acc[id].count++;
      return acc;
    }, {});

    const topViewers = Object.values(byViewerMap).sort(
      (a, b) => b.count - a.count
    );

    const byLinkMap = engagements.reduce((acc, e) => {
      acc[e.linkId] = (acc[e.linkId] || 0) + 1;
      return acc;
    }, {});

    return {
      totalLinks,
      pinnedLinks,
      categoriesCount,
      mostPopularCategory,
      recentLinks,
      topPinnedLinks,
      dailyLinkCounts,
      last7Days,
      // engagements data
      engagements,
      engagementCounts: {
        total: totalEngagements,
        byDevice,
        byLink: byLinkMap,
        topViewers,
      },
    };
  }, [links, categories]);

  // Fetch engagements for current user's links
  useEffect(() => {
    const fetchEngagements = async () => {
      if (!user) return;
      // Skip when viewing someone else's public profile
      if (location.pathname.startsWith("/u/")) return;
      try {
        const all = [];
        // For each link fetch engagements subcollection
        await Promise.all(
          links.map(async (link) => {
            try {
              const engCol = collection(
                db,
                "users",
                user.uid,
                "links",
                link.id,
                "engagements"
              );
              const snap = await getDocs(engCol);
              snap.docs.forEach((d) => {
                all.push({ id: d.id, linkId: link.id, ...d.data() });
              });
            } catch (e) {
              // ignore per-link errors
            }
          })
        );
        // sort by timestamp desc
        all.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setEngagements(all);
      } catch (e) {
        setEngagements([]);
      }
    };
    fetchEngagements();
  }, [user, links, location.pathname]);

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
