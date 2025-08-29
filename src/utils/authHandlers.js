import { signOut } from "firebase/auth";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  updateProfile,
  db,
  doc,
  setDoc,
  getDoc,
} from "../firebase";

// Google Sign In
export const handleGoogleSignIn = async (
  setUser,
  navigate,
  setError,
  setLoading,
  addToast
) => {
  try {
    setLoading(true);
    const result = await signInWithPopup(auth, googleProvider);
    const { displayName, email, photoURL, uid } = result.user;

    // Ensure Firestore user exists; fetch coverURL and bio
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);
    let firestoreData = {};
    if (!userDocSnap.exists()) {
      await setDoc(userDocRef, {
        email,
        profileURL: photoURL || "",
        username: displayName || "",
        coverURL: "",
        bio: "",
        createdAt: new Date().toISOString(),
      });
      firestoreData = { coverURL: "", bio: "" };
    } else {
      firestoreData = userDocSnap.data() || {};
    }

    setUser({
      displayName,
      email,
      profileURL: photoURL || firestoreData.profileURL || "",
      uid,
      bio: firestoreData.bio || "",
      coverURL: firestoreData.coverURL || "",
    });
    addToast(`Welcome, ${displayName}!`, "success");
    navigate("/home");
  } catch (err) {
    setError(err.message);
    addToast("Error Signing in with Google", "error");
  } finally {
    setLoading(false);
  }
};

// Email/Password Sign In
export const handleEmailSignIn = async (
  e,
  email,
  password,
  setUser,
  navigate,
  setError,
  setLoading,
  addToast
) => {
  e.preventDefault();

  try {
    setLoading(true);
    const result = await signInWithEmailAndPassword(auth, email, password);
    const { displayName, photoURL, uid, email: userEmail } = result.user;

    // Fetch Firestore user to include coverURL and bio
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);
    let firestoreData = {};
    if (!userDocSnap.exists()) {
      await setDoc(userDocRef, {
        email: userEmail,
        profileURL: photoURL || "",
        username: displayName || "",
        coverURL: "",
        bio: "",
        createdAt: new Date().toISOString(),
      });
      firestoreData = { coverURL: "", bio: "" };
    } else {
      firestoreData = userDocSnap.data() || {};
    }

    setUser({
      displayName,
      email: userEmail,
      profileURL: photoURL || firestoreData.profileURL || "",
      uid,
      bio: firestoreData.bio || "",
      coverURL: firestoreData.coverURL || "",
    });
    addToast(`Welcome, ${displayName}!`, "success");

    navigate("/home");
  } catch (err) {
    setError(err.message);
    addToast("Error Signing in with email and password", "error");
    console.log(err);
  } finally {
    setLoading(false);
  }
};

// Sign Up
export const handleSignUp = async (
  e,
  email,
  password,
  username,
  profileImage,
  setUser,
  navigate,
  setError,
  setLoading,
  addToast
) => {
  e.preventDefault();
  setLoading(true);
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    let photoURL = null;
    if (profileImage) {
      const imageRef = ref(
        storage,
        `profile-images/${userCredential.user.uid}`
      );
      await uploadBytes(imageRef, profileImage);
      photoURL = await getDownloadURL(imageRef);
    }
    await updateProfile(userCredential.user, {
      displayName: username,
      photoURL: photoURL || undefined,
    });
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email,
      profileURL: photoURL || "",
      username,
      coverURL: "",
      bio: "",
      createdAt: new Date().toISOString(),
    });

    // Fetch the updated user from Firebase Auth (to get displayName and photoURL)
    await userCredential.user.reload();
    const refreshedUser = userCredential.user;

    setUser({
      displayName: refreshedUser.displayName || username,
      email: refreshedUser.email,
      profileURL: refreshedUser.photoURL || photoURL || "",
      uid: refreshedUser.uid,
      bio: "",
      coverURL: "",
    });

    addToast(
      `Welcome ${refreshedUser.displayName || username || ""}!`,
      "success"
    );

    navigate("/home");
  } catch (err) {
    setError(err.message);
    addToast("Error Signing Up", "error");
    console.log(err.message);
  } finally {
    setLoading(false);
  }
};

// Image Change
export const handleImageChange = (e, setProfileImage, setProfilePreview) => {
  const file = e.target.files[0];
  if (file) {
    setProfileImage(file);
    setProfilePreview(URL.createObjectURL(file));
  }
};

// Sign Out
export const handleSignOut = async (addToast) => {
  try {
    await signOut(auth);
  } catch (error) {
    // ignore
  } finally {
    addToast("Logged out successfully !", "success");
  }
};
