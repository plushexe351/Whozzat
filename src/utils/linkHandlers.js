import {
  db,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  doc,
  setDoc,
  collection,
  addDoc,
  deleteDoc,
} from "../firebase";

// Shared sorting logic: pinned first, then by updatedAt or createdAt (newest first)
export function sortLinksByPinnedAndDate(links) {
  return links.sort((a, b) => {
    // Pinned first
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;

    // Then by updatedAt if available, else createdAt
    const aDate = new Date(a.updatedAt || a.createdAt || 0);
    const bDate = new Date(b.updatedAt || b.createdAt || 0);
    return bDate - aDate; // newest first
  });
}

export async function handleAddCategory(
  e,
  user,
  newCategory,
  setNewCategory,
  setCategories,
  setCategory,
  addToast
) {
  e.preventDefault();
  const name = newCategory.trim();
  if (!name) return;

  try {
    const catCol = collection(db, "users", user.uid, "categories");

    const docRef = await addDoc(catCol, {
      name,
      createdAt: new Date().toISOString(),
    });

    setCategories((prev) => [
      ...prev,
      { id: docRef.id, name, createdAt: new Date().toISOString() },
    ]);

    addToast(`New category added '${name}'`, "success");
    setCategory(name);
  } catch (err) {
    console.log("Error adding category", err);
    addToast(`Failed to add category '${name}'`, "error");
  }

  setNewCategory("");
}

export async function handleEditCategory(
  categoryId,
  newName,
  user,
  setCategories,
  setCategory,
  onClose,
  addToast
) {
  if (!user || !categoryId) return;
  const name = newName.trim();
  if (!name) return;

  try {
    const catDoc = doc(db, "users", user.uid, "categories", categoryId);

    await setDoc(catDoc, { name }, { merge: true });
    setCategories((prev) =>
      prev.map((cat) => (cat.id === categoryId ? { ...cat, name } : cat))
    );
    addToast(`Category renamed successfully`, "success");
    setCategory(name);
  } catch (err) {
    console.log(`Error editing category : ${name}, Error: ${err}`);
    addToast(`Failed to edit category '${name}'`, "success");
  } finally {
    onClose();
  }
}

export async function handleDeleteCategory(
  categoryId,
  user,
  setCategories,
  setCategory,
  onClose,
  addToast
) {
  if (!categoryId) return;

  try {
    const categoryRef = doc(db, "users", user.uid, "categories", categoryId);

    await deleteDoc(categoryRef);

    // update local state
    setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));

    addToast("Category deleted", "success");
    setCategory("All");
  } catch (err) {
    console.error("Error deleting category", err);
    addToast("Failed to delete category", "error");
  } finally {
    onClose();
  }
}

export async function handleAddLink(data, user, setLinks) {
  if (!user) return;
  let imageUrl = data.imagePreview || "";
  if (data.image) {
    const imageRef = ref(storage, `users/${user.uid}/links/${Date.now()}`);
    await uploadBytes(imageRef, data.image);
    imageUrl = await getDownloadURL(imageRef);
  }
  const linkData = {
    name: data.name,
    url: data.url,
    description: data.description,
    imageUrl,
    pinned: false,
    visibility: true,
    ownerId: user.uid,
    createdAt: new Date().toISOString(),
    category: data.category || "",
  };
  const linksCol = collection(db, "users", user.uid, "links");
  const docRef = await addDoc(linksCol, linkData);

  setLinks((prev) =>
    sortLinksByPinnedAndDate([...prev, { ...linkData, id: docRef.id }])
  );
}

