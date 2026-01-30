import { createContext, useEffect, useState, useCallback, useMemo } from "react";
import t from "prop-types";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  GithubAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { authCadastro, dbCadastro } from "@/services/firebase";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listener de autenticação (login e logout)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authCadastro, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Criação do usuário no Firestore (se não existir)
  useEffect(() => {
    if (!user) return;

    const createUserIfNotExists = async () => {
      const userRef = doc(dbCadastro, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) return;

      await setDoc(userRef, {
        email: user.email,
        name: user.displayName,
        role: "user",
      });
    };

    createUserIfNotExists();
  }, [user]);

  // Login com GitHub usando popup
  const loginWithGitHub = useCallback(async () => {
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(authCadastro, provider);
      setUser(result.user); // atualiza o usuário imediatamente
    } catch (error) {
      console.error("Erro no login com popup:", error);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await signOut(authCadastro);
      setUser(null);
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  }, []);

  // Primeiro nome do usuário
  const firstName = useMemo(() => user?.displayName?.split(" ")[0] ?? "", [user]);

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

export { AuthProvider, AuthContext };