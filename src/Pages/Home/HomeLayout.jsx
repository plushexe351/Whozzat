import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../../Context/AuthContext";
import AddLinkModal from "../../Components/Modals/LinkModal/AddLinkModal";
import EditLinkModal from "../../Components/Modals/LinkModal/EditLinkModal";
import { db, collection, getDocs } from "../../firebase";
import {
  handleAddLink,
  handleEditLink,
  handleDeleteLink,
  handlePinLink,
  handleBookmarkLink,
} from "../../utils/linkHandlers";
import LinkItem from "../../Components/LinkItem/LinkItem";
import { Outlet } from "react-router";

import "./HomeLayout.scss";
import Sidebar from "../../Components/Sidebar/Sidebar";

const Home = () => {
  const { user } = useAuth();
  const [links, setLinks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [actionMenuId, setActionMenuId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch links from Firestore
  // useEffect(() => {
  //   const fetchLinks = async () => {
  //     if (!user) return;
  //     setLoading(true);
  //     try {
  //       const linksCol = collection(db, "users", user.uid, "links");
  //       const snapshot = await getDocs(linksCol);
  //       let linksArr = snapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));
  //       // Sort pinned links to top
  //       linksArr = linksArr.sort(
  //         (a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)
  //       );
  //       setLinks(linksArr);
  //     } catch (e) {
  //       setLinks([]);
  //     }
  //     setLoading(false);
  //   };
  //   fetchLinks();
  // }, [user]);

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

  return (
    <motion.section
      className="Home"
      initial={{ opacity: 0, y: -100, x: -10, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
    >
      <Sidebar />
      <div className="main">
        <Outlet />
      </div>
    </motion.section>
  );
};

export default Home;