export async function handleEditLink(
  data,
  user,
  setLinks,
  setEditModalOpen,
  setActionMenuId,
  addToast
) {
  if (!user || !data.id) return;
  let imageUrl = data.imageUrl;
  if (data.image) {
    const imageRef = ref(storage, `users/${user.uid}/links/${data.id}`);
    await uploadBytes(imageRef, data.image);
    imageUrl = await getDownloadURL(imageRef);
  }
  const linkData = {
    name: data.name,
    url: data.url,
    description: data.description,
    imageUrl,
    pinned: data.pinned || false,
    visibility: typeof data.visibility === "boolean" ? data.visibility : true,
    ownerId: user.uid,
    updatedAt: new Date().toISOString(),
    category: data.category || "",
  };
  const linkDoc = doc(db, "users", user.uid, "links", data.id);
  await setDoc(linkDoc, linkData, { merge: true });

  setLinks((prev) =>
    sortLinksByPinnedAndDate(
      prev.map((l) => (l.id === data.id ? { ...l, ...linkData } : l))
    )
  );

  setEditModalOpen(false);
  setActionMenuId(null);
}

export async function handleDeleteLink(
  link,
  user,
  setLinks,
  setActionMenuId,
  addToast
) {
  if (!user || !link.id) return;
  const linkDoc = doc(db, "users", user.uid, "links", link.id);
  await deleteDoc(linkDoc);
  setLinks((prev) => prev.filter((l) => l.id !== link.id));
  setActionMenuId(null);
}

export async function handlePinLink(
  link,
  user,
  setLinks,
  setActionMenuId,
  addToast
) {
  if (!user || !link.id) return;
  const linkDoc = doc(db, "users", user.uid, "links", link.id);
  const newPinned = !link.pinned;
  await setDoc(
    linkDoc,
    { pinned: newPinned, updatedAt: new Date().toISOString() },
    { merge: true }
  );

  setLinks((prev) =>
    sortLinksByPinnedAndDate(
      prev.map((l) =>
        l.id === link.id
          ? { ...l, pinned: newPinned, updatedAt: new Date().toISOString() }
          : l
      )
    )
  );

  setActionMenuId(null);
}

export async function handleBookmarkLink(
  link,
  user,
  setLinks,
  setActionMenuId,
  addToast
) {
  if (!user || !link.id) return;
  const linkDoc = doc(db, "users", user.uid, "links", link.id);
  const newBookmarked = !link.bookmarked;
  await setDoc(linkDoc, { bookmarked: newBookmarked }, { merge: true });
  setLinks((prev) =>
    prev.map((l) =>
      l.id === link.id ? { ...l, bookmarked: newBookmarked } : l
    )
  );
  setActionMenuId && setActionMenuId(null);
}

export async function handleToggleVisibility(
  link,
  user,
  setLinks,
  setActionMenuId,
  addToast
) {
  if (!user || !link.id) return;
  const linkDoc = doc(db, "users", user.uid, "links", link.id);
  const newVisibility = !link.visibility;
  await setDoc(
    linkDoc,
    { visibility: newVisibility, updatedAt: new Date().toISOString() },
    { merge: true }
  );
  setLinks((prev) =>
    prev.map((l) =>
      l.id === link.id ? { ...l, visibility: newVisibility } : l
    )
  );
  setActionMenuId && setActionMenuId(null);
}

// Log a click/engagement for a given link. This will create or update an engagements subcollection
// under the link document storing device, userId (if any), timestamp and increment a clicks counter.
export async function logLinkClick(link, viewerUser) {
  if (!link || !link.id) return;
  try {
    // engagement doc under users/{ownerId}/links/{linkId}/engagements/{id}
    // ownerId should be attached on the link object when fetched; fall back to current viewer if missing
    const ownerId = link.ownerId || (viewerUser && viewerUser.uid);
    if (!ownerId) return;

    const engagement = {
      device: detectDeviceType(),
      viewerId: viewerUser ? viewerUser.uid : null,
      viewerName: viewerUser ? viewerUser.displayName || "" : "",
      viewerProfileImage: viewerUser ? viewerUser.profileURL || "" : "",
      timestamp: new Date().toISOString(),
    };

    // store a new engagement document
    const engagementsCol = collection(
      db,
      "users",
      ownerId,
      "links",
      link.id,
      "engagements"
    );
    await addDoc(engagementsCol, engagement);
  } catch (err) {
    console.error("Failed to log link click", err);
  }
}

function detectDeviceType() {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent || "";
  if (/Mobi|Android/i.test(ua)) return "mobile";
  if (/iPad|Tablet/i.test(ua)) return "tablet";
  return "desktop";
}
