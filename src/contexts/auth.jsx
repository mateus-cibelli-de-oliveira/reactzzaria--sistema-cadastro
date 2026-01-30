import { createContext, useEffect, useState, useCallback, useMemo } from "react";
import t from "prop-types";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  auth,
  GithubAuthProvider,
  signInWithRedirect,
  onAuthStateChanged,
  signOut,
  db
} from "@/services/firebase";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listener de autenticação (login e logout)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Criação do usuário no Firestore (se não existir)
  useEffect(() => {
    if (!user) return;

    //console.log("Criando/verificando usuário:", user.uid);

    const createUserIfNotExists = async () => {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) return;

      await setDoc(userRef, {
        email: user.email,
        name: user.displayName,
        role: "user"
      });
    };

    createUserIfNotExists();
  }, [user]);

  // Login com GitHub
  const loginWithGitHub = useCallback(async () => {
    const provider = new GithubAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Erro no login:", error);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  }, []);

  // Nome formatado do usuário
  const firstName = useMemo(() => {
    return user?.displayName?.split(" ")[0] ?? "";
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        firstName,
        loginWithGitHub,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: t.node.isRequired
}

export { AuthProvider, AuthContext }
