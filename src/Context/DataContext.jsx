import React, { createContext, useContext, useState, useEffect } from "react";
import { db, collection, getDocs } from "../firebase";
import { useAuth } from "./AuthContext";
import { sortLinksByPinnedAndDate } from "../utils/linkHandlers";
import { useLocation, useNavigate } from "react-router";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [links, setLinks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("All");

  const location = useLocation();
  const navigate = useNavigate();

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
        // linksArr = linksArr.sort((a, b) => {
        //   // Step 1: Pinned always comes first
        //   if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;

        //   // Step 2: Sort by updatedAt (if present) or createdAt, newest first
        //   const aDate = new Date(a.updatedAt || a.createdAt || 0);
        //   const bDate = new Date(b.updatedAt || b.createdAt || 0);

        //   return bDate - aDate;
        // });

        linksArr = sortLinksByPinnedAndDate(linksArr);

        setLinks(linksArr);
      } catch (e) {
        setLinks([]);
      }
    };
    fetchLinks();
  }, [user]);

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

  return (
    <DataContext.Provider
      value={{
        links,
        setLinks,
        categories,
        setCategories,
        category,
        setCategory,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
