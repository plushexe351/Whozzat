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

        // If displayName or photoURL missing, fetch from Firestore
        if (!displayName || !photoURL) {
          try {
            const userDocRef = doc(db, "users", uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              const data = userDocSnap.data();
              if (!displayName) displayName = data.username || "";
              if (!photoURL) photoURL = data.profileURL || "";
            }
          } catch (e) {
            console.log("firebase error:", e);
          }
        }
        setUser({ displayName, email, profileURL: photoURL, uid });
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
