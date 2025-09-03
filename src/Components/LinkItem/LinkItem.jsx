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
import { logLinkClick } from "../../utils/linkHandlers";

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
      <a
        className="link-image-wrapper"
        style={{ cursor: link.url ? "pointer" : "default" }}
        href={link?.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={async (e) => {
          try {
            logLinkClick(link, user);
          } catch (err) {
            console.error("Error logging link", err);
          }
        }}
      >
        <LazyImage
          className="link-image"
          src={link.imageUrl || placeholderImg}
          alt={link.name}
        />
      </a>
      <div className="link-details">
        <div className="link-name">
          <a href={link?.url}>{link.name}</a>
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
                    <Eye
                      size={18}
                      stroke="#e3dcff"
                      className="link-visibility-toggle"
                    />
                  ) : (
                    <EyeOff
                      size={18}
                      stroke="#e3dcff"
                      className="link-visibility-toggle"
                    />
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
          <a
            className="link-description"
            href={link?.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.description}
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default LinkItem;
