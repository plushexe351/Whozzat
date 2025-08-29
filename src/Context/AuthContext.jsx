import { createContext, useContext, useEffect, useState } from "react";
import { auth, db, doc, getDoc } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let { displayName, email, photoURL, uid } = firebaseUser;

        // Always fetch additional user data from Firestore
        try {
          const userDocRef = doc(db, "users", uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            if (!displayName) displayName = data.username || "";
            if (!photoURL) photoURL = data.profileURL || "";
            const bio = data.bio || "";
            const coverURL = data.coverURL || "";
            setUser({
              displayName,
              email,
              profileURL: photoURL,
              uid,
              bio,
              coverURL,
            });
            setLoading(false);
            return;
          }
        } catch (e) {
          console.log("firebase error:", e);
        }
        setUser({
          displayName,
          email,
          profileURL: photoURL,
          uid,
          bio: "",
          coverURL: "",
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
