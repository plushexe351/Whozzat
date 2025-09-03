import React from "react";
import "./LinkActionModal.scss";
import { motion } from "framer-motion";
import {
  Edit,
  Trash2,
  Pin,
  PinOff,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";

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
        className="action-btn edit-btn"
        onClick={() => {
          onEdit();
          close && close();
        }}
      >
        <Edit size={16} />
        Edit
      </button>
      <button
        className="action-btn delete-btn"
        onClick={() => {
          onDelete();
          close && close();
        }}
      >
        <Trash2 size={16} />
        Delete
      </button>
      <button
        className="action-btn pin-btn"
        onClick={() => {
          onPin();
          close && close();
        }}
      >
        {link.pinned ? <PinOff size={16} /> : <Pin size={16} />}
        {link.pinned ? "Unpin" : "Pin"}
      </button>
      <button
        className="action-btn bookmark-btn"
        onClick={() => {
          onBookmark();
          close && close();
        }}
        title={link.bookmarked ? "Remove Bookmark" : "Bookmark"}
      >
        {link.bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
        {link.bookmarked ? "Remove Bookmark" : "Bookmark"}
      </button>
    </motion.div>
  );
};

export default LinkActionModal;
