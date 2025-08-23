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

    // Add user to Firestore if not already present
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);
    if (!userDocSnap.exists()) {
      await setDoc(userDocRef, {
        email,
        profileURL: photoURL,
        username: displayName,
        createdAt: new Date().toISOString(),
      });
    }
    setUser({ displayName, email, profileURL: photoURL, uid });
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
    // const userDocRef = doc(db, "users", uid);
    // const userDocSnap = await getDoc(userDocRef);
    // let displayName = "";
    // let profileURL = "";
    // if (userDocSnap.exists()) {
    //   const data = userDocSnap.data();
    //   displayName = data.username || "";
    //   profileURL = data.profileURL || "";
    // }
    setUser({ displayName, email: userEmail, profileURL: photoURL, uid });
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
      const imageRef = ref(storage, `profileImages/${userCredential.user.uid}`);
      await uploadBytes(imageRef, profileImage);
      photoURL = await getDownloadURL(imageRef);
    }
    await updateProfile(userCredential.user, {
      displayName: username,
      photoURL: photoURL || undefined,
    });
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email,
      profileURL: photoURL,
      username,
      createdAt: new Date().toISOString(),
    });

    // Fetch the updated user from Firebase Auth (to get displayName and photoURL)
    await userCredential.user.reload();
    const refreshedUser = userCredential.user;

    setUser({
      displayName: refreshedUser.displayName || username,
      email: refreshedUser.email,
      profileURL: refreshedUser.photoURL || photoURL,
      uid: refreshedUser.uid,
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
    addToast("Logged out successfully !", "success");
  } catch (error) {
    console.log("Sign out error:", error);
    addToast("Error logging out", "error");
  }
};
