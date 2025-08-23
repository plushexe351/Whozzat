import React, { useState } from "react";
import { useData } from "../../../../Context/DataContext";
import LinkItem from "../../../../Components/LinkItem/LinkItem";
import { AnimatePresence } from "framer-motion";
import AddLinkModal from "../../../../Components/Modals/LinkModal/AddLinkModal";
import EditLinkModal from "../../../../Components/Modals/LinkModal/EditLinkModal";
import {
  handleBookmarkLink,
  handleDeleteLink,
  handlePinLink,
  handleEditLink,
} from "../../../../utils/linkHandlers";
import { useAuth } from "../../../../Context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const { links, setLinks, categories } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [actionMenuId, setActionMenuId] = useState(null);

  return (
    <div>
      <div className="dummy-wrapper">
        <h1>Profile</h1>
      </div>
    </div>
  );
};

export default Profile;
