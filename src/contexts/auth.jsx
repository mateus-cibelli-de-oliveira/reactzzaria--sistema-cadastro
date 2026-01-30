import { createContext, useEffect, useState, useCallback, useMemo } from "react";
import t from "prop-types";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  GithubAuthProvider,
  signInWithRedirect,
  onAuthStateChanged,
  getRedirectResult,
  signOut
} from "firebase/auth";
import { authCadastro, dbCadastro } from "@/services/firebase";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Processa resultado do redirect assim que o contexto monta
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(authCadastro);
        if (result?.user) {
          setUser(result.user);
        }
      } catch (error) {
        console.error("Erro no processamento do redirect:", error);
      } finally {
        setLoading(false);
      }
    }

    handleRedirectResult();

    const unsubscribe = onAuthStateChanged(authCadastro, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [redirectAfterLogin]);

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
    }

    createUserIfNotExists();
  }, [user]);

  // Login com GitHub (força o logout antes)
  const loginWithGitHub = useCallback(async () => {
    const provider = new GithubAuthProvider();
    try {
      await signOut(authCadastro); // força o logout evitando conflito de tokens
      await signInWithRedirect(authCadastro, provider);
    } catch (error) {
      console.error("Erro no login:", error);
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