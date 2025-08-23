import React from "react";
import "./LinkActionModal.scss";
import { motion } from "framer-motion";
// You can use an icon library or emoji for the bookmark
const LinkActionModal = ({
  onEdit,
  onDelete,
  onPin,
  onBookmark,
  link,
  close,
}) => {
  return (
    <motion.div
      className="link-action-modal"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
    >
      <button
        onClick={() => {
          onEdit();
          close && close();
        }}
      >
        Edit
      </button>
      <button
        onClick={() => {
          onDelete();
          close && close();
        }}
        style={{ color: "red" }}
      >
        Delete
      </button>
      <button
        onClick={() => {
          onPin();
          close && close();
        }}
      >
        {link.pinned ? "Unpin" : "Pin"}
      </button>
      <button
        onClick={() => {
          onBookmark();
          close && close();
        }}
        title={link.bookmarked ? "Remove Bookmark" : "Bookmark"}
      >
        Bookmark
      </button>
    </motion.div>
  );
};

export default LinkActionModal;
