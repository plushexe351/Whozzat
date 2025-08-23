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
  setEditModalOpen,
  addToast
) {
  if (!user || !categoryId) return;
  const name = newName.trim();
  if (!name) return;

  const catDoc = doc(db, "users", user.uid, "categories", categoryId);

  await setDoc(catDoc, { name }, { merge: true });

  setCategories((prev) =>
    prev.map((cat) => (cat.id === categoryId ? { ...cat, name } : cat))
  );

  if (setEditModalOpen) setEditModalOpen(false);
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
    createdAt: new Date().toISOString(),
    category: data.category || "",
  };
  const linksCol = collection(db, "users", user.uid, "links");
  const docRef = await addDoc(linksCol, linkData);

  setLinks((prev) =>
    sortLinksByPinnedAndDate([...prev, { ...linkData, id: docRef.id }])
  );
  console.log(data.category);
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
