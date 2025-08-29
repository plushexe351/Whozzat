import React, { useRef, useEffect } from "react";
import {
  MoreVertical,
  Pin,
  X,
  Link as LinkIcon,
  MessageCircle,
  Bookmark,
  Eye,
  EyeOff,
} from "lucide-react";
import LinkActionModal from "../Modals/LinkActionModal/LinkActionModal";
import { AnimatePresence, motion } from "framer-motion";
import placeholderImg from "../../assets/placeholder.png";
import LazyImage from "../LazyImg";
import "./LinkItem.scss";
import { useToast } from "../../Context/ToastContext";

// Refer to Home.scss for styles

const LinkItem = ({
  link,
  actionMenuId,
  setActionMenuId,
  setSelectedLink,
  setEditModalOpen,
  handleDeleteLink,
  handlePinLink,
  user,
  setLinks,
  handleBookmarkLink,
  handleToggleVisibility,
  viewOnly,
}) => {
  const optionsRef = useRef();

  useEffect(() => {
    if (actionMenuId !== link.id) return;
    function handleClickOutside(e) {
      if (optionsRef.current && !optionsRef.current.contains(e.target)) {
        setActionMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [actionMenuId, link.id, setActionMenuId]);

  const { addToast } = useToast();

  return (
    <motion.div
      className={`link-item${link.visibility === false ? " is-hidden" : ""}`}
      initial={{ y: 0, scale: 0.9 }}
      animate={{ y: 0, scale: 1 }}
    >
      <LazyImage
        className="link-image"
        src={link.imageUrl || placeholderImg}
        alt={link.name}
      />
      <div className="link-details">
        <div className="link-name">
          {link.name}
          <div className="actions">
            {!viewOnly &&
              typeof link.visibility === "boolean" &&
              handleToggleVisibility && (
                <button
                  className="visibility-toggle"
                  title={link.visibility ? "Hide link" : "Show link"}
                  onClick={() =>
                    handleToggleVisibility(
                      link,
                      user,
                      setLinks,
                      setActionMenuId,
                      addToast
                    )
                  }
                >
                  {link.visibility ? (
                    <Eye size={18} stroke="#e3dcff" />
                  ) : (
                    <EyeOff size={18} stroke="#e3dcff" />
                  )}
                </button>
              )}
            {!viewOnly && link.pinned && (
              <Pin size={20} stroke="#e3dcff" className="pin" />
            )}
            {!viewOnly && link.bookmarked && (
              <Bookmark
                size={20}
                stroke="#e3dcff"
                fill="#e3dcff"
                className="bookmark"
              />
            )}
          </div>
          {!viewOnly && (
            <div className="options" ref={optionsRef}>
              {actionMenuId === link.id ? (
                <X
                  size={18}
                  className="options-toggle"
                  stroke="red"
                  onClick={() => setActionMenuId(null)}
                />
              ) : (
                <MoreVertical
                  size={18}
                  className="options-toggle"
                  onClick={() => setActionMenuId(link.id)}
                />
              )}
              <AnimatePresence>
                {actionMenuId === link.id && (
                  <LinkActionModal
                    onEdit={() => {
                      setSelectedLink(link);
                      setEditModalOpen(true);
                      setActionMenuId(null);
                    }}
                    onDelete={() =>
                      handleDeleteLink(
                        link,
                        user,
                        setLinks,
                        setActionMenuId,
                        addToast
                      )
                    }
                    onPin={() =>
                      handlePinLink(
                        link,
                        user,
                        setLinks,
                        setActionMenuId,
                        addToast
                      )
                    }
                    onBookmark={() =>
                      handleBookmarkLink(
                        link,
                        user,
                        setLinks,
                        setActionMenuId,
                        addToast
                      )
                    }
                    link={link}
                    close={() => setActionMenuId(null)}
                  />
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
        {link.description && (
          <div className="link-description">{link.description}</div>
        )}
      </div>
    </motion.div>
  );
};

export default LinkItem;
